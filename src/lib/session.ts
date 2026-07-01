import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

/**
 * Guard for authenticated server components / actions. Redirects to /login
 * when unauthenticated, and to /onboarding when the survey is incomplete.
 */
export async function requireUser(opts: { onboarded?: boolean } = { onboarded: true }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.suspended) redirect("/login?suspended=1");
  if (opts.onboarded && !user.onboardingDone) redirect("/onboarding");
  return user;
}

export type AppUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
