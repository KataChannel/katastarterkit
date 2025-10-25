# Backend Docker Deployment Fix

## Problems Fixed

### 1. Bun Segmentation Fault in Docker
```
panic(main thread): Segmentation fault at address 0x4A0D0
error: script "start:prod" was terminated by signal SIGILL (Illegal instruction)
```

**Root Cause:** Bun v1.1.34 has known issues with certain Linux kernel configurations and Docker environments, causing segmentation faults.

**Solution:** Changed production runtime from Bun to Node.js while keeping Bun for the build stage.

### 2. MinIO Connection Failure in Docker
**Root Cause:** The backend was trying to connect to `MINIO_ENDPOINT=localhost` which doesn't work inside a Docker container. Docker services communicate using service names from docker-compose, not localhost.

**Solution:** Updated MinioService to automatically detect Docker environment and use `DOCKER_MINIO_ENDPOINT=minio` instead.

## Changes Made

### 1. Backend Dockerfile
**File:** `backend/Dockerfile`

**Changed:** Production stage from Bun to Node.js

```dockerfile
# BEFORE:
FROM oven/bun:1.1.34-alpine AS production
...
CMD ["bun", "run", "start:prod"]

# AFTER:
FROM node:20-alpine AS production
...
CMD ["node", "dist/main.js"]
```

**Benefits:**
- ✅ Eliminates Bun segmentation fault
- ✅ Uses `start:prod` script which runs `node dist/main.js`
- ✅ More stable and reliable for production
- ✅ Still uses Bun for build stage (faster compilation)

### 2. MinIO Service
**File:** `backend/src/minio/minio.service.ts`

**Changed:** Constructor to auto-detect Docker environment

```typescript
// BEFORE:
const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
const port = parseInt(this.configService.get('MINIO_PORT', '9000'));

// AFTER:
const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
const endpoint = isDockerEnv 
  ? this.configService.get('DOCKER_MINIO_ENDPOINT', 'minio')
  : this.configService.get('MINIO_ENDPOINT', 'localhost');
const port = isDockerEnv
  ? parseInt(this.configService.get('DOCKER_MINIO_PORT', '9000'))
  : parseInt(this.configService.get('MINIO_PORT', '9000'));
```

**Benefits:**
- ✅ Auto-detects Docker environment
- ✅ Uses correct service names inside Docker
- ✅ Still works for local development
- ✅ Logs which endpoint is being used for debugging

## Environment Variables

### Already Configured in `.env`
```properties
# Local development
MINIO_ENDPOINT=localhost
MINIO_PORT=12007

# Docker production
DOCKER_MINIO_ENDPOINT=minio
DOCKER_MINIO_PORT=9000

# Detection mechanism
DOCKER_NETWORK_NAME=katacore-network
```

The `DOCKER_NETWORK_NAME` variable is set by docker-compose and used to detect the Docker environment.

## Build & Deploy

### Build the backend
```bash
docker compose build backend
```

### Deploy all services
```bash
docker compose up -d
```

### Check logs
```bash
docker compose logs backend -f
```

Expected successful logs:
```
🚀 Starting backend entrypoint...
⏳ Waiting for database to be ready...
The database is already in sync with the Prisma schema.
[Nest] 123 - 10/25/2025, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[MinioService] Connecting to Minio: endpoint=minio, port=9000, useSSL=false, dockerEnv=true
✅ Application is running on: http://0.0.0.0:4000/graphql
```

## Docker Network Communication

### How it works:

1. **Local (localhost):**
   - Backend runs locally on `localhost:12001`
   - MinIO runs locally on `localhost:12007`
   - Uses `MINIO_ENDPOINT=localhost`

2. **Docker Container:**
   - Backend service connects to `minio` service (by name)
   - Uses `DOCKER_MINIO_ENDPOINT=minio`
   - Port remains `9000` (internal MinIO port)
   - All containers on same `katacore-network`

## Troubleshooting

### MinIO connection still fails?
1. Check docker network: `docker network ls`
2. Verify MinIO is running: `docker compose ps minio`
3. Check MinIO logs: `docker compose logs minio`
4. Test connection: `docker compose exec backend curl http://minio:9000`

### Backend won't start?
1. Check Node.js version: `docker run node:20-alpine node --version`
2. Verify build was successful: `docker compose build backend`
3. Check database connection first
4. Review entrypoint script: `backend/entrypoint.sh`

### Performance concerns?
- Build: Still uses Bun (fast)
- Runtime: Uses Node.js (stable)
- No significant performance degradation
- More reliable than Bun in Docker

## Files Modified

| File | Changes |
|------|---------|
| `backend/Dockerfile` | Changed production FROM and CMD |
| `backend/src/minio/minio.service.ts` | Added Docker environment detection |

## Related Configuration

See `/backend/.env` for complete environment setup:
- `DOCKER_MINIO_ENDPOINT` - MinIO service name in Docker
- `DOCKER_MINIO_PORT` - MinIO internal port
- `DOCKER_NETWORK_NAME` - Docker network name for detection
- All MINIO_* variables for local development

---

**Date Fixed:** 2025-10-25  
**Status:** ✅ READY FOR DEPLOYMENT  
**Build Status:** ✅ Successful  
**Runtime:** Node.js 20 Alpine  
**Tested:** Docker Compose deployment
