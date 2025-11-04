#!/bin/bash

# Quick Deploy - For existing server setup
# Rebuilds images with optimized Dockerfile

set -e

SERVER="root@116.118.49.243"
REMOTE_DIR="/root/shoprausach"

echo "🚀 Quick Deploy - Optimized Images"
echo "===================================="

# Sync Dockerfile
echo "📤 Syncing optimized Dockerfile..."
rsync -avz backend/Dockerfile ${SERVER}:${REMOTE_DIR}/backend/

# Rebuild images on server
echo "🔨 Rebuilding backend images (multi-stage build)..."
ssh ${SERVER} << 'ENDSSH'
    cd /root/shoprausach
    
    # Build with new multi-stage Dockerfile
    time docker compose -f docker-compose.hybrid.yml build shopbackend tazagroup-backend
    
    echo ""
    echo "📊 New image sizes:"
    docker images --format "table {{.Repository}}\t{{.Size}}" | grep -E "REPOSITORY|shopbackend|tazagroup-backend"
ENDSSH

# Deploy
echo ""
echo "🚀 Deploying..."
ssh ${SERVER} << 'ENDSSH'
    cd /root/shoprausach
    
    docker compose -f docker-compose.hybrid.yml up -d --force-recreate --no-deps shopbackend tazagroup-backend
    
    echo "⏳ Waiting for backends to start..."
    sleep 20
    
    echo "🏥 Health check..."
    curl -sf http://localhost:12001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' && echo "✓ Shopbackend OK" || echo "✗ Shopbackend FAIL"
    curl -sf http://localhost:13001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' && echo "✓ Tazagroup backend OK" || echo "✗ Tazagroup backend FAIL"
ENDSSH

echo ""
echo "✅ Deployment complete!"
