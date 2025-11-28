# Fix Bugs & Deploy - Tổng Hợp

## 1. Các Lỗi Thường Gặp Khi Deploy

### 1.0. Menu Script Path Issues

**Lỗi**: `❌ Error: deploy-optimized.sh not found!`
```bash
# Nguyên nhân: Path sai trong dev-deploy-menu.sh
# Script đang ở scripts/ directory nhưng path reference có ./scripts/

# Fix đã apply:
- Changed: ./scripts/deployment/deploy-optimized.sh
- To: ./deployment/deploy-optimized.sh
```

**Các file đã fix paths**:
- ✅ `run_deploy_infrastructure()` → `./deployment/deploy-infrastructure.sh`
- ✅ `run_deploy_app()` → `./deployment/deploy-optimized.sh`
- ✅ `run_stop_services()` → `./deployment/stop-services.sh`
- ✅ `run_test_build()` → `./setup/build-frontend-prod.sh`
- ✅ `run_check_status()` → `./infrastructure/check-deployment-status.sh`

### 1.1. Backend Build Issues

**Lỗi**: `dist/main.js not found`
```bash
# Fix
cd backend
rm -rf dist node_modules
bun install
bunx prisma generate
bun run build
```

**Lỗi**: `Prisma Client not generated`
```bash
# Fix
cd backend
bunx prisma generate
```

**Lỗi**: `Cannot find module @prisma/client`
```bash
# Fix
cd backend
bun install @prisma/client
bunx prisma generate
```

### 1.2. Frontend Build Issues

**Lỗi**: `.next directory not found`
```bash
# Fix
cd frontend
rm -rf .next node_modules
bun install
cp ../env/.env.prod.rausach .env.local  # hoặc ../.env.rausach
bun run build
```

**Lỗi**: `NEXT_PUBLIC_GRAPHQL_ENDPOINT not defined`
```bash
# Fix - Kiểm tra .env.local
cat .env.local | grep NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Nếu thiếu, thêm vào:
echo "NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:12001/graphql" >> .env.local
```

**Lỗi**: `Failed to compile - Module not found`
```bash
# Fix
cd frontend
rm -rf node_modules bun.lockb
bun install
bun run build
```

### 1.3. Docker Build Issues

**Lỗi**: `Cannot connect to Docker daemon`
```bash
# Fix
sudo systemctl start docker
sudo systemctl status docker
```

**Lỗi**: `Image already exists`
```bash
# Fix - Force remove and rebuild
docker rmi -f rausach-backend:latest rausach-frontend:latest
bun run dev  # Chọn option 5
```

**Lỗi**: `No space left on device`
```bash
# Fix - Cleanup Docker
docker system prune -af --volumes
docker image prune -af
```

### 1.4. Deployment Issues

**Lỗi**: `Backend FAIL` during health check
```bash
# Nguyên nhân: Infrastructure (Postgres, Redis, Minio) stopped during deployment
# Fix đã apply: Script now ensures infrastructure is running before app deployment

# Nếu vẫn fail:
# 1. Check infrastructure
ssh root@116.118.49.243 'docker ps | grep -E "shoppostgres|redis|minio"'

# 2. Start infrastructure manually
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.infra.yml up -d'

# 3. Restart app
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.app.yml restart'
```

**Lỗi**: `Infrastructure not ready`
```bash
# Fix - Deploy infrastructure trước
bun run dev  # Chọn option 4 (Deploy Infrastructure)
# Sau đó mới deploy app (option 5)
```

**Lỗi**: `Container already exists`
```bash
# Fix - Trên server
ssh root@116.118.49.243 'docker rm -f shopbackend shopfrontend'
# Sau đó deploy lại
```

**Lỗi**: `Port 12000/12001 already in use`
```bash
# Fix local
bun run kill:ports

# Fix server
ssh root@116.118.49.243 'lsof -ti:12000,12001 | xargs kill -9'
```

## 2. Scripts Đã Fix

### 2.1. deploy-optimized.sh

**Improvements**:
- ✅ Clean build directories trước khi build
- ✅ Generate Prisma Client tự động
- ✅ Check frozen-lockfile trước khi install
- ✅ Validate build output (dist/main.js, .next/BUILD_ID)
- ✅ Better error messages
- ✅ Environment file validation
- ✅ Build ID logging

### 2.2. Các Steps Đã Cải Tiến

**Step 6: Server Deployment (CRITICAL FIX)**
```bash
# Before - Infrastructure accidentally stopped
docker compose -f docker-compose.app.yml up -d --remove-orphans
# → --remove-orphans removed infrastructure containers!

# After - Ensure infrastructure running
# 1. Check if infrastructure exists
if ! docker ps | grep -q "shoppostgres"; then
    docker compose -f docker-compose.infra.yml up -d
    sleep 10
fi

# 2. Remove ONLY app containers
docker rm -f shopbackend shopfrontend

# 3. Start app WITHOUT --remove-orphans
docker compose -f docker-compose.app.yml up -d --force-recreate

# 4. Wait longer for backend startup
sleep 45  # Backend needs time to connect to DB/Redis/Minio
```

**Step 7: Health Checks (Enhanced)**
```bash
# Before - Single attempt, immediate fail
curl -sf http://server:12001/graphql

# After - Multiple retries with proper timing
for i in {1..5}; do
    if curl -sf http://server:12001/graphql -d '{"query":"{__typename}"}' | grep -q "Query"; then
        SUCCESS!
        break
    fi
    sleep 10  # Wait between retries
done
```

**Step 1: Build Backend**
```bash
# Before
bun run build

# After
rm -rf dist
bun install --frozen-lockfile || bun install
bunx prisma generate
bun run build || bunx tsc
# Validate dist/main.js exists
```

**Step 2: Build Frontend**
```bash
# Before
cp ../env/.env.prod.rausach .env.local
bun run build

# After
rm -rf .next
bun install --frozen-lockfile || bun install
# Check .env file exists
cp ../env/.env.prod.rausach .env.local || cp ../.env.rausach .env.local
bun run build
# Validate .next/BUILD_ID exists
```

## 3. Quy Trình Deploy Đúng

### 3.1. Lần Đầu Deploy (Fresh Server)

```bash
# 1. Deploy Infrastructure
bun run dev
# → Chọn 4: Deploy Infrastructure

# Chờ infrastructure chạy xong (Postgres, Redis, Minio)

# 2. Deploy Application
bun run dev
# → Chọn 5: Deploy App
```

### 3.2. Update Code (Re-deploy)

```bash
# 1. Pull latest code
git pull origin shoprausachv16_dev11_shopnew

# 2. Update dependencies (nếu cần)
cd backend && bun install
cd ../frontend && bun install
cd ..

# 3. Deploy
bun run dev
# → Chọn 5: Deploy App
```

### 3.3. Rollback (Khi có lỗi)

```bash
bun run dev
# → Chọn 9: Rollback to Previous Version
```

## 4. Environment Files Required

### 4.1. Root Directory
```
.env.rausach           # Development
.env.prod.rausach      # Production (deploy)
```

### 4.2. Backend
```
backend/.env           # Auto-copied từ .env.rausach
```

### 4.3. Frontend
```
frontend/.env.local    # Auto-copied từ .env.prod.rausach
```

### 4.4. Server
```
/root/shoprausach/.env.rausach
/root/shoprausach/.env.prod.rausach
```

## 5. Health Checks

### 5.1. Check Services

```bash
# Local
curl http://localhost:12000
curl http://localhost:12001/graphql

# Server
curl http://116.118.49.243:12000
curl http://116.118.49.243:12001/graphql
```

### 5.2. Check Docker Containers

```bash
# Server
ssh root@116.118.49.243 'docker ps'

# Should see:
# - shopbackend
# - shopfrontend
# - shoppostgres
# - shared-redis
# - shared-minio
```

### 5.3. Check Logs

```bash
# Backend logs
ssh root@116.118.49.243 'docker logs shopbackend --tail 50'

# Frontend logs
ssh root@116.118.49.243 'docker logs shopfrontend --tail 50'

# All services
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.app.yml logs -f'
```

## 6. Common Tasks

### 6.1. Kill Dev Servers

```bash
# Local
bun run kill:ports

# Or manually
lsof -ti:12000 | xargs kill -9
lsof -ti:12001 | xargs kill -9
```

### 6.2. Clean Docker

```bash
# Local
docker system prune -af

# Server
ssh root@116.118.49.243 'docker system prune -af'
```

### 6.3. Database Operations

```bash
# Prisma Studio
bun run db:studio

# Migrate
bun run db:migrate

# Seed
bun run db:seed

# Push (force)
bun run db:pushforce
```

## 7. Troubleshooting Checklist

### Before Deploy:
- [ ] Latest code pulled
- [ ] Dependencies installed (bun install)
- [ ] Environment files exist (.env.rausach, .env.prod.rausach)
- [ ] Docker running
- [ ] Ports 12000-12001 free
- [ ] Enough disk space

### During Deploy:
- [ ] Infrastructure deployed first (option 4)
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] Docker images created
- [ ] Images transferred to server
- [ ] Containers started

### After Deploy:
- [ ] Frontend accessible (http://116.118.49.243:12000)
- [ ] Backend accessible (http://116.118.49.243:12001/graphql)
- [ ] No errors in logs
- [ ] Database connected
- [ ] Redis connected
- [ ] Minio connected

## 8. Quick Commands

### 8.1. Full Reset & Redeploy

```bash
# Local cleanup
rm -rf backend/dist backend/node_modules
rm -rf frontend/.next frontend/node_modules
bun run setup

# Server cleanup
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.app.yml down && docker compose -f docker-compose.infra.yml down'

# Redeploy
bun run dev
# → 4: Deploy Infrastructure
# → 5: Deploy App
```

### 8.2. Check Everything

```bash
# Run this script
bun run dev
# → 13: Check Deployment Status
```

### 8.3. Emergency Stop

```bash
bun run dev
# → 6: Stop Services
```

## 9. Performance Tips

### 9.1. Build Optimization
- ✅ Use `--frozen-lockfile` để không update dependencies
- ✅ Clean dist/.next trước build để tránh cache issues
- ✅ Generate Prisma Client mỗi lần build

### 9.2. Deployment Optimization
- ✅ Build locally → Transfer images (faster than building on server)
- ✅ Use gzip compression cho image transfer
- ✅ Keep previous images for quick rollback
- ✅ Cleanup old images regularly

### 9.3. Server Resources
```bash
# Check memory
ssh root@116.118.49.243 'free -h'

# Check disk
ssh root@116.118.49.243 'df -h'

# Check CPU
ssh root@116.118.49.243 'top -bn1 | head -20'
```

## 10. Contact & Support

### Logs Location
```
Local:
  - backend/logs/
  - frontend/.next/

Server:
  - Docker logs: docker logs <container>
  - System logs: /var/log/
```

### Common Endpoints
```
Frontend:     http://116.118.49.243:12000
Backend:      http://116.118.49.243:12001
GraphQL:      http://116.118.49.243:12001/graphql
PostgreSQL:   116.118.49.243:12003
Redis:        116.118.49.243:12004
Minio:        http://116.118.49.243:12007
```

### Emergency Commands
```bash
# Stop everything
ssh root@116.118.49.243 'docker stop $(docker ps -q)'

# Remove everything
ssh root@116.118.49.243 'docker rm -f $(docker ps -aq)'

# Clean everything
ssh root@116.118.49.243 'docker system prune -af --volumes'
```

---

## Kết Luận

✅ **Scripts đã được fix và optimize**
✅ **Error handling improved**
✅ **Validation steps added**
✅ **Better logging and feedback**
✅ **Rollback capability**
✅ **Health checks integrated**

**Deployment giờ đây:**
- 🚀 Nhanh hơn (build locally)
- 🛡️ An toàn hơn (validation)
- 🔄 Dễ rollback hơn
- 📊 Dễ monitor hơn
- 🐛 Dễ debug hơn
