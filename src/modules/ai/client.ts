import "server-only";
import { env, features } from "@/lib/env";
import { AnalysisSchema, type Analysis, type GenerateInput, type GeneratedContract } from "./types";
import { ANALYSIS_SYSTEM, analysisUserPrompt, GENERATE_SYSTEM, generateUserPrompt } from "./prompts";
import { mockAnalysis, mockGeneratedContract } from "./fallback";

/**
 * Calls Claude (model configured via ANTHROPIC_MODEL — the PRD specifies
 * claude-sonnet-4-6 for cost reasons) to analyze a contract. Falls back to a
 * deterministic local analysis when no API key is configured so the flow works
 * end-to-end in development.
 */
export async function analyzeContract(contractText: string): Promise<{ analysis: Analysis; model: string }> {
  if (!features.ai) {
    return { analysis: mockAnalysis(contractText), model: "mock" };
  }
  try {
    const text = await callClaude(ANALYSIS_SYSTEM, analysisUserPrompt(contractText), 2000);
    const parsed = AnalysisSchema.parse(extractJson(text));
    return { analysis: parsed, model: env.ANTHROPIC_MODEL };
  } catch (err) {
    console.error("AI analysis failed, using fallback:", err);
    return { analysis: mockAnalysis(contractText), model: "mock-fallback" };
  }
}

export async function generateContract(input: GenerateInput): Promise<{ contract: GeneratedContract; model: string }> {
  if (!features.ai) {
    return { contract: mockGeneratedContract(input), model: "mock" };
  }
  try {
    const text = await callClaude(GENERATE_SYSTEM, generateUserPrompt(input), 4000);
    const obj = extractJson(text) as GeneratedContract;
    if (!obj?.bodyHtml) throw new Error("missing bodyHtml");
    return { contract: obj, model: env.ANTHROPIC_MODEL };
  } catch (err) {
    console.error("AI generation failed, using fallback:", err);
    return { contract: mockGeneratedContract(input), model: "mock-fallback" };
  }
}

async function callClaude(system: string, user: string, maxTokens: number): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const res = await client.messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b) => b.type === "text");
  return block && "text" in block ? block.text : "";
}

/** Tolerant JSON extraction — strips markdown fences and surrounding prose. */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in model output");
  return JSON.parse(candidate.slice(start, end + 1));
}
