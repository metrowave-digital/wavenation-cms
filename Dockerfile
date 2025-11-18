# ------------------------
# Base image
# ------------------------
FROM node:22-alpine AS base

WORKDIR /app
RUN corepack enable pnpm

# ------------------------
# Dependencies stage
# ------------------------
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ------------------------
# Build stage (Payload builds admin panel)
# ------------------------
FROM base AS builder

WORKDIR /app

# Copy node_modules and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Payload admin panel
RUN pnpm run build

# ------------------------
# Runtime image
# ------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
RUN corepack enable pnpm

# Copy compiled output
COPY --from=builder /app ./

# Payload runs on port 3000
EXPOSE 3000

# Start the Payload CMS server
CMD ["pnpm", "start"]
