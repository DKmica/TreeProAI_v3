# Base image for installing dependencies
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/sdk-js/package.json ./packages/sdk-js/
COPY packages/config/package.json ./packages/config/
RUN npm i -g pnpm
RUN pnpm fetch

# Builder image
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @treeproai/web build

# Production image
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV production

COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/apps/web/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/web/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["pnpm", "--filter", "@treeproai/web", "start"]