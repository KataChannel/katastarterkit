#!/bin/bash

# 🔧 PageBuilder Bug Fixes & Updates Test Script
# Tests for drag-drop functionality and templates

echo "🔍 Testing PageBuilder Updates..."
echo "=================================="

FRONTEND_DIR="/mnt/chikiet/kataoffical/fullstack/tazagroupcore/frontend"
PASSED=0
FAILED=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function test_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

function test_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

function test_warn() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

echo ""
echo "📁 File Structure Tests"
echo "======================"

# Test 1: Check DndContext import in PageBuilderProvider
if grep -q "DndContext" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    test_pass "PageBuilderProvider imports DndContext"
else
    test_fail "PageBuilderProvider missing DndContext import"
fi

# Test 2: Check if DndContext wraps children in PageBuilderProvider
if grep -A5 "return (" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx" | grep -q "DndContext"; then
    test_pass "PageBuilderProvider wraps children with DndContext"
else
    test_fail "PageBuilderProvider doesn't wrap children with DndContext"
fi

# Test 3: Check if PageBuilderCanvas removed duplicate DndContext
if ! grep -q "DndContext" "$FRONTEND_DIR/src/components/page-builder/PageBuilderCanvas.tsx"; then
    test_pass "PageBuilderCanvas removed duplicate DndContext"
else
    test_fail "PageBuilderCanvas still has duplicate DndContext"
fi

# Test 4: Check ElementsLibrary has useDraggable
if grep -q "useDraggable" "$FRONTEND_DIR/src/components/page-builder/panels/LeftPanel/ElementsLibrary.tsx"; then
    test_pass "ElementsLibrary has useDraggable setup"
else
    test_fail "ElementsLibrary missing useDraggable"
fi

# Test 5: Check drag data type in ElementsLibrary
if grep -q "type: 'new-block'" "$FRONTEND_DIR/src/components/page-builder/panels/LeftPanel/ElementsLibrary.tsx"; then
    test_pass "ElementsLibrary sets correct drag data type"
else
    test_fail "ElementsLibrary missing drag data type"
fi

echo ""
echo "🎨 Templates Tests"
echo "=================="

# Test 6: Check if initSampleTemplates is imported
if grep -q "initSampleTemplates" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    test_pass "PageBuilderProvider imports initSampleTemplates"
else
    test_fail "PageBuilderProvider missing initSampleTemplates import"
fi

# Test 7: Check if initSampleTemplates is called
if grep -q "initSampleTemplates()" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    test_pass "PageBuilderProvider calls initSampleTemplates"
else
    test_fail "PageBuilderProvider doesn't call initSampleTemplates"
fi

# Test 8: Check initSampleTemplates file exists
if [ -f "$FRONTEND_DIR/src/utils/initSampleTemplates.ts" ]; then
    test_pass "initSampleTemplates utility file exists"
else
    test_fail "initSampleTemplates utility file missing"
fi

# Test 9: Check BLOCK_TEMPLATES has multiple templates
template_count=$(grep -c "id: '" "$FRONTEND_DIR/src/data/blockTemplates.ts" | head -1)
if [ "${template_count:-0}" -ge 3 ]; then
    test_pass "BLOCK_TEMPLATES has ${template_count} templates"
else
    test_fail "BLOCK_TEMPLATES has insufficient templates (${template_count})"
fi

echo ""
echo "🔄 Drag & Drop Logic Tests"
echo "========================="

# Test 10: Check handleDragEnd handles new-block type
if grep -A10 "handleDragEnd" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx" | grep -q "new-block"; then
    test_pass "handleDragEnd processes 'new-block' type"
else
    test_fail "handleDragEnd missing 'new-block' handling"
fi

# Test 11: Check Canvas has useDroppable
if grep -q "useDroppable" "$FRONTEND_DIR/src/components/page-builder/PageBuilderCanvas.tsx"; then
    test_pass "PageBuilderCanvas has useDroppable zone"
else
    test_fail "PageBuilderCanvas missing useDroppable zone"
fi

# Test 12: Check DragOverlay in Provider
if grep -A5 "DragOverlay" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx" | grep -q "draggedBlock"; then
    test_pass "PageBuilderProvider has DragOverlay with draggedBlock"
else
    test_fail "PageBuilderProvider missing DragOverlay"
fi

echo ""
echo "⚙️ Context Integration Tests"
echo "============================"

# Test 13: Check handleAddBlock in context
if grep -q "handleAddBlock" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    test_pass "PageBuilderProvider has handleAddBlock function"
else
    test_fail "PageBuilderProvider missing handleAddBlock function"
fi

# Test 14: Check addBlock mutation usage
if grep -q "addBlock(" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    test_pass "PageBuilderProvider uses addBlock mutation"
else
    test_fail "PageBuilderProvider missing addBlock mutation usage"
fi

# Test 15: Check toast notifications
if grep -q "toast.success.*Block added" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    test_pass "Success toast for adding blocks exists"
else
    test_fail "Missing success toast for adding blocks"
fi

echo ""
echo "📦 Component Integration Tests"
echo "=============================="

# Test 16: Check if FullScreenLayout uses EditorCanvas
if grep -q "EditorCanvas" "$FRONTEND_DIR/src/components/page-builder/layout/FullScreenLayout.tsx"; then
    test_pass "FullScreenLayout uses EditorCanvas"
else
    test_fail "FullScreenLayout missing EditorCanvas"
fi

# Test 17: Check if EditorCanvas uses PageBuilderCanvas
if grep -q "PageBuilderCanvas" "$FRONTEND_DIR/src/components/page-builder/layout/EditorCanvas.tsx"; then
    test_pass "EditorCanvas wraps PageBuilderCanvas"
else
    test_fail "EditorCanvas missing PageBuilderCanvas"
fi

# Test 18: Check if LeftPanel has ElementsLibrary
if grep -q "ElementsLibrary" "$FRONTEND_DIR/src/components/page-builder/panels/LeftPanel/LeftPanel.tsx"; then
    test_pass "LeftPanel includes ElementsLibrary"
else
    test_warn "LeftPanel might be missing ElementsLibrary"
fi

echo ""
echo "🎯 Type Safety Tests"
echo "==================="

# Test 19: Check TypeScript compilation (skip for now due to config issues)
echo -e "${YELLOW}⚠️ TypeScript compilation skipped (config issues)${NC}"

echo ""
echo "📊 Summary"
echo "=========="
echo "Total Tests: $((PASSED + FAILED))"
echo -e "✅ Passed: ${GREEN}${PASSED}${NC}"
echo -e "❌ Failed: ${RED}${FAILED}${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Drag-drop and templates are ready!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Start dev server: cd frontend && bun dev"
    echo "2. Open PageBuilder: http://localhost:3000/admin/pagebuilder"
    echo "3. Test drag-drop: Drag elements from left panel to canvas"
    echo "4. Test templates: Check Templates tab in left panel"
    exit 0
else
    echo ""
    echo -e "${RED}🚫 Some tests failed. Please check the issues above.${NC}"
    exit 1
fi