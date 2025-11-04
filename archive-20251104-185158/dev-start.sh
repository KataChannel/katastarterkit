#!/bin/bash

# ================================================================
# DEVELOPMENT MODE - LOCAL DEVELOPMENT SCRIPT
# ================================================================
# Khởi động project ở chế độ development
# - Frontend & Backend chạy trên localhost (12000-12001 hoặc 13000-13001)
# - Database, Redis, Minio sử dụng từ server 116.118.49.243
# ================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check remote service
check_service() {
    local service=$1
    local host=$2
    local port=$3
    local timeout=3
    
    if timeout $timeout bash -c "cat < /dev/null > /dev/tcp/$host/$port" 2>/dev/null; then
        echo -e "${GREEN}✅ $service${NC}"
        return 0
    else
        echo -e "${RED}❌ $service${NC}"
        return 1
    fi
}

# Function to check all remote services
check_remote_services() {
    local domain=$1
    local failed=0
    
    echo -e "${YELLOW}🔍 Checking remote services on 116.118.49.243...${NC}"
    echo ""
    
    if [ "$domain" == "rausach" ] || [ "$domain" == "both" ]; then
        check_service "PostgreSQL Rausach (12003)" "116.118.49.243" "12003" || failed=1
    fi
    
    if [ "$domain" == "tazagroup" ] || [ "$domain" == "both" ]; then
        check_service "PostgreSQL Tazagroup (13003)" "116.118.49.243" "13003" || failed=1
    fi
    
    check_service "Redis (12004)" "116.118.49.243" "12004" || failed=1
    check_service "Minio (12007)" "116.118.49.243" "12007" || failed=1
    
    echo ""
    
    if [ $failed -eq 1 ]; then
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}⚠️  WARNING: Some services are not available!${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${YELLOW}Please make sure services are running on server 116.118.49.243:${NC}"
        echo ""
        echo "  SSH to server:"
        echo "    ssh root@116.118.49.243"
        echo ""
        echo "  Start services:"
        echo "    docker-compose up -d postgres redis minio"
        echo ""
        read -p "Continue anyway? (y/N): " continue_choice
        if [[ ! "$continue_choice" =~ ^[Yy]$ ]]; then
            echo -e "${RED}Aborted.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ All remote services are available!${NC}"
    fi
    echo ""
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🚀 DEVELOPMENT MODE - LOCALHOST${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Chọn domain để khởi động:${NC}"
echo ""
echo "  1) 🌟 Rausach    (localhost:12000 + localhost:12001)"
echo "  2) 🏢 Tazagroup  (localhost:13000 + localhost:13001)"
echo "  3) 🔥 Both       (Cả 2 domain)"
echo "  4) ❌ Exit"
echo ""
read -p "Lựa chọn của bạn [1-4]: " choice

case $choice in
    1)
        DOMAIN="rausach"
        FRONTEND_PORT=12000
        BACKEND_PORT=12001
        # Check remote services
        check_remote_services "rausach"
        ;;
    2)
        DOMAIN="tazagroup"
        FRONTEND_PORT=13000
        BACKEND_PORT=13001
        # Check remote services
        check_remote_services "tazagroup"
        ;;
    3)
        echo -e "${YELLOW}⚙️  Khởi động cả 2 domain...${NC}"
        
        # Check remote services for both domains
        check_remote_services "both"
        
        # Copy env files
        cp .env.dev.rausach backend/.env
        cp .env.dev.rausach frontend/.env.local
        
        # Start Rausach
        echo -e "${GREEN}Starting Rausach backend on port 12001...${NC}"
        cd backend && PORT=12001 bun run dev > ../dev-rausach-backend.log 2>&1 &
        RAUSACH_BACKEND_PID=$!
        cd ..
        
        sleep 3
        
        echo -e "${GREEN}Starting Rausach frontend on port 12000...${NC}"
        cd frontend && bun run dev -- -p 12000 > ../dev-rausach-frontend.log 2>&1 &
        RAUSACH_FRONTEND_PID=$!
        cd ..
        
        # Copy env for Tazagroup
        cp .env.dev.tazagroup backend/.env
        cp .env.dev.tazagroup frontend/.env.local
        
        sleep 2
        
        # Start Tazagroup
        echo -e "${GREEN}Starting Tazagroup backend on port 13001...${NC}"
        cd backend && PORT=13001 bun run dev > ../dev-tazagroup-backend.log 2>&1 &
        TAZAGROUP_BACKEND_PID=$!
        cd ..
        
        sleep 3
        
        echo -e "${GREEN}Starting Tazagroup frontend on port 13000...${NC}"
        cd frontend && bun run dev -- -p 13000 > ../dev-tazagroup-frontend.log 2>&1 &
        TAZAGROUP_FRONTEND_PID=$!
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Tất cả services đã khởi động!${NC}"
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}📍 RAUSACH:${NC}"
        echo -e "   Frontend:  ${GREEN}http://localhost:12000${NC}"
        echo -e "   Backend:   ${GREEN}http://localhost:12001/graphql${NC}"
        echo -e "   Database:  ${GREEN}116.118.49.243:12003${NC} (rausachcore)"
        echo ""
        echo -e "${YELLOW}📍 TAZAGROUP:${NC}"
        echo -e "   Frontend:  ${GREEN}http://localhost:13000${NC}"
        echo -e "   Backend:   ${GREEN}http://localhost:13001/graphql${NC}"
        echo -e "   Database:  ${GREEN}116.118.49.243:13003${NC} (tazagroupcore)"
        echo ""
        echo -e "${YELLOW}📍 SHARED SERVICES (Remote):${NC}"
        echo -e "   Redis:     ${GREEN}116.118.49.243:12004${NC}"
        echo -e "   Minio:     ${GREEN}116.118.49.243:12007${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${YELLOW}📝 Process IDs:${NC}"
        echo "   Rausach Backend PID: $RAUSACH_BACKEND_PID"
        echo "   Rausach Frontend PID: $RAUSACH_FRONTEND_PID"
        echo "   Tazagroup Backend PID: $TAZAGROUP_BACKEND_PID"
        echo "   Tazagroup Frontend PID: $TAZAGROUP_FRONTEND_PID"
        echo ""
        echo -e "${YELLOW}📋 Logs:${NC}"
        echo "   tail -f dev-rausach-backend.log"
        echo "   tail -f dev-rausach-frontend.log"
        echo "   tail -f dev-tazagroup-backend.log"
        echo "   tail -f dev-tazagroup-frontend.log"
        echo ""
        echo -e "${RED}⚠️  Để dừng: ./dev-stop.sh${NC}"
        exit 0
        ;;
    4)
        echo -e "${YELLOW}Thoát...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Lựa chọn không hợp lệ!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   📦 Chuẩn bị môi trường ${DOMAIN}...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Copy environment files
echo -e "${YELLOW}⚙️  Copy environment files...${NC}"
cp .env.dev.${DOMAIN} backend/.env
cp .env.dev.${DOMAIN} frontend/.env.local

echo -e "${GREEN}✅ Environment files đã được cập nhật${NC}"
echo ""

# Start backend
echo -e "${YELLOW}🔧 Khởi động Backend (Port: ${BACKEND_PORT})...${NC}"
cd backend
bun run dev > ../dev-${DOMAIN}-backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✅ Backend đang chạy (PID: ${BACKEND_PID})${NC}"
sleep 3

# Start frontend
echo -e "${YELLOW}🎨 Khởi động Frontend (Port: ${FRONTEND_PORT})...${NC}"
cd frontend
bun run dev -- -p ${FRONTEND_PORT} > ../dev-${DOMAIN}-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✅ Frontend đang chạy (PID: ${FRONTEND_PID})${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ ${DOMAIN^^} DEVELOPMENT MODE STARTED!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📍 URLs:${NC}"
echo -e "   Frontend:  ${GREEN}http://localhost:${FRONTEND_PORT}${NC}"
echo -e "   Backend:   ${GREEN}http://localhost:${BACKEND_PORT}/graphql${NC}"
echo ""
echo -e "${YELLOW}📍 Remote Services:${NC}"
echo -e "   Database:  ${GREEN}116.118.49.243${NC}"
echo -e "   Redis:     ${GREEN}116.118.49.243:12004${NC}"
echo -e "   Minio:     ${GREEN}116.118.49.243:12007${NC}"
echo ""
echo -e "${YELLOW}📝 Process IDs:${NC}"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}📋 View logs:${NC}"
echo "   Backend:  tail -f dev-${DOMAIN}-backend.log"
echo "   Frontend: tail -f dev-${DOMAIN}-frontend.log"
echo ""
echo -e "${RED}⚠️  Để dừng các services: ./dev-stop.sh${NC}"
echo ""
