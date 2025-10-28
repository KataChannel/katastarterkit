#!/bin/bash
# Test API Error Handling & Bug Fixes

echo "=========================================="
echo "API Error Handling & Bug Fix Test Suite"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
API_URL="http://localhost:14000/graphql"
FRONTEND_URL="http://localhost:3000"

echo -e "${BLUE}ℹ️  Configuration:${NC}"
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# ============================================================================
# Test 1: Check if GetPageBySlug query works with non-existent slug
# ============================================================================
echo -e "${YELLOW}Test 1: GetPageBySlug with non-existent slug${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetPageBySlug($slug: String!) { getPageBySlug(slug: $slug) { id title slug } }",
    "variables": { "slug": "/website" }
  }')

echo "Request: GetPageBySlug with slug='/website'"
echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "not found"; then
  echo -e "${GREEN}✅ PASS: Error message correctly returned${NC}"
else
  echo -e "${RED}❌ FAIL: Error message not found${NC}"
fi
echo ""

# ============================================================================
# Test 2: Check if GetPageBySlug query works with valid page
# ============================================================================
echo -e "${YELLOW}Test 2: GetPageBySlug with valid page slug${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetPageBySlug($slug: String!) { getPageBySlug(slug: $slug) { id title slug status } }",
    "variables": { "slug": "website/about-us" }
  }')

echo "Request: GetPageBySlug with slug='website/about-us'"
echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "\"id\""; then
  echo -e "${GREEN}✅ PASS: Valid page returned${NC}"
elif echo "$RESPONSE" | grep -q "not found"; then
  echo -e "${YELLOW}⚠️  WARNING: Valid test page doesn't exist in database${NC}"
else
  echo -e "${RED}❌ FAIL: Unexpected response${NC}"
fi
echo ""

# ============================================================================
# Test 3: Check BlogListPage GraphQL query
# ============================================================================
echo -e "${YELLOW}Test 3: BlogListPage query (GetBlogs)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetBlogs($page: Int, $limit: Int) { blogs(page: $page, limit: $limit) { total pageSize } }",
    "variables": { "page": 1, "limit": 12 }
  }')

echo "Request: GetBlogs with page=1, limit=12"
echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "\"total\""; then
  echo -e "${GREEN}✅ PASS: Blogs query works${NC}"
else
  echo -e "${RED}❌ FAIL: Blogs query failed${NC}"
fi
echo ""

# ============================================================================
# Test 4: Check Apollo Client error handling
# ============================================================================
echo -e "${YELLOW}Test 4: Apollo Client Error Logging${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "ℹ️  To test error logging:"
echo "1. Open browser console (F12)"
echo "2. Navigate to $FRONTEND_URL/website/non-existent-page"
echo "3. Check console for error messages like:"
echo "   - [API Error] or [apolloClient]"
echo "   - 🔍 Resource not found..."
echo "4. Verify error banner shows on page"
echo ""

# ============================================================================
# Test 5: Check reserved routes
# ============================================================================
echo -e "${YELLOW}Test 5: Reserved Routes Handling${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "ℹ️  To test reserved routes (should NOT call GetPageBySlug):"
echo "1. Open browser console (F12)"
echo "2. Navigate to $FRONTEND_URL/website/baiviet"
echo "3. Verify: NO 'GetPageBySlug' query with slug='website/baiviet'"
echo "4. Verify: BlogListPage component renders instead"
echo ""

echo "Reserved routes that should be excluded:"
echo "  - /website/baiviet (Blog listing)"
echo "  - /website/sanpham (Product listing)"
echo "  - /website/website (Should not exist)"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo -e "${BLUE}=========================================="
echo "Test Summary"
echo "==========================================${NC}"
echo ""
echo "Tests to verify in browser console:"
echo "1. ✓ Error messages logged with details"
echo "2. ✓ 'not found' errors include operation + variables"
echo "3. ✓ Reserved routes don't trigger GetPageBySlug"
echo "4. ✓ Error banner displayed with retry button"
echo ""
echo "Manual verification:"
echo "- Visit /website/baiviet → Should load blog list"
echo "- Visit /website/[invalid-slug] → Should show error banner"
echo "- Browser console should show: [API Error] or [apolloClient]"
echo ""
