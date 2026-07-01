import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { listPlans } from "@/modules/billing/plan";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { savePlanAction, deletePlanAction } from "@/modules/admin/actions";
import type { Plan } from "@prisma/client";

export const metadata: Metadata = { title: "Admin · Plans" };

export default async function AdminPlansPage({ searchParams }: { searchParams: { saved?: string } }) {
  const plans = await listPlans({ activeOnly: false });

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Plans" description="Edit pricing, limits & features. Changes apply to gating immediately." />
      {searchParams.saved && <div className="mb-4 rounded-card bg-success/10 p-3 text-sm text-success">✓ Plan saved. Gating & pricing updated.</div>}

      <div className="space-y-4">
        {plans.map((p) => <PlanForm key={p.id} plan={p} />)}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">Add a new plan</h2>
      <Card className="p-3u sm:p-4u">
        <form action={savePlanAction} className="space-y-3">
          <PlanFields />
          <button type="submit" className="rounded-input bg-primary px-4 py-2 text-sm font-medium text-primary-fg">Create plan</button>
        </form>
      </Card>
    </div>
  );
}

function PlanForm({ plan }: { plan: Plan }) {
  return (
    <Card className="p-3u sm:p-4u">
      <form action={savePlanAction} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">{plan.name} <span className="text-xs font-normal text-ink-secondary">({plan.id})</span></h3>
          <input type="hidden" name="id" value={plan.id} />
        </div>
        <PlanFields plan={plan} />
        <div className="flex items-center justify-between">
          <button type="submit" className="rounded-input bg-primary px-4 py-2 text-sm font-medium text-primary-fg">Save plan</button>
          {plan.id !== "free" && (
            <span className="text-xs text-ink-secondary">Tip: set contract limit to <strong>-1</strong> for unlimited.</span>
          )}
        </div>
      </form>
      {plan.id !== "free" && (
        <form action={deletePlanAction.bind(null, plan.id)} className="mt-2 border-t border-line/40 pt-2">
          <button type="submit" className="flex items-center gap-1 text-xs text-error hover:underline"><Trash2 className="h-3.5 w-3.5" /> Delete plan</button>
        </form>
      )}
    </Card>
  );
}

function PlanFields({ plan }: { plan?: Plan }) {
  return (
    <>
      {!plan && <Input name="id" label="Plan ID (slug)" placeholder="pro" required />}
      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="name" label="Name" defaultValue={plan?.name} placeholder="Pro" required />
        <Input name="price" type="number" step="0.01" label="Price / month ($)" defaultValue={plan ? String(plan.price) : "0"} />
        <Input name="contractLimit" type="number" label="Contract limit (-1 = ∞)" defaultValue={plan ? String(plan.contractLimit) : "3"} />
        <Input name="teamSeats" type="number" label="Team seats" defaultValue={plan ? String(plan.teamSeats) : "0"} />
        <Input name="order" type="number" label="Display order" defaultValue={plan ? String(plan.order) : "0"} />
        <Input name="blurb" label="Blurb" defaultValue={plan?.blurb} placeholder="Short description" />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="aiScan" defaultChecked={plan?.aiScan} /> AI scanner</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="whiteLabel" defaultChecked={plan?.whiteLabel} /> White-label</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={plan ? plan.active : true} /> Active</label>
      </div>
    </>
  );
}
