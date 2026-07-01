import { z } from "zod";

/**
 * Centralized, validated environment access. Every external integration
 * is optional — feature modules check the relevant `has*` flag and fall
 * back to a deterministic local implementation when a key is absent.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(16).default("dev-only-insecure-secret-change-me-please"),
  DATABASE_URL: z.string().default("file:./dev.db"),

  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Contractly <no-reply@contractly.app>"),

  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().default("auto"),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_SOLO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_AGENCY_MONTHLY: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Surface misconfiguration loudly but don't crash dev for optional keys.
  console.error("⚠️  Invalid environment configuration:", parsed.error.flatten().fieldErrors);
}

export const env = parsed.success ? parsed.data : schema.parse({});

export const features = {
  ai: Boolean(env.ANTHROPIC_API_KEY),
  email: Boolean(env.RESEND_API_KEY),
  storage: Boolean(env.STORAGE_BUCKET && env.STORAGE_ACCESS_KEY_ID),
  stripe: Boolean(env.STRIPE_SECRET_KEY),
  googleOAuth: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
} as const;

export const isProd = env.NODE_ENV === "production";
