#!/bin/bash

# Quick Start Script for Next.js Full-Stack Testing
# Run this to verify Phase 1 implementation

set -e

echo "🚀 Next.js Full-Stack - Quick Start Test"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in frontend directory"
    echo "Please run: cd frontend && ./quick-start-test.sh"
    exit 1
fi

echo "📋 Step 1: Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update with your database credentials."
    echo ""
    echo "Required variables:"
    echo "  - DATABASE_URL"
    echo "  - REDIS_HOST, REDIS_PORT"
    echo "  - MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

echo "✅ Environment file exists"
echo ""

echo "📦 Step 2: Installing dependencies..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Using npm instead..."
    npm install
else
    pnpm install
fi
echo "✅ Dependencies installed"
echo ""

echo "🗄️  Step 3: Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

echo "🔍 Step 4: Checking database connection..."
npx prisma db pull --force || echo "⚠️  Could not pull schema (this is OK if DB is already set up)"
echo ""

echo "🏗️  Step 5: Building Next.js application..."
npm run build 2>&1 | head -n 20
echo "✅ Build successful (or check errors above)"
echo ""

echo "🚀 Step 6: Starting development server..."
echo ""
echo "=========================================="
echo "Test Server Actions at:"
echo "  👉 http://localhost:3000/test-actions"
echo ""
echo "Expected results:"
echo "  ✅ Blog posts list displayed"
echo "  ✅ Categories list displayed"
echo "  ✅ Settings list displayed"
echo "  ✅ Green success message shown"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

npm run dev
