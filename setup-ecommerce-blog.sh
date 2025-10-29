#!/bin/bash

# 🚀 E-Commerce & Blog System - Quick Start Script
# This script sets up the complete E-commerce and Blog system

set -e  # Exit on error

echo "=============================================="
echo "🛒 E-COMMERCE & BLOG SYSTEM SETUP"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Step 1: Checking prerequisites...${NC}"
command -v bun >/dev/null 2>&1 || { echo -e "${RED}❌ Bun is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${YELLOW}⚠️  Docker not found. Make sure PostgreSQL and Redis are running.${NC}"; }
echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
cd backend
bun install
cd ../frontend
bun install
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Setup environment
echo -e "${BLUE}🔧 Step 3: Setting up environment...${NC}"
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from example...${NC}"
    cp backend/.env.example backend/.env 2>/dev/null || echo -e "${YELLOW}Please create backend/.env manually${NC}"
fi
if [ ! -f frontend/.env.local ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local not found. Creating from example...${NC}"
    cp frontend/.env.example frontend/.env.local 2>/dev/null || echo -e "${YELLOW}Please create frontend/.env.local manually${NC}"
fi
echo -e "${GREEN}✅ Environment configured${NC}"
echo ""

# Step 4: Database setup
echo -e "${BLUE}🗄️  Step 4: Setting up database...${NC}"
cd backend
echo "Generating Prisma client..."
bunx prisma generate

echo "Running migrations..."
bunx prisma migrate deploy || {
    echo -e "${YELLOW}⚠️  Migration failed. Trying with dev migration...${NC}"
    bunx prisma migrate dev --name ecommerce_blog_system
}

# Step 5: Optional - Seed data
echo ""
read -p "Do you want to seed sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌱 Seeding database...${NC}"
    bun run seed || echo -e "${YELLOW}⚠️  Seeding script not found. Skipping.${NC}"
fi

cd ..
echo -e "${GREEN}✅ Database ready${NC}"
echo ""

# Step 6: Build
echo -e "${BLUE}🔨 Step 5: Building applications...${NC}"
echo "Building backend..."
cd backend
bun run build || echo -e "${YELLOW}⚠️  Backend build failed${NC}"

echo "Building frontend..."
cd ../frontend
bun run build || echo -e "${YELLOW}⚠️  Frontend build failed${NC}"

cd ..
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Final instructions
echo "=============================================="
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo ""
echo "1. Start development servers:"
echo -e "   ${YELLOW}bun run dev${NC}"
echo ""
echo "2. Access the application:"
echo "   • Frontend: http://localhost:12000"
echo "   • Backend GraphQL: http://localhost:12001/graphql"
echo ""
echo "3. Test the features:"
echo "   • Products: http://localhost:12000/sanpham"
echo "   • Blog: http://localhost:12000/baiviet"
echo "   • Cart: http://localhost:12000/gio-hang"
echo "   • Admin: http://localhost:12000/admin"
echo ""
echo "4. Read the documentation:"
echo -e "   ${YELLOW}docs/ECOMMERCE_BLOG_IMPLEMENTATION_GUIDE.md${NC}"
echo ""
echo "=============================================="
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo "=============================================="
