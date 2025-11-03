#!/bin/bash

# Hybrid Multi-Domain Deployment Script
# Database riêng biệt, Redis & Minio shared
# Optimized for: 1-2 Core, 1.5GB RAM, 7GB Storage

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.hybrid.yml"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Hybrid Multi-Domain Deployment (1-2C/1.5GB/7GB)          ║${NC}"
echo -e "${BLUE}║  Database: Dedicated | Redis & Minio: Shared              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to show menu
show_menu() {
    echo -e "${YELLOW}Chọn hành động:${NC}"
    echo "1) Khởi động tất cả services (cả 2 domain)"
    echo "2) Khởi động chỉ domain Rausach"
    echo "3) Khởi động chỉ domain Tazagroup"
    echo "4) Khởi động chỉ shared services (Redis + Minio)"
    echo "5) Dừng tất cả services"
    echo "6) Dừng chỉ domain Rausach"
    echo "7) Dừng chỉ domain Tazagroup"
    echo "8) Xem logs tất cả"
    echo "9) Xem logs Rausach"
    echo "10) Xem logs Tazagroup"
    echo "11) Xem trạng thái và resource usage"
    echo "12) Restart tất cả"
    echo "13) Backup database Rausach"
    echo "14) Backup database Tazagroup"
    echo "15) Restore database Rausach"
    echo "16) Restore database Tazagroup"
    echo "17) Build lại images"
    echo "18) Dọn dẹp và rebuild"
    echo "0) Thoát"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Kiểm tra yêu cầu...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker chưa được cài đặt!${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose chưa được cài đặt!${NC}"
        exit 1
    fi
    
    if [ ! -f ".env.rausach" ]; then
        echo -e "${RED}❌ File .env.rausach không tồn tại!${NC}"
        exit 1
    fi
    
    if [ ! -f ".env.tazagroup" ]; then
        echo -e "${RED}❌ File .env.tazagroup không tồn tại!${NC}"
        exit 1
    fi
    
    TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
    if [ "$TOTAL_MEM" -lt 1400 ]; then
        echo -e "${YELLOW}⚠️  Cảnh báo: RAM thấp ($TOTAL_MEM MB < 1.5GB)${NC}"
        echo -e "${YELLOW}   Nên có swap file hoặc nâng cấp RAM${NC}"
    fi
    
    echo -e "${GREEN}✅ Kiểm tra hoàn tất!${NC}"
    echo ""
}

# Start all
start_all() {
    echo -e "${GREEN}🚀 Khởi động TẤT CẢ services...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d
    show_status
}

# Start only Rausach
start_rausach() {
    echo -e "${GREEN}🚀 Khởi động RAUSACH domain...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d redis minio rausach-postgres rausach-backend rausach-frontend
    show_status
}

# Start only Tazagroup
start_tazagroup() {
    echo -e "${GREEN}🚀 Khởi động TAZAGROUP domain...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d redis minio tazagroup-postgres tazagroup-backend tazagroup-frontend
    show_status
}

# Start shared services only
start_shared() {
    echo -e "${GREEN}🚀 Khởi động SHARED services (Redis + Minio)...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d redis minio
    show_status
}

# Stop all
stop_all() {
    echo -e "${YELLOW}🛑 Dừng TẤT CẢ services...${NC}"
    docker-compose -f "$COMPOSE_FILE" down
    echo -e "${GREEN}✅ Đã dừng tất cả${NC}"
}

# Stop Rausach
stop_rausach() {
    echo -e "${YELLOW}🛑 Dừng RAUSACH domain...${NC}"
    docker-compose -f "$COMPOSE_FILE" stop rausach-postgres rausach-backend rausach-frontend
    echo -e "${GREEN}✅ Đã dừng Rausach${NC}"
}

# Stop Tazagroup
stop_tazagroup() {
    echo -e "${YELLOW}🛑 Dừng TAZAGROUP domain...${NC}"
    docker-compose -f "$COMPOSE_FILE" stop tazagroup-postgres tazagroup-backend tazagroup-frontend
    echo -e "${GREEN}✅ Đã dừng Tazagroup${NC}"
}

# View logs
view_logs_all() {
    echo -e "${BLUE}📋 Logs tất cả...${NC}"
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100
}

view_logs_rausach() {
    echo -e "${BLUE}📋 Logs RAUSACH...${NC}"
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100 rausach-postgres rausach-backend rausach-frontend
}

view_logs_tazagroup() {
    echo -e "${BLUE}📋 Logs TAZAGROUP...${NC}"
    docker-compose -f "$COMPOSE_FILE" logs -f --tail=100 tazagroup-postgres tazagroup-backend tazagroup-frontend
}

# Show status
show_status() {
    echo ""
    echo -e "${BLUE}📊 Trạng thái services:${NC}"
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    echo -e "${BLUE}💾 Sử dụng tài nguyên:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" $(docker-compose -f "$COMPOSE_FILE" ps -q 2>/dev/null) 2>/dev/null || echo "Không có container nào"
    echo ""
    
    echo -e "${GREEN}🌐 URLs:${NC}"
    echo -e "  ${YELLOW}Rausach:${NC}"
    echo -e "    Frontend:  ${BLUE}http://116.118.49.243:12000${NC}"
    echo -e "    Backend:   ${BLUE}http://116.118.49.243:12001/graphql${NC}"
    echo -e "    Database:  ${BLUE}116.118.49.243:12003${NC}"
    echo ""
    echo -e "  ${YELLOW}Tazagroup:${NC}"
    echo -e "    Frontend:  ${BLUE}http://116.118.49.243:13000${NC}"
    echo -e "    Backend:   ${BLUE}http://116.118.49.243:13001/graphql${NC}"
    echo -e "    Database:  ${BLUE}116.118.49.243:13003${NC}"
    echo ""
    echo -e "  ${YELLOW}Shared:${NC}"
    echo -e "    Minio:     ${BLUE}http://116.118.49.243:12008${NC}"
    echo -e "    Redis:     ${BLUE}116.118.49.243:12004${NC}"
    echo ""
}

# Restart all
restart_all() {
    echo -e "${YELLOW}🔄 Restart tất cả...${NC}"
    docker-compose -f "$COMPOSE_FILE" restart
    show_status
}

# Backup
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

backup_rausach() {
    echo -e "${YELLOW}💾 Backup database Rausach...${NC}"
    mkdir -p "$BACKUP_DIR"
    docker exec rausach-postgres pg_dump -U postgres rausachcore > "$BACKUP_DIR/rausach_${DATE}.sql"
    echo -e "${GREEN}✅ Saved: $BACKUP_DIR/rausach_${DATE}.sql${NC}"
}

backup_tazagroup() {
    echo -e "${YELLOW}💾 Backup database Tazagroup...${NC}"
    mkdir -p "$BACKUP_DIR"
    docker exec tazagroup-postgres pg_dump -U postgres tazagroupcore > "$BACKUP_DIR/tazagroup_${DATE}.sql"
    echo -e "${GREEN}✅ Saved: $BACKUP_DIR/tazagroup_${DATE}.sql${NC}"
}

# Restore
restore_rausach() {
    echo -e "${YELLOW}📥 Restore database Rausach...${NC}"
    echo -e "${YELLOW}Available backups:${NC}"
    ls -lh "$BACKUP_DIR"/rausach_*.sql 2>/dev/null || echo "No backups found"
    echo ""
    read -p "Enter backup file path: " backup_file
    if [ -f "$backup_file" ]; then
        docker exec -i rausach-postgres psql -U postgres rausachcore < "$backup_file"
        echo -e "${GREEN}✅ Restore complete${NC}"
    else
        echo -e "${RED}❌ File not found${NC}"
    fi
}

restore_tazagroup() {
    echo -e "${YELLOW}📥 Restore database Tazagroup...${NC}"
    echo -e "${YELLOW}Available backups:${NC}"
    ls -lh "$BACKUP_DIR"/tazagroup_*.sql 2>/dev/null || echo "No backups found"
    echo ""
    read -p "Enter backup file path: " backup_file
    if [ -f "$backup_file" ]; then
        docker exec -i tazagroup-postgres psql -U postgres tazagroupcore < "$backup_file"
        echo -e "${GREEN}✅ Restore complete${NC}"
    else
        echo -e "${RED}❌ File not found${NC}"
    fi
}

# Rebuild
rebuild() {
    echo -e "${YELLOW}🔨 Build lại images...${NC}"
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    echo -e "${GREEN}✅ Build complete${NC}"
}

# Clean rebuild
clean_rebuild() {
    echo -e "${RED}🗑️  Dọn dẹp và rebuild (XÓA volumes!)${NC}"
    read -p "Chắc chắn? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f "$COMPOSE_FILE" down -v
        docker system prune -f
        rebuild
        echo -e "${GREEN}✅ Done${NC}"
    else
        echo -e "${YELLOW}Hủy${NC}"
    fi
}

# Main
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
            4) start_shared ;;
            5) stop_all ;;
            6) stop_rausach ;;
            7) stop_tazagroup ;;
            8) view_logs_all ;;
            9) view_logs_rausach ;;
            10) view_logs_tazagroup ;;
            11) show_status ;;
            12) restart_all ;;
            13) backup_rausach ;;
            14) backup_tazagroup ;;
            15) restore_rausach ;;
            16) restore_tazagroup ;;
            17) rebuild ;;
            18) clean_rebuild ;;
            0) 
                echo -e "${GREEN}👋 Bye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter..."
        echo ""
    done
}

main
