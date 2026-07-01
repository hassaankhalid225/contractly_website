"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Tooltip } from "./tooltip";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  return (
    <Tooltip label={isDark ? "Light mode" : "Dark mode"}>
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex h-9 w-9 items-center justify-center rounded-input text-ink-secondary transition-colors hover:bg-black/[0.04] hover:text-ink"
      >
        {mounted ? (
          isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
        ) : (
          <span className="h-[18px] w-[18px]" />
        )}
      </button>
    </Tooltip>
  );
}
