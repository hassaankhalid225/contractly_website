import type { Metadata } from "next";
import { getSignatureByToken, recordView } from "@/modules/signature/service";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientSignForm } from "@/modules/signature/client-sign-form";
import { formatMoney, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Review & Sign Contract" };

function htmlToText(html: string) {
  return html.replace(/<\/(h[1-6]|p|li|div)>/gi, "\n").replace(/<li[^>]*>/gi, "• ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
}

export default async function SignPage({ params }: { params: { token: string } }) {
  const req = await getSignatureByToken(params.token);

  const wrap = (inner: React.ReactNode) => (
    <div className="min-h-screen bg-surface-subtle">
      <header className="mx-auto max-w-2xl px-4 py-4"><Logo /></header>
      <main className="mx-auto max-w-2xl px-4 pb-16">{inner}</main>
    </div>
  );

  if (!req) {
    return wrap(<Card className="p-4u text-center"><div className="text-4xl">🔗</div><h1 className="mt-2 text-lg font-semibold text-ink">Link not found</h1><p className="text-sm text-ink-secondary">This signing link is invalid.</p></Card>);
  }

  const expired = req.deadline && req.deadline < new Date();
  if (req.status === "revoked" || expired) {
    return wrap(
      <Card className="p-4u text-center">
        <div className="text-4xl">⌛</div>
        <h1 className="mt-2 text-lg font-semibold text-ink">This link has expired</h1>
        <p className="text-sm text-ink-secondary">Please contact {req.contract.user.name} to request a new signing link.</p>
      </Card>,
    );
  }

  if (req.status === "signed") {
    return wrap(
      <Card className="p-4u text-center">
        <div className="text-4xl">✅</div>
        <h1 className="mt-2 text-lg font-semibold text-ink">Already signed</h1>
        <p className="text-sm text-ink-secondary">This contract has been signed. A copy was emailed to both parties.</p>
      </Card>,
    );
  }

  await recordView(params.token);
  const c = req.contract;
  const body = htmlToText(c.bodyHtml || c.contentText || "");

  return wrap(
    <>
      <div className="mb-4 flex items-center gap-3">
        <Avatar name={c.user.name} src={c.user.photoUrl} size={44} />
        <div>
          <p className="text-sm text-ink-secondary">Sent by</p>
          <p className="font-semibold text-ink">{c.user.name}</p>
        </div>
        <Badge tone="primary" className="ml-auto">Action required</Badge>
      </div>

      <Card className="p-3u">
        <h1 className="text-xl font-semibold text-ink">{c.title}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-ink-secondary">
          <span><strong className="text-ink">{formatMoney(c.value, c.currency)}</strong></span>
          {c.startDate && <span>Start: {formatDate(c.startDate)}</span>}
          {c.endDate && <span>End: {formatDate(c.endDate)}</span>}
        </div>
        {req.message && <p className="mt-3 rounded-card bg-surface-subtle p-3 text-sm text-ink">{req.message}</p>}
        <div className="mt-4 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-card border border-black/[0.06] bg-white p-4 text-sm leading-relaxed text-ink">
          {body || "No contract text available — please review the attached document with the sender."}
        </div>
      </Card>

      <Card className="mt-4 p-3u sm:p-4u">
        <h2 className="mb-1 text-base font-semibold text-ink">Sign this contract</h2>
        <p className="mb-3 text-sm text-ink-secondary">No account needed — sign right here in your browser.</p>
        <ClientSignForm token={params.token} expectedName={req.signerName} freelancerName={c.user.name} />
      </Card>

      <p className="mt-4 text-center text-xs text-ink-secondary">
        🔒 Secure e-signature · Legally valid under ESIGN, eIDAS &amp; ETO 2002
      </p>
    </>,
  );
}
