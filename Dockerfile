# -------------------------
# Base Image with pnpm + node
# -------------------------
FROM node:20-bullseye AS base

# Enable pnpm in all stages
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


# -------------------------
# Deps — install packages
# -------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY .npmrc .npmrc

RUN pnpm install --frozen-lockfile


# -------------------------
# Builder — build Next + Payload
# -------------------------
FROM base AS builder
WORKDIR /app

# Copy deps node_modules first
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

ENV PAYLOAD_BUILD=true

# Build Next.js + Payload Admin
# CRITICAL FIX: We set PAYLOAD_SKIP_DB_INIT=true ONLY for this command.
# This ensures the noopDB is used for building, but the variable doesn't 
# persist to the runner stage or runtime environment.
RUN PAYLOAD_SKIP_DB_INIT=true pnpm run build


# -------------------------
# Runner — production server
# -------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

# Optional: Install ffmpeg here if your app needs it at runtime (fixes the warnings)
# RUN apt-get update && apt-get install -y ffmpeg

EXPOSE 3000

CMD ["pnpm", "start"]