#!/bin/bash

echo "=== TEST HOMEPAGE_URL REDIRECT LOGIC ==="
echo ""
echo "Logic: Nếu site.homepage_url CÓ GIÁ TRỊ (khác '/' hoặc rỗng)"
echo "       → Truy cập '/' sẽ REDIRECT về URL đó"
echo ""

# Test 1: Check current setting value
echo "1. Kiểm tra giá trị hiện tại của site.homepage_url:"
curl -s -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ publicWebsiteSettings(keys: [\"site.homepage_url\"]) { key value } }"}' \
  | jq -r '.data.publicWebsiteSettings[] | "   \(.key) = \"\(.value)\""'

echo ""
echo "2. Test cases:"
echo ""

# Test cases với các giá trị khác nhau
echo "   Case 1: homepage_url = '/' → KHÔNG redirect (hiển thị homepage bình thường)"
echo "   Case 2: homepage_url = '' → KHÔNG redirect (hiển thị homepage bình thường)"
echo "   Case 3: homepage_url = '/lms' → REDIRECT to /lms"
echo "   Case 4: homepage_url = '/san-pham' → REDIRECT to /san-pham"
echo "   Case 5: homepage_url = 'https://google.com' → REDIRECT to https://google.com"

echo ""
echo "3. Để test:"
echo "   - Vào Admin → Settings → GENERAL → site.homepage_url"
echo "   - Thay đổi giá trị (ví dụ: /lms)"
echo "   - Truy cập http://localhost:3000/"
echo "   - Xem có redirect không"

echo ""
echo "=== END TEST ==="
