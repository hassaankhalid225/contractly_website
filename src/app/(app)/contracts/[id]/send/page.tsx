import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getContract } from "@/modules/contracts/repository";
import { requestSignatureAction } from "@/modules/signature/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/input";
import { SignaturePad } from "@/components/forms/signature-pad";
import { SubmitButton } from "@/components/forms/submit-button";

export const metadata: Metadata = { title: "Request Signature" };

export default async function SendPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const contract = await getContract(user.id, params.id);
  if (!contract) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Request signature" description={contract.title} />
      <Card className="p-3u sm:p-4u">
        <form action={requestSignatureAction} className="space-y-5">
          <input type="hidden" name="contractId" value={contract.id} />

          <div>
            <h2 className="mb-3 text-base font-semibold text-ink">1. Signer details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input name="signerName" label="Client full name" required defaultValue={contract.clientName} />
              <Input name="signerEmail" type="email" label="Client email" required defaultValue={contract.clientEmail ?? ""} />
            </div>
            <Textarea
              name="message"
              label="Message to client (optional)"
              className="mt-3"
              defaultValue={`Hi ${contract.clientName}, please review and sign our agreement for "${contract.title}". Thanks!`}
            />
            <Select name="deadlineDays" label="Signing deadline" defaultValue="30" className="mt-3 sm:max-w-xs">
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </Select>
          </div>

          <div>
            <h2 className="mb-1 text-base font-semibold text-ink">2. Your signature</h2>
            <p className="mb-2 text-sm text-ink-secondary">Sign first, then we&apos;ll send it to your client.</p>
            <SignaturePad imageFieldName="freelancerSignature" methodFieldName="freelancerMethod" typedDefault={user.name} />
          </div>

          <div className="rounded-card bg-surface-subtle p-3 text-xs text-ink-secondary">
            A no-login signing link will be emailed to your client. E-signatures are legally valid under the ESIGN Act,
            eIDAS, and Pakistan&apos;s Electronic Transactions Ordinance 2002.
          </div>

          <SubmitButton size="lg" className="w-full">Sign &amp; send to client</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
