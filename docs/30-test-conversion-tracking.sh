#!/bin/bash

# Test Affiliate Conversion Tracking
# This script demonstrates the complete flow from click to conversion

set -e

BASE_URL="http://localhost:14000"
GRAPHQL_URL="$BASE_URL/graphql"

echo "🎯 Testing Affiliate Conversion Tracking"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if tracking code is provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: ./test-conversion-tracking.sh TRACKING_CODE [ORDER_ID] [AMOUNT]${NC}"
  echo ""
  echo "Example: ./test-conversion-tracking.sh abc123def456 ORDER-001 1000000"
  echo ""
  echo "To test the complete flow:"
  echo "1. Create a campaign and get tracking code"
  echo "2. Run: ./test-conversion-tracking.sh YOUR_TRACKING_CODE"
  exit 1
fi

TRACKING_CODE="$1"
ORDER_ID="${2:-ORDER-$(date +%s)}" # Generate order ID if not provided
AMOUNT="${3:-1000000}" # 1,000,000 VND default

echo -e "${BLUE}Configuration:${NC}"
echo "Tracking Code: $TRACKING_CODE"
echo "Order ID: $ORDER_ID"
echo "Amount: $AMOUNT VND"
echo ""

# ============================================
# STEP 1: Simulate Click
# ============================================
echo -e "${YELLOW}Step 1: Simulate Affiliate Click${NC}"
echo "Clicking affiliate link to set cookie..."

COOKIE_FILE=$(mktemp)
CLICK_RESPONSE=$(curl -s -i -c "$COOKIE_FILE" -L "$BASE_URL/track/click/$TRACKING_CODE" 2>&1)

# Check if cookie was set
if grep -q "aff_ref" "$COOKIE_FILE"; then
  echo -e "${GREEN}✅ Cookie set successfully${NC}"
  echo "Cookie details:"
  cat "$COOKIE_FILE" | grep "aff_ref"
else
  echo -e "${RED}❌ Cookie not set - check if tracking code is valid${NC}"
  echo "Response:"
  echo "$CLICK_RESPONSE"
  rm "$COOKIE_FILE"
  exit 1
fi
echo ""

# ============================================
# STEP 2: Wait (simulate browsing)
# ============================================
echo -e "${YELLOW}Step 2: Simulate Browsing${NC}"
echo "Waiting 2 seconds (simulating customer browsing)..."
sleep 2
echo -e "${GREEN}✅ Customer browsed the site${NC}"
echo ""

# ============================================
# STEP 3: Simulate Purchase
# ============================================
echo -e "${YELLOW}Step 3: Simulate Purchase (Conversion)${NC}"
echo "Sending purchase request with affiliate cookie..."

# Create a test endpoint call (you'll need to implement this in your app)
# For now, we'll just show the concept
echo ""
echo -e "${BLUE}Integration Example:${NC}"
echo "In your order/invoice service, add this code:"
echo ""
cat <<'EOF'
import { trackAffiliateConversion } from '../utils/affiliate-helper';

async function completeOrder(orderId: string, amount: number, req: Request) {
  // Your order completion logic...
  
  // Track affiliate conversion
  const result = await trackAffiliateConversion({
    orderId,
    saleAmount: amount,
    request: req,
    customerEmail: 'customer@example.com',
  });
  
  if (result.success) {
    console.log(`Affiliate commission: ${result.commission} VND`);
  }
}
EOF
echo ""

# ============================================
# STEP 4: Manual Testing with GraphQL
# ============================================
echo -e "${YELLOW}Step 4: Verify in Database${NC}"
echo "Checking conversions in database..."
echo ""

# Query to check clicks
echo "Recent clicks:"
echo "psql -d tazagroupcore -c \"SELECT id, \\\"linkId\\\", \\\"ipAddress\\\", device, browser, \\\"clickedAt\\\" FROM \\\"AffClick\\\" ORDER BY \\\"clickedAt\\\" DESC LIMIT 5;\""
echo ""

# Query to check conversions
echo "Recent conversions:"
echo "psql -d tazagroupcore -c \"SELECT id, \\\"orderId\\\", \\\"saleAmount\\\", commission, status, \\\"convertedAt\\\" FROM \\\"AffConversion\\\" ORDER BY \\\"convertedAt\\\" DESC LIMIT 5;\""
echo ""

# ============================================
# STEP 5: Approve/Reject Conversion
# ============================================
echo -e "${YELLOW}Step 5: Approve/Reject Conversion (GraphQL)${NC}"
echo ""
echo "To approve a conversion:"
cat <<'EOF'
mutation {
  approveConversion(id: "CONVERSION_ID")
}
EOF
echo ""

echo "To reject a conversion:"
cat <<'EOF'
mutation {
  rejectConversion(id: "CONVERSION_ID", reason: "Fraudulent order")
}
EOF
echo ""

# ============================================
# STEP 6: Clean up
# ============================================
echo -e "${YELLOW}Step 6: Cleanup${NC}"
rm "$COOKIE_FILE"
echo -e "${GREEN}✅ Temporary files cleaned${NC}"
echo ""

# ============================================
# Summary
# ============================================
echo "=========================================="
echo -e "${GREEN}🎉 Test Flow Complete${NC}"
echo ""
echo "Complete Affiliate Flow:"
echo "1. ✅ Click affiliate link"
echo "2. ✅ Cookie set (aff_ref=$TRACKING_CODE, 30 days)"
echo "3. ✅ Customer browsed site"
echo "4. ⏳ Customer completes purchase (implement integration)"
echo "5. ⏳ Conversion tracked in database"
echo "6. ⏳ Merchant approves/rejects"
echo "7. ⏳ Affiliate receives commission"
echo ""

echo "Integration Points:"
echo ""
echo "1. ${BLUE}In Order/Invoice Service:${NC}"
echo "   Add conversion tracking after order completion"
echo ""
echo "2. ${BLUE}In GraphQL Resolver:${NC}"
echo "   Track conversion when mutation completes"
echo ""
echo "3. ${BLUE}In REST Endpoint:${NC}"
echo "   Extract cookie and track conversion"
echo ""

echo "Database Queries:"
echo ""
echo "# Check clicks"
echo "SELECT * FROM \"AffClick\" WHERE \"linkId\" IN (SELECT id FROM \"AffLink\" WHERE \"trackingCode\" = '$TRACKING_CODE') ORDER BY \"clickedAt\" DESC;"
echo ""
echo "# Check conversions"
echo "SELECT * FROM \"AffConversion\" WHERE \"orderId\" = '$ORDER_ID';"
echo ""
echo "# Check campaign stats"
echo "SELECT \"totalClicks\", \"totalConversions\", \"totalRevenue\", \"totalCommission\" FROM \"AffCampaign\" WHERE id IN (SELECT \"campaignId\" FROM \"AffLink\" WHERE \"trackingCode\" = '$TRACKING_CODE');"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo "1. Integrate trackAffiliateConversion() into your order completion code"
echo "2. Test with real purchase"
echo "3. Verify conversion in database"
echo "4. Approve conversion via GraphQL"
echo "5. Check affiliate earnings updated"
echo ""
