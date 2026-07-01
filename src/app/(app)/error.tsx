"use client";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production, forward to your error tracker (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-1 max-w-sm text-sm text-ink-secondary">
        An unexpected error occurred. You can try again — your data is safe.
      </p>
      <Button onClick={reset} className="mt-5">
        <RotateCcw className="h-4 w-4" /> Try again
      </Button>
      {error.digest && <p className="mt-3 text-xs text-ink-secondary">Reference: {error.digest}</p>}
    </div>
  );
}
