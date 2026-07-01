# Contractly

**AI-powered contract wallet for freelancers in emerging markets.** Store, analyze, sign, track, and manage contracts in one place — built per the product, user-flow, and go-to-market docs in [`Docs/`](./Docs).

Full-stack **Next.js 14 (App Router) + TypeScript + Tailwind + Prisma**, with a modular, feature-first architecture. Every external integration (Claude AI, Stripe, Resend email, S3/R2 storage) is **env-gated with a working local fallback**, so the entire app runs end-to-end with zero keys.

---

## Quick start

```bash
npm install
npm run db:push      # create the SQLite schema (prisma/dev.db)
npm run db:seed      # seed the demo freelancer + sample contracts
npm run dev          # http://localhost:3000
```

**Demo login:** `hamza@demo.contractly.app` / `password123`

No `.env` editing needed — a working dev `.env` (SQLite + dev session secret) ships in the repo. Add real keys (see [`.env.example`](./.env.example)) to enable the live integrations.

---

## What runs without any API keys

| Capability | With keys | Fallback (no keys) |
|---|---|---|
| AI contract scan & template drafting | Claude (`claude-sonnet-4-6`, per PRD) | Deterministic keyword-based analysis / templated contract |
| Email (signature requests, signed copies) | Resend | Logged to the server console |
| File storage (uploads, signed PDFs) | S3 / Cloudflare R2 | Local `.storage/` directory |
| Payments / upgrades | Stripe Checkout + webhook | Mock checkout (upgrade applied instantly) |
| Database | PostgreSQL | SQLite (`prisma/dev.db`) |

---

## Architecture

```
src/
  app/                      # Next.js App Router
    (auth)/                 # signup, login (no app shell)
    (app)/                  # dashboard, contracts, earnings, reminders, settings (app shell)
    onboarding/             # 4-step survey + profile
    sign/[token]/           # public, no-login client signing (Flow 5)
    upgrade/                # paywall + success (Flow 8)
    api/                    # files, earnings export, stripe webhook
  modules/                  # feature-first business logic
    auth/                   # session actions, forms, onboarding wizard
    contracts/              # repository, upload/template actions, text extraction, UI
    ai/                     # Claude client + prompts + deterministic fallback
    signature/             # request/sign service, signed-PDF builder, emails
    reminders/              # repository + actions
    earnings/               # aggregation service + chart + CSV
    billing/                # plans, feature gates, Stripe checkout
  components/               # design system (ui/), layout (app shell), forms, brand
  lib/                      # env, prisma, auth (JWT cookies), storage, email, utils, constants
prisma/                     # schema + seed
```

**Design principles**

- **Feature modules own their domain** — repository (data), service (logic), actions (`"use server"`), and UI live together under `src/modules/<feature>`.
- **`src/lib`** holds cross-cutting infrastructure only (env, db, auth, storage, email, design tokens).
- **Design tokens** (colors, radii, shadows, spacing) come straight from the user-flow doc §9.2 and live in [`tailwind.config.ts`](./tailwind.config.ts).
- **Server Actions** drive every mutation; pages are React Server Components that read through repositories.

---

## Implemented user flows (from the User Flow doc)

1. **Onboarding & registration** — email/password + Google (demo) OAuth, 4-step survey, profile setup.
2. **Contract upload & AI analysis** — drag/drop upload, text extraction, risk score, clause breakdown, red flags, missing clauses.
3. **Contract creation from template** — AI-drafted, freelancer-protective contracts by work type.
4. **E-signature (freelancer → client)** — sign first, send a tracked no-login link, revoke/resend.
5. **Client signs (no-app)** — browser signing (draw/type), audit trail (name, IP, timestamp), signed PDF emailed to both, **viral-loop CTA**.
6. **Smart reminders** — auto 30/14/7/1-day expiry ladder + custom milestones, snooze/done hub.
7. **Earnings dashboard** — total/this-month/pending/overdue, 6-month chart, per-contract breakdown, CSV export.
8. **Subscription upgrade** — plan comparison, monthly/annual toggle, feature gating (3-contract free cap, AI scan = Solo).
9. **Settings** — profile, currency, plan management, logout.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Sync schema to the database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio |

---

## Deploying to production

1. **Database** — set `provider = "postgresql"` in [`prisma/schema.prisma`](./prisma/schema.prisma) and point `DATABASE_URL` at Postgres, then `npm run db:migrate`.
2. **Keys** — fill the integration vars in `.env` (see `.env.example`): `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `STORAGE_*`, `STRIPE_*`, and a strong `AUTH_SECRET`.
3. **Stripe webhook** — point it at `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.
4. **Host** — Vercel (frontend + API) per the PRD's recommended stack.

### Notes & follow-ups

- **PDF/image text extraction** is best-effort (DOCX/text inline). For production, send PDFs to Claude as document blocks, or add `pdf-parse`/OCR — see `src/modules/contracts/extract-text.ts`.
- **File access** is by-possession-of-unguessable-key. To harden, gate upload keys on the authenticated owner in `src/app/api/files/[...key]/route.ts`.
- **FX rates** for multi-currency roll-ups are static indicative values in `src/lib/constants.ts`; wire a live FX provider for production.
- **Storage S3 driver** lazy-imports `@aws-sdk/client-s3` — `npm i @aws-sdk/client-s3` when enabling cloud storage.
