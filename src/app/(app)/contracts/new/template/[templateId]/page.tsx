import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ListChecks, ShieldCheck, FileText } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getTemplateById } from "@/modules/contracts/templates/service";
import { templateIcon } from "@/modules/contracts/templates/template-icons";
import { TemplateFillForm } from "@/modules/contracts/templates/template-fill-form";
import { TemplateForm } from "@/modules/contracts/template-form";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: { templateId: string } }): Promise<Metadata> {
  if (params.templateId === "ai-custom") return { title: "Custom AI Contract" };
  const t = await getTemplateById(params.templateId);
  return { title: t ? t.name : "Template" };
}

export default async function TemplateFillPage({ params }: { params: { templateId: string } }) {
  const user = await requireUser();

  if (params.templateId === "ai-custom") {
    return (
      <div className="mx-auto max-w-2xl">
        <BackLink />
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Custom contract</h1>
          <p className="mt-1 text-sm text-ink-secondary">Our AI drafts a complete, freelancer-protective contract from your details.</p>
        </div>
        <div className="card p-3u sm:p-4u">
          <TemplateForm defaultCurrency={user.defaultCurrency} />
        </div>
      </div>
    );
  }

  const template = await getTemplateById(params.templateId);
  if (!template) notFound();
  const Icon = templateIcon(template.icon);
  // 8+ guided fields marks an in-depth, premium-grade template.
  const isPremium = template.fields.length >= 8;
  const clauseCount = template.extraClauses?.length ?? 0;

  return (
    <div className="mx-auto max-w-5xl">
      <BackLink />
      <div className="mb-5 flex items-start gap-3">
        <span
          className={
            isPremium
              ? "flex h-12 w-12 items-center justify-center rounded-card bg-gradient-to-br from-primary to-primary-600 text-primary-fg shadow-sm ring-1 ring-primary/30"
              : "flex h-12 w-12 items-center justify-center rounded-card bg-primary-50 text-primary"
          }
        >
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{template.name}</h1>
            {isPremium && (
              <span className="flex items-center gap-1 rounded-pill bg-gradient-to-r from-primary to-primary-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-fg shadow-sm">
                <Sparkles className="h-3 w-3" /> Premium
              </span>
            )}
            {template.popular && <Badge tone="primary">Popular</Badge>}
          </div>
          <p className="mt-1 text-sm text-ink-secondary">{template.tagline}</p>
        </div>
      </div>

      {isPremium && (
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-card border border-primary/20 bg-gradient-to-r from-primary-50/70 to-primary-50/20 px-4 py-3 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Premium template
          </span>
          <span className="flex items-center gap-1.5 text-ink-secondary">
            <ListChecks className="h-4 w-4 text-primary/70" /> <strong className="font-semibold text-ink">{template.fields.length}</strong> guided fields
          </span>
          <span className="flex items-center gap-1.5 text-ink-secondary">
            <ShieldCheck className="h-4 w-4 text-primary/70" /> <strong className="font-semibold text-ink">{clauseCount}</strong> protective clauses
          </span>
          <span className="flex items-center gap-1.5 text-ink-secondary">
            <FileText className="h-4 w-4 text-primary/70" /> Auto-tailored, lawyer-style contract
          </span>
        </div>
      )}

      <TemplateFillForm template={template} userName={user.name} defaultCurrency={user.defaultCurrency} />
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/contracts/new/template" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink">
      <ArrowLeft className="h-4 w-4" /> All templates
    </Link>
  );
}
