import type { Metadata } from "next";
import { Shield, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { listPlans } from "@/modules/billing/plan";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { setUserPlanAction, setUserRoleAction, toggleSuspendAction, deleteUserAction } from "@/modules/admin/actions";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Users" };

export default async function AdminUsersPage() {
  const [users, plans] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { contracts: true } } } }),
    listPlans({ activeOnly: false }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Users" description={`${users.length} registered ${users.length === 1 ? "user" : "users"}.`} />

      <Card className="divide-y divide-black/[0.06]">
        {users.map((u) => (
          <div key={u.id} className="flex flex-col gap-3 p-3u sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar name={u.name} src={u.photoUrl} size={38} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-ink">{u.name}</p>
                  {u.role === "admin" && <Badge tone="primary"><Shield className="mr-1 h-3 w-3" />Admin</Badge>}
                  {u.suspended && <Badge tone="error">Suspended</Badge>}
                </div>
                <p className="truncate text-xs text-ink-secondary">{u.email} · {u._count.contracts} contracts · joined {formatDate(u.createdAt)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <form action={setUserPlanAction} className="flex items-center gap-1">
                <input type="hidden" name="userId" value={u.id} />
                <select name="plan" defaultValue={u.plan} className="input-base h-8 w-28 py-0 text-xs">
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button type="submit" className="rounded-input bg-primary-50 px-2 py-1 text-xs font-medium text-primary">Set</button>
              </form>

              <form action={setUserRoleAction.bind(null, u.id, u.role === "admin" ? "user" : "admin")}>
                <button type="submit" className="rounded-input px-2 py-1 text-xs text-ink-secondary hover:bg-black/[0.04]">
                  {u.role === "admin" ? "Make user" : "Make admin"}
                </button>
              </form>

              <form action={toggleSuspendAction.bind(null, u.id)}>
                <button type="submit" className="flex items-center gap-1 rounded-input px-2 py-1 text-xs text-ink-secondary hover:bg-black/[0.04]" title={u.suspended ? "Unsuspend" : "Suspend"}>
                  {u.suspended ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                </button>
              </form>

              <form action={deleteUserAction.bind(null, u.id)}>
                <button type="submit" className="flex items-center gap-1 rounded-input px-2 py-1 text-xs text-error hover:bg-error/10" title="Delete user">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
