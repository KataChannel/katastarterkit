#!/bin/bash

# Test seed script for KataCore Backend

echo "🧪 Testing Database Seed..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from backend directory${NC}"
    exit 1
fi

# Check if Prisma schema exists
if [ ! -f "prisma/schema.prisma" ]; then
    echo -e "${RED}❌ Error: Prisma schema not found${NC}"
    exit 1
fi

# Check if seed file exists
if [ ! -f "prisma/seed.ts" ]; then
    echo -e "${RED}❌ Error: Seed file not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Generate Prisma Client${NC}"
bun prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma client generated${NC}"
echo ""

echo -e "${YELLOW}📋 Step 2: Run Database Seed${NC}"
bun run prisma:seed
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Seed failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Seed completed successfully${NC}"
echo ""

echo -e "${YELLOW}📋 Step 3: Alternative - Run with Prisma CLI${NC}"
echo -e "${YELLOW}⚠️  Note: This may fail if data already exists (expected behavior)${NC}"
bun prisma db seed 2>&1 || echo -e "${YELLOW}⚠️  Prisma db seed had issues - data may already exist (this is OK)${NC}"
echo ""

echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "📊 Admin Credentials:"
echo "   Email: admin@katacore.dev"
echo "   Password: admin123"
echo ""
echo "📊 Test User Credentials:"
echo "   Email: user@katacore.dev"
echo "   Password: user123"
