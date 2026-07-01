"use client";
import * as React from "react";
import Link from "next/link";
import { Search, Sparkles, ArrowRight, Clock, SlidersHorizontal, Star } from "lucide-react";
import { templateIcon } from "./template-icons";
import { TEMPLATE_CATEGORIES } from "./registry";
import type { ContractTemplate } from "./types";
import { cn } from "@/lib/utils";

type GalleryTemplate = Pick<ContractTemplate, "id" | "name" | "category" | "icon" | "tagline" | "popular" | "fillMinutes"> & {
  fieldCount?: number;
};

// 8+ collected inputs marks an in-depth, premium-grade template.
const PREMIUM_FIELD_THRESHOLD = 8;
const isPremium = (t: GalleryTemplate) => (t.fieldCount ?? 0) >= PREMIUM_FIELD_THRESHOLD;

const PREMIUM = "Premium";

export function TemplateGallery({ templates }: { templates: GalleryTemplate[] }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { All: templates.length };
    map[PREMIUM] = templates.filter(isPremium).length;
    for (const c of TEMPLATE_CATEGORIES) map[c] = templates.filter((t) => t.category === c).length;
    return map;
  }, [templates]);

  const filtered = templates.filter((t) => {
    const matchesCat = cat === "All" || (cat === PREMIUM ? isPremium(t) : t.category === cat);
    const matchesQ = !q || (t.name + t.tagline + t.category).toLowerCase().includes(q.toLowerCase());
    return matchesCat && matchesQ;
  });

  const popularCount = templates.filter((t) => t.popular).length;

  return (
    <div>
      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search premium templates…"
            className="input-base pl-9"
            aria-label="Search templates"
          />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {["All", PREMIUM, ...TEMPLATE_CATEGORIES].map((c) => {
            const active = cat === c;
            const premiumTab = c === PREMIUM;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "group flex shrink-0 items-center rounded-pill border px-3 py-1.5 text-sm transition",
                  active
                    ? premiumTab
                      ? "border-primary bg-primary text-primary-fg shadow-sm"
                      : "border-primary bg-primary-50 text-primary shadow-sm"
                    : premiumTab
                      ? "border-primary/40 bg-gradient-to-r from-primary-50 to-primary-50/40 text-primary hover:border-primary/60"
                      : "text-ink-secondary hover:border-primary/40 hover:text-ink",
                )}
              >
                {premiumTab && <Sparkles className={cn("mr-1 h-3.5 w-3.5", active ? "text-primary-fg" : "text-primary")} />}
                {c}
                <span
                  className={cn(
                    "ml-1.5 text-xs",
                    active ? (premiumTab ? "text-primary-fg/80" : "text-primary/70") : "text-ink-secondary/60",
                  )}
                >
                  {counts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI custom callout */}
      <Link
        href="/contracts/new/template/ai-custom"
        className="group relative mb-4 flex items-center gap-3 overflow-hidden rounded-card border border-primary/30 bg-gradient-to-r from-primary-50/80 to-primary-50/30 p-3u transition hover:shadow-pop"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary text-primary-fg shadow-sm">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">Need something custom?</p>
          <p className="text-sm text-ink-secondary">Let AI draft a bespoke, freelancer-protective contract for any kind of work.</p>
        </div>
        <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-0.5" />
      </Link>

      {/* Result meta */}
      <div className="mb-3 flex items-center justify-between text-xs text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {filtered.length} template{filtered.length === 1 ? "" : "s"}{cat !== "All" ? ` in ${cat}` : ""}
        </span>
        {cat === "All" && popularCount > 0 && (
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current text-primary" /> {popularCount} popular</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="card p-6 text-center text-sm text-ink-secondary">No templates match your search.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => {
            const Icon = templateIcon(t.icon);
            const isPremium = (t.fieldCount ?? 0) >= PREMIUM_FIELD_THRESHOLD;
            return (
              <Link
                key={t.id}
                href={`/contracts/new/template/${t.id}`}
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                className={cn(
                  "group relative flex h-full animate-fade-up flex-col overflow-hidden rounded-card border p-3u transition-all duration-200 hover:-translate-y-1 hover:shadow-pop",
                  isPremium
                    ? "border-primary/30 bg-gradient-to-b from-primary-50/50 to-surface ring-1 ring-primary/15 hover:border-primary/50 hover:ring-primary/30"
                    : "border-line bg-surface shadow-card hover:border-primary/40",
                )}
              >
                {/* Premium top accent bar */}
                {isPremium && <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-600 to-primary" />}

                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-card transition",
                      isPremium
                        ? "bg-gradient-to-br from-primary to-primary-600 text-primary-fg shadow-sm ring-1 ring-primary/30"
                        : "bg-gradient-to-br from-primary-50 to-primary-100 text-primary ring-1 ring-primary/10 group-hover:ring-primary/30",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    {t.popular && (
                      <span className="rounded-pill bg-ink/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-secondary">
                        Popular
                      </span>
                    )}
                    {isPremium && (
                      <span className="flex items-center gap-1 rounded-pill bg-gradient-to-r from-primary to-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-fg shadow-sm">
                        <Sparkles className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold leading-snug text-ink">{t.name}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-secondary">{t.tagline}</p>

                <div className={cn("mt-3 flex items-center justify-between border-t pt-2.5 text-xs", isPremium ? "border-primary/15" : "border-line/60")}>
                  <span className="font-medium text-ink-secondary">{t.category}</span>
                  <span className="flex items-center gap-2.5 text-ink-secondary">
                    {t.fieldCount ? (
                      <span className={isPremium ? "font-medium text-primary" : ""}>{t.fieldCount} fields</span>
                    ) : null}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{t.fillMinutes ?? 2} min</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
