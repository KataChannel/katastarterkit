#!/bin/bash

# ============================================================================
# REMOTE DEPLOYMENT SCRIPT - Deploy to 116.118.48.208
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
REPO_URL="${REPO_URL:-https://github.com/KataChannel/katastarterkit.git}"
BRANCH="${BRANCH:-innerv2}"

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
echo -e "${BLUE}║   DEPLOY TO SERVER 116.118.48.208         ║${NC}"
echo -e "${BLUE}║   1 Core CPU | 2GB RAM | 10GB Disk        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check SSH connection
log_info "Testing SSH connection to $SERVER_IP..."
if ! ssh -p $SSH_PORT -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" 2>/dev/null; then
    log_error "Cannot connect to server via SSH"
    log_info "Please ensure:"
    log_info "  1. Server is reachable: ping $SERVER_IP"
    log_info "  2. SSH key is configured: ssh-copy-id $SERVER_USER@$SERVER_IP"
    log_info "  3. Firewall allows SSH on port $SSH_PORT"
    exit 1
fi
log_success "SSH connection successful"

# Deploy script to run on remote server
REMOTE_SCRIPT=$(cat <<'REMOTE_EOF'
#!/bin/bash
set -e

PROJECT_DIR="$1"
REPO_URL="$2"
BRANCH="$3"

echo "[INFO] Checking system requirements..."
TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
TOTAL_DISK=$(df -BG / | awk 'NR==2{print $4}' | sed 's/G//')

if [ "$TOTAL_MEM" -lt 1800 ]; then
    echo "[WARNING] Low memory detected: ${TOTAL_MEM}MB (recommended: 2GB)"
fi

if [ "$TOTAL_DISK" -lt 8 ]; then
    echo "[WARNING] Low disk space: ${TOTAL_DISK}GB (recommended: 10GB)"
fi

echo "[INFO] Installing dependencies..."
# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "[INFO] Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "[INFO] Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "[INFO] Setting up project directory..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clone or update repository
if [ -d ".git" ]; then
    echo "[INFO] Updating repository..."
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    echo "[INFO] Cloning repository..."
    git clone -b "$BRANCH" "$REPO_URL" .
fi

echo "[INFO] Setting up environment..."
if [ ! -f ".env.production" ]; then
    echo "[WARNING] .env.production not found, creating from template..."
    cat > .env.production << 'ENV_EOF'
NODE_ENV=production
PORT=14001
BACKEND_PORT=14001
FRONTEND_URL=http://116.118.48.208:14000

DATABASE_URL="postgresql://postgres:postgres@postgres:5432/innerv2core"
POSTGRES_DB=innerv2core
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_secure_$(date +%s)
POSTGRES_PORT=14003

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_$(date +%s)

JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d

MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=innerv2-admin
MINIO_SECRET_KEY=innerv2-secret-$(date +%s)
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=uploads

NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://116.118.48.208:14000

NEXT_PUBLIC_APP_URL=http://116.118.48.208:14000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:14001/graphql

DOMAIN=116.118.48.208
SSL_EMAIL=admin@innerv2.local

DOCKER_NETWORK_NAME=innerv2core-network
ENABLE_MIGRATIONS=true

POSTGRES_CONTAINER_NAME=innerv2core-postgres
REDIS_CONTAINER_NAME=innerv2core-redis
MINIO_CONTAINER_NAME=innerv2core-minio
BACKEND_CONTAINER_NAME=innerv2core-backend
FRONTEND_CONTAINER_NAME=innerv2core-frontend
FRONTEND_PORT=14000
MINIO_CONSOLE_PORT=14008

NEXT_TELEMETRY_DISABLED=1
NEXT_OTEL_ENABLED=false
ENV_EOF
fi

echo "[INFO] Stopping old containers..."
docker compose -f docker-compose.build.yml down 2>/dev/null || true

echo "[INFO] Cleaning up old images and volumes..."
docker system prune -f --volumes 2>/dev/null || true

echo "[INFO] Building and starting services..."
chmod +x deploy-quick.sh 2>/dev/null || true
if [ -f "deploy-quick.sh" ]; then
    ./deploy-quick.sh
else
    docker compose -f docker-compose.build.yml --env-file .env.production up -d --build
fi

echo "[SUCCESS] Deployment completed!"
echo ""
echo "Application URLs:"
echo "  Frontend:     http://116.118.48.208:14000"
echo "  Backend:      http://116.118.48.208:14001"
echo "  GraphQL:      http://116.118.48.208:14001/graphql"
echo "  Minio:        http://116.118.48.208:14007"
echo "  Minio Console: http://116.118.48.208:14008"
echo ""
echo "To check status:  docker compose -f docker-compose.build.yml ps"
echo "To view logs:     docker compose -f docker-compose.build.yml logs -f"
echo "To stop:          docker compose -f docker-compose.build.yml down"
REMOTE_EOF
)

# Upload and execute deployment script
log_info "Uploading deployment script to server..."
echo "$REMOTE_SCRIPT" | ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cat > /tmp/deploy-script.sh && chmod +x /tmp/deploy-script.sh"

log_info "Starting remote deployment..."
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "bash /tmp/deploy-script.sh '$PROJECT_DIR' '$REPO_URL' '$BRANCH'"

log_success "Remote deployment completed!"
echo ""
log_info "Testing endpoints..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:14001/health | grep -q "200"; then
    log_success "Backend is healthy!"
else
    log_warning "Backend health check failed, may need more time to start"
fi

if curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:14000 | grep -q "200"; then
    log_success "Frontend is accessible!"
else
    log_warning "Frontend not yet accessible, may need more time to start"
fi

echo ""
log_success "Deployment process completed!"
log_info "Access your application at: http://$SERVER_IP:14000"
