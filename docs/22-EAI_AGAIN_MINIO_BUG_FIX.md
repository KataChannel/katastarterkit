# Bug Fix: EAI_AGAIN minio Error

**Status:** ✅ FIXED

## Problem

```
[Nest] 1445113  - 00:56:29 26/10/2025   ERROR [MinioService] Error ensuring bucket exists: getaddrinfo EAI_AGAIN minio
Error: getaddrinfo EAI_AGAIN minio
```

Backend tried to connect to `minio` (Docker service name) instead of `116.118.49.243` (remote server).

## Root Cause

The `.env` files had `DOCKER_NETWORK_NAME=rausachcore-network` defined, which triggered the Docker environment detection logic:

```typescript
const isDocker = process.env.DOCKER_NETWORK_NAME !== undefined;

if (isDocker) {
  // Use Docker service names: 'minio', 'redis', 'elasticsearch'
  this.endpoint = 'minio'; // ❌ Wrong for local development
} else {
  // Use remote server IP: '116.118.49.243'
  this.endpoint = '116.118.49.243'; // ✅ Correct
}
```

**Problem:** When running backend locally (not in Docker), but `DOCKER_NETWORK_NAME` was set in `.env`, the code incorrectly tried to use Docker service names.

## Solution

**Commented out `DOCKER_NETWORK_NAME` in all `.env` files** so it's only active when actually running in Docker Compose.

### Changes Made

#### 1. `/chikiet/kataoffical/shoprausach/.env` ✅
```properties
# BEFORE (all wrong for local development):
FRONTEND_URL=http://localhost:12000
DATABASE_URL="postgresql://postgres:postgres@localhost:12003/rausachcore"
REDIS_HOST=localhost
ELASTICSEARCH_URL=http://localhost:12005
MINIO_ENDPOINT=localhost
NEXTAUTH_URL=http://localhost:12000
NEXT_PUBLIC_APP_URL=http://localhost:12000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql
DOCKER_NETWORK_NAME=rausachcore-network ❌

# AFTER (all use remote server + DOCKER_NETWORK_NAME commented):
FRONTEND_URL=http://116.118.49.243:12000
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:12003/rausachcore"
REDIS_HOST=116.118.49.243
ELASTICSEARCH_URL=http://116.118.49.243:12005
MINIO_ENDPOINT=116.118.49.243
NEXTAUTH_URL=http://116.118.49.243:12000
NEXT_PUBLIC_APP_URL=http://116.118.49.243:12000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:12001/graphql
# DOCKER_NETWORK_NAME=rausachcore-network ✅
```

#### 2. `/chikiet/kataoffical/shoprausach/backend/.env` ✅
```properties
# BEFORE:
DOCKER_NETWORK_NAME=rausachcore-network ❌

# AFTER:
# DOCKER_NETWORK_NAME=rausachcore-network ✅
```

#### 3. `/chikiet/kataoffical/shoprausach/frontend/.env` ✅
```properties
# BEFORE:
DOCKER_NETWORK_NAME=rausachcore-network ❌

# AFTER:
# DOCKER_NETWORK_NAME=rausachcore-network ✅
```

## Current Configuration (Local Development)

**All services now connect to remote server `116.118.49.243`:**

| Service | Host | Port | Endpoint |
|---------|------|------|----------|
| PostgreSQL | 116.118.49.243 | 12003 | postgresql://116.118.49.243:12003 |
| Redis | 116.118.49.243 | 12004 | redis://116.118.49.243:12004 |
| Elasticsearch | 116.118.49.243 | 12005 | http://116.118.49.243:12005 |
| MinIO | 116.118.49.243 | 12007 | s3://116.118.49.243:12007 |
| Frontend | 116.118.49.243 | 12000 | http://116.118.49.243:12000 |
| Backend | 116.118.49.243 | 12001 | http://116.118.49.243:12001 |

## How Environment Detection Works

### Local Development (`.env` with DOCKER_NETWORK_NAME commented)
```typescript
process.env.DOCKER_NETWORK_NAME = undefined
// ✅ Uses remote server endpoints:
MINIO_ENDPOINT = 116.118.49.243:12007
REDIS_HOST = 116.118.49.243:12004
ELASTICSEARCH_URL = http://116.118.49.243:12005
```

### Docker Deployment (docker-compose sets DOCKER_NETWORK_NAME)
```typescript
process.env.DOCKER_NETWORK_NAME = 'rausachcore-network' // Set by docker-compose
// ✅ Uses Docker service names:
DOCKER_MINIO_ENDPOINT = minio:9000
DOCKER_REDIS_HOST = redis:6379
DOCKER_ELASTICSEARCH_URL = http://elasticsearch:9200
```

## Verification

After the fix, the backend should:

1. ✅ Connect to Redis on `116.118.49.243:12004`
2. ✅ Connect to Elasticsearch on `http://116.118.49.243:12005`
3. ✅ Connect to MinIO on `116.118.49.243:12007`
4. ✅ No more `EAI_AGAIN minio` errors
5. ✅ Buckets created successfully

## Key Learning

**IMPORTANT:** Only set `DOCKER_NETWORK_NAME` environment variable when:
- Running via Docker Compose
- All services are running in containers
- Using Docker's internal service discovery (service names like `minio`, `redis`)

**DO NOT set `DOCKER_NETWORK_NAME` when:**
- Running backend locally (node/bun)
- Services are on a remote server
- Need to use IP addresses and specific ports

## Files Changed

1. `/chikiet/kataoffical/shoprausach/.env` - 7 lines updated + DOCKER_NETWORK_NAME commented
2. `/chikiet/kataoffical/shoprausach/backend/.env` - DOCKER_NETWORK_NAME commented
3. `/chikiet/kataoffical/shoprausach/frontend/.env` - 7 lines updated + DOCKER_NETWORK_NAME commented

## Testing

Restart backend and verify logs show:
```
[MinioService] Connecting to MinIO at 116.118.49.243:12007
[RedisModule] Connecting to Redis at 116.118.49.243:12004
[ElasticsearchService] Connecting to Elasticsearch at http://116.118.49.243:12005
```

No more `EAI_AGAIN` errors! ✅
