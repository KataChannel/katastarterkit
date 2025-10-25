#!/bin/bash

# Optimized build and deploy script
# This script builds locally and then creates Docker images with pre-built artifacts
# This significantly reduces deployment time, image size, and bandwidth usage

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(pwd)
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo -e "${YELLOW}🚀 Starting optimized build and deploy process...${NC}"
echo ""

# ============================================================================
# 1. BACKEND BUILD
# ============================================================================
echo -e "${YELLOW}📦 Phase 1: Building Backend...${NC}"

cd "$BACKEND_DIR"

echo "  → Installing dependencies..."
bun install --frozen-lockfile

echo "  → Generating Prisma client..."
bun run prisma generate

echo "  → Compiling TypeScript..."
bun run build

cd "$PROJECT_ROOT"
echo -e "${GREEN}✅ Backend build complete${NC}"
echo ""

# ============================================================================
# 2. FRONTEND BUILD
# ============================================================================
echo -e "${YELLOW}📦 Phase 2: Building Frontend...${NC}"

cd "$FRONTEND_DIR"

echo "  → Installing dependencies..."
bun install --frozen-lockfile

echo "  → Building Next.js application..."
bun run build

cd "$PROJECT_ROOT"
echo -e "${GREEN}✅ Frontend build complete${NC}"
echo ""

# ============================================================================
# 3. DOCKER BUILD
# ============================================================================
echo -e "${YELLOW}🐳 Phase 3: Building Docker images...${NC}"

echo "  → Building Backend image..."
docker compose build backend --no-cache

echo "  → Building Frontend image..."
docker compose build frontend --no-cache

echo -e "${GREEN}✅ Docker images built successfully${NC}"
echo ""

# ============================================================================
# 4. DEPLOYMENT
# ============================================================================
echo -e "${YELLOW}🚀 Phase 4: Deploying services...${NC}"

echo "  → Starting all services..."
docker compose up -d

echo "  → Waiting for services to be healthy..."
sleep 5

# Check service status
echo ""
echo -e "${YELLOW}📊 Service Status:${NC}"
docker compose ps

echo ""
echo -e "${YELLOW}📋 Backend Logs:${NC}"
docker compose logs backend --tail=20

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${GREEN}🎉 Your application is running:${NC}"
echo "  • Backend:  http://localhost:4000"
echo "  • Frontend: http://localhost:3000"
echo "  • Health:   http://localhost:4000/health"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  • Monitor logs: docker compose logs -f backend"
echo "  • Stop services: docker compose down"
echo "  • View frontend: Open http://localhost:3000 in browser"
echo ""
