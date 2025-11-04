#!/bin/bash

# ================================================================
# START REMOTE SERVICES ON SERVER
# ================================================================
# Script này dùng để bật các services cần thiết trên server
# 116.118.49.243 cho development và production
# ================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

SERVER="116.118.49.243"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🚀 START REMOTE SERVICES ON SERVER${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Server: $SERVER${NC}"
echo ""
echo -e "${YELLOW}Chọn services cần khởi động:${NC}"
echo ""
echo "  1) 📦 All Services (PostgreSQL + Redis + Minio)"
echo "  2) 🐘 PostgreSQL only (Rausach + Tazagroup)"
echo "  3) 🔴 Redis only"
echo "  4) 📁 Minio only"
echo "  5) 🌟 Rausach PostgreSQL only (port 12003)"
echo "  6) 🏢 Tazagroup PostgreSQL only (port 13003)"
echo "  7) 📊 Show running services"
echo "  8) ❌ Exit"
echo ""
read -p "Lựa chọn của bạn [1-8]: " choice

case $choice in
    1)
        SERVICES="postgres redis minio"
        SERVICE_NAME="All Services"
        ;;
    2)
        SERVICES="postgres"
        SERVICE_NAME="PostgreSQL (Rausach + Tazagroup)"
        ;;
    3)
        SERVICES="redis"
        SERVICE_NAME="Redis"
        ;;
    4)
        SERVICES="minio"
        SERVICE_NAME="Minio"
        ;;
    5)
        echo ""
        echo -e "${YELLOW}Note: This will start the Rausach PostgreSQL container${NC}"
        echo -e "${YELLOW}Configure docker-compose to run on specific port if needed${NC}"
        SERVICES="postgres"
        SERVICE_NAME="PostgreSQL (Rausach - port 12003)"
        ;;
    6)
        echo ""
        echo -e "${YELLOW}Note: This will start the Tazagroup PostgreSQL container${NC}"
        echo -e "${YELLOW}Configure docker-compose to run on specific port if needed${NC}"
        SERVICES="postgres"
        SERVICE_NAME="PostgreSQL (Tazagroup - port 13003)"
        ;;
    7)
        echo ""
        echo -e "${CYAN}Connecting to server...${NC}"
        echo ""
        echo -e "${YELLOW}Run on server:${NC}"
        echo "  docker-compose ps"
        echo ""
        ssh user@$SERVER "docker-compose ps" || echo -e "${RED}Failed to connect. Check SSH credentials.${NC}"
        exit 0
        ;;
    8)
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
echo -e "${GREEN}   📦 Starting: $SERVICE_NAME${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}📋 Commands that will be executed on server:${NC}"
echo ""
echo "  1. cd /path/to/project"
echo "  2. docker-compose up -d $SERVICES"
echo "  3. docker-compose ps"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Continue? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${RED}Cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}Connecting to $SERVER...${NC}"
echo ""

# SSH command to start services
ssh user@$SERVER << EOF
    echo "Connected to $SERVER"
    echo ""
    
    # Navigate to project directory (modify this path as needed)
    if [ -d "/home/user/shoprausach" ]; then
        cd /home/user/shoprausach
    elif [ -d "/opt/shoprausach" ]; then
        cd /opt/shoprausach
    elif [ -d "~/shoprausach" ]; then
        cd ~/shoprausach
    else
        echo "⚠️  Project directory not found. Please specify the correct path."
        echo "   Current directory: \$(pwd)"
        echo ""
        read -p "Enter project path: " project_path
        cd "\$project_path"
    fi
    
    echo "📂 Project directory: \$(pwd)"
    echo ""
    
    echo "🚀 Starting services: $SERVICES"
    docker-compose up -d $SERVICES
    
    echo ""
    echo "📊 Current status:"
    docker-compose ps
    
    echo ""
    echo "✅ Services started!"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   ✅ Services started successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}🧪 Test connection from local machine:${NC}"
    echo "   ./test-connection.sh"
    echo ""
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}   ❌ Failed to start services!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Please check:${NC}"
    echo "  1. SSH credentials"
    echo "  2. Project path on server"
    echo "  3. Docker compose file exists"
    echo ""
fi
