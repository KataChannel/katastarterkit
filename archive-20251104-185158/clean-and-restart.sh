#!/bin/bash

echo "🧹 Cleaning Next.js cache and restarting..."

cd /mnt/chikiet/kataoffical/shoprausach/frontend

# Kill any running Next.js processes
echo "Killing existing processes..."
pkill -f "next dev" 2>/dev/null
sleep 2

# Remove .next cache
echo "Removing .next directory..."
rm -rf .next

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo ""
echo "✅ Cleaned! Now you can run: npm run dev"
echo ""
echo "Or run this script to start automatically:"
echo "  cd frontend && npm run dev"
