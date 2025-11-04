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

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🚀 PRODUCTION DEPLOYMENT${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Chọn domain để deploy:${NC}"
echo ""
echo "  1) 🌟 Rausach    (116.118.48.208:12000-12001)"
echo "  2) 🏢 Innerv2  (116.118.48.208:13000-13001)"
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
        ;;
    2)
        DOMAIN="innerv2"
        ENV_FILE=".env.prod.innerv2"
        COMPOSE_FILE="docker-compose.innerv2.yml"
        PORTS="13000-13001"
        ;;
    3)
        DOMAIN="multi-domain"
        COMPOSE_FILE="docker-compose.multi-domain.yml"
        PORTS="12000-13001"
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
    echo -e "   Frontend:  ${GREEN}http://116.118.48.208:12000${NC}"
    echo -e "   Backend:   ${GREEN}http://116.118.48.208:12001/graphql${NC}"
    echo ""
    echo -e "${YELLOW}📍 INNERV2:${NC}"
    echo -e "   Frontend:  ${GREEN}http://116.118.48.208:13000${NC}"
    echo -e "   Backend:   ${GREEN}http://116.118.48.208:13001/graphql${NC}"
    echo ""
    echo -e "${YELLOW}📍 SHARED SERVICES:${NC}"
    echo -e "   Database:  ${GREEN}116.118.48.208:12003${NC}"
    echo -e "   Redis:     ${GREEN}116.118.48.208:12004${NC}"
    echo -e "   Minio:     ${GREEN}116.118.48.208:12007${NC}"
else
    echo -e "${YELLOW}📍 URLs:${NC}"
    echo -e "   Frontend:  ${GREEN}http://116.118.48.208:${PORTS%%-*}${NC}"
    echo -e "   Backend:   ${GREEN}http://116.118.48.208:${PORTS##*-}/graphql${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Container status:${NC}"
$DOCKER_COMPOSE -f $COMPOSE_FILE ps
echo ""
echo -e "${YELLOW}📋 View logs:${NC}"
echo "   $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f"
echo ""
