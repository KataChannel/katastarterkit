#!/bin/bash

# ================================================================
# TEST CONNECTION TO REMOTE SERVICES
# ================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🧪 TESTING REMOTE SERVICES CONNECTION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

SERVER="116.118.49.243"
FAILED=0

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
        FAILED=$((FAILED + 1))
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
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}   ✅ All services are available!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}🎉 Ready for development and deployment!${NC}"
else
    echo -e "${RED}   ❌ $FAILED service(s) failed!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Some services are not available!${NC}"
    echo ""
    echo -e "${CYAN}To fix this issue:${NC}"
    echo ""
    echo "  1. SSH to server:"
    echo -e "     ${CYAN}ssh user@$SERVER${NC}"
    echo ""
    echo "  2. Navigate to project directory and start services:"
    echo -e "     ${CYAN}cd /path/to/project${NC}"
    echo -e "     ${CYAN}docker-compose up -d postgres redis minio${NC}"
    echo ""
    echo "  3. Verify services are running:"
    echo -e "     ${CYAN}docker-compose ps${NC}"
    echo ""
    echo "  4. Run this test again:"
    echo -e "     ${CYAN}./test-connection.sh${NC}"
    echo ""
    exit 1
fi
echo ""
echo -e "${YELLOW}💡 Tip:${NC} Nếu có lỗi kết nối, kiểm tra:"
echo "  1. Server $SERVER có đang chạy không?"
echo "  2. Firewall có block ports không?"
echo "  3. Database/Redis/Minio services có running không?"
echo ""
