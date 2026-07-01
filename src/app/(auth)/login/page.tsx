import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/modules/auth/auth-forms";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-ink">Welcome back</h1>
      <p className="mb-4 text-sm text-ink-secondary">Log in to your contract wallet.</p>
      <LoginForm />
    </div>
  );
}
