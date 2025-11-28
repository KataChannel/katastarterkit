#!/bin/bash
# ============================================================================
# Optimized Docker Build Script with BuildKit Cache
# This script uses Docker BuildKit features for faster builds
# ============================================================================

set -e

echo "🚀 Starting optimized Docker build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building Backend...${NC}"
docker build \
  --file backend/Dockerfile.production \
  --tag rausach-backend:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --progress=plain \
  .

echo -e "${GREEN}✓ Backend built successfully${NC}"
echo ""

echo -e "${BLUE}📦 Building Frontend...${NC}"
docker build \
  --file frontend/Dockerfile.production \
  --tag rausach-frontend:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:4000} \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL:-http://localhost:4000/graphql} \
  --build-arg NEXT_PUBLIC_UPLOAD_URL=${NEXT_PUBLIC_UPLOAD_URL:-http://localhost:9000} \
  --build-arg NEXT_PUBLIC_WEBSITE_URL=${NEXT_PUBLIC_WEBSITE_URL:-http://localhost:3000} \
  --build-arg NEXT_PUBLIC_WEBSITE_NAME=${NEXT_PUBLIC_WEBSITE_NAME:-RauSach} \
  --progress=plain \
  .

echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

echo -e "${YELLOW}📊 Build Statistics:${NC}"
echo "Backend image: $(docker images rausach-backend:latest --format '{{.Size}}')"
echo "Frontend image: $(docker images rausach-frontend:latest --format '{{.Size}}')"
echo ""

echo -e "${GREEN}✨ Build complete! Ready to deploy.${NC}"
echo ""
echo "To start the services:"
echo "  docker compose -f docker-compose.infra.yml up -d"
echo "  docker compose -f docker-compose.app.yml up -d"
