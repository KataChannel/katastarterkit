#!/bin/bash

# ================================================================
# MASTER MENU - Central control for all operations
# ================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function to check remote service
check_service_quick() {
    local service=$1
    local host=$2
    local port=$3
    local timeout=2
    
    if timeout $timeout bash -c "cat < /dev/null > /dev/tcp/$host/$port" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to quick check services for a domain
quick_check_services() {
    local domain=$1
    local server="116.118.49.243"
    local failed=0
    
    echo -e "${YELLOW}🔍 Quick check: Remote services...${NC}"
    
    if [ "$domain" == "rausach" ]; then
        check_service_quick "PostgreSQL" "$server" "12003" || failed=1
    elif [ "$domain" == "tazagroup" ]; then
        check_service_quick "PostgreSQL" "$server" "13003" || failed=1
    elif [ "$domain" == "both" ]; then
        check_service_quick "PostgreSQL Rausach" "$server" "12003" || failed=1
        check_service_quick "PostgreSQL Tazagroup" "$server" "13003" || failed=1
    fi
    
    check_service_quick "Redis" "$server" "12004" || failed=1
    check_service_quick "Minio" "$server" "12007" || failed=1
    
    if [ $failed -eq 1 ]; then
        echo -e "${RED}⚠️  Some services are not available!${NC}"
        echo -e "${YELLOW}Run './test-connection.sh' for details${NC}"
        echo ""
        read -p "Continue anyway? (y/N): " continue_choice
        if [[ ! "$continue_choice" =~ ^[Yy]$ ]]; then
            echo -e "${RED}Cancelled.${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ All services OK${NC}"
    fi
    echo ""
    return 0
}

clear

while true; do
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   🎯 MULTI-DOMAIN DEVELOPMENT MENU${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}📌 DEVELOPMENT (Localhost):${NC}"
    echo "  1) 🚀 Start Development (Interactive)"
    echo "  2) 🛑 Stop All Development Services"
    echo "  3) 🔄 Switch Environment"
    echo "  4) 📊 Check Status"
    echo ""
    echo -e "${CYAN}📌 PRODUCTION (Server):${NC}"
    echo "  5) 🌐 Deploy to Production (Local Docker)"
    echo "  6) 🚀 Deploy to Remote Server (116.118.49.243)"
    echo "  7) 📋 View Production Logs"
    echo "  8) ⏹️  Stop Production Services"
    echo ""
    echo -e "${CYAN}📌 QUICK ACTIONS:${NC}"
    echo "  9) 🌟 Quick Start - Rausach Dev (localhost:12000-12001)"
    echo " 10) 🏢 Quick Start - Tazagroup Dev (localhost:13000-13001)"
    echo " 11) 🔥 Quick Start - Both Domains"
    echo ""
    echo -e "${CYAN}📌 UTILITIES:${NC}"
    echo " 12) 🧪 Test Remote Connections"
    echo " 13) 🚀 Start Server Services"
    echo " 14) 🔧 Install Dependencies"
    echo " 15) 🗄️  Database Studio"
    echo " 16) 📦 Clean Project"
    echo ""
    echo " 0) ❌ Exit"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    read -p "$(echo -e ${YELLOW}Lựa chọn của bạn [0-16]:${NC} )" choice
    echo ""
    
    case $choice in
        1)
            ./dev-start.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        2)
            ./dev-stop.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        3)
            ./switch-env.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        4)
            ./status.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        5)
            ./prod-deploy.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        6)
            echo -e "${GREEN}🚀 Deploy to Remote Server...${NC}"
            ./remote-deploy.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        7)
            echo "Chọn domain để xem logs:"
            echo "  1) Rausach"
            echo "  2) Tazagroup"
            echo "  3) Multi-domain"
            read -p "Lựa chọn: " log_choice
            case $log_choice in
                1) docker-compose -f docker-compose.rausach.yml logs -f ;;
                2) docker-compose -f docker-compose.tazagroup.yml logs -f ;;
                3) docker-compose -f docker-compose.multi-domain.yml logs -f ;;
                *) echo "Invalid choice" ;;
            esac
            read -p "Press Enter to continue..."
            clear
            ;;
        8)
            echo "Chọn domain để dừng:"
            echo "  1) Rausach"
            echo "  2) Tazagroup"
            echo "  3) Multi-domain"
            echo "  4) All"
            read -p "Lựa chọn: " stop_choice
            case $stop_choice in
                1) docker-compose -f docker-compose.rausach.yml down ;;
                2) docker-compose -f docker-compose.tazagroup.yml down ;;
                3) docker-compose -f docker-compose.multi-domain.yml down ;;
                4) 
                    docker-compose -f docker-compose.rausach.yml down
                    docker-compose -f docker-compose.tazagroup.yml down
                    docker-compose -f docker-compose.multi-domain.yml down
                    ;;
                *) echo "Invalid choice" ;;
            esac
            read -p "Press Enter to continue..."
            clear
            ;;
        9)
            echo -e "${GREEN}🌟 Starting Rausach Development...${NC}"
            echo ""
            
            # Quick check services
            if ! quick_check_services "rausach"; then
                read -p "Press Enter to continue..."
                clear
                continue
            fi
            
            cp .env.dev.rausach backend/.env
            cp .env.dev.rausach frontend/.env.local
            echo -e "${CYAN}Backend:  http://localhost:12001${NC}"
            echo -e "${CYAN}Frontend: http://localhost:12000${NC}"
            echo ""
            echo -e "${YELLOW}Starting services...${NC}"
            cd backend && PORT=12001 bun run dev > ../dev-rausach-backend.log 2>&1 &
            BACKEND_PID=$!
            sleep 3
            cd ../frontend && bun run dev -- -p 12000 > ../dev-rausach-frontend.log 2>&1 &
            FRONTEND_PID=$!
            cd ..
            echo -e "${GREEN}✅ Started!${NC}"
            echo -e "${YELLOW}Backend PID: $BACKEND_PID${NC}"
            echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"
            echo ""
            echo -e "${CYAN}Logs:${NC}"
            echo "  tail -f dev-rausach-backend.log"
            echo "  tail -f dev-rausach-frontend.log"
            echo ""
            read -p "Press Enter to continue..."
            clear
            ;;
        10)
            echo -e "${GREEN}🏢 Starting Tazagroup Development...${NC}"
            echo ""
            
            # Quick check services
            if ! quick_check_services "tazagroup"; then
                read -p "Press Enter to continue..."
                clear
                continue
            fi
            
            cp .env.dev.tazagroup backend/.env
            cp .env.dev.tazagroup frontend/.env.local
            echo -e "${CYAN}Backend:  http://localhost:13001${NC}"
            echo -e "${CYAN}Frontend: http://localhost:13000${NC}"
            echo ""
            echo -e "${YELLOW}Starting services...${NC}"
            cd backend && PORT=13001 bun run dev > ../dev-tazagroup-backend.log 2>&1 &
            BACKEND_PID=$!
            sleep 3
            cd ../frontend && bun run dev -- -p 13000 > ../dev-tazagroup-frontend.log 2>&1 &
            FRONTEND_PID=$!
            cd ..
            echo -e "${GREEN}✅ Started!${NC}"
            echo -e "${YELLOW}Backend PID: $BACKEND_PID${NC}"
            echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"
            echo ""
            echo -e "${CYAN}Logs:${NC}"
            echo "  tail -f dev-tazagroup-backend.log"
            echo "  tail -f dev-tazagroup-frontend.log"
            echo ""
            read -p "Press Enter to continue..."
            clear
            ;;
        11)
            echo -e "${GREEN}🔥 Starting Both Domains...${NC}"
            echo ""
            
            # Quick check services
            if ! quick_check_services "both"; then
                read -p "Press Enter to continue..."
                clear
                continue
            fi
            
            ./dev-start.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        12)
            echo -e "${GREEN}🧪 Testing Remote Connections...${NC}"
            ./test-connection.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        13)
            echo -e "${GREEN}🚀 Start Server Services...${NC}"
            ./start-server-services.sh
            read -p "Press Enter to continue..."
            clear
            ;;
        14)
            echo -e "${YELLOW}📦 Installing dependencies...${NC}"
            bun install
            cd backend && bun install && cd ..
            cd frontend && bun install && cd ..
            echo -e "${GREEN}✅ Dependencies installed${NC}"
            read -p "Press Enter to continue..."
            clear
            ;;
        15)
            echo "Chọn database:"
            echo "  1) Rausach (12003)"
            echo "  2) Tazagroup (13003)"
            read -p "Lựa chọn: " db_choice
            case $db_choice in
                1) 
                    cp .env.dev.rausach backend/.env
                    cd backend && bun run db:studio
                    ;;
                2) 
                    cp .env.dev.tazagroup backend/.env
                    cd backend && bun run db:studio
                    ;;
                *) echo "Invalid choice" ;;
            esac
            read -p "Press Enter to continue..."
            clear
            ;;
        16)
            echo -e "${RED}⚠️  This will remove all node_modules and lock files${NC}"
            read -p "Are you sure? [y/N]: " confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}Cleaning...${NC}"
                rm -rf node_modules backend/node_modules frontend/node_modules
                rm -f bun.lockb backend/bun.lockb frontend/bun.lockb
                echo -e "${GREEN}✅ Project cleaned${NC}"
            fi
            read -p "Press Enter to continue..."
            clear
            ;;
        0)
            echo -e "${YELLOW}Goodbye! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Lựa chọn không hợp lệ!${NC}"
            sleep 1
            clear
            ;;
    esac
done
