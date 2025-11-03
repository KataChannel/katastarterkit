#!/bin/bash

# Stop Tazagroup Domain

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.multi-domain.yml"

echo -e "${YELLOW}🛑 Stopping Tazagroup Domain...${NC}"

docker-compose -f "$COMPOSE_FILE" stop tazagroup-backend tazagroup-frontend

echo -e "${GREEN}✅ Tazagroup Domain Stopped${NC}"
