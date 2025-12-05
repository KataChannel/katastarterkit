#!/bin/bash

echo "🕒 Đợi Google Drive đồng bộ permissions..."
echo ""

for i in {1..10}; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "⏱️  Lần thử $i/10 (đợi 30 giây mỗi lần)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  node test-google-drive-direct.js
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ THÀNH CÔNG! Google Drive đã sẵn sàng!"
    exit 0
  fi
  
  if [ $i -lt 10 ]; then
    echo ""
    echo "⏳ Đợi 30 giây rồi thử lại..."
    echo ""
    sleep 30
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❌ Sau 5 phút vẫn chưa kết nối được"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Vui lòng kiểm tra lại:"
echo "1. Folder URL có đúng không?"
echo "2. Service Account có trong danh sách 'Người có quyền truy cập'?"
echo "3. Quyền là 'Người chỉnh sửa' (Editor)?"
echo ""

exit 1
