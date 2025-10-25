#!/bin/bash

# Local git operations
git add .
git commit -m "update"
git push

# Remote server operations - sử dụng script tối ưu hóa
ssh root@116.118.49.243 << 'EOF'
cd shoprausach

# Pre-deployment checks
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "❌ Disk usage at ${DISK_USAGE}% - Cleanup needed"
    exit 1
fi

# Git pull
git pull

# Docker cleanup - Tránh treo server
echo "🧹 Cleaning Docker resources..."
docker compose down --timeout=30 2>/dev/null || true

# Prune unused resources
docker image prune -af --filter "until=72h" 2>/dev/null || true
docker volume prune -f 2>/dev/null || true
docker network prune -f 2>/dev/null || true

# Deploy với timeout và remove-orphans
echo "🚀 Starting deployment..."
timeout 600 docker compose -f 'docker-compose.yml' up -d --build --remove-orphans --pull missing

# Final cleanup
docker builder prune -af 2>/dev/null || true

# Health check
echo "🏥 Checking health..."
sleep 10
docker compose ps

echo "✅ Deployment completed"
EOF
