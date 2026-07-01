import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Wallet, TrendingUp, Clock, AlertCircle, ArrowRight, Bell } from "lucide-react";
import { requireUser } from "@/lib/session";
import { listContracts } from "@/modules/contracts/repository";
import { listReminders } from "@/modules/reminders/repository";
import { getEarnings } from "@/modules/earnings/service";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ContractCard, StatCard } from "@/modules/contracts/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/motion";
import { formatDate, daysUntil } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const [contracts, reminders, earnings] = await Promise.all([
    listContracts(user.id),
    listReminders(user.id),
    getEarnings(user.id, user.defaultCurrency),
  ]);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]} 👋`}
        description="Here's what's happening with your contracts."
        action={<Link href="/contracts/new"><Button><Plus className="h-4 w-4" /> Add Contract</Button></Link>}
      />

      {contracts.length === 0 ? (
        <FadeIn>
          <EmptyState
            icon="📄"
            title="Add your first contract"
            description="Upload an existing contract for AI analysis, or generate a new one from a template."
            action={<Link href="/contracts/new"><Button size="lg"><Plus className="h-4 w-4" /> Add your first contract</Button></Link>}
          />
        </FadeIn>
      ) : (
        <>
          <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StaggerItem><StatCard label="Total earned" amount={earnings.totalEarned} currency={earnings.currency} tone="success" icon={Wallet} /></StaggerItem>
            <StaggerItem><StatCard label="This month" amount={earnings.thisMonth} currency={earnings.currency} icon={TrendingUp} /></StaggerItem>
            <StaggerItem><StatCard label="Pending" amount={earnings.pending} currency={earnings.currency} tone="warning" icon={Clock} /></StaggerItem>
            <StaggerItem><StatCard label="Overdue" amount={earnings.overdue} currency={earnings.currency} tone="error" icon={AlertCircle} /></StaggerItem>
          </Stagger>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <FadeIn delay={0.1} className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Recent contracts</h2>
                <Link href="/contracts" className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-1.5 transition-all">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {contracts.slice(0, 4).map((c) => (
                  <ContractCard key={c.id} contract={c} />
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.18}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Upcoming reminders</h2>
                <Link href="/reminders" className="text-sm font-medium text-primary">All</Link>
              </div>
              {reminders.length === 0 ? (
                <div className="card flex flex-col items-center gap-2 p-6 text-center">
                  <Bell className="h-6 w-6 text-ink-secondary" />
                  <p className="text-sm text-ink-secondary">No upcoming reminders.</p>
                </div>
              ) : (
                <div className="card divide-y divide-black/[0.06]">
                  {reminders.slice(0, 5).map((r) => {
                    const d = daysUntil(r.remindAt);
                    return (
                      <Link key={r.id} href={`/contracts/${r.contract.id}`} className="flex items-center gap-3 p-3 transition hover:bg-surface-subtle">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary"><Bell className="h-4 w-4" /></span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{r.label}</p>
                          <p className="truncate text-xs text-ink-secondary">
                            {r.contract.title} · {d <= 0 ? "today" : `in ${d}d`} · {formatDate(r.remindAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </FadeIn>
          </div>
        </>
      )}
    </div>
  );
}
