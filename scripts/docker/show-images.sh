#!/bin/bash

# ============================================================================
# Show Project Docker Images
# Display only Rausach project images
# ============================================================================

SERVER="root@116.118.49.243"

echo "🐳 Rausach Project Images"
echo "=========================="
echo ""

echo "📍 Local Machine:"
echo "─────────────────"
docker images --filter "reference=rausach-*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

echo ""
echo "📍 Server (116.118.49.243):"
echo "────────────────────────────"
ssh $SERVER "docker images --filter 'reference=rausach-*' --format 'table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}'"

echo ""
echo "📊 Base Images (used by project):"
echo "──────────────────────────────────"
ssh $SERVER "docker images --filter 'reference=postgres:16-alpine' --filter 'reference=redis:7.4-alpine' --filter 'reference=minio/minio' --format 'table {{.Repository}}\t{{.Tag}}\t{{.Size}}'"
