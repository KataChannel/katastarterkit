#!/bin/bash

# Quick fix script for tazagroup frontend HOSTNAME issue
# Run this to restart frontend with correct HOSTNAME without rebuilding

set -e

SERVER="116.118.49.243"
SERVER_USER="root"

echo "🔧 Fixing TAZAGROUP frontend on ${SERVER}..."

ssh ${SERVER_USER}@${SERVER} << 'EOF'
echo "📍 Stopping frontend container..."
docker stop tazagroup-frontend || true
docker rm tazagroup-frontend || true

echo "🚀 Starting frontend with HOSTNAME=0.0.0.0..."
docker run -d \
  --name tazagroup-frontend \
  --restart unless-stopped \
  --network host \
  -e PORT=13000 \
  -e HOSTNAME=0.0.0.0 \
  tazagroup-frontend:latest

echo "⏳ Waiting for container to start..."
sleep 5

echo "📊 Container status:"
docker ps | grep tazagroup-frontend

echo "📋 Container logs (last 20 lines):"
docker logs --tail 20 tazagroup-frontend
EOF

echo "✅ Fix completed! Check http://app.tazagroup.vn"
