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
RUN bun install
COPY . .
RUN bun prisma generate
RUN bun run build

# Bun production stage
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js

CMD ["node", "dist/main.js"]
