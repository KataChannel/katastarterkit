#!/bin/sh

# Entrypoint script for NestJS backend with Prisma migrations
# Uses Bun.js for faster execution

set -e

echo "🚀 Starting backend entrypoint..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until bun prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
bun prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
bun prisma generate

# Seed database if needed (optional)
if [ "$NODE_ENV" = "development" ]; then
  echo "🌱 Seeding database..."
  bun prisma db seed 2>/dev/null || echo "⚠️  No seed script found or seeding failed"
fi

echo "✅ Backend setup complete!"

# Execute the main command
exec "$@"
