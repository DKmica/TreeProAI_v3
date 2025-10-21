# infra/docker/web.Dockerfile
# This Dockerfile builds and runs the Next.js web application.
# To build: docker build -t treeproai-web -f infra/docker/web.Dockerfile .

FROM node:18-alpine AS base
WORKDIR /app
RUN npm i -g pnpm

# 1. Prune workspace to only include dependencies for the web app
FROM base AS pruner
COPY . .
# This command creates a pruned, production-ready workspace in /prod/web
RUN pnpm --filter @treeproai/web... deploy --prod /prod/web

# 2. Build the web application using the pruned workspace
FROM base AS builder
WORKDIR /app
COPY --from=pruner /prod/web .
RUN pnpm install --prod
RUN pnpm build

# 3. Create the final, lightweight production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary build artifacts from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]