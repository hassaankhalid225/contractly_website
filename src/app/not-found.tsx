import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4 text-center">
      <Logo className="mb-8" />
      <p className="gradient-text text-7xl font-bold">404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-1 max-w-sm text-sm text-ink-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button size="lg">Back to dashboard</Button>
      </Link>
    </div>
  );
}
