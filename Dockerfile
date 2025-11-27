# ------------------------------
# 1) Base image
# ------------------------------
FROM node:20-slim AS base
RUN corepack enable

# ------------------------------
# 2) Install deps
# ------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ------------------------------
# 3) Build stage
# ------------------------------
FROM deps AS builder
WORKDIR /app

# Tell Payload not to render admin during build
ENV PAYLOAD_BUILD=true

# Automatically approve ffmpeg builds
RUN pnpm add sharp --ignore-scripts=false

COPY . .

# Approve ffmpeg-static
RUN pnpm config set pnpm.allowedBuiltDependencies=ffmpeg-static

# Build
RUN pnpm run build

# ------------------------------
# 4) Runtime image
# ------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PAYLOAD_BUILD=false

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
