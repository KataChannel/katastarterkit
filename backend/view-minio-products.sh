#!/bin/bash

# Script để xem danh sách sản phẩm đã được cập nhật với hình ảnh MinIO

echo "=================================================="
echo "🖼️  PRODUCTS WITH MINIO IMAGES"
echo "=================================================="
echo ""

cd "$(dirname "$0")"

# Run verification
node verify-image-upload.js

echo ""
echo "=================================================="
echo "📋 VIEW DETAILED REPORT"
echo "=================================================="
echo ""
echo "View full report:"
echo "  cat temp-images/upload-report.json | jq ."
echo ""
echo "View successful products:"
echo "  cat temp-images/upload-report.json | jq '[.[] | select(.status == \"success\")]'"
echo ""
echo "View failed products:"
echo "  cat temp-images/upload-report.json | jq '[.[] | select(.status == \"failed\")]'"
echo ""
echo "Count by status:"
echo "  cat temp-images/upload-report.json | jq '[.[] | .status] | group_by(.) | map({status: .[0], count: length})'"
echo ""
