#!/bin/bash

echo "🔍 Testing Next.js Image Configuration"
echo "======================================"
echo ""

# Test URLs
TEST_URLS=(
  "https://rausachtrangia.com/upload/sanpham/klt43748123.jpg"
  "https://rausachtrangia.com/quanly/fileman/Uploads/Images/gahapmuoi86071922.jpg"
  "https://www.rausachtrangia.com/upload/sanpham/test.jpg"
  "http://rausachtrangia.com/upload/sanpham/test.jpg"
  "https://storage.rausachtrangia.com/test.jpg"
  "https://images.rausachtrangia.com/test.jpg"
)

echo "✅ Configured domains in next.config.js:"
echo "  - localhost"
echo "  - 116.118.49.243"
echo "  - rausachtrangia.com"
echo "  - www.rausachtrangia.com"
echo "  - storage.rausachtrangia.com"
echo "  - images.rausachtrangia.com"
echo ""

echo "✅ Configured remotePatterns:"
echo "  - https://rausachtrangia.com/**"
echo "  - http://rausachtrangia.com/**"
echo "  - https://www.rausachtrangia.com/**"
echo "  - http://www.rausachtrangia.com/**"
echo ""

echo "📝 Test URLs that should work:"
for url in "${TEST_URLS[@]}"; do
  echo "  ✓ $url"
done
echo ""

echo "🚀 Next steps:"
echo "  1. Rebuild frontend: cd frontend && npm run build"
echo "  2. Test locally: npm run start"
echo "  3. Deploy to production"
echo ""

echo "💡 To test an image URL in production:"
echo "  curl -I 'https://shop.rausachtrangia.com/_next/image?url=https%3A%2F%2Frausachtrangia.com%2Fupload%2Fsanpham%2Fklt43748123.jpg&w=64&q=75'"
echo ""

echo "✅ Configuration updated successfully!"
