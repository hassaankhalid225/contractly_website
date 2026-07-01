import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { listReminders } from "@/modules/reminders/repository";
import { snoozeReminderAction, completeReminderAction } from "@/modules/reminders/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, daysUntil } from "@/lib/utils";

export const metadata: Metadata = { title: "Reminders" };

const TYPE_TONE: Record<string, "primary" | "warning" | "success" | "neutral"> = {
  expiry: "warning",
  payment: "primary",
  milestone: "success",
  custom: "neutral",
};

export default async function RemindersPage() {
  const user = await requireUser();
  const reminders = await listReminders(user.id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Reminders" description="Every upcoming reminder across your contracts." />

      {reminders.length === 0 ? (
        <EmptyState icon="🔔" title="No reminders" description="Reminders are created automatically when you add a contract with an end date." />
      ) : (
        <Card className="divide-y divide-black/[0.06]">
          {reminders.map((r) => {
            const d = daysUntil(r.remindAt);
            const overdue = d < 0;
            return (
              <div key={r.id} className="flex items-center justify-between gap-3 p-3u">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={TYPE_TONE[r.type] ?? "neutral"}>{r.type}</Badge>
                    <p className="truncate font-medium text-ink">{r.label}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    <Link href={`/contracts/${r.contract.id}`} className="text-primary hover:underline">{r.contract.title}</Link>
                    {" · "}{formatDate(r.remindAt)}{" · "}
                    <span className={overdue ? "text-error" : ""}>{overdue ? `${-d}d overdue` : d === 0 ? "today" : `in ${d}d`}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={snoozeReminderAction.bind(null, r.id, 1)}>
                    <button type="submit" className="rounded-card px-2 py-1 text-xs text-ink-secondary hover:bg-black/[0.04]" title="Snooze 1 day">+1d</button>
                  </form>
                  <form action={snoozeReminderAction.bind(null, r.id, 7)}>
                    <button type="submit" className="rounded-card px-2 py-1 text-xs text-ink-secondary hover:bg-black/[0.04]" title="Snooze 1 week">+1w</button>
                  </form>
                  <form action={completeReminderAction.bind(null, r.id)}>
                    <button type="submit" className="rounded-card px-2 py-1 text-xs font-medium text-success hover:bg-success/10">Done</button>
                  </form>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
