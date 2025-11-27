#!/bin/bash

# ============================================================================
# Quick Development Start
# Quickly start development for a specific domain
# Usage: ./scripts/quick-dev.sh [rausach|tazagroup|timona]
# ============================================================================

DOMAIN=${1:-rausach}

case $DOMAIN in
    rausach|r)
        echo "🚀 Starting RAUSACH development..."
        cd "$(dirname "$0")/.." && bun run dev:rausach
        ;;
    tazagroup|t)
        echo "🚀 Starting TAZAGROUP development..."
        cd "$(dirname "$0")/.." && bun run dev:tazagroup
        ;;
    timona|m)
        echo "🚀 Starting TIMONA development..."
        cd "$(dirname "$0")/.." && bun run dev:timona
        ;;
    *)
        echo "❌ Invalid domain: $DOMAIN"
        echo "Usage: $0 [rausach|tazagroup|timona]"
        echo "   or: $0 [r|t|m]"
        exit 1
        ;;
esac
