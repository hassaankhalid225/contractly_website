import Link from "next/link";
import { Shield } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/modules/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-surface-subtle lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-surface p-3 lg:flex">
        <Link href="/admin" className="mb-2 flex items-center gap-2 px-2">
          <Logo showText={false} />
          <span className="font-semibold text-ink">Admin</span>
          <Badge tone="primary" className="ml-auto"><Shield className="mr-1 h-3 w-3" />Admin</Badge>
        </Link>
        <div className="mt-4">
          <AdminNav />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Mobile header */}
        <header className="flex items-center gap-2 border-b glass px-2u py-3 lg:hidden">
          <Link href="/admin"><Logo showText={false} /></Link>
          <span className="font-semibold">Admin</span>
          <Link href="/dashboard" className="ml-auto text-sm text-primary">← App</Link>
        </header>
        <main className="flex-1 px-2u py-2u lg:px-4u lg:py-4u">{children}</main>
      </div>
    </div>
  );
}
