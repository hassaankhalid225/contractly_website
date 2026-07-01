"use client";
import * as React from "react";
import * as RT from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = RT.Provider;

/** Accessible tooltip. Pass `label` and wrap the trigger element as children. */
export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <RT.Root>
      <RT.Trigger asChild>{children}</RT.Trigger>
      <RT.Portal>
        <RT.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-50 rounded-input bg-ink px-2.5 py-1.5 text-xs font-medium text-surface shadow-pop",
            "data-[state=delayed-open]:animate-scale-in",
          )}
        >
          {label}
          <RT.Arrow className="fill-ink" />
        </RT.Content>
      </RT.Portal>
    </RT.Root>
  );
}
