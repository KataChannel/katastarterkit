#!/bin/bash

# Test Affiliate Click Tracking Endpoint
# This script tests the complete click tracking flow

set -e

BASE_URL="http://localhost:14000"
TEST_TRACKING_CODE="test-tracking-123"

echo "🧪 Testing Affiliate Click Tracking Endpoint"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET $BASE_URL/track/health"
HEALTH_RESPONSE=$(curl -s "$BASE_URL/track/health")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
  echo -e "${GREEN}✅ Health check passed${NC}"
  echo "Response: $HEALTH_RESPONSE"
else
  echo -e "${RED}❌ Health check failed${NC}"
  echo "Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Create test affiliate link first (via GraphQL)
echo -e "${YELLOW}Test 2: Creating Test Affiliate Link${NC}"
echo "Creating link via GraphQL mutation..."

# First, get auth token (assuming you have a test user)
# You'll need to replace this with actual authentication
AUTH_TOKEN="your-jwt-token-here"

CREATE_LINK_MUTATION='
mutation {
  createAffiliateLink(input: {
    campaignId: "your-campaign-id"
    utmSource: "test"
    utmMedium: "script"
  }) {
    id
    trackingCode
    originalUrl
  }
}
'

echo "Note: You need to manually create a link first or provide a valid tracking code"
echo ""

# Test 3: Test click tracking with invalid code
echo -e "${YELLOW}Test 3: Click Tracking - Invalid Code${NC}"
echo "GET $BASE_URL/track/click/INVALID-CODE"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/track/click/INVALID-CODE")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)

if [ "$HTTP_CODE" = "404" ]; then
  echo -e "${GREEN}✅ Correctly returned 404 for invalid code${NC}"
else
  echo -e "${RED}❌ Expected 404, got $HTTP_CODE${NC}"
fi
echo ""

# Test 4: Test click tracking with valid code (if you have one)
echo -e "${YELLOW}Test 4: Click Tracking - Valid Code (Manual Test)${NC}"
echo ""
echo "To test with a valid tracking code:"
echo "1. Create an affiliate campaign in the UI"
echo "2. Approve an affiliate to join"
echo "3. Generate an affiliate link"
echo "4. Run this command:"
echo ""
echo -e "${GREEN}curl -i -L http://localhost:14000/track/click/YOUR_TRACKING_CODE${NC}"
echo ""
echo "Expected behavior:"
echo "  - Should return 302 redirect"
echo "  - Should set cookie: aff_ref=YOUR_TRACKING_CODE"
echo "  - Should redirect to product URL"
echo "  - Should record click in database"
echo ""

# Test 5: Test with user agent and referer
echo -e "${YELLOW}Test 5: Click Tracking with Headers${NC}"
echo "Testing with custom User-Agent and Referer headers..."
echo ""
echo "Command:"
echo "curl -i -L \\"
echo "  -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7 like Mac OS X)' \\"
echo "  -H 'Referer: https://google.com' \\"
echo "  http://localhost:14000/track/click/YOUR_TRACKING_CODE"
echo ""

# Test 6: Test cookie persistence
echo -e "${YELLOW}Test 6: Cookie Persistence Test${NC}"
echo "Testing cookie is set and persists..."
echo ""
echo "Commands:"
echo "# 1. Click affiliate link and save cookies"
echo "curl -c cookies.txt -L http://localhost:14000/track/click/YOUR_TRACKING_CODE"
echo ""
echo "# 2. Check cookie file"
echo "cat cookies.txt"
echo ""
echo "# 3. Make a request with the cookie"
echo "curl -b cookies.txt http://localhost:14000/api/some-endpoint"
echo ""

# Test 7: Database verification
echo -e "${YELLOW}Test 7: Database Verification${NC}"
echo "After clicking a link, verify in database:"
echo ""
echo "psql -h localhost -U postgres -d katacore -c \\"
echo "  'SELECT id, \"linkId\", \"ipAddress\", device, browser, \"clickedAt\" FROM \"AffClick\" ORDER BY \"clickedAt\" DESC LIMIT 5;'"
echo ""

# Summary
echo "=============================================="
echo -e "${GREEN}🎉 Test Script Complete${NC}"
echo ""
echo "Next Steps:"
echo "1. Create an affiliate campaign"
echo "2. Approve an affiliate"
echo "3. Generate an affiliate link"
echo "4. Get the tracking code from the link"
echo "5. Test with: curl -i -L http://localhost:14000/track/click/TRACKING_CODE"
echo ""
echo "Expected Flow:"
echo "  Click Link → Set Cookie → Redirect → Track Click → Update Stats"
echo ""

# Bonus: Quick integration test if tracking code is provided
if [ ! -z "$1" ]; then
  echo ""
  echo -e "${YELLOW}Running live test with tracking code: $1${NC}"
  echo ""
  
  # Save cookies to file
  COOKIE_FILE=$(mktemp)
  
  echo "Clicking affiliate link..."
  RESPONSE=$(curl -s -i -c "$COOKIE_FILE" -L "$BASE_URL/track/click/$1")
  
  echo "Response Headers:"
  echo "$RESPONSE" | head -20
  echo ""
  
  echo "Cookies saved:"
  cat "$COOKIE_FILE"
  echo ""
  
  # Check if aff_ref cookie was set
  if grep -q "aff_ref" "$COOKIE_FILE"; then
    echo -e "${GREEN}✅ Cookie 'aff_ref' was set successfully!${NC}"
  else
    echo -e "${RED}❌ Cookie 'aff_ref' was NOT set${NC}"
  fi
  
  # Cleanup
  rm "$COOKIE_FILE"
fi

echo ""
echo "Run with tracking code: ./test-click-tracking.sh YOUR_TRACKING_CODE"
