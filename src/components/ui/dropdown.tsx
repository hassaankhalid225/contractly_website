"use client";
import * as React from "react";
import * as DM from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const Dropdown = DM.Root;
export const DropdownTrigger = DM.Trigger;

export function DropdownContent({
  children,
  align = "end",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <DM.Portal>
      <DM.Content
        align={align}
        sideOffset={8}
        className={cn(
          "z-50 min-w-[200px] origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-card border bg-surface p-1.5 shadow-pop",
          "data-[state=open]:animate-scale-in",
          className,
        )}
      >
        {children}
      </DM.Content>
    </DM.Portal>
  );
}

export function DropdownItem({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DM.Item>) {
  return (
    <DM.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-input px-2.5 py-2 text-sm text-ink outline-none",
        "transition-colors focus:bg-surface-subtle data-[highlighted]:bg-surface-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </DM.Item>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <DM.Label className="px-2.5 py-1.5 text-xs font-medium text-ink-secondary">{children}</DM.Label>;
}

export function DropdownSeparator() {
  return <DM.Separator className="my-1 h-px bg-line/60" />;
}
