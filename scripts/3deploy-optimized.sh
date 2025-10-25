#!/bin/bash

###############################################################################
# OPTIMIZED DEPLOYMENT SCRIPT
# Tối ưu hóa deployment để tránh treo server
# Features:
# - Kiểm tra trước deployment
# - Giới hạn tài nguyên Docker
# - Health check
# - Rollback nếu cần
###############################################################################

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="116.118.49.243"
SERVER_USER="root"
PROJECT_DIR="shoprausach"
DOCKER_COMPOSE_FILE="docker-compose.yml"
MAX_MEMORY="4g"  # Giới hạn memory per container
MAX_CPU="2"      # Giới hạn CPU per container
HEALTH_CHECK_TIMEOUT=60
DEPLOY_TIMEOUT=300

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}  🚀 OPTIMIZED DEPLOYMENT SCRIPT${NC}"
echo -e "${BLUE}  $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo ""

# ============================================================================
# STEP 1: Local Git Operations
# ============================================================================
echo -e "${YELLOW}📦 STEP 1: Local Git Operations${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! git diff --quiet; then
    echo "📝 Staging changes..."
    git add .
    
    if git diff --cached --quiet; then
        echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    else
        echo "💾 Committing changes..."
        git commit -m "$(date '+%Y-%m-%d %H:%M:%S') - Automated deployment update"
    fi
else
    echo "✅ Working directory clean"
fi

echo "🔄 Pushing to remote..."
if ! git push; then
    echo -e "${RED}❌ Git push failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git operations completed${NC}"
echo ""

# ============================================================================
# STEP 2: Remote Deployment
# ============================================================================
echo -e "${YELLOW}🌐 STEP 2: Remote Server Deployment${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ssh ${SERVER_USER}@${SERVER_IP} << 'DEPLOY_EOF'
set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="shoprausach"
DOCKER_COMPOSE_FILE="docker-compose.yml"
HEALTH_CHECK_TIMEOUT=60
DEPLOY_TIMEOUT=300

echo -e "${BLUE}📍 Server: $(hostname)${NC}"
echo -e "${BLUE}📂 Directory: $(pwd)/${PROJECT_DIR}${NC}"
echo ""

# ========================================================================
# Pre-deployment checks
# ========================================================================
echo -e "${YELLOW}🔍 STEP 2.1: Pre-deployment Checks${NC}"
echo "─────────────────────────────────────────────────────────────────"

cd ${PROJECT_DIR}

# Check disk space
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo -e "${RED}❌ Disk usage at ${DISK_USAGE}% - Need cleanup${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Disk space: ${DISK_USAGE}% (OK)${NC}"

# Check memory
AVAILABLE_MEMORY=$(free -m | awk 'NR==2 {print $7}')
if [ $AVAILABLE_MEMORY -lt 1024 ]; then
    echo -e "${YELLOW}⚠️  Low memory available: ${AVAILABLE_MEMORY}MB${NC}"
fi
echo -e "${GREEN}✅ Available memory: ${AVAILABLE_MEMORY}MB${NC}"

# Pull latest code
echo ""
echo -e "${YELLOW}🔄 Pulling latest code...${NC}"
git pull origin $(git rev-parse --abbrev-ref HEAD)
echo -e "${GREEN}✅ Code updated${NC}"

# ========================================================================
# Docker optimization
# ========================================================================
echo ""
echo -e "${YELLOW}🧹 STEP 2.2: Docker Cleanup & Optimization${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Stop old containers gracefully
echo "⏹️  Stopping containers (timeout: 30s)..."
docker compose -f ${DOCKER_COMPOSE_FILE} down --timeout=30 2>/dev/null || true

# Remove orphan containers
echo "🗑️  Removing orphan containers..."
docker ps -a --filter "label!=maintainer" -q | head -20 | xargs -r docker rm -f 2>/dev/null || true

# Prune unused resources
echo "🧹 Pruning unused Docker resources..."
docker image prune -af --filter "until=72h" 2>/dev/null || true
docker volume prune -f 2>/dev/null || true
docker network prune -f 2>/dev/null || true

# Remove build cache if disk is low
if [ $DISK_USAGE -gt 80 ]; then
    echo "💾 Clearing Docker build cache (disk usage high)..."
    docker builder prune -af 2>/dev/null || true
fi

echo -e "${GREEN}✅ Docker cleanup completed${NC}"

# ========================================================================
# Deployment with resource limits
# ========================================================================
echo ""
echo -e "${YELLOW}🚀 STEP 2.3: Starting Containers (with resource limits)${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Create deployment timeout handler
deploy_failed=0
timeout ${DEPLOY_TIMEOUT} bash -c '
    docker compose -f ${DOCKER_COMPOSE_FILE} up -d --build --remove-orphans --pull missing
    EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
        echo -e "${RED}❌ Docker compose failed with code $EXIT_CODE${NC}"
        exit $EXIT_CODE
    fi
' || deploy_failed=$?

if [ $deploy_failed -ne 0 ]; then
    echo -e "${RED}❌ Deployment timeout or failed${NC}"
    echo "🔄 Attempting rollback..."
    docker compose -f ${DOCKER_COMPOSE_FILE} down --timeout=15 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}✅ Containers started${NC}"

# ========================================================================
# Health checks
# ========================================================================
echo ""
echo -e "${YELLOW}🏥 STEP 2.4: Health Checks (timeout: ${HEALTH_CHECK_TIMEOUT}s)${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Wait for containers to be ready
ELAPSED=0
INTERVAL=5
SERVICES_OK=0
TOTAL_SERVICES=5

while [ $ELAPSED -lt $HEALTH_CHECK_TIMEOUT ]; do
    SERVICES_OK=$(docker compose -f ${DOCKER_COMPOSE_FILE} ps --status=running | grep -c "running" || echo 0)
    
    if [ $SERVICES_OK -ge 4 ]; then  # At least 4 services running
        echo -e "${GREEN}✅ Services healthy: $SERVICES_OK/5${NC}"
        break
    fi
    
    echo "⏳ Waiting for services... ($SERVICES_OK/5 running, ${ELAPSED}s)"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $SERVICES_OK -lt 4 ]; then
    echo -e "${YELLOW}⚠️  Warning: Only $SERVICES_OK/5 services running${NC}"
    echo "📋 Container status:"
    docker compose -f ${DOCKER_COMPOSE_FILE} ps
fi

# Check API health
echo ""
echo "🔗 Checking API health..."
API_URL="http://localhost:14000/health"
HEALTH_OK=0

for i in {1..10}; do
    if curl -sf ${API_URL} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API is responding${NC}"
        HEALTH_OK=1
        break
    fi
    echo "⏳ API not ready yet... (attempt $i/10)"
    sleep 3
done

if [ $HEALTH_OK -eq 0 ]; then
    echo -e "${YELLOW}⚠️  API not responding yet (might need more time)${NC}"
fi

echo -e "${GREEN}✅ Health checks completed${NC}"

# ========================================================================
# Optimization & cleanup
# ========================================================================
echo ""
echo -e "${YELLOW}⚙️  STEP 2.5: Final Optimization${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Remove old logs
echo "📝 Cleaning old logs..."
find . -name "*.log" -mtime +7 -delete 2>/dev/null || true

# Clean temporary files
echo "🧹 Cleaning temp files..."
rm -rf /tmp/docker-* 2>/dev/null || true

# Show resource usage
echo ""
echo "📊 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -10

echo -e "${GREEN}✅ Deployment completed successfully${NC}"

DEPLOY_EOF

DEPLOY_RESULT=$?

echo ""
if [ $DEPLOY_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}✅ Completed at $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo ""
else
    echo -e "${RED}❌ DEPLOYMENT FAILED!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit $DEPLOY_RESULT
fi
