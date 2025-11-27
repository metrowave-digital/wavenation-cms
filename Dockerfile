##############################################
# Base — Node + pnpm
##############################################
FROM node:20-bullseye AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


##############################################
# Dependencies Layer
##############################################
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


##############################################
# Build — Payload + Next.js
##############################################
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PAYLOAD_BUILD=true
RUN PAYLOAD_SKIP_DB_INIT=true pnpm build    # prevents DB calls while building


##############################################
# Runtime — Production container
##############################################
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies (optional optimization)
# RUN pnpm install --prod

##############################################
# Copy compiled output
##############################################
COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./
COPY --from=builder /app/server.js ./server.js   # REQUIRED FOR NEXT STANDALONE

# ❗ Public directory ONLY copied if exists
# If you later add one, uncomment:
# COPY ./public ./public

##############################################
# Start Command
##############################################
EXPOSE 3000
CMD ["node", "server.js"]
