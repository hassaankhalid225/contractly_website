"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as React from "react";
import { Plus, Search, Bell, LogOut, Sparkles, ChevronsUpDown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tooltip } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/ui/command-palette";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/dropdown";
import { AnnouncementBanner } from "@/modules/announcements/announcement-banner";
import { NAV_ITEMS } from "./nav-config";
import { logoutAction } from "@/modules/auth/actions";

export type ShellUser = { name: string; email: string; photoUrl?: string | null; plan: string; isAdmin?: boolean };
type PaletteContract = { id: string; title: string; clientName: string };
type Announcement = { id: string; title: string; body: string; type: string };

export function AppShell({
  user,
  reminderCount = 0,
  contracts = [],
  announcements = [],
  children,
}: {
  user: ShellUser;
  reminderCount?: number;
  contracts?: PaletteContract[];
  announcements?: Announcement[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const openCommand = () => window.dispatchEvent(new Event("contractly:open-command"));

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <CommandPalette contracts={contracts} />

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-surface px-3 py-4 lg:flex">
        <Link href="/dashboard" className="mb-6 px-2">
          <Logo />
        </Link>

        <button
          onClick={openCommand}
          className="mb-4 flex items-center gap-2 rounded-input border bg-surface-subtle px-3 py-2 text-sm text-ink-secondary transition hover:border-primary/40"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded bg-surface px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-input px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-ink-secondary hover:bg-black/[0.04] hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-input bg-primary-50"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="relative h-[18px] w-[18px]" />
                <span className="relative">{item.label}</span>
                {item.href === "/reminders" && reminderCount > 0 && (
                  <Badge tone="primary" className="relative ml-auto">{reminderCount}</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <PlanCard plan={user.plan} />
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b glass px-2u">
          <Link href="/dashboard" className="lg:hidden"><Logo showText={false} /></Link>
          <button
            onClick={openCommand}
            className="hidden max-w-md flex-1 items-center gap-2 rounded-input bg-surface-subtle px-3 py-1.5 text-sm text-ink-secondary transition hover:ring-1 hover:ring-primary/30 sm:flex"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search contracts, clients…</span>
            <kbd className="rounded bg-surface px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button onClick={openCommand} className="flex h-9 w-9 items-center justify-center rounded-input text-ink-secondary hover:bg-black/[0.04] hover:text-ink sm:hidden" aria-label="Search">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <ThemeToggle />
            <Tooltip label="Reminders">
              <Link href="/reminders" className="relative flex h-9 w-9 items-center justify-center rounded-input text-ink-secondary hover:bg-black/[0.04] hover:text-ink" aria-label="Reminders">
                <Bell className="h-[18px] w-[18px]" />
                {reminderCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-surface" />}
              </Link>
            </Tooltip>

            <Dropdown>
              <DropdownTrigger asChild>
                <button className="ml-1 flex items-center gap-2 rounded-input p-0.5 pr-1.5 hover:bg-black/[0.04]" aria-label="Account menu">
                  <Avatar name={user.name} src={user.photoUrl} size={32} />
                  <ChevronsUpDown className="hidden h-3.5 w-3.5 text-ink-secondary sm:block" />
                </button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>
                  <span className="block truncate font-medium text-ink">{user.name}</span>
                  <span className="block truncate font-normal">{user.email}</span>
                </DropdownLabel>
                <DropdownSeparator />
                <ProfileLinks plan={user.plan} isAdmin={user.isAdmin} />
                <DropdownSeparator />
                <form action={logoutAction}>
                  <DropdownItem asChild>
                    <button type="submit" className="w-full text-error data-[highlighted]:bg-error/10">
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </DropdownItem>
                </form>
              </DropdownContent>
            </Dropdown>
          </div>
        </header>

        <AnnouncementBanner items={announcements} />

        <main className="flex-1 px-2u pb-24 pt-2u lg:px-4u lg:pb-10">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t glass px-2 py-1.5 lg:hidden">
          {BOTTOM_NAV.slice(0, 2).map((href) => {
            const n = NAV_ITEMS.find((x) => x.href === href)!;
            return <BottomLink key={href} item={n} active={isActive(href)} />;
          })}
          <Link href="/contracts/new" className="-mt-7 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-fg shadow-pop active:scale-95" aria-label="Add contract">
            <Plus className="h-6 w-6" />
          </Link>
          {BOTTOM_NAV.slice(2).map((href) => {
            const n = NAV_ITEMS.find((x) => x.href === href)!;
            return <BottomLink key={href} item={n} active={isActive(href)} />;
          })}
        </nav>
      </div>
    </div>
  );
}

const BOTTOM_NAV = ["/dashboard", "/contracts", "/earnings", "/reminders"];

function BottomLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  return (
    <Link href={item.href} className={cn("flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] transition-colors", active ? "text-primary" : "text-ink-secondary")}>
      <item.icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

function ProfileLinks({ plan, isAdmin }: { plan: string; isAdmin?: boolean }) {
  return (
    <>
      <DropdownItem asChild>
        <Link href="/settings"><Sparkles className="h-4 w-4 text-ink-secondary" /> Settings</Link>
      </DropdownItem>
      {isAdmin && (
        <DropdownItem asChild>
          <Link href="/admin" className="text-primary"><Shield className="h-4 w-4" /> Admin panel</Link>
        </DropdownItem>
      )}
      {plan === "free" && (
        <DropdownItem asChild>
          <Link href="/upgrade" className="text-primary"><Sparkles className="h-4 w-4" /> Upgrade to Solo</Link>
        </DropdownItem>
      )}
    </>
  );
}

function PlanCard({ plan }: { plan: string }) {
  if (plan !== "free") {
    return (
      <div className="rounded-card bg-primary-50 p-3 text-sm">
        <p className="font-semibold capitalize text-primary">{plan} plan</p>
        <p className="text-xs text-ink-secondary">All features unlocked</p>
      </div>
    );
  }
  return (
    <Link href="/upgrade" className="block overflow-hidden rounded-card bg-gradient-to-br from-primary to-primary-700 p-3 text-white transition active:scale-[0.98]">
      <p className="flex items-center gap-1.5 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Upgrade to Solo</p>
      <p className="text-xs text-white/80">Unlock AI scan &amp; unlimited contracts</p>
    </Link>
  );
}
