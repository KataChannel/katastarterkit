#!/bin/bash

# Test script for INVOICE_BEARER_TOKEN bug fix
# This script verifies that the auto-fetch-details bug is fixed

echo "🧪 Testing INVOICE_BEARER_TOKEN Bug Fix"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "1. Checking backend status..."
HEALTH_CHECK=$(curl -s http://localhost:14000/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Please start backend: cd backend && bun dev"
    exit 1
fi

echo ""
echo "2. Testing invoice sync without INVOICE_BEARER_TOKEN..."
echo ""

# Test data
TEST_DATA='{
  "invoiceData": [{
    "id": "test-'$(date +%s)'",
    "nbmst": "0123456789",
    "khmshdon": "1C20AAA",
    "khhdon": "AA",
    "shdon": "0000001",
    "tdlap": "2025-01-01T00:00:00Z",
    "tgtttbso": 1000000,
    "thdon": "Hóa đơn bán hàng",
    "tthai": "Đã ký"
  }],
  "detailsData": []
}'

# Get JWT token (you may need to replace this with actual login)
echo "Getting JWT token..."
JWT_TOKEN="your-jwt-token-here"

# Test without INVOICE_BEARER_TOKEN
echo "Testing POST /api/invoices/sync..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:14000/api/invoices/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d "${TEST_DATA}" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo ""
echo "Response Code: $HTTP_CODE"
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Check result
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✓ TEST PASSED: API works without INVOICE_BEARER_TOKEN${NC}"
    echo -e "${GREEN}✓ Bug is FIXED - No crash when token is missing${NC}"
    
    # Check if response contains error about token
    if echo "$BODY" | grep -q "INVOICE_BEARER_TOKEN"; then
        echo -e "${RED}✗ Warning: Response still mentions INVOICE_BEARER_TOKEN${NC}"
    else
        echo -e "${GREEN}✓ No token-related errors in response${NC}"
    fi
elif [ "$HTTP_CODE" = "401" ]; then
    echo -e "${YELLOW}⚠ Authentication failed (401)${NC}"
    echo "This is expected if JWT token is invalid"
    echo "Please update JWT_TOKEN in this script with a valid token"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${RED}✗ TEST FAILED: Still getting 500 error${NC}"
    if echo "$BODY" | grep -q "INVOICE_BEARER_TOKEN"; then
        echo -e "${RED}✗ Bug NOT fixed - Still crashing on missing token${NC}"
    else
        echo -e "${YELLOW}⚠ Different error - check response above${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Unexpected response code: $HTTP_CODE${NC}"
fi

echo ""
echo "3. Checking backend logs for warnings..."
echo ""

# Check logs
LOG_DIR="/chikiet/kataoffical/fullstack/tazagroupcore/backend/logs"
if [ -d "$LOG_DIR" ]; then
    LATEST_LOG=$(ls -t "$LOG_DIR"/app-*.log 2>/dev/null | head -1)
    if [ -f "$LATEST_LOG" ]; then
        echo "Latest log: $LATEST_LOG"
        echo ""
        echo "Recent entries:"
        tail -20 "$LATEST_LOG" | grep -E "INVOICE|Bearer|token|auto-fetch" || echo "No relevant log entries"
    else
        echo "No log files found"
    fi
else
    echo "Log directory not found: $LOG_DIR"
fi

echo ""
echo "========================================="
echo "Test completed!"
echo ""
echo "Expected behavior with fix:"
echo "  ✓ No crash (no 500 error)"
echo "  ✓ Warning logged instead of error"
echo "  ✓ Invoice saved without details"
echo "  ✓ Graceful degradation"
echo ""
echo "To enable auto-fetch, set INVOICE_BEARER_TOKEN in .env:"
echo "  INVOICE_BEARER_TOKEN=your_token_here"
echo ""
