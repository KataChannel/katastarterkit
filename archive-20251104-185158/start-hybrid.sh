#!/bin/bash

# Quick Start Script - Hybrid Deployment
# Usage: ./start-hybrid.sh [all|rausach|tazagroup|shared]

set -e

# Auto-detect docker-compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

COMPOSE_FILE="docker-compose.hybrid.yml"
MODE="${1:-all}"

case "$MODE" in
    all)
        echo "🚀 Khởi động TẤT CẢ services..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d
        ;;
    rausach)
        echo "🚀 Khởi động RAUSACH domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d redis minio rausach-postgres rausach-backend rausach-frontend
        ;;
    tazagroup)
        echo "🚀 Khởi động TAZAGROUP domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d redis minio tazagroup-postgres tazagroup-backend tazagroup-frontend
        ;;
    shared)
        echo "🚀 Khởi động SHARED services (Redis + Minio)..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d redis minio
        ;;
    *)
        echo "❌ Tham số không hợp lệ!"
        echo "Usage: ./start-hybrid.sh [all|rausach|tazagroup|shared]"
        echo ""
        echo "Examples:"
        echo "  ./start-hybrid.sh all       # Khởi động tất cả"
        echo "  ./start-hybrid.sh rausach   # Chỉ Rausach"
        echo "  ./start-hybrid.sh tazagroup # Chỉ Tazagroup"
        echo "  ./start-hybrid.sh shared    # Chỉ Redis + Minio"
        exit 1
        ;;
esac

echo ""
echo "✅ Hoàn tất! Xem trạng thái:"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" ps
