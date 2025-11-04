#!/bin/bash

echo "=========================================="
echo "🔍 VERIFY AUTH REDIRECT FIX"
echo "=========================================="
echo ""

echo "1️⃣ Checking database settings..."
echo ""
cd /chikiet/kataoffical/shoprausach/backend && bun run test-auth-settings.ts 2>&1 | grep -A 2 "auth_login_redirect\|auth_redirect_admin\|auth_redirect_user\|auth_role_based"
echo ""

echo "2️⃣ Searching for hardcoded /admin redirects in auth flow..."
echo ""
cd /chikiet/kataoffical/shoprausach
grep -n "router.push.*'/admin'" \
  frontend/src/app/\(auth\)/login/page.tsx \
  frontend/src/app/\(auth\)/register/page.tsx \
  frontend/src/components/auth/GoogleLoginButton.tsx \
  frontend/src/components/auth/FacebookLoginButton.tsx 2>/dev/null || echo "✅ No hardcoded /admin found!"
echo ""

echo "3️⃣ Checking if redirectUrl is being used..."
echo ""
grep -n "redirectUrl" \
  frontend/src/app/\(auth\)/login/page.tsx \
  frontend/src/app/\(auth\)/register/page.tsx \
  frontend/src/components/auth/GoogleLoginButton.tsx \
  frontend/src/components/auth/FacebookLoginButton.tsx 2>/dev/null | head -10
echo ""

echo "=========================================="
echo "✅ VERIFICATION COMPLETE"
echo "=========================================="
echo ""
echo "📋 Expected behavior:"
echo "   - All 7 redirect settings point to /lms"
echo "   - Role-based redirect is enabled (true)"
echo "   - No hardcoded /admin in auth flow"
echo "   - All login methods use redirectUrl from backend"
echo ""
echo "🧪 To test:"
echo "   1. Go to http://localhost:3000/login"
echo "   2. Login with any account"
echo "   3. Should redirect to /lms (based on settings)"
echo ""
