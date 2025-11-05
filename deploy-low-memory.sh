#!/bin/bash
# Low-Memory Production Deployment Script for 1 Core, 2GB RAM Server
# Server: 116.118.48.208
# Usage: ./deploy-low-memory.sh

set -e

echo "🚀 InnerV2 Low-Memory Production Deployment"
echo "============================================"
echo "Server: 116.118.48.208 (1 Core, 2GB RAM)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="backups"
LOG_FILE="deploy_$(date +%Y%m%d_%H%M%S).log"

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

# Check requirements
check_requirements() {
    log "Checking system requirements..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker not installed"
        exit 1
    fi
    
    TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
    AVAILABLE_MEM=$(free -m | awk '/^Mem:/{print $7}')
    
    log "Total RAM: ${TOTAL_MEM}MB, Available: ${AVAILABLE_MEM}MB"
    
    if [ "$AVAILABLE_MEM" -lt 600 ]; then
        warn "Low memory! Clearing caches..."
        sudo sync
        echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null 2>&1 || true
    fi
    
    log "✓ Requirements OK"
}

# Stop and clean
cleanup() {
    log "Stopping services..."
    docker compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true
    
    log "Cleaning up Docker resources..."
    docker system prune -f 2>/dev/null || true
    
    log "✓ Cleanup complete"
}

# Backup database
backup_db() {
    log "Backing up database..."
    mkdir -p "$BACKUP_DIR"
    
    if docker ps -a | grep -q innerv2-postgres; then
        BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
        docker exec innerv2-postgres pg_dump -U postgres tazagroupcore > "$BACKUP_FILE" 2>/dev/null || {
            warn "No database to backup"
            return 0
        }
        log "✓ Backed up to $BACKUP_FILE"
    fi
}

# Build images
build() {
    log "Building images..."
    DOCKER_BUILDKIT=1 docker compose -f "$COMPOSE_FILE" build --no-cache 2>&1 | tee -a "$LOG_FILE"
    log "✓ Build complete"
}

# Start services sequentially
start() {
    log "Starting services..."
    
    log "→ PostgreSQL..."
    docker compose -f "$COMPOSE_FILE" up -d postgres
    sleep 10
    
    log "→ Redis..."
    docker compose -f "$COMPOSE_FILE" up -d redis
    sleep 5
    
    log "→ Minio..."
    docker compose -f "$COMPOSE_FILE" up -d minio
    sleep 5
    
    log "→ Backend..."
    docker compose -f "$COMPOSE_FILE" up -d backend
    sleep 20
    
    log "→ Frontend..."
    docker compose -f "$COMPOSE_FILE" up -d frontend
    
    log "✓ All services started"
}

# Run migrations
migrate() {
    log "Running migrations..."
    sleep 15
    
    docker exec innerv2-backend bunx prisma migrate deploy 2>&1 | tee -a "$LOG_FILE" || {
        warn "Migrations skipped or failed"
    }
    
    log "✓ Migrations done"
}

# Health check
health() {
    log "Health checks..."
    
    for service in postgres redis minio backend frontend; do
        CONTAINER="innerv2-$service"
        if docker ps --format '{{.Names}}' | grep -q "$CONTAINER"; then
            log "✓ $service running"
        else
            error "$service NOT running"
        fi
    done
    
    sleep 5
    curl -f http://localhost:14001/health > /dev/null 2>&1 && log "✓ Backend healthy" || warn "Backend not ready"
    curl -f http://localhost:14000 > /dev/null 2>&1 && log "✓ Frontend accessible" || warn "Frontend not ready"
}

# Show status
status() {
    echo ""
    echo "=========================================="
    log "Deployment Status"
    echo "=========================================="
    
    docker compose -f "$COMPOSE_FILE" ps
    
    echo ""
    log "Memory Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    
    echo ""
    log "System:"
    free -h
    
    echo ""
    echo "=========================================="
    echo "✅ Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "Frontend: http://116.118.48.208:14000"
    echo "Backend:  http://116.118.48.208:14001"
    echo "GraphQL:  http://116.118.48.208:14001/graphql"
    echo "Minio:    http://116.118.48.208:14008"
    echo ""
    echo "Logs:  docker compose -f $COMPOSE_FILE logs -f"
    echo "Stop:  docker compose -f $COMPOSE_FILE down"
    echo ""
}

# Main
main() {
    log "Starting deployment..."
    
    check_requirements
    backup_db
    cleanup
    build
    start
    migrate
    health
    status
    
    log "✅ Done!"
}

main "$@"
