#!/bin/bash
# Simple Production Deployment - No Docker Build
# Server: 116.118.48.208
# Usage: Run this script ON THE SERVER

set -e

echo "🚀 Simple Production Deployment"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Check if running on server
if [ ! -d "/root/innerv2" ]; then
    error "Must run on server at /root/innerv2"
fi

cd /root/innerv2

# Step 1: Stop old containers
log "Stopping old containers..."
docker compose down --remove-orphans 2>/dev/null || true

# Step 2: Start only databases (no app containers)
log "Starting databases..."
docker compose up -d postgres redis minio

# Wait for databases
log "Waiting for databases to be ready..."
sleep 15

# Step 3: Install backend dependencies
log "Installing backend dependencies..."
cd backend
bun install --frozen-lockfile

# Step 4: Generate Prisma Client
log "Generating Prisma Client..."
bunx prisma generate

# Step 5: Run migrations
log "Running database migrations..."
bunx prisma migrate deploy || warn "Migration failed, continuing..."

# Step 6: Build backend
log "Building backend..."
bun run build

# Step 7: Start backend with PM2
log "Starting backend with PM2..."
pm2 delete innerv2-backend 2>/dev/null || true
pm2 start dist/main.js --name innerv2-backend \
    --max-memory-restart 500M \
    --env production

# Step 8: Install frontend dependencies
log "Installing frontend dependencies..."
cd ../frontend
bun install --frozen-lockfile

# Step 9: Build frontend
log "Building frontend..."
bun run build

# Step 10: Start frontend with PM2
log "Starting frontend with PM2..."
pm2 delete innerv2-frontend 2>/dev/null || true
pm2 start npm --name innerv2-frontend -- start

# Step 11: Save PM2 config
pm2 save

# Step 12: Setup PM2 startup
pm2 startup || warn "PM2 startup setup failed"

log "✅ Deployment complete!"
echo ""
echo "Services:"
echo "  Frontend: http://116.118.48.208:14000"
echo "  Backend:  http://116.118.48.208:14001"
echo ""
echo "Manage:"
echo "  pm2 status"
echo "  pm2 logs innerv2-backend"
echo "  pm2 logs innerv2-frontend"
echo "  pm2 restart all"
echo "  pm2 stop all"
