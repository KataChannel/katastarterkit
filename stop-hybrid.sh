#!/bin/bash

# Quick Stop Script - Hybrid Deployment
# Usage: ./stop-hybrid.sh [all|rausach|innerv2]

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
        echo "🛑 Dừng TẤT CẢ services..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" down
        ;;
    rausach)
        echo "🛑 Dừng RAUSACH domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" stop rausach-postgres rausach-backend rausach-frontend
        ;;
    innerv2)
        echo "🛑 Dừng INNERV2 domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" stop innerv2-postgres innerv2-backend innerv2-frontend
        ;;
    *)
        echo "❌ Tham số không hợp lệ!"
        echo "Usage: ./stop-hybrid.sh [all|rausach|innerv2]"
        echo ""
        echo "Examples:"
        echo "  ./stop-hybrid.sh all       # Dừng tất cả"
        echo "  ./stop-hybrid.sh rausach   # Dừng Rausach"
        echo "  ./stop-hybrid.sh innerv2 # Dừng Innerv2"
        exit 1
        ;;
esac

echo "✅ Đã dừng!"
