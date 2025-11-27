#!/bin/bash

# Deploy script for app.timona.edu.vn
# Frontend: 15000, Backend: 15001

set -e

echo "🚀 Deploying TIMONA to 116.118.49.243..."

SERVER="116.118.49.243"
SERVER_USER="root"
REMOTE_PATH="/opt/timona"
DOCKER_IMAGES_PATH="./docker-images"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Step 1: Uploading Docker images...${NC}"
scp ${DOCKER_IMAGES_PATH}/timona-backend.tar.gz ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/
scp ${DOCKER_IMAGES_PATH}/timona-frontend.tar.gz ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/

echo -e "${BLUE}📦 Step 2: Loading Docker images on server...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
cd /opt/timona
docker load < timona-backend.tar.gz
docker load < timona-frontend.tar.gz
rm -f timona-backend.tar.gz timona-frontend.tar.gz
EOF

echo -e "${BLUE}🔄 Step 3: Stopping old containers...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
docker stop timona-backend || true
docker stop timona-frontend || true
docker rm timona-backend || true
docker rm timona-frontend || true
EOF

echo -e "${BLUE}🚀 Step 4: Starting new containers...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
# Start Backend
docker run -d \
  --name timona-backend \
  --restart unless-stopped \
  -p 15001:15001 \
  --network host \
  -v /opt/timona/.env:/app/.env:ro \
  timona-backend:latest

# Start Frontend
docker run -d \
  --name timona-frontend \
  --restart unless-stopped \
  -p 15000:3000 \
  --network host \
  timona-frontend:latest

# Wait for containers to start
sleep 5

# Check container status
docker ps | grep timona
EOF

echo -e "${BLUE}🧹 Step 5: Cleaning up old images...${NC}"
ssh ${SERVER_USER}@${SERVER} << 'EOF'
docker image prune -f
EOF

echo -e "${GREEN}✅ TIMONA deployment completed!${NC}"
echo -e "${GREEN}Frontend: http://app.timona.edu.vn${NC}"
echo -e "${GREEN}Backend: http://app.timona.edu.vn/graphql${NC}"
