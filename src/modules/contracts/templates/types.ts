/** Shared, serializable types for the built-in template library. */

export type TemplateFieldType = "text" | "textarea" | "number" | "date" | "select";

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  placeholder?: string;
  required?: boolean;
  default?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  /** Full-width in the form grid. */
  wide?: boolean;
};

export type TemplateCategory =
  | "Development"
  | "Design"
  | "Content & Media"
  | "Marketing"
  | "Business"
  | "Legal";

/** Visual document format — drives the preview/PDF styling. */
export type DocFormat = "classic" | "modern" | "legal" | "minimal";

export type ContractTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  icon: string; // key in TEMPLATE_ICONS (resolved in the UI)
  tagline: string;
  popular?: boolean;
  /** Visual document format. */
  format?: DocFormat;
  /** Maps to WORK_TYPES for downstream personalization. */
  workType: string;
  /** Default value for the standard payment-schedule field. */
  paymentSchedule: string;
  /** Pre-filled, premium default scope copy (the user can tweak it). */
  scopeDefault: string;
  /** Label for the scope field (e.g. "Scope of work" vs "Purpose"). */
  scopeLabel?: string;
  /** Template-specific extra input fields, beyond the standard set. */
  fields: TemplateField[];
  /** Extra numbered clauses appended before termination. Tokens allowed. */
  extraClauses?: { title: string; body: string }[];
  /** Hide the payment / amount section (e.g. NDA). */
  omitPayment?: boolean;
  /** Hide the revisions section. */
  omitRevisions?: boolean;
  /** Estimated time to complete the form, shown on the card. */
  fillMinutes?: number;
};

/** Standard fields every template collects (rendered before extra fields). */
export type StandardValues = {
  freelancerName: string;
  clientName: string;
  clientEmail?: string;
  projectTitle: string;
  amount?: string;
  currency: string;
  startDate?: string;
  deadline?: string;
  scope: string;
  paymentSchedule: string;
};
