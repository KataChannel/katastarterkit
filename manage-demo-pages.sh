#!/bin/bash

# Demo Pages Management Script
# 
# Usage:
#   ./manage-demo-pages.sh seed      # Seed demo pages
#   ./manage-demo-pages.sh cleanup   # Cleanup demo pages
#   ./manage-demo-pages.sh reseed    # Cleanup and reseed

set -e

BACKEND_DIR="backend"
SEED_SCRIPT="scripts/seed-demo-pages.ts"
CLEANUP_SCRIPT="scripts/cleanup-demo-pages.ts"

cd "$(dirname "$0")"

case "$1" in
  seed)
    echo "🌱 Seeding demo pages..."
    cd $BACKEND_DIR && npx ts-node $SEED_SCRIPT
    ;;
  
  cleanup)
    echo "🧹 Cleaning up demo pages..."
    cd $BACKEND_DIR && npx ts-node $CLEANUP_SCRIPT
    ;;
  
  reseed)
    echo "🔄 Reseeding demo pages (cleanup + seed)..."
    echo ""
    cd $BACKEND_DIR
    echo "Step 1/2: Cleanup..."
    npx ts-node $CLEANUP_SCRIPT
    echo ""
    echo "Step 2/2: Seed..."
    npx ts-node $SEED_SCRIPT
    ;;
  
  *)
    echo "Usage: $0 {seed|cleanup|reseed}"
    echo ""
    echo "Commands:"
    echo "  seed     - Create 3 demo pages (Home, About Us, Products)"
    echo "  cleanup  - Delete all demo pages"
    echo "  reseed   - Cleanup and create fresh demo pages"
    exit 1
    ;;
esac

echo ""
echo "✅ Done!"
