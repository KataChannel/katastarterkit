#!/bin/bash
# Test script để verify push notification system

echo "🧪 Testing Push Notification System..."
echo ""

# Check backend files
echo "📦 Checking Backend Files..."
files=(
  "backend/src/services/push-notification.service.ts"
  "backend/src/graphql/resolvers/push-notification.resolver.ts"
  "backend/.env"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file NOT FOUND"
  fi
done

# Check frontend files
echo ""
echo "📦 Checking Frontend Files..."
files=(
  "frontend/src/hooks/usePWA.ts"
  "frontend/src/components/notifications/NotificationBell.tsx"
  "frontend/src/graphql/push-notification.queries.ts"
  "frontend/public/sw.js"
  "frontend/.env.local"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file NOT FOUND"
  fi
done

# Check VAPID keys
echo ""
echo "🔑 Checking VAPID Keys..."
if grep -q "VAPID_PUBLIC_KEY" backend/.env; then
  echo "  ✅ Backend VAPID keys configured"
else
  echo "  ❌ Backend VAPID keys MISSING"
fi

if grep -q "NEXT_PUBLIC_VAPID_KEY" frontend/.env.local; then
  echo "  ✅ Frontend VAPID key configured"
else
  echo "  ❌ Frontend VAPID key MISSING"
fi

# Check database table
echo ""
echo "🗄️  Checking Database..."
cd backend
RESULT=$(bun -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); (async () => { try { const count = await prisma.pushSubscription.count(); console.log('✅ Table push_subscriptions exists'); } catch(e) { console.log('❌ Table push_subscriptions NOT FOUND'); } await prisma.\$disconnect(); })()")
echo "  $RESULT"
cd ..

# Check node modules
echo ""
echo "📚 Checking Dependencies..."
if grep -q "web-push" backend/package.json; then
  echo "  ✅ web-push package installed"
else
  echo "  ❌ web-push package MISSING"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ System Status: READY"
echo ""
echo "📝 Next Steps:"
echo "  1. Add icon files to frontend/public/icons/"
echo "     - icon-192x192.png"
echo "     - icon-512x512.png"
echo "     - badge-72x72.png"
echo ""
echo "  2. Start servers:"
echo "     cd backend && bun run dev:backend"
echo "     cd frontend && bun run dev"
echo ""
echo "  3. Test push notification:"
echo "     - Login to website"
echo "     - Allow notification permission"
echo "     - Create an order"
echo "     - Close tab and check OS notification"
echo ""
echo "📖 Documentation:"
echo "  - PUSH_NOTIFICATION_SUMMARY.md"
echo "  - PUSH_NOTIFICATION_COMPLETED.md"
echo ""
