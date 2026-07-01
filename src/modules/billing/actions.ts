"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { startCheckout, cancelPlan } from "./checkout";
import type { PlanId } from "@/lib/constants";

export async function checkoutAction(formData: FormData) {
  const user = await requireUser();
  const plan = String(formData.get("plan")) as Exclude<PlanId, "free">;
  const interval = (String(formData.get("interval") || "monthly") as "monthly" | "annual");
  if (plan !== "solo" && plan !== "agency") redirect("/upgrade");
  const { url } = await startCheckout({ userId: user.id, email: user.email, plan, interval });
  redirect(url);
}

export async function cancelPlanAction() {
  const user = await requireUser();
  await cancelPlan(user.id);
  revalidatePath("/settings");
  redirect("/settings?canceled=1");
}
