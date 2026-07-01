# Contractly — Codebase Guide

AI-powered contract wallet for freelancers (Next.js 14 App Router + TypeScript + Tailwind + Prisma). Source of truth for product scope: [`Docs/`](./Docs) (PRD, user flow, GTM). See [`README.md`](./README.md) for setup.

## Conventions

- **Feature-first modules** under `src/modules/<feature>/`: `repository.ts` (Prisma data access), `service.ts` (logic), `actions.ts` (`"use server"` mutations), and co-located UI (`*.tsx`). Don't put feature logic in `src/lib`.
- **`src/lib`** is cross-cutting infra only: `env.ts` (validated, gated), `prisma.ts`, `auth.ts` (JWT cookie sessions), `storage.ts`, `email.ts`, `constants.ts` (domain enums + design data), `utils.ts`.
- **Integrations are env-gated** via `features.*` in `src/lib/env.ts`. Every one has a local fallback (mock AI, console email, local file storage, mock Stripe checkout, SQLite). Keep this property — never hard-require a key.
- **Schema uses string columns for enum-like fields** (SQLite portability); canonical value sets live in `src/lib/constants.ts`. JSON payloads are stored as text and (de)serialized in repositories (`parseJson`, `decodeAnalysis`).
- **Auth**: `requireUser()` (`src/lib/session.ts`) guards server components/actions; redirects to `/login` then `/onboarding`.
- **Design tokens** live in `tailwind.config.ts`, sourced from the user-flow doc §9.2. Use `cn()` and the `ui/` primitives — don't hand-roll styles.
- **Models**: AI uses `ANTHROPIC_MODEL` (default `claude-sonnet-4-6`, a deliberate cost choice from the PRD). Change in `.env`, not code.

## Commands

`npm run dev` · `npm run build` · `npm run typecheck` · `npm run db:push` · `npm run db:seed`

Demo login: `hamza@demo.contractly.app` / `password123`
