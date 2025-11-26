#!/bin/bash

# ============================================================================
# Stop Infrastructure or App Services
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER="root@116.118.49.243"
REMOTE_DIR="/root/shoprausach"

echo ""
echo "What do you want to stop?"
echo "  1. App Services only (Backend + Frontend)"
echo "  2. Infrastructure only (Postgres + Redis + Minio)"
echo "  3. Everything (App + Infrastructure)"
echo "  0. Cancel"
echo ""
read -p "Select [0-3]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🛑 Stopping App Services...${NC}"
        ssh $SERVER "cd $REMOTE_DIR && docker compose -f docker-compose.app.yml down"
        echo -e "${GREEN}✅ App services stopped${NC}"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🛑 Stopping Infrastructure...${NC}"
        echo -e "${RED}⚠️  Warning: This will affect all applications using these services!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            ssh $SERVER "cd $REMOTE_DIR && docker compose -f docker-compose.infra.yml down"
            echo -e "${GREEN}✅ Infrastructure stopped${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    3)
        echo ""
        echo -e "${YELLOW}🛑 Stopping Everything...${NC}"
        ssh $SERVER "cd $REMOTE_DIR && docker compose -f docker-compose.app.yml down && docker compose -f docker-compose.infra.yml down"
        echo -e "${GREEN}✅ All services stopped${NC}"
        ;;
    0)
        echo "Cancelled."
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        ;;
esac

echo ""
