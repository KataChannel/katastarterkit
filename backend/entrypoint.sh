#!/bin/sh

# Entrypoint script for NestJS backend with Prisma migrations
# Uses Bun.js for faster execution

set -e

echo "🚀 Starting backend entrypoint..."

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
REDIS_HOST=${DOCKER_REDIS_HOST:-redis}
REDIS_PORT=${DOCKER_REDIS_PORT:-6379}
REDIS_READY=0

for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  echo "Redis connection attempt $i/15..."
  if nc -z "$REDIS_HOST" "$REDIS_PORT" 2>/dev/null; then
    echo "✅ Redis is ready!"
    REDIS_READY=1
    break
  fi
  sleep 2
done

if [ "$REDIS_READY" -eq 0 ]; then
  echo "⚠️  Redis not responding, but continuing (will retry on demand)..."
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until ./node_modules/.bin/prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run Prisma migrations (skip with resolve if they failed)
echo "🔄 Running Prisma migrations..."
./node_modules/.bin/prisma migrate resolve --rolled-back 20251024_add_blog_system 2>/dev/null || true
./node_modules/.bin/prisma migrate deploy 2>/dev/null || echo "⚠️  Migrations already applied or contain errors, continuing..."

# Generate Prisma client
echo "🔧 Generating Prisma client..."
./node_modules/.bin/prisma generate

# Seed database if needed (optional)
if [ "$NODE_ENV" = "development" ]; then
  echo "🌱 Seeding database..."
  bun prisma db seed 2>/dev/null || echo "⚠️  No seed script found or seeding failed"
fi

echo "✅ Backend setup complete!"

# Execute the main command
exec "$@"
