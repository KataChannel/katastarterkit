#!/bin/bash

# ============================================================================
# Build Locally and Deploy to Server
# Build on local machine (more powerful) then copy to server
# This avoids OOM and timeout issues on low-resource server
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVER_IP="116.118.48.208"
SERVER_USER="${SSH_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
PROJECT_DIR="/opt/innerv2"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   BUILD LOCALLY & DEPLOY TO SERVER            ║${NC}"
echo -e "${BLUE}║   Avoid OOM on low-resource server            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📦 Strategy:${NC}"
echo "   1. Build frontend & backend on LOCAL machine (powerful)"
echo "   2. Copy only built artifacts to server (small size)"
echo "   3. Build minimal Docker images on server (no compilation)"
echo "   4. Fast deployment without OOM errors"
echo ""

read -p "$(echo -e ${GREEN}Continue? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 1: Prepare Backend Locally${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

cd "$LOCAL_DIR/backend"

echo -e "${YELLOW}[1.1] Installing backend dependencies...${NC}"
bun install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${YELLOW}[1.2] Generating Prisma Client...${NC}"
bun prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"

echo -e "${YELLOW}[1.3] Backend build...${NC}"
echo -e "${BLUE}Skipping TypeScript compilation - Bun runs TS directly${NC}"
echo -e "${BLUE}node_modules with Prisma Client ready to sync${NC}"
echo -e "${GREEN}✓ Backend ready${NC}"

cd "$LOCAL_DIR"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 2: Build Frontend Locally${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

cd "$LOCAL_DIR/frontend"

echo -e "${YELLOW}[2.1] Installing frontend dependencies...${NC}"
bun install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${YELLOW}[2.2] Building Next.js production (with Webpack)...${NC}"
if [ -f next.config.production.js ]; then
    cp next.config.production.js next.config.js
    echo -e "${BLUE}Using optimized production config${NC}"
fi

# Build with Next.js using Webpack (not Turbopack) for lower memory usage
# Use npx to ensure correct Next.js binary is used
NODE_OPTIONS="--max-old-space-size=4096" npx next build --experimental-build-mode=compile

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

cd "$LOCAL_DIR"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 3: Sync to Server${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}[3.1] Syncing all files to server...${NC}"
rsync -avz --delete \
    --exclude '.git' \
    --exclude '.github' \
    --exclude 'node_modules' \
    --exclude 'backend/node_modules' \
    --exclude '.next' \
    --exclude 'frontend/.next' \
    --exclude 'dist' \
    --exclude 'backend/dist' \
    --exclude '.turbo' \
    --exclude 'coverage' \
    --exclude '.env.local' \
    --exclude '.env.development' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    --exclude 'logs/*' \
    --exclude 'data/postgres/*' \
    --exclude 'data/redis/*' \
    --exclude 'data/minio/*' \
    --exclude 'backend/logs/*' \
    --exclude 'backend/data/*' \
    --exclude '.vscode' \
    --exclude '.idea' \
    --exclude '*.swp' \
    --exclude '*~' \
    --progress \
    -e "ssh -p $SSH_PORT" \
    "$LOCAL_DIR/" \
    "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/"

echo -e "${GREEN}✓ Files synced${NC}"

echo -e "${YELLOW}[3.2] Syncing backend node_modules...${NC}"
rsync -avz --progress \
    -e "ssh -p $SSH_PORT" \
    "$LOCAL_DIR/backend/node_modules/" \
    "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/backend/node_modules/"
echo -e "${GREEN}✓ Backend dependencies synced${NC}"

echo -e "${YELLOW}[3.3] Syncing frontend build (.next)...${NC}"
rsync -avz --progress \
    -e "ssh -p $SSH_PORT" \
    "$LOCAL_DIR/frontend/.next/" \
    "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/frontend/.next/"
echo -e "${GREEN}✓ Frontend build synced${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STEP 4: Deploy on Server (No Build)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}[4.1] Setting up environment...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "bash -s" <<'REMOTE_SETUP'
cd /opt/innerv2

if [ ! -f .env.production ]; then
    echo "[INFO] Creating .env.production..."
    
    POSTGRES_PASS="postgres_$(openssl rand -hex 16)"
    REDIS_PASS="redis_$(openssl rand -hex 16)"
    JWT_SECRET="$(openssl rand -hex 32)"
    NEXTAUTH_SECRET="$(openssl rand -hex 32)"
    MINIO_SECRET="$(openssl rand -hex 16)"
    
    cat > .env.production << 'EOF'
NODE_ENV=production
DOMAIN=116.118.48.208
SSL_EMAIL=admin@innerv2core.com
ENABLE_MIGRATIONS=true

POSTGRES_USER=postgres
POSTGRES_PASSWORD=POSTGRES_PASS_PLACEHOLDER
POSTGRES_DB=innerv2
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:POSTGRES_PASS_PLACEHOLDER@postgres:5432/innerv2

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=REDIS_PASS_PLACEHOLDER
REDIS_URL=redis://:REDIS_PASS_PLACEHOLDER@redis:6379

JWT_SECRET=JWT_SECRET_PLACEHOLDER
JWT_EXPIRATION=7d

NEXTAUTH_URL=http://116.118.48.208:14000
NEXTAUTH_SECRET=NEXTAUTH_SECRET_PLACEHOLDER

MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=innerv2-admin
MINIO_SECRET_KEY=MINIO_SECRET_PLACEHOLDER
MINIO_BUCKET=innerv2-bucket
MINIO_USE_SSL=false
MINIO_PUBLIC_URL=http://116.118.48.208:14007

BACKEND_URL=http://backend:14001
FRONTEND_URL=http://116.118.48.208:14000
GRAPHQL_ENDPOINT=http://backend:14001/graphql

LOG_LEVEL=info

BACKEND_PORT=14001
FRONTEND_PORT=14000
POSTGRES_PUBLIC_PORT=14003
REDIS_PUBLIC_PORT=14004
MINIO_PUBLIC_PORT=14007
MINIO_CONSOLE_PORT=14008
EOF

    sed -i "s/POSTGRES_PASS_PLACEHOLDER/$POSTGRES_PASS/g" .env.production
    sed -i "s/REDIS_PASS_PLACEHOLDER/$REDIS_PASS/g" .env.production
    sed -i "s/JWT_SECRET_PLACEHOLDER/$JWT_SECRET/g" .env.production
    sed -i "s/NEXTAUTH_SECRET_PLACEHOLDER/$NEXTAUTH_SECRET/g" .env.production
    sed -i "s/MINIO_SECRET_PLACEHOLDER/$MINIO_SECRET/g" .env.production
    
    echo "[SUCCESS] .env.production created"
else
    echo "[INFO] .env.production exists"
fi
REMOTE_SETUP

echo -e "${GREEN}✓ Environment ready${NC}"

echo -e "${YELLOW}[4.2] Stopping existing containers...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.prebuilt.yml down 2>/dev/null || true"
echo -e "${GREEN}✓ Containers stopped${NC}"

echo -e "${YELLOW}[4.3] Building minimal Docker images (no compilation)...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.prebuilt.yml build --no-cache"
echo -e "${GREEN}✓ Images built${NC}"

echo -e "${YELLOW}[4.4] Starting services...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.prebuilt.yml up -d"
echo -e "${GREEN}✓ Services started${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Waiting for services to be healthy...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""
sleep 30

echo -e "${YELLOW}Checking container status...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.prebuilt.yml ps"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         DEPLOYMENT SUCCESSFUL!                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📱 Access URLs:${NC}"
echo -e "   Frontend:  ${GREEN}http://116.118.48.208:14000${NC}"
echo -e "   Backend:   ${GREEN}http://116.118.48.208:14001${NC}"
echo -e "   GraphQL:   ${GREEN}http://116.118.48.208:14001/graphql${NC}"
echo -e "   Minio:     ${GREEN}http://116.118.48.208:14007${NC}"
echo -e "   Console:   ${GREEN}http://116.118.48.208:14008${NC}"
echo ""

echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "   View logs:    ${YELLOW}ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose -f docker-compose.build.fast.yml logs -f'${NC}"
echo -e "   Check status: ${YELLOW}./check-status.sh${NC}"
echo -e "   Restart:      ${YELLOW}ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose -f docker-compose.build.fast.yml restart'${NC}"
echo ""

echo -e "${GREEN}✅ Build locally & deploy completed!${NC}"
echo -e "${BLUE}💡 Next deployment: Just run this script again - it will sync only changed files${NC}"
