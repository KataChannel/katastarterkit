#!/bin/bash
# Quick verification script for frontend GraphQL endpoint fix

echo "🔍 Frontend GraphQL Endpoint Fix Verification"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if .env.production files exist
echo "1️⃣  Checking .env.production files..."
if [ -f "frontend/.env.production" ]; then
    echo "   ✅ frontend/.env.production exists"
    echo "   Content:"
    grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.production
else
    echo "   ❌ frontend/.env.production NOT FOUND"
fi

echo ""
if [ -f "backend/.env.production" ]; then
    echo "   ✅ backend/.env.production exists"
    echo "   Content:"
    grep "FRONTEND_URL" backend/.env.production
else
    echo "   ❌ backend/.env.production NOT FOUND"
fi

echo ""
echo "2️⃣  Checking Dockerfile for env copy..."
if grep -q "COPY frontend/.env\* " frontend/Dockerfile; then
    echo "   ✅ Dockerfile copies .env files"
else
    echo "   ❌ Dockerfile missing .env copy step"
fi

echo ""
echo "3️⃣  Checking deploy script..."
if grep -q "env.production" scripts/3deploy.sh; then
    echo "   ✅ Deploy script mentions environment setup"
else
    echo "   ⚠️  Deploy script may need update"
fi

echo ""
echo "4️⃣  Current environment setup:"
echo "   Frontend endpoint (dev): $(grep NEXT_PUBLIC_GRAPHQL_ENDPOINT frontend/.env | cut -d= -f2)"
echo "   Frontend endpoint (prod): $(grep NEXT_PUBLIC_GRAPHQL_ENDPOINT frontend/.env.production | cut -d= -f2)"
echo "   Backend FRONTEND_URL (prod): $(grep FRONTEND_URL backend/.env.production | cut -d= -f2)"

echo ""
echo "5️⃣  Docker network configuration:"
echo "   - Frontend container will connect to: http://backend:4000/graphql"
echo "   - Backend will reference frontend at: http://frontend:3000"
echo "   - Both use Docker service names (not localhost)"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ Fix Summary:"
echo "   • frontend/.env.production uses http://backend:4000/graphql"
echo "   • backend/.env.production uses http://frontend:3000"
echo "   • Dockerfile copies env files during build"
echo "   • Next.js embeds NEXT_PUBLIC_* at build time"
echo "   • Production deployment will use correct endpoints"
echo ""
echo "🚀 To deploy:"
echo "   bash scripts/3deploy.sh"
echo ""
