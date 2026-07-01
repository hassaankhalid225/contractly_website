import "server-only";
import { env, features } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { PLANS, ANNUAL_DISCOUNT, type PlanId } from "@/lib/constants";

/**
 * Starts a checkout. With Stripe configured, returns a hosted Checkout URL.
 * Without it, runs in mock mode — the upgrade is applied immediately and the
 * caller is sent to a local success page (so the paywall flow is demonstrable).
 */
export async function startCheckout(opts: {
  userId: string;
  email: string;
  plan: Exclude<PlanId, "free">;
  interval: "monthly" | "annual";
}): Promise<{ url: string }> {
  if (!features.stripe) {
    await applyUpgrade(opts.userId, opts.plan, opts.interval);
    return { url: `/upgrade/success?plan=${opts.plan}&mock=1` };
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!);
  const priceId = opts.plan === "solo" ? env.STRIPE_PRICE_SOLO_MONTHLY : env.STRIPE_PRICE_AGENCY_MONTHLY;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: opts.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.APP_URL}/upgrade/success?plan=${opts.plan}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/upgrade`,
    metadata: { userId: opts.userId, plan: opts.plan, interval: opts.interval },
    subscription_data: { metadata: { userId: opts.userId, plan: opts.plan } },
  });
  return { url: session.url! };
}

/** Applies a plan upgrade to the user + subscription record. */
export async function applyUpgrade(
  userId: string,
  plan: Exclude<PlanId, "free">,
  interval: "monthly" | "annual",
  stripeIds?: { customerId?: string; subscriptionId?: string },
) {
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + (interval === "annual" ? 12 : 1));

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { plan } }),
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: "active",
        interval,
        currentPeriodEnd: periodEnd,
        stripeCustomerId: stripeIds?.customerId,
        stripeSubscriptionId: stripeIds?.subscriptionId,
      },
      update: {
        plan,
        status: "active",
        interval,
        currentPeriodEnd: periodEnd,
        stripeCustomerId: stripeIds?.customerId,
        stripeSubscriptionId: stripeIds?.subscriptionId,
      },
    }),
  ]);
}

export async function cancelPlan(userId: string) {
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { plan: "free" } }),
    prisma.subscription.updateMany({ where: { userId }, data: { plan: "free", status: "canceled" } }),
  ]);
}

export function priceFor(plan: Exclude<PlanId, "free">, interval: "monthly" | "annual") {
  const monthly = PLANS[plan].price;
  if (interval === "annual") return Math.round(monthly * 12 * (1 - ANNUAL_DISCOUNT));
  return monthly;
}
