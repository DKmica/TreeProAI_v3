# TreeProAI

TreeProAI is an all-in-one platform for tree care businesses, leveraging AI to streamline estimates, job management, and customer communication.

This is a pnpm monorepo managed with Turborepo.

## Structure

- `apps/web`: Next.js frontend
- `apps/api`: NestJS backend
- `packages/db`: Drizzle ORM schema and migrations
- `packages/config`: Shared configurations (ESLint, TSConfig)
- `services/ai-vision`: FastAPI service for image analysis
- `services/ai-pricing`: FastAPI service for pricing and scoring
- `infra/`: Docker, deployment configs
- `tools/`: Scripts and utilities

## Getting Started

1.  Install pnpm: `npm install -g pnpm`
2.  Install dependencies: `pnpm install`