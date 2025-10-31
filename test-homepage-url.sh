#!/bin/bash

echo "=== TEST HOMEPAGE_URL FEATURE ==="
echo ""

# Test 1: Public GraphQL Query (không cần auth)
echo "1. Testing publicWebsiteSettings query (no auth required):"
curl -s -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ publicWebsiteSettings(keys: [\"site.homepage_url\", \"site.offline\"]) { key value } }"}' \
  | jq '.'

echo ""
echo "✅ Nếu thấy data với site.homepage_url và site.offline => Feature hoạt động!"
echo ""

# Test 2: Check current values
echo "2. Current settings values:"
curl -s -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ publicWebsiteSettings(keys: [\"site.homepage_url\"]) { key value } }"}' \
  | jq -r '.data.publicWebsiteSettings[] | "  \(.key) = \(.value)"'

echo ""
echo "=== END TEST ==="
