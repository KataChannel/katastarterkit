#!/bin/bash

# ================================================================
# TEST GOOGLE DRIVE FOLDER PERMISSION
# ================================================================
# Script này test xem Service Account có quyền truy cập folder chưa
# ================================================================

cd "$(dirname "$0")"

echo ""
echo "🔍 Testing Google Drive Folder Permission..."
echo "=============================================="
echo ""

# Check if test script exists
if [ ! -f "backend/test-google-drive-direct.js" ]; then
  echo "❌ test-google-drive-direct.js not found!"
  exit 1
fi

# Extract Service Account email from .env
SERVICE_ACCOUNT_EMAIL=$(grep "client_email" backend/.env | grep -o '"client_email":"[^"]*"' | cut -d'"' -f4)

if [ -n "$SERVICE_ACCOUNT_EMAIL" ]; then
  echo "📧 Service Account: $SERVICE_ACCOUNT_EMAIL"
else
  echo "⚠️  Could not extract Service Account email"
  echo "📧 Service Account: app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com"
fi

echo ""
echo "🧪 Testing folder access..."
echo "---"
echo ""

# Run Node.js test with proper environment
cd backend && node test-google-drive-direct.js
exit_code=$?
cd ..

echo ""
echo "=============================================="
if [ $exit_code -eq 0 ]; then
  echo "✅ TEST PASSED - Folder accessible!"
  echo ""
  echo "Google Drive đã sẵn sàng sử dụng! 🎉"
else
  echo "❌ TEST FAILED - Cannot access folder"
  echo ""
  echo "📋 HƯỚNG DẪN SỬA:"
  echo "1. Copy email Service Account:"
  if [ -n "$SERVICE_ACCOUNT_EMAIL" ]; then
    echo "   $SERVICE_ACCOUNT_EMAIL"
  else
    echo "   app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com"
  fi
  echo ""
  echo "2. Mở folder Google Drive:"
  echo "   https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG"
  echo ""
  echo "3. Click 'Share' → Paste email → Chọn quyền 'Editor' → Click 'Send'"
  echo ""
  echo "4. Đợi 2-3 phút rồi chạy lại script này"
  echo ""
  echo "📖 Xem hướng dẫn chi tiết: fix-google-drive-permission.md"
fi
echo "=============================================="
echo ""

exit $exit_code
