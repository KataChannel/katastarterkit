#!/bin/bash

# Stop Innerv2 Domain

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.multi-domain.yml"

echo -e "${YELLOW}🛑 Stopping Innerv2 Domain...${NC}"

docker-compose -f "$COMPOSE_FILE" stop innerv2-backend innerv2-frontend

echo -e "${GREEN}✅ Innerv2 Domain Stopped${NC}"
