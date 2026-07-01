"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { randomToken } from "@/lib/utils";

export type ActionState = { error?: string; ok?: boolean };

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      authProvider: "email",
      verifications: {
        create: { token: randomToken(16), purpose: "email_verify", expiresAt: new Date(Date.now() + 86400000) },
      },
    },
  });
  await createSession({ userId: user.id, email: user.email });
  redirect("/onboarding");
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }
  await createSession({ userId: user.id, email: user.email });
  redirect(user.onboardingDone ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  destroySession();
  redirect("/login");
}

/** Demo/Google-OAuth stand-in: creates or signs in a demo Google account. */
export async function demoGoogleAction() {
  const email = "google.demo@contractly.app";
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { name: "Google User", email, authProvider: "google", emailVerified: true },
    });
  }
  await createSession({ userId: user.id, email: user.email });
  redirect(user.onboardingDone ? "/dashboard" : "/onboarding");
}

const onboardingSchema = z.object({
  workTypes: z.string().default(""),
  clientVolume: z.string().optional(),
  defaultCurrency: z.string().default("USD"),
  displayName: z.string().optional(),
  whatsapp: z.string().optional(),
});

export async function completeOnboardingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = onboardingSchema.parse(Object.fromEntries(formData));
  await prisma.user.update({
    where: { id: user.id },
    data: {
      workTypes: data.workTypes,
      clientVolume: data.clientVolume || null,
      defaultCurrency: data.defaultCurrency,
      name: data.displayName?.trim() || user.name,
      whatsapp: data.whatsapp?.trim() || null,
      onboardingDone: true,
    },
  });
  redirect("/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: String(formData.get("name") || user.name).trim(),
      whatsapp: String(formData.get("whatsapp") || "").trim() || null,
      defaultCurrency: String(formData.get("defaultCurrency") || user.defaultCurrency),
    },
  });
  redirect("/settings?saved=1");
}
