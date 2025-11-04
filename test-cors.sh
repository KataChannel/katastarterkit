#!/bin/bash

# Test CORS for Tazagroup domains

echo "🔍 Testing CORS Configuration"
echo "=============================="
echo ""

# Test 1: app.tazagroup.vn → appapi.tazagroup.vn
echo "1️⃣  Test: https://app.tazagroup.vn → https://appapi.tazagroup.vn"
echo "-------------------------------------------------------------------"
curl -I -X OPTIONS https://appapi.tazagroup.vn/graphql \
  -H "Origin: https://app.tazagroup.vn" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" 2>/dev/null | grep -E "Access-Control|HTTP/"

echo ""

# Test 2: app.tazagroup.com → appapi.tazagroup.vn
echo "2️⃣  Test: https://app.tazagroup.com → https://appapi.tazagroup.vn"
echo "-------------------------------------------------------------------"
curl -I -X OPTIONS https://appapi.tazagroup.vn/graphql \
  -H "Origin: https://app.tazagroup.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" 2>/dev/null | grep -E "Access-Control|HTTP/"

echo ""

# Test 3: Direct backend access (no origin)
echo "3️⃣  Test: Direct access to backend"
echo "-------------------------------------------------------------------"
curl -I https://appapi.tazagroup.vn/graphql 2>/dev/null | grep -E "HTTP/|Server"

echo ""

# Test 4: GraphQL query from app.tazagroup.vn
echo "4️⃣  Test: GraphQL query from app.tazagroup.vn"
echo "-------------------------------------------------------------------"
curl -X POST https://appapi.tazagroup.vn/graphql \
  -H "Origin: https://app.tazagroup.vn" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}' 2>/dev/null | head -5

echo ""
echo "✅ CORS test completed!"
echo ""
echo "Expected headers:"
echo "  - Access-Control-Allow-Origin: https://app.tazagroup.vn"
echo "  - Access-Control-Allow-Credentials: true"
echo "  - Access-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS"
