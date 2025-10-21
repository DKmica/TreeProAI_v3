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
</treeproai/README.md>