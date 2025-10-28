#!/bin/bash

echo "🔧 Fixing Apollo Server conflict and Prisma client..."

# Kill all running processes
pkill -9 -f ts-node-dev
pkill -9 -f "next dev"

# Navigate to backend
cd /chikiet/kataoffical/shoprausach/backend

# Generate Prisma client
echo "📦 Generating Prisma client..."
bunx prisma generate

# Start backend
echo "🚀 Starting backend server..."
bun run dev
