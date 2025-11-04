#!/bin/bash

# ============================================================================
# OPTIMIZED DEPLOYMENT SCRIPT for 1 Core, 2GB RAM, 10GB Disk Server
# ============================================================================
# This script handles complete deployment with optimization and cleanup
# Usage: ./deploy-optimized.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE=".env.production"
COMPOSE_FILE="docker-compose.production.yml"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [ "$EUID" -eq 0 ]; then 
        log_error "Do not run this script as root!"
        exit 1
    fi
}

# Check environment file
check_env() {
    log_info "Checking environment file..."
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found!"
        log_info "Please create $ENV_FILE with required variables"
        exit 1
    fi
    log_success "Environment file found"
}

# Check system resources
check_resources() {
    log_info "Checking system resources..."
    
    # Check RAM
    total_ram=$(free -m | awk 'NR==2{print $2}')
    if [ "$total_ram" -lt 1800 ]; then
        log_error "Insufficient RAM: ${total_ram}MB (minimum 2GB required)"
        exit 1
    fi
    
    # Check disk space
    available_disk=$(df -BG . | awk 'NR==2{print $4}' | sed 's/G//')
    if [ "$available_disk" -lt 5 ]; then
        log_error "Insufficient disk space: ${available_disk}GB (minimum 5GB free required)"
        exit 1
    fi
    
    log_success "System resources OK (RAM: ${total_ram}MB, Disk: ${available_disk}GB)"
}

# Cleanup old Docker resources
cleanup_docker() {
    log_info "Cleaning up Docker resources..."
    
    # Remove stopped containers
    docker container prune -f 2>/dev/null || true
    
    # Remove dangling images
    docker image prune -f 2>/dev/null || true
    
    # Remove unused volumes (CAREFUL!)
    # docker volume prune -f 2>/dev/null || true
    
    # Remove build cache
    docker builder prune -f 2>/dev/null || true
    
    log_success "Docker cleanup completed"
}

# Build backend locally
build_backend() {
    log_info "Building backend locally..."
    
    cd "$BACKEND_DIR"
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    bun install --frozen-lockfile
    
    # Build TypeScript
    log_info "Compiling TypeScript..."
    bun run build
    
    # Install production dependencies only
    log_info "Installing production dependencies..."
    rm -rf node_modules
    bun install --production --frozen-lockfile
    
    cd ..
    log_success "Backend build completed"
}

# Build frontend locally
build_frontend() {
    log_info "Building frontend locally..."
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    bun install --frozen-lockfile
    
    # Build Next.js with standalone output
    log_info "Building Next.js application..."
    bun run build
    
    cd ..
    log_success "Frontend build completed"
}

# Create swap file if needed (for low RAM)
setup_swap() {
    log_info "Checking swap configuration..."
    
    swap_size=$(free -m | awk 'NR==3{print $2}')
    
    if [ "$swap_size" -lt 2048 ]; then
        log_warning "Swap is less than 2GB, creating swap file..."
        
        # Create 2GB swap file
        if [ ! -f /swapfile ]; then
            sudo fallocate -l 2G /swapfile
            sudo chmod 600 /swapfile
            sudo mkswap /swapfile
            sudo swapon /swapfile
            
            # Make permanent
            if ! grep -q '/swapfile' /etc/fstab; then
                echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
            fi
            
            # Optimize swappiness for server
            sudo sysctl vm.swappiness=10
            echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
            
            log_success "Swap file created and activated"
        else
            log_info "Swap file already exists"
        fi
    else
        log_success "Swap configuration OK (${swap_size}MB)"
    fi
}

# Stop existing containers
stop_containers() {
    log_info "Stopping existing containers..."
    docker compose -f "$COMPOSE_FILE" down 2>/dev/null || true
    log_success "Containers stopped"
}

# Deploy with Docker Compose
deploy() {
    log_info "Deploying with Docker Compose..."
    
    # Pull base images first to avoid timeout
    log_info "Pulling base images..."
    docker pull postgres:16-alpine
    docker pull redis:7.4-alpine
    docker pull minio/minio:RELEASE.2024-08-26T15-33-07Z
    docker pull oven/bun:1.3-alpine
    docker pull node:22-alpine
    
    # Build and start services
    log_info "Building and starting services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build
    
    log_success "Deployment completed"
}

# Wait for services to be healthy
wait_for_services() {
    log_info "Waiting for services to be healthy..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        healthy=$(docker compose -f "$COMPOSE_FILE" ps | grep -c "healthy" || echo "0")
        total=$(docker compose -f "$COMPOSE_FILE" ps | grep -c "Up" || echo "0")
        
        log_info "Services health check: $healthy/$total healthy"
        
        if [ "$healthy" -eq "$total" ] && [ "$total" -gt 0 ]; then
            log_success "All services are healthy!"
            return 0
        fi
        
        sleep 10
        ((attempt++))
    done
    
    log_error "Services failed to become healthy within timeout"
    docker compose -f "$COMPOSE_FILE" ps
    return 1
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    echo ""
    docker compose -f "$COMPOSE_FILE" ps
    echo ""
    
    log_info "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    echo ""
    
    log_info "Disk Usage:"
    docker system df
    echo ""
}

# Main execution
main() {
    log_info "Starting optimized deployment..."
    echo ""
    
    check_root
    check_env
    check_resources
    setup_swap
    cleanup_docker
    
    log_info "Building applications locally..."
    build_backend
    build_frontend
    
    stop_containers
    deploy
    wait_for_services
    
    # Final cleanup
    cleanup_docker
    
    show_status
    
    log_success "Deployment completed successfully!"
    log_info "Application is running at:"
    log_info "  - Frontend: http://localhost:3000"
    log_info "  - Backend:  http://localhost:4000"
    log_info "  - GraphQL:  http://localhost:4000/graphql"
    echo ""
    log_info "To view logs: docker compose -f $COMPOSE_FILE logs -f"
    log_info "To stop:      docker compose -f $COMPOSE_FILE down"
}

# Run main function
main "$@"
