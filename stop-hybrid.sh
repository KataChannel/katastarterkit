#!/bin/bash

# Quick Stop Script - Hybrid Deployment
# Usage: ./stop-hybrid.sh [all|rausach|tazagroup]

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
    tazagroup)
        echo "🛑 Dừng TAZAGROUP domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" stop tazagroup-postgres tazagroup-backend tazagroup-frontend
        ;;
    *)
        echo "❌ Tham số không hợp lệ!"
        echo "Usage: ./stop-hybrid.sh [all|rausach|tazagroup]"
        echo ""
        echo "Examples:"
        echo "  ./stop-hybrid.sh all       # Dừng tất cả"
        echo "  ./stop-hybrid.sh rausach   # Dừng Rausach"
        echo "  ./stop-hybrid.sh tazagroup # Dừng Tazagroup"
        exit 1
        ;;
esac

echo "✅ Đã dừng!"
