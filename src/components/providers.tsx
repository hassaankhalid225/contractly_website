"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/** App-wide client providers: theme (dark mode), tooltips, and toasts. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "rounded-card border bg-surface text-ink shadow-pop",
            description: "text-ink-secondary",
          },
        }}
        closeButton
        richColors
      />
    </ThemeProvider>
  );
}
