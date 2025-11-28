#!/bin/bash

# Deploy script for app.tazagroup.vn
# Frontend: 13000, Backend: 13001

set -e

echo "🚀 Deploying TAZAGROUP to 116.118.49.243..."

SERVER="116.118.49.243"
SERVER_USER="root"
REMOTE_PATH="/opt/tazagroup"

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "${SCRIPT_DIR}/../.." && pwd )"
DOCKER_IMAGES_PATH="${PROJECT_ROOT}/docker-images"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker images exist
if [ ! -f "${DOCKER_IMAGES_PATH}/tazagroup-backend.tar.gz" ]; then
  echo -e "${RED}❌ Error: Docker image not found: ${DOCKER_IMAGES_PATH}/tazagroup-backend.tar.gz${NC}"
  echo -e "${BLUE}💡 Please build Docker images first:${NC}"
  echo -e "   cd ${PROJECT_ROOT}"
  echo -e "   bun run docker:build"
  exit 1
fi

if [ ! -f "${DOCKER_IMAGES_PATH}/tazagroup-frontend.tar.gz" ]; then
  echo -e "${RED}❌ Error: Docker image not found: ${DOCKER_IMAGES_PATH}/tazagroup-frontend.tar.gz${NC}"
  echo -e "${BLUE}💡 Please build Docker images first:${NC}"
  echo -e "   cd ${PROJECT_ROOT}"
  echo -e "   bun run docker:build"
  exit 1
fi

echo -e "${BLUE}📦 Step 1: Uploading Docker images...${NC}"
scp ${DOCKER_IMAGES_PATH}/tazagroup-backend.tar.gz ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/
scp ${DOCKER_IMAGES_PATH}/tazagroup-frontend.tar.gz ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/

echo -e "${BLUE}📦 Step 2: Loading Docker images on server...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
cd /opt/tazagroup
docker load < tazagroup-backend.tar.gz
docker load < tazagroup-frontend.tar.gz
rm -f tazagroup-backend.tar.gz tazagroup-frontend.tar.gz
EOF

echo -e "${BLUE}🔄 Step 3: Stopping old containers...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
docker stop tazagroup-backend || true
docker stop tazagroup-frontend || true
docker rm tazagroup-backend || true
docker rm tazagroup-frontend || true
EOF

echo -e "${BLUE}🚀 Step 4: Starting new containers...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
# Start Backend
docker run -d \
  --name tazagroup-backend \
  --restart unless-stopped \
  -p 13001:13001 \
  --network host \
  -v /opt/tazagroup/.env:/app/.env:ro \
  tazagroup-backend:latest

# Start Frontend
docker run -d \
  --name tazagroup-frontend \
  --restart unless-stopped \
  -p 13000:3000 \
  --network host \
  tazagroup-frontend:latest

# Wait for containers to start
sleep 5

# Check container status
docker ps | grep tazagroup
EOF

echo -e "${BLUE}🧹 Step 5: Cleaning up old images...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
docker image prune -f
EOF

echo -e "${GREEN}✅ TAZAGROUP deployment completed!${NC}"
echo -e "${GREEN}Frontend: http://app.tazagroup.vn${NC}"
echo -e "${GREEN}Backend: http://app.tazagroup.vn/graphql${NC}"
