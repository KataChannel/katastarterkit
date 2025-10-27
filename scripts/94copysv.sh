#!/bin/bash

# ==============================================================================
# OPTIMIZED DEPLOY SCRIPT
# Copy only built files to server - Optimize speed & storage
# ==============================================================================

set -e

# Configuration
SERVER_IP="116.118.49.243"
SERVER_USER="root"
REMOTE_DIR="/root/shoprausach"
LOCAL_DIR="$(pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================================================
# FUNCTIONS
# ==============================================================================

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

# Create rsync exclude list
create_exclude_list() {
    cat > /tmp/rsync_exclude.txt << 'EXCLUDE_EOF'
# Development dependencies and cache
node_modules/.cache/
.cache/
.next/cache/
dist/cache/

# Git and version control
.git/
.gitignore
.github/

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment and configuration (will copy separately)
.env
.env.local
.env.*.local

# Build artifacts that shouldn't be copied
*.tsbuildinfo

# Temporary files
temp/
tmp/
.turbo/

# Lock files (will use package-lock.json)
bun.lockb

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
Thumbs.db
.DS_Store

EXCLUDE_EOF
}

# Upload to server using rsync
deploy_to_server() {
    log_info "📤 Uploading to server (${SERVER_IP})..."
    
    create_exclude_list
    
    # Calculate total size
    local total_size=$(du -sh "$LOCAL_DIR" 2>/dev/null | cut -f1)
    log_info "Total project size: $total_size"
    
    # Rsync with optimized settings
    rsync -avz \
        --delete \
        --exclude-from=/tmp/rsync_exclude.txt \
        --compress-level=9 \
        --stats \
        "$LOCAL_DIR/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/" \
        || {
            log_error "Rsync failed"
            return 1
        }
    
    log_success "Upload completed"
}

# Restart docker containers on server
restart_docker() {
    log_info "🐳 Restarting Docker containers..."
    
    ssh "${SERVER_USER}@${SERVER_IP}" bash -s << 'REMOTE_EOF'
        set -e
        cd /root/shoprausach || exit 1
        
        # Rebuild and restart containers
        docker compose -f docker-compose-server.yml up -d --build --remove-orphans --pull missing
        
        # Cleanup dangling resources
        docker image prune -af --filter "until=72h" &>/dev/null || true
        docker volume prune -f &>/dev/null || true
        docker network prune -f &>/dev/null || true
        
        # Verify deployment
        docker compose ps
REMOTE_EOF
    
    local exit_code=$?
    [[ $exit_code -eq 0 ]] && log_info "Docker containers restarted successfully"
    return $exit_code
}

# Show deployment summary
show_summary() {
    log_success "═══════════════════════════════════════════════════════"
    log_success "DEPLOYMENT COMPLETED SUCCESSFULLY"
    log_success "═══════════════════════════════════════════════════════"
    log_success "Server: ${SERVER_IP}"
    log_success "Remote Directory: ${REMOTE_DIR}"
    log_success "═══════════════════════════════════════════════════════"
}

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

main() {
    log_info "═══════════════════════════════════════════════════════"
    log_info "DEPLOY SCRIPT (NO BUILD)"
    log_info "═══════════════════════════════════════════════════════"
    
    # Step 1: Deploy to server
    log_info "Step 1/2: Deploying to server..."
    if deploy_to_server; then
        log_success "Deployment completed"
    else
        log_error "Deployment failed"
        exit 1
    fi
    
    # Step 2: Restart containers
    log_info "Step 2/2: Restarting Docker containers..."
    if restart_docker; then
        log_success "Docker restarted"
    else
        log_error "Failed to restart Docker"
        exit 1
    fi
    
    # Show summary
    show_summary
}

# Run main function
main "$@"
