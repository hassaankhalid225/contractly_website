import { Badge } from "./badge";
import { CONTRACT_STATUS, RISK_LEVELS, type ContractStatus, type RiskLevel } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const meta = CONTRACT_STATUS[status as ContractStatus] ?? { label: status, tone: "neutral" as const };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

const riskTone: Record<RiskLevel, "success" | "warning" | "error"> = {
  low: "success",
  medium: "warning",
  high: "error",
};

export function RiskBadge({ level, score }: { level: string; score?: number }) {
  const lvl = (RISK_LEVELS.includes(level as RiskLevel) ? level : "medium") as RiskLevel;
  return (
    <Badge tone={riskTone[lvl]} className="uppercase tracking-wide">
      {lvl} risk{typeof score === "number" ? ` · ${score}%` : ""}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const tone = status === "paid" ? "success" : status === "overdue" ? "error" : "warning";
  return <Badge tone={tone}>{status[0].toUpperCase() + status.slice(1)}</Badge>;
}
