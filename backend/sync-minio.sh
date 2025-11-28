#!/bin/bash

# Helper script to sync MinIO files to database

echo "=================================================="
echo "🔄 SYNC MINIO FILES TO DATABASE"
echo "=================================================="
echo ""

cd "$(dirname "$0")"

# Check if MinIO is running
echo "🔍 Checking MinIO connection..."
if timeout 5 bash -c 'cat < /dev/null > /dev/tcp/116.118.49.243/12007' 2>/dev/null; then
    echo "   ✅ MinIO is accessible"
else
    echo "   ❌ Cannot connect to MinIO (116.118.49.243:12007)"
    echo "   Please make sure MinIO is running"
    exit 1
fi

echo ""
echo "▶️  Starting sync..."
echo ""

# Run sync script
bun run sync-minio-to-db.ts

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Sync completed successfully!"
    echo ""
    echo "📁 Files are now available in:"
    echo "   → http://localhost:12000/admin/filemanager (local)"
    echo "   → https://shop.rausachtrangia.com/admin/filemanager (production)"
else
    echo "❌ Sync failed with exit code: $EXIT_CODE"
    exit $EXIT_CODE
fi

echo ""
echo "=================================================="
