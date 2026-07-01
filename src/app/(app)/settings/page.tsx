import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { updateProfileAction, logoutAction } from "@/modules/auth/actions";
import { cancelPlanAction } from "@/modules/billing/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/forms/submit-button";
import { CURRENCIES } from "@/lib/constants";
import { getPlanRow } from "@/modules/billing/plan";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: { searchParams: { saved?: string; canceled?: string } }) {
  const user = await requireUser();
  const plan = (await getPlanRow(user.plan)) ?? (await getPlanRow("free"));

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and subscription." />

      {searchParams.saved && <div className="mb-4 rounded-card bg-success/10 p-3 text-sm text-success">✓ Profile updated.</div>}
      {searchParams.canceled && <div className="mb-4 rounded-card bg-warning/10 p-3 text-sm text-warning">Your plan was cancelled. You&apos;re now on Free.</div>}

      <Card className="p-3u sm:p-4u">
        <h2 className="mb-3 text-base font-semibold text-ink">Profile</h2>
        <form action={updateProfileAction} className="space-y-3">
          <Input name="name" label="Display name" defaultValue={user.name} />
          <Input name="email" label="Email" defaultValue={user.email} disabled />
          <Input name="whatsapp" label="WhatsApp number" defaultValue={user.whatsapp ?? ""} placeholder="+92 300 1234567" />
          <Select name="defaultCurrency" label="Default currency" defaultValue={user.defaultCurrency}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>)}
          </Select>
          <SubmitButton>Save changes</SubmitButton>
        </form>
      </Card>

      <Card className="mt-4 p-3u sm:p-4u">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Subscription</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-ink-secondary">
              <Badge tone={user.plan === "free" ? "neutral" : "primary"}>{plan?.name ?? "Free"}</Badge>
              {(plan?.price ?? 0) > 0 ? `$${plan?.price}/month` : "Free forever"}
            </p>
          </div>
          {user.plan === "free" ? (
            <Link href="/upgrade"><Button>Upgrade</Button></Link>
          ) : (
            <form action={cancelPlanAction}>
              <Button type="submit" variant="outline">Cancel plan</Button>
            </form>
          )}
        </div>
      </Card>

      <Card className="mt-4 p-3u sm:p-4u">
        <h2 className="text-base font-semibold text-ink">Language</h2>
        <p className="mt-1 text-sm text-ink-secondary">English · Urdu (اردو) support coming at launch.</p>
      </Card>

      <div className="mt-6 flex justify-between">
        <form action={logoutAction}>
          <Button type="submit" variant="ghost">Log out</Button>
        </form>
        <span className="self-center text-xs text-ink-secondary">Contractly v1.0</span>
      </div>
    </div>
  );
}
