#!/bin/bash

# QUICK FIX: Restart frontend với API endpoint đúng
# Chạy: ./quick-restart-frontend.sh

echo "🚀 QUICK RESTART FRONTEND (PORT 13000)"
echo "======================================"

# Kill process cũ
echo "🛑 Dừng frontend cũ..."
if lsof -ti:13000 > /dev/null 2>&1; then
    kill -9 $(lsof -ti:13000) 2>/dev/null
    echo "   ✅ Đã dừng process trên port 13000"
else
    echo "   ℹ️  Không có process nào đang chạy"
fi

# Xóa cache
echo "🗑️  Xóa cache..."
cd frontend
rm -rf .next/cache 2>/dev/null || true
echo "   ✅ Đã xóa cache"

# Khởi động với .env.local (có cấu hình đúng)
echo "🚀 Khởi động frontend..."
echo "   📝 Sử dụng: .env.local"
echo "   🌐 Port: 13000"
echo "   🔗 API: http://116.118.49.243:13001/graphql"

# Start trong background
nohup bun run dev > /tmp/frontend-13000.log 2>&1 &
PID=$!

echo "   ✅ Đã khởi động (PID: $PID)"
echo ""
echo "📋 Log file: /tmp/frontend-13000.log"
echo "   tail -f /tmp/frontend-13000.log"
echo ""
echo "🌐 Truy cập: http://116.118.49.243:13000"
echo ""
echo "🛑 Dừng: kill $PID"
echo ""
echo "======================================"
echo "✅ HOÀN TẤT"
