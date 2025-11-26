#!/bin/bash

# ============================================================================
# Rollback Script
# Quickly rollback to previous deployment if issues occur
# ============================================================================

set -e

SERVER="root@116.118.49.243"
REMOTE_DIR="/root/shoprausach"

echo "🔄 Rollback Deployment"
echo "======================"
echo ""

echo "⚠️  This will:"
echo "  1. Stop current containers"
echo "  2. Restore previous images (if available)"
echo "  3. Restart services with previous version"
echo ""

read -p "Continue with rollback? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Rollback cancelled"
    exit 0
fi

echo ""
echo "🔄 Performing rollback..."

ssh $SERVER << 'ENDSSH'
    set -e
    cd /root/shoprausach
    
    echo "  → Checking for backup images..."
    BACKEND_PREV=$(docker images -q rausach-backend:previous 2>/dev/null)
    FRONTEND_PREV=$(docker images -q rausach-frontend:previous 2>/dev/null)
    
    if [ -z "$BACKEND_PREV" ] && [ -z "$FRONTEND_PREV" ]; then
        echo "  ❌ No previous images found for rollback!"
        echo "     Deploy at least once before rollback is available."
        exit 1
    fi
    
    echo "  → Stopping current containers..."
    docker compose -f docker-compose.hybrid.yml down
    
    if [ ! -z "$BACKEND_PREV" ]; then
        echo "  → Restoring previous backend..."
        docker tag rausach-backend:previous rausach-backend:latest
    else
        echo "  ⚠️  No previous backend image (keeping current)"
    fi
    
    if [ ! -z "$FRONTEND_PREV" ]; then
        echo "  → Restoring previous frontend..."
        docker tag rausach-frontend:previous rausach-frontend:latest
    else
        echo "  ⚠️  No previous frontend image (keeping current)"
    fi
    
    echo "  → Starting services with previous version..."
    docker compose -f docker-compose.hybrid.yml up -d
    
    echo "  → Waiting for services..."
    sleep 20
    
    echo ""
    echo "📊 Container Status:"
    docker compose -f docker-compose.hybrid.yml ps
    
    echo ""
    echo "📦 Project Images:"
    docker images | grep -E "REPOSITORY|rausach-"
    
ENDSSH

echo ""
echo "✅ Rollback completed!"
echo ""
echo "🌐 Check services:"
echo "   Frontend:  http://116.118.49.243:12000"
echo "   Backend:   http://116.118.49.243:12001/graphql"
