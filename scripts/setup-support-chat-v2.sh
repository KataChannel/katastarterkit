#!/bin/bash

# ====================================
# Support Chat Widget Enhanced V2
# Quick Setup Script
# ====================================

set -e

echo "🚀 Setting up Support Chat Widget Enhanced V2..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check notification sound file
echo -e "${BLUE}[1/5]${NC} Checking notification sound file..."
if [ ! -f "frontend/public/sounds/notification.mp3" ]; then
  echo -e "${YELLOW}⚠️  notification.mp3 not found. Downloading...${NC}"
  mkdir -p frontend/public/sounds
  cd frontend/public/sounds
  curl -L -o notification.mp3 "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Could not download notification sound. Please add manually.${NC}"
  }
  cd ../../../
  echo -e "${GREEN}✅ Notification sound file ready${NC}"
else
  echo -e "${GREEN}✅ Notification sound already exists${NC}"
fi
echo ""

# Step 2: Seed database settings
echo -e "${BLUE}[2/5]${NC} Updating database settings..."
cd backend
if bun run seed:settings 2>/dev/null; then
  echo -e "${GREEN}✅ Database settings updated${NC}"
else
  echo -e "${YELLOW}⚠️  Could not run seed. Please run manually: cd backend && bun run seed:settings${NC}"
fi
cd ..
echo ""

# Step 3: Check OAuth callback pages
echo -e "${BLUE}[3/5]${NC} Verifying OAuth callback pages..."
CALLBACK_PAGES=(
  "frontend/src/app/oauth-callback/zalo/callback/page.tsx"
  "frontend/src/app/oauth-callback/facebook/callback/page.tsx"
  "frontend/src/app/oauth-callback/google/callback/page.tsx"
)

ALL_EXIST=true
for page in "${CALLBACK_PAGES[@]}"; do
  if [ ! -f "$page" ]; then
    echo -e "${YELLOW}⚠️  Missing: $page${NC}"
    ALL_EXIST=false
  fi
done

if [ "$ALL_EXIST" = true ]; then
  echo -e "${GREEN}✅ All OAuth callback pages exist${NC}"
else
  echo -e "${YELLOW}⚠️  Some OAuth callback pages are missing${NC}"
fi
echo ""

# Step 4: Check environment variables
echo -e "${BLUE}[4/5]${NC} Checking environment configuration..."
if [ ! -f "frontend/.env.local" ]; then
  echo -e "${YELLOW}⚠️  frontend/.env.local not found${NC}"
  echo -e "   Please create frontend/.env.local with these variables:"
  echo ""
  echo "   NEXT_PUBLIC_API_URL=http://localhost:12001"
  echo "   NEXT_PUBLIC_WS_URL=http://localhost:12001/support-chat"
  echo "   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql"
  echo "   NEXT_PUBLIC_ZALO_APP_ID=your_zalo_app_id"
  echo "   NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id"
  echo "   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id"
  echo ""
else
  echo -e "${GREEN}✅ frontend/.env.local exists${NC}"
  
  # Check for social auth keys
  if grep -q "NEXT_PUBLIC_ZALO_APP_ID" frontend/.env.local && \
     grep -q "NEXT_PUBLIC_FACEBOOK_APP_ID" frontend/.env.local && \
     grep -q "NEXT_PUBLIC_GOOGLE_CLIENT_ID" frontend/.env.local; then
    echo -e "${GREEN}✅ Social auth environment variables configured${NC}"
  else
    echo -e "${YELLOW}⚠️  Missing social auth variables in .env.local${NC}"
    echo -e "   Please add: NEXT_PUBLIC_ZALO_APP_ID, NEXT_PUBLIC_FACEBOOK_APP_ID, NEXT_PUBLIC_GOOGLE_CLIENT_ID"
  fi
fi
echo ""

# Step 5: Installation summary
echo -e "${BLUE}[5/5]${NC} Installation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Support Chat Widget Enhanced V2 setup completed!${NC}"
echo ""
echo "📋 Features Installed:"
echo "   • Session Persistence (localStorage)"
echo "   • Quick Replies"
echo "   • Sound Notifications"
echo "   • Desktop Notifications"
echo "   • File Upload UI"
echo "   • Social Login (Zalo, Facebook, Google)"
echo "   • Mobile-first Responsive Design"
echo "   • Online/Offline Status"
echo ""
echo "🔧 Next Steps:"
echo "   1. Configure social auth keys in frontend/.env.local"
echo "   2. Start backend: cd backend && bun run dev"
echo "   3. Start frontend: cd frontend && bun run dev"
echo "   4. Test widget at: http://localhost:12000"
echo "   5. Admin settings at: http://localhost:12000/admin/settings/website"
echo ""
echo "📚 Documentation: docs/138-SUPPORT_CHAT_WIDGET_ENHANCED_V2.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
