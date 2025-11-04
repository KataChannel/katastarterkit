#!/bin/bash

# ============================================================================
# Auto Fix & Redeploy - Fix config file paths and redeploy
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

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AUTO FIX & REDEPLOY                        ║${NC}"
echo -e "${BLUE}║     Fix config paths and deploy                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}[1/5] Syncing fixed Dockerfile to server...${NC}"
rsync -avz --progress \
    frontend/Dockerfile.build.fast \
    docker-compose.build.fast.yml \
    $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

echo -e "${GREEN}✓ Files synced${NC}"
echo ""

echo -e "${YELLOW}[2/5] Stopping existing containers...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml down 2>/dev/null || true"
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

echo -e "${YELLOW}[3/5] Cleaning build cache...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "docker builder prune -f 2>/dev/null || true"
echo -e "${GREEN}✓ Cache cleaned${NC}"
echo ""

echo -e "${YELLOW}[4/5] Building images...${NC}"
echo -e "${BLUE}This may take 3-5 minutes with Bun...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml build"
echo -e "${GREEN}✓ Images built${NC}"
echo ""

echo -e "${YELLOW}[5/5] Starting services...${NC}"
ssh -p $SSH_PORT $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker compose -f docker-compose.build.fast.yml up -d"
echo -e "${GREEN}✓ Services started${NC}"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         DEPLOYMENT SUCCESSFUL!                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📱 Access URLs:${NC}"
echo -e "   Frontend:  ${GREEN}http://116.118.48.208:14000${NC}"
echo -e "   Backend:   ${GREEN}http://116.118.48.208:14001${NC}"
echo -e "   GraphQL:   ${GREEN}http://116.118.48.208:14001/graphql${NC}"
echo ""

echo -e "${BLUE}🔧 Check status:${NC}"
echo -e "   ${YELLOW}./check-status.sh${NC}"
echo ""

echo -e "${BLUE}📊 View logs:${NC}"
echo -e "   ${YELLOW}ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose -f docker-compose.build.fast.yml logs -f'${NC}"
echo ""
