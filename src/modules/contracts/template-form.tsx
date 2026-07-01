"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WORK_TYPES, CURRENCIES, PAYMENT_SCHEDULES } from "@/lib/constants";
import { createFromTemplateAction } from "./actions";
import { cn } from "@/lib/utils";

const WORK_ICONS: Record<string, string> = {
  "Web Development": "💻", "UI/UX Design": "🎨", "Content Writing": "✍️", Photography: "📷",
  "Video Editing": "🎬", "Social Media": "📱", Consulting: "💡", "General Services": "🛠️", Custom: "⚙️",
};

export function TemplateForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [workType, setWorkType] = useState<string>("");

  return (
    <form action={createFromTemplateAction} className="space-y-5">
      <input type="hidden" name="workType" value={workType} />
      <div>
        <p className="label-base">Work type</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {WORK_TYPES.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWorkType(w)}
              className={cn(
                "flex items-center gap-2 rounded-card border p-3 text-left text-sm transition",
                workType === w ? "border-primary bg-primary-50 text-primary" : "border-black/10 hover:border-primary/40",
              )}
            >
              <span>{WORK_ICONS[w]}</span>
              <span className="font-medium">{w}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="clientName" label="Client name" required placeholder="Acme Inc" />
        <Input name="clientEmail" type="email" label="Client email" placeholder="client@email.com" />
        <Input name="projectTitle" label="Project title" required placeholder="Marketing website" className="sm:col-span-2" />
      </div>
      <Textarea name="scope" label="Scope of work" placeholder="Describe what you'll deliver…" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="amount" type="number" step="0.01" label="Total amount" placeholder="0.00" />
        <Select name="currency" label="Currency" defaultValue={defaultCurrency}>
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
        </Select>
        <Select name="paymentSchedule" label="Payment schedule" defaultValue="split_50_50">
          {PAYMENT_SCHEDULES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </Select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="startDate" type="date" label="Start date" />
        <Input name="deadline" type="date" label="Deadline" />
      </div>

      <Pending disabled={!workType} />
    </form>
  );
}

function Pending({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  if (pending) {
    return (
      <div className="rounded-card bg-primary-50 p-4 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-primary">Drafting your contract…</p>
      </div>
    );
  }
  return (
    <Button type="submit" size="lg" className="w-full" disabled={disabled}>
      Generate contract
    </Button>
  );
}
