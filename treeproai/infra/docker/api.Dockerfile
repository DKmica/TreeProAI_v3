# Base image for installing dependencies
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
RUN npm i -g pnpm
RUN pnpm fetch

# Builder image
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @treeproai/api build

# Production image
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/apps/api/package.json ./package.json

EXPOSE 4000
CMD ["node", "dist/main.js"]