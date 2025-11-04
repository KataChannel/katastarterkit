#!/bin/bash

# ============================================================================
# QUICK DEPLOY TO REMOTE SERVER 116.118.48.208
# Uses rsync to copy local files (no git required)
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      DEPLOY LOCAL FILES TO REMOTE SERVER      ║${NC}"
echo -e "${BLUE}║           Server: 116.118.48.208              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📋 Prerequisites:${NC}"
echo "   ✓ rsync installed on local machine"
echo "   ✓ SSH access configured to server"
echo "   ✓ SSH key added to server (ssh-copy-id root@116.118.48.208)"
echo "   ✓ Docker and Docker Compose on server (auto-installed if missing)"
echo ""

echo -e "${BLUE}📦 What will be deployed:${NC}"
echo "   ✓ All local files (current directory)"
echo "   ✓ Excluding: .git, node_modules, .next, dist, logs, data"
echo "   ✓ Using rsync for fast incremental sync"
echo ""

echo -e "${YELLOW}⚙️  Configuration:${NC}"
echo "   Server IP:     116.118.48.208"
echo "   SSH User:      root"
echo "   SSH Port:      22"
echo "   Remote Path:   /opt/innerv2"
echo "   Method:        rsync (no git)"
echo ""

read -p "$(echo -e ${GREEN}Continue with deployment? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo -e "${GREEN}🚀 Starting deployment...${NC}"
echo ""

# Set environment variables
export SSH_USER="${SSH_USER:-root}"
export SSH_PORT="${SSH_PORT:-22}"

# Run the deployment script
./deploy-to-remote.sh

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📱 Next Steps:${NC}"
echo "   1. Check services: ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose -f docker-compose.build.yml ps'"
echo "   2. View logs:      ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose -f docker-compose.build.yml logs -f'"
echo "   3. Test frontend:  curl http://116.118.48.208:14000"
echo "   4. Test backend:   curl http://116.118.48.208:14001/health"
echo ""
