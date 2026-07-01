import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, TrendingUp, Clock, AlertCircle, Download } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getEarnings } from "@/modules/earnings/service";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/modules/contracts/ui";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { EarningsChart } from "@/modules/earnings/earnings-chart";
import { formatMoney, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Earnings" };

export default async function EarningsPage() {
  const user = await requireUser();
  const e = await getEarnings(user.id, user.defaultCurrency);

  return (
    <div>
      <PageHeader
        title="Earnings"
        description={`All amounts shown in ${e.currency}.`}
        action={
          <a href="/api/earnings/export">
            <Button variant="outline"><Download className="h-4 w-4" /> Export CSV</Button>
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total earned" amount={e.totalEarned} currency={e.currency} tone="success" icon={Wallet} />
        <StatCard label="This month" amount={e.thisMonth} currency={e.currency} icon={TrendingUp} />
        <StatCard label="Pending" amount={e.pending} currency={e.currency} tone="warning" icon={Clock} />
        <StatCard label="Overdue" amount={e.overdue} currency={e.currency} tone="error" icon={AlertCircle} />
      </div>

      <Card className="mt-6 p-3u">
        <h2 className="mb-2 text-lg font-semibold text-ink">Last 6 months</h2>
        <EarningsChart data={e.monthly} currency={e.currency} />
      </Card>

      <h2 className="mb-3 mt-6 text-lg font-semibold text-ink">By contract</h2>
      {e.byContract.length === 0 ? (
        <p className="card p-3u text-sm text-ink-secondary">No contracts yet.</p>
      ) : (
        <Card className="divide-y divide-black/[0.06]">
          {e.byContract.map((c) => (
            <Link key={c.id} href={`/contracts/${c.id}`} className="flex items-center justify-between gap-3 p-3u hover:bg-surface-subtle">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{c.title}</p>
                <p className="truncate text-sm text-ink-secondary">
                  {c.clientName} · paid {formatMoney(c.paid, c.currency)} of {formatMoney(c.value, c.currency)}
                  {c.nextDue ? ` · next due ${formatDate(c.nextDue)}` : ""}
                </p>
              </div>
              <PaymentStatusBadge status={c.status === "signed" ? "paid" : c.paid >= c.value && c.value > 0 ? "paid" : "pending"} />
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
