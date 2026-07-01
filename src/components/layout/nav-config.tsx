import { LayoutDashboard, FileText, LayoutTemplate, Wallet, Bell, Settings, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/earnings", label: "Earnings", icon: Wallet },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];
