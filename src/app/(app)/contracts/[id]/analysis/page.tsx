import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getContract, decodeAnalysis } from "@/modules/contracts/repository";
import { canUseAiScan } from "@/modules/billing/plan";
import { runAnalysisAction } from "@/modules/contracts/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/forms/submit-button";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "AI Analysis" };

const clauseTone: Record<string, string> = {
  ok: "border-l-success bg-success/5",
  caution: "border-l-warning bg-warning/5",
  risk: "border-l-error bg-error/5",
};
const clauseIcon: Record<string, string> = { ok: "✓", caution: "!", risk: "✕" };

export default async function AnalysisPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const contract = await getContract(user.id, params.id);
  if (!contract) notFound();

  const scan = await canUseAiScan(user);

  // Free user without analysis → paywall.
  if (!contract.analysis && !scan.allowed) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="AI Contract Analysis" />
        <Card className="p-4u text-center">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-2 text-lg font-semibold text-ink">AI analysis is a Solo feature</h2>
          <p className="mt-1 text-sm text-ink-secondary">{scan.reason}</p>
          <Link href="/upgrade?reason=ai_scan" className="mt-4 inline-block">
            <Button size="lg">Upgrade to Solo</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!contract.analysis) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="AI Contract Analysis" description={contract.title} />
        <Card className="p-4u text-center">
          <p className="text-sm text-ink-secondary">This contract hasn&apos;t been analyzed yet.</p>
          <form action={runAnalysisAction.bind(null, contract.id)} className="mt-4">
            <SubmitButton size="lg">Run AI analysis</SubmitButton>
          </form>
        </Card>
      </div>
    );
  }

  const a = decodeAnalysis(contract.analysis);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="AI Analysis"
        description={contract.title}
        action={<Link href={`/contracts/${contract.id}`}><Button variant="outline">View contract</Button></Link>}
      />

      <Card className="p-3u">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-secondary">Risk score</p>
            <RiskBadge level={a.riskLevel} score={a.riskScore} />
          </div>
          <div className="text-right text-xs text-ink-secondary">
            Model: {contract.analysis.model}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink">{a.summary}</p>
        <p className="mt-3 rounded-card bg-surface-subtle p-2 text-xs text-ink-secondary">
          ⚠️ AI analysis is guidance, not legal advice. Review the original contract alongside this summary.
        </p>
      </Card>

      {a.redFlags.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-lg font-semibold text-ink">🚩 Red flags</h2>
          <div className="space-y-2">
            {a.redFlags.map((f, i) => (
              <div key={i} className="rounded-card border border-error/30 bg-error/5 p-3">
                <p className="font-medium text-error">{f.title}</p>
                <p className="text-sm text-ink-secondary">{f.why}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {a.missingClauses.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-lg font-semibold text-ink">Missing clauses</h2>
          <ul className="card divide-y divide-black/[0.06]">
            {a.missingClauses.map((m, i) => (
              <li key={i} className="flex items-center gap-2 p-3 text-sm text-ink">
                <span className="text-warning">⚠</span> No {m.toLowerCase()} found
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <h2 className="mb-2 text-lg font-semibold text-ink">Clauses</h2>
        <div className="space-y-2">
          {a.clauses.map((c, i) => (
            <details key={i} className={`rounded-card border-l-4 p-3 ${clauseTone[c.status] ?? ""}`}>
              <summary className="flex cursor-pointer items-center justify-between font-medium text-ink">
                <span>{clauseIcon[c.status]} {c.title}</span>
                <span className="text-xs uppercase text-ink-secondary">{c.type}</span>
              </summary>
              <p className="mt-2 text-sm text-ink">{c.text}</p>
              <p className="mt-1 text-sm text-ink-secondary"><strong>Why this matters:</strong> {c.explanation}</p>
            </details>
          ))}
        </div>
      </section>

      {a.paymentTerms?.amount != null && (
        <Card className="mt-5 p-3u">
          <h3 className="font-semibold text-ink">Payment terms extracted</h3>
          <p className="mt-1 text-sm text-ink-secondary">
            {typeof a.paymentTerms.amount === "number" ? formatMoney(a.paymentTerms.amount, contract.currency) : a.paymentTerms.amount}
            {a.paymentTerms.schedule ? ` · ${a.paymentTerms.schedule}` : ""}
            {a.paymentTerms.lateFee ? ` · Late fee: ${a.paymentTerms.lateFee}` : ""}
          </p>
        </Card>
      )}

      <div className="mt-6 flex gap-2">
        <Link href={`/contracts/${contract.id}`} className="flex-1"><Button className="w-full">Save to wallet</Button></Link>
        <Link href={`/contracts/${contract.id}/send`}><Button variant="outline">Request signature</Button></Link>
      </div>
    </div>
  );
}
