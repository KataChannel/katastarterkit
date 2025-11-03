#!/bin/bash

# Multi-Domain Deployment Script
# Optimized for Cloud Server: 1 Core, 1GB RAM, 5GB Storage
# Supports: rausach.com (12xxx ports) + tazagroup.com (13xxx ports)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.multi-domain.yml"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Multi-Domain Deployment - Cloud Server (1C/1GB/5GB)      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to show menu
show_menu() {
    echo -e "${YELLOW}Chọn hành động:${NC}"
    echo "1) Khởi động tất cả services (cả 2 domain)"
    echo "2) Khởi động chỉ domain Rausach (12xxx)"
    echo "3) Khởi động chỉ domain Tazagroup (13xxx)"
    echo "4) Dừng tất cả services"
    echo "5) Dừng chỉ domain Rausach"
    echo "6) Dừng chỉ domain Tazagroup"
    echo "7) Xem logs tất cả services"
    echo "8) Xem logs domain Rausach"
    echo "9) Xem logs domain Tazagroup"
    echo "10) Xem trạng thái services"
    echo "11) Khởi động lại tất cả"
    echo "12) Build lại images"
    echo "13) Dọn dẹp volumes và rebuild"
    echo "0) Thoát"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Kiểm tra yêu cầu hệ thống...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker chưa được cài đặt!${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose chưa được cài đặt!${NC}"
        exit 1
    fi
    
    # Check env files
    if [ ! -f ".env.rausach" ]; then
        echo -e "${RED}❌ File .env.rausach không tồn tại!${NC}"
        exit 1
    fi
    
    if [ ! -f ".env.tazagroup" ]; then
        echo -e "${RED}❌ File .env.tazagroup không tồn tại!${NC}"
        exit 1
    fi
    
    # Check system resources
    TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
    if [ "$TOTAL_MEM" -lt 900 ]; then
        echo -e "${YELLOW}⚠️  Cảnh báo: RAM khả dụng thấp ($TOTAL_MEM MB < 1GB)${NC}"
        echo -e "${YELLOW}   Hệ thống có thể chạy chậm hoặc gặp lỗi OOM${NC}"
    fi
    
    echo -e "${GREEN}✅ Kiểm tra hoàn tất!${NC}"
    echo ""
}

# Start all services
start_all() {
    echo -e "${GREEN}🚀 Khởi động TẤT CẢ services (2 domains)...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d
    show_status
}

# Start only Rausach domain
start_rausach() {
    echo -e "${GREEN}🚀 Khởi động domain RAUSACH (12xxx)...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d postgres redis minio rausach-backend rausach-frontend
    show_status
}

# Start only Tazagroup domain
start_tazagroup() {
    echo -e "${GREEN}🚀 Khởi động domain TAZAGROUP (13xxx)...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d postgres redis minio tazagroup-backend tazagroup-frontend
    show_status
}

# Stop all services
stop_all() {
    echo -e "${YELLOW}🛑 Dừng TẤT CẢ services...${NC}"
    docker-compose -f "$COMPOSE_FILE" down
    echo -e "${GREEN}✅ Đã dừng tất cả services${NC}"
}

# Stop only Rausach domain
stop_rausach() {
    echo -e "${YELLOW}🛑 Dừng domain RAUSACH...${NC}"
    docker-compose -f "$COMPOSE_FILE" stop rausach-backend rausach-frontend
    echo -e "${GREEN}✅ Đã dừng domain Rausach${NC}"
}

# Stop only Tazagroup domain
stop_tazagroup() {
    echo -e "${YELLOW}🛑 Dừng domain TAZAGROUP...${NC}"
    docker-compose -f "$COMPOSE_FILE" stop tazagroup-backend tazagroup-frontend
    echo -e "${GREEN}✅ Đã dừng domain Tazagroup${NC}"
}

# View logs
view_logs_all() {
    echo -e "${BLUE}📋 Logs tất cả services...${NC}"
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100
}

view_logs_rausach() {
    echo -e "${BLUE}📋 Logs domain RAUSACH...${NC}"
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100 rausach-backend rausach-frontend
}

view_logs_tazagroup() {
    echo -e "${BLUE}📋 Logs domain TAZAGROUP...${NC}"
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100 tazagroup-backend tazagroup-frontend
}

# Show status
show_status() {
    echo ""
    echo -e "${BLUE}📊 Trạng thái services:${NC}"
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    # Show memory usage
    echo -e "${BLUE}💾 Sử dụng bộ nhớ:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" $(docker-compose -f "$COMPOSE_FILE" ps -q 2>/dev/null) 2>/dev/null || echo "Không có container nào đang chạy"
    echo ""
    
    # Show URLs
    echo -e "${GREEN}🌐 URLs truy cập:${NC}"
    echo -e "  ${YELLOW}Rausach:${NC}"
    echo -e "    - Frontend:  ${BLUE}http://116.118.49.243:12000${NC}"
    echo -e "    - Backend:   ${BLUE}http://116.118.49.243:12001/graphql${NC}"
    echo ""
    echo -e "  ${YELLOW}Tazagroup:${NC}"
    echo -e "    - Frontend:  ${BLUE}http://116.118.49.243:13000${NC}"
    echo -e "    - Backend:   ${BLUE}http://116.118.49.243:13001/graphql${NC}"
    echo ""
    echo -e "  ${YELLOW}Shared Services:${NC}"
    echo -e "    - Minio:     ${BLUE}http://116.118.49.243:12008${NC}"
    echo -e "    - PostgreSQL: ${BLUE}116.118.49.243:12003${NC}"
    echo ""
}

# Restart all
restart_all() {
    echo -e "${YELLOW}🔄 Khởi động lại tất cả services...${NC}"
    docker-compose -f "$COMPOSE_FILE" restart
    show_status
}

# Rebuild images
rebuild() {
    echo -e "${YELLOW}🔨 Build lại images...${NC}"
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    echo -e "${GREEN}✅ Build hoàn tất!${NC}"
}

# Clean and rebuild
clean_rebuild() {
    echo -e "${RED}🗑️  Dọn dẹp và build lại (volumes sẽ BỊ XÓA!)${NC}"
    read -p "Bạn có chắc chắn? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f "$COMPOSE_FILE" down -v
        docker system prune -f
        rebuild
        echo -e "${GREEN}✅ Dọn dẹp hoàn tất!${NC}"
    else
        echo -e "${YELLOW}Hủy bỏ.${NC}"
    fi
}

# Main script
main() {
    check_prerequisites
    
    while true; do
        show_menu
        read -p "Nhập lựa chọn: " choice
        echo ""
        
        case $choice in
            1) start_all ;;
            2) start_rausach ;;
            3) start_tazagroup ;;
            4) stop_all ;;
            5) stop_rausach ;;
            6) stop_tazagroup ;;
            7) view_logs_all ;;
            8) view_logs_rausach ;;
            9) view_logs_tazagroup ;;
            10) show_status ;;
            11) restart_all ;;
            12) rebuild ;;
            13) clean_rebuild ;;
            0) 
                echo -e "${GREEN}👋 Tạm biệt!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Lựa chọn không hợp lệ!${NC}"
                ;;
        esac
        
        echo ""
        read -p "Nhấn Enter để tiếp tục..."
        echo ""
    done
}

# Run main
main
