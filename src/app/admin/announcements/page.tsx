import type { Metadata } from "next";
import { Eye, EyeOff, Trash2, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { listAnnouncements } from "@/modules/announcements/service";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Select } from "@/components/ui/input";
import { saveAnnouncementAction, toggleAnnouncementAction, deleteAnnouncementAction } from "@/modules/admin/actions";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Announcements" };

const TYPE_ICON = { info: Info, warning: AlertTriangle, success: CheckCircle2 } as const;

export default async function AdminAnnouncementsPage() {
  const items = await listAnnouncements();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Announcements" description="Post a banner shown to every user across the app." />

      <Card className="mb-6 p-3u sm:p-4u">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-secondary">New announcement</h2>
        <form action={saveAnnouncementAction} className="space-y-3">
          <Input name="title" label="Title" required placeholder="New feature: PDF templates" />
          <Textarea name="body" label="Message" required placeholder="Describe the announcement…" />
          <Select name="type" label="Type" defaultValue="info" className="sm:max-w-xs">
            <option value="info">Info (purple)</option>
            <option value="success">Success (green)</option>
            <option value="warning">Warning (amber)</option>
          </Select>
          <button type="submit" className="rounded-input bg-primary px-4 py-2 text-sm font-medium text-primary-fg">Publish</button>
        </form>
      </Card>

      {items.length === 0 ? (
        <p className="card p-6 text-center text-sm text-ink-secondary">No announcements yet.</p>
      ) : (
        <Card className="divide-y divide-black/[0.06]">
          {items.map((a) => {
            const Icon = TYPE_ICON[a.type as keyof typeof TYPE_ICON] ?? Info;
            return (
              <div key={a.id} className="flex items-start gap-3 p-3u">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-secondary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{a.title}</p>
                    {a.active ? <Badge tone="success">Live</Badge> : <Badge tone="neutral">Hidden</Badge>}
                  </div>
                  <p className="text-sm text-ink-secondary">{a.body}</p>
                  <p className="mt-1 text-xs text-ink-secondary">{formatDate(a.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={toggleAnnouncementAction.bind(null, a.id)}>
                    <button type="submit" className="flex rounded-input p-1.5 text-ink-secondary hover:bg-black/[0.04]" title={a.active ? "Hide" : "Show"}>
                      {a.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </form>
                  <form action={deleteAnnouncementAction.bind(null, a.id)}>
                    <button type="submit" className="flex rounded-input p-1.5 text-error hover:bg-error/10" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </form>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
