#!/bin/bash

# ============================================================================
# Remove Tazagroup Orphan Containers
# Clean up old Tazagroup containers and volumes
# ============================================================================

SERVER="root@116.118.49.243"

echo "🗑️  Removing Tazagroup Containers"
echo "==================================="
echo ""

ssh $SERVER << 'ENDSSH'
    set -e
    
    echo "📦 Current containers:"
    docker ps -a | grep -E "tazagroup|NAME"
    echo ""
    
    read -p "Remove Tazagroup containers? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Cancelled"
        exit 0
    fi
    
    echo ""
    echo "🛑 Stopping Tazagroup containers..."
    docker stop tazagroup-frontend tazagroup-backend tazagroup-postgres 2>/dev/null || true
    
    echo "🗑️  Removing Tazagroup containers..."
    docker rm tazagroup-frontend tazagroup-backend tazagroup-postgres 2>/dev/null || true
    
    echo "🗑️  Removing Tazagroup volume..."
    docker volume rm shoprausach_tazagroup_postgres_data 2>/dev/null || true
    
    echo "🗑️  Removing Tazagroup images..."
    docker rmi shoprausach-tazagroup-backend shoprausach-tazagroup-frontend 2>/dev/null || true
    
    echo ""
    echo "✅ Tazagroup cleanup completed!"
    echo ""
    echo "📦 Remaining containers:"
    docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
    
ENDSSH

echo ""
echo "💡 Tip: Run ./cleanup-docker.sh to clean dangling images"
