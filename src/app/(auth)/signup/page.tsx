import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignupForm } from "@/modules/auth/auth-forms";

export const metadata: Metadata = { title: "Create your free account" };

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-ink">Create your free account</h1>
      <p className="mb-4 text-sm text-ink-secondary">Protect your first contract in under a minute.</p>
      <SignupForm />
    </div>
  );
}
