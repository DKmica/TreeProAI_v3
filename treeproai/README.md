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

## Phase 2 — Backend API (NestJS)

- NestJS app with health endpoints, Clerk auth (with local dev fallback), tenant scoping via x-company-id, RBAC guards, and OpenAPI docs.
- Core endpoints implemented: 
  - GET /healthz, GET /readyz
  - GET /docs (OpenAPI)
  - GET /v1/me
  - POST /v1/uploads/presign
  - POST/GET /v1/customers
  - POST/GET /v1/leads

### Files

- apps/api: package.json, tsconfig.json, eslint.config.mjs
- src: main.ts, app.module.ts
- src/config/env.ts
- src/common: middleware/tenant.middleware.ts, guards/{auth.guard.ts, rbac.guard.ts}, decorators/roles.decorator.ts
- src/modules: health, auth (/me), uploads (/uploads/presign), customers, leads
- tests: env.test.ts, rbac.test.ts

### Commands (run from /treeproai)

- Install deps:
  - pnpm i

- Typecheck and test:
  - pnpm -w typecheck
  - pnpm -w test

- Run API:
  - pnpm --filter @treeproai/api dev
  - Visit: 
    - http://localhost:4000/healthz
    - http://localhost:4000/docs

- Example: presign upload (dev mode)
  - Headers: x-company-id: DEMO-COMPANY, x-dev-user: dev1, x-role: OWNER
  - POST http://localhost:4000/v1/uploads/presign
  - Body: { "filename": "photo.jpg", "contentType": "image/jpeg" }

### DONE WHEN

- API starts and /healthz returns { ok: true }
- /docs is available and shows the defined routes
- /v1/me returns the provided x-dev-user and company ID in dev mode
- /v1/uploads/presign returns a signed URL for PUT with your configured S3/MinIO
- Creating/listing customers and leads work and are scoped by x-company-id

### Notes

- In local dev without Clerk keys, supply x-dev-user and x-role headers; with Clerk keys set, pass a real Bearer token and x-role for RBAC.
- All create/list operations are tenant-scoped via the x-company-id header.

## Phase 3 — AI Services Scaffolds (FastAPI)

- Two FastAPI services with health checks, OpenAPI docs, and deterministic fallbacks.
- ai-vision: tree detection heuristics using EXIF and reference scaling.
- ai-pricing: deterministic pricing math and lead scoring.

### Files

- services/ai-vision/app.py with POST /analyze
- services/ai-pricing/app.py with POST /price and POST /score
- requirements.txt for both
- tests/test_*.py for pytest coverage

### Commands (run from /treeproai)

- Install Python deps:
  - pip install -r services/ai-vision/requirements.txt
  - pip install -r services/ai-pricing/requirements.txt

- Run services:
  - uvicorn services.ai-vision.app:app --port 8001 --reload
  - uvicorn services.ai-pricing.app:app --port 8002 --reload

- Test endpoints:
  - curl http://localhost:8001/healthz
  - curl http://localhost:8002/healthz
  - Visit docs:
    - http://localhost:8001/docs
    - http://localhost:8002/docs

### DONE WHEN

- Both services start and return {"ok": true} on /healthz
- /docs shows the defined endpoints for both services
- /analyze and /price return valid structured JSON (mock data)
- Pytest unit tests pass

### Notes

- These services run independently and can be called by the NestJS API later.
- Pricing uses deterministic formulas; vision uses reference object scaling.
- No paid models required yet; all logic is self-contained heuristics.

## Phase 4 — Queue Wiring & Analysis Flow

- From quote request → queued analysis → vision → pricing → result.
- In NestJS, implement BullMQ worker "analyzeImages":
  1) Validate images exist in S3
  2) Call ai-vision:/analyze
  3) Call ai-pricing:/price (with region rates)
  4) Persist results to quotes (DRAFT)
- Implement /tasks/:id polling with status {queued, processing, done, error}

### Files

- apps/api/src/queues/analyze-images.processor.ts
- apps/api/src/queues/queues.module.ts
- apps/api/src/modules/quote-requests/quote-requests.controller.ts
- apps/api/src/modules/tasks/tasks.controller.ts

### Commands (run from /treeproai)

- Run API with queues:
  - pnpm --filter @treeproai/api dev

### DONE WHEN

- Postman run: create quote-request → analyze → quote appears with range.

### Notes

- The queue processor currently uses mock AI results.
- In a full implementation, it would call the actual AI services.

## Phase 5 — Frontend (Next.js)

- Public landing + app shell + core pages.
- app/(public)/page.tsx – "Instant AI Tree Estimate" with drag-drop upload and photo tips
- app/(app)/leads, quotes, jobs, invoices, customers, settings
- components from packages/ui; shadcn setup
- hooks/useApiClient.ts (from packages/sdk-js)
- auth (Clerk) + org/company selector
- Quote Builder view showing AI findings, editable line items, confidence badge; actions: Send Quote, Accept → Create Job
- Jobs: list + map cluster, schedule suggest modal
- Invoices: status, "Send pay link"
- Branding: Include logo; subtle pulse animation during Analyze.

### Files

- apps/web/app/(public)/page.tsx
- apps/web/app/(app)/layout.tsx (app shell)
- apps/web/app/(app)/page.tsx (dashboard)
- apps/web/components/ui/* (shadcn components)
- apps/web/lib/utils.ts
- apps/web/hooks/useApiClient.ts

### Commands (run from /treeproai)

- Install deps:
  - pnpm i

- Run frontend:
  - pnpm --filter @treeproai/web dev
  - Visit: http://localhost:3000

### DONE WHEN

- "pnpm --filter web dev" launches; full flow clickable against local API.
- Landing page shows upload CTA
- Authenticated app shell loads
- Core resource pages render (leads, quotes, jobs, etc.)

### Notes

- This phase adds the frontend without full integration to the API
- The app shell and core pages are implemented but data is mocked
- Actual API integration will come in later phases