import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "New Contract" };

export default function NewContractPage() {
  return (
    <div>
      <PageHeader title="Add a contract" description="Upload an existing one for AI analysis, or generate a new one." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/contracts/new/upload" className="card flex flex-col items-start gap-2 p-4u transition hover:shadow-pop">
          <span className="text-3xl">📤</span>
          <h3 className="text-lg font-semibold text-ink">Upload &amp; Analyze</h3>
          <p className="text-sm text-ink-secondary">Upload a PDF, photo, or doc of an existing contract. Our AI scans it for risks, missing clauses, and unfair terms.</p>
        </Link>
        <Link href="/contracts/new/template" className="card flex flex-col items-start gap-2 p-4u transition hover:-translate-y-0.5 hover:shadow-pop">
          <span className="text-3xl">✨</span>
          <h3 className="text-lg font-semibold text-ink">Use a Template</h3>
          <p className="text-sm text-ink-secondary">Pick from 15 ready-made premium contracts, fill a few fields, and create instantly — or let AI draft a custom one.</p>
        </Link>
      </div>
    </div>
  );
}
