#!/bin/bash

# ============================================================================
# Pre-deployment Check - Verify Infrastructure is Ready
# Run this before deploying application
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
echo -e "${BLUE}║     🔍 PRE-DEPLOYMENT CHECK                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Checking infrastructure services on server...${NC}"
echo ""

ERRORS=0

# Check if containers exist and are running
ssh $SERVER << 'ENDSSH'
    echo "🔍 Checking required services..."
    echo ""
    
    # Check shoppostgres
    if docker ps | grep -q "shoppostgres"; then
        if docker ps | grep "shoppostgres" | grep -q "healthy\|Up"; then
            echo "  ✅ PostgreSQL (shoppostgres:12003) - Running"
        else
            echo "  ⚠️  PostgreSQL (shoppostgres:12003) - Unhealthy"
            exit 1
        fi
    else
        echo "  ❌ PostgreSQL (shoppostgres:12003) - NOT FOUND"
        exit 1
    fi
    
    # Check shared-redis
    if docker ps | grep -q "shared-redis"; then
        if docker ps | grep "shared-redis" | grep -q "healthy\|Up"; then
            echo "  ✅ Redis (shared-redis:12004) - Running"
        else
            echo "  ⚠️  Redis (shared-redis:12004) - Unhealthy"
            exit 1
        fi
    else
        echo "  ❌ Redis (shared-redis:12004) - NOT FOUND"
        exit 1
    fi
    
    # Check shared-minio
    if docker ps | grep -q "shared-minio"; then
        if docker ps | grep "shared-minio" | grep -q "healthy\|Up"; then
            echo "  ✅ Minio (shared-minio:12007) - Running"
        else
            echo "  ⚠️  Minio (shared-minio:12007) - Unhealthy"
            exit 1
        fi
    else
        echo "  ❌ Minio (shared-minio:12007) - NOT FOUND"
        exit 1
    fi
    
    echo ""
    echo "  ✅ All infrastructure services are ready!"
ENDSSH

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ❌ INFRASTRUCTURE NOT READY!                      ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Required infrastructure services are missing or not running.${NC}"
    echo ""
    echo -e "${BLUE}To fix this, deploy infrastructure first:${NC}"
    echo -e "   1. Using menu: ${GREEN}bun run dev${NC} → Choose ${GREEN}4${NC}"
    echo -e "   2. Direct run:  ${GREEN}./scripts/deployment/deploy-infrastructure.sh${NC}"
    echo ""
    echo -e "${YELLOW}After infrastructure is running, you can deploy the app:${NC}"
    echo -e "   1. Using menu: ${GREEN}bun run dev${NC} → Choose ${GREEN}5${NC}"
    echo -e "   2. Direct run:  ${GREEN}./scripts/deployment/deploy-optimized.sh${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ INFRASTRUCTURE READY!                           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}You can now safely deploy the application.${NC}"
echo ""
