# Redis Connection Error Fix

## 🐛 Problem
```
[ioredis] Unhandled error event: Error: getaddrinfo EAI_AGAIN redis
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:111:26)
```

## 🔍 Root Cause Analysis

### Symptom
- DNS error `EAI_AGAIN` = temporary DNS failure
- Cannot resolve service name `redis`
- Happens on backend startup

### Root Causes (in order of likelihood)
1. **Redis service not ready** - DNS resolver tries to reach Redis before it's healthy
2. **No retry logic** - Backend tries once, fails, crashes without retrying
3. **Weak healthcheck** - Redis healthcheck passes but service not actually ready
4. **Network issues** - Docker DNS resolver not ready yet during startup

## ✅ Solution Implemented

### 1. Enhanced Redis Connection with Retry Logic
**File:** `backend/src/redis/redis.module.ts`

**Changes:**
- Added `retryStrategy` - exponential backoff retry (max 2 seconds delay)
- Added `reconnectOnError` handler - auto-reconnect on specific errors
- Changed `lazyConnect: false` → forces connection during module initialization
- Added connection timeout handling (30 seconds max wait)
- Added error event listeners

**Code:**
```typescript
return new Redis({
  host, port, password, db,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);  // Max 2 second delay
    logger.warn(`[Redis] Retry attempt ${times}, delay ${delay}ms`);
    return delay;
  },
  reconnectOnError: (err: Error) => {
    if (err.message.includes('READONLY')) {
      logger.warn(`[Redis] READONLY error, will reconnect`);
      return true;
    }
    return false;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,    // 10 sec to connect
  commandTimeout: 5000,     // 5 sec for commands
  lazyConnect: false,       // Eager connection
});

// Wait for ready with 30 second timeout
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Timeout')), 30000);
  redis.on('ready', () => { clearTimeout(timeout); resolve(null); });
  redis.on('error', (err) => { clearTimeout(timeout); reject(err); });
});
```

### 2. Improved Redis Healthcheck
**File:** `docker-compose.yml`

**Changes:**
```yaml
redis:
  command: redis-server --appendonly yes --timeout 300
  healthcheck:
    test: ["CMD", "redis-cli", "--raw", "incr", "ping"]  # More robust test
    interval: 10s      # Check every 10s (was 30s)
    timeout: 5s        # 5s timeout
    retries: 10        # Up to 10 retries (was 5)
    start_period: 5s   # Give 5s before first check
  environment:
    - REDIS_REPLICATION_BACKLOG_TTL=3600
```

**Why better:**
- `redis-cli incr ping` is more reliable than `ping` alone
- Shorter interval catches issues faster
- More retries = less likely to mark unhealthy
- start_period prevents early health failures

### 3. Backend Waits for Redis
**File:** `backend/entrypoint.sh`

**Changes:**
```bash
# Wait for Redis to be ready
REDIS_HOST=${DOCKER_REDIS_HOST:-redis}
REDIS_PORT=${DOCKER_REDIS_PORT:-6379}

for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if nc -z "$REDIS_HOST" "$REDIS_PORT" 2>/dev/null; then
    echo "✅ Redis is ready!"
    break
  fi
  sleep 2
done
# Continue even if Redis not ready (will retry on demand)
```

**Why:** Backend now waits up to 30 seconds for Redis before starting.

### 4. Redis Health Service
**File:** `backend/src/redis/redis-health.service.ts` (NEW)

**Features:**
- Periodic health checks (every 10 seconds)
- Tracks connection status
- Provides fallback mechanism for operations
- Graceful degradation if Redis unavailable

```typescript
// Usage in services:
this.redisHealth.executeWithFallback(
  () => redis.get(key),
  null  // fallback value
);
```

### 5. Docker Dependencies
**File:** `docker-compose.yml`

**Kept:**
```yaml
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy  # Wait for Redis healthy
  minio:
    condition: service_healthy
```

## 📦 Implementation Details

### File Changes Summary

| File | Change | Type |
|------|--------|------|
| `backend/src/redis/redis.module.ts` | Add retry + connection logic | MODIFIED |
| `backend/src/redis/redis-health.service.ts` | NEW health service | NEW |
| `backend/Dockerfile` | Add netcat package | MODIFIED |
| `backend/entrypoint.sh` | Wait for Redis before boot | MODIFIED |
| `docker-compose.yml` | Improve Redis healthcheck | MODIFIED |
| `frontend/.env.production` | Restore Docker endpoint | MODIFIED |
| `backend/.env.production` | Already configured | OK |

## 🚀 Deployment

### Build
```bash
# Rebuild backend with new Redis logic
docker compose build --no-cache backend

# Or full deployment
bash scripts/3deploy.sh
```

### Verify Fix
```bash
# Check backend logs
docker compose logs backend -f | grep -i redis

# Should see:
# [Redis] Connecting to Redis: host=redis, port=6379, dockerEnv=true
# ✅ Redis is ready!
# [Redis] Connected successfully
```

### Test Connection
```bash
# From backend container
docker exec rausachcore-backend redis-cli -h redis ping
# Should return: PONG

# From host
redis-cli -h localhost -p 12004 ping
# Should return: PONG
```

## 📊 Error Recovery Flow

```
Backend starts
    ↓
entrypoint.sh waits for Redis (30 sec timeout)
    ↓
Redis module initializes
    ↓
Try connection with retry
    ↓
Connection succeeds?
    ├─ YES → Ready, proceed
    └─ NO  → Retry up to 3 times with exponential backoff
         ↓
         Still fails?
         └─ Health service monitors + tries periodic reconnect
             Redis comes online later? → Auto-reconnect
```

## 🔧 Configuration Reference

### Redis Connection Settings
```typescript
{
  retryStrategy: exponential backoff (50ms to 2000ms)
  connectTimeout: 10 seconds
  commandTimeout: 5 seconds
  maxRetriesPerRequest: 3
  lazyConnect: false (eager connect)
  enableOfflineQueue: true (buffer commands during outage)
}
```

### Docker Health Check
```yaml
test: redis-cli --raw incr ping
interval: 10 seconds
timeout: 5 seconds
retries: 10
start_period: 5 seconds
```

### Entrypoint Wait
```bash
Wait loop: 15 attempts, 2 seconds between each
Total wait time: up to 30 seconds
Check method: nc (netcat) port availability
```

## ⚠️ Still Getting Errors?

### Symptom: Still seeing "EAI_AGAIN" after deployment

**Step 1: Check Redis is running**
```bash
docker compose ps redis
# Should show "healthy"
```

**Step 2: Check network connectivity**
```bash
docker exec rausachcore-backend nc -zv redis 6379
# Should show "succeeded"
```

**Step 3: Check logs**
```bash
docker compose logs backend | tail -50
# Look for Redis connection attempts
```

**Step 4: Restart services**
```bash
docker compose restart redis backend
# Or full restart
docker compose down && docker compose up -d
```

### Symptom: Backend crashes with Redis timeout

**Solution:** Increase timeouts in redis.module.ts
```typescript
connectTimeout: 15000,  // Was 10000
commandTimeout: 10000,  // Was 5000
```

### Symptom: Redis connection works but commands hang

**Solution:** Check Redis is not running out of memory
```bash
redis-cli -h localhost -p 12004 info memory
# Check memory usage
```

## 📚 Technical Details

### DNS Resolution (EAI_AGAIN)
- ioredis tries to resolve DNS name `redis`
- Docker DNS resolver returns ENOTFOUND (not found) initially
- With retry strategy, it tries again after delay
- Eventually succeeds when DNS is ready

### Connection States
1. **Initial** - No connection
2. **Connecting** - Attempting to connect
3. **Connected** - Connected to Redis
4. **Ready** - Ready to accept commands
5. **Disconnected** - Lost connection
6. **Reconnecting** - Trying to reconnect

### Why This Works
- **Retry Strategy:** Handles temporary DNS failures
- **Health Checks:** Docker ensures service is truly ready
- **Entrypoint Wait:** Backend waits for Redis before starting
- **Error Handlers:** Logs issues for debugging
- **Health Service:** Monitors ongoing health + reconnects automatically

## 📝 Monitoring

### Check Redis Health
```bash
# Real-time monitoring
docker compose logs -f redis | grep -E "ping|health"

# Or
docker exec rausachcore-redis redis-cli INFO stats
```

### Check Backend Redis Status
```bash
docker compose logs -f backend | grep -i redis

# Look for:
# ✅ Redis is ready!
# [Redis] Connected successfully
# [Redis] Ready
```

## ✅ Success Criteria

After deployment, you should see:

**In backend logs:**
```
✅ Waiting for Redis to be ready...
✅ Redis is ready!
[Redis] Connecting to Redis: host=redis, port=6379, dockerEnv=true
[Redis] Connected successfully
[Redis] Ready
```

**Redis healthcheck:**
```
docker compose ps redis
# Status: Up (healthy) ✅
```

**No errors:**
```
docker compose logs backend | grep -i "ioredis.*error"
# Should return empty
```

## 🎯 Summary

| Issue | Solution |
|-------|----------|
| DNS resolution fails | Retry with exponential backoff |
| Service not ready | Health check waits + entrypoint waits |
| Connection timeout | Increased timeouts (10-15 seconds) |
| Unhandled errors | Error handlers + health monitoring |
| Missing diagnostics | Added logging at each step |

---

**Status:** ✅ READY FOR DEPLOYMENT

Deploy and monitor Redis connection status:
```bash
bash scripts/3deploy.sh
docker compose logs backend -f | grep -i redis
```
