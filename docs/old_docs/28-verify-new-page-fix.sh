#!/bin/bash

##############################################################################
# NEW PAGE SAVE BUG FIX - VERIFICATION SCRIPT
# Purpose: Verify that the new page creation fix is working correctly
# Usage: ./verify-new-page-fix.sh
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global counters
PASS=0
FAIL=0

##############################################################################
# Helper Functions
##############################################################################

print_header() {
  echo -e "\n${BLUE}=================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}=================================${NC}\n"
}

print_pass() {
  echo -e "${GREEN}✓ PASS:${NC} $1"
  ((PASS++))
}

print_fail() {
  echo -e "${RED}✗ FAIL:${NC} $1"
  ((FAIL++))
}

print_info() {
  echo -e "${BLUE}ℹ INFO:${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠ WARNING:${NC} $1"
}

##############################################################################
# Check Files
##############################################################################

check_files() {
  print_header "1. Checking Modified Files Exist"

  local pageStateContextFile="/mnt/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/contexts/PageStateContext.tsx"
  local fullScreenLayoutFile="/mnt/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/layout/FullScreenLayout.tsx"

  if [ -f "$pageStateContextFile" ]; then
    print_pass "PageStateContext.tsx exists"
  else
    print_fail "PageStateContext.tsx NOT found at $pageStateContextFile"
  fi

  if [ -f "$fullScreenLayoutFile" ]; then
    print_pass "FullScreenLayout.tsx exists"
  else
    print_fail "FullScreenLayout.tsx NOT found at $fullScreenLayoutFile"
  fi
}

##############################################################################
# Check Code Changes
##############################################################################

check_code_changes() {
  print_header "2. Checking Code Changes in PageStateContext.tsx"

  local file="/mnt/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/contexts/PageStateContext.tsx"

  if ! grep -q "PageStatus" "$file"; then
    print_fail "PageStatus import NOT found"
  else
    print_pass "PageStatus imported correctly"
  fi

  if ! grep -q "isNewPageModeBool" "$file"; then
    print_fail "isNewPageModeBool logic NOT found"
  else
    print_pass "isNewPageModeBool check present"
  fi

  if ! grep -q "id: ''" "$file"; then
    print_fail "Default page object (id: '') NOT found"
  else
    print_pass "Default page object defined"
  fi

  if ! grep -q "title: 'Untitled Page'" "$file"; then
    print_fail "Default title NOT set"
  else
    print_pass "Default title 'Untitled Page' set"
  fi

  if ! grep -q "slug: 'untitled-page'" "$file"; then
    print_fail "Default slug NOT set"
  else
    print_pass "Default slug 'untitled-page' set"
  fi

  if ! grep -q "status: PageStatus.DRAFT" "$file"; then
    print_fail "Default status NOT set"
  else
    print_pass "Default status PageStatus.DRAFT set"
  fi
}

check_fullscreen_changes() {
  print_header "3. Checking Code Changes in FullScreenLayout.tsx"

  local file="/mnt/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/layout/FullScreenLayout.tsx"

  if ! grep -q "setEditingPage" "$file"; then
    print_fail "setEditingPage NOT found in state destructuring"
  else
    print_pass "setEditingPage added to usePageState"
  fi

  if ! grep -q "handleSettingsSave" "$file"; then
    print_fail "handleSettingsSave function NOT found"
  else
    print_pass "handleSettingsSave function present"
  fi

  if ! grep -q "!editingPage?.id" "$file"; then
    print_fail "Check for empty ID (new page) NOT found"
  else
    print_pass "Check for empty ID (new page) present"
  fi

  if ! grep -q "setEditingPage({" "$file"; then
    print_fail "Local state update NOT found"
  else
    print_pass "Local state update present"
  fi
}

##############################################################################
# Check TypeScript Compilation
##############################################################################

check_typescript() {
  print_header "4. Checking TypeScript Compilation"

  # Check if we're in the right directory
  if [ ! -f "package.json" ]; then
    print_warning "package.json not found - not in frontend directory"
    print_info "Attempting to navigate to frontend..."
    cd frontend || return
  fi

  if ! command -v npm &> /dev/null; then
    print_warning "npm not found - skipping TypeScript check"
    return
  fi

  print_info "Running TypeScript compiler..."
  
  # Try to compile the modified files
  if npx tsc --noEmit 2>&1 | grep -q "error"; then
    print_fail "TypeScript compilation has errors"
    npx tsc --noEmit 2>&1 | head -20
  else
    print_pass "TypeScript compilation successful (no errors)"
  fi
}

##############################################################################
# Check Imports
##############################################################################

check_imports() {
  print_header "5. Checking Imports"

  local pageStateContextFile="/mnt/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/contexts/PageStateContext.tsx"

  # Check for Page type import
  if grep -q "import.*Page.*from" "$pageStateContextFile"; then
    print_pass "Page type imported"
  else
    print_fail "Page type import NOT found"
  fi

  # Check for PageBlock import
  if grep -q "import.*PageBlock.*from" "$pageStateContextFile"; then
    print_pass "PageBlock type imported"
  else
    print_fail "PageBlock type import NOT found"
  fi

  # Check for PageStatus import
  if grep -q "import.*PageStatus.*from" "$pageStateContextFile"; then
    print_pass "PageStatus enum imported"
  else
    print_fail "PageStatus enum import NOT found"
  fi
}

##############################################################################
# Check Default Values
##############################################################################

check_default_values() {
  print_header "6. Checking Default Page Values"

  local file="/mnt/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/contexts/PageStateContext.tsx"

  declare -a defaults=("id: ''" "title: 'Untitled Page'" "slug: 'untitled-page'" "content: {}" "blocks: []" "createdAt:" "updatedAt:")

  for default in "${defaults[@]}"; do
    if grep -q "$default" "$file"; then
      print_pass "Default value found: $default"
    else
      print_fail "Default value NOT found: $default"
    fi
  done
}

##############################################################################
# Check Documentation
##############################################################################

check_documentation() {
  print_header "7. Checking Documentation Files"

  local docs_dir="/mnt/chikiet/kataoffical/shoprausach"

  declare -a docs=(
    "NEW_PAGE_BUG_FIX.md"
    "NEW_PAGE_SAVE_BUG_QUICK_FIX.md"
    "NEW_PAGE_TESTING_GUIDE.md"
    "NEW_PAGE_DEPLOYMENT_GUIDE.md"
  )

  for doc in "${docs[@]}"; do
    if [ -f "$docs_dir/$doc" ]; then
      print_pass "Documentation found: $doc"
    else
      print_fail "Documentation NOT found: $doc"
    fi
  done
}

##############################################################################
# Summary Report
##############################################################################

print_summary() {
  print_header "VERIFICATION SUMMARY"

  local total=$((PASS + FAIL))
  local percentage=$(( (PASS * 100) / total ))

  echo -e "Total Checks: ${BLUE}$total${NC}"
  echo -e "Passed: ${GREEN}$PASS${NC}"
  echo -e "Failed: ${RED}$FAIL${NC}"
  echo -e "Pass Rate: ${BLUE}$percentage%${NC}\n"

  if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}=================================${NC}"
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}The new page save bug fix is ready!${NC}"
    echo -e "${GREEN}=================================${NC}\n"
    return 0
  else
    echo -e "${RED}=================================${NC}"
    echo -e "${RED}✗ SOME CHECKS FAILED${NC}"
    echo -e "${RED}Please review the failures above${NC}"
    echo -e "${RED}=================================${NC}\n"
    return 1
  fi
}

##############################################################################
# Main Execution
##############################################################################

main() {
  echo -e "${BLUE}"
  echo "╔═════════════════════════════════════════════════════════════╗"
  echo "║   NEW PAGE SAVE BUG FIX - VERIFICATION SCRIPT               ║"
  echo "║   Verifying Phase 2 Bug Fix Implementation                  ║"
  echo "╚═════════════════════════════════════════════════════════════╝"
  echo -e "${NC}\n"

  # Change to workspace directory
  cd "/mnt/chikiet/kataoffical/shoprausach" || exit 1

  # Run all checks
  check_files
  check_code_changes
  check_fullscreen_changes
  check_typescript
  check_imports
  check_default_values
  check_documentation

  # Print summary
  print_summary
}

# Execute main function
main
exit_code=$?

print_info "For detailed testing, see: NEW_PAGE_TESTING_GUIDE.md"
print_info "For deployment guide, see: NEW_PAGE_DEPLOYMENT_GUIDE.md"
print_info "For quick reference, see: NEW_PAGE_SAVE_BUG_QUICK_FIX.md\n"

exit $exit_code
