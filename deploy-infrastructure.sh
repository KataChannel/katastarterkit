#!/bin/bash

# ============================================
# Infrastructure Deployment Script
# Deploys: PostgreSQL, Redis, MinIO to Server
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configuration
SERVER_IP="${SERVER_IP:-116.118.48.208}"
SERVER_USER="${SERVER_USER:-root}"
DEPLOY_DIR="/opt/innerv2"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Infrastructure Deployment to ${SERVER_IP}${NC}"
echo -e "${BLUE}================================================${NC}"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    echo "Please create .env file with the following variables:"
    echo "  POSTGRES_PASSWORD, REDIS_PASSWORD, MINIO_ACCESS_KEY, MINIO_SECRET_KEY"
    exit 1
fi

print_info "Checking SSH connection to ${SERVER_IP}..."
if ssh -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_IP} "echo 'SSH connection successful'" > /dev/null 2>&1; then
    print_success "SSH connection established"
else
    print_error "Cannot connect to server via SSH"
    echo "Please ensure:"
    echo "  1. Server is accessible"
    echo "  2. SSH key is configured"
    echo "  3. Server user has proper permissions"
    exit 1
fi

# Create deployment directory on server
print_info "Creating deployment directory on server..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_DIR}"

# Copy necessary files to server
print_info "Copying docker-compose.yml to server..."
scp docker-compose.yml ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/

print_info "Copying .env file to server..."
scp .env ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/

# Install Docker on server if not installed
print_info "Checking Docker installation on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
    echo "Docker installed successfully"
else
    echo "Docker is already installed"
    docker --version
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found. Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose is already installed"
    docker-compose --version
fi
ENDSSH

print_success "Docker and Docker Compose are ready"

# Deploy containers
print_info "Deploying infrastructure containers on server..."
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
cd ${DEPLOY_DIR}

# Stop existing containers (if any)
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Pull latest images
echo "Pulling Docker images..."
docker-compose pull

# Start containers
echo "Starting containers..."
docker-compose up -d

# Wait for services to be healthy
echo "Waiting for services to be ready..."
sleep 10

# Check container status
echo ""
echo "========================================="
echo "Container Status:"
echo "========================================="
docker-compose ps

# Show logs
echo ""
echo "========================================="
echo "Recent Logs:"
echo "========================================="
docker-compose logs --tail=20
ENDSSH

print_success "Infrastructure deployment completed!"

# Display service URLs
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Services Available at:${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${BLUE}PostgreSQL:${NC}      ${SERVER_IP}:14003"
echo -e "${BLUE}pgAdmin:${NC}         http://${SERVER_IP}:14002"
echo -e "${BLUE}Redis:${NC}           ${SERVER_IP}:14004"
echo -e "${BLUE}MinIO API:${NC}       http://${SERVER_IP}:14007"
echo -e "${BLUE}MinIO Console:${NC}   http://${SERVER_IP}:14008"
echo ""

# Test connections
print_info "Testing service connections..."

# Test PostgreSQL
if nc -z -w5 ${SERVER_IP} 14003 2>/dev/null; then
    print_success "PostgreSQL is accessible on port 14003"
else
    print_warning "PostgreSQL port 14003 is not accessible (may need firewall rules)"
fi

# Test Redis
if nc -z -w5 ${SERVER_IP} 14004 2>/dev/null; then
    print_success "Redis is accessible on port 14004"
else
    print_warning "Redis port 14004 is not accessible (may need firewall rules)"
fi

# Test MinIO
if nc -z -w5 ${SERVER_IP} 14007 2>/dev/null; then
    print_success "MinIO API is accessible on port 14007"
else
    print_warning "MinIO port 14007 is not accessible (may need firewall rules)"
fi

echo ""
print_info "Next steps:"
echo "  1. Update frontend/.env with server connection strings"
echo "  2. Configure firewall rules on ${SERVER_IP} if needed:"
echo "     - PostgreSQL: 14003"
echo "     - pgAdmin: 14002"
echo "     - Redis: 14004"
echo "     - MinIO API: 14007"
echo "     - MinIO Console: 14008"
echo "  3. Run: bunx prisma db push (to sync database schema)"
echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"
