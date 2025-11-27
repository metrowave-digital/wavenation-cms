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

# Copy source (This is where the 'public' folder should be copied from your host to the image)
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

# --- FIXED RUNNER STAGE ---
# We now copy only the standalone build artifacts.
# This fixes the "next start does not work with output: standalone" warning
# and significantly reduces the Docker image size.

# 1. Copy the standalone server and dependencies
COPY --from=builder /app/.next/standalone ./

# 2. Copy static assets (required for Next.js standalone)
COPY --from=builder /app/.next/static ./.next/static

# FIX: Copy public directory from the build context (source: .)
# The previous multi-stage copy failed consistently because /app/public 
# was missing inside the builder image, likely due to .dockerignore.
# This copies directly from your local public folder into the runner image.
# For this to work, you MUST ensure 'public' is NOT in your .dockerignore file.
COPY public ./public

# Optional: Install ffmpeg here if your app needs it at runtime
# RUN apt-get update && apt-get install -y ffmpeg

EXPOSE 3000

# Use the correct startup command for standalone mode
CMD ["node", "server.js"]