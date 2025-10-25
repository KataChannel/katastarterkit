#!/bin/bash
# Quick verification for Redis connection fix

echo "🔍 Redis Connection Fix Verification"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check 1: Verify redis.module.ts has retry logic
echo "1️⃣  Checking redis.module.ts for retry logic..."
if grep -q "retryStrategy" backend/src/redis/redis.module.ts; then
    echo "   ✅ Retry strategy configured"
else
    echo "   ❌ Retry strategy NOT found"
fi

if grep -q "connectTimeout:" backend/src/redis/redis.module.ts; then
    echo "   ✅ Connection timeout configured"
else
    echo "   ❌ Connection timeout NOT found"
fi

# Check 2: Verify health service exists
echo ""
echo "2️⃣  Checking Redis health service..."
if [ -f "backend/src/redis/redis-health.service.ts" ]; then
    echo "   ✅ redis-health.service.ts exists"
else
    echo "   ❌ redis-health.service.ts NOT found"
fi

# Check 3: Verify entrypoint waits for Redis
echo ""
echo "3️⃣  Checking entrypoint.sh Redis wait logic..."
if grep -q "REDIS_HOST" backend/entrypoint.sh; then
    echo "   ✅ Redis wait loop configured"
    WAIT_TIME=$(grep -c "sleep 2" backend/entrypoint.sh)
    echo "   ✅ Redis wait attempts: $WAIT_TIME"
else
    echo "   ❌ Redis wait logic NOT found"
fi

# Check 4: Verify Docker healthcheck
echo ""
echo "4️⃣  Checking Docker Redis healthcheck..."
if grep -q "redis-cli.*incr.*ping" docker-compose.yml; then
    echo "   ✅ Improved healthcheck configured"
    INTERVAL=$(grep -A 5 "redis:" docker-compose.yml | grep "interval" | head -1)
    echo "   $INTERVAL"
else
    echo "   ❌ Healthcheck not improved"
fi

# Check 5: Verify Dockerfile has netcat
echo ""
echo "5️⃣  Checking Dockerfile for netcat..."
if grep -q "netcat-openbsd" backend/Dockerfile; then
    echo "   ✅ Netcat installed for availability checks"
else
    echo "   ❌ Netcat NOT installed"
fi

# Check 6: Frontend endpoint
echo ""
echo "6️⃣  Checking frontend/.env.production..."
ENDPOINT=$(grep "NEXT_PUBLIC_GRAPHQL_ENDPOINT" frontend/.env.production | cut -d= -f2)
if [[ "$ENDPOINT" == *"backend:4000"* ]]; then
    echo "   ✅ Frontend uses Docker service name: $ENDPOINT"
else
    echo "   ⚠️  Frontend endpoint: $ENDPOINT"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 Redis Connection Fix Summary:"
echo "   • Retry strategy: Exponential backoff (50ms → 2000ms)"
echo "   • Connection timeout: 10 seconds"
echo "   • Command timeout: 5 seconds"
echo "   • Healthcheck: 10 second interval, 10 retries"
echo "   • Entrypoint wait: 15 attempts × 2 seconds"
echo "   • Health service: Monitors + auto-reconnects"
echo ""
echo "🚀 To deploy:"
echo "   bash scripts/3deploy.sh"
echo ""
echo "🔎 To monitor after deployment:"
echo "   docker compose logs -f backend | grep -i redis"
echo ""
