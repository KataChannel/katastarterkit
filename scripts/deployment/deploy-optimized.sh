#!/bin/bash

# ============================================================================
# Optimized Production Deployment Script for Rausach
# Build locally → Save images → Transfer → Deploy on server
# This approach reduces server load significantly
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER="root@116.118.49.243"
REMOTE_DIR="/root/shoprausach"
PROJECT_NAME="rausach"
IMAGE_BACKEND="${PROJECT_NAME}-backend:latest"
IMAGE_FRONTEND="${PROJECT_NAME}-frontend:latest"
IMAGE_TAR_DIR="./docker-images"
COMPOSE_APP="docker-compose.app.yml"
COMPOSE_INFRA="docker-compose.infra.yml"

# Auto-detect project path
if [ -d "/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/chikiet/kataoffical/shoprausach"
elif [ -d "/mnt/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/mnt/chikiet/kataoffical/shoprausach"
else
    echo -e "${RED}❌ Error: Cannot find project directory!${NC}"
    exit 1
fi

cd "$PROJECT_PATH"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 OPTIMIZED RAUSACH DEPLOYMENT                   ║${NC}"
echo -e "${BLUE}║     Build Local → Transfer → Deploy (App Only)        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📍 Server:${NC} $SERVER"
echo -e "${GREEN}📦 Project:${NC} Rausach (App Services Only)"
echo -e "${GREEN}🏗️  Strategy:${NC} Local Build + Image Transfer"
echo -e "${YELLOW}ℹ️  Note:${NC} Infrastructure (Postgres, Redis, Minio) runs separately"
echo ""

# ============================================================================
# Step 0: Check Infrastructure Services
# ============================================================================
echo -e "${YELLOW}⏳ Step 0: Checking infrastructure services...${NC}"
echo ""

INFRA_CHECK=$(ssh $SERVER 'docker ps | grep -q "shoppostgres" && docker ps | grep -q "shared-redis" && docker ps | grep -q "shared-minio" && echo "READY" || echo "NOT_READY"' | tr -d '\r\n')

if [ "$INFRA_CHECK" != "READY" ]; then
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ❌ INFRASTRUCTURE NOT READY!                      ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Required infrastructure services are missing:${NC}"
    echo "   • PostgreSQL (shoppostgres:12003)"
    echo "   • Redis (shared-redis:12004)"
    echo "   • Minio (shared-minio:12007)"
    echo ""
    echo -e "${BLUE}Please deploy infrastructure first:${NC}"
    echo -e "   ${GREEN}./deploy-infrastructure.sh${NC}"
    echo ""
    echo -e "${YELLOW}Or use menu: ${GREEN}bun run dev${NC} → Choose ${GREEN}4${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Infrastructure services are running${NC}"
echo ""

# Check prerequisites
if [ ! -f "$COMPOSE_APP" ]; then
    echo -e "${RED}❌ Error: $COMPOSE_APP not found!${NC}"
    exit 1
fi

if [ ! -f ".env.rausach" ]; then
    echo -e "${RED}❌ Error: .env.rausach not found!${NC}"
    exit 1
fi

# Step 1: Build Backend
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 Step 1/6: Building Backend${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_PATH/backend"

# Clean previous build
if [ -d "dist" ]; then
    echo -e "${BLUE}  → Cleaning previous build...${NC}"
    rm -rf dist
fi

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  → Installing backend dependencies...${NC}"
    bun install
else
    echo -e "${BLUE}  → node_modules exists, checking for updates...${NC}"
    bun install --frozen-lockfile 2>/dev/null || bun install
fi

# Generate Prisma Client
echo -e "${BLUE}  → Generating Prisma Client...${NC}"
bunx prisma generate

echo -e "${BLUE}  → Building TypeScript...${NC}"
if ! bun run build; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    echo -e "${YELLOW}Trying with tsc directly...${NC}"
    bunx tsc
fi

if [ ! -d "dist" ] || [ ! -f "dist/main.js" ]; then
    echo -e "${RED}❌ Backend build failed! dist/main.js not found${NC}"
    exit 1
fi

echo -e "${GREEN}  ✅ Backend built successfully${NC}"
cd "$PROJECT_PATH"

# Step 2: Build Frontend
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🎨 Step 2/6: Building Frontend${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_PATH/frontend"

# Clean previous build
if [ -d ".next" ]; then
    echo -e "${BLUE}  → Cleaning previous build...${NC}"
    rm -rf .next
fi

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  → Installing frontend dependencies...${NC}"
    bun install
else
    echo -e "${BLUE}  → node_modules exists, checking for updates...${NC}"
    bun install --frozen-lockfile 2>/dev/null || bun install
fi

# Copy environment file
if [ -f "../.env.prod.rausach" ]; then
    echo -e "${BLUE}  → Copying production environment...${NC}"
    cp ../.env.prod.rausach .env.local
elif [ -f "../.env.rausach" ]; then
    echo -e "${YELLOW}  ⚠️  .env.prod.rausach not found, using .env.rausach${NC}"
    cp ../.env.rausach .env.local
else
    echo -e "${RED}❌ No environment file found!${NC}"
    exit 1
fi

echo -e "${BLUE}  → Building Next.js application for production...${NC}"
if ! bun run build; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    echo -e "${YELLOW}Checking for common issues...${NC}"
    
    # Check if GraphQL endpoint is set
    if ! grep -q "NEXT_PUBLIC_GRAPHQL_ENDPOINT" .env.local; then
        echo -e "${RED}  ✗ NEXT_PUBLIC_GRAPHQL_ENDPOINT not set in .env.local${NC}"
    fi
    
    exit 1
fi

if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
    echo -e "${RED}❌ Frontend build failed! .next directory incomplete${NC}"
    exit 1
fi

echo -e "${GREEN}  ✅ Frontend built successfully${NC}"
echo -e "${BLUE}     Build ID: $(cat .next/BUILD_ID)${NC}"
cd "$PROJECT_PATH"

# Step 3: Build Docker Images Locally
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🐳 Step 3/6: Building Docker Images Locally${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Remove old images to force fresh build
echo -e "${BLUE}  → Removing old local images...${NC}"
docker rmi -f $IMAGE_BACKEND $IMAGE_FRONTEND 2>/dev/null || true

# Build backend image (context is project root, not backend/)
echo -e "${BLUE}  → Building backend Docker image (no cache)...${NC}"
docker build -t $IMAGE_BACKEND \
    -f backend/Dockerfile \
    --build-arg NODE_ENV=production \
    --no-cache \
    .

# Build frontend image (context is project root, not frontend/)
echo -e "${BLUE}  → Building frontend Docker image (no cache)...${NC}"
docker build -t $IMAGE_FRONTEND \
    -f frontend/Dockerfile.rausach \
    --build-arg NODE_ENV=production \
    --no-cache \
    .

echo -e "${GREEN}  ✅ Docker images built${NC}"

# Step 4: Save Docker Images
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💾 Step 4/6: Saving Docker Images${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

mkdir -p $IMAGE_TAR_DIR

echo -e "${BLUE}  → Saving backend image...${NC}"
docker save $IMAGE_BACKEND | gzip > $IMAGE_TAR_DIR/backend.tar.gz

echo -e "${BLUE}  → Saving frontend image...${NC}"
docker save $IMAGE_FRONTEND | gzip > $IMAGE_TAR_DIR/frontend.tar.gz

# Get file sizes
BACKEND_SIZE=$(du -h $IMAGE_TAR_DIR/backend.tar.gz | cut -f1)
FRONTEND_SIZE=$(du -h $IMAGE_TAR_DIR/frontend.tar.gz | cut -f1)

echo -e "${GREEN}  ✅ Images saved${NC}"
echo -e "     Backend:  $BACKEND_SIZE"
echo -e "     Frontend: $FRONTEND_SIZE"

# Step 5: Transfer to Server
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📤 Step 5/6: Transferring to Server${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create directories on server
ssh $SERVER "mkdir -p $REMOTE_DIR/docker-images"

echo -e "${BLUE}  → Uploading backend image...${NC}"
rsync -avz --progress $IMAGE_TAR_DIR/backend.tar.gz $SERVER:$REMOTE_DIR/docker-images/

echo -e "${BLUE}  → Uploading frontend image...${NC}"
rsync -avz --progress $IMAGE_TAR_DIR/frontend.tar.gz $SERVER:$REMOTE_DIR/docker-images/

echo -e "${BLUE}  → Uploading configuration files...${NC}"
rsync -avz $COMPOSE_APP $COMPOSE_INFRA .env.rausach .env.prod.rausach $SERVER:$REMOTE_DIR/

# Check and warn about GOOGLE_GEMINI_API_KEY
if ! grep -q "GOOGLE_GEMINI_API_KEY=" .env.rausach 2>/dev/null || grep -q "GOOGLE_GEMINI_API_KEY=$" .env.rausach 2>/dev/null; then
    echo -e "${YELLOW}  ⚠️  Warning: GOOGLE_GEMINI_API_KEY not set in .env.rausach${NC}"
    echo -e "${YELLOW}     Support Chat AI will not work without this key${NC}"
fi

# Upload .env.production if exists
if [ -f ".env.production" ]; then
    echo -e "${BLUE}  → Uploading secrets...${NC}"
    rsync -avz .env.production $SERVER:$REMOTE_DIR/
    ssh $SERVER "chmod 600 $REMOTE_DIR/.env.production"
fi

echo -e "${GREEN}  ✅ Transfer completed${NC}"

# Step 6: Deploy on Server
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 Step 6/6: Deploying on Server${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh $SERVER << 'ENDSSH'
    set -e
    cd /root/shoprausach
    
    echo "  → Backing up current images for rollback..."
    # Only tag if images exist
    if docker images | grep -q "rausach-backend.*latest"; then
        docker tag rausach-backend:latest rausach-backend:previous 2>/dev/null || true
    fi
    if docker images | grep -q "rausach-frontend.*latest"; then
        docker tag rausach-frontend:latest rausach-frontend:previous 2>/dev/null || true
    fi
    
    echo "  → Removing old 'latest' tags to avoid conflicts..."
    docker rmi rausach-backend:latest rausach-frontend:latest 2>/dev/null || true
    
    echo "  → Loading new Docker images..."
    docker load < docker-images/backend.tar.gz
    docker load < docker-images/frontend.tar.gz
    
    echo "  → Verifying loaded images..."
    docker images | grep -E "rausach-(backend|frontend).*latest" || echo "⚠️  Warning: Images may not be loaded properly"
    
    echo "  → Ensuring infrastructure is running..."
    if ! docker ps | grep -q "shoppostgres"; then
        echo "  → Starting infrastructure services..."
        docker compose -f docker-compose.infra.yml up -d
        echo "  → Waiting for infrastructure to be ready..."
        sleep 10
    else
        echo "  ✓ Infrastructure already running"
    fi
    
    echo "  → Stopping old app containers..."
    docker rm -f shopbackend shopfrontend 2>/dev/null || true
    
    echo "  → Starting app services with new images..."
    docker compose -f docker-compose.app.yml up -d --force-recreate
    
    echo "  → Waiting for services to be ready..."
    echo "     (Backend needs time to connect to DB, Redis, Minio...)"
    sleep 45
    
    echo ""
    echo "📊 Container Status:"
    docker compose -f docker-compose.app.yml ps
    
    echo ""
    echo "🔍 Verifying new deployment:"
    echo "Backend container created:"
    docker inspect shopbackend --format='{{.Created}}' | head -c 19
    echo ""
    echo "Frontend container created:"
    docker inspect shopfrontend --format='{{.Created}}' | head -c 19
    echo ""
    
    echo ""
    echo "💾 Resource Usage:"
    echo "Memory:"
    free -h | grep -E "Mem:|Swap:"
    echo ""
    echo "Disk:"
    df -h / | grep -E "/dev"
    
    echo ""
    echo "🧹 Cleaning up old project images..."
    # Remove old project images (keep latest and previous)
    for image_type in backend frontend; do
        OLD_IMAGES=$(docker images "rausach-${image_type}" --format "{{.ID}}" | tail -n +3)
        if [ ! -z "$OLD_IMAGES" ]; then
            echo "$OLD_IMAGES" | xargs -r docker rmi -f 2>/dev/null || true
        fi
    done
    
    # Remove dangling project images
    docker images -f "dangling=true" --filter "reference=rausach-*" -q | xargs -r docker rmi 2>/dev/null || true
    
    echo "  ✅ Cleanup completed (kept latest + previous for rollback)"
ENDSSH

# Step 7: Health Checks
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🏥 Health Checks${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}  → Testing Frontend (12000)...${NC}"
FRONTEND_STATUS=0
for i in {1..3}; do
    if curl -sf -o /dev/null http://116.118.49.243:12000; then
        echo -e "${GREEN}    ✅ Frontend OK${NC}"
        FRONTEND_STATUS=1
        break
    fi
    [ $i -lt 3 ] && sleep 3
done
[ $FRONTEND_STATUS -eq 0 ] && echo -e "${RED}    ❌ Frontend FAIL${NC}"

echo -e "${BLUE}  → Testing Backend (12001)...${NC}"
BACKEND_STATUS=0
for i in {1..5}; do
    if curl -sf http://116.118.49.243:12001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' 2>/dev/null | grep -q "Query"; then
        echo -e "${GREEN}    ✅ Backend OK${NC}"
        BACKEND_STATUS=1
        break
    fi
    [ $i -lt 5 ] && echo -e "     Attempt $i/5... (waiting for backend startup)" && sleep 10
done

if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "${RED}    ❌ Backend FAIL - Check logs: ssh root@116.118.49.243 'docker logs shopbackend --tail 50'${NC}"
fi

# Cleanup local images
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🧹 Cleaning Up Local Files${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}  → Removing local image tars...${NC}"
rm -rf $IMAGE_TAR_DIR
echo -e "${GREEN}  ✅ Local cleanup completed${NC}"

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ DEPLOYMENT COMPLETED!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo -e "   Frontend:  ${GREEN}http://116.118.49.243:12000${NC}"
echo -e "   Backend:   ${GREEN}http://116.118.49.243:12001/graphql${NC}"
echo ""
echo -e "${BLUE}📊 Monitoring:${NC}"
echo -e "   App Logs:     ${YELLOW}ssh root@116.118.49.243 'docker logs shopbackend -f'${NC}"
echo -e "   App Status:   ${YELLOW}ssh root@116.118.49.243 'docker ps | grep -E \"shop(backend|frontend)\"'${NC}"
echo -e "   Infra Status: ${YELLOW}ssh root@116.118.49.243 'docker ps | grep -E \"postgres|redis|minio\"'${NC}"
echo ""
echo -e "${BLUE}💡 Performance Benefits:${NC}"
echo -e "   ✓ Server CPU/RAM saved (no build on server)"
echo -e "   ✓ Faster deployment (pre-built images)"
echo -e "   ✓ Consistent builds (same environment)"
echo -e "   ✓ Easy rollback (saved images)"
echo ""
