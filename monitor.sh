#!/bin/bash

# ============================================================================
# DOCKER SYSTEM MONITORING SCRIPT
# Monitor resource usage for production deployment
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get compose file
COMPOSE_FILE="${1:-docker-compose.production.yml}"

echo -e "${BLUE}=== Docker System Monitor ===${NC}"
echo ""

# Show running containers
echo -e "${GREEN}Running Containers:${NC}"
docker compose -f "$COMPOSE_FILE" ps
echo ""

# Show resource usage
echo -e "${GREEN}Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"
echo ""

# Show disk usage
echo -e "${GREEN}Docker Disk Usage:${NC}"
docker system df
echo ""

# Show system memory
echo -e "${GREEN}System Memory:${NC}"
free -h
echo ""

# Show disk space
echo -e "${GREEN}Disk Space:${NC}"
df -h /
echo ""

# Check container health
echo -e "${GREEN}Container Health:${NC}"
for container in $(docker compose -f "$COMPOSE_FILE" ps -q); do
    name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/\///')
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "N/A")
    status=$(docker inspect --format='{{.State.Status}}' "$container")
    
    if [ "$health" = "healthy" ]; then
        echo -e "  ${GREEN}✓${NC} $name - $status ($health)"
    elif [ "$health" = "unhealthy" ]; then
        echo -e "  ${RED}✗${NC} $name - $status ($health)"
    else
        echo -e "  ${YELLOW}○${NC} $name - $status"
    fi
done
echo ""

# Show logs summary (last 10 lines of each service)
echo -e "${GREEN}Recent Logs Summary:${NC}"
echo -e "${YELLOW}Use 'docker compose -f $COMPOSE_FILE logs -f [service]' for full logs${NC}"
echo ""
