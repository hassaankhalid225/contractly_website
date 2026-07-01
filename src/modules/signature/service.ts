import "server-only";
import { prisma } from "@/lib/prisma";
import { randomToken, absoluteUrl } from "@/lib/utils";
import { sendEmail } from "@/lib/email";
import { putFile, getFile } from "@/lib/storage";
import { buildSignedPdf } from "./pdf";
import { signatureRequestEmail, signedCopyEmail } from "./emails";

/** Creates (or replaces) a signature request and records the freelancer's signature. */
export async function createSignatureRequest(opts: {
  userId: string;
  contractId: string;
  signerName: string;
  signerEmail: string;
  message?: string;
  deadlineDays?: number;
  freelancerName: string;
  freelancerSignature?: { name: string; method: string; imageData?: string };
}) {
  const contract = await prisma.contract.findFirst({ where: { id: opts.contractId, userId: opts.userId } });
  if (!contract) throw new Error("Contract not found");

  const token = randomToken(20);
  const deadline = opts.deadlineDays
    ? new Date(Date.now() + opts.deadlineDays * 86400000)
    : new Date(Date.now() + 30 * 86400000);

  // Replace any prior request for this contract.
  await prisma.signatureRequest.deleteMany({ where: { contractId: opts.contractId } });

  const request = await prisma.signatureRequest.create({
    data: {
      contractId: opts.contractId,
      token,
      signerName: opts.signerName,
      signerEmail: opts.signerEmail,
      message: opts.message,
      deadline,
      status: "pending",
      fields: {
        create: [
          { role: "freelancer", type: "signature", page: 1, x: 0.1, y: 0.1 },
          { role: "client", type: "signature", page: 1, x: 0.55, y: 0.1 },
        ],
      },
    },
  });

  // Freelancer signs first (Flow 4, step 4).
  if (opts.freelancerSignature) {
    await prisma.signature.create({
      data: {
        requestId: request.id,
        signerRole: "freelancer",
        signerName: opts.freelancerSignature.name,
        method: opts.freelancerSignature.method,
        imageData: opts.freelancerSignature.imageData,
      },
    });
  }

  await prisma.contract.update({ where: { id: opts.contractId }, data: { status: "awaiting_signature" } });

  const signUrl = absoluteUrl(`/sign/${token}`);
  await sendEmail(
    signatureRequestEmail({
      to: opts.signerEmail,
      signerName: opts.signerName,
      freelancerName: opts.freelancerName,
      contractTitle: contract.title,
      message: opts.message,
      signUrl,
    }),
  );

  return { token, signUrl };
}

export function getSignatureByToken(token: string) {
  return prisma.signatureRequest.findUnique({
    where: { token },
    include: {
      signatures: true,
      contract: { include: { user: { select: { name: true, photoUrl: true, email: true } } } },
    },
  });
}

export async function recordView(token: string) {
  await prisma.signatureRequest.updateMany({
    where: { token, status: "pending" },
    data: { status: "viewed", viewedAt: new Date() },
  });
}

/**
 * Records the client's signature, finalizes the contract: builds the signed PDF,
 * stores it, marks everything signed, and emails the signed copy to both parties.
 */
export async function recordClientSignature(opts: {
  token: string;
  name: string;
  email: string;
  method: "draw" | "type" | "upload";
  imageData?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const req = await getSignatureByToken(opts.token);
  if (!req) throw new Error("Invalid link");
  if (req.status === "signed") return { alreadySigned: true as const };
  if (req.status === "revoked") throw new Error("This link has been revoked.");
  if (req.deadline && req.deadline < new Date()) throw new Error("This link has expired.");

  await prisma.signature.create({
    data: {
      requestId: req.id,
      signerRole: "client",
      signerName: opts.name,
      method: opts.method,
      imageData: opts.imageData,
      ipAddress: opts.ipAddress,
      userAgent: opts.userAgent,
    },
  });

  const signatures = await prisma.signature.findMany({ where: { requestId: req.id } });

  const pdf = await buildSignedPdf({
    title: req.contract.title,
    freelancerName: req.contract.user.name,
    clientName: req.signerName,
    bodyText: htmlToText(req.contract.bodyHtml || req.contract.contentText || ""),
    signatures: signatures.map((s) => ({
      role: s.signerRole,
      name: s.signerName,
      imageData: s.imageData,
      signedAt: s.signedAt,
      ipAddress: s.ipAddress,
    })),
  });

  const key = `signed/${req.contractId}-${req.token}.pdf`;
  await putFile(key, pdf, "application/pdf");

  await prisma.$transaction([
    prisma.signatureRequest.update({
      where: { id: req.id },
      data: { status: "signed", signedAt: new Date(), signedPdfKey: key },
    }),
    prisma.contract.update({ where: { id: req.contractId }, data: { status: "signed" } }),
  ]);

  const dl = absoluteUrl(`/api/files/${key}`);
  for (const to of [req.contract.user.email, opts.email]) {
    await sendEmail(
      signedCopyEmail({ to, contractTitle: req.contract.title, downloadUrl: dl, pdf }),
    );
  }

  return { alreadySigned: false as const, freelancerName: req.contract.user.name };
}

export async function revokeSignature(userId: string, contractId: string) {
  const req = await prisma.signatureRequest.findUnique({ where: { contractId }, include: { contract: true } });
  if (!req || req.contract.userId !== userId) return;
  await prisma.signatureRequest.update({ where: { id: req.id }, data: { status: "revoked" } });
  await prisma.contract.update({ where: { id: contractId }, data: { status: "draft" } });
}

export async function getSignedPdf(key: string) {
  return getFile(key);
}

/** Minimal HTML → text for PDF rendering (no DOM in node server actions). */
function htmlToText(html: string): string {
  return html
    .replace(/<\/(h[1-6]|p|li|div)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
