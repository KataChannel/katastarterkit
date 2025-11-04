#!/bin/bash

# ==============================================================================
# UNIFIED DEPLOY SCRIPT - All-in-one deployment tool
# Supports: build, no-build, verify, fix modes
# Usage: ./95copy.sh [--build] [--verify] [--fix]
# ==============================================================================

set -e

# Configuration
SERVER_IP="116.118.48.208"
SERVER_USER="root"
REMOTE_DIR="/root/shoprausach"
LOCAL_DIR="$(pwd)"

# Parse command line arguments
BUILD_FRONTEND=false
VERIFY_ONLY=false
FIX_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD_FRONTEND=true
            shift
            ;;
        --verify)
            VERIFY_ONLY=true
            shift
            ;;
        --fix)
            FIX_MODE=true
            shift
            ;;
        --help)
            cat << 'HELP_EOF'
UNIFIED DEPLOYMENT SCRIPT - All deployment modes in one

Usage: ./95copy.sh [OPTIONS]

OPTIONS:
    --build         Build frontend locally before deployment (bun/npm)
    --verify        Verify local build exists without deploying
    --fix           Full fix mode: verify + sync + restart (for 404 errors)
    --help          Show this help message

EXAMPLES:
    # Deploy only (no build) - existing .next build required
    ./95copy.sh

    # Deploy with local build (recommended)
    ./95copy.sh --build

    # Verify local build exists without deploying
    ./95copy.sh --verify

    # Fix mode: verify + sync + restart (for production issues)
    ./95copy.sh --fix

DEPLOYMENT FLOW:
    1. Optional: Build frontend if --build flag used
    2. Verify build output exists (standalone, static, public)
    3. Create rsync exclude list
    4. Deploy to server with rsync
    5. Restart Docker containers on server
    6. Show deployment summary

For more info, see: PRODUCTION_404_FIX.md
HELP_EOF
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

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

# Build frontend locally
build_frontend() {
    log_info "🏗️  Building frontend locally..."
    
    cd "$LOCAL_DIR/frontend" || exit 1
    
    # Check if bun is installed
    if ! command -v bun &> /dev/null; then
        log_warning "Bun not found, using npm instead"
        npm install
        npm run build
    else
        log_info "Using Bun for build"
        bun install --frozen-lockfile
        bun run build
    fi
    
    cd "$LOCAL_DIR" || exit 1
    log_success "✅ Frontend build completed"
}

# Verify build output
verify_build() {
    log_info "✅ Verifying build output..."
    
    local missing=false
    
    if [[ ! -d "$LOCAL_DIR/frontend/.next/standalone" ]]; then
        log_error "❌ Missing: $LOCAL_DIR/frontend/.next/standalone"
        missing=true
    else
        log_success "✅ Found: frontend/.next/standalone"
        log_info "  Files: $(find $LOCAL_DIR/frontend/.next/standalone -type f | wc -l) files"
    fi
    
    if [[ ! -d "$LOCAL_DIR/frontend/.next/static" ]]; then
        log_error "❌ Missing: $LOCAL_DIR/frontend/.next/static"
        missing=true
    else
        log_success "✅ Found: frontend/.next/static"
        local css_count=$(find $LOCAL_DIR/frontend/.next/static -name "*.css" 2>/dev/null | wc -l)
        local js_count=$(find $LOCAL_DIR/frontend/.next/static -name "*.js" 2>/dev/null | wc -l)
        log_info "  CSS: $css_count files, JS: $js_count files"
    fi
    
    if [[ ! -d "$LOCAL_DIR/frontend/public" ]]; then
        log_error "❌ Missing: $LOCAL_DIR/frontend/public"
        missing=true
    else
        log_success "✅ Found: frontend/public"
        log_info "  Files: $(find $LOCAL_DIR/frontend/public -type f 2>/dev/null | wc -l) files"
    fi
    
    if [[ "$missing" == true ]]; then
        return 1
    fi
    
    log_success "✅ Build verification passed - ready for deployment"
    return 0
}

# Create rsync exclude list
create_exclude_list() {
    cat > /tmp/rsync_exclude.txt << 'EXCLUDE_EOF'
# Development dependencies and cache
node_modules/.cache/
.cache/
.next/cache/

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

# Scripts directory (exclude other deploy scripts)
scripts/96deploy-with-build.sh
scripts/97fix-frontend-on-server.sh
scripts/98deploy-fix.sh

EXCLUDE_EOF
}

# Upload to server using rsync (standard deployment)
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
    
    log_success "✅ Upload completed"
}

# Deploy only critical frontend files to server (fix mode)
deploy_critical_files() {
    log_info "📤 Syncing critical frontend files to server..."
    
    log_info "Step 1: Stopping containers on server..."
    ssh "${SERVER_USER}@${SERVER_IP}" "cd ${REMOTE_DIR}" 2>/dev/null || true
    
    log_info "Step 2: Syncing frontend/.next/standalone..."
    rsync -avz --delete \
        "$LOCAL_DIR/frontend/.next/standalone/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/frontend/.next/standalone/" \
        || {
            log_error "Failed to sync standalone"
            return 1
        }
    
    log_info "Step 3: Syncing frontend/.next/static..."
    rsync -avz --delete \
        "$LOCAL_DIR/frontend/.next/static/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/frontend/.next/static/" \
        || {
            log_error "Failed to sync static"
            return 1
        }
    
    log_info "Step 4: Syncing frontend/public..."
    rsync -avz --delete \
        "$LOCAL_DIR/frontend/public/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/frontend/public/" \
        || {
            log_error "Failed to sync public"
            return 1
        }
    
    log_success "✅ Critical files synced"
}

# Restart docker containers on server
restart_docker() {
    log_info "🐳 Restarting Docker containers..."
    
    ssh "${SERVER_USER}@${SERVER_IP}" bash -s << 'REMOTE_EOF'
        set -e
        cd /root/shoprausach || exit 1
        
        # Rebuild and restart containers
        # docker compose -f docker-compose.yml up -d --build --remove-orphans --pull missing
        docker compose -f 'docker-compose.yml' up -d --build 'backend'
        docker compose -f 'docker-compose.yml' up -d --build 'frontend'
        # Cleanup dangling resources
        docker image prune -af --filter "until=72h" &>/dev/null || true
        docker volume prune -f &>/dev/null || true
        docker network prune -f &>/dev/null || true
        
        # Verify deployment
        echo ""
        echo "=== Container Status ==="
        docker compose ps
        docker builder prune -af --filter "until=72h" &>/dev/null || true
        echo ""
        echo "=== Frontend logs (last 15 lines) ==="
        docker compose logs frontend --tail 15 2>/dev/null || echo "Frontend container not ready yet"
REMOTE_EOF
    
    local exit_code=$?
    if [[ $exit_code -eq 0 ]]; then
        log_success "✅ Docker containers restarted successfully"
    fi
    return $exit_code
}

# Show deployment summary
show_summary() {
    log_success "═══════════════════════════════════════════════════════"
    log_success "DEPLOYMENT COMPLETED SUCCESSFULLY"
    log_success "═══════════════════════════════════════════════════════"
    log_success "Server: ${SERVER_IP}"
    log_success "Frontend: http://${SERVER_IP}:12000"
    log_success "Backend: http://${SERVER_IP}:12001"
    log_success "Remote Directory: ${REMOTE_DIR}"
    log_success "═══════════════════════════════════════════════════════"
    log_success "⏱️  Deployment Time: $(date)"
    log_success "═══════════════════════════════════════════════════════"
}

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

main() {
    log_info "═══════════════════════════════════════════════════════"
    
    # Determine deployment mode
    if [[ "$BUILD_FRONTEND" == true ]]; then
        log_info "DEPLOYMENT MODE: BUILD + DEPLOY"
    elif [[ "$FIX_MODE" == true ]]; then
        log_info "DEPLOYMENT MODE: FIX (CRITICAL FILES ONLY)"
    elif [[ "$VERIFY_ONLY" == true ]]; then
        log_info "DEPLOYMENT MODE: VERIFY BUILD ONLY"
    else
        log_info "DEPLOYMENT MODE: DEPLOY ONLY (NO BUILD)"
    fi
    
    log_info "═══════════════════════════════════════════════════════"
    
    # Step 1: Build if requested
    if [[ "$BUILD_FRONTEND" == true ]]; then
        log_info "Step 1: Building frontend..."
        if build_frontend; then
            log_success "Frontend build completed"
        else
            log_error "Frontend build failed"
            exit 1
        fi
    fi
    
    # Step 2: Verify build output
    log_info "Step 2: Verifying build output..."
    if verify_build; then
        log_success "Build verification passed"
    else
        log_error "Build verification failed"
        if [[ "$BUILD_FRONTEND" == false ]]; then
            log_error "Hint: Try running with --build flag to build frontend first"
            log_error "Command: ./95copy.sh --build"
        fi
        exit 1
    fi
    
    # If verify-only mode, stop here
    if [[ "$VERIFY_ONLY" == true ]]; then
        log_success "✅ Verification complete - local build is ready for deployment"
        return 0
    fi
    
    # Step 3: Deploy based on mode
    if [[ "$FIX_MODE" == true ]]; then
        log_info "Step 3: Deploying critical frontend files (fix mode)..."
        if deploy_critical_files; then
            log_success "Critical files deployed"
        else
            log_error "Critical file deployment failed"
            exit 1
        fi
    else
        log_info "Step 3: Deploying to server (standard mode)..."
        if deploy_to_server; then
            log_success "Standard deployment completed"
        else
            log_error "Standard deployment failed"
            exit 1
        fi
    fi
    
    # Step 4: Restart containers
    log_info "Step 4: Restarting Docker containers..."
    if restart_docker; then
        log_success "Docker restarted"
    else
        log_error "Failed to restart Docker"
        exit 1
    fi
    
    # Show summary
    show_summary
}

# Run main function with all arguments
main "$@"
