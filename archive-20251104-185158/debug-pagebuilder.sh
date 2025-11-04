#!/bin/bash

# 🔍 PageBuilder Debug Script
# Check why add block button is not working

echo "🔍 Debugging PageBuilder Add Block Issue..."
echo "==========================================="

FRONTEND_DIR="/mnt/chikiet/kataoffical/fullstack/rausachcore/frontend"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📋 Checking Configuration...${NC}"

# Check 1: ElementsLibrary draggable elements
echo -n "Elements with useDraggable: "
count=$(grep -c "useDraggable" "$FRONTEND_DIR/src/components/page-builder/panels/LeftPanel/ElementsLibrary.tsx")
echo -e "${GREEN}$count elements${NC}"

# Check 2: Drag data structure
echo -n "Drag data 'new-block': "
if grep -q "type: 'new-block'" "$FRONTEND_DIR/src/components/page-builder/panels/LeftPanel/ElementsLibrary.tsx"; then
    echo -e "${GREEN}✅ Correct${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check 3: PageBuilderProvider DndContext
echo -n "Provider has DndContext: "
if grep -q "DndContext" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    echo -e "${GREEN}✅ Yes${NC}"
else
    echo -e "${RED}❌ No${NC}"
fi

# Check 4: handleDragEnd processes new-block
echo -n "handleDragEnd processes new-block: "
if grep -A5 "active.data?.current?.type === 'new-block'" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx" >/dev/null; then
    echo -e "${GREEN}✅ Yes${NC}"
else
    echo -e "${RED}❌ No${NC}"
fi

# Check 5: Canvas droppable zone
echo -n "Canvas has useDroppable: "
if grep -q "useDroppable" "$FRONTEND_DIR/src/components/page-builder/PageBuilderCanvas.tsx"; then
    echo -e "${GREEN}✅ Yes${NC}"
else
    echo -e "${RED}❌ No${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Checking Page State Issues...${NC}"

# Check 6: handleAddBlock function exists
echo -n "handleAddBlock function: "
if grep -A10 "const handleAddBlock" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx" >/dev/null; then
    echo -e "${GREEN}✅ Exists${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check 7: Page validation check
echo -n "Page validation check: "
if grep -q "editingPage?.id && isNewPageMode" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    echo -e "${GREEN}✅ Has validation${NC}"
else
    echo -e "${RED}❌ No validation${NC}"
fi

# Check 8: addBlock mutation usage
echo -n "addBlock mutation called: "
if grep -A5 "await addBlock(input)" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx" >/dev/null; then
    echo -e "${GREEN}✅ Yes${NC}"
else
    echo -e "${RED}❌ No${NC}"
fi

echo ""
echo -e "${BLUE}📱 Checking Hook Integration...${NC}"

# Check 9: useBlockOperations hook
echo -n "useBlockOperations import: "
if grep -q "useBlockOperations" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    echo -e "${GREEN}✅ Imported${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check 10: addBlock hook usage
echo -n "addBlock hook destructured: "
if grep -q "addBlock.*useBlockOperations" "$FRONTEND_DIR/src/components/page-builder/PageBuilderProvider.tsx"; then
    echo -e "${GREEN}✅ Yes${NC}"
else
    echo -e "${RED}❌ No${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Common Issues & Solutions...${NC}"

echo ""
echo -e "${YELLOW}🔍 Possible Issues:${NC}"
echo "1. Page not saved yet (isNewPageMode = true, editingPage.id = null)"
echo "2. DndContext not wrapping components properly"
echo "3. ElementsLibrary not inside DndContext scope"
echo "4. handleDragEnd not handling 'new-block' type"
echo "5. Canvas not droppable (missing useDroppable)"
echo "6. GraphQL mutation failing silently"

echo ""
echo -e "${YELLOW}🛠️ Quick Fixes:${NC}"
echo "1. Save page first before adding blocks"
echo "2. Check browser console for errors"
echo "3. Check network tab for GraphQL failures"
echo "4. Try drag-drop vs direct button click"

echo ""
echo -e "${YELLOW}🧪 Debug Steps:${NC}"
echo "1. Open PageBuilder"
echo "2. Create new page or edit existing"
echo "3. Try dragging Text element to canvas"
echo "4. Check browser console for errors"
echo "5. Check network requests for mutations"

echo ""
echo -e "${GREEN}✅ If all checks above pass, the issue might be:${NC}"
echo "- Browser-specific drag-drop issue"
echo "- GraphQL endpoint not responding"
echo "- Database connection issue"
echo "- Page ID not being passed correctly"

echo ""
echo -e "${BLUE}🔗 Quick Test Commands:${NC}"
echo "# Start frontend"
echo "cd frontend && bun dev"
echo ""
echo "# Open PageBuilder"  
echo "http://localhost:3000/admin/pagebuilder"
echo ""
echo "# Check console logs"
echo "F12 → Console → Try drag-drop"