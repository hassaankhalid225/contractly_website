import "server-only";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

/** Feature-gating decisions derived from a user's (DB-backed) plan. */
export type Gate = { allowed: boolean; reason?: string };

/** All active plans, ordered for display. Admin-editable. */
export function listPlans(opts: { activeOnly?: boolean } = { activeOnly: true }) {
  return prisma.plan.findMany({
    where: opts.activeOnly ? { active: true } : {},
    orderBy: { order: "asc" },
  });
}

export async function getPlanRow(id: string): Promise<Plan | null> {
  return prisma.plan.findUnique({ where: { id } });
}

/** Resolves the user's plan, falling back to the Free plan. */
async function planFor(user: { plan: string }): Promise<Plan | null> {
  return (await getPlanRow(user.plan)) ?? (await getPlanRow("free"));
}

export function isUnlimited(contractLimit: number) {
  return contractLimit < 0;
}

/** Can this user create another contract? Driven by the plan's contractLimit. */
export async function canCreateContract(user: { id: string; plan: string }): Promise<Gate> {
  const plan = await planFor(user);
  if (!plan || isUnlimited(plan.contractLimit)) return { allowed: true };
  const count = await prisma.contract.count({
    where: { userId: user.id, status: { in: ["active", "awaiting_signature", "signed", "draft"] } },
  });
  if (count >= plan.contractLimit) {
    return {
      allowed: false,
      reason: `Your ${plan.name} plan is limited to ${plan.contractLimit} contracts. Upgrade for more.`,
    };
  }
  return { allowed: true };
}

/** AI scan is gated by the plan's aiScan flag. */
export async function canUseAiScan(user: { plan: string }): Promise<Gate> {
  const plan = await planFor(user);
  return plan?.aiScan
    ? { allowed: true }
    : { allowed: false, reason: "AI contract analysis is a Solo feature. Upgrade to unlock it." };
}

export async function canAddTeam(user: { plan: string }): Promise<Gate> {
  const plan = await planFor(user);
  return (plan?.teamSeats ?? 0) > 1
    ? { allowed: true }
    : { allowed: false, reason: "Team seats are available on the Agency plan." };
}

/** Feature bullets derived from plan flags (for pricing UI). */
export function planFeatures(plan: Plan): string[] {
  const f: string[] = [];
  f.push(isUnlimited(plan.contractLimit) ? "Unlimited contracts" : `${plan.contractLimit} active contracts`);
  f.push(plan.aiScan ? "AI contract scanner" : "Manual review");
  if (plan.aiScan) f.push("E-signature & smart reminders");
  if (plan.teamSeats > 1) f.push(`${plan.teamSeats} team seats`);
  if (plan.whiteLabel) f.push("White-label client portal");
  return f;
}
