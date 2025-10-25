#!/bin/bash#!/bin/bash



# Optimized build and deploy script# Optimized build and deploy script

# This script builds locally and then creates Docker images with pre-built artifacts# This script builds locally and then creates Docker images with pre-built artifacts

# This significantly reduces deployment time, image size, and bandwidth usage# This significantly reduces deployment time, image size, and bandwidth usage



set -eset -e



RED='\033[0;31m'RED='\033[0;31m'

GREEN='\033[0;32m'GREEN='\033[0;32m'

YELLOW='\033[1;33m'YELLOW='\033[1;33m'

NC='\033[0m' # No ColorNC='\033[0m' # No Color



PROJECT_ROOT=$(pwd)PROJECT_ROOT=$(pwd)

BACKEND_DIR="$PROJECT_ROOT/backend"BACKEND_DIR="$PROJECT_ROOT/backend"

FRONTEND_DIR="$PROJECT_ROOT/frontend"FRONTEND_DIR="$PROJECT_ROOT/frontend"



echo -e "${YELLOW}🚀 Starting optimized build and deploy process...${NC}"echo -e "${YELLOW}🚀 Starting optimized build and deploy process...${NC}"

echo ""echo ""



# ============================================================================# ============================================================================

# 1. BACKEND BUILD# 1. BACKEND BUILD

# ============================================================================# ============================================================================

echo -e "${YELLOW}📦 Phase 1: Building Backend...${NC}"echo -e "${YELLOW}📦 Phase 1: Building Backend...${NC}"



cd "$BACKEND_DIR"cd "$BACKEND_DIR"



echo "  → Installing dependencies..."echo "  → Installing dependencies..."

bun install --frozen-lockfilebun install --frozen-lockfile



echo "  → Generating Prisma client..."echo "  → Generating Prisma client..."

bun run prisma generatebun run prisma generate



echo "  → Compiling TypeScript..."echo "  → Compiling TypeScript..."

bun run buildbun run build



cd "$PROJECT_ROOT"cd "$PROJECT_ROOT"

echo -e "${GREEN}✅ Backend build complete${NC}"echo -e "${GREEN}✅ Backend build complete${NC}"

echo ""echo ""



# ============================================================================# ============================================================================

# 2. FRONTEND BUILD# 2. FRONTEND BUILD

# ============================================================================# ============================================================================

echo -e "${YELLOW}📦 Phase 2: Building Frontend...${NC}"echo -e "${YELLOW}📦 Phase 2: Building Frontend...${NC}"



cd "$FRONTEND_DIR"cd "$FRONTEND_DIR"



echo "  → Installing dependencies..."echo "  → Installing dependencies..."

bun install --frozen-lockfilebun install --frozen-lockfile



echo "  → Building Next.js application..."echo "  → Building Next.js application..."

bun run buildbun run build



cd "$PROJECT_ROOT"cd "$PROJECT_ROOT"

echo -e "${GREEN}✅ Frontend build complete${NC}"echo -e "${GREEN}✅ Frontend build complete${NC}"

echo ""echo ""



# ============================================================================# ============================================================================

# 3. DOCKER BUILD# 3. DOCKER BUILD

# ============================================================================# ============================================================================

echo -e "${YELLOW}🐳 Phase 3: Building Docker images...${NC}"echo -e "${YELLOW}🐳 Phase 3: Building Docker images...${NC}"



echo "  → Building Backend image..."echo "  → Building Backend image..."

docker compose build backend --no-cachedocker compose build backend --no-cache



echo "  → Building Frontend image..."echo "  → Building Frontend image..."

docker compose build frontend --no-cachedocker compose build frontend --no-cache



echo -e "${GREEN}✅ Docker images built successfully${NC}"echo -e "${GREEN}✅ Docker images built successfully${NC}"

echo ""echo ""



# ============================================================================# ============================================================================

# 4. DEPLOYMENT# 4. DEPLOYMENT

# ============================================================================# ============================================================================

echo -e "${YELLOW}🚀 Phase 4: Deploying services...${NC}"echo -e "${YELLOW}🚀 Phase 4: Deploying services...${NC}"



echo "  → Starting all services..."echo "  → Starting all services..."

docker compose up -ddocker compose up -d



echo "  → Waiting for services to be healthy..."echo "  → Waiting for services to be healthy..."

sleep 5sleep 5



# Check service status# Check service status

echo ""echo ""

echo -e "${YELLOW}📊 Service Status:${NC}"echo -e "${YELLOW}📊 Service Status:${NC}"

docker compose psdocker compose ps



echo ""echo ""

echo -e "${YELLOW}📋 Backend Logs:${NC}"echo -e "${YELLOW}📋 Backend Logs:${NC}"

docker compose logs backend --tail=20docker compose logs backend --tail=20



echo ""echo ""

echo -e "${GREEN}✅ Deployment complete!${NC}"echo -e "${GREEN}✅ Deployment complete!${NC}"

echo ""echo ""

echo -e "${GREEN}🎉 Your application is running:${NC}"echo -e "${GREEN}🎉 Your application is running:${NC}"

echo "  • Backend:  http://localhost:4000"echo "  • Backend:  http://localhost:4000"

echo "  • Frontend: http://localhost:3000"echo "  • Frontend: http://localhost:3000"

echo "  • Health:   http://localhost:4000/health"echo "  • Health:   http://localhost:4000/health"

echo ""echo ""

echo -e "${YELLOW}📝 Next steps:${NC}"echo -e "${YELLOW}📝 Next steps:${NC}"

echo "  • Monitor logs: docker compose logs -f backend"echo "  • Monitor logs: docker compose logs -f backend"

echo "  • Stop services: docker compose down"echo "  • Stop services: docker compose down"

echo "  • View frontend: Open http://localhost:3000 in browser"echo "  • View frontend: Open http://localhost:3000 in browser"

echo ""echo ""

