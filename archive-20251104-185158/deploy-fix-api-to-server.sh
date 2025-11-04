#!/bin/bash

# Script build và deploy frontend với API endpoint ĐÚNG lên server
# Sửa lỗi: Frontend gọi sai API từ https://api.rausachtrangia.com/graphql

set -e

echo "================================================"
echo "🚀 BUILD & DEPLOY FRONTEND FIX API TO SERVER"
echo "================================================"
echo ""

SERVER="root@116.118.49.243"
LOCAL_FRONTEND="/mnt/chikiet/kataoffical/shoprausach/frontend"
SERVER_PATH="/root/appfinal/frontend"

# Bước 1: Kiểm tra .env.production local
echo "📋 Bước 1: Kiểm tra cấu hình local..."
cd $LOCAL_FRONTEND

if ! grep -q "NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:13001/graphql" .env.production; then
    echo "   ⚠️  .env.production có endpoint SAI, đang sửa..."
    sed -i 's|NEXT_PUBLIC_GRAPHQL_ENDPOINT=.*|NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:13001/graphql|g' .env.production
fi

echo "   ✅ Cấu hình:"
grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" .env.production
echo ""

# Bước 2: Xóa build cũ
echo "🗑️  Bước 2: Xóa build cũ..."
rm -rf .next
echo "   ✅ Đã xóa .next"
echo ""

# Bước 3: Build với production config
echo "🔨 Bước 3: Build frontend (có thể mất 2-3 phút)..."
NODE_ENV=production bun run build
echo "   ✅ Build hoàn tất"
echo ""

# Bước 4: Copy file .env lên server
echo "📤 Bước 4: Copy .env.production lên server..."
scp .env.production $SERVER:$SERVER_PATH/.env.production
echo "   ✅ Đã copy .env.production"
echo ""

# Bước 5: Sync build folder lên server
echo "📤 Bước 5: Sync build files lên server (có thể mất vài phút)..."
echo "   Syncing .next/standalone..."
rsync -avz --delete .next/standalone/ $SERVER:$SERVER_PATH/.next/standalone/
echo "   Syncing .next/static..."
rsync -avz --delete .next/static/ $SERVER:$SERVER_PATH/.next/static/
echo "   Syncing public..."
rsync -avz --delete public/ $SERVER:$SERVER_PATH/public/
echo "   ✅ Đã sync tất cả files"
echo ""

# Bước 6: Rebuild Docker image
echo "🐳 Bước 6: Rebuild Docker image..."
ssh $SERVER "cd /root/appfinal && docker-compose -f docker-compose.hybrid.yml build --no-cache tazagroup-frontend"
echo "   ✅ Đã rebuild image"
echo ""

# Bước 7: Recreate container
echo "🔄 Bước 7: Recreate container..."
ssh $SERVER "cd /root/appfinal && docker-compose -f docker-compose.hybrid.yml up -d tazagroup-frontend"
echo "   ✅ Container đã được tạo lại"
echo ""

# Bước 8: Đợi container sẵn sàng
echo "⏳ Bước 8: Đợi container khởi động..."
sleep 15

# Bước 9: Kiểm tra kết quả
echo "🧪 Bước 9: Kiểm tra kết quả..."
echo ""
echo "   Container status:"
ssh $SERVER "docker ps | grep tazagroup-frontend"
echo ""
echo "   Environment variables:"
ssh $SERVER "docker exec tazagroup-frontend printenv | grep NEXT_PUBLIC_GRAPHQL"
echo ""

# Bước 10: Test API endpoint
echo "🌐 Bước 10: Test frontend..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://116.118.49.243:13000)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Frontend phản hồi HTTP $RESPONSE"
else
    echo "   ⚠️  Frontend phản hồi HTTP $RESPONSE"
fi
echo ""

echo "================================================"
echo "✅ HOÀN TẤT DEPLOYMENT"
echo "================================================"
echo ""
echo "📊 Thông tin:"
echo "   • Frontend: http://116.118.49.243:13000"
echo "   • API: http://116.118.49.243:13001/graphql"
echo ""
echo "🔍 Kiểm tra trên browser:"
echo "   1. Mở: http://116.118.49.243:13000"
echo "   2. F12 → Network → XHR/Fetch"
echo "   3. Reload: Ctrl+Shift+R"
echo "   4. Xác nhận GraphQL calls đến:"
echo "      ✅ http://116.118.49.243:13001/graphql"
echo ""
echo "📝 Xem logs:"
echo "   ssh root@116.118.49.243 'docker logs -f tazagroup-frontend'"
echo ""
