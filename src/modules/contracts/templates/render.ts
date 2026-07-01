import { currencySymbol } from "@/lib/utils";
import type { ContractTemplate, StandardValues, DocFormat } from "./types";

function toRoman(n: number): string {
  const map: [string, number][] = [["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]];
  let out = "";
  for (const [s, v] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

/** Section-heading text differs by document format (the visual styling is applied
 *  in the DocumentPreview/PDF layer). */
function sectionHeading(index: number, title: string, fmt: DocFormat): string {
  if (fmt === "legal") return `ARTICLE ${toRoman(index)} — ${title.toUpperCase()}`;
  if (fmt === "modern") return title; // unnumbered; preview adds an accent bar
  return `${index}. ${title}`;
}

const SCHEDULE_LABELS: Record<string, string> = {
  full_upfront: "100% upfront before work begins",
  split_50_50: "50% upfront and 50% on final delivery",
  milestone: "in milestones agreed by both parties",
  monthly_retainer: "as a monthly retainer, billed at the start of each month",
  net_15: "within 15 days of each invoice (Net-15)",
  net_30: "within 30 days of each invoice (Net-30)",
};

function esc(s: string) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Replaces {{token}} placeholders with provided values (HTML-escaped). */
function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = values[key];
    return v != null && v !== "" ? esc(v) : `<span style="color:#856404">[${key}]</span>`;
  });
}

function fmtDate(d?: string) {
  if (!d) return "to be confirmed";
  const date = new Date(d);
  return isNaN(date.getTime()) ? esc(d) : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export type RenderInput = StandardValues & Record<string, string>;

/**
 * Assembles a complete, professional contract from a template + the user's
 * field values. Pure token replacement — instant, no AI required.
 */
export function renderTemplate(template: ContractTemplate, raw: RenderInput): { title: string; bodyHtml: string } {
  const sym = currencySymbol(raw.currency);
  const amount = raw.amount ? `${sym}${Number(raw.amount).toLocaleString()}` : "the agreed fee";

  const values: Record<string, string> = {
    ...raw,
    formattedAmount: amount,
    currencySymbol: sym,
    startDateLabel: fmtDate(raw.startDate),
    deadlineLabel: fmtDate(raw.deadline),
    scheduleLabel: SCHEDULE_LABELS[raw.paymentSchedule] ?? "as agreed by both parties",
  };

  const title = `${template.name} — ${raw.clientName || "Client"}`;
  const sections: { title: string; html: string }[] = [];

  // 1. Parties + scope
  sections.push({
    title: template.scopeLabel || "Scope of Work",
    html: `<p>${fill(raw.scope || template.scopeDefault, values)}</p>`,
  });

  // 2. Term & timeline
  sections.push({
    title: "Term & Timeline",
    html: `<p>This agreement begins on <strong>${values.startDateLabel}</strong> and the work is scheduled for completion by <strong>${values.deadlineLabel}</strong>. Timelines assume the Client provides required materials, feedback, and approvals promptly.</p>`,
  });

  // 3. Payment
  if (!template.omitPayment) {
    sections.push({
      title: "Payment Terms",
      html:
        `<p>The total fee for the services described is <strong>${amount} ${esc(raw.currency)}</strong>, payable ${values.scheduleLabel}. ` +
        `Invoices are due within 7 days of issue. A late fee of 2% per month applies to overdue balances. ` +
        `All amounts are exclusive of any applicable taxes, which are the Client's responsibility.</p>`,
    });
  }

  // 4. Revisions
  if (!template.omitRevisions) {
    const rounds = values.revisions || "two (2)";
    sections.push({
      title: "Revisions",
      html: `<p>This agreement includes up to <strong>${esc(rounds)}</strong> round(s) of revisions on the delivered work. Additional revisions, or changes that materially expand the original scope, are billed separately at the Freelancer's standard rate and agreed in writing before work continues.</p>`,
    });
  }

  // 5. Intellectual property (only when there is a paid deliverable)
  if (!template.omitPayment) {
    sections.push({
      title: "Intellectual Property",
      html: `<p>Upon receipt of full payment, all intellectual property rights in the final deliverables transfer to the Client. Until full payment is received, the Freelancer retains all rights. The Freelancer may display the work in a portfolio unless the Client requests otherwise in writing.</p>`,
    });
  }

  // 6. Confidentiality
  sections.push({
    title: "Confidentiality",
    html: `<p>Both parties agree to keep confidential any non-public information shared during this engagement and to use it only for the purpose of this agreement.</p>`,
  });

  // 7. Template-specific clauses
  for (const c of template.extraClauses ?? []) {
    sections.push({ title: c.title, html: fill(c.body, values) });
  }

  // 8. Termination
  const notice = values.noticePeriodDays || "14";
  sections.push({
    title: "Termination",
    html: `<p>Either party may terminate this agreement with <strong>${esc(notice)} days</strong> written notice. On termination, the Client shall pay for all work completed up to the termination date, and the Freelancer shall hand over completed deliverables that have been paid for.</p>`,
  });

  // 9. Dispute resolution
  const jurisdiction = values.jurisdiction || "the Freelancer's jurisdiction";
  sections.push({
    title: "Dispute Resolution",
    html: `<p>The parties shall first attempt to resolve any dispute through good-faith negotiation, and failing that, through mediation. This agreement is governed by the laws of <strong>${esc(jurisdiction)}</strong>.</p>`,
  });

  // 10. Signatures
  sections.push({
    title: "Signatures",
    html:
      `<p>By signing below, both parties agree to the terms of this agreement.</p>` +
      `<p>Project: <strong>${esc(raw.projectTitle || template.name)}</strong></p>` +
      `<p>______________________ &nbsp; ${esc(raw.freelancerName)} (Freelancer)</p>` +
      `<p>______________________ &nbsp; ${esc(raw.clientName)} (${esc(raw.clientName)})</p>`,
  });

  const fmt: DocFormat = template.format ?? "classic";
  const body = sections
    .map((s, i) => `<h3>${esc(sectionHeading(i + 1, s.title, fmt))}</h3>${s.html}`)
    .join("\n");

  const intro = `<p>This <strong>${esc(template.name)}</strong> ("Agreement") is made between <strong>${esc(raw.freelancerName)}</strong> ("Freelancer") and <strong>${esc(raw.clientName || "the Client")}</strong> ("Client")${raw.clientEmail ? ` (${esc(raw.clientEmail)})` : ""} for the project <strong>${esc(raw.projectTitle || template.name)}</strong>.</p>`;

  return { title, bodyHtml: `<h2>${esc(title)}</h2>\n${intro}\n${body}` };
}
