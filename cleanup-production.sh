#!/bin/bash

# ============================================================================
# PRODUCTION CLEANUP & OPTIMIZATION SCRIPT
# Clean up unnecessary files and optimize for deployment
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Production Cleanup & Optimization${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Show initial disk usage
log_info "Initial disk usage:"
du -sh . 2>/dev/null || true
echo ""

# 1. Clean backend
log_info "Cleaning backend..."
cd backend

# Remove build artifacts
rm -rf dist
rm -rf node_modules
rm -rf .turbo
rm -rf .cache

# Remove logs
rm -rf logs/*.log
rm -rf *.log

# Remove test files
rm -rf coverage
rm -rf test-results

cd ..
log_success "Backend cleaned"

# 2. Clean frontend
log_info "Cleaning frontend..."
cd frontend

# Remove build artifacts
rm -rf .next
rm -rf node_modules
rm -rf .turbo
rm -rf .cache

# Remove logs
rm -rf *.log

# Remove test files
rm -rf coverage
rm -rf .playwright

cd ..
log_success "Frontend cleaned"

# 3. Clean root workspace
log_info "Cleaning root workspace..."
rm -rf node_modules
rm -rf .turbo
rm -rf *.log

# 4. Clean Docker
log_info "Cleaning Docker resources..."
docker container prune -f 2>/dev/null || true
docker image prune -f 2>/dev/null || true
docker builder prune -f 2>/dev/null || true
log_success "Docker cleaned"

# 5. Remove unnecessary files
log_info "Removing unnecessary files..."

# Development files
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true
find . -name ".env.local" -delete 2>/dev/null || true
find . -name ".env.development" -delete 2>/dev/null || true

# Backup files
find . -name "*.backup" -delete 2>/dev/null || true
find . -name "*.bak" -delete 2>/dev/null || true
find . -name "*~" -delete 2>/dev/null || true

# Lock files (except production)
find . -name "package-lock.json" ! -path "*/node_modules/*" -delete 2>/dev/null || true
find . -name "yarn.lock" ! -path "*/node_modules/*" -delete 2>/dev/null || true
find . -name "pnpm-lock.yaml" ! -path "*/node_modules/*" -delete 2>/dev/null || true

log_success "Unnecessary files removed"

# 6. Optimize git
log_info "Optimizing git repository..."
if [ -d ".git" ]; then
    git gc --aggressive --prune=now 2>/dev/null || true
    git repack -Ad 2>/dev/null || true
    log_success "Git optimized"
fi

# 7. Show final disk usage
echo ""
log_info "Final disk usage:"
du -sh . 2>/dev/null || true
echo ""

log_success "Cleanup completed!"
echo ""
log_info "Next steps:"
echo "  1. Review .env.production settings"
echo "  2. Run: ./pre-deploy-check.sh"
echo "  3. Run: ./deploy-optimized.sh"
