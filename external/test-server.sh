#!/bin/bash

# Test VTTECH Server
echo "🧪 Testing VTTECH API Server..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Health check
echo -e "${YELLOW}1️⃣  Testing Health Check...${NC}"
curl -s http://localhost:3001/api/health | jq . 2>/dev/null || echo "Error: Server not responding"
echo ""

# Test 2: Verify credentials (will fail without real credentials)
echo -e "${YELLOW}2️⃣  Testing Verify Credentials (this will fail without real creds)...${NC}"
curl -s -X POST http://localhost:3001/api/verify-credentials \
  -H "Content-Type: application/json" \
  -d '{
    "cookie": "test",
    "xsrfToken": "test"
  }' | jq . 2>/dev/null || echo "Error"
echo ""

# Test 3: Fetch customers (will fail without real credentials)
echo -e "${YELLOW}3️⃣  Testing Fetch Customers (this will fail without real creds)...${NC}"
curl -s -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "cookie": "test",
    "xsrfToken": "test"
  }' | jq . 2>/dev/null || echo "Error"
echo ""

# Test 4: Test 404
echo -e "${YELLOW}4️⃣  Testing 404 Handler...${NC}"
curl -s http://localhost:3001/api/notfound | jq . 2>/dev/null || echo "Error"
echo ""

echo -e "${GREEN}✅ Tests completed!${NC}"
echo ""
echo -e "${YELLOW}📋 To test with real credentials:${NC}"
echo "1. Open: http://localhost:3001/nhanvienvttech.html"
echo "2. Get Cookie & Xsrf-Token from VTTECH"
echo "3. Paste into the form"
echo "4. Click 'Xác thực' to verify"
