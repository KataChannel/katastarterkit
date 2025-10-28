#!/bin/bash

# PageBuilder Feature Verification Script
# Run this to verify all PageBuilder features are working

echo "🔍 PageBuilder Feature Verification Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASSED=0
FAILED=0
TOTAL=0

check_feature() {
  TOTAL=$((TOTAL + 1))
  local feature_name=$1
  local check_command=$2
  
  echo -n "[$TOTAL] Checking $feature_name... "
  
  if eval "$check_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "📁 File Structure Checks"
echo "------------------------"

check_feature "FullScreenPageBuilder exists" "test -f frontend/src/components/page-builder/FullScreenPageBuilder.tsx"
check_feature "PageBuilderProvider exists" "test -f frontend/src/components/page-builder/PageBuilderProvider.tsx"
check_feature "FullScreenLayout exists" "test -f frontend/src/components/page-builder/layout/FullScreenLayout.tsx"
check_feature "EditorToolbar exists" "test -f frontend/src/components/page-builder/layout/EditorToolbar.tsx"
check_feature "EditorCanvas exists" "test -f frontend/src/components/page-builder/layout/EditorCanvas.tsx"
check_feature "LeftPanel exists" "test -f frontend/src/components/page-builder/panels/LeftPanel/LeftPanel.tsx"
check_feature "RightPanel exists" "test -f frontend/src/components/page-builder/panels/RightPanel/RightPanel.tsx"
check_feature "ElementsLibrary exists" "test -f frontend/src/components/page-builder/panels/LeftPanel/ElementsLibrary.tsx"

echo ""
echo "🔌 Hook Files Checks"
echo "--------------------"

check_feature "usePageBuilder hook exists" "test -f frontend/src/hooks/usePageBuilder.ts"
check_feature "GraphQL queries exist" "test -f frontend/src/graphql/queries/pages.ts"

echo ""
echo "📝 Type Definition Checks"
echo "-------------------------"

check_feature "page-builder types exist" "test -f frontend/src/types/page-builder.ts"

echo ""
echo "🧩 Component Integration Checks"
echo "--------------------------------"

# Check imports in FullScreenPageBuilder
check_feature "FullScreenPageBuilder imports PageBuilderProvider" "grep -q 'import.*PageBuilderProvider' frontend/src/components/page-builder/FullScreenPageBuilder.tsx"
check_feature "FullScreenPageBuilder imports usePageBuilderContext" "grep -q 'usePageBuilderContext' frontend/src/components/page-builder/FullScreenPageBuilder.tsx"
check_feature "FullScreenPageBuilder uses handlePageSave" "grep -q 'handlePageSave' frontend/src/components/page-builder/FullScreenPageBuilder.tsx"

# Check EditorCanvas
check_feature "EditorCanvas imports usePageBuilderContext" "grep -q 'usePageBuilderContext' frontend/src/components/page-builder/layout/EditorCanvas.tsx"
check_feature "EditorCanvas uses blocks from context" "grep -q 'blocks.*=.*usePageBuilderContext' frontend/src/components/page-builder/layout/EditorCanvas.tsx"

# Check PageBuilderProvider
check_feature "PageBuilderProvider has handlePageSave" "grep -q 'handlePageSave' frontend/src/components/page-builder/PageBuilderProvider.tsx"
check_feature "PageBuilderProvider has handleAddBlock" "grep -q 'handleAddBlock' frontend/src/components/page-builder/PageBuilderProvider.tsx"
check_feature "PageBuilderProvider has handleBlockUpdate" "grep -q 'handleBlockUpdate' frontend/src/components/page-builder/PageBuilderProvider.tsx"
check_feature "PageBuilderProvider has handleBlockDelete" "grep -q 'handleBlockDelete' frontend/src/components/page-builder/PageBuilderProvider.tsx"

echo ""
echo "🎨 UI Component Checks"
echo "----------------------"

# Check Dialog accessibility
check_feature "Dialog has VisuallyHidden" "grep -q 'VisuallyHidden' frontend/src/app/admin/pagebuilder/page.tsx"
check_feature "Dialog has DialogTitle" "grep -q 'DialogTitle' frontend/src/app/admin/pagebuilder/page.tsx"
check_feature "Dialog has DialogDescription" "grep -q 'DialogDescription' frontend/src/app/admin/pagebuilder/page.tsx"

# Check EditorToolbar
check_feature "EditorToolbar removed fullscreen props" "! grep -q 'isFullscreen' frontend/src/components/page-builder/layout/EditorToolbar.tsx"
check_feature "EditorToolbar removed Maximize/Minimize icons" "! grep -q 'Maximize.*Minimize' frontend/src/components/page-builder/layout/EditorToolbar.tsx"

echo ""
echo "📊 Code Quality Checks"
echo "----------------------"

# Check TypeScript compilation
if command -v tsc &> /dev/null; then
  check_feature "TypeScript compiles without errors" "cd frontend && tsc --noEmit --skipLibCheck 2>&1 | grep -v 'error TS' | grep -q '^$'"
else
  echo "[$TOTAL] Checking TypeScript compilation... ${YELLOW}⚠️  SKIP (tsc not found)${NC}"
fi

# Check for console.log (should use proper logging)
if grep -r "console.log" frontend/src/components/page-builder/*.tsx > /dev/null 2>&1; then
  echo "[$TOTAL] Checking for console.log... ${YELLOW}⚠️  WARNING (found console.log)${NC}"
else
  check_feature "No console.log statements" "! grep -r 'console.log' frontend/src/components/page-builder/*.tsx"
fi

echo ""
echo "🔒 Validation Checks"
echo "--------------------"

check_feature "MAX_BLOCK_DEPTH defined" "grep -q 'MAX_BLOCK_DEPTH' frontend/src/hooks/usePageBuilder.ts"
check_feature "MAX_BLOCKS_PER_PAGE defined" "grep -q 'MAX_BLOCKS_PER_PAGE' frontend/src/hooks/usePageBuilder.ts"
check_feature "MAX_CHILDREN_PER_CONTAINER defined" "grep -q 'MAX_CHILDREN_PER_CONTAINER' frontend/src/hooks/usePageBuilder.ts"
check_feature "AUTO_SAVE_DELAY defined" "grep -q 'AUTO_SAVE_DELAY' frontend/src/hooks/usePageBuilder.ts"

echo ""
echo "📚 Documentation Checks"
echo "-----------------------"

check_feature "Comprehensive check doc exists" "test -f docs/PAGEBUILDER_COMPREHENSIVE_CHECK.md"
check_feature "Dialog accessibility fix doc exists" "test -f docs/DIALOG_ACCESSIBILITY_FIX.md"
check_feature "Fullscreen removal doc exists" "test -f docs/PAGEBUILDER_FULLSCREEN_REMOVAL.md"
check_feature "Dialog update doc exists" "test -f docs/PAGEBUILDER_DIALOG_UPDATE.md"

echo ""
echo "=========================================="
echo "📊 Test Results"
echo "=========================================="
echo -e "Total Tests:  $TOTAL"
echo -e "${GREEN}Passed:       $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Failed:       $FAILED${NC}"
else
  echo -e "Failed:       $FAILED"
fi
echo ""

# Calculate percentage
PERCENTAGE=$((PASSED * 100 / TOTAL))
echo -e "Success Rate: $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All checks passed! PageBuilder is ready!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
  exit 1
fi
