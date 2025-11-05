#!/bin/bash

# ============================================================================
# Clean Up Backend - Remove Unused Modules
# Giữ lại chỉ: Auth, User, RBAC, Menu, Page Builder, Blog/Posts
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🧹 InnerBright Backend Cleanup${NC}"
echo -e "${YELLOW}Removing unused modules...${NC}"
echo ""

BACKEND_SRC="/chikiet/Innerbright/innerv2/backend/src"

# ============================================================================
# Modules to KEEP (Core Functionality)
# ============================================================================

KEEP_MODULES=(
  "auth"           # Authentication
  "user"           # User management
  "menu"           # Menu management
  "prisma"         # Database
  "common"         # Common utilities
  "config"         # Configuration
  "health"         # Health checks
  "logger"         # Logging
  "utils"          # Utilities
  "interceptors"   # NestJS interceptors
  "cache"          # Redis cache
  "redis"          # Redis client
  "minio"          # File storage
  "security"       # Security utilities
  "graphql"        # GraphQL setup
  "modules"        # Core NestJS modules
)

# ============================================================================
# Modules to REMOVE (E-commerce, LMS, etc.)
# ============================================================================

REMOVE_MODULES=(
  "ecommerce"      # E-commerce system
  "lms"            # Learning Management System  
  "ai"             # AI features
  "ai-training"    # AI training
  "chatbot"        # Chatbot
  "grok"           # Grok AI
  "callcenter"     # Call center
  "ketoan"         # Accounting
  "project"        # Project management
  "support-chat"   # Support chat
  "realtime"       # Realtime features
  "search"         # Advanced search
  "monitoring"     # Advanced monitoring
  "api"            # Extra API endpoints
  "controllers"    # Extra controllers
  "services"       # Extra services
  "scripts"        # Extra scripts
  "seed"           # Seed data (optional, can keep if needed)
)

# ============================================================================
# Backup
# ============================================================================

BACKUP_DIR="/chikiet/Innerbright/innerv2/backend_modules_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}📦 Creating backup at: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"

for module in "${REMOVE_MODULES[@]}"; do
  if [ -d "$BACKEND_SRC/$module" ]; then
    echo -e "  Backing up: $module"
    cp -r "$BACKEND_SRC/$module" "$BACKUP_DIR/"
  fi
done

echo -e "${GREEN}✓ Backup complete${NC}"
echo ""

# ============================================================================
# Remove Modules
# ============================================================================

echo -e "${YELLOW}🗑️  Removing unused modules...${NC}"

for module in "${REMOVE_MODULES[@]}"; do
  if [ -d "$BACKEND_SRC/$module" ]; then
    echo -e "  ${RED}Removing: $module${NC}"
    rm -rf "$BACKEND_SRC/$module"
  else
    echo -e "  ${YELLOW}Skip (not found): $module${NC}"
  fi
done

echo -e "${GREEN}✓ Modules removed${NC}"
echo ""

# ============================================================================
# Summary
# ============================================================================

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         CLEANUP COMPLETE!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}📦 Kept Modules (Core):${NC}"
for module in "${KEEP_MODULES[@]}"; do
  if [ -d "$BACKEND_SRC/$module" ]; then
    echo -e "  ✅ $module"
  fi
done

echo ""
echo -e "${RED}🗑️  Removed Modules:${NC}"
for module in "${REMOVE_MODULES[@]}"; do
  echo -e "  ❌ $module"
done

echo ""
echo -e "${YELLOW}📁 Backup Location:${NC}"
echo -e "  $BACKUP_DIR"

echo ""
echo -e "${YELLOW}🔄 Next Steps:${NC}"
echo -e "  1. Review remaining modules in: ${BACKEND_SRC}"
echo -e "  2. Update app.module.ts to remove unused imports"
echo -e "  3. Update GraphQL schema"
echo -e "  4. Run: bun run build"
echo -e "  5. Run: bun run dev (test)"
echo ""
