import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { env, features } from "@/lib/env";
import { applyUpgrade, cancelPlan } from "@/modules/billing/checkout";
import type { PlanId } from "@/lib/constants";

/**
 * Stripe webhook: applies plan changes on checkout completion and cancellations.
 * No-ops when Stripe isn't configured (the app runs in mock checkout mode).
 */
export async function POST(req: NextRequest) {
  if (!features.stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 200 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = headers().get("stripe-signature") ?? "";

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object;
      const userId = s.metadata?.userId;
      const plan = s.metadata?.plan as Exclude<PlanId, "free"> | undefined;
      const interval = (s.metadata?.interval as "monthly" | "annual") ?? "monthly";
      if (userId && plan) {
        await applyUpgrade(userId, plan, interval, {
          customerId: typeof s.customer === "string" ? s.customer : undefined,
          subscriptionId: typeof s.subscription === "string" ? s.subscription : undefined,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) await cancelPlan(userId);
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
