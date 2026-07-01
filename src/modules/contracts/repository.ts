import "server-only";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { EXPIRY_REMINDER_OFFSETS } from "@/lib/constants";
import type { Analysis } from "@/modules/ai/types";

export type ContractListItem = Awaited<ReturnType<typeof listContracts>>[number];

export function listContracts(userId: string, opts: { status?: string; q?: string } = {}) {
  return prisma.contract.findMany({
    where: {
      userId,
      ...(opts.status && opts.status !== "all" ? { status: opts.status } : {}),
      ...(opts.q
        ? { OR: [{ title: { contains: opts.q } }, { clientName: { contains: opts.q } }] }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { analysis: { select: { riskLevel: true, riskScore: true } }, signatureRequest: { select: { status: true } } },
  });
}

export function getContract(userId: string, id: string) {
  return prisma.contract.findFirst({
    where: { id, userId },
    include: {
      analysis: true,
      signatureRequest: { include: { fields: true, signatures: true } },
      reminders: { orderBy: { remindAt: "asc" } },
      payments: { orderBy: { dueDate: "asc" } },
    },
  });
}

export async function createContract(userId: string, data: {
  title: string;
  clientName: string;
  clientEmail?: string;
  value?: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  source: "upload" | "template";
  fileKey?: string;
  fileName?: string;
  fileMime?: string;
  contentText?: string;
  bodyHtml?: string;
  workType?: string;
  paymentSchedule?: string;
}) {
  return prisma.contract.create({ data: { userId, ...data, status: data.status ?? "draft" } });
}

/** Persists an AI analysis result for a contract (replaces any prior one). */
export async function saveAnalysis(contractId: string, analysis: Analysis, model: string) {
  const payload = {
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    summary: analysis.summary,
    clausesJson: JSON.stringify(analysis.clauses),
    missingJson: JSON.stringify(analysis.missingClauses),
    redFlagsJson: JSON.stringify(analysis.redFlags),
    paymentTermsJson: JSON.stringify(analysis.paymentTerms),
    model,
  };
  return prisma.contractAnalysis.upsert({
    where: { contractId },
    create: { contractId, ...payload },
    update: payload,
  });
}

/** Decodes a stored ContractAnalysis row back into the rich Analysis shape. */
export function decodeAnalysis(row: {
  riskScore: number;
  riskLevel: string;
  summary: string;
  clausesJson: string;
  missingJson: string;
  redFlagsJson: string;
  paymentTermsJson: string;
}): Analysis {
  return {
    riskScore: row.riskScore,
    riskLevel: row.riskLevel as Analysis["riskLevel"],
    summary: row.summary,
    clauses: parseJson(row.clausesJson, []),
    missingClauses: parseJson(row.missingJson, []),
    redFlags: parseJson(row.redFlagsJson, []),
    paymentTerms: parseJson(row.paymentTermsJson, {}),
  };
}

/** Creates the default expiry reminder ladder (30/14/7/1 days) for a contract. */
export async function seedExpiryReminders(userId: string, contractId: string, endDate: Date) {
  const now = Date.now();
  const rows = EXPIRY_REMINDER_OFFSETS.map((days) => ({
    userId,
    contractId,
    label: `Contract expires in ${days} day${days === 1 ? "" : "s"}`,
    type: "expiry",
    remindAt: new Date(endDate.getTime() - days * 86400000),
  })).filter((r) => r.remindAt.getTime() > now);
  if (rows.length) await prisma.reminder.createMany({ data: rows });
}

export async function setStatus(userId: string, contractId: string, status: string) {
  await prisma.contract.updateMany({ where: { id: contractId, userId }, data: { status } });
}

export async function deleteContract(userId: string, contractId: string) {
  await prisma.contract.deleteMany({ where: { id: contractId, userId } });
}
