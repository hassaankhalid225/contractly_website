import type { Analysis, GenerateInput, GeneratedContract } from "./types";

/**
 * Deterministic, keyword-driven contract analysis used when no ANTHROPIC_API_KEY
 * is set. It is intentionally heuristic — not a substitute for the real model —
 * but produces realistic, varied output so the full flow is demonstrable.
 */
export function mockAnalysis(text: string): Analysis {
  const t = text.toLowerCase();
  const clauses: Analysis["clauses"] = [];
  const missing: string[] = [];
  const redFlags: Analysis["redFlags"] = [];
  let score = 25;

  const has = (...keys: string[]) => keys.some((k) => t.includes(k));

  if (has("payment", "pay ", "fee", "amount", "invoice")) {
    clauses.push({ title: "Payment Terms", type: "payment", status: "ok", text: "Payment terms are specified.", explanation: "The contract defines how and when you get paid." });
  } else {
    missing.push("Payment schedule");
    redFlags.push({ title: "No clear payment terms", why: "Without a defined payment schedule, getting paid on time is hard to enforce." });
    score += 20;
  }

  if (has("unlimited revision", "unlimited revisions", "as many revisions")) {
    clauses.push({ title: "Revisions", type: "scope", status: "caution", text: "Unlimited revisions permitted.", explanation: "Uncapped revisions are a common source of unpaid extra work — negotiate a cap." });
    redFlags.push({ title: "Unlimited revisions", why: "The client can request endless changes at no extra cost." });
    score += 18;
  }

  if (has("intellectual property", "ip ownership", "copyright", "ownership of")) {
    clauses.push({ title: "Intellectual Property", type: "ip", status: "ok", text: "IP ownership is addressed.", explanation: "Ownership of the deliverables is defined." });
  } else {
    missing.push("IP ownership clause");
    redFlags.push({ title: "No IP ownership clause", why: "It is unclear who owns the final work until payment is complete." });
    score += 15;
  }

  if (has("terminate", "termination", "cancel")) {
    clauses.push({ title: "Termination", type: "termination", status: "ok", text: "Termination conditions are present.", explanation: "Both parties know how to exit the agreement." });
  } else {
    missing.push("Termination clause");
    score += 8;
  }

  if (has("liability", "indemnif")) {
    clauses.push({ title: "Liability", type: "liability", status: "caution", text: "Liability terms present — review carefully.", explanation: "Check that liability is limited to the contract value." });
  } else {
    missing.push("Liability limitation");
    score += 6;
  }

  score = Math.max(8, Math.min(95, score));
  const riskLevel: Analysis["riskLevel"] = score > 66 ? "high" : score > 33 ? "medium" : "low";

  return {
    riskScore: score,
    riskLevel,
    summary:
      `This is a ${riskLevel}-risk contract based on an automated keyword review. ` +
      (missing.length ? `It appears to be missing: ${missing.join(", ")}. ` : "Standard clauses appear to be present. ") +
      "Review the highlighted items before signing. (Add an ANTHROPIC_API_KEY for full AI analysis.)",
    clauses,
    missingClauses: missing,
    redFlags,
    paymentTerms: { amount: null, schedule: null, lateFee: null },
  };
}

export function mockGeneratedContract(input: GenerateInput): GeneratedContract {
  const title = `${input.workType} Agreement — ${input.clientName}`;
  const bodyHtml = `
    <h2>${title}</h2>
    <p>This agreement is entered into between the Freelancer and <strong>${input.clientName}</strong> (the "Client") for the project titled <strong>${input.projectTitle}</strong>.</p>
    <h3>1. Scope of Work</h3>
    <p>${input.scope || "The Freelancer will deliver the agreed work as described by both parties."}</p>
    <h3>2. Payment Terms</h3>
    <p>Total project value: <strong>${input.amount} ${input.currency}</strong>, payable as: ${input.paymentSchedule.replace(/_/g, " ")}. Invoices are due within 7 days. A late fee of 2% per month applies to overdue amounts.</p>
    <h3>3. Revisions</h3>
    <p>This agreement includes up to two (2) rounds of revisions. Additional revisions are billed at the Freelancer's standard hourly rate.</p>
    <h3>4. Intellectual Property</h3>
    <p>All intellectual property rights in the deliverables transfer to the Client upon receipt of full payment. Until then, all rights remain with the Freelancer.</p>
    <h3>5. Confidentiality</h3>
    <p>Both parties agree to keep confidential information private and not disclose it to third parties.</p>
    <h3>6. Termination</h3>
    <p>Either party may terminate this agreement with 14 days written notice. The Client shall pay for all work completed up to the termination date.</p>
    <h3>7. Dispute Resolution</h3>
    <p>Any disputes shall first be resolved through good-faith negotiation, and if unresolved, through mediation.</p>
    <h3>8. Signatures</h3>
    <p>Start date: ${input.startDate ?? "TBD"} &nbsp;•&nbsp; Deadline: ${input.deadline ?? "TBD"}</p>
    <p>Signed: ______________________ (Freelancer) &nbsp;&nbsp; ______________________ (${input.clientName})</p>
  `.trim();
  return { title, bodyHtml };
}
