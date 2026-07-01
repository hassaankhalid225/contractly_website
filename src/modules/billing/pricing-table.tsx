"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ANNUAL_DISCOUNT } from "@/lib/constants";
import { checkoutAction } from "./actions";
import { cn } from "@/lib/utils";

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  features: string[];
};

export function PricingTable({ plans, currentPlan }: { plans: PricingPlan[]; currentPlan: string }) {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const price = (monthly: number) => (interval === "annual" ? Math.round(monthly * (1 - ANNUAL_DISCOUNT)) : monthly);

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-pill border bg-surface p-1 text-sm">
          {(["monthly", "annual"] as const).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={cn("rounded-pill px-4 py-1.5 capitalize transition", interval === i ? "bg-primary text-primary-fg" : "text-ink-secondary")}
            >
              {i} {i === "annual" && <span className="text-xs">(save 20%)</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const featured = plan.popular;
          return (
            <div key={plan.id} className={cn("card flex flex-col p-3u", featured && "ring-2 ring-primary")}>
              {featured && <Badge tone="primary" className="mb-2 self-start">Recommended</Badge>}
              <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="mt-1 text-3xl font-bold text-ink">
                ${price(plan.price)}
                <span className="text-sm font-normal text-ink-secondary">/mo</span>
              </p>
              {interval === "annual" && plan.price > 0 && <p className="text-xs text-success">Billed annually</p>}
              <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-secondary">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-success" /> {f}</li>
                ))}
              </ul>
              <div className="mt-4">
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>Current plan</Button>
                ) : plan.price === 0 ? (
                  <Button variant="outline" className="w-full" disabled>Free</Button>
                ) : (
                  <form action={checkoutAction}>
                    <input type="hidden" name="plan" value={plan.id} />
                    <input type="hidden" name="interval" value={interval} />
                    <Button type="submit" variant={featured ? "primary" : "outline"} className="w-full">Get {plan.name}</Button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
