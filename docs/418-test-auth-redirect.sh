#!/bin/bash

# Auto-detect project path
if [ -d "/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/chikiet/kataoffical/shoprausach"
elif [ -d "/mnt/chikiet/kataoffical/shoprausach" ]; then
    PROJECT_PATH="/mnt/chikiet/kataoffical/shoprausach"
else
    echo "❌ Error: Cannot find project directory!"
    exit 1
fi

echo "========================================"
echo "🔐 TEST AUTH REDIRECT CONFIGURATION"
echo "========================================"
echo "📂 Using path: $PROJECT_PATH"
echo ""

echo "📋 Kiểm tra AUTH settings trong database..."
echo ""
cd "$PROJECT_PATH/backend" && bun run test-auth-settings.ts
echo ""

echo "✅ Test hoàn tất!"
echo ""
echo "🔍 Để test redirect thực tế:"
echo "   1. Mở browser và vào: http://localhost:3000/login"
echo "   2. Đăng nhập với tài khoản ADMIN"
echo "   3. Kiểm tra xem có redirect đến /admin không"
echo "   4. Vào /admin/settings/website -> tab AUTH"
echo "   5. Thay đổi 'Redirect cho ADMIN' thành /dashboard"
echo "   6. Lưu và đăng xuất"
echo "   7. Đăng nhập lại và kiểm tra redirect mới"
echo ""
echo "📝 Các settings quan trọng:"
echo "   - auth_login_redirect: Default redirect cho mọi user"
echo "   - auth_role_based_redirect: Bật/tắt redirect theo role"
echo "   - auth_redirect_admin: Redirect cho ADMIN"
echo "   - auth_redirect_user: Redirect cho USER"
echo "   - auth_redirect_guest: Redirect cho GUEST"
echo ""
