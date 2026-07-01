import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4 py-10">
      <Link href="/" className="mb-6">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">
        <div className="card p-3u sm:p-4u">{children}</div>
      </div>
    </div>
  );
}
