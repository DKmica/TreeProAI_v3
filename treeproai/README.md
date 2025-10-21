# TreeProAI Monorepo

This is the TreeProAI monorepo scaffold. It sets up PNPM workspaces, Turborepo, and shared configuration packages to support the MVP across Next.js, NestJS, Drizzle, and FastAPI services.

## Layout

/treeproai
- apps/
  - web/ (Next.js — added in Phase 5)
  - api/ (NestJS — added in Phase 2)
- packages/
  - config/ (shared ESLint, TS, Tailwind presets)
  - db/ (Drizzle schema — Phase 1)
  - ui/ (shared shadcn/ui — Phase 5)
  - sdk-js/ (typed REST client — Phase 5)
- services/
  - ai-vision/ (FastAPI — Phase 3)
  - ai-pricing/ (FastAPI — Phase 3)
- infra/
  - docker/ (Dockerfiles — Phase 9)
  - deploy/ (Fly/Railway/GitHub Actions — Phase 9)
- tools/
  - scripts/ (seeders/CLIs — later)
- .env.example (Phase 9)
- pnpm-workspace.yaml
- turbo.json
- package.json

## Phase 0 — Bootstrap & Tooling

- PNPM workspace and Turborepo configured
- Shared config package prepared (ESLint, TS, Tailwind presets)
- Ready to add DB (Phase 1), API (Phase 2), AI services (Phase 3)

### Commands (run from /treeproai)

- Install deps for the workspace:
  - pnpm i

- Lint and typecheck the workspace:
  - pnpm -w lint
  - pnpm -w typecheck

- Initialize shadcn in the web app in Phase 5:
  - pnpm dlx shadcn@latest init

### DONE WHEN

- pnpm -w lint and pnpm -w typecheck both succeed with no errors.

### Notes

This phase does not include app packages yet, so Turbo will run with no targets and exit successfully. Subsequent phases add apps, packages, and services incrementally.

## Phase 1 — Database & Drizzle

- Postgres + Drizzle ORM schema and migrations
- Multi-tenant (company_id) on all tables, with indexes on company_id, status, created_at
- PII (email, phone) encrypted at rest via AES-256-GCM; searchable via sha256 hash columns
- Seed script creates a demo company, 4 users (OWNER/MANAGER/SALES/CREW), 10 customers, 20 leads, one crew and equipment

### Files

- packages/db: drizzle.config.ts, schema/*.ts (companies, users, customers, leads, addresses, quote_requests, quotes, quote_items, jobs, crews, equipment, invoices, payments, attachments, tenant_settings, webhooks)
- packages/db/src: index.ts (client), crypto.ts (PII helpers)
- packages/db/seeds/seed.ts
- packages/db/tests/crypto.test.ts
- .env.example (DATABASE_URL, PII_ENCRYPTION_KEY, etc.)

### Commands (run from /treeproai)

- Install workspace deps:
  - pnpm i

- Set local env (copy .env.example → .env and adjust as needed)

- Generate migrations from schema:
  - pnpm db:generate

- Apply migrations:
  - pnpm db:migrate

- Seed demo data:
  - pnpm db:seed

- Verify lint/type/tests:
  - pnpm -w lint
  - pnpm -w typecheck
  - pnpm -w test

### DONE WHEN

- Migrations run with tables present in Postgres
- Seed script prints the demo company_id and inserts users/customers/leads
- Lint, typecheck, and tests pass at the workspace root

### Notes

- PII encryption uses env PII_ENCRYPTION_KEY (base64 of 32 bytes). The default in .env.example is for local only.
- IDs are generated in the app/seed using UUIDs; DB defaults are not used to avoid extension requirements.
- Attachments store S3 keys only; uploads are presigned and never proxied via API.