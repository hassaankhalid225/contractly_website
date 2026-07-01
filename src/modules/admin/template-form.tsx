import { Input, Select, Textarea } from "@/components/ui/input";
import { WORK_TYPES } from "@/lib/constants";
import { TEMPLATE_ICONS } from "@/modules/contracts/templates/template-icons";
import { TEMPLATE_CATEGORIES } from "@/modules/contracts/templates/registry";
import { saveTemplateAction } from "./actions";
import type { Template } from "@prisma/client";

const FORMATS = ["classic", "modern", "legal", "minimal"];
const SCHEDULES = [
  { v: "full_upfront", l: "100% upfront" },
  { v: "split_50_50", l: "50% / 50%" },
  { v: "milestone", l: "Milestone" },
  { v: "monthly_retainer", l: "Monthly retainer" },
  { v: "net_30", l: "Net-30" },
];

/** Create/edit form for a contract template (admin). */
export function AdminTemplateForm({ template }: { template?: Template }) {
  const isEdit = !!template;
  return (
    <form action={saveTemplateAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {isEdit ? (
          <input type="hidden" name="id" value={template!.id} />
        ) : (
          <Input name="id" label="Template ID (slug)" placeholder="brand-strategy" required hint="Lowercase, used in the URL." />
        )}
        <Input name="name" label="Name" defaultValue={template?.name} placeholder="Brand Strategy Agreement" required />
        <div className="sm:col-span-2">
          <Input name="tagline" label="Tagline" defaultValue={template?.tagline} placeholder="Short one-line description" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Select name="category" label="Category" defaultValue={template?.category ?? "Business"}>
          {TEMPLATE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select name="icon" label="Icon" defaultValue={template?.icon ?? "code"}>
          {Object.keys(TEMPLATE_ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
        </Select>
        <Select name="format" label="Document format" defaultValue={template?.format ?? "classic"}>
          {FORMATS.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}
        </Select>
        <Select name="workType" label="Work type" defaultValue={template?.workType ?? "General Services"}>
          {WORK_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}
        </Select>
        <Select name="paymentSchedule" label="Default payment schedule" defaultValue={template?.paymentSchedule ?? "split_50_50"}>
          {SCHEDULES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </Select>
        <Input name="fillMinutes" type="number" label="Est. fill time (min)" defaultValue={template ? String(template.fillMinutes) : "2"} />
      </div>

      <Input name="scopeLabel" label="Scope field label" defaultValue={template?.scopeLabel ?? ""} placeholder="Scope of Work (or 'Purpose')" />
      <Textarea name="scopeDefault" label="Default scope text" required defaultValue={template?.scopeDefault} hint="Use {{fieldKey}} tokens — they fill from the field values." />

      <div className="grid gap-3 sm:grid-cols-2">
        <Textarea name="fieldsJson" label="Fields (JSON)" defaultValue={template?.fieldsJson ?? "[]"} hint='Array of {key,label,type,default,options...}' className="font-mono text-xs" />
        <Textarea name="extraClausesJson" label="Extra clauses (JSON)" defaultValue={template?.extraClausesJson ?? "[]"} hint='Array of {title, body} — tokens allowed' className="font-mono text-xs" />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="popular" defaultChecked={template?.popular} /> Popular</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="omitPayment" defaultChecked={template?.omitPayment} /> Omit payment</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="omitRevisions" defaultChecked={template?.omitRevisions} /> Omit revisions</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={template ? template.active : true} /> Active</label>
        <Input name="order" type="number" label="" defaultValue={template ? String(template.order) : "99"} placeholder="Order" className="h-9 w-24" />
      </div>

      <button type="submit" className="rounded-input bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg">
        {isEdit ? "Save changes" : "Create template"}
      </button>
    </form>
  );
}
