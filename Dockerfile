FROM node:20-slim AS base
WORKDIR /app
ENV PAYLOAD_CONFIG_PATH=./src/payload.config.ts

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build Payload admin
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

# Production image
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
COPY --from=builder /app/src ./src
COPY package.json ./

EXPOSE 3000

CMD ["pnpm", "start"]
