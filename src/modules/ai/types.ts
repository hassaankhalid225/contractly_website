import { z } from "zod";

/** Shape of the AI contract analysis, mirrored in ContractAnalysis storage. */
export const ClauseSchema = z.object({
  title: z.string(),
  type: z.string(),
  status: z.enum(["ok", "caution", "risk"]),
  text: z.string(),
  explanation: z.string(),
});

export const RedFlagSchema = z.object({
  title: z.string(),
  why: z.string(),
});

export const PaymentTermsSchema = z.object({
  amount: z.union([z.number(), z.string()]).nullable().optional(),
  schedule: z.string().nullable().optional(),
  lateFee: z.string().nullable().optional(),
});

export const AnalysisSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  clauses: z.array(ClauseSchema),
  missingClauses: z.array(z.string()),
  redFlags: z.array(RedFlagSchema),
  paymentTerms: PaymentTermsSchema,
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type Clause = z.infer<typeof ClauseSchema>;

/** Input for generating a contract from a template. */
export type GenerateInput = {
  workType: string;
  clientName: string;
  projectTitle: string;
  scope: string;
  amount: number;
  currency: string;
  paymentSchedule: string;
  startDate?: string;
  deadline?: string;
};

export type GeneratedContract = {
  title: string;
  bodyHtml: string;
};
