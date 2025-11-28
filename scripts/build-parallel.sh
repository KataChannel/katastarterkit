#!/bin/bash
# ============================================================================
# Parallel Docker Build Script - Build Backend & Frontend Simultaneously
# Uses Docker BuildKit with cache mounts for maximum speed
# ============================================================================

set -e

echo "🚀 Starting parallel optimized Docker build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BUILD_START=$(date +%s)

# Function to build backend
build_backend() {
    echo -e "${BLUE}📦 [Backend] Starting build...${NC}"
    
    if docker build \
      --file backend/Dockerfile.production \
      --tag rausach-backend:latest \
      --build-arg BUILDKIT_INLINE_CACHE=1 \
      --progress=plain \
      . > /tmp/backend-build.log 2>&1; then
        echo -e "${GREEN}✓ [Backend] Build successful${NC}"
        return 0
    else
        echo -e "${RED}✗ [Backend] Build failed${NC}"
        tail -50 /tmp/backend-build.log
        return 1
    fi
}

# Function to build frontend
build_frontend() {
    echo -e "${BLUE}📦 [Frontend] Starting build...${NC}"
    
    if docker build \
      --file frontend/Dockerfile.production \
      --tag rausach-frontend:latest \
      --build-arg BUILDKIT_INLINE_CACHE=1 \
      --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:4000} \
      --build-arg NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL:-http://localhost:4000/graphql} \
      --build-arg NEXT_PUBLIC_UPLOAD_URL=${NEXT_PUBLIC_UPLOAD_URL:-http://localhost:9000} \
      --build-arg NEXT_PUBLIC_WEBSITE_URL=${NEXT_PUBLIC_WEBSITE_URL:-http://localhost:3000} \
      --build-arg NEXT_PUBLIC_WEBSITE_NAME=${NEXT_PUBLIC_WEBSITE_NAME:-RauSach} \
      --progress=plain \
      . > /tmp/frontend-build.log 2>&1; then
        echo -e "${GREEN}✓ [Frontend] Build successful${NC}"
        return 0
    else
        echo -e "${RED}✗ [Frontend] Build failed${NC}"
        tail -50 /tmp/frontend-build.log
        return 1
    fi
}

# Build in parallel
echo -e "${YELLOW}Building both images in parallel...${NC}"
echo ""

# Start both builds in background
build_backend &
BACKEND_PID=$!

build_frontend &
FRONTEND_PID=$!

# Wait for both to complete
BACKEND_STATUS=0
FRONTEND_STATUS=0

if ! wait $BACKEND_PID; then
    BACKEND_STATUS=1
fi

if ! wait $FRONTEND_PID; then
    FRONTEND_STATUS=1
fi

BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if any build failed
if [ $BACKEND_STATUS -ne 0 ] || [ $FRONTEND_STATUS -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    echo ""
    echo "Check logs at:"
    [ $BACKEND_STATUS -ne 0 ] && echo "  - /tmp/backend-build.log"
    [ $FRONTEND_STATUS -ne 0 ] && echo "  - /tmp/frontend-build.log"
    exit 1
fi

# Success - show stats
echo -e "${GREEN}✨ Build complete in ${BUILD_TIME}s!${NC}"
echo ""
echo -e "${YELLOW}📊 Image Statistics:${NC}"
echo "Backend:  $(docker images rausach-backend:latest --format '{{.Size}}')"
echo "Frontend: $(docker images rausach-frontend:latest --format '{{.Size}}')"
echo ""

echo -e "${BLUE}🎯 Next steps:${NC}"
echo "  1. Start infrastructure: docker compose -f docker-compose.infra.yml up -d"
echo "  2. Start applications:   docker compose -f docker-compose.app.yml up -d"
echo ""

# Cleanup logs
rm -f /tmp/backend-build.log /tmp/frontend-build.log
