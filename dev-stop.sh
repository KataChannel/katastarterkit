#!/bin/bash

# ================================================================
# STOP DEVELOPMENT SERVICES
# ================================================================
# Dừng tất cả các services đang chạy ở chế độ development
# ================================================================

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Dừng tất cả Development services...${NC}"
echo ""

# Kill all node/bun processes on dev ports
echo -e "${YELLOW}Tìm và dừng processes trên các ports...${NC}"

# Function to kill process on port
kill_port() {
    local port=$1
    local name=$2
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "  ${RED}Killing ${name} on port ${port} (PID: ${pid})${NC}"
        kill -9 $pid 2>/dev/null
    else
        echo -e "  ${GREEN}No process on port ${port}${NC}"
    fi
}

# Kill all dev ports
kill_port 12000 "Rausach Frontend"
kill_port 12001 "Rausach Backend"
kill_port 13000 "Innerv2 Frontend"
kill_port 13001 "Innerv2 Backend"

# Also kill any remaining bun/node dev processes
echo ""
echo -e "${YELLOW}Dừng các bun dev processes còn lại...${NC}"
pkill -f "bun.*dev" 2>/dev/null && echo -e "  ${RED}Killed bun dev processes${NC}" || echo -e "  ${GREEN}No bun dev processes${NC}"

echo ""
echo -e "${GREEN}✅ Tất cả Development services đã dừng!${NC}"
echo ""

# Clean up log files (optional)
read -p "Xóa log files? [y/N]: " cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    rm -f dev-*.log
    echo -e "${GREEN}✅ Log files đã được xóa${NC}"
fi

echo ""
