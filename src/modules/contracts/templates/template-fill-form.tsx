"use client";
import * as React from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, FileText, Download } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES } from "@/lib/constants";
import { createFromBuiltinTemplateAction } from "@/modules/contracts/actions";
import { renderTemplate } from "./render";
import { DocumentPreview } from "./document-preview";
import type { ContractTemplate, TemplateField } from "./types";

const SCHEDULES = [
  { value: "full_upfront", label: "100% upfront" },
  { value: "split_50_50", label: "50% upfront / 50% on delivery" },
  { value: "milestone", label: "Milestone-based" },
  { value: "monthly_retainer", label: "Monthly retainer" },
  { value: "net_30", label: "Net-30 (pay within 30 days)" },
];

export function TemplateFillForm({
  template,
  userName,
  defaultCurrency,
}: {
  template: ContractTemplate;
  userName: string;
  defaultCurrency: string;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = React.useState(true);
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const format = template.format ?? "classic";

  const sync = React.useCallback(() => {
    if (formRef.current) setValues(Object.fromEntries(new FormData(formRef.current)) as Record<string, string>);
  }, []);
  React.useEffect(() => { sync(); }, [sync]);

  const openPdf = async () => {
    if (!formRef.current) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/contracts/pdf-preview", { method: "POST", body: new FormData(formRef.current) });
      if (!res.ok) return;
      const url = URL.createObjectURL(await res.blob());
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } finally {
      setPdfLoading(false);
    }
  };

  const preview = renderTemplate(template, {
    freelancerName: userName,
    clientName: "",
    projectTitle: "",
    scope: template.scopeDefault,
    currency: defaultCurrency,
    paymentSchedule: template.paymentSchedule,
    ...values,
  } as never);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Form */}
      <form
        ref={formRef}
        action={createFromBuiltinTemplateAction}
        onInput={sync}
        onChange={sync}
        className="space-y-5 lg:col-span-3"
      >
        <input type="hidden" name="templateId" value={template.id} />

        <Section title="Project details">
          <Input name="projectTitle" label="Project title" required placeholder="e.g. Marketing website redesign" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input name="clientName" label="Client name" required placeholder="Acme Inc" />
            <Input name="clientEmail" type="email" label="Client email" placeholder="client@email.com" />
          </div>
          <Textarea name="scope" label={template.scopeLabel || "Scope of work"} defaultValue={template.scopeDefault} hint="Pre-filled — tweak to fit your project. {{fields}} fill in automatically." />
        </Section>

        {!template.omitPayment && (
          <Section title="Payment">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input name="amount" type="number" step="0.01" label="Total amount" placeholder="0.00" />
              <Select name="currency" label="Currency" defaultValue={defaultCurrency}>
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
              </Select>
              <Select name="paymentSchedule" label="Payment schedule" defaultValue={template.paymentSchedule}>
                {SCHEDULES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>
          </Section>
        )}

        <Section title="Timeline">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input name="startDate" type="date" label="Start date" />
            <Input name="deadline" type="date" label="Deadline" />
          </div>
        </Section>

        {template.fields.length > 0 && (
          <Section title="Template details" badge={`${template.fields.length} guided fields`}>
            <p className="-mt-1 text-xs text-ink-secondary">
              These tailor the contract clauses automatically — defaults are filled in, just adjust what you need.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {template.fields.map((f) => <Field key={f.key} field={f} />)}
            </div>
          </Section>
        )}

        <div className="flex items-center gap-2">
          <Submit />
          <button
            type="button"
            onClick={() => setShowPreview((s) => !s)}
            className="flex items-center gap-1.5 rounded-input px-3 py-2 text-sm text-ink-secondary hover:bg-black/[0.04] lg:hidden"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide" : "Preview"}
          </button>
        </div>
        <p className="text-xs text-ink-secondary">Creates a draft instantly — you can edit, then send it for signature.</p>
      </form>

      {/* PDF preview */}
      <div className={`lg:col-span-2 ${showPreview ? "block" : "hidden lg:block"}`}>
        <div className="sticky top-20">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-secondary">
              <FileText className="h-3.5 w-3.5" /> PDF preview
            </div>
            <button
              type="button"
              onClick={openPdf}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 rounded-input px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary-50 disabled:opacity-60"
            >
              {pdfLoading
                ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                : <Download className="h-3.5 w-3.5" />}
              Open as PDF
            </button>
          </div>
          <div className="max-h-[76vh] overflow-y-auto rounded-card">
            <DocumentPreview html={preview.bodyHtml} title={preview.title} format={format} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-secondary">{title}</h2>
        {badge && (
          <span className="rounded-pill bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary">{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ field }: { field: TemplateField }) {
  const common = { name: field.key, label: field.label, required: field.required, defaultValue: field.default, placeholder: field.placeholder, hint: field.hint };
  const wide = field.wide ? "sm:col-span-2" : "";
  if (field.type === "textarea") return <div className={wide}><Textarea {...common} /></div>;
  if (field.type === "select")
    return (
      <div className={wide}>
        <Select name={field.key} label={field.label} defaultValue={field.default}>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </div>
    );
  return <div className={wide}><Input type={field.type} step={field.type === "number" ? "any" : undefined} {...common} /></div>;
}

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="lg" loading={pending}>{pending ? "Creating…" : "Create contract"}</Button>;
}
