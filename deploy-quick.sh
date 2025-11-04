#!/bin/bash

# ============================================================================
# QUICK DEPLOYMENT SCRIPT FOR SERVER 116.118.48.208
# Builds inside Docker containers (slower but simpler)
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="116.118.48.208"
ENV_FILE=".env.production"
COMPOSE_FILE="docker-compose.build.yml"

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
echo -e "${BLUE}║   QUICK DEPLOY TO $SERVER_IP          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check environment file
if [ ! -f "$ENV_FILE" ]; then
    log_error "File $ENV_FILE not found!"
    exit 1
fi

log_success "Environment file found"

# Cleanup old containers
log_info "Stopping existing containers..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down 2>/dev/null || true

# Cleanup Docker resources
log_info "Cleaning up Docker resources..."
docker container prune -f 2>/dev/null || true
docker image prune -f 2>/dev/null || true

# Deploy
log_info "Building and deploying services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

# Wait for services
log_info "Waiting for services to start..."
sleep 15

# Check status
log_info "Checking service status..."
docker compose -f "$COMPOSE_FILE" ps

echo ""
log_success "Deployment completed!"
echo ""
log_info "Application URLs:"
log_info "  Frontend:     http://$SERVER_IP:14000"
log_info "  Backend:      http://$SERVER_IP:14001"
log_info "  GraphQL:      http://$SERVER_IP:14001/graphql"
log_info "  Minio:        http://$SERVER_IP:14007"
log_info "  Minio Console: http://$SERVER_IP:14008"
echo ""
log_info "To view logs:   docker compose -f $COMPOSE_FILE logs -f"
log_info "To stop:        docker compose -f $COMPOSE_FILE down"
echo ""
