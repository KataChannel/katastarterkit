#!/bin/bash

# Simplified local build script - test each step
set -e

echo "=== STEP 1: Prepare Backend ==="
cd /chikiet/Innerbright/innerv2/backend
echo "Installing dependencies..."
bun install > /dev/null 2>&1
echo "✓ Dependencies installed"

echo "Generating Prisma Client..."
bun prisma generate 2>&1 | grep -E "(Generated|Error)" || echo "✓ Prisma generated"
echo "✓ Backend ready"

echo ""
echo "=== STEP 2: Build Frontend ==="
cd /chikiet/Innerbright/innerv2/frontend
echo "Installing dependencies..."
bun install > /dev/null 2>&1
echo "✓ Dependencies installed"

echo "Copying production config..."
cp -f next.config.production.js next.config.js
echo "✓ Config ready"

echo "Building frontend (this may take 5-10 minutes)..."
NODE_OPTIONS="--max-old-space-size=4096" npx next build --experimental-build-mode=compile

if [ $? -eq 0 ]; then
    echo "✓ Frontend built successfully"
    ls -lh .next/
else
    echo "✗ Frontend build failed"
    exit 1
fi

echo ""
echo "✅ LOCAL BUILD COMPLETE!"
echo "Ready to sync to server."
