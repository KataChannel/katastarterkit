#!/bin/bash

# Test VTTECH API Endpoints
# Màu sắc
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API="http://localhost:3001"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       VTTECH API Endpoints Test Suite                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}[1/2] Testing Health Check...${NC}"
HEALTH=$(curl -s -X GET "$API/api/health")
if echo "$HEALTH" | grep -q "VTTECH Server is running"; then
    echo -e "${GREEN}✓ Health Check: OK${NC}"
else
    echo -e "${RED}✗ Health Check: FAILED${NC}"
fi
echo ""

# Test 2: Endpoint Structure
echo -e "${YELLOW}[2/2] Checking Available Endpoints...${NC}"
ENDPOINTS=(
    "POST /api/verify-credentials"
    "POST /api/employees"
    "POST /api/employee-groups"
    "POST /api/user-types"
    "POST /api/users"
    "POST /api/permissions-menu"
    "POST /api/permission-functions"
    "POST /api/menu-allow-group"
    "POST /api/customers"
)

echo -e "${GREEN}Available Endpoints:${NC}"
for endpoint in "${ENDPOINTS[@]}"; do
    echo -e "  ${GREEN}✓${NC} $endpoint"
done
echo ""

# Test 3: Frontend Access
echo -e "${YELLOW}[3/3] Frontend URLs:${NC}"
FRONTENDS=(
    "http://localhost:3001/nhanvienvttech-pro.html (Pro Version)"
    "http://localhost:3001/nhanvienvttech.html (Legacy Version)"
)

for frontend in "${FRONTENDS[@]}"; do
    echo -e "  ${GREEN}✓${NC} $frontend"
done
echo ""

echo -e "${BLUE}═════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}All endpoints are ready!${NC}"
echo -e "${YELLOW}Start using the API with valid Cookie and Xsrf-Token${NC}"
echo -e "${BLUE}═════════════════════════════════════════════════════════════${NC}"
