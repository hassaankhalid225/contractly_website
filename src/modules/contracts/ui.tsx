import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { formatMoney, formatDate, currencySymbol, cn } from "@/lib/utils";

type CardContract = {
  id: string;
  title: string;
  clientName: string;
  value: number | null;
  currency: string;
  status: string;
  endDate: Date | null;
  analysis?: { riskLevel: string; riskScore: number } | null;
};

export function ContractCard({ contract }: { contract: CardContract }) {
  return (
    <Link
      href={`/contracts/${contract.id}`}
      className="card group relative block p-3u transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{contract.title}</h3>
          <p className="truncate text-sm text-ink-secondary">{contract.clientName}</p>
        </div>
        <StatusBadge status={contract.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
        <span className="font-semibold text-ink">{formatMoney(contract.value, contract.currency)}</span>
        {contract.endDate && <span>· ends {formatDate(contract.endDate)}</span>}
        {contract.analysis && <RiskBadge level={contract.analysis.riskLevel} score={contract.analysis.riskScore} />}
      </div>
      <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

const toneStyles: Record<string, { text: string; chip: string }> = {
  default: { text: "text-ink", chip: "bg-primary-50 text-primary" },
  success: { text: "text-success", chip: "bg-success/10 text-success" },
  warning: { text: "text-warning", chip: "bg-warning/10 text-warning" },
  error: { text: "text-error", chip: "bg-error/10 text-error" },
};

export function StatCard({
  label,
  amount,
  currency,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  amount: number;
  currency?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "error";
}) {
  const t = toneStyles[tone];
  const sym = currency ? currencySymbol(currency) : "";
  return (
    <div className="card p-3u transition-shadow hover:shadow-pop">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-secondary">{label}</p>
        {Icon && (
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-full", t.chip)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight", t.text)}>
        <AnimatedCounter value={amount} prefix={sym} />
      </p>
    </div>
  );
}
