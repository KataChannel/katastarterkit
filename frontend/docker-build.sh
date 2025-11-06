#!/bin/bash
# =============================================================================
# Docker Build Script for Next.js Full-Stack Application
# =============================================================================
# This script builds the Docker image for production deployment
# Usage: ./docker-build.sh [--no-cache] [--tag TAG]
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="innerbright-fullstack"
DEFAULT_TAG="latest"
DOCKERFILE="Dockerfile.fullstack"

# Parse arguments
NO_CACHE=""
TAG="$DEFAULT_TAG"

while [[ $# -gt 0 ]]; do
  case $1 in
    --no-cache)
      NO_CACHE="--no-cache"
      shift
      ;;
    --tag)
      TAG="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --no-cache    Build without using cache"
      echo "  --tag TAG     Tag for the Docker image (default: latest)"
      echo "  --help        Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Print header
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}Building Docker Image: ${GREEN}${IMAGE_NAME}:${TAG}${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE" ]; then
  echo -e "${RED}Error: Dockerfile not found: $DOCKERFILE${NC}"
  exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
  echo -e "${YELLOW}Warning: .env.production not found${NC}"
  echo -e "${YELLOW}Creating from .env.production.example...${NC}"
  
  if [ -f ".env.production.example" ]; then
    cp .env.production.example .env.production
    echo -e "${GREEN}✓ Created .env.production${NC}"
    echo -e "${YELLOW}⚠ Please edit .env.production with your actual values!${NC}"
    echo ""
  else
    echo -e "${RED}Error: .env.production.example not found${NC}"
    exit 1
  fi
fi

# Build the image
echo -e "${BLUE}Step 1: Building Docker image...${NC}"
echo -e "${BLUE}Command: docker build $NO_CACHE -f $DOCKERFILE -t ${IMAGE_NAME}:${TAG} .${NC}"
echo ""

if docker build $NO_CACHE -f $DOCKERFILE -t ${IMAGE_NAME}:${TAG} .; then
  echo ""
  echo -e "${GREEN}✓ Docker image built successfully!${NC}"
else
  echo ""
  echo -e "${RED}✗ Docker build failed${NC}"
  exit 1
fi

# Get image size
IMAGE_SIZE=$(docker images ${IMAGE_NAME}:${TAG} --format "{{.Size}}")
echo -e "${BLUE}Image size: ${GREEN}${IMAGE_SIZE}${NC}"

# Tag as latest if not already
if [ "$TAG" != "latest" ]; then
  echo -e "${BLUE}Step 2: Tagging as latest...${NC}"
  docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest
  echo -e "${GREEN}✓ Tagged as ${IMAGE_NAME}:latest${NC}"
fi

# Print success message
echo ""
echo -e "${GREEN}==============================================================================${NC}"
echo -e "${GREEN}Build Complete!${NC}"
echo -e "${GREEN}==============================================================================${NC}"
echo ""
echo -e "${BLUE}Image:${NC} ${IMAGE_NAME}:${TAG}"
echo -e "${BLUE}Size:${NC} ${IMAGE_SIZE}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Test the image locally:"
echo -e "     ${BLUE}docker run -p 3000:3000 --env-file .env.production ${IMAGE_NAME}:${TAG}${NC}"
echo ""
echo -e "  2. Or use docker-compose:"
echo -e "     ${BLUE}docker-compose -f ../docker-compose.fullstack.yml up -d${NC}"
echo ""
echo -e "  3. Check health:"
echo -e "     ${BLUE}curl http://localhost:3000/api/health${NC}"
echo ""
echo -e "  4. View logs:"
echo -e "     ${BLUE}docker logs -f innerbright-fullstack${NC}"
echo ""

# Optional: Run image scan
read -p "Would you like to scan the image for vulnerabilities? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}Scanning image for vulnerabilities...${NC}"
  if command -v trivy &> /dev/null; then
    trivy image ${IMAGE_NAME}:${TAG}
  else
    echo -e "${YELLOW}Trivy not found. Install with: brew install trivy${NC}"
  fi
fi

echo ""
echo -e "${GREEN}✓ All done!${NC}"
