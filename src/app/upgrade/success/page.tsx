import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { features } from "@/lib/env";
import { applyUpgrade } from "@/modules/billing/checkout";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Confetti } from "@/components/ui/confetti";
import { PLANS, type PlanId } from "@/lib/constants";

export const metadata: Metadata = { title: "Welcome to your new plan" };

export default async function SuccessPage({ searchParams }: { searchParams: { plan?: string; session_id?: string; mock?: string } }) {
  const user = await requireUser();
  const planId = (searchParams.plan && searchParams.plan in PLANS ? searchParams.plan : "solo") as PlanId;

  // In live Stripe mode the webhook applies the upgrade; if a real checkout
  // returned here before the webhook fired, apply it idempotently as a fallback.
  if (features.stripe && searchParams.session_id && user.plan === "free" && planId !== "free") {
    await applyUpgrade(user.id, planId as Exclude<PlanId, "free">, "monthly");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4 text-center">
      <Confetti />
      <Logo className="mb-8" />
      <Card className="max-w-md p-4u">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-3 text-2xl font-bold text-ink">You&apos;re now on {PLANS[planId].name}!</h1>
        <p className="mt-2 text-ink-secondary">{PLANS[planId].blurb}</p>
        <p className="mt-1 text-sm text-success">All features unlocked immediately.</p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button size="lg">Go to dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
