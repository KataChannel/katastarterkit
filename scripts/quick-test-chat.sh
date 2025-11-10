#!/bin/bash
# ============================================================================
# QUICK TEST: Chat Membership Bug
# ============================================================================
#
# Script này test toàn bộ chat membership logic
# Chạy sau khi fix để verify
#
# Usage: ./scripts/quick-test-chat.sh

echo ""
echo "🧪 TESTING CHAT MEMBERSHIP BUG FIX"
echo "======================================"
echo ""

# Test 1: Database integrity
echo "📊 Test 1: Database Integrity"
echo "------------------------------"
bun scripts/test-chat-membership.ts
TEST1_EXIT=$?

if [ $TEST1_EXIT -eq 0 ]; then
    echo "✅ Database tests PASSED"
else
    echo "❌ Database tests FAILED"
    echo ""
    echo "🔧 Đang chạy fix script..."
    bun scripts/fix-project-owners-as-members.ts
fi

echo ""
echo "======================================"
echo ""

# Test 2: Frontend build check
echo "📦 Test 2: Frontend Build Check"
echo "------------------------------"
cd frontend
bun run build --dry-run 2>&1 | grep -E "(error|warning)" | head -10
BUILD_EXIT=$?
cd ..

if [ $BUILD_EXIT -eq 0 ]; then
    echo "⚠️  Build có warnings/errors"
else
    echo "✅ Build clean"
fi

echo ""
echo "======================================"
echo ""

# Test 3: Backend health
echo "🏥 Test 3: Backend Health"
echo "------------------------------"

# Check if backend is running
BACKEND_RUNNING=$(lsof -ti:12001)
if [ -z "$BACKEND_RUNNING" ]; then
    echo "⚠️  Backend không chạy trên port 12001"
    echo "   Khởi động với: ./run.sh rausach"
else
    echo "✅ Backend đang chạy (PID: $BACKEND_RUNNING)"
fi

echo ""
echo "======================================"
echo ""

# Summary
echo "📋 SUMMARY"
echo "------------------------------"
echo ""
echo "✅ Fixes Applied:"
echo "   1. ChatPanel callback handler"
echo "   2. Error UI with Vietnamese"
echo "   3. Debug logging"
echo "   4. Socket error handler"
echo ""
echo "📝 Files Changed:"
echo "   - frontend/src/components/project-management/ChatPanel.tsx"
echo "   - frontend/src/hooks/useProjects.dynamic.ts"
echo ""
echo "🧰 Debug Tools:"
echo "   - scripts/test-chat-membership.ts"
echo "   - scripts/debug-project-membership.ts"
echo "   - scripts/debug-jwt-token.ts"
echo "   - scripts/fix-project-owners-as-members.ts"
echo ""
echo "📖 Documentation:"
echo "   - FIX_CHAT_NOT_PROJECT_MEMBER_ERROR.md"
echo ""
echo "🎯 Next Steps:"
echo "   1. Start backend: ./run.sh rausach"
echo "   2. Start frontend: cd frontend && bun dev"
echo "   3. Open browser console (F12)"
echo "   4. Navigate to project chat"
echo "   5. Check console for debug logs:"
echo "      [ChatPanel] 🔍 Debug: { userId, projectId }"
echo "      [ChatPanel] 📩 Join response: { success: true }"
echo ""
echo "======================================"
echo ""
