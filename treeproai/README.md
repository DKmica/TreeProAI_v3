# TreeProAI

TreeProAI is an all-in-one, AI-powered platform for tree care businesses. It streamlines the entire workflow from lead capture and automated quoting to job scheduling and invoicing.

This is a pnpm monorepo managed with Turborepo.

## Features

-   **AI-Powered Quoting**: Upload tree photos to get an instant, professional estimate.
-   **Lead & Customer Management**: A simple CRM to track leads, customers, and communication history.
-   **Job Scheduling**: Convert accepted quotes into jobs and schedule them for your crews.
-   **Invoicing & Payments**: Generate invoices and accept online payments via Stripe.
-   **Multi-Tenant Architecture**: Securely manage multiple companies within the same infrastructure.
-   **Role-Based Access Control**: Granular permissions for Owners, Managers, Sales, and Crew members.

## Tech Stack

-   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Query
-   **Backend**: NestJS (TypeScript), Drizzle ORM, PostgreSQL, BullMQ, Redis
-   **AI Services**: Python (FastAPI) for vision and pricing heuristics.
-   **Authentication**: Clerk
-   **Payments**: Stripe
-   **Storage**: S3-Compatible (MinIO for local development)
-   **Infrastructure**: Docker, Docker Compose

## Project Structure

-   `apps/web`: Next.js frontend application.
-   `apps/api`: NestJS backend API and BullMQ workers.
-   `packages/db`: Drizzle ORM schema, migrations, and seed scripts.
-   `packages/ui`: Shared React components (based on shadcn/ui).
-   `packages/config`: Shared configurations (ESLint, TSConfig, Tailwind).
-   `services/ai-vision`: FastAPI service for image analysis heuristics.
-   `services/ai-pricing`: FastAPI service for deterministic pricing calculations.
-   `infra/docker`: Dockerfiles for all services.
-   `infra/deploy`: Deployment manifests (e.g., Fly.io, GitHub Actions).

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or later)
-   [pnpm](https://pnpm.io/installation)
-   [Docker](https://www.docker.com/get-started/) and Docker Compose
-   Python 3.9+

### 1. Environment Setup

Copy the example environment file and fill in the required secrets. For local development, the pre-filled values for the database, Redis, and MinIO will work with the provided `docker-compose.yml`.

```bash
cp .env.example .env
```

You will need to generate a `PII_ENCRYPTION_KEY`:

```bash
openssl rand -base64 32
```

You will also need to sign up for [Clerk](https://clerk.com/) and [Stripe](https://stripe.com/) to get your API keys for development.

### 2. Install Dependencies

Install all project dependencies using pnpm.

```bash
pnpm install
```

### 3. Run with Docker Compose (Recommended)

This is the easiest way to run the entire stack, including the database, Redis, and MinIO.

```bash
docker compose up -d --build
```

The services will be available at:
-   **Web App**: [http://localhost:3000](http://localhost:3000)
-   **API Server**: [http://localhost:4000](http://localhost:4000)
-   **API Docs**: [http://localhost:4000/docs](http://localhost:4000/docs)
-   **MinIO Console**: [http://localhost:9001](http://localhost:9001) (user: `minioadmin`, pass: `minioadmin`)

### 4. Database Setup

After the Docker containers are running, you need to run the database migrations and seed it with demo data.

```bash
# Generate migration files (only needed if you change the schema)
pnpm db:generate

# Apply migrations to the database
pnpm db:migrate

# Seed the database with a demo company, users, and customers
pnpm db:seed
```

You are now ready to use the application! Log in at [http://localhost:3000](http://localhost:3000) using Clerk. The seed script creates a demo company and users.

### Running Services Individually (for Development)

If you prefer not to use Docker Compose, you can run each service in a separate terminal. You will still need Postgres, Redis, and MinIO running (e.g., via Docker).

```bash
# Terminal 1: Run the API
pnpm --filter @treeproai/api dev

# Terminal 2: Run the Web App
pnpm --filter @treeproai/web dev

# Terminal 3: Run the AI Vision Service
(cd services/ai-vision && . .venv/bin/activate && uvicorn app:app --reload --port 8000)

# Terminal 4: Run the AI Pricing Service
(cd services/ai-pricing && . .venv/bin/activate && uvicorn app:app --reload --port 8001)
```

### Testing

Run all unit tests across the monorepo:

```bash
pnpm test
```

Run Playwright end-to-end tests (requires the app to be running):

```bash
pnpm test:e2e