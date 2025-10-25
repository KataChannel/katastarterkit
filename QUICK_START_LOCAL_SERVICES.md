# 🚀 Backend Local Services - Quick Start

## What Was Fixed

Backend không kết nối được với local services (Redis, Elasticsearch, MinIO):

| Service | Issue | Fix |
|---------|-------|-----|
| Redis | Port hardcoded to 6379 | Now uses 12004 from `.env` ✅ |
| Elasticsearch | No Docker detection | Now detects environment ✅ |
| MinIO (Service 1) | Port hardcoded to 9000 | Now uses 12007 from `.env` ✅ |
| MinIO (Service 2) | Wrong Docker detection + port hardcoded | Now uses correct detection and 12007 ✅ |

## Start Local Services

```bash
# Terminal 1: Redis
redis-server --port 12004

# Terminal 2: Elasticsearch
docker run -d \
  -e discovery.type=single-node \
  -p 12005:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:8.5.0

# Terminal 3: MinIO
# Install MinIO first if needed
# macOS: brew install minio/stable/minio
# Linux: curl -O https://dl.min.io/server/minio/release/linux-x86_64/minio
minio server /tmp/minio-data --console-address ":9001"

# Terminal 4: PostgreSQL (if not running)
docker run -d \
  --name postgres-local \
  -e POSTGRES_DB=rausachcore \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 12003:5432 \
  postgres:16-alpine
```

## Start Backend

```bash
cd backend
npm install          # If not done yet
npm run start:dev    # or: bun run start:dev
```

## Expected Output

```
[Redis] Connecting to Redis: host=localhost, port=12004, dockerEnv=false
[Redis] ✅ Connected successfully

[Elasticsearch] Connecting to: http://localhost:12005 (dockerEnv=false)
[Elasticsearch] ✅ Elasticsearch client connected successfully

[Minio] Connection attempt 1/10: endpoint=localhost, port=12007, dockerEnv=false
[Minio] ✅ Minio connected successfully
```

## Verify Services

```bash
# Redis
redis-cli -p 12004 ping
# Output: PONG ✅

# Elasticsearch
curl http://localhost:12005/
# Output: Cluster info ✅

# MinIO Console
# Open browser: http://localhost:9001
# Login: rausachcore-admin / rausachcore-secret-2025

# PostgreSQL
psql -h localhost -p 12003 -U postgres -d rausachcore
```

## Environment Variables

File: `backend/.env`

```properties
# Redis (Local)
REDIS_HOST=localhost
REDIS_PORT=12004

# Elasticsearch (Local)
ELASTICSEARCH_URL=http://localhost:12005

# MinIO (Local)
MINIO_ENDPOINT=localhost
MINIO_PORT=12007

# PostgreSQL (Local)
DATABASE_URL=postgresql://postgres:postgres@localhost:12003/rausachcore
```

## Files Modified

1. `backend/src/redis/redis.module.ts` - Fixed port config
2. `backend/src/search/elasticsearch.service.ts` - Added Docker detection
3. `backend/src/minio/minio.service.ts` - Fixed port config
4. `backend/src/services/minio.service.ts` - Fixed detection + port

## Troubleshooting

### Redis Connection Refused
```bash
# Check if Redis is running
redis-cli -p 12004 ping

# Start Redis
redis-server --port 12004
```

### Elasticsearch Connection Refused
```bash
# Check if Elasticsearch is running
curl http://localhost:12005/

# Start Elasticsearch
docker run -d -e discovery.type=single-node -p 12005:9200 docker.elastic.co/elasticsearch/elasticsearch:8.5.0
```

### MinIO Connection Refused
```bash
# Check MinIO console
curl http://localhost:9001/

# Start MinIO
minio server /tmp/minio-data --console-address ":9001"
```

## All Ports

```
12000 - Frontend
12001 - Backend API
12002 - pgAdmin
12003 - PostgreSQL
12004 - Redis
12005 - Elasticsearch
12007 - MinIO
```

---

✅ All services now connect properly to localhost with correct ports!
