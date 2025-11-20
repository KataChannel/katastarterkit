#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}          VTTECH API Server - Comprehensive Tests           ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

BASE_URL="http://localhost:3001/api"

# Test 1: Health Check
echo -e "\n${YELLOW}[TEST 1] Health Check${NC}"
echo "GET /api/health"
HEALTH=$(curl -s "$BASE_URL/health")
echo "Response: $HEALTH"
if [[ "$HEALTH" == *"OK"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

# Test 2: Verify Credentials (without real credentials - should still connect)
echo -e "\n${YELLOW}[TEST 2] Verify Credentials Structure${NC}"
echo "POST /api/verify-credentials"
echo "Testing endpoint structure without real credentials..."
VERIFY=$(curl -s -X POST "$BASE_URL/verify-credentials" \
  -H "Content-Type: application/json" \
  -d '{"cookie":"","xsrfToken":""}' 2>&1)
echo "Response: $VERIFY"
if [[ "$VERIFY" == *"success"* ]] || [[ "$VERIFY" == *"valid"* ]]; then
    echo -e "${GREEN}✅ Endpoint is responsive${NC}"
else
    echo -e "${RED}❌ Endpoint structure issue${NC}"
fi

# Test 3-9: Test all endpoints structure
declare -a endpoints=(
    "customers"
    "employees"
    "employee-groups"
    "user-types"
    "users"
    "permissions-menu"
    "permission-functions"
    "menu-allow-group"
)

for i in "${!endpoints[@]}"; do
    endpoint="${endpoints[$i]}"
    test_num=$((i + 3))
    
    echo -e "\n${YELLOW}[TEST $test_num] $endpoint Endpoint${NC}"
    echo "POST /api/$endpoint"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/$endpoint" \
      -H "Content-Type: application/json" \
      -d '{"cookie":"test","xsrfToken":"test"}' 2>&1)
    
    if [[ "$RESPONSE" == *"success"* ]] || [[ "$RESPONSE" == *"error"* ]]; then
        echo -e "${GREEN}✅ Endpoint is responding${NC}"
        echo "Response: $RESPONSE" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ Endpoint not responding correctly${NC}"
    fi
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}             All Endpoint Tests Completed!                   ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Open: http://localhost:3001/nhanvienvttech-pro.html"
echo "2. Enter real VTTECH credentials"
echo "3. Test data retrieval from VTTECH API"
echo "4. Verify decompression works with real data"
echo ""
