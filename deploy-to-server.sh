#!/bin/bash

# ============================================================================
# DEPLOYMENT SCRIPT FOR SERVER 116.118.48.208
# Optimized for 1 Core, 2GB RAM, 10GB Disk
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="116.118.48.208"
ENV_FILE=".env.production"
COMPOSE_FILE="docker-compose.production.yml"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DEPLOYMENT TO SERVER $SERVER_IP   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check environment file
if [ ! -f "$ENV_FILE" ]; then
    log_error "File $ENV_FILE not found!"
    exit 1
fi

log_success "Environment file found"

# Check system resources
log_info "Checking system resources..."
FREE_RAM=$(free -m | awk 'NR==2{print $7}')
FREE_DISK=$(df -BG . | awk 'NR==2{print $4}' | sed 's/G//')

log_info "Available RAM: ${FREE_RAM}MB"
log_info "Available Disk: ${FREE_DISK}GB"

if [ "$FREE_RAM" -lt 500 ]; then
    log_error "Insufficient free RAM (need at least 500MB free)"
    log_info "Stopping other services or increasing swap..."
fi

# Setup swap if needed
SWAP_SIZE=$(free -m 2>/dev/null | awk 'NR==3{print $2}' || echo "0")
# Convert to number, default to 0 if empty
SWAP_SIZE=${SWAP_SIZE:-0}

if [ "$SWAP_SIZE" -lt 2048 ]; then
    log_info "Setting up swap file (current: ${SWAP_SIZE}MB)..."
    if [ ! -f /swapfile ]; then
        log_info "Creating 2GB swap file..."
        sudo fallocate -l 2G /swapfile 2>/dev/null || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        
        # Make permanent
        if ! grep -q '/swapfile' /etc/fstab 2>/dev/null; then
            echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        fi
        
        sudo sysctl vm.swappiness=10
        log_success "Swap file created and activated"
    fi
fi

# Cleanup old Docker resources
log_info "Cleaning up Docker resources..."
docker container prune -f 2>/dev/null || true
docker image prune -f 2>/dev/null || true
docker builder prune -f 2>/dev/null || true
log_success "Docker cleanup completed"

# Build backend locally
log_info "Building backend..."
cd backend

log_info "Installing dependencies..."
bun install --frozen-lockfile

log_info "Generating Prisma Client..."
bun prisma generate

log_info "Compiling TypeScript..."
bun run build

log_info "Installing production dependencies..."
rm -rf node_modules
bun install --production
cd ..
log_success "Backend build completed"

# Build frontend locally
log_info "Building frontend..."
cd frontend
log_info "Installing dependencies..."
bun install --frozen-lockfile
log_info "Building Next.js..."
bun run build
cd ..
log_success "Frontend build completed"

# Stop existing containers
log_info "Stopping existing containers..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down 2>/dev/null || true

# Pull base images
log_info "Pulling base images..."
docker pull postgres:16-alpine &
docker pull redis:7.4-alpine &
docker pull minio/minio:RELEASE.2024-08-26T15-33-07Z &
docker pull oven/bun:1.3-alpine &
docker pull node:22-alpine &
wait

# Deploy
log_info "Deploying services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

# Wait for services
log_info "Waiting for services to start..."
sleep 10

# Check status
log_info "Checking service status..."
docker compose -f "$COMPOSE_FILE" ps

echo ""
log_success "Deployment completed!"
echo ""
log_info "Application URLs:"
log_info "  Frontend:  http://$SERVER_IP:14000"
log_info "  Backend:   http://$SERVER_IP:14001"
log_info "  GraphQL:   http://$SERVER_IP:14001/graphql"
log_info "  Minio:     http://$SERVER_IP:14007"
log_info "  MinioConsole: http://$SERVER_IP:14008"
echo ""
log_info "To view logs: docker compose -f $COMPOSE_FILE logs -f"
log_info "To stop: docker compose -f $COMPOSE_FILE down"
echo ""
