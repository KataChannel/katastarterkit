#!/bin/bash

# Stop Rausach Domain

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.multi-domain.yml"

echo -e "${YELLOW}🛑 Stopping Rausach Domain...${NC}"

docker-compose -f "$COMPOSE_FILE" stop rausach-backend rausach-frontend

echo -e "${GREEN}✅ Rausach Domain Stopped${NC}"
