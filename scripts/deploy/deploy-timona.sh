#!/bin/bash

# Deploy script for app.timona.edu.vn
# Frontend: 15000, Backend: 15001

set -e

echo "🚀 Deploying TIMONA to 116.118.49.243..."

SERVER="116.118.49.243"
SERVER_USER="root"
REMOTE_PATH="/opt/timona"

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
if [ ! -f "${DOCKER_IMAGES_PATH}/timona-backend.tar.gz" ]; then
  echo -e "${RED}❌ Error: Docker image not found: ${DOCKER_IMAGES_PATH}/timona-backend.tar.gz${NC}"
  echo -e "${BLUE}💡 Please build Docker images first:${NC}"
  echo -e "   cd ${PROJECT_ROOT}"
  echo -e "   bun run docker:build"
  exit 1
fi

if [ ! -f "${DOCKER_IMAGES_PATH}/timona-frontend.tar.gz" ]; then
  echo -e "${RED}❌ Error: Docker image not found: ${DOCKER_IMAGES_PATH}/timona-frontend.tar.gz${NC}"
  echo -e "${BLUE}💡 Please build Docker images first:${NC}"
  echo -e "   cd ${PROJECT_ROOT}"
  echo -e "   bun run docker:build"
  exit 1
fi

# Check if env file exists locally
ENV_FILE="${PROJECT_ROOT}/env/.env.prod.timona"
if [ ! -f "${ENV_FILE}" ]; then
  echo -e "${RED}❌ Error: Environment file not found: ${ENV_FILE}${NC}"
  exit 1
fi

echo -e "${BLUE}📤 Step 0: Uploading environment file...${NC}"
ssh ${SERVER_USER}@${SERVER} "mkdir -p ${REMOTE_PATH}"
scp ${ENV_FILE} ${SERVER_USER}@${SERVER}:${REMOTE_PATH}/.env
echo -e "${GREEN}✅ Environment file uploaded${NC}"

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
# Ensure .env is a file, not a directory
if [ -d "/opt/timona/.env" ]; then
  echo "⚠️  Warning: .env is a directory, removing..."
  rm -rf /opt/timona/.env
fi

# Check if .env file exists
if [ ! -f "/opt/timona/.env" ]; then
  echo "❌ Error: /opt/timona/.env file not found!"
  echo "💡 Please create the .env file on the server before deploying"
  exit 1
fi

# Start Backend (using host network, listens on port 15001)
docker run -d \
  --name timona-backend \
  --restart unless-stopped \
  --network host \
  -v /opt/timona/.env:/app/.env:ro \
  timona-backend:latest

# Start Frontend (using host network, listens on port 15000)
docker run -d \
  --name timona-frontend \
  --restart unless-stopped \
  --network host \
  -e PORT=15000 \
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
