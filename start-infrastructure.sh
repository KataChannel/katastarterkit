#!/bin/bash

# ============================================================================
# Start Infrastructure Services (PostgreSQL, Redis, Minio)
# Run this once before deploying applications
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER="root@116.118.49.243"
REMOTE_DIR="/root/shoprausach"
COMPOSE_INFRA="docker-compose.infra.yml"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🗄️  INFRASTRUCTURE SETUP                          ║${NC}"
echo -e "${BLUE}║     PostgreSQL + Redis + Minio                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if file exists locally
if [ ! -f "$COMPOSE_INFRA" ]; then
    echo -e "${RED}❌ Error: $COMPOSE_INFRA not found locally!${NC}"
    exit 1
fi

echo -e "${YELLOW}📤 Uploading infrastructure configuration...${NC}"
ssh $SERVER "mkdir -p $REMOTE_DIR"
rsync -avz $COMPOSE_INFRA $SERVER:$REMOTE_DIR/

echo ""
echo -e "${YELLOW}🚀 Starting infrastructure services on server...${NC}"

ssh $SERVER << 'ENDSSH'
    set -e
    cd /root/shoprausach
    
    echo "  → Checking if services already running..."
    if docker ps | grep -E "shoppostgres|shared-redis|shared-minio" > /dev/null; then
        echo "  ℹ️  Some services already running. Recreating..."
        docker compose -f docker-compose.infra.yml down
    fi
    
    echo "  → Starting infrastructure services..."
    docker compose -f docker-compose.infra.yml up -d
    
    echo "  → Waiting for services to be ready..."
    sleep 15
    
    echo ""
    echo "📊 Infrastructure Status:"
    docker compose -f docker-compose.infra.yml ps
    
    echo ""
    echo "🔍 Health Checks:"
    
    # Check PostgreSQL
    if docker exec shoppostgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "  ✅ PostgreSQL: Ready"
    else
        echo "  ❌ PostgreSQL: Not ready"
    fi
    
    # Check Redis
    if docker exec shared-redis redis-cli ping | grep -q PONG; then
        echo "  ✅ Redis: Ready"
    else
        echo "  ❌ Redis: Not ready"
    fi
    
    # Check Minio
    if docker exec shared-minio mc ready local > /dev/null 2>&1; then
        echo "  ✅ Minio: Ready"
    else
        echo "  ⚠️  Minio: May need initialization"
    fi
ENDSSH

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ INFRASTRUCTURE READY!                           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🔌 Connection Details:${NC}"
echo -e "   PostgreSQL: ${GREEN}116.118.49.243:12003${NC}"
echo -e "   Redis:      ${GREEN}116.118.49.243:12004${NC}"
echo -e "   Minio:      ${GREEN}116.118.49.243:12007${NC} (API)"
echo -e "   Minio UI:   ${GREEN}116.118.49.243:12008${NC} (Console)"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo -e "   1. Deploy applications: ${BLUE}./deploy-optimized.sh${NC}"
echo -e "   2. Or use dev menu: ${BLUE}./dev-deploy-menu.sh${NC} → Option 4"
echo ""
