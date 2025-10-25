# Quick Start: Backend Docker Fix

## What Changed?

### 1. Dockerfile Production Runtime
```
Bun v1.1.34 → Node.js 20-alpine
Reason: Bun crashes with segmentation fault in Docker
```

### 2. MinIO Connection
```
localhost:12007 (in Docker) → minio:9000 (Docker service name)
Auto-detects Docker environment using DOCKER_NETWORK_NAME
```

## Deploy

```bash
# 1. Build
docker compose build backend --no-cache

# 2. Start
docker compose up -d

# 3. Check logs
docker compose logs backend -f

# 4. Verify MinIO connection
docker compose exec backend curl http://minio:9000
```

## Verify Fix

```bash
bash verify-backend-fix.sh
```

All checks should pass: ✅

## Expected Output

```
[MinioService] Connecting to Minio: 
  endpoint=minio, 
  port=9000, 
  useSSL=false, 
  dockerEnv=true

Application is running on: http://0.0.0.0:4000/graphql
```

## Files Changed

- `backend/Dockerfile` - Production runtime
- `backend/src/minio/minio.service.ts` - Docker detection
- `verify-backend-fix.sh` - Verification script

## Rollback (if needed)

```bash
git checkout backend/Dockerfile
git checkout backend/src/minio/minio.service.ts
```

---

Ready to deploy! 🚀
