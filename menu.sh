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
    echo "  5) 🌐 Deploy to Production (Interactive)"
    echo "  6) 📋 View Production Logs"
    echo "  7) ⏹️  Stop Production Services"
    echo ""
    echo -e "${CYAN}📌 QUICK ACTIONS:${NC}"
    echo "  8) 🌟 Quick Start - Rausach Dev (localhost:12000-12001)"
    echo "  9) 🏢 Quick Start - Innerv2 Dev (localhost:13000-13001)"
    echo " 10) 🔥 Quick Start - Both Domains"
    echo ""
    echo -e "${CYAN}📌 UTILITIES:${NC}"
    echo " 11) 🔧 Install Dependencies"
    echo " 12) 🗄️  Database Studio"
    echo " 13) 📦 Clean Project"
    echo ""
    echo " 0) ❌ Exit"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    read -p "$(echo -e ${YELLOW}Lựa chọn của bạn [0-13]:${NC} )" choice
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
            echo "Chọn domain để xem logs:"
            echo "  1) Rausach"
            echo "  2) Innerv2"
            echo "  3) Multi-domain"
            read -p "Lựa chọn: " log_choice
            case $log_choice in
                1) docker-compose -f docker-compose.rausach.yml logs -f ;;
                2) docker-compose -f docker-compose.innerv2.yml logs -f ;;
                3) docker-compose -f docker-compose.multi-domain.yml logs -f ;;
                *) echo "Invalid choice" ;;
            esac
            read -p "Press Enter to continue..."
            clear
            ;;
        7)
            echo "Chọn domain để dừng:"
            echo "  1) Rausach"
            echo "  2) Innerv2"
            echo "  3) Multi-domain"
            echo "  4) All"
            read -p "Lựa chọn: " stop_choice
            case $stop_choice in
                1) docker-compose -f docker-compose.rausach.yml down ;;
                2) docker-compose -f docker-compose.innerv2.yml down ;;
                3) docker-compose -f docker-compose.multi-domain.yml down ;;
                4) 
                    docker-compose -f docker-compose.rausach.yml down
                    docker-compose -f docker-compose.innerv2.yml down
                    docker-compose -f docker-compose.multi-domain.yml down
                    ;;
                *) echo "Invalid choice" ;;
            esac
            read -p "Press Enter to continue..."
            clear
            ;;
        8)
            echo -e "${GREEN}🌟 Starting Rausach Development...${NC}"
            cp .env.dev.rausach backend/.env
            cp .env.dev.rausach frontend/.env.local
            echo "Backend: http://localhost:12001"
            echo "Frontend: http://localhost:12000"
            echo ""
            cd backend && PORT=12001 bun run dev &
            sleep 3
            cd ../frontend && bun run dev -- -p 12000 &
            cd ..
            read -p "Press Enter to continue..."
            clear
            ;;
        9)
            echo -e "${GREEN}🏢 Starting Innerv2 Development...${NC}"
            cp .env.dev.innerv2 backend/.env
            cp .env.dev.innerv2 frontend/.env.local
            echo "Backend: http://localhost:13001"
            echo "Frontend: http://localhost:13000"
            echo ""
            cd backend && PORT=13001 bun run dev &
            sleep 3
            cd ../frontend && bun run dev -- -p 13000 &
            cd ..
            read -p "Press Enter to continue..."
            clear
            ;;
        10)
            echo -e "${GREEN}🔥 Starting Both Domains...${NC}"
            ./dev-start.sh
            # Select option 3 (Both) automatically would require expect, so just call the script
            read -p "Press Enter to continue..."
            clear
            ;;
        11)
            echo -e "${YELLOW}📦 Installing dependencies...${NC}"
            bun install
            cd backend && bun install && cd ..
            cd frontend && bun install && cd ..
            echo -e "${GREEN}✅ Dependencies installed${NC}"
            read -p "Press Enter to continue..."
            clear
            ;;
        12)
            echo "Chọn database:"
            echo "  1) Rausach (12003)"
            echo "  2) Innerv2 (13003)"
            read -p "Lựa chọn: " db_choice
            case $db_choice in
                1) 
                    cp .env.dev.rausach backend/.env
                    cd backend && bun run db:studio
                    ;;
                2) 
                    cp .env.dev.innerv2 backend/.env
                    cd backend && bun run db:studio
                    ;;
                *) echo "Invalid choice" ;;
            esac
            read -p "Press Enter to continue..."
            clear
            ;;
        13)
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
