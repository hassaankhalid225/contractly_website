import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getContract } from "@/modules/contracts/repository";
import { addPaymentAction, markPaymentPaidAction, archiveContractAction } from "@/modules/contracts/actions";
import { addReminderAction } from "@/modules/reminders/actions";
import { revokeSignatureAction } from "@/modules/signature/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, RiskBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { formatMoney, formatDate, absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Contract" };

export default async function ContractDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sent?: string };
}) {
  const user = await requireUser();
  const contract = await getContract(user.id, params.id);
  if (!contract) notFound();

  const sig = contract.signatureRequest;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={contract.title}
        description={`${contract.clientName}${contract.clientEmail ? ` · ${contract.clientEmail}` : ""}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={contract.status} />
            {contract.analysis && <RiskBadge level={contract.analysis.riskLevel} score={contract.analysis.riskScore} />}
          </div>
        }
      />

      {searchParams.sent && (
        <div className="mb-4 rounded-card bg-success/10 p-3 text-sm text-success">
          ✓ Signature request sent to {sig?.signerEmail}. We&apos;ll notify you when they sign.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <Card className="p-3u">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Meta label="Value" value={formatMoney(contract.value, contract.currency)} />
              <Meta label="Start" value={formatDate(contract.startDate)} />
              <Meta label="End" value={formatDate(contract.endDate)} />
              <Meta label="Source" value={contract.source === "upload" ? "Uploaded" : "Template"} />
              {contract.workType && <Meta label="Work type" value={contract.workType} />}
              {contract.fileName && (
                <Meta label="File" value={<a href={absoluteUrl(`/api/files/${contract.fileKey}`)} className="text-primary underline" target="_blank">{contract.fileName}</a>} />
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/contracts/${contract.id}/analysis`}><Button variant="secondary" size="sm">{contract.analysis ? "View AI analysis" : "Run AI analysis"}</Button></Link>
              {contract.status !== "signed" && (
                <Link href={`/contracts/${contract.id}/send`}><Button size="sm">Request signature</Button></Link>
              )}
              <form action={archiveContractAction.bind(null, contract.id)}>
                <Button type="submit" variant="ghost" size="sm">Archive</Button>
              </form>
            </div>
          </Card>

          {/* Generated body */}
          {contract.bodyHtml && (
            <Card className="p-3u">
              <h2 className="mb-2 text-lg font-semibold text-ink">Contract</h2>
              <div
                className="prose-contract space-y-2 text-sm leading-relaxed text-ink [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc"
                dangerouslySetInnerHTML={{ __html: contract.bodyHtml }}
              />
            </Card>
          )}

          {/* Signature tracking */}
          {sig && (
            <Card className="p-3u">
              <h2 className="mb-2 text-lg font-semibold text-ink">Signature</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge tone={sig.status === "signed" ? "success" : sig.status === "revoked" ? "error" : "warning"}>
                  {sig.status.replace("_", " ")}
                </Badge>
                <span className="text-ink-secondary">Signer: {sig.signerName} ({sig.signerEmail})</span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-ink-secondary">
                {sig.viewedAt && <p>Opened {formatDate(sig.viewedAt)}</p>}
                {sig.signedAt && <p>Signed {formatDate(sig.signedAt)}</p>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sig.status !== "signed" && sig.status !== "revoked" && (
                  <>
                    <a href={absoluteUrl(`/sign/${sig.token}`)} target="_blank"><Button variant="outline" size="sm">Open signing link</Button></a>
                    <form action={revokeSignatureAction.bind(null, contract.id)}>
                      <Button type="submit" variant="ghost" size="sm">Revoke link</Button>
                    </form>
                  </>
                )}
                {sig.signedPdfKey && (
                  <a href={absoluteUrl(`/api/files/${sig.signedPdfKey}`)} target="_blank"><Button size="sm">Download signed PDF</Button></a>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar: payments + reminders */}
        <div className="space-y-6">
          <Card className="p-3u">
            <h2 className="mb-2 text-base font-semibold text-ink">Payments</h2>
            <div className="space-y-2">
              {contract.payments.length === 0 && <p className="text-sm text-ink-secondary">No payments tracked yet.</p>}
              {contract.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 rounded-card bg-surface-subtle p-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{formatMoney(p.amount, p.currency)}</p>
                    <p className="truncate text-xs text-ink-secondary">{p.label || "Payment"}{p.dueDate ? ` · due ${formatDate(p.dueDate)}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <PaymentStatusBadge status={p.status} />
                    {p.status !== "paid" && (
                      <form action={markPaymentPaidAction.bind(null, p.id, contract.id)}>
                        <button type="submit" className="text-xs font-medium text-primary hover:underline">Mark paid</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-primary">+ Add payment</summary>
              <form action={addPaymentAction} className="mt-2 space-y-2">
                <input type="hidden" name="contractId" value={contract.id} />
                <Input name="label" placeholder="e.g. Final 50%" />
                <Input name="amount" type="number" step="0.01" placeholder="Amount" required />
                <Input name="dueDate" type="date" />
                <SubmitButton size="sm" className="w-full">Add</SubmitButton>
              </form>
            </details>
          </Card>

          <Card className="p-3u">
            <h2 className="mb-2 text-base font-semibold text-ink">Reminders</h2>
            <div className="space-y-2">
              {contract.reminders.length === 0 && <p className="text-sm text-ink-secondary">No reminders set.</p>}
              {contract.reminders.map((r) => (
                <div key={r.id} className="rounded-card bg-surface-subtle p-2">
                  <p className="text-sm font-medium text-ink">{r.label}</p>
                  <p className="text-xs text-ink-secondary">{formatDate(r.remindAt)} · {r.status}</p>
                </div>
              ))}
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-primary">+ Add reminder</summary>
              <form action={addReminderAction} className="mt-2 space-y-2">
                <input type="hidden" name="contractId" value={contract.id} />
                <Input name="label" placeholder="e.g. Send first draft" required />
                <Input name="remindAt" type="date" required />
                <label className="flex items-center gap-2 text-xs text-ink-secondary"><input type="checkbox" name="channelEmail" defaultChecked /> Email</label>
                <label className="flex items-center gap-2 text-xs text-ink-secondary"><input type="checkbox" name="channelPush" defaultChecked /> Push</label>
                <SubmitButton size="sm" className="w-full">Add reminder</SubmitButton>
              </form>
            </details>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-ink-secondary">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
