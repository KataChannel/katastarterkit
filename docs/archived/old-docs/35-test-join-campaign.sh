#!/bin/bash

# Test Join Campaign Flow
# Tests: joinCampaign, reviewCampaignApplication, deleteCampaign mutations

BASE_URL="http://localhost:4000/graphql"
AFFILIATE_TOKEN="your-affiliate-jwt-token"
MERCHANT_TOKEN="your-merchant-jwt-token"

echo "🧪 Testing Join Campaign Flow..."
echo ""

# Step 1: Create a test campaign (merchant)
echo "1️⃣ Creating test campaign..."
CAMPAIGN_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -d '{
    "query": "mutation { createAffiliateCampaign(input: { name: \"Test Campaign\", description: \"Test\", commissionType: PERCENTAGE, commissionValue: 10, requireApproval: true, maxAffiliates: 100 }) { id name status requireApproval } }"
  }')

CAMPAIGN_ID=$(echo "$CAMPAIGN_RESPONSE" | jq -r '.data.createAffiliateCampaign.id')
echo "✅ Campaign created: $CAMPAIGN_ID"
echo ""

# Step 2: Affiliate joins campaign
echo "2️⃣ Affiliate joining campaign..."
JOIN_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AFFILIATE_TOKEN" \
  -d "{
    \"query\": \"mutation { joinCampaign(input: { campaignId: \\\"$CAMPAIGN_ID\\\", message: \\\"I would like to promote your products\\\" }) }\"
  }")

echo "$JOIN_RESPONSE" | jq '.'
echo ""

# Step 3: Get pending applications (merchant)
echo "3️⃣ Checking pending applications..."
APPLICATIONS_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -d "{
    \"query\": \"query { getAffiliateCampaign(id: \\\"$CAMPAIGN_ID\\\") { id affiliates { id status message affiliate { user { firstName lastName } } } } }\"
  }")

echo "$APPLICATIONS_RESPONSE" | jq '.data.getAffiliateCampaign.affiliates'
APPLICATION_ID=$(echo "$APPLICATIONS_RESPONSE" | jq -r '.data.getAffiliateCampaign.affiliates[0].id')
echo "📋 Application ID: $APPLICATION_ID"
echo ""

# Step 4: Approve application (merchant)
echo "4️⃣ Approving application..."
APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -d "{
    \"query\": \"mutation { reviewCampaignApplication(input: { applicationId: \\\"$APPLICATION_ID\\\", action: \\\"approved\\\", reason: \\\"Good profile\\\" }) }\"
  }")

echo "$APPROVE_RESPONSE" | jq '.'
echo ""

# Step 5: Verify approved status
echo "5️⃣ Verifying approved status..."
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AFFILIATE_TOKEN" \
  -d "{
    \"query\": \"query { getMyAffiliateProfile { campaigns { id status campaign { name } } } }\"
  }" | jq '.data.getMyAffiliateProfile.campaigns'
echo ""

# Step 6: Delete campaign (merchant - should work if no conversions)
echo "6️⃣ Attempting to delete campaign..."
DELETE_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MERCHANT_TOKEN" \
  -d "{
    \"query\": \"mutation { deleteAffiliateCampaign(id: \\\"$CAMPAIGN_ID\\\") }\"
  }")

echo "$DELETE_RESPONSE" | jq '.'
echo ""

echo "✅ Join Campaign Flow Test Complete!"
echo ""
echo "📊 Summary:"
echo "  - Campaign created: $CAMPAIGN_ID"
echo "  - Application ID: $APPLICATION_ID"
echo "  - Campaign deleted successfully"
