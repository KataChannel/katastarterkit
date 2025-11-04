#!/bin/bash

# ==============================================================================
# Cleanup Script - Remove unnecessary files before deployment
# Purpose: Reduce project size for faster deployment on low-resource servers
# ==============================================================================

set -e

# Colors
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

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_info "═══════════════════════════════════════════════════════"
log_info "Starting cleanup for deployment optimization..."
log_info "═══════════════════════════════════════════════════════"

# Get initial size
INITIAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
log_info "Initial project size: $INITIAL_SIZE"

# 1. Clean backend logs (keep only today's logs)
log_info ""
log_info "1. Cleaning old backend logs..."
if [ -d "backend/logs" ]; then
    TODAY=$(date +%Y-%m-%d)
    find backend/logs -type f -name "*.log" ! -name "*${TODAY}*" -delete 2>/dev/null || true
    REMOVED=$(find backend/logs -type f -name "*.log" ! -name "*${TODAY}*" | wc -l)
    log_success "✅ Cleaned old log files (kept today's logs)"
else
    log_info "No backend logs directory"
fi

# 2. Clean development builds
log_info ""
log_info "2. Cleaning development builds..."
if [ -d "frontend/.next/dev" ]; then
    rm -rf frontend/.next/dev
    log_success "✅ Removed frontend/.next/dev"
fi

# 3. Clean test and coverage files
log_info ""
log_info "3. Cleaning test and coverage files..."
find . -type d -name "coverage" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name ".nyc_output" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.test.js.map" -delete 2>/dev/null || true
find . -type f -name "*.spec.js.map" -delete 2>/dev/null || true
log_success "✅ Removed test/coverage files"

# 4. Clean temporary files
log_info ""
log_info "4. Cleaning temporary files..."
find . -type f -name "*.tmp" -delete 2>/dev/null || true
find . -type f -name "*.swp" -delete 2>/dev/null || true
find . -type f -name "*.swo" -delete 2>/dev/null || true
find . -type f -name ".DS_Store" -delete 2>/dev/null || true
find . -type f -name "Thumbs.db" -delete 2>/dev/null || true
log_success "✅ Removed temporary files"

# 5. Clean node_modules cache
log_info ""
log_info "5. Cleaning node_modules cache..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    log_success "✅ Removed node_modules/.cache"
fi
if [ -d "frontend/node_modules/.cache" ]; then
    rm -rf frontend/node_modules/.cache
    log_success "✅ Removed frontend/node_modules/.cache"
fi
if [ -d "backend/node_modules/.cache" ]; then
    rm -rf backend/node_modules/.cache
    log_success "✅ Removed backend/node_modules/.cache"
fi

# 6. Clean turbo cache
log_info ""
log_info "6. Cleaning turbo cache..."
if [ -d ".turbo" ]; then
    rm -rf .turbo
    log_success "✅ Removed .turbo cache"
fi

# 7. Clean old backups (keep last 3)
log_info ""
log_info "7. Cleaning old backups..."
if [ -d "backups" ]; then
    # Keep only the 3 most recent backup directories
    ls -dt backups/*/ 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true
    log_success "✅ Kept only 3 most recent backups"
fi

# 8. Clean git objects (optional - only if .git is huge)
log_info ""
log_info "8. Optimizing git repository..."
if [ -d ".git" ]; then
    git gc --quiet 2>/dev/null || true
    log_success "✅ Git repository optimized"
fi

# 9. Show files that take most space
log_info ""
log_info "9. Top 10 largest files/directories:"
du -sh * 2>/dev/null | sort -hr | head -10

# Get final size
FINAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)

log_info ""
log_info "═══════════════════════════════════════════════════════"
log_success "Cleanup completed!"
log_info "Initial size: $INITIAL_SIZE"
log_info "Final size:   $FINAL_SIZE"
log_info "═══════════════════════════════════════════════════════"
log_warning ""
log_warning "NOTE: This script does NOT remove:"
log_warning "  - node_modules (needed for deployment)"
log_warning "  - .next/standalone (needed for production)"
log_warning "  - dist directories (needed for production)"
log_warning ""
log_warning "To do a full cleanup (remove node_modules), run:"
log_warning "  find . -name 'node_modules' -type d -prune -exec rm -rf {} +"
log_info "═══════════════════════════════════════════════════════"
