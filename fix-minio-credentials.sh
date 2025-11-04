#!/bin/bash

# Fix Minio Access Key Issue & Restart Backend

echo "🔧 Fixing Minio credentials..."

# Update backend/.env
if [ -f "backend/.env" ]; then
    sed -i 's/MINIO_ACCESS_KEY=.*/MINIO_ACCESS_KEY=minio-admin/' backend/.env
    sed -i 's/MINIO_SECRET_KEY=.*/MINIO_SECRET_KEY=minio-secret-2025/' backend/.env
    echo "✅ Updated backend/.env"
fi

# Update .env.rausach
if [ -f ".env.rausach" ]; then
    sed -i 's/MINIO_ACCESS_KEY=.*/MINIO_ACCESS_KEY=minio-admin/' .env.rausach
    sed -i 's/MINIO_SECRET_KEY=.*/MINIO_SECRET_KEY=minio-secret-2025/' .env.rausach
    echo "✅ Updated .env.rausach"
fi

# Update .env.innerv2
if [ -f ".env.innerv2" ]; then
    sed -i 's/MINIO_ACCESS_KEY=.*/MINIO_ACCESS_KEY=minio-admin/' .env.innerv2
    sed -i 's/MINIO_SECRET_KEY=.*/MINIO_SECRET_KEY=minio-secret-2025/' .env.innerv2
    echo "✅ Updated .env.innerv2"
fi

echo ""
echo "✅ Minio credentials đã được cập nhật!"
echo ""
echo "📋 Thông tin Minio:"
echo "   Access Key: minio-admin"
echo "   Secret Key: minio-secret-2025"
echo "   Endpoint:   116.118.48.208:12007"
echo "   Console:    http://116.118.48.208:12008"
echo ""
echo "🔄 Bây giờ hãy restart backend:"
echo "   cd backend && npm run start:dev"
echo "   hoặc: cd backend && bun run start:dev"
