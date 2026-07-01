"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireUser } from "@/lib/session";
import { createSignatureRequest, recordClientSignature, revokeSignature } from "./service";

/** Flow 4: freelancer signs and sends the contract to the client. */
export async function requestSignatureAction(formData: FormData) {
  const user = await requireUser();
  const contractId = String(formData.get("contractId"));
  const signerName = String(formData.get("signerName") || "").trim();
  const signerEmail = String(formData.get("signerEmail") || "").trim();
  if (!contractId || !signerName || !signerEmail) {
    redirect(`/contracts/${contractId}/send?error=missing`);
  }

  await createSignatureRequest({
    userId: user.id,
    contractId,
    signerName,
    signerEmail,
    message: String(formData.get("message") || "") || undefined,
    deadlineDays: Number(formData.get("deadlineDays")) || 30,
    freelancerName: user.name,
    freelancerSignature: {
      name: user.name,
      method: "type",
      imageData: String(formData.get("freelancerSignature") || "") || undefined,
    },
  });

  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}?sent=1`);
}

export type ClientSignState = { error?: string; ok?: boolean; freelancerName?: string };

/** Flow 5: the public, no-login client signing action (useFormState signature). */
export async function clientSignAction(_prev: ClientSignState, formData: FormData): Promise<ClientSignState> {
  const token = String(formData.get("token"));
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const method = (String(formData.get("method") || "type") as "draw" | "type" | "upload");
  const imageData = String(formData.get("imageData") || "") || undefined;
  if (!name || !email) return { error: "Please enter your name and email." };

  const h = headers();
  try {
    const result = await recordClientSignature({
      token, name, email, method, imageData,
      ipAddress: h.get("x-forwarded-for")?.split(",")[0] ?? "unknown",
      userAgent: h.get("user-agent") ?? undefined,
    });
    return { ok: true, freelancerName: result.alreadySigned ? undefined : result.freelancerName };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function revokeSignatureAction(contractId: string) {
  const user = await requireUser();
  await revokeSignature(user.id, contractId);
  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}
