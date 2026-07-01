import "server-only";
import { prisma } from "@/lib/prisma";

export function listReminders(userId: string) {
  return prisma.reminder.findMany({
    where: { userId, status: { in: ["scheduled", "snoozed"] } },
    orderBy: { remindAt: "asc" },
    include: { contract: { select: { id: true, title: true, clientName: true } } },
  });
}

export function upcomingCount(userId: string) {
  return prisma.reminder.count({
    where: { userId, status: { in: ["scheduled", "snoozed"] }, remindAt: { gte: new Date(Date.now() - 86400000) } },
  });
}

export async function addReminder(userId: string, data: {
  contractId: string;
  label: string;
  type?: string;
  remindAt: Date;
  channelEmail?: boolean;
  channelPush?: boolean;
  clientNudge?: boolean;
}) {
  // Ensure the contract belongs to the user before attaching a reminder.
  const owns = await prisma.contract.findFirst({ where: { id: data.contractId, userId }, select: { id: true } });
  if (!owns) throw new Error("Contract not found");
  return prisma.reminder.create({ data: { userId, type: "milestone", ...data } });
}

export async function snoozeReminder(userId: string, id: string, days: number) {
  const r = await prisma.reminder.findFirst({ where: { id, userId } });
  if (!r) return;
  await prisma.reminder.update({
    where: { id },
    data: { remindAt: new Date(Date.now() + days * 86400000), status: "snoozed" },
  });
}

export async function completeReminder(userId: string, id: string) {
  await prisma.reminder.updateMany({ where: { id, userId }, data: { status: "done" } });
}

export async function deleteReminder(userId: string, id: string) {
  await prisma.reminder.deleteMany({ where: { id, userId } });
}
