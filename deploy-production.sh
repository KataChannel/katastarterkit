#!/bin/bash

# ==============================================================================
# PRODUCTION DEPLOYMENT SCRIPT - Hybrid Multi-Domain Optimized
# Combines best practices from 95copy.sh + deploy-hybrid.sh
# Supports: Build, Deploy, Verify, Fix, Multi-domain deployment
# ==============================================================================

set -e

# ==============================================================================
# CONFIGURATION
# ==============================================================================

# Server Configuration
SERVER_IP="116.118.49.243"
SERVER_USER="root"
REMOTE_DIR="/root/shoprausach"
LOCAL_DIR="$(pwd)"

# Deployment Mode
DEPLOYMENT_MODE="hybrid"  # hybrid, rausach-only, tazagroup-only, shared-only
BUILD_FRONTEND=false
BUILD_BACKEND=false
VERIFY_ONLY=false
FIX_MODE=false
SKIP_DOCKER_BUILD=false
AUTO_BACKUP=true
INTERACTIVE=false

# Docker Compose Files
COMPOSE_FILE="docker-compose.hybrid.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# ==============================================================================
# ARGUMENT PARSING
# ==============================================================================

show_help() {
    cat << 'HELP_EOF'
╔════════════════════════════════════════════════════════════════════╗
║     PRODUCTION DEPLOYMENT SCRIPT - Hybrid Multi-Domain            ║
║     Optimized for: 1-2 Core, 1.5-2GB RAM, 7GB Storage            ║
╚════════════════════════════════════════════════════════════════════╝

USAGE:
    ./deploy-production.sh [OPTIONS]

OPTIONS:
    --mode <mode>       Deployment mode (default: hybrid)
                        - hybrid: Deploy both domains with shared services
                        - rausach: Deploy only Rausach domain
                        - tazagroup: Deploy only Tazagroup domain
                        - shared: Deploy only shared services (Redis+Minio)
    
    --build             Build frontend & backend locally before deploy
    --build-frontend    Build only frontend
    --build-backend     Build only backend
    --no-docker-build   Skip Docker image rebuild on server
    
    --verify            Verify local build without deploying
    --fix               Fix mode: sync critical files + restart
    --no-backup         Skip automatic database backup
    
    --interactive       Interactive menu mode
    --help              Show this help

EXAMPLES:
    # Full deployment with build (recommended for production)
    ./deploy-production.sh --mode hybrid --build

    # Deploy without build (faster, use existing builds)
    ./deploy-production.sh --mode hybrid --no-docker-build

    # Deploy only Rausach domain
    ./deploy-production.sh --mode rausach --build-frontend

    # Fix mode for production issues (404, assets missing)
    ./deploy-production.sh --fix

    # Verify local build readiness
    ./deploy-production.sh --verify

    # Interactive menu
    ./deploy-production.sh --interactive

DEPLOYMENT FLOW:
    1. Pre-deployment checks (server, Docker, .env files)
    2. Optional: Build frontend/backend locally
    3. Verify build outputs
    4. Optional: Backup databases
    5. Rsync code to server (optimized exclude list)
    6. Docker build & deploy on server
    7. Health checks & verification
    8. Show deployment summary with URLs

HYBRID ARCHITECTURE:
    Shared Services:  Redis (128MB) + Minio (128MB)
    Rausach Domain:   PostgreSQL + Backend + Frontend (768MB)
    Tazagroup Domain: PostgreSQL + Backend + Frontend (768MB)
    Total: ~1.8GB RAM

For more info:
    - BAO_CAO_HYBRID_DEPLOYMENT_VA_BUG_FIXES.md
    - docs/320-HUONG_DAN_HYBRID_DEPLOYMENT.md

HELP_EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --mode)
            DEPLOYMENT_MODE="$2"
            shift 2
            ;;
        --build)
            BUILD_FRONTEND=true
            BUILD_BACKEND=true
            shift
            ;;
        --build-frontend)
            BUILD_FRONTEND=true
            shift
            ;;
        --build-backend)
            BUILD_BACKEND=true
            shift
            ;;
        --no-docker-build)
            SKIP_DOCKER_BUILD=true
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
        --no-backup)
            AUTO_BACKUP=false
            shift
            ;;
        --interactive)
            INTERACTIVE=true
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# ==============================================================================
# LOGGING FUNCTIONS
# ==============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
}

# Progress bar
show_progress() {
    local duration=$1
    local message=$2
    echo -ne "${BLUE}$message${NC} ["
    for ((i=0; i<duration; i++)); do
        echo -ne "█"
        sleep 0.1
    done
    echo -e "] ${GREEN}Done${NC}"
}

# ==============================================================================
# PRE-DEPLOYMENT CHECKS
# ==============================================================================

check_prerequisites() {
    log_step "STEP 1: Pre-deployment Checks"
    
    local checks_passed=true
    
    # Check if running from project root
    if [[ ! -f "docker-compose.hybrid.yml" ]]; then
        log_error "Must run from project root (docker-compose.hybrid.yml not found)"
        checks_passed=false
    else
        log_success "Running from project root"
    fi
    
    # Check .env files
    if [[ ! -f ".env.rausach" ]]; then
        log_error ".env.rausach not found"
        checks_passed=false
    else
        log_success ".env.rausach exists"
        # Verify DATABASE_URL
        if grep -q "DATABASE_URL.*rausachcore" .env.rausach; then
            log_success ".env.rausach DATABASE_URL correct (rausachcore)"
        else
            log_error ".env.rausach DATABASE_URL incorrect (should be rausachcore)"
            checks_passed=false
        fi
    fi
    
    if [[ ! -f ".env.tazagroup" ]]; then
        log_error ".env.tazagroup not found"
        checks_passed=false
    else
        log_success ".env.tazagroup exists"
        # Verify shared ports
        if grep -q "REDIS_PORT=12004" .env.tazagroup && grep -q "MINIO_PORT=12007" .env.tazagroup; then
            log_success ".env.tazagroup shared ports correct (12004, 12007)"
        else
            log_warning ".env.tazagroup shared ports may be incorrect"
        fi
    fi
    
    # Check Docker (local)
    if command -v docker &> /dev/null; then
        log_success "Docker installed locally"
    else
        log_warning "Docker not found locally (OK if deploying only)"
    fi
    
    # Check rsync
    if ! command -v rsync &> /dev/null; then
        log_error "rsync not installed (required for deployment)"
        checks_passed=false
    else
        log_success "rsync available"
    fi
    
    # Check SSH connection to server
    log_info "Testing SSH connection to $SERVER_IP..."
    if ssh -o ConnectTimeout=5 -o BatchMode=yes "${SERVER_USER}@${SERVER_IP}" "echo 'SSH OK'" &>/dev/null; then
        log_success "SSH connection to server OK"
    else
        log_error "Cannot connect to server $SERVER_IP"
        log_info "Make sure you have SSH key configured or run: ssh-copy-id ${SERVER_USER}@${SERVER_IP}"
        checks_passed=false
    fi
    
    # Check server Docker
    if ssh "${SERVER_USER}@${SERVER_IP}" "docker --version" &>/dev/null; then
        log_success "Docker installed on server"
    else
        log_error "Docker not found on server"
        checks_passed=false
    fi
    
    # Check server disk space
    local server_disk=$(ssh "${SERVER_USER}@${SERVER_IP}" "df -h ${REMOTE_DIR} | awk 'NR==2 {print \$5}' | sed 's/%//'")
    if [[ $server_disk -gt 80 ]]; then
        log_warning "Server disk usage high: ${server_disk}%"
    else
        log_success "Server disk usage: ${server_disk}%"
    fi
    
    # Check server memory
    local server_mem=$(ssh "${SERVER_USER}@${SERVER_IP}" "free -m | awk 'NR==2 {printf \"%.0f\", \$3/\$2*100}'")
    log_info "Server memory usage: ${server_mem}%"
    
    if [[ "$checks_passed" == false ]]; then
        log_error "Pre-deployment checks failed. Fix errors above and try again."
        exit 1
    fi
    
    log_success "All pre-deployment checks passed ✓"
}

# ==============================================================================
# BUILD FUNCTIONS
# ==============================================================================

build_frontend() {
    log_step "STEP 2: Building Frontend"
    
    cd "$LOCAL_DIR/frontend" || exit 1
    
    log_info "Installing dependencies..."
    if command -v bun &> /dev/null; then
        log_info "Using Bun for build"
        bun install --frozen-lockfile
        log_info "Building with Bun..."
        bun run build
    else
        log_info "Using npm for build"
        npm install
        log_info "Building with npm..."
        npm run build
    fi
    
    cd "$LOCAL_DIR" || exit 1
    log_success "Frontend build completed"
}

build_backend() {
    log_step "STEP 2: Building Backend"
    
    cd "$LOCAL_DIR/backend" || exit 1
    
    log_info "Installing dependencies..."
    if command -v bun &> /dev/null; then
        bun install --frozen-lockfile
        log_info "Generating Prisma client..."
        bun prisma generate
    else
        npm install
        log_info "Generating Prisma client..."
        npm run prisma:generate
    fi
    
    cd "$LOCAL_DIR" || exit 1
    log_success "Backend build completed"
}

verify_build() {
    log_step "STEP 3: Verifying Build Output"
    
    local missing=false
    
    # Frontend checks
    if [[ ! -d "$LOCAL_DIR/frontend/.next/standalone" ]]; then
        log_error "Missing: frontend/.next/standalone"
        missing=true
    else
        local file_count=$(find "$LOCAL_DIR/frontend/.next/standalone" -type f | wc -l)
        log_success "Found: frontend/.next/standalone ($file_count files)"
    fi
    
    if [[ ! -d "$LOCAL_DIR/frontend/.next/static" ]]; then
        log_error "Missing: frontend/.next/static"
        missing=true
    else
        local css_count=$(find "$LOCAL_DIR/frontend/.next/static" -name "*.css" 2>/dev/null | wc -l)
        local js_count=$(find "$LOCAL_DIR/frontend/.next/static" -name "*.js" 2>/dev/null | wc -l)
        log_success "Found: frontend/.next/static (CSS: $css_count, JS: $js_count)"
    fi
    
    if [[ ! -d "$LOCAL_DIR/frontend/public" ]]; then
        log_error "Missing: frontend/public"
        missing=true
    else
        local public_count=$(find "$LOCAL_DIR/frontend/public" -type f 2>/dev/null | wc -l)
        log_success "Found: frontend/public ($public_count files)"
    fi
    
    # Backend checks
    if [[ ! -d "$LOCAL_DIR/backend/node_modules/.prisma" ]]; then
        log_warning "Prisma client may not be generated (backend/node_modules/.prisma missing)"
    else
        log_success "Prisma client generated"
    fi
    
    if [[ "$missing" == true ]]; then
        log_error "Build verification failed"
        if [[ "$BUILD_FRONTEND" == false ]]; then
            log_info "Hint: Try --build or --build-frontend flag"
        fi
        return 1
    fi
    
    log_success "Build verification passed ✓"
    return 0
}

# ==============================================================================
# BACKUP FUNCTIONS
# ==============================================================================

backup_databases() {
    if [[ "$AUTO_BACKUP" == false ]]; then
        log_info "Skipping backup (--no-backup flag)"
        return 0
    fi
    
    log_step "STEP 4: Backing up Databases"
    
    local backup_date=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups/pre-deploy-${backup_date}"
    
    ssh "${SERVER_USER}@${SERVER_IP}" bash -s << BACKUP_EOF
        set -e
        cd ${REMOTE_DIR}
        mkdir -p ${backup_dir}
        
        echo "Backing up Rausach database..."
        docker exec rausach-postgres pg_dump -U postgres rausachcore > ${backup_dir}/rausach.sql 2>/dev/null || echo "Rausach DB not running"
        
        echo "Backing up Tazagroup database..."
        docker exec tazagroup-postgres pg_dump -U postgres tazagroupcore > ${backup_dir}/tazagroup.sql 2>/dev/null || echo "Tazagroup DB not running"
        
        echo "Backup completed: ${backup_dir}"
        ls -lh ${backup_dir}/
BACKUP_EOF
    
    log_success "Database backups created: ${backup_dir}"
}

# ==============================================================================
# DEPLOYMENT FUNCTIONS
# ==============================================================================

create_rsync_excludes() {
    cat > /tmp/rsync_exclude_production.txt << 'EXCLUDE_EOF'
# Development dependencies
node_modules/.cache/
.cache/
.next/cache/
.turbo/

# Git and version control
.git/
.github/
.gitignore

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Environment files (will sync separately)
.env.local
.env.*.local

# Build artifacts
*.tsbuildinfo

# Temporary files
temp/
tmp/
logs/
*.log

# Lock files
bun.lockb
package-lock.json
yarn.lock

# Testing
coverage/
.nyc_output/
test/
tests/
__tests__/

# Documentation (reduce transfer size)
*.md
docs/

# Old deployment scripts
scripts/96*.sh
scripts/97*.sh
scripts/98*.sh

# Backup directories
backups/

EXCLUDE_EOF
}

deploy_to_server() {
    log_step "STEP 5: Deploying to Server"
    
    create_rsync_excludes
    
    # Calculate project size
    local total_size=$(du -sh "$LOCAL_DIR" 2>/dev/null | awk '{print $1}')
    log_info "Total project size: $total_size"
    
    log_info "Syncing files to ${SERVER_IP}:${REMOTE_DIR}..."
    log_info "This may take a few minutes..."
    
    rsync -avz \
        --delete \
        --exclude-from=/tmp/rsync_exclude_production.txt \
        --compress-level=6 \
        --info=progress2 \
        --human-readable \
        "$LOCAL_DIR/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/" \
        || {
            log_error "Rsync failed"
            return 1
        }
    
    log_success "Files synced to server"
}

deploy_critical_files_only() {
    log_step "STEP 5: Deploying Critical Files (Fix Mode)"
    
    log_info "Syncing frontend/.next/standalone..."
    rsync -avz --delete \
        "$LOCAL_DIR/frontend/.next/standalone/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/frontend/.next/standalone/"
    
    log_info "Syncing frontend/.next/static..."
    rsync -avz --delete \
        "$LOCAL_DIR/frontend/.next/static/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/frontend/.next/static/"
    
    log_info "Syncing frontend/public..."
    rsync -avz --delete \
        "$LOCAL_DIR/frontend/public/" \
        "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/frontend/public/"
    
    log_success "Critical files synced"
}

# ==============================================================================
# DOCKER DEPLOYMENT
# ==============================================================================

deploy_docker_hybrid() {
    log_step "STEP 6: Docker Deployment (Hybrid Mode)"
    
    local build_flag=""
    if [[ "$SKIP_DOCKER_BUILD" == false ]]; then
        build_flag="--build"
        log_info "Will rebuild Docker images on server"
    else
        log_info "Skipping Docker image rebuild"
    fi
    
    ssh "${SERVER_USER}@${SERVER_IP}" bash -s << DOCKER_EOF
        set -e
        cd ${REMOTE_DIR}
        
        # Auto-detect docker-compose command
        if command -v docker-compose &> /dev/null; then
            DOCKER_COMPOSE="docker-compose"
        else
            DOCKER_COMPOSE="docker compose"
        fi
        
        echo "Using: \$DOCKER_COMPOSE"
        
        # Stop existing containers
        echo "Stopping existing containers..."
        \$DOCKER_COMPOSE -f docker-compose.hybrid.yml down || true
        
        # Start services based on mode
        echo "Starting services in ${DEPLOYMENT_MODE} mode..."
        case "${DEPLOYMENT_MODE}" in
            hybrid)
                \$DOCKER_COMPOSE -f docker-compose.hybrid.yml up -d ${build_flag}
                ;;
            rausach)
                \$DOCKER_COMPOSE -f docker-compose.hybrid.yml up -d ${build_flag} redis minio rausach-postgres rausach-backend rausach-frontend
                ;;
            tazagroup)
                \$DOCKER_COMPOSE -f docker-compose.hybrid.yml up -d ${build_flag} redis minio tazagroup-postgres tazagroup-backend tazagroup-frontend
                ;;
            shared)
                \$DOCKER_COMPOSE -f docker-compose.hybrid.yml up -d ${build_flag} redis minio
                ;;
            *)
                echo "Unknown deployment mode: ${DEPLOYMENT_MODE}"
                exit 1
                ;;
        esac
        
        # Wait for containers to be healthy
        echo "Waiting for containers to start..."
        sleep 5
        
        # Show container status
        echo ""
        echo "=== Container Status ==="
        \$DOCKER_COMPOSE -f docker-compose.hybrid.yml ps
        
        # Cleanup old images
        echo ""
        echo "Cleaning up old Docker resources..."
        docker image prune -af --filter "until=72h" &>/dev/null || true
        docker volume prune -f &>/dev/null || true
        docker network prune -f &>/dev/null || true
        
        echo ""
        echo "=== Resource Usage ==="
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
DOCKER_EOF
    
    local exit_code=$?
    if [[ $exit_code -eq 0 ]]; then
        log_success "Docker deployment completed"
    else
        log_error "Docker deployment failed"
        return 1
    fi
}

# ==============================================================================
# HEALTH CHECKS
# ==============================================================================

health_check() {
    log_step "STEP 7: Health Checks"
    
    log_info "Checking Rausach frontend..."
    if curl -s -o /dev/null -w "%{http_code}" "http://${SERVER_IP}:12000" | grep -q "200\|301\|302"; then
        log_success "Rausach frontend: OK (http://${SERVER_IP}:12000)"
    else
        log_warning "Rausach frontend: Not responding yet"
    fi
    
    log_info "Checking Rausach backend..."
    if curl -s -o /dev/null -w "%{http_code}" "http://${SERVER_IP}:12001/graphql" | grep -q "200\|400"; then
        log_success "Rausach backend: OK (http://${SERVER_IP}:12001/graphql)"
    else
        log_warning "Rausach backend: Not responding yet"
    fi
    
    if [[ "$DEPLOYMENT_MODE" == "hybrid" ]]; then
        log_info "Checking Tazagroup frontend..."
        if curl -s -o /dev/null -w "%{http_code}" "http://${SERVER_IP}:13000" | grep -q "200\|301\|302"; then
            log_success "Tazagroup frontend: OK (http://${SERVER_IP}:13000)"
        else
            log_warning "Tazagroup frontend: Not responding yet"
        fi
        
        log_info "Checking Tazagroup backend..."
        if curl -s -o /dev/null -w "%{http_code}" "http://${SERVER_IP}:13001/graphql" | grep -q "200\|400"; then
            log_success "Tazagroup backend: OK (http://${SERVER_IP}:13001/graphql)"
        else
            log_warning "Tazagroup backend: Not responding yet"
        fi
    fi
    
    log_info "Note: Services may take 30-60 seconds to fully start"
}

# ==============================================================================
# SUMMARY
# ==============================================================================

show_deployment_summary() {
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                DEPLOYMENT COMPLETED SUCCESSFULLY              ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📊 Deployment Details:${NC}"
    echo -e "   Mode:           ${MAGENTA}${DEPLOYMENT_MODE}${NC}"
    echo -e "   Server:         ${BLUE}${SERVER_IP}${NC}"
    echo -e "   Time:           $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo -e "${CYAN}🌐 Service URLs:${NC}"
    echo -e "   ${YELLOW}Rausach Domain:${NC}"
    echo -e "      Frontend:    ${BLUE}http://${SERVER_IP}:12000${NC}"
    echo -e "      Backend:     ${BLUE}http://${SERVER_IP}:12001/graphql${NC}"
    echo -e "      Database:    ${BLUE}${SERVER_IP}:12003${NC}"
    echo ""
    
    if [[ "$DEPLOYMENT_MODE" == "hybrid" ]]; then
        echo -e "   ${YELLOW}Tazagroup Domain:${NC}"
        echo -e "      Frontend:    ${BLUE}http://${SERVER_IP}:13000${NC}"
        echo -e "      Backend:     ${BLUE}http://${SERVER_IP}:13001/graphql${NC}"
        echo -e "      Database:    ${BLUE}${SERVER_IP}:13003${NC}"
        echo ""
    fi
    
    echo -e "   ${YELLOW}Shared Services:${NC}"
    echo -e "      Minio UI:    ${BLUE}http://${SERVER_IP}:12008${NC}"
    echo -e "      Redis:       ${BLUE}${SERVER_IP}:12004${NC}"
    echo ""
    echo -e "${CYAN}📋 Next Steps:${NC}"
    echo -e "   1. Test URLs above to verify deployment"
    echo -e "   2. Check logs: ${BLUE}ssh ${SERVER_USER}@${SERVER_IP} 'cd ${REMOTE_DIR} && docker compose -f docker-compose.hybrid.yml logs -f'${NC}"
    echo -e "   3. Monitor resources: ${BLUE}ssh ${SERVER_USER}@${SERVER_IP} 'docker stats'${NC}"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
}

# ==============================================================================
# INTERACTIVE MENU
# ==============================================================================

interactive_menu() {
    while true; do
        clear
        echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${CYAN}║          PRODUCTION DEPLOYMENT - Interactive Menu            ║${NC}"
        echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Select deployment option:${NC}"
        echo ""
        echo "  1) Full Deployment - Hybrid (Build + Deploy)"
        echo "  2) Quick Deployment - Hybrid (No Build)"
        echo "  3) Deploy Rausach Only (Build + Deploy)"
        echo "  4) Deploy Tazagroup Only (Build + Deploy)"
        echo "  5) Deploy Shared Services Only"
        echo ""
        echo "  6) Fix Mode - Sync Critical Files Only"
        echo "  7) Verify Local Build"
        echo ""
        echo "  8) View Server Status"
        echo "  9) View Server Logs"
        echo "  10) Backup Databases"
        echo ""
        echo "  0) Exit"
        echo ""
        read -p "Enter choice [0-10]: " choice
        
        case $choice in
            1)
                DEPLOYMENT_MODE="hybrid"
                BUILD_FRONTEND=true
                BUILD_BACKEND=true
                main
                ;;
            2)
                DEPLOYMENT_MODE="hybrid"
                SKIP_DOCKER_BUILD=true
                main
                ;;
            3)
                DEPLOYMENT_MODE="rausach"
                BUILD_FRONTEND=true
                BUILD_BACKEND=true
                main
                ;;
            4)
                DEPLOYMENT_MODE="tazagroup"
                BUILD_FRONTEND=true
                BUILD_BACKEND=true
                main
                ;;
            5)
                DEPLOYMENT_MODE="shared"
                main
                ;;
            6)
                FIX_MODE=true
                main
                ;;
            7)
                VERIFY_ONLY=true
                verify_build
                ;;
            8)
                ssh "${SERVER_USER}@${SERVER_IP}" "cd ${REMOTE_DIR} && docker compose -f docker-compose.hybrid.yml ps && echo '' && docker stats --no-stream"
                ;;
            9)
                ssh "${SERVER_USER}@${SERVER_IP}" "cd ${REMOTE_DIR} && docker compose -f docker-compose.hybrid.yml logs --tail=50"
                ;;
            10)
                backup_databases
                ;;
            0)
                log_info "Exiting..."
                exit 0
                ;;
            *)
                log_error "Invalid choice"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

main() {
    # Banner
    echo -e "${CYAN}"
    cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     PRODUCTION DEPLOYMENT SCRIPT v1.0                        ║
║     Hybrid Multi-Domain Optimized                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
BANNER
    echo -e "${NC}"
    
    # Interactive mode
    if [[ "$INTERACTIVE" == true ]]; then
        interactive_menu
        return 0
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Build if requested
    if [[ "$BUILD_FRONTEND" == true ]]; then
        build_frontend
    fi
    
    if [[ "$BUILD_BACKEND" == true ]]; then
        build_backend
    fi
    
    # Verify build
    verify_build || exit 1
    
    # Verify-only mode
    if [[ "$VERIFY_ONLY" == true ]]; then
        log_success "Verification complete - ready for deployment"
        return 0
    fi
    
    # Backup databases
    backup_databases
    
    # Deploy to server
    if [[ "$FIX_MODE" == true ]]; then
        deploy_critical_files_only
    else
        deploy_to_server
    fi
    
    # Docker deployment
    deploy_docker_hybrid
    
    # Health checks
    sleep 3
    health_check
    
    # Show summary
    show_deployment_summary
    
    log_success "🎉 Deployment completed successfully!"
}

# Run main
main "$@"
