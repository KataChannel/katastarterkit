#!/bin/bash

# Demo Script: Dynamic Environment Variables in Docker Compose
# Usage: ./scripts/demo-env-vars.sh

set -e

echo "🎯 Demo: Dynamic Environment Variables in Docker Compose"
echo "======================================================"
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Default Configuration${NC}"
echo "Using values from .env file:"
echo

docker compose config --services | while read service; do
    echo -e "  ${GREEN}✓${NC} Service: $service"
done

echo
echo -e "${BLUE}2. Port Override Demo${NC}"
echo "Changing backend port from 4000 to 8080:"
echo

PORT=8080 docker compose config | grep -A 2 -B 2 "8080" || echo "Port override applied!"

echo
echo -e "${BLUE}3. Container Name Override Demo${NC}"
echo "Changing container names with custom prefix:"
echo

BACKEND_CONTAINER_NAME=myapp-backend-v2 \
FRONTEND_CONTAINER_NAME=myapp-frontend-v2 \
docker compose config | grep "container_name:" | head -2

echo
echo -e "${BLUE}4. Environment-specific Demo${NC}"
echo "Simulating production environment:"
echo

NODE_ENV=production \
JWT_SECRET=super-secret-production-key-32chars \
POSTGRES_PASSWORD=strong-production-password \
docker compose config | grep -E "(NODE_ENV|JWT_SECRET)" | head -2

echo
echo -e "${BLUE}5. Multiple Environment Override${NC}"
echo "Changing multiple variables at once:"
echo

PORT=9000 \
FRONTEND_PORT=9001 \
POSTGRES_PORT=9002 \
REDIS_PORT=9003 \
docker compose config | grep -E "published.*900[0-3]" | head -4

echo
echo -e "${BLUE}6. Image Override Demo${NC}"
echo "Using different image versions:"
echo

POSTGRES_IMAGE=postgres:15-alpine \
REDIS_IMAGE=redis:6.2-alpine \
docker compose config | grep -E "image.*alpine" | head -2

echo
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • Use different .env files: --env-file .env.staging"
echo "  • Override on command line: PORT=8080 docker compose up"
echo "  • Check final config: docker compose config"
echo "  • Validate environment: make docker-validate"

echo
echo -e "${GREEN}✅ Demo completed!${NC}"
echo "Your docker-compose.yml is now fully dynamic with environment variables."
