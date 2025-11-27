##############################################
# Base — Node + pnpm
##############################################
FROM node:20-bullseye AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


##############################################
# Install Dependencies
##############################################
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


##############################################
# Build Payload + Next.js
##############################################
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PAYLOAD_BUILD=true
RUN PAYLOAD_SKIP_DB_INIT=true pnpm build    # no DB access during build


##############################################
# Runner — Production Container for Render
##############################################
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

##############################################
# Copy runtime dependencies & build output
##############################################
COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./
COPY ./public ./public

##############################################
# Render runs CMD automatically if specified
##############################################
EXPOSE 3000
CMD ["node", "server.js"]
