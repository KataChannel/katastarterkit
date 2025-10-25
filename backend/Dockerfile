# Optimized Dockerfile for NestJS Backend with Bun.js
# This expects pre-built artifacts from local build
# Build locally: bun run build && bun install --production
# Then: docker compose build backend --no-cache
# Bun.js provides 3-4x faster startup and better runtime performance

FROM oven/bun:latest AS builder
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user first
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy pre-built artifacts from local build
# Expected local paths (should exist before building):
# - backend/dist/          (compiled TypeScript)
# - backend/prisma/        (Prisma schema)
# - backend/package.json   (package definition)
# - backend/bun.lockb      (lock file)
# - backend/entrypoint.sh  (migration script)

COPY backend/dist ./dist
COPY backend/prisma ./prisma
COPY backend/package.json ./package.json
COPY backend/package-lock.json* ./
COPY backend/bun.lockb* ./
COPY backend/entrypoint.sh ./entrypoint.sh

# Install dependencies (including devDependencies with Prisma)
RUN bun install --frozen-lockfile

RUN chmod +x ./entrypoint.sh
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Use Bun for production runtime (3-4x faster than Node.js)
ENTRYPOINT ["./entrypoint.sh"]
CMD ["bun", "run", "start:prod"]
