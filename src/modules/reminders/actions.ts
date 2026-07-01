"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { addReminder, snoozeReminder, completeReminder, deleteReminder } from "./repository";

export async function addReminderAction(formData: FormData) {
  const user = await requireUser();
  const contractId = String(formData.get("contractId"));
  const remindAt = new Date(String(formData.get("remindAt")));
  if (isNaN(remindAt.getTime())) redirect(`/contracts/${contractId}?error=date`);
  await addReminder(user.id, {
    contractId,
    label: String(formData.get("label") || "Reminder"),
    remindAt,
    channelEmail: formData.get("channelEmail") === "on",
    channelPush: formData.get("channelPush") === "on",
    clientNudge: formData.get("clientNudge") === "on",
  });
  revalidatePath("/reminders");
  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function snoozeReminderAction(id: string, days: number) {
  const user = await requireUser();
  await snoozeReminder(user.id, id, days);
  revalidatePath("/reminders");
}

export async function completeReminderAction(id: string) {
  const user = await requireUser();
  await completeReminder(user.id, id);
  revalidatePath("/reminders");
}

export async function deleteReminderAction(id: string) {
  const user = await requireUser();
  await deleteReminder(user.id, id);
  revalidatePath("/reminders");
}
