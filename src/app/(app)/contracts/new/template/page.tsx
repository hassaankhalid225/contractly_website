import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TemplateGallery } from "@/modules/contracts/templates/template-gallery";
import { listTemplates } from "@/modules/contracts/templates/service";

export const metadata: Metadata = { title: "Contract Templates" };

export default async function TemplateGalleryPage() {
  const all = await listTemplates();
  // Pass only the serializable fields the gallery needs.
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
        title="Choose a template"
        description={`${all.length} ready-made, professional contracts. Pick one, fill a few fields, and you're done.`}
      />
      <TemplateGallery templates={templates} />
    </div>
  );
}
