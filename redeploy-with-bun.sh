#!/bin/bash

# ============================================================================
# Stop Current Build and Redeploy with Bun (Fast Mode)
# Use this if current deployment is stuck/hanging
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVER_IP="116.118.48.208"
SERVER_USER="${SSH_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
PROJECT_DIR="/opt/innerv2"

echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║     STOP CURRENT BUILD & REDEPLOY             ║${NC}"
echo -e "${RED}║     Using Bun for Super Fast Build            ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}⚠️  This will:${NC}"
echo "   1. Stop all running containers on server"
echo "   2. Kill any ongoing Docker builds"
echo "   3. Clean up build cache"
echo "   4. Redeploy with Bun (3-5x faster)"
echo ""

read -p "$(echo -e ${RED}Continue? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}[1/4] Stopping containers on server...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml down --remove-orphans 2>/dev/null || true"
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

echo -e "${BLUE}[2/4] Killing ongoing builds...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "docker ps -q --filter 'status=running' | xargs -r docker stop 2>/dev/null || true"
echo -e "${GREEN}✓ Builds killed${NC}"
echo ""

echo -e "${BLUE}[3/4] Cleaning build cache...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "docker builder prune -af 2>/dev/null || true"
echo -e "${GREEN}✓ Cache cleaned${NC}"
echo ""

echo -e "${BLUE}[4/4] Redeploying with Bun (Fast Mode)...${NC}"
echo -e "${YELLOW}This will use Bun for both backend and frontend${NC}"
echo -e "${YELLOW}Expected time: 3-5 minutes total${NC}"
echo ""

./deploy-remote-quick.sh

echo ""
echo -e "${GREEN}✅ Redeployment completed!${NC}"
