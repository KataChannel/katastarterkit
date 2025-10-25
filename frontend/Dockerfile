# Multi-stage Dockerfile for Next.js Frontend with Bun.js

# Dependencies stage
FROM oven/bun:1.1.34 AS deps
WORKDIR /app
# Install unzip for Cypress
RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Build stage (use Node.js instead of Bun for better Next.js compatibility)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry and set production environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build --legacy-peer-deps

# Production stage with Bun.js
FROM oven/bun:1.1.34-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["bun", "run", "start"]
