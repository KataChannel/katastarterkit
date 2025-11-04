#!/bin/bash

# ================================================================
# QUICK SWITCH ENVIRONMENT
# ================================================================
# Nhanh chóng chuyển đổi giữa các môi trường
# ================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🔄 QUICK ENVIRONMENT SWITCH${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1) Dev - Rausach      (localhost:12000-12001)"
echo "  2) Dev - Innerv2    (localhost:13000-13001)"
echo "  3) Prod - Rausach     (116.118.48.208:12000-12001)"
echo "  4) Prod - Innerv2   (116.118.48.208:13000-13001)"
echo ""
read -p "Chọn môi trường [1-4]: " choice

case $choice in
    1)
        cp .env.dev.rausach backend/.env
        cp .env.dev.rausach frontend/.env.local
        echo -e "${GREEN}✅ Switched to Dev - Rausach (localhost)${NC}"
        ;;
    2)
        cp .env.dev.innerv2 backend/.env
        cp .env.dev.innerv2 frontend/.env.local
        echo -e "${GREEN}✅ Switched to Dev - Innerv2 (localhost)${NC}"
        ;;
    3)
        cp .env.prod.rausach backend/.env
        cp .env.prod.rausach frontend/.env.local
        echo -e "${GREEN}✅ Switched to Prod - Rausach (server)${NC}"
        ;;
    4)
        cp .env.prod.innerv2 backend/.env
        cp .env.prod.innerv2 frontend/.env.local
        echo -e "${GREEN}✅ Switched to Prod - Innerv2 (server)${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}📋 Current backend/.env:${NC}"
head -5 backend/.env | grep -E "(NODE_ENV|PORT|FRONTEND_URL)"
echo ""
