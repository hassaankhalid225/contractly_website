import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { requireUser } from "@/lib/session";
import { listTemplates } from "@/modules/contracts/templates/service";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { TemplateGallery } from "@/modules/contracts/templates/template-gallery";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  await requireUser();
  const all = await listTemplates();
  const templates = all.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    icon: t.icon,
    tagline: t.tagline,
    popular: t.popular,
    fillMinutes: t.fillMinutes,
    fieldCount: t.fields.length,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Templates"
        description="Ready-made, professional contracts. Pick one, fill a few fields, and create instantly."
        action={
          <Link href="/contracts/new/template/ai-custom">
            <Button variant="outline"><Sparkles className="h-4 w-4" /> Custom (AI)</Button>
          </Link>
        }
      />
      <TemplateGallery templates={templates} />
    </div>
  );
}
