import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { listTemplateRows } from "@/modules/contracts/templates/service";
import { templateIcon } from "@/modules/contracts/templates/template-icons";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleTemplateAction, deleteTemplateAction } from "@/modules/admin/actions";

export const metadata: Metadata = { title: "Admin · Templates" };

export default async function AdminTemplatesPage({ searchParams }: { searchParams: { saved?: string } }) {
  const templates = await listTemplateRows();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Templates"
        description={`${templates.length} contract templates. Add, edit, or toggle visibility.`}
        action={<Link href="/admin/templates/new"><Button><Plus className="h-4 w-4" /> Add template</Button></Link>}
      />
      {searchParams.saved && <div className="mb-4 rounded-card bg-success/10 p-3 text-sm text-success">✓ Template saved.</div>}

      <Card className="divide-y divide-black/[0.06]">
        {templates.map((t) => {
          const Icon = templateIcon(t.icon);
          return (
            <div key={t.id} className="flex items-center gap-3 p-3u">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-primary-50 text-primary"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-ink">{t.name}</p>
                  {t.popular && <Badge tone="primary">Popular</Badge>}
                  {!t.active && <Badge tone="neutral">Hidden</Badge>}
                </div>
                <p className="truncate text-xs text-ink-secondary">{t.category} · {t.format} · {t.id}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/admin/templates/${t.id}`} className="rounded-input p-1.5 text-ink-secondary hover:bg-black/[0.04]" title="Edit"><Pencil className="h-4 w-4" /></Link>
                <form action={toggleTemplateAction.bind(null, t.id)}>
                  <button type="submit" className="flex rounded-input p-1.5 text-ink-secondary hover:bg-black/[0.04]" title={t.active ? "Hide" : "Show"}>
                    {t.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </form>
                <form action={deleteTemplateAction.bind(null, t.id)}>
                  <button type="submit" className="flex rounded-input p-1.5 text-error hover:bg-error/10" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </form>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
