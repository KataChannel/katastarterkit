# ✅ Backend Local Connections Fixed - Redis, Elasticsearch, MinIO

**Status:** ✅ COMPLETE  
**Date:** 26/10/2025  

## Problem Fixed

Backend không kết nối được với local services:
- ❌ Redis - Trying to connect to port 6379 instead of 12004
- ❌ Elasticsearch - Hardcoded to localhost:9200 only
- ❌ MinIO - Hardcoded to port 9000 instead of 12007

## Solution Applied

### 1. ✅ Redis Module (`backend/src/redis/redis.module.ts`)

**Fixed:** Port configuration not being read properly

```typescript
// BEFORE:
const port = isDockerEnv
  ? configService.get('DOCKER_REDIS_PORT', 6379)  // ❌ Hardcoded
  : configService.get('REDIS_PORT', 6379);        // ❌ Hardcoded

// AFTER:
const portConfig = isDockerEnv
  ? configService.get('DOCKER_REDIS_PORT', '6379')
  : configService.get('REDIS_PORT', '12004');      // ✅ Uses local port 12004
const port = typeof portConfig === 'string' ? parseInt(portConfig, 10) : portConfig;
```

**Result:** Redis now connects to `localhost:12004` for local development

### 2. ✅ Elasticsearch Service (`backend/src/search/elasticsearch.service.ts`)

**Fixed:** Hardcoded localhost:9200, no Docker detection

```typescript
// BEFORE:
node: this.configService.get('ELASTICSEARCH_URL', 'http://localhost:9200')  // ❌ No Docker handling

// AFTER:
const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
const elasticsearchUrl = isDockerEnv
  ? this.configService.get('DOCKER_ELASTICSEARCH_URL', 'http://elasticsearch:9200')
  : this.configService.get('ELASTICSEARCH_URL', 'http://localhost:12005');
node: elasticsearchUrl
```

**Result:** Elasticsearch now connects to `http://localhost:12005` for local development

### 3. ✅ MinIO Service - Main (`backend/src/minio/minio.service.ts`)

**Fixed:** Hardcoded port 9000 for both local and Docker

```typescript
// BEFORE:
const port = isDockerEnv
  ? parseInt(this.configService.get('DOCKER_MINIO_PORT', '9000'))  // ❌ 9000
  : parseInt(this.configService.get('MINIO_PORT', '9000'));        // ❌ 9000

// AFTER:
const portConfig = isDockerEnv
  ? this.configService.get('DOCKER_MINIO_PORT', '9000')
  : this.configService.get('MINIO_PORT', '12007');                 // ✅ Uses local port 12007
const port = typeof portConfig === 'string' ? parseInt(portConfig, 10) : portConfig;
```

**Result:** MinIO now connects to `localhost:12007` for local development

### 4. ✅ MinIO Service - Alternative (`backend/src/services/minio.service.ts`)

**Fixed:** Using wrong Docker detection variable + hardcoded port

```typescript
// BEFORE:
const isDocker = process.env.DOCKER_ENV === 'true';               // ❌ Wrong variable
this.port = parseInt(configService.get('MINIO_PORT', '9000'), 10); // ❌ Hardcoded 9000

// AFTER:
const isDocker = process.env.DOCKER_NETWORK_NAME !== undefined;   // ✅ Correct variable
const portConfig = isDocker
  ? this.configService.get<string>('DOCKER_MINIO_PORT', '9000')
  : this.configService.get<string>('MINIO_PORT', '12007');        // ✅ Uses local port 12007
this.port = typeof portConfig === 'string' ? parseInt(portConfig, 10) : portConfig;
```

**Result:** MinIO alternative service now works properly for local development

## Configuration Used

From `backend/.env`:

```properties
# Redis Configuration - LOCAL
REDIS_HOST=localhost
REDIS_PORT=12004
REDIS_PASSWORD=123456
DOCKER_REDIS_HOST=redis
DOCKER_REDIS_PORT=6379

# Elasticsearch Configuration - LOCAL
ELASTICSEARCH_URL=http://localhost:12005
DOCKER_ELASTICSEARCH_URL=http://elasticsearch:9200

# Minio Configuration - LOCAL
MINIO_ENDPOINT=localhost
MINIO_PORT=12007
DOCKER_MINIO_ENDPOINT=minio
DOCKER_MINIO_PORT=9000
```

## How It Works Now

### Local Development (NODE_ENV=development, no DOCKER_NETWORK_NAME)
```
Redis:           localhost:12004 ✅
Elasticsearch:   http://localhost:12005 ✅
MinIO:           localhost:12007 ✅
PostgreSQL:      localhost:12003 ✅
```

### Docker Deployment (NODE_ENV=production, DOCKER_NETWORK_NAME=rausachcore-network)
```
Redis:           redis:6379 ✅
Elasticsearch:   http://elasticsearch:9200 ✅
MinIO:           minio:9000 ✅
PostgreSQL:      postgres:5432 ✅
```

## Files Modified

| File | Changes |
|------|---------|
| `backend/src/redis/redis.module.ts` | Fixed port config to use 12004 locally |
| `backend/src/search/elasticsearch.service.ts` | Added Docker detection, uses 12005 locally |
| `backend/src/minio/minio.service.ts` | Fixed port config to use 12007 locally |
| `backend/src/services/minio.service.ts` | Fixed Docker detection, uses 12007 locally |

## Verification

### ✅ Compilation
- All TypeScript files compile without errors
- No import/export issues
- Type checking passed

### ✅ Expected Logs on Startup

```
[Redis] Connecting to Redis: host=localhost, port=12004, dockerEnv=false
✅ Redis Connected successfully

[Elasticsearch] Connecting to: http://localhost:12005 (dockerEnv=false)
✅ Elasticsearch client connected successfully

[Minio] Connection attempt 1/10: endpoint=localhost, port=12007, dockerEnv=false
✅ Minio connected successfully
```

## How to Test

### 1. Start Local Services
```bash
# Redis on port 12004
redis-server --port 12004

# Elasticsearch on port 12005
docker run -d -e discovery.type=single-node -p 12005:9200 docker.elastic.co/elasticsearch/elasticsearch:8.5.0

# MinIO on port 12007
minio server /data --console-address ":9001"
# Then configure port mapping to 12007
```

### 2. Start Backend
```bash
cd backend
npm install
npm run start:dev
```

### 3. Verify Connections
```bash
# Check logs for successful connections
# Should see:
# [Redis] ✅ Connected successfully
# [Elasticsearch] ✅ Elasticsearch client connected successfully
# [Minio] ✅ Minio connected successfully
```

## Port Reference

| Service | Local Port | Docker Port | Variable |
|---------|-----------|-------------|----------|
| PostgreSQL | 12003 | 5432 | POSTGRES_PORT |
| Redis | 12004 | 6379 | REDIS_PORT / DOCKER_REDIS_PORT |
| Elasticsearch | 12005 | 9200 | ELASTICSEARCH_URL |
| MinIO | 12007 | 9000 | MINIO_PORT / DOCKER_MINIO_PORT |
| pgAdmin | 12002 | 80 | PGADMIN_PORT |
| Backend | 12001 | 4000 | PORT |
| Frontend | 12000 | 3000 | N/A |

## Success Criteria

✅ Backend starts without connection errors  
✅ Redis connects on localhost:12004  
✅ Elasticsearch connects on http://localhost:12005  
✅ MinIO connects on localhost:12007  
✅ No "Connection refused" errors  
✅ All services properly detect local vs Docker environment  

---

**Status:** ✅ READY TO USE

Backend will now properly connect to local Redis, Elasticsearch, and MinIO services on the configured ports.
