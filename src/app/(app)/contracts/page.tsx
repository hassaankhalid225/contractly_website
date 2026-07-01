import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { listContracts } from "@/modules/contracts/repository";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ContractCard } from "@/modules/contracts/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Contracts" };

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "awaiting_signature", label: "Awaiting" },
  { id: "signed", label: "Signed" },
  { id: "draft", label: "Drafts" },
];

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const user = await requireUser();
  const status = searchParams.status ?? "all";
  const q = searchParams.q ?? "";
  const contracts = await listContracts(user.id, { status, q });

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Your full contract wallet."
        action={<Link href="/contracts/new"><Button>+ New Contract</Button></Link>}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={`/contracts?status=${f.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={cn(
                "rounded-pill border px-3 py-1.5 text-sm transition",
                status === f.id ? "border-primary bg-primary-50 text-primary" : "border-black/10 text-ink-secondary hover:border-primary/40",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form className="sm:w-64">
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or client…"
            className="input-base"
          />
        </form>
      </div>

      {contracts.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={q ? "No matching contracts" : "No contracts yet"}
          description={q ? "Try a different search." : "Add your first contract to get started."}
          action={<Link href="/contracts/new"><Button>+ New Contract</Button></Link>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contracts.map((c) => (
            <ContractCard key={c.id} contract={c} />
          ))}
        </div>
      )}
    </div>
  );
}
