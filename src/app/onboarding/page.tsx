import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/brand/logo";
import { OnboardingWizard } from "@/modules/auth/onboarding-wizard";

export const metadata: Metadata = { title: "Welcome to Contractly" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.onboardingDone) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4 py-10">
      <Logo className="mb-6" />
      <div className="w-full max-w-md">
        <div className="card p-3u sm:p-4u">
          <OnboardingWizard defaultName={user.name} />
        </div>
      </div>
    </div>
  );
}
