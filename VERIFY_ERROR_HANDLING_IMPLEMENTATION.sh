#!/bin/bash
# Verification Checklist for API Error Handling Implementation

echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║           API Error Handling Implementation Checklist               ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0

# Check function
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $2"
    ((PASS++))
  else
    echo -e "${RED}❌${NC} $2"
    ((FAIL++))
  fi
}

check_content() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} $3"
    ((PASS++))
  else
    echo -e "${RED}❌${NC} $3"
    ((FAIL++))
  fi
}

# ============================================================================
# Frontend Files
# ============================================================================
echo -e "${BLUE}📁 Frontend Files${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file \
  "/chikiet/kataoffical/shoprausach/frontend/src/hooks/useErrorNotification.ts" \
  "Created useErrorNotification hook"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/hooks/index.ts" \
  "useErrorNotification" \
  "Exported useErrorNotification from hooks"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/components/blog/BlogListPage.tsx" \
  "useErrorNotification" \
  "BlogListPage imports useErrorNotification"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/components/blog/BlogListPage.tsx" \
  "AlertCircle" \
  "BlogListPage has error banner with AlertCircle"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/components/blog/BlogListPage.tsx" \
  "displayError" \
  "BlogListPage has error state management"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/app/(website)/[slug]/page.tsx" \
  "reservedRoutes" \
  "Dynamic page handler excludes reserved routes"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/lib/apollo-client.ts" \
  "not found" \
  "Apollo client logs 'not found' errors"

echo ""

# ============================================================================
# Documentation Files
# ============================================================================
echo -e "${BLUE}📚 Documentation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file \
  "/chikiet/kataoffical/shoprausach/docs/API_ERROR_HANDLING_FIX.md" \
  "Created API_ERROR_HANDLING_FIX.md"

check_file \
  "/chikiet/kataoffical/shoprausach/IMPLEMENTATION_COMPLETE_API_ERROR_HANDLING.md" \
  "Created IMPLEMENTATION_COMPLETE_API_ERROR_HANDLING.md"

check_file \
  "/chikiet/kataoffical/shoprausach/API_ERROR_HANDLING_QUICK_REFERENCE.md" \
  "Created API_ERROR_HANDLING_QUICK_REFERENCE.md"

echo ""

# ============================================================================
# Test Files
# ============================================================================
echo -e "${BLUE}🧪 Test Files${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file \
  "/chikiet/kataoffical/shoprausach/tests/test-api-error-handling.sh" \
  "Created test-api-error-handling.sh"

echo ""

# ============================================================================
# Code Features Checklist
# ============================================================================
echo -e "${BLUE}✨ Feature Implementation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/hooks/useErrorNotification.ts" \
  "parseGraphQLError" \
  "Error notification service has GraphQL error parser"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/hooks/useErrorNotification.ts" \
  "errorListeners" \
  "Error notification service has listener subscription"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/components/blog/BlogListPage.tsx" \
  "Chi tiết lỗi" \
  "Error banner has collapsible details section"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/components/blog/BlogListPage.tsx" \
  "refetch" \
  "Error banner has retry functionality"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/app/(website)/[slug]/page.tsx" \
  "baiviet" \
  "Dynamic handler excludes /baiviet route"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/app/(website)/[slug]/page.tsx" \
  "sanpham" \
  "Dynamic handler excludes /sanpham route"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/lib/apollo-client.ts" \
  "operation.operationName" \
  "Apollo logs operation name in errors"

check_content \
  "/chikiet/kataoffical/shoprausach/frontend/src/lib/apollo-client.ts" \
  "operation.variables" \
  "Apollo logs variables in errors"

echo ""

# ============================================================================
# Summary
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
TOTAL=$((PASS + FAIL))

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC} ($PASS/$TOTAL)"
  echo ""
  echo "Implementation Status: COMPLETE ✨"
  exit 0
else
  echo -e "${YELLOW}⚠️  SOME CHECKS FAILED${NC} ($PASS/$TOTAL passed, $FAIL failed)"
  echo ""
  echo "Please review the failed items above."
  exit 1
fi
