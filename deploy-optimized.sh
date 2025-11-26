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
COMPOSE_FILE="docker-compose.hybrid.yml"

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
echo -e "${BLUE}║     Build Local → Transfer → Deploy                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📍 Server:${NC} $SERVER"
echo -e "${GREEN}📦 Project:${NC} Rausach (Single Domain)"
echo -e "${GREEN}🏗️  Strategy:${NC} Local Build + Image Transfer"
echo ""

# Check prerequisites
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Error: $COMPOSE_FILE not found!${NC}"
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

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  → Installing backend dependencies...${NC}"
    bun install
fi

echo -e "${BLUE}  → Building TypeScript...${NC}"
bun run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
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

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}  → Installing frontend dependencies...${NC}"
    bun install
fi

# Copy environment file
cp ../.env.prod.rausach .env.local

echo -e "${BLUE}  → Building Next.js application...${NC}"
bun run build

if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}  ✅ Frontend built successfully${NC}"
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
rsync -avz $COMPOSE_FILE .env.rausach .env.prod.rausach $SERVER:$REMOTE_DIR/

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
    
    echo "  → Tagging old images for rollback..."
    docker tag rausach-backend:latest rausach-backend:previous 2>/dev/null || true
    docker tag rausach-frontend:latest rausach-frontend:previous 2>/dev/null || true
    
    echo "  → Loading Docker images..."
    docker load < docker-images/backend.tar.gz
    docker load < docker-images/frontend.tar.gz
    
    echo "  → Verifying loaded images..."
    docker images | grep -E "rausach-(backend|frontend).*latest" || echo "⚠️  Warning: Images may not be loaded properly"
    
    echo "  → Stopping old containers..."
    docker compose -f docker-compose.hybrid.yml down 2>/dev/null || true
    
    echo "  → Removing old containers to force recreate..."
    docker rm -f shopbackend shopfrontend 2>/dev/null || true
    
    echo "  → Starting services with new images..."
    docker compose -f docker-compose.hybrid.yml up -d --force-recreate --no-build
    
    echo "  → Waiting for services to be ready..."
    sleep 20
    
    echo ""
    echo "📊 Container Status:"
    docker compose -f docker-compose.hybrid.yml ps
    
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

sleep 5

echo -e "${BLUE}  → Testing Frontend (12000)...${NC}"
if curl -sf -o /dev/null http://116.118.49.243:12000; then
    echo -e "${GREEN}    ✅ Frontend OK${NC}"
else
    echo -e "${RED}    ❌ Frontend FAIL${NC}"
fi

echo -e "${BLUE}  → Testing Backend (12001)...${NC}"
if curl -sf http://116.118.49.243:12001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' | grep -q "Query"; then
    echo -e "${GREEN}    ✅ Backend OK${NC}"
else
    echo -e "${RED}    ❌ Backend FAIL${NC}"
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
echo -e "   Logs:      ${YELLOW}ssh root@116.118.49.243 'docker compose -f docker-compose.hybrid.yml logs -f'${NC}"
echo -e "   Status:    ${YELLOW}ssh root@116.118.49.243 'docker compose -f docker-compose.hybrid.yml ps'${NC}"
echo ""
echo -e "${BLUE}💡 Performance Benefits:${NC}"
echo -e "   ✓ Server CPU/RAM saved (no build on server)"
echo -e "   ✓ Faster deployment (pre-built images)"
echo -e "   ✓ Consistent builds (same environment)"
echo -e "   ✓ Easy rollback (saved images)"
echo ""
