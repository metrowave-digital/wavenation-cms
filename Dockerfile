##############################################
# Base — Node + pnpm
##############################################
FROM node:20-bullseye AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


##############################################
# Dependencies Install
##############################################
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


##############################################
# Build Next.js + Payload Admin
##############################################
FROM base AS builder
WORKDIR /app

# include node_modules for build
COPY --from=deps /app/node_modules ./node_modules

# copy full project
COPY . .

# Prevent database init during build
ENV PAYLOAD_BUILD=true
RUN PAYLOAD_SKIP_DB_INIT=true pnpm build


##############################################
# Runner — Production Runtime
##############################################
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# include production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Next.js standalone server output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Payload server sources required at runtime
COPY --from=builder /app/src ./src
COPY --from=builder /app/payload.config.ts ./

# Final — ensure static assets come through
COPY ./public ./public   # THIS FIXED THE BUILD ISSUE

EXPOSE 3000

CMD ["node", "server.js"]
