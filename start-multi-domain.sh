#!/bin/bash

# Quick Start Script - Multi-Domain Deployment
# Usage: ./start-multi-domain.sh [all|rausach|innerv2]

set -e

# Auto-detect docker-compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

COMPOSE_FILE="docker-compose.multi-domain.yml"
MODE="${1:-all}"

case "$MODE" in
    all)
        echo "🚀 Khởi động TẤT CẢ services..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d
        ;;
    rausach)
        echo "🚀 Khởi động RAUSACH domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d postgres redis minio rausach-backend rausach-frontend
        ;;
    innerv2)
        echo "🚀 Khởi động INNERV2 domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d postgres redis minio innerv2-backend innerv2-frontend
        ;;
    *)
        echo "❌ Tham số không hợp lệ!"
        echo "Usage: ./start-multi-domain.sh [all|rausach|innerv2]"
        echo ""
        echo "Examples:"
        echo "  ./start-multi-domain.sh all       # Khởi động tất cả"
        echo "  ./start-multi-domain.sh rausach   # Chỉ Rausach"
        echo "  ./start-multi-domain.sh innerv2 # Chỉ Innerv2"
        exit 1
        ;;
esac

echo ""
echo "✅ Hoàn tất! Xem trạng thái:"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" ps
