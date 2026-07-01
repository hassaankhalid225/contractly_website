"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { WORK_TYPES, CLIENT_VOLUMES, CURRENCIES } from "@/lib/constants";
import { completeOnboardingAction } from "./actions";
import { cn } from "@/lib/utils";

export function OnboardingWizard({ defaultName }: { defaultName: string }) {
  const [step, setStep] = useState(0);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [volume, setVolume] = useState<string>("");
  const [currency, setCurrency] = useState("USD");

  const total = 4;
  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const toggleWork = (w: string) =>
    setWorkTypes((cur) => (cur.includes(w) ? cur.filter((x) => x !== w) : [...cur, w]));

  return (
    <form action={completeOnboardingAction} className="space-y-5">
      <input type="hidden" name="workTypes" value={workTypes.join(",")} />
      <input type="hidden" name="clientVolume" value={volume} />
      <input type="hidden" name="defaultCurrency" value={currency} />

      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-black/10")} />
        ))}
      </div>

      {step === 0 && (
        <Step title="What type of work do you do?" subtitle="Pick all that apply — we'll tailor your templates.">
          <div className="flex flex-wrap gap-2">
            {WORK_TYPES.map((w) => (
              <Chip key={w} active={workTypes.includes(w)} onClick={() => toggleWork(w)}>{w}</Chip>
            ))}
          </div>
        </Step>
      )}

      {step === 1 && (
        <Step title="How many clients do you usually have?">
          <div className="flex gap-2">
            {CLIENT_VOLUMES.map((v) => (
              <Chip key={v} active={volume === v} onClick={() => setVolume(v)}>{v}</Chip>
            ))}
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="Which currency do you work in mostly?">
          <div className="grid grid-cols-2 gap-2">
            {CURRENCIES.map((c) => (
              <Chip key={c.code} active={currency === c.code} onClick={() => setCurrency(c.code)}>
                {c.symbol} {c.code}
              </Chip>
            ))}
          </div>
        </Step>
      )}

      {step === 3 && (
        <Step title="Set up your profile" subtitle="You can skip and edit this later in Settings.">
          <Input name="displayName" label="Display name" defaultValue={defaultName} />
          <Input name="whatsapp" label="WhatsApp number (optional)" placeholder="+92 300 1234567" hint="Used for optional client reminders" />
        </Step>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
        {step < total - 1 ? (
          <Button type="button" onClick={next}>Next</Button>
        ) : (
          <SubmitButton>Go to dashboard</SubmitButton>
        )}
      </div>
    </form>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-secondary">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill border px-3 py-1.5 text-sm transition",
        active ? "border-primary bg-primary-50 text-primary" : "border-black/10 text-ink-secondary hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}
