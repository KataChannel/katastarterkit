#!/bin/bash

# ============================================================================
# REMOTE DEPLOYMENT SCRIPT - Deploy to 116.118.48.208
# Method: Copy files from local to server (no git)
# Optimized for 1 Core CPU, 2GB RAM, 10GB Disk
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Server configuration
SERVER_IP="116.118.48.208"
SERVER_USER="${SSH_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
PROJECT_DIR="/opt/innerv2"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DEPLOY TO SERVER 116.118.48.208             ║${NC}"
echo -e "${BLUE}║   Method: Copy Local Files (No Git)           ║${NC}"
echo -e "${BLUE}║   1 Core CPU | 2GB RAM | 10GB Disk            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if rsync is installed locally
if ! command -v rsync &> /dev/null; then
    log_error "rsync is not installed on local machine"
    log_info "Install rsync:"
    log_info "  Ubuntu/Debian: sudo apt-get install rsync"
    log_info "  macOS: brew install rsync"
    log_info "  CentOS/RHEL: sudo yum install rsync"
    exit 1
fi

# Check SSH connection
log_info "Testing SSH connection to $SERVER_USER@$SERVER_IP:$SSH_PORT..."
if ! ssh -p $SSH_PORT -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" 2>/dev/null; then
    log_error "Cannot connect to server via SSH"
    log_info "Please ensure:"
    log_info "  1. Server is reachable: ping $SERVER_IP"
    log_info "  2. SSH key is configured: ssh-copy-id -p $SSH_PORT $SERVER_USER@$SERVER_IP"
    log_info "  3. Firewall allows SSH on port $SSH_PORT"
    exit 1
fi
log_success "SSH connection successful"

# Check and install dependencies on server
log_info "Checking server dependencies..."
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP 'bash -s' <<'REMOTE_CHECK'
#!/bin/bash
set -e

echo "[INFO] Checking system requirements..."
TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
TOTAL_DISK=$(df -BG / | awk 'NR==2{print $4}' | sed 's/G//')

echo "[INFO] Memory: ${TOTAL_MEM}MB"
echo "[INFO] Disk: ${TOTAL_DISK}GB available"

if [ "$TOTAL_MEM" -lt 1800 ]; then
    echo "[WARNING] Low memory detected: ${TOTAL_MEM}MB (recommended: 2GB)"
fi

if [ "$TOTAL_DISK" -lt 8 ]; then
    echo "[WARNING] Low disk space: ${TOTAL_DISK}GB (recommended: 10GB)"
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "[INFO] Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
    echo "[SUCCESS] Docker installed"
else
    echo "[INFO] Docker already installed: $(docker --version)"
fi

# Install Docker Compose if not present
if ! docker compose version &> /dev/null; then
    echo "[INFO] Installing Docker Compose..."
    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    mkdir -p $DOCKER_CONFIG/cli-plugins
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    echo "[SUCCESS] Docker Compose installed"
else
    echo "[INFO] Docker Compose already installed: $(docker compose version)"
fi

# Install rsync if not present
if ! command -v rsync &> /dev/null; then
    echo "[INFO] Installing rsync..."
    if command -v apt-get &> /dev/null; then
        apt-get update && apt-get install -y rsync
    elif command -v yum &> /dev/null; then
        yum install -y rsync
    fi
    echo "[SUCCESS] rsync installed"
fi
REMOTE_CHECK

log_success "Server dependencies checked"

# Create project directory on server
log_info "Creating project directory on server..."
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR"
log_success "Project directory created: $PROJECT_DIR"

# Sync files to server
log_info "Syncing files from local to server..."
log_info "Local: $LOCAL_DIR"
log_info "Remote: $SERVER_USER@$SERVER_IP:$PROJECT_DIR"
echo ""

rsync -avz --delete \
    --exclude '.git' \
    --exclude '.github' \
    --exclude 'node_modules' \
    --exclude 'frontend/node_modules' \
    --exclude 'backend/node_modules' \
    --exclude '.next' \
    --exclude 'frontend/.next' \
    --exclude 'dist' \
    --exclude 'backend/dist' \
    --exclude '.turbo' \
    --exclude 'coverage' \
    --exclude '.env.local' \
    --exclude '.env.development' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    --exclude 'logs/*' \
    --exclude 'data/postgres/*' \
    --exclude 'data/redis/*' \
    --exclude 'data/minio/*' \
    --exclude 'backend/logs/*' \
    --exclude 'backend/data/*' \
    --exclude '.vscode' \
    --exclude '.idea' \
    --exclude '*.swp' \
    --exclude '*~' \
    --progress \
    -e "ssh -p $SSH_PORT" \
    "$LOCAL_DIR/" \
    "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/"

log_success "Files synced successfully"

# Setup environment file if not exists
log_info "Setting up environment configuration..."
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "bash -s" <<REMOTE_ENV
#!/bin/bash
cd $PROJECT_DIR

if [ ! -f .env.production ]; then
    echo "[INFO] Creating .env.production file..."
    
    # Generate secure random passwords
    POSTGRES_PASS="postgres_\$(openssl rand -hex 16)"
    REDIS_PASS="redis_\$(openssl rand -hex 16)"
    JWT_SECRET="\$(openssl rand -hex 32)"
    NEXTAUTH_SECRET="\$(openssl rand -hex 32)"
    MINIO_SECRET="\$(openssl rand -hex 16)"
    
    cat > .env.production << 'EOF'
# Server Configuration
NODE_ENV=production
DOMAIN=116.118.48.208
SSL_EMAIL=admin@innerv2core.com
ENABLE_MIGRATIONS=true

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=POSTGRES_PASS_PLACEHOLDER
POSTGRES_DB=innerv2
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:POSTGRES_PASS_PLACEHOLDER@postgres:5432/innerv2

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=REDIS_PASS_PLACEHOLDER
REDIS_URL=redis://:REDIS_PASS_PLACEHOLDER@redis:6379

# JWT Configuration
JWT_SECRET=JWT_SECRET_PLACEHOLDER
JWT_EXPIRATION=7d

# NextAuth Configuration
NEXTAUTH_URL=http://116.118.48.208:14000
NEXTAUTH_SECRET=NEXTAUTH_SECRET_PLACEHOLDER

# Minio Configuration
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=innerv2-admin
MINIO_SECRET_KEY=MINIO_SECRET_PLACEHOLDER
MINIO_BUCKET=innerv2-bucket
MINIO_USE_SSL=false
MINIO_PUBLIC_URL=http://116.118.48.208:14007

# API Configuration
BACKEND_URL=http://backend:14001
FRONTEND_URL=http://116.118.48.208:14000
GRAPHQL_ENDPOINT=http://backend:14001/graphql

# Logging
LOG_LEVEL=info

# Port Configuration
BACKEND_PORT=14001
FRONTEND_PORT=14000
POSTGRES_PUBLIC_PORT=14003
REDIS_PUBLIC_PORT=14004
MINIO_PUBLIC_PORT=14007
MINIO_CONSOLE_PORT=14008
EOF

    # Replace placeholders with actual values
    sed -i "s/POSTGRES_PASS_PLACEHOLDER/\$POSTGRES_PASS/g" .env.production
    sed -i "s/REDIS_PASS_PLACEHOLDER/\$REDIS_PASS/g" .env.production
    sed -i "s/JWT_SECRET_PLACEHOLDER/\$JWT_SECRET/g" .env.production
    sed -i "s/NEXTAUTH_SECRET_PLACEHOLDER/\$NEXTAUTH_SECRET/g" .env.production
    sed -i "s/MINIO_SECRET_PLACEHOLDER/\$MINIO_SECRET/g" .env.production
    
    echo "[SUCCESS] .env.production created with secure passwords"
else
    echo "[INFO] .env.production already exists, keeping existing configuration"
fi
REMOTE_ENV

log_success "Environment configuration ready"

# Stop existing containers
log_info "Stopping existing containers..."
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.build.yml down 2>/dev/null || true"
log_success "Containers stopped"

# Clean up old Docker resources
log_info "Cleaning up old Docker resources..."
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "docker system prune -af --volumes || true"
log_success "Cleanup completed"

# Deploy application
log_info "Starting deployment with FAST BUILD mode..."
log_info "Using Bun runtime (no TypeScript compilation - much faster!)"
echo ""
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "bash -s" <<REMOTE_DEPLOY
#!/bin/bash
cd $PROJECT_DIR

echo "[INFO] Building and starting containers with fast build..."
echo "[INFO] This will use Bun's native TypeScript support (no tsc compilation)"
docker compose -f docker-compose.build.fast.yml up -d --build

echo ""
echo "[INFO] Waiting for services to be healthy..."
sleep 30

echo ""
echo "[INFO] Checking container status..."
docker compose -f docker-compose.build.fast.yml ps

echo ""
echo "[INFO] Container logs (last 20 lines):"
docker compose -f docker-compose.build.fast.yml logs --tail=20
REMOTE_DEPLOY

echo ""
log_success "Deployment completed!"
echo ""

# Display access information
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            DEPLOYMENT SUCCESSFUL               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📱 Access URLs:${NC}"
echo -e "   Frontend:  ${GREEN}http://116.118.48.208:14000${NC}"
echo -e "   Backend:   ${GREEN}http://116.118.48.208:14001${NC}"
echo -e "   GraphQL:   ${GREEN}http://116.118.48.208:14001/graphql${NC}"
echo -e "   Minio:     ${GREEN}http://116.118.48.208:14007${NC}"
echo -e "   Console:   ${GREEN}http://116.118.48.208:14008${NC}"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "   SSH to server:      ${YELLOW}ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP${NC}"
echo -e "   View logs:          ${YELLOW}ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml logs -f'${NC}"
echo -e "   Check status:       ${YELLOW}ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml ps'${NC}"
echo -e "   Restart services:   ${YELLOW}ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml restart'${NC}"
echo ""
echo -e "${BLUE}📊 Monitor Resources:${NC}"
echo -e "   ${YELLOW}ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP 'docker stats --no-stream'${NC}"
echo ""
echo -e "${GREEN}✅ Deployment script completed successfully!${NC}"
