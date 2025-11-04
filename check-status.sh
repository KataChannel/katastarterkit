#!/bin/bash

# Quick command to show deployment status on server

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVER="root@116.118.48.208"

echo -e "${BLUE}🔍 Checking deployment status on server...${NC}"
echo ""

# Check if containers are running
echo -e "${YELLOW}📦 Containers:${NC}"
ssh $SERVER "cd /opt/innerv2 && docker compose -f docker-compose.build.fast.yml ps" 2>/dev/null || echo "No containers running"
echo ""

# Check resource usage
echo -e "${YELLOW}💾 Resource Usage:${NC}"
ssh $SERVER "free -h | grep Mem && df -h / | grep -v Filesystem" 2>/dev/null
echo ""

# Check if build is running
echo -e "${YELLOW}🔨 Ongoing Builds:${NC}"
ssh $SERVER "docker ps --filter 'status=running' --format 'table {{.Names}}\t{{.Status}}' | grep -i build || echo 'No builds running'"
echo ""

echo -e "${GREEN}✅ Status check complete${NC}"
echo ""
echo -e "${BLUE}📱 Access URLs (if deployed):${NC}"
echo "   Frontend: http://116.118.48.208:14000"
echo "   Backend:  http://116.118.48.208:14001"
echo "   GraphQL:  http://116.118.48.208:14001/graphql"
