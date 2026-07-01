"use client";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/forms/signature-pad";
import { SubmitButton } from "@/components/forms/submit-button";
import { Confetti } from "@/components/ui/confetti";
import { clientSignAction, type ClientSignState } from "./actions";

export function ClientSignForm({
  token,
  expectedName,
  freelancerName,
}: {
  token: string;
  expectedName: string;
  freelancerName: string;
}) {
  const [state, action] = useFormState(clientSignAction, {} as ClientSignState);

  if (state.ok) {
    return (
      <div className="text-center">
        <Confetti />
        <div className="text-5xl">🎉</div>
        <h2 className="mt-3 text-xl font-semibold text-ink">Contract signed successfully</h2>
        <p className="mt-1 text-sm text-ink-secondary">A signed copy has been emailed to both parties.</p>

        {/* Viral loop (Flow 5, step 6) */}
        <div className="mt-6 rounded-card border border-primary/20 bg-primary-50 p-4">
          <p className="text-sm text-ink">
            <strong>{freelancerName || "Your freelancer"}</strong> used Contractly to protect this deal.
          </p>
          <p className="text-sm text-ink-secondary">Manage your own contracts free.</p>
          <Link href="/signup" className="mt-3 inline-block">
            <Button>Get Contractly Free</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="name" label="Full name" required defaultValue={expectedName} hint="Must match the name on the contract" />
        <Input name="email" type="email" label="Email" required placeholder="you@email.com" />
      </div>

      <div>
        <p className="label-base">Your signature</p>
        <SignaturePad imageFieldName="imageData" methodFieldName="method" />
      </div>

      <label className="flex items-start gap-2 text-sm text-ink">
        <input type="checkbox" required className="mt-0.5" />
        <span>I agree to the terms of this contract. My name, email, IP address, and timestamp will be recorded as part of the signature.</span>
      </label>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      <SubmitButton size="lg" className="w-full">Sign contract</SubmitButton>
    </form>
  );
}
