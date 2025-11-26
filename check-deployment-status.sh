#!/bin/bash

# ============================================================================
# Check Deployment Status on Server
# Quick health check for all services
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER="root@116.118.49.243"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📊 DEPLOYMENT STATUS CHECK                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

ssh $SERVER << 'ENDSSH'
    echo "🐳 Docker Containers:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAME|shop|shared"
    
    echo ""
    echo "🔍 Health Checks:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # PostgreSQL
    if docker exec shoppostgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "  ✅ PostgreSQL: Ready"
    else
        echo "  ❌ PostgreSQL: Not Ready"
    fi
    
    # Redis
    if docker exec shared-redis redis-cli ping 2>/dev/null | grep -q PONG; then
        echo "  ✅ Redis: Ready"
    else
        echo "  ❌ Redis: Not Ready"
    fi
    
    # Minio
    if docker ps | grep shared-minio | grep -q "healthy"; then
        echo "  ✅ Minio: Healthy"
    else
        echo "  ⚠️  Minio: Starting or Unhealthy"
    fi
    
    # Backend
    if docker ps | grep shopbackend | grep -q "healthy"; then
        echo "  ✅ Backend: Healthy"
    elif docker ps | grep shopbackend | grep -q "health: starting"; then
        echo "  ⏳ Backend: Starting..."
    else
        echo "  ❌ Backend: Unhealthy or Down"
    fi
    
    # Frontend
    if docker ps | grep shopfrontend | grep -q "healthy"; then
        echo "  ✅ Frontend: Healthy"
    elif docker ps | grep shopfrontend | grep -q "health: starting"; then
        echo "  ⏳ Frontend: Starting..."
    else
        echo "  ❌ Frontend: Unhealthy or Down"
    fi
    
    echo ""
    echo "🌐 Endpoint Tests:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Test Frontend
    if curl -sf http://localhost:12000 > /dev/null 2>&1; then
        echo "  ✅ Frontend (12000): OK"
    else
        echo "  ❌ Frontend (12000): FAIL"
    fi
    
    # Test Backend GraphQL
    if curl -sf http://localhost:12001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' 2>/dev/null | grep -q "Query"; then
        echo "  ✅ Backend GraphQL (12001): OK"
    else
        echo "  ❌ Backend GraphQL (12001): FAIL"
    fi
    
    echo ""
    echo "💾 Resource Usage:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Memory
    echo "Memory:"
    free -h | grep -E "Mem:" | awk '{printf "  Total: %s | Used: %s | Free: %s | Usage: %.1f%%\n", $2, $3, $4, ($3/$2)*100}'
    
    # Disk
    echo "Disk:"
    df -h / | grep -E "/dev" | awk '{printf "  Total: %s | Used: %s | Free: %s | Usage: %s\n", $2, $3, $4, $5}'
    
    echo ""
    echo "📅 Container Ages:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker ps --format "  {{.Names}}: {{.Status}}" | grep -E "shop|shared"
    
    echo ""
    echo "🔧 Docker Images:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker images | grep -E "REPOSITORY|rausach" | head -5
ENDSSH

echo ""
echo -e "${GREEN}Status check completed!${NC}"
echo ""
