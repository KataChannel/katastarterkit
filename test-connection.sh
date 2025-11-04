#!/bin/bash

# ================================================================
# TEST CONNECTION TO REMOTE SERVICES
# ================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🧪 TESTING REMOTE SERVICES CONNECTION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

SERVER="116.118.49.243"

# Function to test port
test_port() {
    local service=$1
    local port=$2
    local timeout=3
    
    echo -n "Testing $service ($SERVER:$port)... "
    
    if timeout $timeout bash -c "cat < /dev/null > /dev/tcp/$SERVER/$port" 2>/dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

echo -e "${YELLOW}📍 Testing Database Connections:${NC}"
test_port "Rausach PostgreSQL " 12003
test_port "Tazagroup PostgreSQL " 13003
echo ""

echo -e "${YELLOW}📍 Testing Shared Services:${NC}"
test_port "Redis              " 12004
test_port "Minio              " 12007
test_port "Minio Console      " 12008
echo ""

echo -e "${YELLOW}📍 Testing PgAdmin:${NC}"
test_port "PgAdmin Rausach    " 12002
test_port "PgAdmin Tazagroup  " 13002
echo ""

# PostgreSQL connection test (if psql is available)
if command -v psql &> /dev/null; then
    echo -e "${YELLOW}📍 Testing PostgreSQL Authentication:${NC}"
    
    echo -n "Rausach Database... "
    if PGPASSWORD=postgres psql -h $SERVER -p 12003 -U postgres -d rausachcore -c "SELECT 1;" &>/dev/null; then
        echo -e "${GREEN}✅ Connected${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
    fi
    
    echo -n "Tazagroup Database... "
    if PGPASSWORD=postgres psql -h $SERVER -p 13003 -U postgres -d tazagroupcore -c "SELECT 1;" &>/dev/null; then
        echo -e "${GREEN}✅ Connected${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
    fi
    echo ""
fi

# Redis connection test (if redis-cli is available)
if command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}📍 Testing Redis Connection:${NC}"
    echo -n "Redis PING... "
    if redis-cli -h $SERVER -p 12004 -a "123456" PING 2>/dev/null | grep -q PONG; then
        echo -e "${GREEN}✅ PONG${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
    fi
    echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ Connection test complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}💡 Tip:${NC} Nếu có lỗi kết nối, kiểm tra:"
echo "  1. Server $SERVER có đang chạy không?"
echo "  2. Firewall có block ports không?"
echo "  3. Database/Redis/Minio services có running không?"
echo ""
