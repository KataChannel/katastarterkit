#!/bin/bash
# Test Invoice Import API Endpoints

echo "🧪 Testing Invoice Import API"
echo "=============================="
echo ""

# Configuration
BACKEND_URL="http://localhost:14000"
TOKEN="YOUR_TOKEN_HERE"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Template Download
echo "Test 1: Download Template"
echo "-------------------------"
response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" \
  "${BACKEND_URL}/api/invoice-import/template" \
  -o /tmp/test_template.xlsx)

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Template download: SUCCESS (HTTP $http_code)${NC}"
    file_type=$(file -b /tmp/test_template.xlsx)
    echo "  File type: $file_type"
    file_size=$(ls -lh /tmp/test_template.xlsx | awk '{print $5}')
    echo "  File size: $file_size"
else
    echo -e "${RED}✗ Template download: FAILED (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: Check Backend Health
echo "Test 2: Backend Health"
echo "---------------------"
response=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/health")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Backend is healthy (HTTP $http_code)${NC}"
else
    echo -e "${YELLOW}⚠ Backend health check: HTTP $http_code${NC}"
fi
echo ""

# Test 3: GraphQL Endpoint
echo "Test 3: GraphQL Endpoint"
echo "-----------------------"
response=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}')
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" == "200" ] || [ "$http_code" == "400" ]; then
    echo -e "${GREEN}✓ GraphQL endpoint is accessible (HTTP $http_code)${NC}"
else
    echo -e "${RED}✗ GraphQL endpoint: FAILED (HTTP $http_code)${NC}"
fi
echo ""

# Summary
echo "=============================="
echo "📊 Test Summary"
echo "=============================="
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Expected ports:"
echo "  - Backend: 14000"
echo "  - Frontend: 3000"
echo ""

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ All systems operational!${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check logs above.${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. Backend not running: cd backend && bun dev"
    echo "  2. Wrong token: Get fresh token from localStorage"
    echo "  3. Port mismatch: Check .env.local files"
fi

echo ""
echo "To get your token:"
echo "  1. Open browser DevTools (F12)"
echo "  2. Go to Application > Local Storage"
echo "  3. Copy value of 'accessToken'"
echo "  4. Replace YOUR_TOKEN_HERE in this script"
