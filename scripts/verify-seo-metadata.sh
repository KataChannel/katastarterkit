#!/bin/bash

# Script to verify SEO metadata configuration
# Usage: ./scripts/verify-seo-metadata.sh

echo ""
echo "🔍 SEO METADATA VERIFICATION"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is running
echo "1. Checking backend status..."
if curl -s http://localhost:3000/graphql > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend is running on port 3000"
else
    echo -e "${RED}✗${NC} Backend is not running!"
    echo "   Start backend with: cd backend && npm run start:dev"
    exit 1
fi

# Query SEO settings from database
echo ""
echo "2. Querying SEO settings from database..."
cd backend

SEO_COUNT=$(npx ts-node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.websiteSetting.count({ where: { category: 'SEO', isActive: true } })
  .then(count => {
    console.log(count);
    prisma.\$disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
" 2>/dev/null)

if [ "$SEO_COUNT" -ge 19 ]; then
    echo -e "${GREEN}✓${NC} Found $SEO_COUNT active SEO settings"
else
    echo -e "${YELLOW}⚠${NC} Found only $SEO_COUNT SEO settings (expected 19)"
    echo "   Run: cd backend && npx ts-node scripts/seed-seo-settings.ts"
fi

# List all SEO settings
echo ""
echo "3. SEO Settings Summary:"
echo "   ────────────────────────────────────────"

npx ts-node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.websiteSetting.findMany({ 
  where: { category: 'SEO', isActive: true },
  orderBy: { order: 'asc' }
})
  .then(settings => {
    const groups: Record<string, any[]> = {};
    settings.forEach(s => {
      const group = s.group || 'other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(s);
    });
    
    Object.keys(groups).sort().forEach(group => {
      console.log(\`\n   📁 \${group.toUpperCase()}\`);
      groups[group].forEach(s => {
        const value = s.value.length > 40 ? s.value.substring(0, 40) + '...' : s.value;
        console.log(\`      • \${s.key.padEnd(25)} = \${value}\`);
      });
    });
    
    prisma.\$disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
" 2>/dev/null

cd ..

# Check frontend metadata.ts
echo ""
echo ""
echo "4. Checking frontend metadata configuration..."
if [ -f "frontend/src/lib/metadata.ts" ]; then
    echo -e "${GREEN}✓${NC} metadata.ts exists"
else
    echo -e "${RED}✗${NC} frontend/src/lib/metadata.ts not found!"
fi

# Check layout.tsx
if grep -q "generateMetadata" frontend/src/app/layout.tsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} layout.tsx uses generateMetadata()"
else
    echo -e "${RED}✗${NC} layout.tsx doesn't export generateMetadata!"
fi

# Check environment variable
echo ""
echo "5. Checking environment variables..."
if [ -f "frontend/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.local; then
        ENDPOINT=$(grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.local | cut -d '=' -f2)
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_GRAPHQL_ENDPOINT = $ENDPOINT"
    else
        echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_GRAPHQL_ENDPOINT not set in .env.local"
    fi
else
    echo -e "${YELLOW}⚠${NC} frontend/.env.local not found"
fi

# Test GraphQL query
echo ""
echo "6. Testing GraphQL SEO query..."
GRAPHQL_ENDPOINT=${NEXT_PUBLIC_GRAPHQL_ENDPOINT:-"http://localhost:3000/graphql"}

RESPONSE=$(curl -s -X POST "$GRAPHQL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { websiteSettings(where: { category: { equals: SEO } }) { key value } }"
  }')

if echo "$RESPONSE" | grep -q "websiteSettings"; then
    COUNT=$(echo "$RESPONSE" | grep -o '"key"' | wc -l)
    echo -e "${GREEN}✓${NC} GraphQL query successful (returned $COUNT settings)"
else
    echo -e "${RED}✗${NC} GraphQL query failed!"
    echo "   Response: $RESPONSE"
fi

# Summary
echo ""
echo "=========================================="
echo "✨ Verification Complete!"
echo ""
echo "Next steps:"
echo "  • Update SEO settings: http://localhost:13000/admin/settings/website (SEO tab)"
echo "  • Rebuild frontend: cd frontend && npm run build"
echo "  • Test social sharing: https://developers.facebook.com/tools/debug/"
echo ""
