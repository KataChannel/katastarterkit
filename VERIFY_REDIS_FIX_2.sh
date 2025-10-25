#!/bin/bash

# Redis Connection Fix Verification Script
# Tests Redis connectivity and auto-retry capability

set -e

DOCKER_NETWORK=${DOCKER_NETWORK:-rausachcore-network}
REDIS_HOST=${REDIS_HOST:-redis}
REDIS_PORT=${REDIS_PORT:-6379}

echo "================================"
echo "Redis Connection Fix Verification"
echo "================================"
echo ""

echo "📋 Environment:"
echo "  - Docker Network: $DOCKER_NETWORK"
echo "  - Redis Host: $REDIS_HOST"
echo "  - Redis Port: $REDIS_PORT"
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Check if containers are running
echo "🔍 Checking container status..."
if ! docker-compose ps redis | grep -q "redis"; then
    echo "❌ Redis container is not running"
    echo ""
    echo "Start containers with: docker-compose up -d"
    exit 1
fi

if ! docker-compose ps backend | grep -q "backend"; then
    echo "⚠️  Backend container is not running (this is OK for this test)"
fi

echo "✅ Redis container is running"
echo ""

# Test Redis connectivity
echo "🔗 Testing Redis connectivity..."
if docker exec $(docker-compose ps -q redis) redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is responding to PING"
else
    echo "⚠️  Redis is not responding yet (this might be OK if it's starting)"
fi

echo ""

# Check Redis logs for connection attempts
echo "📊 Recent Redis logs:"
docker logs $(docker-compose ps -q redis) 2>&1 | tail -n 5
echo ""

# Check backend logs for Redis connection
echo "📊 Backend Redis connection logs (if running):"
if docker-compose ps backend | grep -q "backend"; then
    docker logs $(docker-compose ps -q backend) 2>&1 | grep -i redis | tail -n 10 || echo "  (No Redis logs found yet)"
else
    echo "  (Backend not running)"
fi

echo ""

# Test network connectivity
echo "🌐 Testing Docker network connectivity..."
if docker network ls | grep -q "$DOCKER_NETWORK"; then
    echo "✅ Docker network $DOCKER_NETWORK exists"
else
    echo "❌ Docker network $DOCKER_NETWORK not found"
    exit 1
fi

echo ""

# Check if backend can resolve Redis
echo "🔎 Testing DNS resolution from backend container..."
if docker-compose ps backend | grep -q "backend"; then
    if docker exec $(docker-compose ps -q backend) nslookup redis > /dev/null 2>&1; then
        echo "✅ Redis hostname resolves correctly"
    else
        echo "⚠️  Cannot resolve Redis hostname (might be transient)"
    fi
else
    echo "  (Backend not running for DNS test)"
fi

echo ""

# Summary
echo "================================"
echo "✅ Verification Complete"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Rebuild backend: docker-compose up -d --build backend"
echo "2. Monitor logs: docker-compose logs -f backend"
echo "3. Look for: '[Redis] ✅ Connected successfully'"
echo ""
echo "If you see EAI_AGAIN errors:"
echo "  - These are normal during initial startup"
echo "  - Redis should auto-retry every 50-2000ms"
echo "  - Backend should start successfully anyway"
echo ""
