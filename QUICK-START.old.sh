#!/bin/bash

# Quick Start Guide - Copy & Paste Commands

echo "🚀 OPTIMIZED DOCKER DEPLOYMENT - QUICK START"
echo "=============================================="
echo ""

# Show file structure
echo "📁 New files created:"
echo "  • build-and-deploy.sh           (Full deployment)"
echo "  • build-backend-local.sh        (Backend only)"
echo "  • build-frontend-local.sh       (Frontend only)"
echo "  • DOCKER-OPTIMIZATION-SUMMARY.md (This guide)"
echo "  • DEPLOYMENT-CHECKLIST.md       (Pre-flight checks)"
echo "  • docs/OPTIMIZED-DEPLOYMENT-GUIDE.md (Detailed docs)"
echo ""

# Show quick commands
echo "⚡ Quick Commands:"
echo ""
echo "1️⃣  FULL DEPLOYMENT (Recommended):"
echo "    ./build-and-deploy.sh"
echo ""
echo "2️⃣  BACKEND ONLY (Fast iteration):"
echo "    ./build-backend-local.sh"
echo "    docker compose build backend --no-cache"
echo "    docker compose up -d backend"
echo ""
echo "3️⃣  FRONTEND ONLY:"
echo "    ./build-frontend-local.sh"
echo "    docker compose build frontend --no-cache"
echo "    docker compose up -d frontend"
echo ""
echo "4️⃣  VIEW LOGS:"
echo "    docker compose logs -f backend"
echo "    docker compose logs -f frontend"
echo ""
echo "5️⃣  STOP SERVICES:"
echo "    docker compose down"
echo ""

# Show expected results
echo "✅ Expected Results:"
echo "  • Deployment time: 3-5 minutes (vs 25-30 before)"
echo "  • Backend image: ~400-500MB (vs 1.5GB before)"
echo "  • Frontend image: ~500-600MB (vs 1.5GB before)"
echo "  • Backend running on: http://localhost:4000"
echo "  • Frontend running on: http://localhost:3000"
echo ""

# Show verification
echo "🔍 Verify Deployment:"
echo "  • Health check: curl http://localhost:4000/health"
echo "  • Frontend: curl http://localhost:3000"
echo "  • Container status: docker compose ps"
echo ""

echo "📚 For detailed info, read:"
echo "  • DOCKER-OPTIMIZATION-SUMMARY.md"
echo "  • docs/OPTIMIZED-DEPLOYMENT-GUIDE.md"
echo "  • DEPLOYMENT-CHECKLIST.md"
echo ""

echo "🎯 Ready to start? Run: ./build-and-deploy.sh"
echo ""
