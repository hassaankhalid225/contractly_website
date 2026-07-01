"use client";
import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, FileText, Wallet, Bell, Settings, Sparkles,
  Upload, Moon, Sun, Search, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string; clientName: string };

export function CommandPalette({ contracts }: { contracts: Item[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Allow other components (top bar buttons) to open the palette.
  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("contractly:open-command", handler);
    return () => window.removeEventListener("contractly:open-command", handler);
  }, []);

  // Lock scroll while open.
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const go = (href: string) => { setOpen(false); router.push(href); };

  const nav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Contracts", href: "/contracts", icon: FileText },
    { label: "Earnings", href: "/earnings", icon: Wallet },
    { label: "Reminders", href: "/reminders", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute left-1/2 top-[16%] w-[92vw] max-w-xl -translate-x-1/2 animate-scale-in">
        <Command className="overflow-hidden rounded-card border bg-surface shadow-pop" loop>
          <div className="flex items-center gap-2 border-b px-4">
            <Search className="h-4 w-4 text-ink-secondary" />
            <Command.Input
              autoFocus
              placeholder="Search contracts, jump to a page…"
              className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-secondary/70"
            />
            <kbd className="rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] text-ink-secondary">ESC</kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-ink-secondary">No results found.</Command.Empty>

            <Group heading="Quick actions">
              <Row icon={Sparkles} onSelect={() => go("/contracts/new/template")} value="create template new contract">Create from template</Row>
              <Row icon={Upload} onSelect={() => go("/contracts/new/upload")} value="upload analyze contract">Upload &amp; analyze a contract</Row>
              <Row icon={ArrowUpRight} onSelect={() => go("/upgrade")} value="upgrade plan billing">Upgrade plan</Row>
            </Group>

            <Group heading="Go to">
              {nav.map((n) => (
                <Row key={n.href} icon={n.icon} onSelect={() => go(n.href)} value={n.label}>{n.label}</Row>
              ))}
            </Group>

            {contracts.length > 0 && (
              <Group heading="Contracts">
                {contracts.map((c) => (
                  <Row key={c.id} icon={FileText} onSelect={() => go(`/contracts/${c.id}`)} value={`${c.title} ${c.clientName}`}>
                    <span className="flex-1 truncate">{c.title}</span>
                    <span className="truncate text-xs text-ink-secondary">{c.clientName}</span>
                  </Row>
                ))}
              </Group>
            )}

            <Group heading="Theme">
              <Row icon={resolvedTheme === "dark" ? Sun : Moon} value="toggle theme dark light mode" onSelect={() => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); setOpen(false); }}>
                Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
              </Row>
            </Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-ink-secondary"
    >
      {children}
    </Command.Group>
  );
}

function Row({
  icon: Icon, children, onSelect, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onSelect: () => void;
  value?: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-input px-3 py-2 text-sm text-ink",
        "data-[selected=true]:bg-surface-subtle",
      )}
    >
      <Icon className="h-4 w-4 text-ink-secondary" />
      {children}
    </Command.Item>
  );
}
