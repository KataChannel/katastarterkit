#!/bin/bash

# ============================================
# Deploy to Production with Environment Variables
# ============================================

set -e  # Exit on error

echo "🚀 Production Deployment Script"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production not found!${NC}"
    echo ""
    echo "Please create .env.production file with your production secrets:"
    echo ""
    echo "cat > .env.production << 'EOF'"
    echo "GOOGLE_GEMINI_API_KEY=your-actual-key"
    echo "OPENAI_API_KEY=sk-your-key"
    echo "INVOICE_BEARER_TOKEN=your-token"
    echo "EOF"
    echo ""
    echo "chmod 600 .env.production"
    exit 1
fi

echo -e "${GREEN}✅ Found .env.production${NC}"

# Load .env.production
set -a
source .env.production
set +a

echo -e "${GREEN}✅ Loaded environment variables${NC}"

# Check required variables
REQUIRED_VARS=(
    "GOOGLE_GEMINI_API_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

echo -e "${GREEN}✅ All required variables are set${NC}"

# Pull latest code
echo ""
echo "📥 Pulling latest code..."
git pull origin main || {
    echo -e "${YELLOW}⚠️  Git pull failed or no changes${NC}"
}

# Stop existing containers
echo ""
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.hybrid.yml down

# Build and start services
echo ""
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.hybrid.yml up -d --build

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.hybrid.yml ps

# Verify environment variables in container
echo ""
echo "🔍 Verifying environment variables in shopbackend..."
if docker exec shopbackend env | grep -q "GOOGLE_GEMINI_API_KEY"; then
    echo -e "${GREEN}✅ GOOGLE_GEMINI_API_KEY is set in container${NC}"
else
    echo -e "${RED}❌ GOOGLE_GEMINI_API_KEY is NOT set in container${NC}"
    exit 1
fi

# Show logs
echo ""
echo "📋 Recent logs from shopbackend:"
docker logs shopbackend --tail 20

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Services are running at:"
echo "  - Frontend: http://116.118.49.243:12000"
echo "  - Backend:  http://116.118.49.243:12001"
echo ""
echo "To view logs:"
echo "  docker logs shopbackend -f"
echo "  docker logs shopfrontend -f"
