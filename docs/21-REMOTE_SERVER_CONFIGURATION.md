# Remote Server Configuration (116.118.49.243)

**Status:** ✅ COMPLETE - All services configured to connect to remote server

## Configuration Summary

Backend is now fully configured to connect to all services on remote server **116.118.49.243** with the following port mappings:

| Service | Endpoint | Port | Full Address |
|---------|----------|------|--------------|
| Redis | 116.118.49.243 | 12004 | redis://116.118.49.243:12004 |
| Elasticsearch | 116.118.49.243 | 12005 | http://116.118.49.243:12005 |
| MinIO | 116.118.49.243 | 12007 | s3://116.118.49.243:12007 |
| PostgreSQL | 116.118.49.243 | 12003 | postgresql://116.118.49.243:12003 |
| Frontend | 116.118.49.243 | 12000 | http://116.118.49.243:12000 |
| Backend | 116.118.49.243 | 12001 | http://116.118.49.243:12001 |

## Files Modified

### 1. **backend/.env** ✅
- Location: `/backend/.env`
- Changes: All service endpoints updated from localhost to 116.118.49.243
- Key Settings:
  ```env
  REDIS_HOST=116.118.49.243
  REDIS_PORT=12004
  ELASTICSEARCH_URL=http://116.118.49.243:12005
  MINIO_ENDPOINT=116.118.49.243
  MINIO_PORT=12007
  DATABASE_URL=postgresql://postgres:postgres@116.118.49.243:12003/rausachcore
  FRONTEND_URL=http://116.118.49.243:12000
  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:12001/graphql
  ```

### 2. **backend/src/redis/redis.module.ts** ✅
- Location: `/backend/src/redis/redis.module.ts`
- Default Endpoint: `'localhost'` → `'116.118.49.243'`
- Port: Reads from `REDIS_PORT` env var (12004)
- Features:
  - Lazy connect mode (prevents immediate failure)
  - Exponential backoff retry (50ms → 2000ms)
  - Docker detection: Uses `DOCKER_REDIS_HOST` if `DOCKER_NETWORK_NAME` is set

### 3. **backend/src/search/elasticsearch.service.ts** ✅
- Location: `/backend/src/search/elasticsearch.service.ts`
- Default URL: `'http://localhost:12005'` → `'http://116.118.49.243:12005'`
- Features:
  - Docker detection: Uses `http://elasticsearch:9200` if `DOCKER_NETWORK_NAME` is set
  - Proper environment logging
  - Connection timeout: 30s

### 4. **backend/src/minio/minio.service.ts** ✅
- Location: `/backend/src/minio/minio.service.ts`
- Default Endpoint: `'localhost'` → `'116.118.49.243'`
- Port: Reads from `MINIO_PORT` env var (12007)
- Features:
  - Async initialization with retry logic
  - Exponential backoff (500ms-8s, 10 retries)
  - Docker detection: Uses `DOCKER_MINIO_ENDPOINT` if `DOCKER_NETWORK_NAME` is set
  - Connection test with 5s timeout
  - Automatic bucket creation

### 5. **backend/src/services/minio.service.ts** ✅
- Location: `/backend/src/services/minio.service.ts`
- Default Endpoint: `'localhost'` → `'116.118.49.243'`
- Port: Reads from `MINIO_PORT` env var (12007)
- Features:
  - Corrected Docker detection: `DOCKER_ENV` → `DOCKER_NETWORK_NAME`
  - Uses `DOCKER_MINIO_ENDPOINT` for Docker deployments
  - Consistent configuration with primary MinIO service

## Environment Detection

All services use intelligent environment detection:

```typescript
const isDocker = process.env.DOCKER_NETWORK_NAME !== undefined;
```

- **Local Development (DOCKER_NETWORK_NAME undefined):**
  - Uses endpoints from `.env` file (116.118.49.243)
  - Ports: 12004, 12005, 12007, 12003

- **Docker Deployment (DOCKER_NETWORK_NAME defined):**
  - Redis: Uses `DOCKER_REDIS_HOST` (default: redis) and `DOCKER_REDIS_PORT` (default: 6379)
  - Elasticsearch: Uses `DOCKER_ELASTICSEARCH_URL` (default: http://elasticsearch:9200)
  - MinIO: Uses `DOCKER_MINIO_ENDPOINT` (default: minio) and `DOCKER_MINIO_PORT` (default: 9000)
  - PostgreSQL: Docker compose service name

## Compilation Status

All modified files compile without errors:
- ✅ redis.module.ts - No errors
- ✅ elasticsearch.service.ts - No errors
- ✅ minio/minio.service.ts - No errors
- ✅ services/minio.service.ts - No errors

## Connection Behavior

### Backend will ALWAYS:
- ✅ Connect to 116.118.49.243:12004 for Redis (when running locally)
- ✅ Connect to http://116.118.49.243:12005 for Elasticsearch (when running locally)
- ✅ Connect to 116.118.49.243:12007 for MinIO (when running locally)
- ✅ Connect to 116.118.49.243:12003 for PostgreSQL (when running locally)
- ❌ NEVER connect to localhost services (unless in Docker with Docker Compose services)

### Retry & Recovery:
- Redis: 5 retries with exponential backoff (50ms → 2000ms)
- MinIO: 10 retries with exponential backoff (500ms → 8s)
- Elasticsearch: Connection with 30s timeout
- All services handle temporary failures gracefully

## Docker Deployment

When running in Docker (with `DOCKER_NETWORK_NAME` set):
- Redis uses service name: `redis` (port 6379)
- Elasticsearch uses service name: `elasticsearch` (port 9200)
- MinIO uses service name: `minio` (port 9000)
- PostgreSQL uses service name: `postgres` (port 5432)

Docker compose will handle internal service discovery and networking.

## Verification

To verify the backend is connecting to the correct remote server:

1. Check `.env` file shows `116.118.49.243` endpoints
2. Check logs show connection attempts to 116.118.49.243
3. Verify Redis responds: `redis-cli -h 116.118.49.243 -p 12004 ping`
4. Verify Elasticsearch responds: `curl http://116.118.49.243:12005/_cluster/health`
5. Verify MinIO responds: `curl http://116.118.49.243:12007/minio/health/live`

## Quick Reference

**To connect to services on 116.118.49.243:**

```bash
# Redis
redis-cli -h 116.118.49.243 -p 12004

# Elasticsearch
curl http://116.118.49.243:12005/_cluster/health

# MinIO (console)
# Navigate to http://116.118.49.243:12007 in browser
# Credentials from .env: MINIO_ROOT_USER, MINIO_ROOT_PASSWORD

# PostgreSQL
psql -h 116.118.49.243 -p 12003 -U postgres -d rausachcore
```

## Phase Summary

**Phase 1: Docker Reliability (✅ COMPLETE)**
- Fixed Redis/MinIO EAI_AGAIN DNS errors
- Added retry logic with exponential backoff
- Implemented async initialization

**Phase 2: Local Development (✅ COMPLETE)**
- Configured all services for localhost development
- Services ports: 12004, 12005, 12007

**Phase 3: Remote Server Configuration (✅ COMPLETE)**
- Updated all services to use 116.118.49.243
- Changed default endpoints across 5 files
- Maintained Docker deployment compatibility
- All files compile successfully
