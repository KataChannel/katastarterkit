#!/bin/bash

# 🚀 InnerV2 - Next.js Fullstack Quick Start
# Quick setup script for development environment

set -e

echo "=================================================="
echo "🚀 InnerV2 - Next.js Fullstack Quick Start"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check Bun installation
echo -e "${BLUE}Step 1: Checking Bun installation...${NC}"
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun is not installed${NC}"
    echo -e "${YELLOW}Installing Bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
else
    echo -e "${GREEN}✅ Bun is installed: $(bun --version)${NC}"
fi
echo ""

# Step 2: Check Docker installation
echo -e "${BLUE}Step 2: Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo -e "${YELLOW}Please install Docker: https://docs.docker.com/get-docker/${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Docker is installed: $(docker --version)${NC}"
fi
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}Step 3: Installing dependencies...${NC}"
echo -e "${YELLOW}Root dependencies...${NC}"
bun install

echo -e "${YELLOW}Frontend dependencies...${NC}"
cd frontend
bun install
cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Setup environment files
echo -e "${BLUE}Step 4: Setting up environment files...${NC}"

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating root .env file...${NC}"
    cat > .env << 'EOF'
# PostgreSQL
POSTGRES_DB=innerv2core
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=14003

# Redis
REDIS_PASSWORD=123456
REDIS_PORT=14004

# MinIO
MINIO_ACCESS_KEY=innerv2core-admin
MINIO_SECRET_KEY=innerv2core-secret-2025
MINIO_PORT=14007
MINIO_CONSOLE_PORT=14008

# pgAdmin
PGADMIN_EMAIL=admin@innerv2core.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=14002

# Docker Network
DOCKER_NETWORK_NAME=innerv2core-network
EOF
    echo -e "${GREEN}✅ Created .env${NC}"
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi

if [ ! -f frontend/.env.local ]; then
    echo -e "${YELLOW}Creating frontend/.env.local...${NC}"
    cat > frontend/.env.local << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:14003/innerv2core?schema=public"

# Redis
REDIS_URL="redis://localhost:14004"
REDIS_PASSWORD="123456"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT="14007"
MINIO_ACCESS_KEY="innerv2core-admin"
MINIO_SECRET_KEY="innerv2core-secret-2025"
MINIO_USE_SSL="false"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF
    echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
else
    echo -e "${GREEN}✅ frontend/.env.local already exists${NC}"
fi
echo ""

# Step 5: Start infrastructure
echo -e "${BLUE}Step 5: Starting infrastructure (Docker)...${NC}"
docker compose up -d

echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 5

# Check services
echo -e "${YELLOW}Checking service health...${NC}"
docker compose ps
echo ""

echo -e "${GREEN}✅ Infrastructure started${NC}"
echo -e "  📊 PostgreSQL: localhost:14003"
echo -e "  🔧 pgAdmin: http://localhost:14002"
echo -e "  ⚡ Redis: localhost:14004"
echo -e "  📦 MinIO: http://localhost:14007"
echo -e "  🎛️  MinIO Console: http://localhost:14008"
echo ""

# Step 6: Setup database
echo -e "${BLUE}Step 6: Setting up database...${NC}"

cd frontend

echo -e "${YELLOW}Generating Prisma Client...${NC}"
bunx prisma generate

echo -e "${YELLOW}Running database migrations...${NC}"
bunx prisma migrate dev --name init

echo -e "${YELLOW}Seeding database...${NC}"
bunx prisma db seed

cd ..

echo -e "${GREEN}✅ Database setup complete${NC}"
echo ""

# Step 7: All done!
echo "=================================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}Quick Commands:${NC}"
echo ""
echo -e "  ${YELLOW}Start Development Server:${NC}"
echo -e "    cd frontend && bun dev"
echo -e "    or: bun dev (from root)"
echo ""
echo -e "  ${YELLOW}Access Points:${NC}"
echo -e "    • Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "    • Prisma Studio: ${GREEN}cd frontend && bunx prisma studio${NC}"
echo -e "    • pgAdmin: ${GREEN}http://localhost:14002${NC}"
echo -e "    • MinIO Console: ${GREEN}http://localhost:14008${NC}"
echo ""
echo -e "  ${YELLOW}Admin Login:${NC}"
echo -e "    • Email: ${GREEN}katachanneloffical@gmail.com${NC}"
echo -e "    • Password: ${GREEN}Kata@@2024${NC}"
echo ""
echo -e "  ${YELLOW}Database Commands:${NC}"
echo -e "    • Migrate: ${GREEN}bun db:migrate${NC}"
echo -e "    • Seed: ${GREEN}bun db:seed${NC}"
echo -e "    • Studio: ${GREEN}bun db:studio${NC}"
echo ""
echo -e "  ${YELLOW}Docker Commands:${NC}"
echo -e "    • View logs: ${GREEN}docker compose logs -f${NC}"
echo -e "    • Stop services: ${GREEN}docker compose down${NC}"
echo -e "    • Restart: ${GREEN}docker compose restart${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. cd frontend"
echo -e "  2. bun dev"
echo -e "  3. Open http://localhost:3000"
echo -e "  4. Login with admin credentials above"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
