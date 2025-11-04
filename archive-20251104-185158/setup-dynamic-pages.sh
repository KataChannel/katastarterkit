#!/bin/bash

# 🚀 QUICK START: Tạo Dynamic Product Page Template
# Chạy script này để setup nhanh dynamic product page

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   🎨 DYNAMIC PRODUCT PAGE SETUP - QUICK START               ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Update Backend Schema
echo -e "${BLUE}📋 Step 1: Updating Backend Schema...${NC}"
cat > backend/src/schema/page-dynamic.graphql << 'EOF'
# 🆕 Dynamic Page Support

extend type Page {
  isDynamic: Boolean!
  dynamicConfig: DynamicConfig
}

type DynamicConfig {
  dataSource: String!
  dataQuery: String
  slugPattern: String!
  slugField: String!
  dataBindings: [DataBinding!]!
}

type DataBinding {
  blockId: String!
  sourceField: String!
  targetProperty: String!
  transform: String
}

input DynamicConfigInput {
  dataSource: String!
  dataQuery: String
  slugPattern: String!
  slugField: String!
  dataBindings: [DataBindingInput!]
}

input DataBindingInput {
  blockId: String!
  sourceField: String!
  targetProperty: String!
  transform: String
}

extend input CreatePageInput {
  isDynamic: Boolean
  dynamicConfig: DynamicConfigInput
}

extend input UpdatePageInput {
  isDynamic: Boolean
  dynamicConfig: DynamicConfigInput
}

# 🆕 New Query
extend type Query {
  getPageBySlugPattern(slugPattern: String!): Page
}
EOF

echo -e "${GREEN}✅ Schema updated: backend/src/schema/page-dynamic.graphql${NC}"
echo ""

# Step 2: Update Prisma Schema
echo -e "${BLUE}📊 Step 2: Updating Prisma Schema...${NC}"

# Backup current schema
cp backend/prisma/schema.prisma backend/prisma/schema.prisma.backup

# Add new fields to Page model (after isHomepage field)
sed -i '/isHomepage.*Boolean.*default(false)/a\  \n  // Dynamic Page Support\n  isDynamic         Boolean             @default(false)\n  dynamicConfig     Json?' backend/prisma/schema.prisma

# Add index
sed -i '/@@index(\[slug\])/a\  @@index([isDynamic])' backend/prisma/schema.prisma

echo -e "${GREEN}✅ Prisma schema updated${NC}"
echo -e "${YELLOW}⚠️  Run migration: cd backend && npx prisma migrate dev --name add_dynamic_pages${NC}"
echo ""

# Step 3: Create Frontend Components
echo -e "${BLUE}🎨 Step 3: Creating Frontend Components...${NC}"

# Create DynamicPageConfig component
mkdir -p frontend/src/components/page-builder

cat > frontend/src/components/page-builder/DynamicPageConfig.tsx << 'EOF'
// See DYNAMIC_PRODUCT_PAGE_GUIDE.md for full implementation
export { DynamicPageConfig } from './DynamicPageConfig';
EOF

# Create DynamicPageRenderer component
cat > frontend/src/components/DynamicPageRenderer.tsx << 'EOF'
// See DYNAMIC_PRODUCT_PAGE_GUIDE.md for full implementation
export { DynamicPageRenderer } from './DynamicPageRenderer';
EOF

echo -e "${GREEN}✅ Component files created${NC}"
echo ""

# Step 4: Create Example Product Page Route
echo -e "${BLUE}🌐 Step 4: Creating Dynamic Route...${NC}"

mkdir -p frontend/src/app/product/\[slug\]

cat > frontend/src/app/product/\[slug\]/page.tsx << 'EOF'
// Dynamic Product Page
// See DYNAMIC_PRODUCT_PAGE_GUIDE.md for full implementation

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <div>Product: {params.slug}</div>;
}
EOF

echo -e "${GREEN}✅ Dynamic route created: /product/[slug]${NC}"
echo ""

# Step 5: Summary
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   ✅ SETUP COMPLETE!                                        ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}📁 Files Created:${NC}"
echo "  ✅ backend/src/schema/page-dynamic.graphql"
echo "  ✅ frontend/src/components/page-builder/DynamicPageConfig.tsx"
echo "  ✅ frontend/src/components/DynamicPageRenderer.tsx"
echo "  ✅ frontend/src/app/product/[slug]/page.tsx"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. Run Prisma migration:"
echo "     cd backend && npx prisma migrate dev --name add_dynamic_pages"
echo ""
echo "  2. Implement components (see DYNAMIC_PRODUCT_PAGE_GUIDE.md)"
echo ""
echo "  3. Test in Page Builder:"
echo "     - Create new page"
echo "     - Enable 'Dynamic Page'"
echo "     - Set slug: /product/:productSlug"
echo "     - Configure data bindings"
echo ""
echo "  4. Test with real product:"
echo "     Visit: http://localhost:3000/product/your-product-slug"
echo ""
echo -e "${BLUE}📖 Full Documentation:${NC}"
echo "  Read: DYNAMIC_PRODUCT_PAGE_GUIDE.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
