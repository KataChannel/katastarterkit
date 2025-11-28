# Kiến Trúc Deployment - Rausach

## 🏗️ Tổng Quan

Hệ thống sử dụng **kiến trúc tách biệt** giữa Infrastructure và Application để:
- ✅ Deploy app mà không ảnh hưởng infrastructure
- ✅ Infrastructure chạy độc lập, ít restart
- ✅ Dễ rollback app mà không động đến data
- ✅ Scale từng phần riêng biệt

## 📂 Docker Compose Files

### 1. `docker-compose.infra.yml` - Infrastructure Layer
**Mục đích**: Database, Cache, Storage
**Services**:
- `shoppostgres` (PostgreSQL 16) - Port 12003
- `redis` (Redis 7.4) - Port 12004  
- `minio` (Minio S3) - Port 12007/12008

**Network**: `rausach-network` (bridge)
**Volumes**: Persistent data storage
- `rausach_postgres_data`
- `redis_data`
- `minio_data`

**Deploy Command**:
```bash
cd /root/shoprausach
docker compose -f docker-compose.infra.yml up -d
```

**Stop Command**:
```bash
docker compose -f docker-compose.infra.yml down
# ⚠️ Cẩn thận: Sẽ stop DB, Redis, Minio!
```

---

### 2. `docker-compose.app.yml` - Application Layer
**Mục đích**: Backend API + Frontend Web
**Services**:
- `shopbackend` (NestJS + GraphQL) - Port 12001
- `shopfrontend` (Next.js) - Port 12000

**Network**: `rausach-network` (external, tham chiếu từ infra)
**Dependencies**: 
- Backend connects to: `shoppostgres`, `redis`, `minio` (by hostname)
- Frontend depends on: `shopbackend`

**Deploy Command**:
```bash
cd /root/shoprausach
docker compose -f docker-compose.app.yml up -d --force-recreate
```

**Stop Command**:
```bash
docker compose -f docker-compose.app.yml down
# ✅ An toàn: Chỉ stop app, không động infrastructure
```

---

### 3. `docker-compose.hybrid.yml` - Legacy/Development Only
**Status**: ⚠️ **KHÔNG DÙNG cho Production**
**Mục đích**: File cũ, định nghĩa toàn bộ stack trong 1 file
**Vấn đề**: 
- `depends_on` với `condition: service_healthy` gây conflict
- `docker compose down` sẽ xóa cả infrastructure
- Khó quản lý deploy riêng biệt

**Khuyến nghị**: 
- 🚫 **Không deploy bằng file này**
- ✅ Dùng `docker-compose.infra.yml` + `docker-compose.app.yml`

---

## 🔄 Quy Trình Deploy

### A. Lần Đầu Setup (Fresh Server)

```bash
# 1. Deploy Infrastructure
./scripts/deployment/deploy-infrastructure.sh
# → Tạo network: rausach-network
# → Start: shoppostgres, redis, minio
# → Volumes: Tạo persistent storage

# 2. Đợi infrastructure ready (~20s)
# Check: docker ps | grep -E "postgres|redis|minio"

# 3. Deploy Application
./scripts/deployment/deploy-optimized.sh
# → Build backend + frontend locally
# → Transfer images to server
# → Start: shopbackend, shopfrontend
# → Backend connects to infrastructure via network
```

### B. Update Code (Re-deploy App)

```bash
# 1. Build & Deploy App
./scripts/deployment/deploy-optimized.sh

# Quá trình:
# ✅ Check infrastructure running (nếu không → auto start)
# ✅ Build backend dist + frontend .next
# ✅ Create Docker images
# ✅ Transfer to server (rsync)
# ✅ Load images on server
# ✅ Remove ONLY app containers (docker rm -f shopbackend shopfrontend)
# ✅ Start app with: docker compose -f docker-compose.app.yml up -d
# ❌ KHÔNG động đến: shoppostgres, redis, minio
```

### C. Update Infrastructure (Hiếm khi)

```bash
# 1. Stop app trước
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.app.yml down'

# 2. Update infrastructure
./scripts/deployment/deploy-infrastructure.sh
# → Stop old: docker compose -f docker-compose.infra.yml down
# → Pull new images
# → Start: docker compose -f docker-compose.infra.yml up -d

# 3. Restart app
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.app.yml up -d'
```

---

## 🔗 Network Architecture

```
┌─────────────────────────────────────────────────────┐
│          rausach-network (bridge)                   │
│  Docker Network: Cho phép containers giao tiếp      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Infrastructure Layer                               │
│  ┌─────────────────┐  ┌──────────┐  ┌──────────┐  │
│  │ shoppostgres    │  │  redis   │  │  minio   │  │
│  │ :5432           │  │  :6379   │  │  :9000   │  │
│  └─────────────────┘  └──────────┘  └──────────┘  │
│          ↑                  ↑             ↑         │
│          │                  │             │         │
│          └──────────────────┴─────────────┘         │
│                      │                              │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │            shopbackend                       │  │
│  │  - Connects by hostname                      │  │
│  │  - DATABASE_URL: shoppostgres:5432           │  │
│  │  - REDIS_HOST: redis                         │  │
│  │  - MINIO_ENDPOINT: minio                     │  │
│  └──────────────────────────────────────────────┘  │
│                      ↑                              │
│                      │                              │
│  ┌──────────────────┴───────────────────────────┐  │
│  │            shopfrontend                       │  │
│  │  - Calls backend GraphQL API                 │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

External Access (Host Ports):
  12000 → shopfrontend:3000
  12001 → shopbackend:4000
  12003 → shoppostgres:5432
  12004 → redis:6379
  12007 → minio:9000
  12008 → minio:9001 (console)
```

---

## ✅ Kiểm Tra Deploy Không Đụng Infrastructure

### Test 1: Deploy Script
```bash
# File: scripts/deployment/deploy-optimized.sh
# Line ~298-310

# ✅ Check infrastructure running
if ! docker ps | grep -q "shoppostgres"; then
    docker compose -f docker-compose.infra.yml up -d
fi

# ✅ Remove ONLY app containers
docker rm -f shopbackend shopfrontend

# ✅ Start ONLY app
docker compose -f docker-compose.app.yml up -d --force-recreate
# Không có --remove-orphans flag!
```

### Test 2: App Compose File
```yaml
# File: docker-compose.app.yml

services:
  shopbackend:
    # ...
    depends_on:
      - shopbackend  # ✅ CHỈ depend vào shopbackend
    networks:
      - hybrid-network  # ✅ External network

networks:
  hybrid-network:
    external: true  # ✅ Không tạo mới, dùng existing
```

### Test 3: Infrastructure Compose File
```yaml
# File: docker-compose.infra.yml

services:
  shoppostgres:
    # ...
  redis:
    # ...
  minio:
    # ...

networks:
  hybrid-network:
    driver: bridge
    name: rausach-network  # ✅ Tạo network này
```

### Test 4: Thực Tế
```bash
# Deploy app
./scripts/deployment/deploy-optimized.sh

# Check infrastructure vẫn chạy
ssh root@116.118.49.243 'docker ps | grep -E "postgres|redis|minio"'
# Output: 
# ✅ shoppostgres  Up X hours
# ✅ shared-redis  Up X hours  
# ✅ shared-minio  Up X hours

# Uptime KHÔNG thay đổi sau khi deploy app!
```

---

## 🐛 Lịch Sử Bug Fixes

### Bug 1: Infrastructure Bị Stop Khi Deploy App (FIXED)
**Nguyên nhân**: 
```bash
# CODE CŨ - SAI
docker compose -f docker-compose.app.yml down
docker compose -f docker-compose.app.yml up -d --remove-orphans
# → --remove-orphans xóa containers không trong app.yml!
```

**Fix**:
```bash
# CODE MỚI - ĐÚNG
docker rm -f shopbackend shopfrontend  # Chỉ xóa app
docker compose -f docker-compose.app.yml up -d --force-recreate
# → Không có --remove-orphans
```

### Bug 2: Backend Health Check Fail (FIXED)
**Nguyên nhân**: 
- Infrastructure stopped → Backend không connect được
- Wait time quá ngắn (5s)
- Chỉ thử 1 lần

**Fix**:
```bash
# 1. Ensure infrastructure running trước
# 2. Wait 45s cho backend startup
# 3. Retry health check 5 lần với 10s delay
```

### Bug 3: Script Paths Sai (FIXED)
**Nguyên nhân**: 
```bash
# SCRIPT_DIR đã ở scripts/
# Nhưng path vẫn dùng ./scripts/deployment/
```

**Fix**:
```bash
# Đổi thành ./deployment/ (relative to SCRIPT_DIR)
```

---

## 📊 Monitoring Commands

### Check All Services
```bash
ssh root@116.118.49.243 'docker ps'
```

### Check Infrastructure Only
```bash
ssh root@116.118.49.243 'docker ps | grep -E "postgres|redis|minio"'
```

### Check App Only
```bash
ssh root@116.118.49.243 'docker ps | grep -E "shop(backend|frontend)"'
```

### Logs - Backend
```bash
ssh root@116.118.49.243 'docker logs shopbackend -f'
```

### Logs - Frontend
```bash
ssh root@116.118.49.243 'docker logs shopfrontend -f'
```

### Logs - Infrastructure
```bash
ssh root@116.118.49.243 'docker logs shoppostgres --tail 50'
ssh root@116.118.49.243 'docker logs shared-redis --tail 50'
ssh root@116.118.49.243 'docker logs shared-minio --tail 50'
```

### Health Checks
```bash
# PostgreSQL
ssh root@116.118.49.243 'docker exec shoppostgres pg_isready -U postgres'

# Redis
ssh root@116.118.49.243 'docker exec shared-redis redis-cli ping'

# Backend GraphQL
curl -sf http://116.118.49.243:12001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__typename}"}'

# Frontend
curl -sf http://116.118.49.243:12000
```

---

## 🔐 Security Best Practices

### 1. Network Isolation
- ✅ App và Infra trong cùng bridge network
- ✅ Không expose unnecessary ports
- ✅ Infrastructure chỉ accept connections từ network

### 2. Container Restart Policies
```yaml
restart: unless-stopped
# → Container tự động restart nếu crash
# → KHÔNG restart nếu manually stopped
```

### 3. Resource Limits
```yaml
deploy:
  resources:
    limits:
      memory: 512M  # Max memory
    reservations:
      memory: 256M  # Reserved memory
```

### 4. Health Checks
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## 📝 Checklist Deploy Production

### Pre-Deploy
- [ ] Infrastructure running và healthy
- [ ] Latest code pulled từ git
- [ ] Dependencies installed (bun install)
- [ ] .env.rausach và .env.prod.rausach tồn tại
- [ ] Docker running locally
- [ ] Ports 12000-12001 free locally (nếu test local)
- [ ] Server disk space đủ (>5GB free)

### During Deploy
- [ ] Backend build thành công
- [ ] Frontend build thành công  
- [ ] Docker images tạo thành công
- [ ] Transfer to server thành công
- [ ] Infrastructure vẫn running
- [ ] App containers started

### Post-Deploy
- [ ] Frontend accessible (http://116.118.49.243:12000)
- [ ] Backend accessible (http://116.118.49.243:12001/graphql)
- [ ] Backend logs không có error
- [ ] Frontend logs không có error
- [ ] Database connected
- [ ] Redis connected
- [ ] Minio connected

---

## 🚀 Quick Commands

### Full Deploy (Infrastructure + App)
```bash
# Lần đầu
bun run dev  # Option 4: Deploy Infrastructure
bun run dev  # Option 5: Deploy App
```

### Update App Only
```bash
bun run dev  # Option 5: Deploy App
```

### Stop Everything
```bash
bun run dev  # Option 6 → Option 3: Everything
```

### Rollback
```bash
bun run dev  # Option 9: Rollback
```

### Check Status
```bash
bun run dev  # Option 13: Check Deployment Status
```

---

## 🎯 Kết Luận

✅ **Kiến trúc tách biệt** giữa Infrastructure và Application đảm bảo:
1. Deploy app **KHÔNG ảnh hưởng** infrastructure
2. Infrastructure **chạy độc lập**, data persistent
3. Dễ dàng **rollback app** mà không mất data
4. **Scale riêng biệt** từng layer

✅ **Scripts đã được fix** để:
1. Không dùng `--remove-orphans` khi deploy app
2. Ensure infrastructure running trước khi start app
3. Extended wait time cho backend startup
4. Retry health checks với proper delays

✅ **Không còn risk** infrastructure bị stop khi deploy app!
