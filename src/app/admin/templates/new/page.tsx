import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { AdminTemplateForm } from "@/modules/admin/template-form";

export const metadata: Metadata = { title: "Admin · New Template" };

export default function NewTemplatePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/templates" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All templates
      </Link>
      <PageHeader title="Add template" description="Create a new contract template. It appears in the gallery once active." />
      <Card className="p-3u sm:p-4u">
        <AdminTemplateForm />
      </Card>
    </div>
  );
}
