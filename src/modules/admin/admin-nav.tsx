"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, LayoutTemplate, Megaphone, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export function AdminNav() {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={cn(
            "flex items-center gap-3 rounded-input px-3 py-2 text-sm font-medium transition-colors",
            active(i.href, i.exact) ? "bg-primary-50 text-primary" : "text-ink-secondary hover:bg-black/[0.04] hover:text-ink",
          )}
        >
          <i.icon className="h-[18px] w-[18px]" /> {i.label}
        </Link>
      ))}
      <Link href="/dashboard" className="mt-2 flex items-center gap-3 rounded-input px-3 py-2 text-sm text-ink-secondary hover:bg-black/[0.04]">
        <ArrowLeft className="h-[18px] w-[18px]" /> Back to app
      </Link>
    </nav>
  );
}
