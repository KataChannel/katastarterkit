#!/bin/bash

# ================================================================
# CONNECTION TEST - Test connectivity to remote services
# ================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   🔌 CONNECTION TEST - Remote Services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

SERVER="116.118.48.208"

# Test network connectivity
echo -e "${YELLOW}1️⃣  Testing network connectivity to $SERVER...${NC}"
if ping -c 1 -W 2 $SERVER &> /dev/null; then
    echo -e "   ${GREEN}✅ Server is reachable${NC}"
else
    echo -e "   ${RED}❌ Cannot reach server${NC}"
    exit 1
fi
echo ""

# Test PostgreSQL Rausach
echo -e "${YELLOW}2️⃣  Testing PostgreSQL Rausach (Port 12003)...${NC}"
if timeout 2 bash -c "echo > /dev/tcp/$SERVER/12003" 2>/dev/null; then
    echo -e "   ${GREEN}✅ PostgreSQL Rausach is accessible${NC}"
else
    echo -e "   ${RED}❌ PostgreSQL Rausach is not accessible${NC}"
fi

# Test PostgreSQL Innerv2
echo -e "${YELLOW}3️⃣  Testing PostgreSQL Innerv2 (Port 13003)...${NC}"
if timeout 2 bash -c "echo > /dev/tcp/$SERVER/13003" 2>/dev/null; then
    echo -e "   ${GREEN}✅ PostgreSQL Innerv2 is accessible${NC}"
else
    echo -e "   ${RED}❌ PostgreSQL Innerv2 is not accessible${NC}"
fi

# Test Redis
echo -e "${YELLOW}4️⃣  Testing Redis (Port 12004)...${NC}"
if timeout 2 bash -c "echo > /dev/tcp/$SERVER/12004" 2>/dev/null; then
    echo -e "   ${GREEN}✅ Redis is accessible${NC}"
else
    echo -e "   ${RED}❌ Redis is not accessible${NC}"
fi

# Test Minio
echo -e "${YELLOW}5️⃣  Testing Minio (Port 12007)...${NC}"
if timeout 2 bash -c "echo > /dev/tcp/$SERVER/12007" 2>/dev/null; then
    echo -e "   ${GREEN}✅ Minio is accessible${NC}"
else
    echo -e "   ${RED}❌ Minio is not accessible${NC}"
fi

# Test Minio Console
echo -e "${YELLOW}6️⃣  Testing Minio Console (Port 12008)...${NC}"
if timeout 2 bash -c "echo > /dev/tcp/$SERVER/12008" 2>/dev/null; then
    echo -e "   ${GREEN}✅ Minio Console is accessible${NC}"
else
    echo -e "   ${RED}❌ Minio Console is not accessible${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ Connection test completed!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Service URLs:${NC}"
echo -e "   PostgreSQL Rausach:   ${GREEN}$SERVER:12003${NC}"
echo -e "   PostgreSQL Innerv2: ${GREEN}$SERVER:13003${NC}"
echo -e "   Redis:                ${GREEN}$SERVER:12004${NC}"
echo -e "   Minio API:            ${GREEN}http://$SERVER:12007${NC}"
echo -e "   Minio Console:        ${GREEN}http://$SERVER:12008${NC}"
echo ""
