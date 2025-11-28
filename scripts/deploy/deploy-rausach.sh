#!/bin/bash

# Deploy script for shop.rausachtrangia.com
# Frontend: 12000, Backend: 12001

set -e

echo "🚀 Deploying RAUSACH to 116.118.49.243..."

SERVER="116.118.49.243"
SERVER_USER="root"
REMOTE_PATH="/opt/shoprausach"
DOCKER_IMAGES_PATH="./docker-images"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Step 1: Uploading Docker images...${NC}"
scp ${DOCKER_IMAGES_PATH}/rausach-backend.tar.gz ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/
scp ${DOCKER_IMAGES_PATH}/rausach-frontend.tar.gz ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/

echo -e "${BLUE}📦 Step 2: Loading Docker images on server...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
cd /opt/shoprausach
docker load < rausach-backend.tar.gz
docker load < rausach-frontend.tar.gz
rm -f rausach-backend.tar.gz rausach-frontend.tar.gz
EOF

echo -e "${BLUE}🔄 Step 3: Stopping old containers...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
docker stop shopbackend || true
docker stop shopfrontend || true
docker rm shopbackend || true
docker rm shopfrontend || true
EOF

echo -e "${BLUE}🚀 Step 4: Starting new containers...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
# Start Backend (using host network, listens on port 12001)
docker run -d \
  --name shopbackend \
  --restart unless-stopped \
  --network host \
  -v /opt/shoprausach/.env:/app/.env:ro \
  rausach-backend:latest

# Start Frontend (using host network, listens on port 3000)
# Nginx proxies shop.rausachtrangia.com to port 3000
docker run -d \
  --name shopfrontend \
  --restart unless-stopped \
  --network host \
  rausach-frontend:latest

# Wait for containers to start
sleep 5

# Check container status
docker ps | grep -E '(shopbackend|shopfrontend)'
EOF

echo -e "${BLUE}🧹 Step 5: Cleaning up old images...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
docker image prune -f
EOF

echo -e "${GREEN}✅ RAUSACH deployment completed!${NC}"
echo -e "${GREEN}Frontend: http://shop.rausachtrangia.com${NC}"
echo -e "${GREEN}Backend: http://shop.rausachtrangia.com/graphql${NC}"
