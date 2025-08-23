# Multi-stage Dockerfile for NestJS Backend with Bun.js

# Bun development stage
FROM oven/bun:1.1.34 AS development
WORKDIR /app
COPY package.json bun.lockb* ./
COPY prisma ./prisma/
RUN bun install
COPY . .
RUN bun prisma generate
EXPOSE 4000
CMD ["bun", "run", "start:dev"]

# Bun build stage
FROM oven/bun:1.1.34 AS build
WORKDIR /app
COPY package.json bun.lockb* ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile
COPY . .
RUN bun prisma generate
RUN bun run build

# Bun production stage (optimized)
FROM oven/bun:1.1.34-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Create entrypoint script for migrations
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Use entrypoint for migrations
ENTRYPOINT ["./entrypoint.sh"]
CMD ["bun", "run", "start:prod"]
