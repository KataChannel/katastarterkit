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

# Update .env.tazagroup
if [ -f ".env.tazagroup" ]; then
    sed -i 's/MINIO_ACCESS_KEY=.*/MINIO_ACCESS_KEY=minio-admin/' .env.tazagroup
    sed -i 's/MINIO_SECRET_KEY=.*/MINIO_SECRET_KEY=minio-secret-2025/' .env.tazagroup
    echo "✅ Updated .env.tazagroup"
fi

echo ""
echo "✅ Minio credentials đã được cập nhật!"
echo ""
echo "📋 Thông tin Minio:"
echo "   Access Key: minio-admin"
echo "   Secret Key: minio-secret-2025"
echo "   Endpoint:   116.118.49.243:12007"
echo "   Console:    http://116.118.49.243:12008"
echo ""
echo "🔄 Bây giờ hãy restart backend:"
echo "   cd backend && npm run start:dev"
echo "   hoặc: cd backend && bun run start:dev"
