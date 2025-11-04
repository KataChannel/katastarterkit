# BÁO CÁO TỐI ỨU HÓA DỰ ÁN - SERVER 1 CORE, 2GB RAM, 10GB DISK

**Ngày tạo:** 4/11/2025  
**Cấu hình server:** 1 core CPU, 2GB RAM, 10GB ổ cứng  
**Mục tiêu:** Tối ưu tốc độ deploy và dung lượng cho server cấu hình thấp

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### 1. Dung Lượng Disk (Critical - Server 10GB)

**Local Workspace:**
```
Total: 4.5GB
├── node_modules: 3.6GB (80% - CẦN TỐI ƯU)
├── backend: 615MB
│   ├── kata_json: 602MB (98% backend - CẦN TỐI ƯU)
│   ├── dist: 9.1MB
│   └── src: 3.3MB
├── frontend: 171MB
│   ├── .next/standalone: 94MB
│   ├── .next/static: 9.2MB
│   └── public: 505KB
└── external: 6.3MB
```

**Server (116.118.48.208):**
```
Disk: 11GB/21GB used (52%)
├── Project: 3.3GB
├── Docker Images: 1.774GB (893MB có thể xóa)
├── Docker Volumes: 325MB (277MB có thể xóa)
└── Build Cache: 0B
```

**⚠️ VẤN ĐỀ NGHIÊM TRỌNG:**
- `kata_json`: 602MB backup data (11 versions, chỉ cần 1-2 versions mới nhất)
- `node_modules`: 3.6GB local (không deploy, nhưng làm chậm rsync nếu không exclude)
- Docker reclaimable: 893MB images + 277MB volumes = 1.17GB
- **Có thể tiết kiệm: ~4GB total**

### 2. Memory Usage (Warning - 81% Usage)

**Current Allocation:**
```
Total: 2048MB
Used: ~1652MB (81%)

Services:
├── PostgreSQL: ~200-256MB (estimated)
├── Redis: ~50-128MB (estimated)
├── MinIO: ~80-128MB (estimated)
├── Backend: ~350-384MB (Prisma generation peak)
├── Frontend: ~200-256MB (estimated)
└── System: ~200MB overhead
```

**⚠️ VẤN ĐỀ:**
- Không có memory limits trong docker-compose.yml (nguy cơ OOM)
- Backend cần 384MB cho Prisma generation
- Không có swap file (server có thể crash khi spike)
- **Cần add memory limits và swap**

### 3. Deployment Speed

**Current Deploy Time (95copy.sh):**
```
1. Local Build (bun run build):
   - Backend: ~30-60s (TypeScript compilation)
   - Frontend: ~60-120s (Next.js build with Turbopack)

2. Rsync Transfer (~3.3GB):
   - Upload speed: depends on network
   - Estimate: 5-10 minutes on slow connection

3. Docker Build (on server):
   - Backend: ~2-3 minutes (copy pre-built files)
   - Frontend: ~1-2 minutes (copy pre-built files)

4. Container Restart:
   - Stop: 10s
   - Prisma Generate: 15-30s
   - Start: 20-40s

Total: 10-20 minutes (mostly transfer time)
```

**⚠️ VẤN ĐỀ:**
- Rsync transfer tất cả files mỗi lần (không có incremental optimization)
- Không có .dockerignore → build context quá lớn
- Prisma generate chạy mỗi lần restart (15-30s overhead)

---

## 🎯 KHUYẾN NGHỊ TỐI ỨU HÓA

### PRIORITY 1: Giảm Dung Lượng (Critical)

#### 1.1. Cleanup `kata_json` Directory (Tiết kiệm: ~500MB)

**Vấn đề:** 11 versions backup, mỗi version 36-68MB

**Giải pháp:**
```bash
# Script tự động giữ 2 versions mới nhất
cat > backend/scripts/cleanup-kata-backups.sh << 'EOF'
#!/bin/bash
cd backend/kata_json
# Giữ 2 versions mới nhất, xóa phần còn lại
ls -t | tail -n +3 | xargs -r rm -rf
echo "Kept latest 2 versions, removed old backups"
EOF

chmod +x backend/scripts/cleanup-kata-backups.sh
```

**Kết quả:** 602MB → ~136MB (tiết kiệm 466MB)

#### 1.2. Tạo `.dockerignore` (Giảm build context 80%)

**Vấn đề:** Không có .dockerignore → Docker build copy toàn bộ 4.5GB

**Giải pháp:**
```dockerignore
# .dockerignore
# Root exclusions
node_modules
.git
.gitignore
.env*
*.log
.DS_Store
.vscode
.idea

# Documentation
docs/
README.md
*.md
!backend/README.md
!frontend/README.md

# Scripts & Tools
scripts/
tests/
promt/

# Frontend exclusions (backend build doesn't need)
frontend/.next/cache
frontend/.turbo
frontend/coverage
frontend/playwright-report

# Backend exclusions (frontend build doesn't need)
backend/kata_json
backend/logs
backend/data
backend/coverage
backend/test
backend/tests

# Lock files (copy explicitly in Dockerfile)
*.lock
!package-lock.json
!bun.lockb
```

**Kết quả:** Build context 4.5GB → ~600MB (87% reduction)

#### 1.3. Optimize `node_modules` (Không deploy)

**Vấn đề:** 3.6GB local node_modules

**Giải pháp:**
```bash
# Rsync exclude pattern trong 95copy.sh
cat > .rsyncignore << 'EOF'
node_modules/
.git/
.next/cache/
.turbo/
*.log
.DS_Store
coverage/
.vscode/
.idea/
EOF
```

**Kết quả:** Deploy size 4.5GB → ~900MB (80% reduction)

#### 1.4. Docker Cleanup (Tiết kiệm: 1.17GB server disk)

**Script tự động:**
```bash
# Thêm vào scripts/docker-cleanup.sh
#!/bin/bash
echo "🧹 Docker Cleanup - Remove unused resources"

# Remove unused images
echo "Removing unused images..."
docker image prune -af --filter "until=168h" # Keep last 7 days

# Remove unused volumes
echo "Removing unused volumes..."
docker volume prune -f

# Remove build cache
echo "Removing build cache..."
docker builder prune -af

# Show disk usage
echo -e "\n📊 Disk usage after cleanup:"
docker system df

echo "✅ Cleanup complete"
```

**Chạy:** `ssh root@116.118.48.208 "bash /root/innerv2/scripts/docker-cleanup.sh"`

**Kết quả:** Server disk 11GB → ~9.8GB used

### PRIORITY 2: Memory Optimization (High)

#### 2.1. Add Memory Limits to docker-compose.yml

**Tạo:** `docker-compose.production.yml`
```yaml
# docker-compose.production.yml
# Production memory limits for 2GB server
# Usage: docker compose -f docker-compose.yml -f docker-compose.production.yml up -d

services:
  postgres:
    mem_limit: 256m
    mem_reservation: 128m
    
  redis:
    mem_limit: 128m
    mem_reservation: 64m
    
  minio:
    mem_limit: 128m
    mem_reservation: 64m
    
  backend:
    mem_limit: 384m      # Prisma generation needs ~350MB peak
    mem_reservation: 192m
    
  frontend:
    mem_limit: 256m
    mem_reservation: 128m

# Total limits: 1152MB + system 200MB = 1352MB (~66% of 2GB)
# Reserved: 576MB (28%)
# Free for spikes: ~696MB
```

**Deploy:**
```bash
# Update 95copy.sh to use production compose
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
```

#### 2.2. Add Swap File (Recommended)

**Server setup:**
```bash
# Tạo 2GB swap
ssh root@116.118.48.208 << 'EOF'
# Check if swap exists
if [ $(swapon --show | wc -l) -eq 0 ]; then
  echo "Creating 2GB swap file..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  
  # Set swappiness (lower = use RAM more)
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  
  echo "✅ Swap enabled: 2GB"
else
  echo "Swap already exists"
fi
EOF
```

**Kết quả:** 2GB RAM + 2GB Swap = 4GB total (reduce OOM risk)

#### 2.3. Optimize Prisma Generation

**Backend entrypoint.sh optimization:**
```bash
# Check if Prisma client is already generated and valid
if [ -f "node_modules/.prisma/client/index.js" ]; then
  echo "✅ Prisma client exists, verifying..."
  
  # Quick verification instead of full regeneration
  if bun prisma validate 2>/dev/null; then
    echo "✅ Prisma client valid, skipping generation"
  else
    echo "⚠️ Prisma client invalid, regenerating..."
    bun prisma generate
  fi
else
  echo "🔧 Generating Prisma client..."
  bun prisma generate
fi
```

**Kết quả:** Restart time giảm từ 30s → 5s (nếu client valid)

### PRIORITY 3: Deployment Speed

#### 3.1. Optimize Rsync Transfer

**Update `95copy.sh`:**
```bash
# Add compression and incremental transfer
RSYNC_OPTS="-avz --progress --delete --partial --compress-level=6"

# Add exclude patterns
EXCLUDE_OPTS="
  --exclude='node_modules'
  --exclude='.git'
  --exclude='*.log'
  --exclude='.next/cache'
  --exclude='backend/kata_json/202510*'
  --exclude='backend/kata_json/202511[01]*'
"

rsync $RSYNC_OPTS $EXCLUDE_OPTS \
  --rsync-path="mkdir -p $REMOTE_DIR && rsync" \
  ./ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"
```

**Kết quả:** 
- First deploy: ~5-10 min (full transfer)
- Incremental: ~30-60s (only changed files)

#### 3.2. Parallel Deployment

**Script cải tiến:**
```bash
#!/bin/bash
# scripts/fast-deploy.sh - Parallel deployment for speed

# 1. Build locally (parallel)
echo "🔨 Building locally..."
(cd backend && bun run build) &
BACKEND_PID=$!
(cd frontend && bun run build) &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
echo "✅ Local builds complete"

# 2. Rsync (compressed, incremental)
echo "📤 Transferring files..."
rsync -avz --progress --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='backend/kata_json/20251[01]*' \
  ./ root@116.118.48.208:/root/innerv2/

# 3. Docker build (parallel)
echo "🐳 Building Docker images on server..."
ssh root@116.118.48.208 << 'EOF'
cd /root/innerv2
docker compose build backend &
BACKEND_BUILD=$!
docker compose build frontend &
FRONTEND_BUILD=$!
wait $BACKEND_BUILD $FRONTEND_BUILD
EOF

# 4. Restart services
echo "🔄 Restarting services..."
ssh root@116.118.48.208 << 'EOF'
cd /root/innerv2
docker compose down
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
EOF

echo "✅ Deployment complete!"
```

**Kết quả:** Total time giảm 30-40% (parallel execution)

#### 3.3. Cache Docker Layers

**Optimize Dockerfiles với better layer caching:**

**Backend Dockerfile:**
```dockerfile
# Copy dependencies first (cache layer)
COPY backend/package.json backend/bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source later (changes more often)
COPY backend/dist ./dist
COPY backend/prisma ./prisma
```

**Kết quả:** Docker rebuild từ 3min → 30s (nếu deps không đổi)

### PRIORITY 4: Additional Optimizations

#### 4.1. Frontend Bundle Size

**Next.js config optimization:**
```javascript
// frontend/next.config.js additions
const nextConfig = {
  // ... existing config
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Minimize bundle size
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@heroicons/react',
      'lucide-react',
    ],
  },
  
  // Tree shaking
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.sideEffects = false;
    }
    return config;
  },
};
```

**Bundle analysis:**
```bash
cd frontend
bun run build
# Check .next/standalone size
du -sh .next/standalone  # Target: <80MB
```

#### 4.2. Backend Dependencies Audit

**Remove unused dependencies:**
```bash
cd backend
# Check for unused packages
bunx depcheck

# Remove unused
bun remove <unused-package>
```

#### 4.3. Database Optimization

**PostgreSQL tuning for 2GB server:**
```sql
-- Add to postgres init script
ALTER SYSTEM SET shared_buffers = '128MB';
ALTER SYSTEM SET effective_cache_size = '512MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = '0.9';
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = '100';
ALTER SYSTEM SET random_page_cost = '1.1';
ALTER SYSTEM SET effective_io_concurrency = '200';
ALTER SYSTEM SET work_mem = '4MB';
SELECT pg_reload_conf();
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Immediate Wins (Execute Now)

- [ ] **Cleanup kata_json** (tiết kiệm 466MB)
  ```bash
  cd /chikiet/Innerbright/innerv2
  ls -t backend/kata_json | tail -n +3 | xargs -I {} rm -rf "backend/kata_json/{}"
  ```

- [ ] **Create .dockerignore** (giảm 87% build context)
  ```bash
  cat > .dockerignore << 'EOF'
  [paste content từ section 1.2]
  EOF
  ```

- [ ] **Docker cleanup on server** (tiết kiệm 1.17GB)
  ```bash
  ssh root@116.118.48.208 "docker system prune -af && docker volume prune -f"
  ```

- [ ] **Create .rsyncignore** (giảm 80% transfer size)
  ```bash
  cat > .rsyncignore << 'EOF'
  [paste content từ section 1.3]
  EOF
  ```

### Phase 2: Memory Safety (Critical)

- [ ] **Add swap file** (prevent OOM)
  ```bash
  ssh root@116.118.48.208 << 'EOF'
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  EOF
  ```

- [ ] **Create docker-compose.production.yml**
  ```bash
  cat > docker-compose.production.yml << 'EOF'
  [paste content từ section 2.1]
  EOF
  ```

- [ ] **Deploy with memory limits**
  ```bash
  # Update server deployment
  scp docker-compose.production.yml root@116.118.48.208:/root/innerv2/
  ssh root@116.118.48.208 "cd /root/innerv2 && docker compose -f docker-compose.yml -f docker-compose.production.yml up -d"
  ```

### Phase 3: Speed Improvements

- [ ] **Update 95copy.sh với rsync optimization**
  - Add compression: `-z --compress-level=6`
  - Add excludes: node_modules, .git, old kata_json
  - Add incremental: `--partial --delete`

- [ ] **Optimize Prisma generation** (entrypoint.sh)
  - Add validation check before regeneration
  - Cache client between restarts

- [ ] **Create fast-deploy.sh** (parallel deployment)
  - Parallel local builds
  - Parallel Docker builds on server

### Phase 4: Long-term Optimizations

- [ ] **Frontend bundle optimization**
  - Enable CSS optimization
  - Add package import optimization
  - Tree shaking configuration

- [ ] **Backend dependency audit**
  ```bash
  cd backend && bunx depcheck
  ```

- [ ] **PostgreSQL tuning**
  - Create postgres-tuning.sql
  - Apply on server

- [ ] **Monitoring setup**
  - docker stats monitoring
  - Disk usage alerts
  - Memory usage alerts

---

## 📈 EXPECTED RESULTS

### Disk Space
```
Before:
- Local: 4.5GB
- Server: 11GB
- Transfer: 3.3GB

After:
- Local: 4.0GB (-500MB kata_json cleanup)
- Server: 8.6GB (-1.17GB Docker prune, -1.2GB project optimization)
- Transfer: 600MB (-81% with excludes)
```

### Memory Usage
```
Before:
- Total: 2GB RAM, no swap
- Used: ~1652MB (81%)
- Risk: High (no limits, no swap)

After:
- Total: 2GB RAM + 2GB swap = 4GB
- Used: ~1352MB (66% of RAM)
- Limits: All services have mem_limit
- Risk: Low (swap buffer, controlled limits)
```

### Deploy Speed
```
Before:
- Build: 90-180s
- Transfer: 300-600s (3.3GB)
- Docker build: 180-300s
- Restart: 30-60s
Total: 10-18 minutes

After:
- Build: 60-120s (parallel)
- Transfer: 30-60s (600MB, incremental)
- Docker build: 30-60s (cached layers)
- Restart: 10-20s (Prisma cache)
Total: 2-4 minutes (first), 1-2 minutes (incremental)

Speed improvement: 70-85% faster
```

### Resource Efficiency
```
Disk saved: 2.4GB (server) + 500MB (local) = 2.9GB
Memory safety: +2GB swap, limits on all services
Deploy time: 10-18min → 1-4min (70-85% faster)
Server stability: High (swap + limits prevent OOM)
```

---

## 🚀 QUICK START

**Tối ưu toàn bộ trong 10 phút:**

```bash
# 1. Cleanup local (2 min)
cd /chikiet/Innerbright/innerv2
ls -t backend/kata_json | tail -n +3 | xargs -I {} rm -rf "backend/kata_json/{}"
cat > .dockerignore << 'EOF'
node_modules
.git
*.log
backend/kata_json/202510*
backend/kata_json/202511[01]*
EOF

# 2. Server cleanup + swap (3 min)
ssh root@116.118.48.208 << 'EOF'
# Docker cleanup
docker system prune -af
docker volume prune -f

# Add swap
if [ $(swapon --show | wc -l) -eq 0 ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
EOF

# 3. Create production compose (1 min)
cat > docker-compose.production.yml << 'EOF'
services:
  postgres:
    mem_limit: 256m
  redis:
    mem_limit: 128m
  minio:
    mem_limit: 128m
  backend:
    mem_limit: 384m
  frontend:
    mem_limit: 256m
EOF

# 4. Deploy optimized (3 min)
scp docker-compose.production.yml root@116.118.48.208:/root/innerv2/
./scripts/95copy.sh --build

# 5. Restart with limits (1 min)
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose -f docker-compose.yml -f docker-compose.production.yml up -d"

echo "✅ Optimization complete! Saved 2.9GB disk, added 2GB swap, 70% faster deploys"
```

---

## 📞 SUPPORT & MONITORING

### Check Resource Usage
```bash
# Memory
ssh root@116.118.48.208 "free -h && docker stats --no-stream"

# Disk
ssh root@116.118.48.208 "df -h && docker system df"

# Container health
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose ps"
```

### Troubleshooting

**OOM Errors:**
```bash
# Check swap
ssh root@116.118.48.208 "swapon --show"

# Increase backend limit if needed
# docker-compose.production.yml: backend mem_limit 384m → 512m
```

**Slow Deploy:**
```bash
# Check rsync with verbose
./scripts/95copy.sh --build -v

# Check network speed
ssh root@116.118.48.208 "speedtest-cli"
```

**Disk Full:**
```bash
# Cleanup old kata_json
ssh root@116.118.48.208 "cd /root/innerv2 && ls -t backend/kata_json | tail -n +2 | xargs rm -rf"

# Docker cleanup
ssh root@116.118.48.208 "docker system prune -af"
```

---

**Tác giả:** GitHub Copilot  
**Ngày:** 4/11/2025  
**Version:** 1.0
