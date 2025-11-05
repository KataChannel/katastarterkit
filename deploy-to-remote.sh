#!/bin/bash
# Remote Deployment Script for Server 116.118.48.208
# Usage: ./deploy-to-remote.sh

set -e

# Configuration
REMOTE_SERVER="116.118.48.208"
REMOTE_USER="root"
REMOTE_DIR="/root/innerv2"
LOCAL_DIR="$(pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo "🚀 Remote Deployment to 116.118.48.208"
echo "======================================"
echo ""

# Check SSH connection
log "Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_SERVER" "echo 'SSH OK'" > /dev/null 2>&1; then
    error "Cannot connect to $REMOTE_SERVER"
    echo "Please ensure:"
    echo "1. SSH key is configured: ssh-copy-id $REMOTE_USER@$REMOTE_SERVER"
    echo "2. Server is accessible"
    exit 1
fi
log "✓ SSH connection OK"

# Sync code to server
log "Syncing code to server..."
rsync -avz --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
    --exclude 'backups' \
    --exclude '.git' \
    --exclude '*.log' \
    "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_SERVER:$REMOTE_DIR/"

log "✓ Code synced"

# Deploy on remote server
log "Deploying on remote server..."
ssh "$REMOTE_USER@$REMOTE_SERVER" << 'ENDSSH'
set -e

cd /root/innerv2

echo "📦 Installing dependencies if needed..."
if ! command -v docker &> /dev/null; then
    echo "Docker not installed. Please install Docker first."
    exit 1
fi

echo "🛑 Stopping old containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

echo "🧹 Cleaning up..."
docker system prune -f 2>/dev/null || true

echo "🔨 Building images..."
DOCKER_BUILDKIT=1 docker compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
# Start sequentially to avoid memory spikes
docker compose -f docker-compose.prod.yml up -d postgres
echo "Waiting for PostgreSQL..."
sleep 15

docker compose -f docker-compose.prod.yml up -d redis
echo "Waiting for Redis..."
sleep 5

docker compose -f docker-compose.prod.yml up -d minio
echo "Waiting for Minio..."
sleep 5

docker compose -f docker-compose.prod.yml up -d backend
echo "Waiting for Backend..."
sleep 25

docker compose -f docker-compose.prod.yml up -d frontend
echo "Waiting for Frontend..."
sleep 10

echo "🔄 Running migrations..."
docker exec innerv2-backend bunx prisma migrate deploy 2>&1 || echo "Migration skipped or failed"

echo "✅ Deployment complete!"
echo ""
echo "Checking status..."
docker compose -f docker-compose.prod.yml ps

echo ""
echo "Checking health..."
curl -f http://localhost:14001/health 2>/dev/null && echo "✓ Backend healthy" || echo "✗ Backend not ready"
curl -f http://localhost:14000/api/health 2>/dev/null && echo "✓ Frontend healthy" || echo "✗ Frontend not ready"

ENDSSH

log "✅ Remote deployment complete!"
echo ""
echo "=========================================="
echo "Deployment Info:"
echo "=========================================="
echo "Server: $REMOTE_SERVER"
echo "Frontend: http://$REMOTE_SERVER:14000"
echo "Backend: http://$REMOTE_SERVER:14001"
echo "GraphQL: http://$REMOTE_SERVER:14001/graphql"
echo ""
echo "View logs:"
echo "  ssh $REMOTE_USER@$REMOTE_SERVER 'cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml logs -f'"
echo ""
echo "Monitor:"
echo "  ssh $REMOTE_USER@$REMOTE_SERVER 'cd $REMOTE_DIR && ./monitor.sh'"
echo ""
