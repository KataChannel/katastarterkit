#!/bin/bash

# ============================================================================
# InnerBright Complete Cleanup - Master Script
# Simplify project to core features only
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   INNERBRIGHT COMPLETE CLEANUP                ║${NC}"
echo -e "${BLUE}║   Simplify to Core Features Only              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}⚠️  WARNING: This will:${NC}"
echo -e "  1. Backup and replace database schema (107 → 18 models)"
echo -e "  2. Remove unused backend modules"
echo -e "  3. Remove unused frontend features"
echo -e "  4. Create backups of all removed code"
echo ""

echo -e "${YELLOW}✅ Core features that will be KEPT:${NC}"
echo -e "  • Authentication & User Management"
echo -e "  • Role-Based Access Control (RBAC)"
echo -e "  • Menu Management"
echo -e "  • Page Builder"
echo -e "  • Blog/Posts System"
echo ""

echo -e "${RED}❌ Features that will be REMOVED:${NC}"
echo -e "  • E-commerce (Products, Orders, Cart, etc.)"
echo -e "  • LMS (Courses, Lessons, Modules, etc.)"
echo -e "  • Task Management"
echo -e "  • Project Management"
echo -e "  • Affiliate System"
echo -e "  • Advanced AI features"
echo -e "  • Chatbot"
echo -e "  • Call Center"
echo -e "  • Accounting (Ketoan)"
echo -e "  • And 80+ other modules..."
echo ""

read -p "$(echo -e ${YELLOW}Continue with cleanup? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Cleanup cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 1: Database Schema Cleanup${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

cd /chikiet/Innerbright/innerv2/backend

echo -e "${YELLOW}[1.1] Backing up current schema...${NC}"
if [ ! -f "prisma/schema.prisma.backup" ]; then
    cp prisma/schema.prisma prisma/schema.prisma.backup
    echo -e "${GREEN}✓ Schema backed up to schema.prisma.backup${NC}"
else
    echo -e "${BLUE}ℹ Backup already exists${NC}"
fi

echo -e "${YELLOW}[1.2] Schema already replaced with core version${NC}"
echo -e "${BLUE}ℹ Current schema: 18 core models${NC}"
echo -e "${BLUE}ℹ Original schema: 107 models (backed up)${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 2: Backend Cleanup${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

cd /chikiet/Innerbright/innerv2
./cleanup-backend.sh

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 3: Frontend Cleanup${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

./cleanup-frontend.sh

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 4: Generate New Prisma Client${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

cd /chikiet/Innerbright/innerv2/backend
echo -e "${YELLOW}Formatting schema...${NC}"
bun prisma format

echo -e "${YELLOW}Generating Prisma Client...${NC}"
bun prisma generate

echo -e "${GREEN}✓ Prisma Client generated${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         CLEANUP COMPLETE!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}📊 Summary:${NC}"
echo -e "  • Database Schema: 107 models → 18 core models"
echo -e "  • Backend: Removed ~15 unused modules"
echo -e "  • Frontend: Removed ~10 unused features"
echo ""

echo -e "${YELLOW}📁 Backups Created:${NC}"
echo -e "  • Schema: backend/prisma/schema.prisma.backup"
echo -e "  • Backend modules: backend_modules_backup_*/"
echo -e "  • Frontend features: frontend_backup_*/"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT - Next Steps:${NC}"
echo ""

echo -e "${RED}1. Database Migration (REQUIRED):${NC}"
echo -e "   ${YELLOW}⚠️  This will DROP unused tables and DATA!${NC}"
echo -e "   cd backend"
echo -e "   # Backup current data first:"
echo -e "   bun db:backup"
echo -e "   # Then create and apply migration:"
echo -e "   bun prisma migrate dev --name simplify_to_core"
echo ""

echo -e "${YELLOW}2. Update Backend Code:${NC}"
echo -e "   cd backend"
echo -e "   # Remove unused imports from app.module.ts"
echo -e "   # Update GraphQL schema (schema.gql)"
echo -e "   # Test build:"
echo -e "   bun run build"
echo ""

echo -e "${YELLOW}3. Update Frontend Code:${NC}"
echo -e "   cd frontend"
echo -e "   # Update navigation/menu"
echo -e "   # Remove unused GraphQL queries"
echo -e "   # Test build:"
echo -e "   bun run build"
echo ""

echo -e "${YELLOW}4. Testing:${NC}"
echo -e "   # Run backend:"
echo -e "   cd backend && bun run dev"
echo -e "   # Run frontend:"
echo -e "   cd frontend && bun run dev"
echo ""

echo -e "${BLUE}📖 Documentation:${NC}"
echo -e "   See: docs/SCHEMA_SIMPLIFICATION_GUIDE.md"
echo ""

echo -e "${GREEN}✅ Project simplified successfully!${NC}"
echo -e "${YELLOW}⚠️  Remember to test thoroughly before deploying${NC}"
