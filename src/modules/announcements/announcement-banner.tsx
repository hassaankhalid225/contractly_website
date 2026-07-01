"use client";
import * as React from "react";
import { X, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string; body: string; type: string };

const ICONS = { info: Info, warning: AlertTriangle, success: CheckCircle2 } as const;
const TONES: Record<string, string> = {
  info: "bg-primary-50 text-primary border-primary/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
};

/** Dismissible announcement banner. Dismissals persist per-id in localStorage. */
export function AnnouncementBanner({ items }: { items: Item[] }) {
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  React.useEffect(() => {
    try {
      setDismissed(JSON.parse(localStorage.getItem("contractly_dismissed_ann") || "[]"));
    } catch { /* ignore */ }
  }, []);

  const visible = items.filter((i) => !dismissed.includes(i.id));
  if (visible.length === 0) return null;
  const a = visible[0];
  const Icon = ICONS[(a.type as keyof typeof ICONS)] ?? Info;

  const dismiss = () => {
    const next = [...dismissed, a.id];
    setDismissed(next);
    try { localStorage.setItem("contractly_dismissed_ann", JSON.stringify(next)); } catch { /* ignore */ }
  };

  return (
    <div className={cn("flex items-start gap-3 border-b px-2u py-2.5 text-sm lg:px-4u", TONES[a.type] ?? TONES.info)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="font-semibold">{a.title}</span>{" "}
        <span className="opacity-90">{a.body}</span>
      </div>
      <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 rounded p-0.5 hover:bg-black/[0.06]">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
