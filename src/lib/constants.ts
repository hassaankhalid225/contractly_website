/**
 * Enum-like domain constants. Because the schema uses string columns for
 * portability across SQLite/Postgres, these are the canonical value sets
 * and labels used across the app.
 */

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    contractLimit: 3,
    aiScan: false,
    teamSeats: 0,
    whiteLabel: false,
    blurb: "3 active contracts, basic storage, manual reminders",
    target: "Students, beginners",
  },
  solo: {
    id: "solo",
    name: "Solo",
    price: 6,
    contractLimit: Infinity,
    aiScan: true,
    teamSeats: 1,
    whiteLabel: false,
    blurb: "Unlimited contracts, AI scanner, e-signature, smart reminders, earnings dashboard",
    target: "Freelancers",
  },
  agency: {
    id: "agency",
    name: "Agency",
    price: 19,
    contractLimit: Infinity,
    aiScan: true,
    teamSeats: 5,
    whiteLabel: true,
    blurb: "All Solo features + 5 team seats, white-label portal, priority support, local legal templates",
    target: "Small agencies",
  },
} as const;

export type PlanId = keyof typeof PLANS;
export const ANNUAL_DISCOUNT = 0.2;

export const CONTRACT_STATUS = {
  draft: { label: "Draft", tone: "neutral" },
  active: { label: "Active", tone: "success" },
  awaiting_signature: { label: "Awaiting Signature", tone: "warning" },
  signed: { label: "Signed", tone: "primary" },
  expired: { label: "Expired", tone: "error" },
  archived: { label: "Archived", tone: "neutral" },
} as const;
export type ContractStatus = keyof typeof CONTRACT_STATUS;

export const RISK_LEVELS = ["low", "medium", "high"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const CURRENCIES = [
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
] as const;
export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// Indicative conversion rates to USD for dashboard roll-ups. In production
// these would come from a live FX provider; documented as static here.
export const FX_TO_USD: Record<string, number> = {
  USD: 1,
  PKR: 0.0036,
  AED: 0.27,
  GBP: 1.27,
  EUR: 1.08,
};

export const WORK_TYPES = [
  "Web Development",
  "UI/UX Design",
  "Content Writing",
  "Photography",
  "Video Editing",
  "Social Media",
  "Consulting",
  "General Services",
  "Custom",
] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const CLIENT_VOLUMES = ["1-3", "4-10", "10+"] as const;

export const PAYMENT_SCHEDULES = [
  { id: "full_upfront", label: "Full upfront" },
  { id: "split_50_50", label: "50% upfront / 50% on delivery" },
  { id: "milestone", label: "Milestone-based" },
] as const;

// Default expiry reminder offsets (days before contract end).
export const EXPIRY_REMINDER_OFFSETS = [30, 14, 7, 1];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_UPLOAD_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
