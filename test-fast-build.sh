#!/bin/bash

# ============================================================================
# Test Fast Build Locally Before Deploying to Server
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     TEST FAST BUILD LOCALLY                    ║${NC}"
echo -e "${BLUE}║     Before Deploying to Remote Server         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating from template...${NC}"
    cat > .env.production << 'EOF'
# Server Configuration
NODE_ENV=production
DOMAIN=localhost
SSL_EMAIL=admin@innerv2core.com
ENABLE_MIGRATIONS=true

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=innerv2
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/innerv2

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis123
REDIS_URL=redis://:redis123@redis:6379

# JWT Configuration
JWT_SECRET=test-jwt-secret-123456789
JWT_EXPIRATION=7d

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:14000
NEXTAUTH_SECRET=test-nextauth-secret-123456789

# Minio Configuration
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=innerv2-admin
MINIO_SECRET_KEY=innerv2-secret-123
MINIO_BUCKET=innerv2-bucket
MINIO_USE_SSL=false
MINIO_PUBLIC_URL=http://localhost:14007

# API Configuration
BACKEND_URL=http://backend:14001
FRONTEND_URL=http://localhost:14000
GRAPHQL_ENDPOINT=http://backend:14001/graphql

# Logging
LOG_LEVEL=info

# Port Configuration
BACKEND_PORT=14001
FRONTEND_PORT=14000
POSTGRES_PUBLIC_PORT=14003
REDIS_PUBLIC_PORT=14004
MINIO_PUBLIC_PORT=14007
MINIO_CONSOLE_PORT=14008
EOF
    echo -e "${GREEN}✓ Created .env.production${NC}"
fi

echo -e "${YELLOW}📦 Testing Fast Build Configuration...${NC}"
echo ""

# Test 1: Check Dockerfiles
echo -e "${BLUE}[1/5] Checking Dockerfiles...${NC}"
if [ ! -f backend/Dockerfile.build.fast ]; then
    echo -e "${RED}✗ backend/Dockerfile.build.fast not found!${NC}"
    exit 1
fi
if [ ! -f frontend/Dockerfile.build.fast ]; then
    echo -e "${RED}✗ frontend/Dockerfile.build.fast not found!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dockerfiles found${NC}"
echo ""

# Test 2: Validate docker-compose
echo -e "${BLUE}[2/5] Validating docker-compose.build.fast.yml...${NC}"
if ! docker compose -f docker-compose.build.fast.yml config > /dev/null 2>&1; then
    echo -e "${RED}✗ docker-compose.build.fast.yml has errors!${NC}"
    docker compose -f docker-compose.build.fast.yml config
    exit 1
fi
echo -e "${GREEN}✓ docker-compose configuration valid${NC}"
echo ""

# Test 3: Build backend only (fast test)
echo -e "${BLUE}[3/5] Building backend with fast build...${NC}"
echo -e "${YELLOW}This should take ~30-60 seconds${NC}"
START_TIME=$(date +%s)
if ! docker compose -f docker-compose.build.fast.yml build backend 2>&1 | tee /tmp/backend-build.log; then
    echo -e "${RED}✗ Backend build failed!${NC}"
    echo -e "${YELLOW}Check /tmp/backend-build.log for details${NC}"
    exit 1
fi
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo -e "${GREEN}✓ Backend built successfully in ${DURATION}s${NC}"
echo ""

# Test 4: Build frontend (slower)
echo -e "${BLUE}[4/5] Building frontend with optimized build...${NC}"
echo -e "${YELLOW}This should take ~3-5 minutes${NC}"
START_TIME=$(date +%s)
if ! docker compose -f docker-compose.build.fast.yml build frontend 2>&1 | tee /tmp/frontend-build.log; then
    echo -e "${RED}✗ Frontend build failed!${NC}"
    echo -e "${YELLOW}Check /tmp/frontend-build.log for details${NC}"
    exit 1
fi
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo -e "${GREEN}✓ Frontend built successfully in ${DURATION}s${NC}"
echo ""

# Test 5: Check image sizes
echo -e "${BLUE}[5/5] Checking Docker image sizes...${NC}"
docker images | grep -E "innerv2.*backend|innerv2.*frontend" || true
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         BUILD TEST SUCCESSFUL!                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   ✓ Backend build: Fast (Bun runtime, no tsc)"
echo -e "   ✓ Frontend build: Optimized (npm ci, memory limits)"
echo -e "   ✓ Images created successfully"
echo ""
echo -e "${BLUE}🚀 Ready to Deploy:${NC}"
echo -e "   Run: ${GREEN}./deploy-remote-quick.sh${NC}"
echo ""
echo -e "${BLUE}🧪 Or Test Locally:${NC}"
echo -e "   Run: ${YELLOW}docker compose -f docker-compose.build.fast.yml up -d${NC}"
echo -e "   Then check: ${YELLOW}http://localhost:14000${NC}"
echo ""
