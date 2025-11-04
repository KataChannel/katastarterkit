#!/bin/bash

# ============================================================================
# PRE-DEPLOYMENT CHECK SCRIPT
# Verify system is ready for optimized deployment
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
    ((WARNINGS++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((ERRORS++))
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Pre-Deployment System Check${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 1. Check Docker
log_info "Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    log_success "Docker installed: $DOCKER_VERSION"
else
    log_error "Docker is not installed"
fi

# 2. Check Docker Compose
log_info "Checking Docker Compose..."
if command -v docker compose &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version | awk '{print $4}')
    log_success "Docker Compose installed: $COMPOSE_VERSION"
else
    log_error "Docker Compose is not installed"
fi

# 3. Check Bun
log_info "Checking Bun runtime..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun --version)
    log_success "Bun installed: $BUN_VERSION"
else
    log_error "Bun is not installed (required for local builds)"
fi

# 4. Check RAM
log_info "Checking system RAM..."
TOTAL_RAM=$(free -m | awk 'NR==2{print $2}')
if [ "$TOTAL_RAM" -ge 1800 ]; then
    log_success "RAM: ${TOTAL_RAM}MB (minimum 2GB required)"
else
    log_error "Insufficient RAM: ${TOTAL_RAM}MB (minimum 2GB required)"
fi

# 5. Check Swap
log_info "Checking swap space..."
SWAP_SIZE=$(free -m | awk 'NR==3{print $2}')
if [ "$SWAP_SIZE" -ge 2048 ]; then
    log_success "Swap: ${SWAP_SIZE}MB"
elif [ "$SWAP_SIZE" -ge 1024 ]; then
    log_warning "Swap: ${SWAP_SIZE}MB (recommended: 2GB+)"
else
    log_warning "Low swap: ${SWAP_SIZE}MB (will create swap file during deployment)"
fi

# 6. Check Disk Space
log_info "Checking disk space..."
AVAILABLE_DISK=$(df -BG . | awk 'NR==2{print $4}' | sed 's/G//')
if [ "$AVAILABLE_DISK" -ge 10 ]; then
    log_success "Disk space: ${AVAILABLE_DISK}GB available"
elif [ "$AVAILABLE_DISK" -ge 5 ]; then
    log_warning "Disk space: ${AVAILABLE_DISK}GB (minimum 10GB recommended)"
else
    log_error "Insufficient disk space: ${AVAILABLE_DISK}GB (minimum 10GB required)"
fi

# 7. Check CPU
log_info "Checking CPU..."
CPU_CORES=$(nproc)
if [ "$CPU_CORES" -ge 1 ]; then
    log_success "CPU cores: $CPU_CORES"
fi

# 8. Check Environment File
log_info "Checking environment file..."
if [ -f ".env.production" ]; then
    log_success ".env.production file exists"
    
    # Check critical variables
    source .env.production 2>/dev/null || true
    
    if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "change-this-password" ]; then
        log_error "POSTGRES_PASSWORD not set or using default value"
    else
        log_success "POSTGRES_PASSWORD configured"
    fi
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "change-this-jwt-secret-min-32-chars" ]; then
        log_error "JWT_SECRET not set or using default value"
    else
        if [ ${#JWT_SECRET} -ge 32 ]; then
            log_success "JWT_SECRET configured (${#JWT_SECRET} chars)"
        else
            log_warning "JWT_SECRET too short (${#JWT_SECRET} chars, minimum 32 recommended)"
        fi
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "change-this-nextauth-secret-min-32-chars" ]; then
        log_error "NEXTAUTH_SECRET not set or using default value"
    else
        log_success "NEXTAUTH_SECRET configured"
    fi
    
else
    log_error ".env.production file not found"
    log_info "Run: cp .env.production.template .env.production"
fi

# 9. Check if Docker daemon is running
log_info "Checking Docker daemon..."
if docker info &> /dev/null; then
    log_success "Docker daemon is running"
else
    log_error "Docker daemon is not running"
fi

# 10. Check build directories
log_info "Checking build output directories..."
if [ -d "backend/dist" ]; then
    log_warning "backend/dist exists (will be rebuilt)"
else
    log_info "backend/dist not found (will be created during build)"
fi

if [ -d "frontend/.next" ]; then
    log_warning "frontend/.next exists (will be rebuilt)"
else
    log_info "frontend/.next not found (will be created during build)"
fi

# 11. Check required files
log_info "Checking required files..."
REQUIRED_FILES=(
    "docker-compose.production.yml"
    "backend/Dockerfile.production"
    "frontend/Dockerfile.production"
    "backend/package.json"
    "frontend/package.json"
    "backend/prisma/schema.prisma"
    "backend/entrypoint.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file exists"
    else
        log_error "$file not found"
    fi
done

# 12. Check network ports
log_info "Checking port availability..."
PORTS=(3000 4000 5432 6379 9000 9001)
for port in "${PORTS[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        log_warning "Port $port is already in use"
    else
        log_success "Port $port is available"
    fi
done

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Check Summary${NC}"
echo -e "${BLUE}================================${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "${GREEN}System is ready for deployment.${NC}"
    echo ""
    echo "Run: ./deploy-optimized.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Passed with $WARNINGS warning(s)${NC}"
    echo -e "${YELLOW}System can be deployed but review warnings.${NC}"
    echo ""
    echo "Run: ./deploy-optimized.sh"
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo -e "${RED}Please fix errors before deployment.${NC}"
    exit 1
fi
