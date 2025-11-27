# -----------------------------
# Base — Node + pnpm
# -----------------------------
FROM node:20-bullseye AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# -----------------------------
# Install deps
# -----------------------------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -----------------------------
# Build Next + Payload Admin
# -----------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PAYLOAD_BUILD=true

# prevent DB connecting at build time
RUN PAYLOAD_SKIP_DB_INIT=true pnpm build

# -----------------------------
# Production Runtime
# -----------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# runtime deps
COPY --from=deps /app/node_modules ./node_modules

# standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# payload + source files
COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./

# public assets
COPY public ./public

EXPOSE 3000
CMD ["node", "server.js"]
