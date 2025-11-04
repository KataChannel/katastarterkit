#!/bin/bash

# Quick Start Script for Tazagroup Domain Only
# Optimized for low-resource cloud server

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.multi-domain.yml"

echo -e "${BLUE}🚀 Starting Tazagroup Domain (Port 13xxx)...${NC}"
echo ""

# Start infrastructure + tazagroup services
docker-compose -f "$COMPOSE_FILE" up -d postgres redis minio tazagroup-backend tazagroup-frontend

echo ""
echo -e "${GREEN}✅ Tazagroup Domain Started!${NC}"
echo ""
echo -e "${YELLOW}Access URLs:${NC}"
echo -e "  Frontend:  ${BLUE}http://116.118.49.243:13000${NC}"
echo -e "  Backend:   ${BLUE}http://116.118.49.243:13001/graphql${NC}"
echo ""
echo -e "${YELLOW}View logs:${NC}"
echo -e "  docker-compose -f $COMPOSE_FILE logs -f tazagroup-backend tazagroup-frontend"
echo ""
