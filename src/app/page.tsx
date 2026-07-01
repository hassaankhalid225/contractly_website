import Link from "next/link";
import { ScanLine, PenTool, BellRing, FileText, Wallet, Globe, Check, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/motion";
import { PLANS } from "@/lib/constants";

const features = [
  { icon: ScanLine, title: "AI Contract Scanner", desc: "Spot risky clauses, missing protections, and unfair terms in seconds — in plain English." },
  { icon: PenTool, title: "Built-in E-Signature", desc: "Send a no-login signing link. Legally valid in 60+ countries with a full audit trail." },
  { icon: BellRing, title: "Smart Reminders", desc: "Never miss an expiry or payment. Automatic 30/14/7/1-day nudges keep you on track." },
  { icon: FileText, title: "AI Template Generator", desc: "Generate a complete, freelancer-protective contract for any kind of work." },
  { icon: Wallet, title: "Earnings Dashboard", desc: "Track paid, pending, and overdue income across every client and currency." },
  { icon: Globe, title: "Multi-Currency", desc: "Work in PKR, USD, AED, GBP, or EUR — with roll-ups in your home currency." },
];

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["3 active contracts", "Basic storage", "Manual reminders"],
  solo: ["Unlimited contracts", "AI contract scanner", "E-signature", "Smart reminders", "Earnings dashboard"],
  agency: ["Everything in Solo", "5 team seats", "White-label portal", "Local legal templates"],
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-subtle">
      {/* Ambient gradient glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-10%] -z-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] dark:bg-primary/25" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login"><Button variant="ghost">Log in</Button></Link>
          <Link href="/signup"><Button>Start Free</Button></Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <FadeIn>
          <Badge tone="primary" className="mb-4">Built for freelancers in emerging markets</Badge>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Your <span className="gradient-text">AI contract</span> wallet
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-secondary">
            Store, analyze, sign, and track every contract in one place. Replace WhatsApp screenshots
            and email threads with real legal protection — at a price built for you.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup"><Button size="lg">Start Free <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="#how"><Button size="lg" variant="outline">See how it works</Button></Link>
          </div>
          <p className="mt-3 text-sm text-ink-secondary">Free forever for up to 3 contracts · No credit card needed</p>
        </FadeIn>
      </section>

      <section id="how" className="relative mx-auto max-w-6xl px-4 py-8">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title} className="card p-3u transition-all duration-200 hover:-translate-y-1 hover:shadow-pop">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-card bg-primary-50 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-secondary">{f.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="relative mx-auto max-w-5xl px-4 py-20">
        <FadeIn>
          <h2 className="text-center text-3xl font-bold tracking-tight text-ink">Simple, honest pricing</h2>
          <p className="mt-2 text-center text-ink-secondary">4–5× cheaper than DocuSign, PandaDoc, or Bonsai.</p>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {Object.values(PLANS).map((plan, i) => (
            <FadeIn key={plan.id} delay={0.06 * i}>
              <div className={`card flex h-full flex-col p-3u ${plan.id === "solo" ? "ring-2 ring-primary" : ""}`}>
                {plan.id === "solo" && <Badge tone="primary" className="mb-2 self-start">Most popular</Badge>}
                <h3 className="text-lg font-semibold capitalize text-ink">{plan.name}</h3>
                <p className="mt-1 text-4xl font-bold tracking-tight text-ink">${plan.price}<span className="text-sm font-normal text-ink-secondary">/mo</span></p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-secondary">
                  {PLAN_FEATURES[plan.id].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {f}</li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-5 block">
                  <Button variant={plan.id === "solo" ? "primary" : "outline"} className="w-full">
                    {plan.id === "free" ? "Start free" : `Get ${plan.name}`}
                  </Button>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <footer className="relative border-t py-10 text-center text-sm text-ink-secondary">
        <Logo className="justify-center" />
        <p className="mt-3">© {new Date().getFullYear()} Contractly. E-signatures legally valid under ESIGN, eIDAS &amp; ETO 2002.</p>
      </footer>
    </div>
  );
}
