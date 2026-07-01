"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { putFile } from "@/lib/storage";
import { randomToken } from "@/lib/utils";
import { MAX_UPLOAD_BYTES, ACCEPTED_UPLOAD_MIME } from "@/lib/constants";
import { canCreateContract, canUseAiScan } from "@/modules/billing/plan";
import { analyzeContract, generateContract } from "@/modules/ai/client";
import { extractText, metadataText } from "./extract-text";
import { createContract, saveAnalysis, seedExpiryReminders, setStatus, deleteContract as repoDelete } from "./repository";

/** Flow 2: upload a file, store it, extract text, and run AI analysis. */
export async function uploadContractAction(formData: FormData) {
  const user = await requireUser();

  const gate = await canCreateContract(user);
  if (!gate.allowed) redirect("/upgrade?reason=contract_limit");

  const file = formData.get("file") as File | null;
  const title = String(formData.get("title") || "").trim();
  const clientName = String(formData.get("clientName") || "").trim();
  if (!file || !title || !clientName) redirect("/contracts/new/upload?error=missing");
  if (file.size > MAX_UPLOAD_BYTES) redirect("/contracts/new/upload?error=too_large");
  if (!ACCEPTED_UPLOAD_MIME.includes(file.type)) redirect("/contracts/new/upload?error=type");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "bin";
  const key = `uploads/${user.id}/${randomToken(8)}.${ext}`;
  await putFile(key, buffer, file.type);

  const value = Number(formData.get("value")) || undefined;
  const currency = String(formData.get("currency") || user.defaultCurrency);
  const startDate = parseDate(formData.get("startDate"));
  const endDate = parseDate(formData.get("endDate"));

  let contentText = await extractText(buffer, file.type);
  if (!contentText) contentText = metadataText({ title, clientName, value, currency });

  const contract = await createContract(user.id, {
    title, clientName,
    clientEmail: String(formData.get("clientEmail") || "") || undefined,
    value, currency, startDate, endDate,
    status: "active", source: "upload",
    fileKey: key, fileName: file.name, fileMime: file.type, contentText,
  });

  if (endDate) await seedExpiryReminders(user.id, contract.id, endDate);

  // Run AI analysis for Solo+ users; gate Free users at the results screen.
  if ((await canUseAiScan(user)).allowed) {
    const { analysis, model } = await analyzeContract(contentText);
    await saveAnalysis(contract.id, analysis, model);
  }

  revalidatePath("/contracts");
  redirect(`/contracts/${contract.id}/analysis`);
}

/** Re-run (or first-run) AI analysis on an existing contract. */
export async function runAnalysisAction(contractId: string) {
  const user = await requireUser();
  if (!(await canUseAiScan(user)).allowed) redirect("/upgrade?reason=ai_scan");
  const contract = await prisma.contract.findFirst({ where: { id: contractId, userId: user.id } });
  if (!contract) redirect("/contracts");
  const { analysis, model } = await analyzeContract(contract.contentText || contract.bodyHtml || contract.title);
  await saveAnalysis(contract.id, analysis, model);
  revalidatePath(`/contracts/${contractId}/analysis`);
  redirect(`/contracts/${contractId}/analysis`);
}

const templateSchema = z.object({
  workType: z.string().min(1),
  clientName: z.string().min(1),
  clientEmail: z.string().optional(),
  projectTitle: z.string().min(1),
  scope: z.string().default(""),
  amount: z.coerce.number().default(0),
  currency: z.string().default("USD"),
  paymentSchedule: z.string().default("split_50_50"),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
});

/** Flow 3: generate a contract from a template using AI. */
export async function createFromTemplateAction(formData: FormData) {
  const user = await requireUser();
  const gate = await canCreateContract(user);
  if (!gate.allowed) redirect("/upgrade?reason=contract_limit");

  const input = templateSchema.parse(Object.fromEntries(formData));
  const { contract: generated } = await generateContract(input);

  const contract = await createContract(user.id, {
    title: generated.title,
    clientName: input.clientName,
    clientEmail: input.clientEmail || undefined,
    value: input.amount || undefined,
    currency: input.currency,
    startDate: parseDate(input.startDate),
    endDate: parseDate(input.deadline),
    status: "draft",
    source: "template",
    bodyHtml: generated.bodyHtml,
    contentText: generated.bodyHtml.replace(/<[^>]+>/g, " "),
    workType: input.workType,
    paymentSchedule: input.paymentSchedule,
  });

  revalidatePath("/contracts");
  redirect(`/contracts/${contract.id}`);
}

/** Flow 3 (fast path): create a contract instantly from a built-in template. */
export async function createFromBuiltinTemplateAction(formData: FormData) {
  const user = await requireUser();
  const gate = await canCreateContract(user);
  if (!gate.allowed) redirect("/upgrade?reason=contract_limit");

  const { getTemplateById } = await import("./templates/service");
  const { renderTemplate } = await import("./templates/render");

  const templateId = String(formData.get("templateId") || "");
  const template = await getTemplateById(templateId);
  if (!template) redirect("/contracts/new/template");

  // Collect every field value (standard + template-specific).
  const values: Record<string, string> = { freelancerName: user.name };
  for (const [k, v] of formData.entries()) {
    if (k !== "templateId") values[k] = String(v);
  }
  values.currency = values.currency || user.defaultCurrency;
  values.paymentSchedule = values.paymentSchedule || template.paymentSchedule;
  values.scope = values.scope || template.scopeDefault;

  const { title, bodyHtml } = renderTemplate(template, values as never);

  const contract = await createContract(user.id, {
    title,
    clientName: values.clientName || "Client",
    clientEmail: values.clientEmail || undefined,
    value: values.amount ? Number(values.amount) : undefined,
    currency: values.currency,
    startDate: parseDate(values.startDate),
    endDate: parseDate(values.deadline),
    status: "draft",
    source: "template",
    bodyHtml,
    contentText: bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    workType: template.workType,
    paymentSchedule: values.paymentSchedule,
  });

  if (contract.endDate) await seedExpiryReminders(user.id, contract.id, contract.endDate);

  revalidatePath("/contracts");
  redirect(`/contracts/${contract.id}`);
}

export async function archiveContractAction(contractId: string) {
  const user = await requireUser();
  await setStatus(user.id, contractId, "archived");
  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function deleteContractAction(contractId: string) {
  const user = await requireUser();
  await repoDelete(user.id, contractId);
  revalidatePath("/contracts");
  redirect("/contracts");
}

/** Add a payment line to a contract (used for earnings tracking). */
export async function addPaymentAction(formData: FormData) {
  const user = await requireUser();
  const contractId = String(formData.get("contractId"));
  const contract = await prisma.contract.findFirst({ where: { id: contractId, userId: user.id } });
  if (!contract) redirect("/contracts");
  await prisma.payment.create({
    data: {
      userId: user.id,
      contractId,
      label: String(formData.get("label") || "") || null,
      amount: Number(formData.get("amount")) || 0,
      currency: contract.currency,
      dueDate: parseDate(formData.get("dueDate")),
      status: "pending",
    },
  });
  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function markPaymentPaidAction(paymentId: string, contractId: string) {
  const user = await requireUser();
  await prisma.payment.updateMany({
    where: { id: paymentId, userId: user.id },
    data: { status: "paid", paidDate: new Date() },
  });
  revalidatePath(`/contracts/${contractId}`);
  revalidatePath("/earnings");
}

function parseDate(v: FormDataEntryValue | string | null | undefined): Date | undefined {
  if (!v) return undefined;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
}
