import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { canUseAiScan } from "@/modules/billing/plan";
import { PageHeader } from "@/components/layout/page-header";
import { UploadForm } from "@/modules/contracts/upload-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Upload Contract" };

export default async function UploadPage() {
  const user = await requireUser();
  const scan = await canUseAiScan(user);
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Upload & analyze" description="We'll scan your contract for risks and missing protections." />
      {!scan.allowed && (
        <div className="mb-4 rounded-card bg-warning/10 p-3 text-sm text-warning">
          AI analysis is a Solo feature. Your contract will be saved, and you can{" "}
          <a href="/upgrade?reason=ai_scan" className="font-semibold underline">upgrade</a> to unlock the scan.
        </div>
      )}
      {scan.allowed && <Badge tone="primary" className="mb-4">AI scan included</Badge>}
      <div className="card p-3u sm:p-4u">
        <UploadForm defaultCurrency={user.defaultCurrency} canScan={scan.allowed} />
      </div>
    </div>
  );
}
