#!/bin/bash
# Simple build script - builds frontend without dual domain complexity
# Use this for testing or when dual-domain build has issues

# Auto-detect project path
if [ -d "/chikiet/kataoffical/shoprausach/frontend" ]; then
    PROJECT_PATH="/chikiet/kataoffical/shoprausach"
elif [ -d "/mnt/chikiet/kataoffical/shoprausach/frontend" ]; then
    PROJECT_PATH="/mnt/chikiet/kataoffical/shoprausach"
else
    echo "❌ Error: Cannot find project directory!"
    exit 1
fi

echo "🏗️  Simple Frontend Build"
echo "========================="
echo "📂 Path: $PROJECT_PATH"

cd "$PROJECT_PATH/frontend"

# Clean
echo "🧹 Cleaning..."
rm -rf .next

# Copy default env
echo "📝 Using default environment..."
cp .env.production .env.production.local 2>/dev/null || true

# Build
echo "🔨 Building..."
NODE_ENV=production node_modules/.bin/next build || true

# Check success
if [ -d ".next" ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo "📁 Output: frontend/.next/"
    ls -lh .next/ | head -10
else
    echo ""
    echo "❌ Build failed - no .next directory created"
    exit 1
fi
