#!/bin/bash

# ============================================================================
# Build Frontend for Production (Local Test)
# Test production build before deploying to server
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Auto-detect project path
if [ -d "/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/chikiet/kataoffical/shoprausach"
elif [ -d "/mnt/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/mnt/chikiet/kataoffical/shoprausach"
else
    echo -e "${RED}❌ Error: Cannot find project directory!${NC}"
    exit 1
fi

cd "$PROJECT_PATH/frontend"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🏗️  BUILD FRONTEND FOR PRODUCTION                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Copy environment file
if [ ! -f "../.env.prod.rausach" ]; then
    echo -e "${RED}❌ Error: .env.prod.rausach not found!${NC}"
    exit 1
fi

echo -e "${BLUE}  → Copying production environment...${NC}"
cp ../.env.prod.rausach .env.local

# Clean old build
if [ -d ".next" ]; then
    echo -e "${BLUE}  → Removing old build...${NC}"
    rm -rf .next
fi

# Build
echo -e "${BLUE}  → Building Next.js application...${NC}"
echo -e "${YELLOW}     This may take 2-3 minutes...${NC}"
echo ""

bun run build

# Verify build
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Build failed! .next not found${NC}"
    exit 1
fi

if [ ! -d ".next/standalone" ]; then
    echo -e "${RED}❌ Build failed! standalone output not found${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ BUILD SUCCESSFUL!                               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show build statistics
echo -e "${BLUE}📊 Build Statistics:${NC}"
echo -e "   Build dir:     ${GREEN}.next${NC}"
echo -e "   Standalone:    ${GREEN}$(du -sh .next/standalone | cut -f1)${NC}"
echo -e "   Static assets: ${GREEN}$(du -sh .next/static | cut -f1)${NC}"

# Check for blog-tree route
if [ -d ".next/server/app/admin/blog-tree" ]; then
    echo -e "   blog-tree:     ${GREEN}✅ Built successfully${NC}"
else
    echo -e "   blog-tree:     ${RED}❌ NOT FOUND in build${NC}"
    echo -e "${YELLOW}   Checking .next-rausach/server/app/admin/ for routes...${NC}"
    ls -1 .next-rausach/server/app/admin/ | grep -E "blog"
fi

echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo -e "   1. Test locally: ${BLUE}cd .next-rausach/standalone && node frontend/server.js${NC}"
echo -e "   2. Deploy to server: ${BLUE}cd ../.. && ./scripts/deployment/deploy-optimized.sh${NC}"
echo ""
