#!/bin/bash

# ============================================================================
# Clean Up Frontend - Remove Unused Features
# Giữ lại chỉ: Auth, User, Menu, Page Builder, Blog
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🧹 InnerBright Frontend Cleanup${NC}"
echo -e "${YELLOW}Removing unused features...${NC}"
echo ""

FRONTEND_SRC="/chikiet/Innerbright/innerv2/frontend/src"

# ============================================================================
# Directories to KEEP
# ============================================================================

KEEP_DIRS=(
  "app/(auth)"       # Authentication pages
  "app/(public)"     # Public pages (blog, posts)
  "app/(website)"    # Website pages (page builder)
  "app/admin"        # Admin dashboard
  "app/api"          # API routes
  "components"       # All components (will clean individually)
  "lib"              # Utilities
  "styles"           # Styles
  "hooks"            # Custom hooks
  "contexts"         # React contexts
  "types"            # TypeScript types
)

# ============================================================================
# Directories/Features to REMOVE
# ============================================================================

REMOVE_DIRS=(
  "app/lms"              # Learning Management System
  "app/(projects)"       # Project management
  "app/ketoan"           # Accounting
  "app/affiliate-access" # Affiliate system
  "app/maintenance"      # Maintenance page (optional)
  "app/demo"             # Demo pages
)

# Component subdirectories to remove
REMOVE_COMPONENT_DIRS=(
  "components/lms"         # LMS components
  "components/ecommerce"   # E-commerce components
  "components/projects"    # Project components
  "components/tasks"       # Task components
  "components/affiliate"   # Affiliate components
  "components/analytics"   # Analytics components
  "components/chatbot"     # Chatbot components
  "components/ai"          # AI components
)

# ============================================================================
# Backup
# ============================================================================

BACKUP_DIR="/chikiet/Innerbright/innerv2/frontend_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}📦 Creating backup at: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"

# Backup app directories
for dir in "${REMOVE_DIRS[@]}"; do
  if [ -d "$FRONTEND_SRC/$dir" ]; then
    echo -e "  Backing up: $dir"
    mkdir -p "$BACKUP_DIR/$(dirname $dir)"
    cp -r "$FRONTEND_SRC/$dir" "$BACKUP_DIR/$dir"
  fi
done

# Backup component directories
for dir in "${REMOVE_COMPONENT_DIRS[@]}"; do
  if [ -d "$FRONTEND_SRC/$dir" ]; then
    echo -e "  Backing up: $dir"
    mkdir -p "$BACKUP_DIR/$(dirname $dir)"
    cp -r "$FRONTEND_SRC/$dir" "$BACKUP_DIR/$dir"
  fi
done

echo -e "${GREEN}✓ Backup complete${NC}"
echo ""

# ============================================================================
# Remove App Directories
# ============================================================================

echo -e "${YELLOW}🗑️  Removing unused app directories...${NC}"

for dir in "${REMOVE_DIRS[@]}"; do
  if [ -d "$FRONTEND_SRC/$dir" ]; then
    echo -e "  ${RED}Removing: $dir${NC}"
    rm -rf "$FRONTEND_SRC/$dir"
  else
    echo -e "  ${YELLOW}Skip (not found): $dir${NC}"
  fi
done

echo -e "${GREEN}✓ App directories removed${NC}"
echo ""

# ============================================================================
# Remove Component Directories
# ============================================================================

echo -e "${YELLOW}🗑️  Removing unused component directories...${NC}"

for dir in "${REMOVE_COMPONENT_DIRS[@]}"; do
  if [ -d "$FRONTEND_SRC/$dir" ]; then
    echo -e "  ${RED}Removing: $dir${NC}"
    rm -rf "$FRONTEND_SRC/$dir"
  else
    echo -e "  ${YELLOW}Skip (not found): $dir${NC}"
  fi
done

echo -e "${GREEN}✓ Component directories removed${NC}"
echo ""

# ============================================================================
# Summary
# ============================================================================

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         FRONTEND CLEANUP COMPLETE!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}📦 Kept Features:${NC}"
echo -e "  ✅ Authentication (login, register)"
echo -e "  ✅ User Management"
echo -e "  ✅ Menu Management"
echo -e "  ✅ Page Builder"
echo -e "  ✅ Blog/Posts System"
echo -e "  ✅ Admin Dashboard"

echo ""
echo -e "${RED}🗑️  Removed Features:${NC}"
for dir in "${REMOVE_DIRS[@]}"; do
  echo -e "  ❌ $dir"
done
for dir in "${REMOVE_COMPONENT_DIRS[@]}"; do
  echo -e "  ❌ $dir"
done

echo ""
echo -e "${YELLOW}📁 Backup Location:${NC}"
echo -e "  $BACKUP_DIR"

echo ""
echo -e "${YELLOW}🔄 Next Steps:${NC}"
echo -e "  1. Review components in: $FRONTEND_SRC/components"
echo -e "  2. Update navigation/menu to remove unused links"
echo -e "  3. Update API calls to match new backend"
echo -e "  4. Run: bun run build"
echo -e "  5. Run: bun run dev (test)"
echo ""
