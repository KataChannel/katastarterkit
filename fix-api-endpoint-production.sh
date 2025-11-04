#!/bin/bash

# Script sửa lỗi API endpoint cho production
# Vấn đề: Frontend đang gọi https://api.rausachtrangia.com/graphql thay vì http://116.118.49.243:13001/graphql

set -e

echo "================================================"
echo "🔧 FIX API ENDPOINT FOR PRODUCTION"
echo "================================================"
echo ""
echo "📋 Chi tiết vấn đề:"
echo "   ❌ SAI:  https://api.rausachtrangia.com/graphql"
echo "   ✅ ĐÚNG: http://116.118.49.243:13001/graphql"
echo ""

# Bước 1: Kiểm tra cấu hình hiện tại
echo "🔍 Bước 1: Kiểm tra cấu hình hiện tại..."
echo ""
echo "📄 .env.production:"
grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.production || echo "   ⚠️  Không tìm thấy NEXT_PUBLIC_GRAPHQL_ENDPOINT"
echo ""
echo "📄 .env.local:"
grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.local || echo "   ⚠️  Không tìm thấy NEXT_PUBLIC_GRAPHQL_ENDPOINT"
echo ""

# Bước 2: Xóa cache Next.js
echo "🗑️  Bước 2: Xóa cache Next.js..."
cd frontend
rm -rf .next/cache 2>/dev/null || true
rm -rf .next/static 2>/dev/null || true
rm -rf .next/server 2>/dev/null || true
echo "   ✅ Đã xóa cache"
echo ""
cd ..

# Bước 3: Kill process đang chạy trên port 13000
echo "🛑 Bước 3: Dừng frontend đang chạy trên port 13000..."
if lsof -ti:13000 > /dev/null 2>&1; then
    echo "   ⚠️  Phát hiện process trên port 13000"
    kill -9 $(lsof -ti:13000) 2>/dev/null || true
    echo "   ✅ Đã dừng process"
else
    echo "   ℹ️  Không có process nào đang chạy trên port 13000"
fi
echo ""

# Bước 4: Build lại với production env
echo "🔨 Bước 4: Build lại frontend với production environment..."
cd frontend
echo "   📦 Building với NODE_ENV=production..."
NODE_ENV=production bun run build
echo "   ✅ Build hoàn tất"
echo ""
cd ..

# Bước 5: Khởi động frontend với production mode
echo "🚀 Bước 5: Khởi động frontend..."
cd frontend
echo "   🌐 Starting trên port 13000..."
NODE_ENV=production bun run dev > /tmp/frontend-13000.log 2>&1 &
FRONTEND_PID=$!
echo "   ✅ Frontend đã khởi động (PID: $FRONTEND_PID)"
echo "   📋 Log file: /tmp/frontend-13000.log"
echo ""
cd ..

# Bước 6: Đợi frontend sẵn sàng
echo "⏳ Bước 6: Đợi frontend sẵn sàng..."
sleep 5

# Bước 7: Test API endpoint
echo "🧪 Bước 7: Kiểm tra API endpoint..."
echo ""
echo "   Testing GraphQL API..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://116.118.49.243:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}')

if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Backend API hoạt động tốt (HTTP $RESPONSE)"
else
    echo "   ⚠️  Backend API trả về HTTP $RESPONSE"
fi
echo ""

# Bước 8: Hiển thị kết quả
echo "================================================"
echo "✅ HOÀN TẤT KHẮC PHỤC"
echo "================================================"
echo ""
echo "📊 Thông tin:"
echo "   • Frontend URL:  http://116.118.49.243:13000"
echo "   • Backend API:   http://116.118.49.243:13001/graphql"
echo "   • Process ID:    $FRONTEND_PID"
echo "   • Log file:      /tmp/frontend-13000.log"
echo ""
echo "🔍 Kiểm tra:"
echo "   1. Mở trình duyệt: http://116.118.49.243:13000"
echo "   2. Mở DevTools > Network > XHR"
echo "   3. Tải lại trang"
echo "   4. Kiểm tra GraphQL request gọi đến:"
echo "      ✅ http://116.118.49.243:13001/graphql"
echo "      ❌ KHÔNG PHẢI: https://api.rausachtrangia.com/graphql"
echo ""
echo "📝 Xem log:"
echo "   tail -f /tmp/frontend-13000.log"
echo ""
echo "🛑 Dừng frontend:"
echo "   kill $FRONTEND_PID"
echo ""
echo "================================================"
