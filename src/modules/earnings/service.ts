import "server-only";
import { prisma } from "@/lib/prisma";
import { toUsd } from "@/lib/utils";

export type EarningsSummary = {
  currency: string;
  totalEarned: number;
  thisMonth: number;
  pending: number;
  overdue: number;
  monthly: { month: string; amount: number }[];
  byContract: {
    id: string;
    title: string;
    clientName: string;
    value: number;
    currency: string;
    paid: number;
    nextDue: Date | null;
    status: string;
  }[];
};

/**
 * Aggregates earnings across all of a user's contracts, converting every amount
 * into the user's default currency for headline figures. Conversion uses the
 * static indicative FX table (see lib/constants → FX_TO_USD).
 */
export async function getEarnings(userId: string, displayCurrency: string): Promise<EarningsSummary> {
  const [payments, contracts] = await Promise.all([
    prisma.payment.findMany({ where: { userId } }),
    prisma.contract.findMany({
      where: { userId },
      include: { payments: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const fxRate = toUsd(1, displayCurrency); // USD per 1 unit of display currency
  const toDisplay = (amount: number, currency: string) => toUsd(amount, currency) / fxRate;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalEarned = 0;
  let thisMonth = 0;
  let pending = 0;
  let overdue = 0;

  for (const p of payments) {
    const amt = toDisplay(p.amount, p.currency);
    if (p.status === "paid") {
      totalEarned += amt;
      if (p.paidDate && p.paidDate >= monthStart) thisMonth += amt;
    } else if (p.status === "overdue") {
      overdue += amt;
    } else {
      pending += amt;
    }
  }

  // Last 6 months of paid income.
  const monthly: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const amount = payments
      .filter((p) => p.status === "paid" && p.paidDate && p.paidDate >= d && p.paidDate < next)
      .reduce((s, p) => s + toDisplay(p.amount, p.currency), 0);
    monthly.push({ month: d.toLocaleDateString("en-US", { month: "short" }), amount: Math.round(amount) });
  }

  const byContract = contracts.map((c) => {
    const paid = c.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const nextDue = c.payments
      .filter((p) => p.status !== "paid" && p.dueDate)
      .map((p) => p.dueDate!)
      .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;
    return {
      id: c.id,
      title: c.title,
      clientName: c.clientName,
      value: c.value ?? 0,
      currency: c.currency,
      paid,
      nextDue,
      status: c.status,
    };
  });

  return {
    currency: displayCurrency,
    totalEarned: Math.round(totalEarned),
    thisMonth: Math.round(thisMonth),
    pending: Math.round(pending),
    overdue: Math.round(overdue),
    monthly,
    byContract,
  };
}

/** CSV export of all payments for tax/reporting. */
export async function earningsCsv(userId: string): Promise<string> {
  const payments = await prisma.payment.findMany({
    where: { userId },
    include: { contract: { select: { title: true, clientName: true } } },
    orderBy: { createdAt: "desc" },
  });
  const rows = [
    ["Contract", "Client", "Label", "Amount", "Currency", "Status", "Due Date", "Paid Date"],
    ...payments.map((p) => [
      p.contract.title,
      p.contract.clientName,
      p.label ?? "",
      String(p.amount),
      p.currency,
      p.status,
      p.dueDate?.toISOString().slice(0, 10) ?? "",
      p.paidDate?.toISOString().slice(0, 10) ?? "",
    ]),
  ];
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}
