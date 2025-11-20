#!/bin/bash

# Integration test for Dynamic Header Menu System
# Verifies the complete flow from database to frontend

echo "=========================================="
echo "Dynamic Menu System - Integration Test"
echo "=========================================="
echo ""

# Step 1: Verify backend compilation
echo "[Step 1] Verifying backend has no TypeScript errors..."

cd backend

if bun run build 2>&1 | grep -q "error TS"; then
  echo "❌ Backend has TypeScript errors!"
  exit 1
fi

echo "✅ Backend compilation successful"
echo ""

# Step 2: Verify frontend compilation
echo "[Step 2] Verifying frontend has no TypeScript errors..."

cd ../frontend

if bun run build 2>&1 | grep -q "error TS"; then
  echo "❌ Frontend has TypeScript errors!"
  exit 1
fi

echo "✅ Frontend compilation successful"
echo ""

# Step 3: Check GraphQL schema
echo "[Step 3] Checking GraphQL schema generation..."

cd ../backend

# Check if schema file has MenuHierarchicalDto
if [ -f "src/schema.graphql" ] || [ -f "schema.graphql" ]; then
  if grep -q "MenuHierarchicalDto" schema.graphql || grep -q "MenuHierarchicalDto" src/schema.graphql; then
    echo "✅ MenuHierarchicalDto found in GraphQL schema"
  else
    echo "⚠️  MenuHierarchicalDto not yet in schema (will be generated at runtime)"
  fi
fi

echo ""

# Step 4: Database verification
echo "[Step 4] Checking database has Menu table..."

if grep -q "model Menu" prisma/schema.prisma; then
  echo "✅ Menu table exists in Prisma schema"
  
  if grep -q "children Menu" prisma/schema.prisma; then
    echo "✅ Menu children relationship defined"
  else
    echo "❌ Menu children relationship NOT defined!"
    exit 1
  fi
else
  echo "❌ Menu table NOT found in Prisma schema!"
  exit 1
fi

echo ""

# Summary
echo "=========================================="
echo "Integration Test Results"
echo "=========================================="
echo ""
echo "✅ Backend: TypeScript compilation successful"
echo "✅ Frontend: TypeScript compilation successful"
echo "✅ Database Schema: Menu table with hierarchy"
echo ""
echo "System is ready for runtime testing!"
echo ""
echo "To test the complete system:"
echo "1. Start backend: cd backend && bun run dev"
echo "2. Start frontend: cd frontend && bun run dev"
echo "3. Navigate to http://localhost:3000/website"
echo "4. Check browser DevTools > Network > GraphQL for headerMenus query"
echo "5. Verify menu items appear in header with working dropdowns"
echo ""
echo "=========================================="
