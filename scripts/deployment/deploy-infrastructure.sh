#!/bin/bash

# ============================================================================
# Deploy Infrastructure to Server
# Deploy PostgreSQL, Redis, Minio to production server
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

# Auto-detect project path
if [ -d "/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/chikiet/kataoffical/shoprausach"
elif [ -d "/mnt/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/mnt/chikiet/kataoffical/shoprausach"
else
    echo -e "${RED}❌ Error: Cannot find project directory!${NC}"
    exit 1
fi

cd "$PROJECT_PATH"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🗄️  DEPLOY INFRASTRUCTURE TO SERVER               ║${NC}"
echo -e "${BLUE}║     PostgreSQL + Redis + Minio                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📍 Server:${NC} $SERVER"
echo -e "${GREEN}📦 Services:${NC} PostgreSQL, Redis, Minio"
echo -e "${YELLOW}⚠️  Note:${NC} This will create/update infrastructure services"
echo ""

# Check if file exists
if [ ! -f "$COMPOSE_INFRA" ]; then
    echo -e "${RED}❌ Error: $COMPOSE_INFRA not found!${NC}"
    exit 1
fi

# Confirm deployment
read -p "Deploy infrastructure to production server? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📤 Step 1/2: Uploading Configuration${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh $SERVER "mkdir -p $REMOTE_DIR"

echo -e "${BLUE}  → Uploading docker-compose.infra.yml...${NC}"
rsync -avz $COMPOSE_INFRA $SERVER:$REMOTE_DIR/

echo -e "${GREEN}  ✅ Configuration uploaded${NC}"

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 Step 2/2: Deploying on Server${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh $SERVER << 'ENDSSH'
    set -e
    cd /root/shoprausach
    
    echo "  → Checking existing services..."
    EXISTING=$(docker ps -a --filter "name=shoppostgres" --filter "name=shared-redis" --filter "name=shared-minio" --format "{{.Names}}" | wc -l)
    
    if [ "$EXISTING" -gt 0 ]; then
        echo "  ℹ️  Found existing infrastructure services"
        echo "  → Stopping old services..."
        docker compose -f docker-compose.infra.yml down 2>/dev/null || true
    fi
    
    echo "  → Pulling latest images..."
    docker compose -f docker-compose.infra.yml pull
    
    echo "  → Starting infrastructure services..."
    docker compose -f docker-compose.infra.yml up -d
    
    echo "  → Waiting for services to be ready..."
    sleep 20
    
    echo ""
    echo "📊 Infrastructure Status:"
    docker compose -f docker-compose.infra.yml ps
    
    echo ""
    echo "🔍 Health Checks:"
    
    # Check PostgreSQL
    for i in {1..10}; do
        if docker exec shoppostgres pg_isready -U postgres > /dev/null 2>&1; then
            echo "  ✅ PostgreSQL: Ready"
            break
        else
            if [ $i -eq 10 ]; then
                echo "  ❌ PostgreSQL: Not ready after 10 attempts"
            else
                echo "  ⏳ PostgreSQL: Waiting... ($i/10)"
                sleep 3
            fi
        fi
    done
    
    # Check Redis
    if docker exec shared-redis redis-cli ping 2>/dev/null | grep -q PONG; then
        echo "  ✅ Redis: Ready"
    else
        echo "  ❌ Redis: Not ready"
    fi
    
    # Check Minio
    if docker ps | grep shared-minio | grep -q "Up"; then
        echo "  ✅ Minio: Running"
    else
        echo "  ❌ Minio: Not running"
    fi
    
    echo ""
    echo "💾 Resource Usage:"
    echo "Memory:"
    free -h | grep -E "Mem:|Swap:"
    echo ""
    echo "Disk:"
    df -h / | grep -E "/dev"
ENDSSH

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ INFRASTRUCTURE DEPLOYED!                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🔌 Connection Details:${NC}"
echo -e "   PostgreSQL:  ${GREEN}$SERVER:12003${NC}"
echo -e "   Redis:       ${GREEN}$SERVER:12004${NC}"
echo -e "   Minio API:   ${GREEN}$SERVER:12007${NC}"
echo -e "   Minio UI:    ${GREEN}http://$SERVER:12008${NC}"
echo ""
echo -e "${BLUE}🔐 Default Credentials:${NC}"
echo -e "   PostgreSQL:  ${YELLOW}postgres / postgres${NC}"
echo -e "   Redis:       ${YELLOW}(no password)${NC}"
echo -e "   Minio:       ${YELLOW}minio-admin / minio-secret-2025${NC}"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo -e "   1. Test connections"
echo -e "   2. Deploy applications: ${BLUE}./deploy-optimized.sh${NC}"
echo -e "   3. Initialize Minio bucket if needed"
echo ""
