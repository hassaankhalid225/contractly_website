import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTemplateRow } from "@/modules/contracts/templates/service";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { AdminTemplateForm } from "@/modules/admin/template-form";

export const metadata: Metadata = { title: "Admin · Edit Template" };

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const template = await getTemplateRow(params.id);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/templates" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All templates
      </Link>
      <PageHeader
        title={`Edit: ${template.name}`}
        description="Changes apply to the live gallery immediately."
        action={
          <Link href={`/contracts/new/template/${template.id}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-primary">
            Preview <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <Card className="p-3u sm:p-4u">
        <AdminTemplateForm template={template} />
      </Card>
    </div>
  );
}
