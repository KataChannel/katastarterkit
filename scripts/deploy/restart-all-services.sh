#!/bin/bash

# Restart all services on production server
# Server: 116.118.49.243

set -e

SERVER="116.118.49.243"
SERVER_USER="root"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking and restarting services on ${SERVER}...${NC}"

ssh ${SERVER_USER}@${SERVER} << 'ENDSSH'
echo "========================================="
echo "🔍 Current Docker containers status:"
echo "========================================="
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "========================================="
echo "📊 System resources:"
echo "========================================="
free -h
df -h /

echo ""
echo "========================================="
echo "🔄 Restarting RAUSACH containers..."
echo "========================================="
cd /opt/shoprausach

# Check if containers exist and restart them
if docker ps -a | grep -q shopbackend; then
  echo "🔄 Restarting shopbackend..."
  docker restart shopbackend || docker start shopbackend
else
  echo "⚠️  shopbackend container not found!"
fi

if docker ps -a | grep -q shopfrontend; then
  echo "🔄 Restarting shopfrontend..."
  docker restart shopfrontend || docker start shopfrontend
else
  echo "⚠️  shopfrontend container not found!"
fi

echo ""
echo "========================================="
echo "🔄 Restarting TAZAGROUP containers..."
echo "========================================="
cd /opt/tazagroup

if docker ps -a | grep -q tazagroup-backend; then
  echo "🔄 Restarting tazagroup-backend..."
  docker restart tazagroup-backend || docker start tazagroup-backend
else
  echo "⚠️  tazagroup-backend container not found!"
fi

if docker ps -a | grep -q tazagroup-frontend; then
  echo "🔄 Restarting tazagroup-frontend..."
  docker restart tazagroup-frontend || docker start tazagroup-frontend
else
  echo "⚠️  tazagroup-frontend container not found!"
fi

echo ""
echo "========================================="
echo "🔄 Restarting infrastructure services..."
echo "========================================="
# Restart Redis and PostgreSQL if needed
docker restart shared-redis || true
docker restart shoppostgres || true
docker restart shared-minio || true

echo ""
echo "⏳ Waiting 10 seconds for services to start..."
sleep 10

echo ""
echo "========================================="
echo "✅ Final container status:"
echo "========================================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "========================================="
echo "📋 Recent logs from shopbackend:"
echo "========================================="
docker logs --tail 20 shopbackend 2>&1 || echo "No logs available"

echo ""
echo "========================================="
echo "📋 Recent logs from tazagroup-backend:"
echo "========================================="
docker logs --tail 20 tazagroup-backend 2>&1 || echo "No logs available"

ENDSSH

echo ""
echo -e "${GREEN}✅ Done! Check the status above.${NC}"
echo -e "${BLUE}💡 To check individual logs:${NC}"
echo "   ssh root@${SERVER} 'docker logs -f shopbackend'"
echo "   ssh root@${SERVER} 'docker logs -f tazagroup-backend'"
