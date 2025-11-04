#!/bin/bash

# Script kiểm tra API endpoint đang được sử dụng

echo "================================================"
echo "🔍 KIỂM TRA API ENDPOINT"
echo "================================================"
echo ""

# Kiểm tra các file cấu hình
echo "📄 Kiểm tra các file cấu hình:"
echo ""

echo "1️⃣  .env.production:"
if [ -f "frontend/.env.production" ]; then
    PROD_ENDPOINT=$(grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.production | cut -d'=' -f2)
    if [ "$PROD_ENDPOINT" = "http://116.118.48.208:13001/graphql" ]; then
        echo "   ✅ $PROD_ENDPOINT (ĐÚNG)"
    else
        echo "   ❌ $PROD_ENDPOINT (SAI - Cần sửa thành http://116.118.48.208:13001/graphql)"
    fi
else
    echo "   ⚠️  File không tồn tại"
fi
echo ""

echo "2️⃣  .env.local:"
if [ -f "frontend/.env.local" ]; then
    LOCAL_ENDPOINT=$(grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.local | cut -d'=' -f2)
    if [ "$LOCAL_ENDPOINT" = "http://116.118.48.208:13001/graphql" ]; then
        echo "   ✅ $LOCAL_ENDPOINT (ĐÚNG)"
    else
        echo "   ❌ $LOCAL_ENDPOINT (SAI - Cần sửa thành http://116.118.48.208:13001/graphql)"
    fi
else
    echo "   ⚠️  File không tồn tại"
fi
echo ""

echo "3️⃣  .env:"
if [ -f "frontend/.env" ]; then
    ENV_ENDPOINT=$(grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env | grep -v "^#" | cut -d'=' -f2)
    echo "   ℹ️  $ENV_ENDPOINT (Chỉ dùng khi .env.local không có)"
else
    echo "   ⚠️  File không tồn tại"
fi
echo ""

# Kiểm tra Next.js cache
echo "📦 Kiểm tra Next.js build:"
if [ -d "frontend/.next" ]; then
    echo "   ⚠️  Cache tồn tại - Nên xóa và rebuild để áp dụng thay đổi"
    echo "   💡 Chạy: cd frontend && rm -rf .next && bun run build"
else
    echo "   ✅ Không có cache - Build mới sẽ sử dụng cấu hình mới"
fi
echo ""

# Kiểm tra process đang chạy
echo "🔄 Kiểm tra process đang chạy:"
if lsof -ti:13000 > /dev/null 2>&1; then
    PID=$(lsof -ti:13000)
    echo "   ⚠️  Frontend đang chạy trên port 13000 (PID: $PID)"
    echo "   💡 Cần restart để áp dụng thay đổi"
    echo "   💡 Chạy: kill -9 $PID && cd frontend && NODE_ENV=production bun run dev"
else
    echo "   ℹ️  Không có process nào đang chạy trên port 13000"
fi
echo ""

# Test backend API
echo "🧪 Test Backend API:"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://116.118.48.208:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}')

if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Backend API hoạt động tốt (HTTP $RESPONSE)"
else
    echo "   ❌ Backend API không phản hồi (HTTP $RESPONSE)"
    echo "   💡 Kiểm tra xem backend có đang chạy trên port 13001 không"
fi
echo ""

# Tóm tắt
echo "================================================"
echo "📊 TÓM TẮT"
echo "================================================"
echo ""
echo "✅ Cấu hình ĐÚNG nếu tất cả endpoint là:"
echo "   http://116.118.48.208:13001/graphql"
echo ""
echo "❌ Cấu hình SAI nếu có endpoint:"
echo "   https://api.rausachtrangia.com/graphql"
echo "   http://api.rausachtrangia.com/graphql"
echo "   http://localhost:*/graphql"
echo ""
echo "💡 Nếu cấu hình SAI, chạy script sửa lỗi:"
echo "   ./fix-api-endpoint-production.sh"
echo ""
