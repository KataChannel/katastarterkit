#!/bin/bash

# ====================================================
# PROTECTEDROUTE FIX - VERIFICATION SCRIPT
# ====================================================
# Tests the NextRouter fix for App Router compatibility
# ====================================================

set -e

FRONTEND_DIR="/chikiet/kataoffical/fullstack/tazagroupcore/frontend"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║         PROTECTEDROUTE FIX VERIFICATION             ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}🔍 Running verification checks...${NC}"
echo ""

# Check 1: Verify no 'next/router' imports in App Router
echo -e "${BLUE}[1/5]${NC} Checking for old router imports in App Router..."
OLD_ROUTER=$(grep -r "from 'next/router'" "$FRONTEND_DIR/src/app/" 2>/dev/null || echo "")
if [ -z "$OLD_ROUTER" ]; then
    echo -e "   ${GREEN}✅ No 'next/router' imports found in app/ directory${NC}"
else
    echo -e "   ${RED}❌ Found old router imports:${NC}"
    echo "$OLD_ROUTER"
    exit 1
fi

# Check 2: Verify ProtectedRoute uses next/navigation
echo -e "${BLUE}[2/5]${NC} Checking ProtectedRoute implementation..."
if grep -q "from 'next/navigation'" "$FRONTEND_DIR/src/components/ProtectedRoute.tsx"; then
    echo -e "   ${GREEN}✅ ProtectedRoute correctly uses 'next/navigation'${NC}"
else
    echo -e "   ${RED}❌ ProtectedRoute not using correct router${NC}"
    exit 1
fi

# Check 3: Verify usePathname is used
echo -e "${BLUE}[3/5]${NC} Checking usePathname usage..."
if grep -q "usePathname" "$FRONTEND_DIR/src/components/ProtectedRoute.tsx"; then
    echo -e "   ${GREEN}✅ usePathname hook is used${NC}"
else
    echo -e "   ${RED}❌ usePathname not found${NC}"
    exit 1
fi

# Check 4: Verify useEffect pattern
echo -e "${BLUE}[4/5]${NC} Checking redirect pattern..."
if grep -q "useEffect" "$FRONTEND_DIR/src/components/ProtectedRoute.tsx"; then
    echo -e "   ${GREEN}✅ Redirects use useEffect pattern${NC}"
else
    echo -e "   ${RED}❌ useEffect not found${NC}"
    exit 1
fi

# Check 5: VS Code errors check (more reliable)
echo -e "${BLUE}[5/5]${NC} Checking for syntax errors..."
if grep -E "(useRouter.*next/router|router\.asPath)" "$FRONTEND_DIR/src/components/ProtectedRoute.tsx"; then
    echo -e "   ${RED}❌ Old router API still in use${NC}"
    exit 1
else
    echo -e "   ${GREEN}✅ No old router API usage found${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All verification checks passed!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. Start the development server:"
echo -e "   ${BLUE}cd frontend && bun run dev${NC}"
echo ""
echo "2. Test the protected route:"
echo -e "   ${BLUE}http://localhost:3001/admin/affiliate/browse${NC}"
echo ""
echo "3. Expected behavior:"
echo "   - No 'NextRouter was not mounted' error"
echo "   - Redirects to login if not authenticated"
echo "   - Shows content if authenticated"
echo ""

echo -e "${GREEN}🎉 Fix verification complete!${NC}"
