# ----------------------------------------
# Base image with Node + pnpm
# ----------------------------------------
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app


# ----------------------------------------
# Dependencies Layer
# ----------------------------------------
FROM base AS deps

# Install system deps for ffmpeg if needed
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# ----------------------------------------
# Builder Layer
# ----------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fix ffmpeg installer warnings
RUN pnpm approve-builds

# Build Next.js + Payload
RUN pnpm run build


# ----------------------------------------
# Runtime layer
# ----------------------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
