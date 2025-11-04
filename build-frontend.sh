#!/bin/bash
# Build script for dual-domain frontend deployment
# This builds frontend twice with different environment variables

set -e

echo "🏗️  Building Frontend for Dual-Domain Deployment"
echo "=================================================="

cd /chikiet/kataoffical/shoprausach/frontend

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next

# Build 1: Rausach Domain (port 12001)
echo ""
echo "📦 Building for RAUSACH domain (backend: 12001)..."
cp .env.rausach .env.production.local
bun run build
echo "✅ Rausach build completed"

# Backup Rausach build
echo "💾 Backing up Rausach build..."
rm -rf .next-rausach
cp -r .next .next-rausach

# Build 2: Tazagroup Domain (port 13001)
echo ""
echo "📦 Building for TAZAGROUP domain (backend: 13001)..."
rm -rf .next
cp .env.tazagroup .env.production.local
bun run build
echo "✅ Tazagroup build completed"

# Backup Tazagroup build
echo "💾 Backing up Tazagroup build..."
rm -rf .next-tazagroup
cp -r .next .next-tazagroup

# Restore default .next (Tazagroup) for docker-compose
echo "🔄 Restoring default build (Tazagroup)..."
# Already in .next, no need to copy

echo ""
echo "✅ Dual-domain build completed!"
echo ""
echo "📁 Build artifacts:"
echo "   .next-rausach/    → Rausach build (12001)"
echo "   .next-tazagroup/  → Tazagroup build (13001)"
echo "   .next/            → Default (Tazagroup)"
echo ""
echo "🐳 Now run: ./deploy.sh"
