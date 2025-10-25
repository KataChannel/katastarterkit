# Docker Optimization Checklist

## Pre-Deployment Checklist

- [ ] Clone/pull latest code
- [ ] Update .env files with correct values
- [ ] Make scripts executable: `chmod +x build-*.sh`

## Build Phase

### Backend Build
- [ ] Navigate to backend: `cd backend`
- [ ] Install dependencies: `bun install --frozen-lockfile`
- [ ] Generate Prisma: `bun run prisma generate`
- [ ] Compile code: `bun run build`
- [ ] Verify dist/ folder exists: `ls -la dist/`

### Frontend Build
- [ ] Navigate to frontend: `cd frontend`
- [ ] Install dependencies: `bun install --frozen-lockfile`
- [ ] Build Next.js: `bun run build`
- [ ] Verify .next/ folder exists: `ls -la .next/`

## Docker Build Phase

- [ ] Build backend image: `docker compose build backend --no-cache`
- [ ] Build frontend image: `docker compose build frontend --no-cache`
- [ ] Verify images exist: `docker images | grep katacore`

## Deployment Phase

- [ ] Start services: `docker compose up -d`
- [ ] Wait 10 seconds for services to stabilize
- [ ] Check service status: `docker compose ps`

## Verification

### Backend Checks
- [ ] Backend running: `curl http://localhost:4000/health`
- [ ] Database connected: Check logs for "Database is ready"
- [ ] Redis connected: Check logs for "dockerEnv=true"
- [ ] MinIO connected: Check logs for "endpoint=minio"
- [ ] No segmentation faults: `docker compose logs backend | grep -i "segfault"`

### Frontend Checks
- [ ] Frontend running: `curl http://localhost:3000`
- [ ] Next.js loaded: Check logs for startup message
- [ ] No build errors: `docker compose logs frontend | grep -i "error"`

### Health Status
- [ ] Health endpoint OK: `curl http://localhost:4000/health | jq .`
- [ ] All services up: 
  ```bash
  curl http://localhost:4000/health | jq '.checks | keys | .[]'
  ```

## Post-Deployment

- [ ] Monitor logs: `docker compose logs -f`
- [ ] Test API endpoints manually
- [ ] Test frontend UI
- [ ] Check Docker resource usage: `docker stats`

## Rollback Plan

If issues occur:
1. `docker compose down` - Stop services
2. `docker image rm <image-id>` - Remove images
3. Clean local builds: `cd backend && rm -rf dist node_modules`
4. Rebuild: `./build-and-deploy.sh`

## Performance Metrics

After deployment, verify improvements:

```bash
# Check image sizes
docker images | grep katacore

# Expected sizes (50-70% smaller):
# Backend: ~350-550MB
# Frontend: ~400-600MB

# Check container stats
docker stats --no-stream

# Expected resource usage:
# Backend: 100-200MB RAM
# Frontend: 50-100MB RAM
```

## Optimization Results

Expected improvements vs. old multi-stage builds:

| Metric | Before | After | Saved |
|--------|--------|-------|-------|
| Build time | 15-20 min | 2-3 min | **12-18 min** |
| Backend image | 1.5GB | 350-550MB | **1GB+** |
| Frontend image | 1.5GB | 400-600MB | **1GB** |
| Deployment time | 25-30 min | 3-5 min | **20-27 min** |
| Push time (to registry) | 5-10 min | 1-2 min | **3-9 min** |
| Pull time (from registry) | 5-10 min | 1-2 min | **3-9 min** |

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| dist/ not found | Run `./build-backend-local.sh` |
| .next/ not found | Run `./build-frontend-local.sh` |
| Database connection failed | Check PostgreSQL container is running |
| Redis connection failed | Check `DOCKER_REDIS_HOST=redis` in .env |
| MinIO connection failed | Check `DOCKER_MINIO_ENDPOINT=minio` in .env |
| Services won't start | `docker compose logs backend` for errors |
| High disk usage | `docker system df` to check; `docker image prune` to clean |

## Quick Commands Reference

```bash
# Full deployment
./build-and-deploy.sh

# Backend only
./build-backend-local.sh && docker compose build backend --no-cache && docker compose up -d backend

# Frontend only
./build-frontend-local.sh && docker compose build frontend --no-cache && docker compose up -d frontend

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop services
docker compose down

# Remove images
docker rmi $(docker images | grep katacore | awk '{print $3}')

# Clean disk
docker system prune -a
```

## Notes

- **First build takes longer** - npm downloads and installs all packages
- **Subsequent builds are faster** - npm uses local cache
- **Use --no-cache flag** - Forces fresh Docker layer build (recommended)
- **Production deps only** - Removes ~500MB+ of dev tools
- **Safe to delete** - After images are built, local dist/.next/node_modules can be deleted to save space

---

**Status: ✅ Ready for deployment**

For detailed guide, see: `OPTIMIZED-DEPLOYMENT-GUIDE.md`
