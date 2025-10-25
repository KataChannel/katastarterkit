# Optimized Dockerfile for Next.js Frontend
# This expects pre-built artifacts from local build
# Build locally: bun run build
# Then: docker compose build frontend --no-cache

FROM oven/bun:1-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy pre-built artifacts from local build
# Expected local paths (should exist before building):
# - .next/        (Next.js build output)
# - node_modules/ (production dependencies only)
# - public/       (static files)
# - package.json  (package definition)

COPY --chown=nextjs:nodejs .next ./.next
COPY --chown=nextjs:nodejs node_modules ./node_modules
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["bun", "run", "start"]
