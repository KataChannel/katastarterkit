#!/bin/bash

# Quick Start Script for Innerv2 Domain Only
# Optimized for low-resource cloud server

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.multi-domain.yml"

echo -e "${BLUE}🚀 Starting Innerv2 Domain (Port 13xxx)...${NC}"
echo ""

# Start infrastructure + innerv2 services
docker-compose -f "$COMPOSE_FILE" up -d postgres redis minio innerv2-backend innerv2-frontend

echo ""
echo -e "${GREEN}✅ Innerv2 Domain Started!${NC}"
echo ""
echo -e "${YELLOW}Access URLs:${NC}"
echo -e "  Frontend:  ${BLUE}http://116.118.48.208:13000${NC}"
echo -e "  Backend:   ${BLUE}http://116.118.48.208:13001/graphql${NC}"
echo ""
echo -e "${YELLOW}View logs:${NC}"
echo -e "  docker-compose -f $COMPOSE_FILE logs -f innerv2-backend innerv2-frontend"
echo ""
