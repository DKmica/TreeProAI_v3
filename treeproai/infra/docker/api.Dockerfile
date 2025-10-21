# infra/docker/api.Dockerfile
# This Dockerfile builds and runs the NestJS API.
# To build: docker build -t treeproai-api -f infra/docker/api.Dockerfile .

FROM node:18-alpine AS base
WORKDIR /app
RUN npm i -g pnpm

# 1. Prune workspace to only include dependencies for the API
FROM base AS pruner
COPY . .
# This command creates a pruned, production-ready workspace in /prod/api
RUN pnpm --filter @treeproai/api... deploy --prod /prod/api

# 2. Build the API using the pruned workspace
FROM base AS builder
WORKDIR /app
COPY --from=pruner /prod/api .
RUN pnpm install --prod
RUN pnpm build

# 3. Create the final, lightweight production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy necessary build artifacts from the builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json .
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

EXPOSE 4000

CMD ["node", "dist/src/main.js"]