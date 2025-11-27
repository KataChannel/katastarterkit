#!/bin/bash

# ============================================================================
# Database Studio
# Open Prisma Studio for a specific domain
# Usage: ./scripts/db-studio.sh [rausach|tazagroup|timona]
# ============================================================================

DOMAIN=${1:-rausach}

case $DOMAIN in
    rausach|r)
        echo "🗄️  Opening Prisma Studio for RAUSACH..."
        cd "$(dirname "$0")/.." && bun run db:studio:rausach
        ;;
    tazagroup|t)
        echo "🗄️  Opening Prisma Studio for TAZAGROUP..."
        cd "$(dirname "$0")/.." && bun run db:studio:tazagroup
        ;;
    timona|m)
        echo "🗄️  Opening Prisma Studio for TIMONA..."
        cd "$(dirname "$0")/.." && bun run db:studio:timona
        ;;
    *)
        echo "❌ Invalid domain: $DOMAIN"
        echo "Usage: $0 [rausach|tazagroup|timona]"
        echo "   or: $0 [r|t|m]"
        exit 1
        ;;
esac
