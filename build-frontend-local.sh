#!/bin/bash

# Quick build script for frontend only
# Use this for faster iteration when only frontend changes

set -e

FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/frontend" && pwd)"

echo "🎨 Building frontend..."
cd "$FRONTEND_DIR"

echo "  ✓ Installing dependencies..."
bun install --frozen-lockfile

echo "  ✓ Building Next.js application..."
bun run build

echo ""
echo "✅ Frontend build complete!"
echo ""
echo "Next: Run 'docker compose build frontend --no-cache && docker compose up -d frontend'"
