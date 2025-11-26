#!/bin/bash

# ============================================================================
# Docker Cleanup Script for Server
# Remove unused images, containers, and free up disk space
# ============================================================================

set -e

SERVER="root@116.118.49.243"

echo "🧹 Docker Cleanup on Server"
echo "============================"
echo ""

ssh $SERVER << 'ENDSSH'
    set -e
    
    echo "📊 Before Cleanup:"
    echo "==================="
    echo ""
    echo "🐳 Docker Disk Usage:"
    docker system df
    echo ""
    echo "💾 System Disk Usage:"
    df -h / | grep -E "Filesystem|/dev"
    echo ""
    
    echo "🗑️  Cleaning up..."
    echo "==================="
    echo ""
    
    # Remove stopped containers
    echo "  → Removing stopped containers..."
    STOPPED=$(docker ps -aq -f status=exited 2>/dev/null | wc -l)
    if [ "$STOPPED" -gt 0 ]; then
        docker rm $(docker ps -aq -f status=exited) 2>/dev/null || true
        echo "    ✓ Removed $STOPPED stopped containers"
    else
        echo "    ✓ No stopped containers"
    fi
    
    # Remove dangling images (only project images)
    echo "  → Removing dangling project images..."
    DANGLING=$(docker images -f "dangling=true" --filter "reference=rausach-*" -q 2>/dev/null | wc -l)
    if [ "$DANGLING" -gt 0 ]; then
        docker rmi $(docker images -f "dangling=true" --filter "reference=rausach-*" -q) 2>/dev/null || true
        echo "    ✓ Removed $DANGLING dangling project images"
    else
        echo "    ✓ No dangling project images"
    fi
    
    # Remove old project images (keep only 2 latest)
    echo "  → Removing old project images (keeping 2 latest)..."
    for image_type in backend frontend; do
        OLD_IMAGES=$(docker images "rausach-${image_type}" --format "{{.ID}}" | tail -n +3)
        if [ ! -z "$OLD_IMAGES" ]; then
            echo "$OLD_IMAGES" | xargs -r docker rmi 2>/dev/null || true
            echo "    ✓ Cleaned old rausach-${image_type} images"
        fi
    done
    
    # Remove build cache (only for rausach)
    echo "  → Removing build cache..."
    docker builder prune --filter "label=project=rausach" -f 2>/dev/null || true
    
    # Skip volumes and networks cleanup to preserve project data
    echo "  → Skipping volumes/networks (preserving project data)..."
    
    echo ""
    echo "📊 After Cleanup:"
    echo "==================="
    echo ""
    echo "🐳 Docker Disk Usage:"
    docker system df
    echo ""
    echo "💾 System Disk Usage:"
    df -h / | grep -E "Filesystem|/dev"
    echo ""
    
    echo "🐳 Running Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
    echo ""
    
    echo "📦 Docker Images:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | head -20
    
ENDSSH

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "💡 Tip: Run this script weekly to keep server clean"
