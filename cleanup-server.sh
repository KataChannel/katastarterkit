#!/bin/bash

# ============================================================================
# Server Cleanup Script - Free up disk space on 10GB disk
# Run on server: bash cleanup-server.sh
# ============================================================================

set -e

echo "🧹 Starting Server Cleanup"
echo "=========================="

# Show current usage
echo "📊 Current disk usage:"
df -h / | grep -E "Filesystem|/dev"

echo ""
echo "📦 Docker resource usage:"
docker system df

# ===== STEP 1: Remove unused containers =====
echo ""
echo "🗑️  Step 1: Removing stopped containers..."
REMOVED_CONTAINERS=$(docker container prune -f 2>&1 | grep "Total reclaimed" || echo "0B")
echo "  → $REMOVED_CONTAINERS"

# ===== STEP 2: Remove dangling images =====
echo ""
echo "🗑️  Step 2: Removing dangling images..."
REMOVED_IMAGES=$(docker image prune -f 2>&1 | grep "Total reclaimed" || echo "0B")
echo "  → $REMOVED_IMAGES"

# ===== STEP 3: Remove old images (keep last 2 versions) =====
echo ""
echo "🗑️  Step 3: Removing old images (keeping last 2 versions)..."
docker images --format "{{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | \
    grep -E "appfinal|rausach|tazagroup|timonaa" | \
    sort -k3 -r | \
    awk '{print $2}' | \
    tail -n +5 | \
    xargs -r docker rmi -f 2>&1 || echo "  No old images to remove"

# ===== STEP 4: Clean build cache =====
echo ""
echo "🗑️  Step 4: Cleaning Docker build cache (keep last 48h)..."
REMOVED_CACHE=$(docker builder prune -af --filter "until=48h" 2>&1 | grep "Total reclaimed" || echo "0B")
echo "  → $REMOVED_CACHE"

# ===== STEP 5: Remove unused volumes =====
echo ""
echo "🗑️  Step 5: Removing unused volumes..."
echo "  ⚠️  This will NOT remove named volumes (databases are safe)"
REMOVED_VOLUMES=$(docker volume prune -f 2>&1 | grep "Total reclaimed" || echo "0B")
echo "  → $REMOVED_VOLUMES"

# ===== STEP 6: Clear logs =====
echo ""
echo "🗑️  Step 6: Truncating Docker container logs..."
truncate -s 0 /var/lib/docker/containers/*/*-json.log 2>/dev/null || true
echo "  ✓ Container logs cleared"

# ===== STEP 7: Remove old backups =====
echo ""
echo "🗑️  Step 7: Removing old backups (keep last 3)..."
if [ -d "/root/appfinal/backups" ]; then
    cd /root/appfinal/backups
    ls -t | tail -n +4 | xargs -r rm -rf
    echo "  ✓ Old backups removed"
else
    echo "  No backup directory found"
fi

# ===== STEP 8: System cleanup =====
echo ""
echo "🗑️  Step 8: System package cache cleanup..."
apt-get clean 2>/dev/null || yum clean all 2>/dev/null || true
echo "  ✓ Package cache cleared"

# ===== Final summary =====
echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📊 Final disk usage:"
df -h / | grep -E "Filesystem|/dev"

echo ""
echo "📦 Final Docker usage:"
docker system df

echo ""
echo "💡 Recommendations:"
echo "  • Run this script weekly: crontab -e"
echo "  • Add: 0 2 * * 0 /root/cleanup-server.sh"
echo "  • Monitor disk: df -h /"
echo ""
