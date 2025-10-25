#!/bin/bash

# Quick build script for backend only
# Use this for faster iteration when only backend changes

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/backend" && pwd)"

echo "🔨 Building backend..."
cd "$BACKEND_DIR"

echo "  ✓ Installing dependencies..."
bun install --frozen-lockfile

echo "  ✓ Generating Prisma client..."
bun run prisma generate

echo "  ✓ Compiling TypeScript..."
bun run build

echo ""
echo "✅ Backend build complete!"
echo ""
echo "Next: Run 'docker compose build backend --no-cache && docker compose up -d backend'"
