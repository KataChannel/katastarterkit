#!/bin/bash

# Quick Logs Script - Hybrid Deployment
# Usage: ./logs-hybrid.sh [all|rausach|tazagroup]

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
        echo "📋 Xem logs TẤT CẢ services..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" logs -f --tail=100
        ;;
    rausach)
        echo "📋 Xem logs RAUSACH domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" logs -f --tail=100 rausach-postgres rausach-backend rausach-frontend
        ;;
    tazagroup)
        echo "📋 Xem logs TAZAGROUP domain..."
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" logs -f --tail=100 tazagroup-postgres tazagroup-backend tazagroup-frontend
        ;;
    *)
        echo "❌ Tham số không hợp lệ!"
        echo "Usage: ./logs-hybrid.sh [all|rausach|tazagroup]"
        echo ""
        echo "Examples:"
        echo "  ./logs-hybrid.sh all       # Logs tất cả"
        echo "  ./logs-hybrid.sh rausach   # Logs Rausach"
        echo "  ./logs-hybrid.sh tazagroup # Logs Tazagroup"
        exit 1
        ;;
esac
