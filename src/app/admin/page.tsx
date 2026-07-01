import type { Metadata } from "next";
import Link from "next/link";
import { Users, FileText, LayoutTemplate, CreditCard, Megaphone, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin · Overview" };

export default async function AdminDashboard() {
  const [users, contracts, templates, activeTemplates, plans, announcements, signed] = await Promise.all([
    prisma.user.count(),
    prisma.contract.count(),
    prisma.template.count(),
    prisma.template.count({ where: { active: true } }),
    prisma.plan.count({ where: { active: true } }),
    prisma.announcement.count({ where: { active: true } }),
    prisma.contract.count({ where: { status: "signed" } }),
  ]);

  const paidUsers = await prisma.user.count({ where: { plan: { not: "free" } } });

  const stats = [
    { label: "Total users", value: users, icon: Users, href: "/admin/users" },
    { label: "Paid users", value: paidUsers, icon: CreditCard, href: "/admin/users" },
    { label: "Contracts", value: contracts, icon: FileText, href: null },
    { label: "Signed", value: signed, icon: FileText, href: null },
    { label: "Templates", value: `${activeTemplates}/${templates}`, icon: LayoutTemplate, href: "/admin/templates" },
    { label: "Active plans", value: plans, icon: CreditCard, href: "/admin/plans" },
    { label: "Announcements", value: announcements, icon: Megaphone, href: "/admin/announcements" },
  ];

  const quick = [
    { label: "Manage users", desc: "Change plans, roles & access", href: "/admin/users", icon: Users },
    { label: "Edit plans", desc: "Pricing, limits & features (live gating)", href: "/admin/plans", icon: CreditCard },
    { label: "Manage templates", desc: "Add, edit & toggle contract templates", href: "/admin/templates", icon: LayoutTemplate },
    { label: "Post announcement", desc: "Show a banner to all users", href: "/admin/announcements", icon: Megaphone },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Admin overview" description="Manage users, plans, templates, and announcements." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-3u">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-secondary">{s.label}</p>
              <s.icon className="h-4 w-4 text-ink-secondary" />
            </div>
            <p className="mt-1 text-2xl font-bold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-6 text-lg font-semibold text-ink">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className="card group flex items-center gap-3 p-3u transition hover:shadow-pop">
            <span className="flex h-10 w-10 items-center justify-center rounded-card bg-primary-50 text-primary"><q.icon className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{q.label}</p>
              <p className="text-sm text-ink-secondary">{q.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-secondary opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
