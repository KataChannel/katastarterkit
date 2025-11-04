#!/bin/bash

# ================================================================
# STATUS CHECKER - Check all services status
# ================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   📊 SYSTEM STATUS CHECK${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to check port
check_port() {
    local port=$1
    local name=$2
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${GREEN}✅ $name (Port $port) - Running (PID: $pid)${NC}"
        return 0
    else
        echo -e "${RED}❌ $name (Port $port) - Not running${NC}"
        return 1
    fi
}

# Function to check remote service
check_remote() {
    local host=$1
    local port=$2
    local name=$3
    if timeout 2 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; then
        echo -e "${GREEN}✅ $name ($host:$port) - Accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $name ($host:$port) - Not accessible${NC}"
        return 1
    fi
}

echo -e "${YELLOW}🔍 LOCAL DEVELOPMENT SERVICES:${NC}"
echo ""

# Check local dev ports
check_port 12000 "Rausach Frontend"
check_port 12001 "Rausach Backend"
check_port 13000 "Tazagroup Frontend"
check_port 13001 "Tazagroup Backend"

echo ""
echo -e "${YELLOW}🌐 REMOTE SERVICES (116.118.49.243):${NC}"
echo ""

# Check remote services
check_remote "116.118.49.243" 12003 "PostgreSQL Rausach"
check_remote "116.118.49.243" 13003 "PostgreSQL Tazagroup"
check_remote "116.118.49.243" 12004 "Redis"
check_remote "116.118.49.243" 12007 "Minio"

echo ""
echo -e "${YELLOW}🐳 DOCKER CONTAINERS:${NC}"
echo ""

# Check Docker containers
if command -v docker &> /dev/null; then
    # Check Rausach containers
    if docker ps --format '{{.Names}}' | grep -q "rausach"; then
        echo -e "${GREEN}✅ Rausach containers running:${NC}"
        docker ps --filter "name=rausach" --format "   - {{.Names}} ({{.Status}})"
    else
        echo -e "${RED}❌ No Rausach containers running${NC}"
    fi
    
    # Check Tazagroup containers
    if docker ps --format '{{.Names}}' | grep -q "tazagroup"; then
        echo -e "${GREEN}✅ Tazagroup containers running:${NC}"
        docker ps --filter "name=tazagroup" --format "   - {{.Names}} ({{.Status}})"
    else
        echo -e "${RED}❌ No Tazagroup containers running${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker not installed or not running${NC}"
fi

echo ""
echo -e "${YELLOW}📂 CURRENT ENVIRONMENT:${NC}"
echo ""

# Check current environment
if [ -f "backend/.env" ]; then
    echo -e "${BLUE}Backend .env:${NC}"
    grep -E "^(NODE_ENV|PORT|FRONTEND_URL|DATABASE_URL)" backend/.env | head -4 | sed 's/^/   /'
else
    echo -e "${RED}   ❌ backend/.env not found${NC}"
fi

echo ""

if [ -f "frontend/.env.local" ]; then
    echo -e "${BLUE}Frontend .env.local:${NC}"
    grep -E "^(NODE_ENV|NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_GRAPHQL_ENDPOINT)" frontend/.env.local | head -3 | sed 's/^/   /'
else
    echo -e "${RED}   ❌ frontend/.env.local not found${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
