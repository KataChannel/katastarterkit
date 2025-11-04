#!/bin/bash

# ================================================================
# PRODUCTION DEPLOYMENT SCRIPT
# ================================================================
# Deploy lên server với Docker Compose
# Sử dụng địa chỉ và port production thực tế
# ================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check remote service
check_service() {
    local service=$1
    local host=$2
    local port=$3
    local timeout=3
    
    if timeout $timeout bash -c "cat < /dev/null > /dev/tcp/$host/$port" 2>/dev/null; then
        echo -e "${GREEN}✅ $service${NC}"
        return 0
    else
        echo -e "${RED}❌ $service${NC}"
        return 1
    fi
}

# Function to check PostgreSQL connection
check_postgres() {
    local host=$1
    local port=$2
    local db=$3
    local user=${4:-postgres}
    local pass=${5:-postgres}
    
    if command -v psql &> /dev/null; then
        if PGPASSWORD=$pass psql -h $host -p $port -U $user -d $db -c "SELECT 1;" &>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# Function to check Redis connection
check_redis() {
    local host=$1
    local port=$2
    local pass=${3:-123456}
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h $host -p $port -a "$pass" PING 2>/dev/null | grep -q PONG; then
            return 0
        fi
    fi
    return 1
}

# Function to check all required services before deployment
check_deployment_requirements() {
    local domain=$1
    local failed=0
    
    echo -e "${YELLOW}🔍 Checking deployment requirements...${NC}"
    echo ""
    
    SERVER="116.118.49.243"
    
    # Check based on domain
    if [ "$domain" == "rausach" ]; then
        echo -e "${BLUE}Checking Rausach services:${NC}"
        check_service "PostgreSQL (12003)" "$SERVER" "12003" || failed=1
        
        if check_postgres "$SERVER" "12003" "rausachcore"; then
            echo -e "${GREEN}✅ PostgreSQL Authentication${NC}"
        else
            echo -e "${YELLOW}⚠️  PostgreSQL port open but auth check skipped${NC}"
        fi
    elif [ "$domain" == "tazagroup" ]; then
        echo -e "${BLUE}Checking Tazagroup services:${NC}"
        check_service "PostgreSQL (13003)" "$SERVER" "13003" || failed=1
        
        if check_postgres "$SERVER" "13003" "tazagroupcore"; then
            echo -e "${GREEN}✅ PostgreSQL Authentication${NC}"
        else
            echo -e "${YELLOW}⚠️  PostgreSQL port open but auth check skipped${NC}"
        fi
    elif [ "$domain" == "multi-domain" ]; then
        echo -e "${BLUE}Checking Multi-domain services:${NC}"
        check_service "PostgreSQL Rausach (12003)" "$SERVER" "12003" || failed=1
        check_service "PostgreSQL Tazagroup (13003)" "$SERVER" "13003" || failed=1
    fi
    
    # Check shared services
    echo ""
    echo -e "${BLUE}Checking shared services:${NC}"
    check_service "Redis (12004)" "$SERVER" "12004" || failed=1
    check_service "Minio (12007)" "$SERVER" "12007" || failed=1
    check_service "Minio Console (12008)" "$SERVER" "12008" || failed=1
    
    # Redis auth check
    if check_redis "$SERVER" "12004"; then
        echo -e "${GREEN}✅ Redis Authentication${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis port open but auth check skipped${NC}"
    fi
    
    echo ""
    
    if [ $failed -eq 1 ]; then
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}❌ ERROR: Required services are not available!${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${YELLOW}Please start services on server $SERVER:${NC}"
        echo ""
        echo "  1. SSH to server:"
        echo "     ssh user@$SERVER"
        echo ""
        echo "  2. Start required services:"
        echo "     docker-compose up -d postgres redis minio"
        echo ""
        echo "  3. Check services are running:"
        echo "     docker-compose ps"
        echo ""
        read -p "Continue deployment anyway? (y/N): " continue_choice
        if [[ ! "$continue_choice" =~ ^[Yy]$ ]]; then
            echo -e "${RED}Deployment aborted.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ All required services are available!${NC}"
    fi
    echo ""
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🚀 PRODUCTION DEPLOYMENT${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Chọn domain để deploy:${NC}"
echo ""
echo "  1) 🌟 Rausach    (116.118.49.243:12000-12001)"
echo "  2) 🏢 Tazagroup  (116.118.49.243:13000-13001)"
echo "  3) 🔥 Multi-domain (Cả 2 domain)"
echo "  4) ❌ Exit"
echo ""
read -p "Lựa chọn của bạn [1-4]: " choice

case $choice in
    1)
        DOMAIN="rausach"
        ENV_FILE=".env.prod.rausach"
        COMPOSE_FILE="docker-compose.rausach.yml"
        PORTS="12000-12001"
        # Check deployment requirements
        check_deployment_requirements "rausach"
        ;;
    2)
        DOMAIN="tazagroup"
        ENV_FILE=".env.prod.tazagroup"
        COMPOSE_FILE="docker-compose.tazagroup.yml"
        PORTS="13000-13001"
        # Check deployment requirements
        check_deployment_requirements "tazagroup"
        ;;
    3)
        DOMAIN="multi-domain"
        COMPOSE_FILE="docker-compose.multi-domain.yml"
        PORTS="12000-13001"
        # Check deployment requirements
        check_deployment_requirements "multi-domain"
        ;;
    4)
        echo -e "${YELLOW}Thoát...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Lựa chọn không hợp lệ!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   📦 Preparing ${DOMAIN} deployment...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Auto-detect docker-compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

# Setup environment for single domain
if [ "$DOMAIN" != "multi-domain" ]; then
    echo -e "${YELLOW}⚙️  Copying environment file...${NC}"
    cp $ENV_FILE .env
    echo -e "${GREEN}✅ Environment file updated${NC}"
fi

echo ""
echo -e "${YELLOW}🔨 Building and deploying containers...${NC}"

# Deploy with docker-compose
$DOCKER_COMPOSE -f $COMPOSE_FILE up -d --build

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ ${DOMAIN^^} DEPLOYED SUCCESSFULLY!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$DOMAIN" = "multi-domain" ]; then
    echo -e "${YELLOW}📍 RAUSACH:${NC}"
    echo -e "   Frontend:  ${GREEN}http://116.118.49.243:12000${NC}"
    echo -e "   Backend:   ${GREEN}http://116.118.49.243:12001/graphql${NC}"
    echo ""
    echo -e "${YELLOW}📍 TAZAGROUP:${NC}"
    echo -e "   Frontend:  ${GREEN}http://116.118.49.243:13000${NC}"
    echo -e "   Backend:   ${GREEN}http://116.118.49.243:13001/graphql${NC}"
    echo ""
    echo -e "${YELLOW}📍 SHARED SERVICES:${NC}"
    echo -e "   Database:  ${GREEN}116.118.49.243:12003${NC}"
    echo -e "   Redis:     ${GREEN}116.118.49.243:12004${NC}"
    echo -e "   Minio:     ${GREEN}116.118.49.243:12007${NC}"
else
    echo -e "${YELLOW}📍 URLs:${NC}"
    echo -e "   Frontend:  ${GREEN}http://116.118.49.243:${PORTS%%-*}${NC}"
    echo -e "   Backend:   ${GREEN}http://116.118.49.243:${PORTS##*-}/graphql${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Container status:${NC}"
$DOCKER_COMPOSE -f $COMPOSE_FILE ps
echo ""
echo -e "${YELLOW}📋 View logs:${NC}"
echo "   $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f"
echo ""
