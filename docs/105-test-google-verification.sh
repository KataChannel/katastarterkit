#!/bin/bash

# ============================================================================
# Test Google Verification File Accessibility
# ============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🔍 Google Verification File Test                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test URLs
URLS=(
  "http://localhost:12000/googleca2f7c2a9539b58a.html"
  "http://116.118.49.243:12000/googleca2f7c2a9539b58a.html"
  "https://rausachtrangia.com/googleca2f7c2a9539b58a.html"
  "https://www.rausachtrangia.com/googleca2f7c2a9539b58a.html"
)

echo -e "${YELLOW}Testing verification file accessibility...${NC}"
echo ""

for url in "${URLS[@]}"; do
  echo -e "${BLUE}Testing: ${NC}$url"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  
  if [ "$response" = "200" ]; then
    echo -e "  ${GREEN}✅ Status: $response OK${NC}"
    
    # Get content
    content=$(curl -s "$url" 2>/dev/null)
    if echo "$content" | grep -q "google-site-verification"; then
      echo -e "  ${GREEN}✅ Content: Valid verification string${NC}"
    else
      echo -e "  ${RED}❌ Content: Invalid or missing verification string${NC}"
    fi
  else
    echo -e "  ${RED}❌ Status: $response (Not accessible)${NC}"
  fi
  echo ""
done

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 Notes:${NC}"
echo ""
echo -e "${BLUE}1. File Location:${NC}"
echo "   frontend/public/googleca2f7c2a9539b58a.html"
echo ""
echo -e "${BLUE}2. Route Handler:${NC}"
echo "   frontend/src/app/googleca2f7c2a9539b58a.html/route.ts"
echo ""
echo -e "${BLUE}3. Meta Tag (in <head>):${NC}"
echo "   <meta name=\"google-site-verification\" content=\"googleca2f7c2a9539b58a\" />"
echo ""
echo -e "${BLUE}4. Admin Setting:${NC}"
echo "   seo.google_site_verification = 'googleca2f7c2a9539b58a'"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✅ Test completed!${NC}"
echo ""
echo -e "${BLUE}To verify in Google Search Console:${NC}"
echo "1. Go to: https://search.google.com/search-console"
echo "2. Add property: rausachtrangia.com"
echo "3. Choose verification method:"
echo "   - HTML file: /googleca2f7c2a9539b58a.html"
echo "   - HTML tag: <meta name=\"google-site-verification\" content=\"googleca2f7c2a9539b58a\" />"
echo ""

