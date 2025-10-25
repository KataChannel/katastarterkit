# Optimized Dockerfile for NestJS Backend with Bun.js
# This expects pre-built artifacts from local build
# Build locally: bun run build && bun install --production
# Then: docker compose build backend --no-cache
# Bun.js provides 3-4x faster startup and better runtime performance

FROM oven/bun:1-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user first
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy pre-built artifacts from local build
# Expected local paths (should exist before building):
# - dist/          (compiled TypeScript)
# - node_modules/  (production dependencies only)
# - prisma/        (Prisma schema)
# - package.json   (package definition)
# - entrypoint.sh  (migration script)

COPY dist ./dist
COPY prisma ./prisma
COPY node_modules ./node_modules
COPY package.json ./package.json
COPY entrypoint.sh ./entrypoint.sh

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
