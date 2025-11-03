#!/bin/bash

# Quick Status Script - Hybrid Deployment

set -e

# Auto-detect docker-compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

COMPOSE_FILE="docker-compose.hybrid.yml"

echo "📊 Trạng thái Containers:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" ps

echo ""
echo "💾 Sử dụng tài nguyên:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
CONTAINER_IDS=$($DOCKER_COMPOSE -f "$COMPOSE_FILE" ps -q 2>/dev/null)
if [ -n "$CONTAINER_IDS" ]; then
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" $CONTAINER_IDS
else
    echo "Không có container nào đang chạy"
fi

echo ""
echo "🌐 URLs truy cập:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Rausach:"
echo "  Frontend:  http://116.118.49.243:12000"
echo "  Backend:   http://116.118.49.243:12001/graphql"
echo "  Database:  116.118.49.243:12003"
echo ""
echo "Tazagroup:"
echo "  Frontend:  http://116.118.49.243:13000"
echo "  Backend:   http://116.118.49.243:13001/graphql"
echo "  Database:  116.118.49.243:13003"
echo ""
echo "Shared:"
echo "  Minio:     http://116.118.49.243:12008"
echo "  Redis:     116.118.49.243:12004"
