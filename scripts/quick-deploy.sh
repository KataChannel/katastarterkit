#!/bin/bash

# ============================================================================
# Quick Deploy
# Quickly deploy a specific domain to production
# Usage: ./scripts/quick-deploy.sh [rausach|tazagroup|timona]
# ============================================================================

DOMAIN=${1:-rausach}

case $DOMAIN in
    rausach|r)
        echo "🚀 Deploying RAUSACH..."
        cd "$(dirname "$0")/.." && bun run deploy:rausach
        ;;
    tazagroup|t)
        echo "🚀 Deploying TAZAGROUP..."
        cd "$(dirname "$0")/.." && bun run deploy:tazagroup
        ;;
    timona|m)
        echo "🚀 Deploying TIMONA..."
        cd "$(dirname "$0")/.." && bun run deploy:timona
        ;;
    *)
        echo "❌ Invalid domain: $DOMAIN"
        echo "Usage: $0 [rausach|tazagroup|timona]"
        echo "   or: $0 [r|t|m]"
        exit 1
        ;;
esac
