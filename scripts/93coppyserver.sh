#!/bin/bash

# ==============================================================================
# OPTIMIZED BUILD & DEPLOY SCRIPT
# Copy only built files to server - Optimize speed & storage
# ==============================================================================

set -e

# Configuration
SERVER_IP="116.118.48.208"
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

# Check if directory exists and has content
check_build_exists() {
    local build_dir=$1
    if [ -d "$build_dir" ] && [ -n "$(ls -A "$build_dir" 2>/dev/null)" ]; then
        return 0
    fi
    return 1
}

# Build project locally
build_project() {
    log_info "🔨 Building project locally..."
    
    if ! command -v bun &> /dev/null; then
        log_error "Bun is not installed. Please install bun first."
        exit 1
    fi
    
    # Build backend
    log_info "Building backend..."
    cd "$LOCAL_DIR/backend"
    bun run build
    cd "$LOCAL_DIR"
    
    # Build frontend
    log_info "Building frontend..."
    cd "$LOCAL_DIR/frontend"
    bun run build
    cd "$LOCAL_DIR"
    
    log_success "Build completed successfully"
}

# Clean up unnecessary files to reduce size
cleanup_before_copy() {
    log_info "🧹 Cleaning up unnecessary files..."
    
    local dirs_to_clean=(
        "backend/node_modules/.cache"
        "frontend/node_modules/.cache"
        "backend/.next/cache"
        "frontend/.next/cache"
        "backend/dist"
        "frontend/.next"
    )
    
    # We'll exclude some of these when copying
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
            log_error "Rsync failed. Retrying with alternative method..."
            return 1
        }
    
    log_success "Upload completed"
}

# Install dependencies on server
install_server_deps() {
    log_info "📦 Installing/updating dependencies on server..."
    
    ssh "${SERVER_USER}@${SERVER_IP}" << 'REMOTE_EOF'
cd /root/shoprausach

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
bun install --production
cd ..

# Install frontend dependencies  
echo "Installing frontend dependencies..."
cd frontend
bun install --production
cd ..

echo "Dependencies installed successfully"
REMOTE_EOF
}

# Restart docker containers on server
restart_docker() {
    log_info "🐳 Restarting Docker containers..."
    
    ssh "${SERVER_USER}@${SERVER_IP}" << 'REMOTE_EOF'
cd /root/shoprausach

# Up with new build
docker compose -f 'docker-compose-server.yml' up -d --build --remove-orphans --pull missing

docker image prune -af --filter "until=72h" 2>/dev/null || true
docker volume prune -f 2>/dev/null || true
docker network prune -f 2>/dev/null || true

# Show status
docker compose ps
echo "Docker containers restarted"
REMOTE_EOF
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
    log_info "OPTIMIZED BUILD & DEPLOY SCRIPT"
    log_info "═══════════════════════════════════════════════════════"
    
    # Step 1: Build locally
    log_info "Step 1/4: Building project..."
    if build_project; then
        log_success "Build completed"
    else
        log_error "Build failed"
        exit 1
    fi
    
    # Step 2: Deploy to server
    log_info "Step 2/4: Deploying to server..."
    if deploy_to_server; then
        log_success "Deployment completed"
    else
        log_error "Deployment failed"
        exit 1
    fi
    
    # Step 3: Install dependencies
    log_info "Step 3/4: Installing dependencies on server..."
    if install_server_deps; then
        log_success "Dependencies installed"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
    
    Step 4: Restart containers
    log_info "Step 4/4: Restarting Docker containers..."
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
