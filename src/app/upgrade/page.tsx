import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Logo } from "@/components/brand/logo";
import { PricingTable } from "@/modules/billing/pricing-table";
import { listPlans, planFeatures } from "@/modules/billing/plan";

export const metadata: Metadata = { title: "Upgrade" };

const REASONS: Record<string, string> = {
  contract_limit: "You've reached the 3-contract limit on the Free plan. Upgrade to Solo for unlimited contracts.",
  ai_scan: "AI contract analysis is a Solo feature. Upgrade to unlock it.",
  team: "Team seats are available on the Agency plan.",
};

export default async function UpgradePage({ searchParams }: { searchParams: { reason?: string } }) {
  const user = await requireUser();
  const reason = searchParams.reason ? REASONS[searchParams.reason] : null;
  const plans = (await listPlans()).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    popular: p.id === "solo",
    features: planFeatures(p),
  }));

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/dashboard"><Logo /></Link>
        <Link href="/dashboard" className="text-sm text-ink-secondary hover:text-ink">← Back</Link>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-ink">Upgrade your plan</h1>
          <p className="mt-2 text-ink-secondary">Built for freelancers — 4–5× cheaper than the alternatives.</p>
          {reason && <p className="mx-auto mt-3 max-w-md rounded-card bg-primary-50 p-3 text-sm text-primary">{reason}</p>}
        </div>
        <PricingTable plans={plans} currentPlan={user.plan} />
        <p className="mt-6 text-center text-xs text-ink-secondary">
          Payments via Stripe · Visa, Mastercard, Apple Pay, Google Pay, EasyPaisa &amp; JazzCash.
        </p>
      </main>
    </div>
  );
}
