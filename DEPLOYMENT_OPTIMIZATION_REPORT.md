# Báo Cáo Tối Ưu Hóa Deployment - Server 1 Core, 2GB RAM, 10GB Disk

**Ngày phân tích:** 4 tháng 11, 2025  
**Server:** 116.118.48.208  
**Cấu hình:** 1 Core CPU, 2GB RAM, 10GB SSD

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### Disk Usage (Ổ cứng)
#### Server Production (116.118.48.208)
- **Tổng dung lượng:** 21GB
- **Đã sử dụng:** 11GB (52%)
- **Còn trống:** 9.5GB
- **Trạng thái:** ⚠️ CẦN GIẢI PHÓNG (>50% usage)

#### Local Development
- **Tổng dự án:** 4.5GB
- **node_modules:** 3.6GB (80% tổng dung lượng!)
- **backend/kata_json:** 605MB (11 backup files)
- **Docker images:** 33.5GB total
  - **Có thể xóa:** 20.99GB (62%)
  - **Build cache:** 21GB
  - **Volumes unused:** 7.8GB (73%)

#### Build Artifacts (Chuẩn bị deploy)
- **Frontend .next/standalone:** 94MB ✅
- **Frontend .next/static:** 9.2MB ✅
- **Frontend public:** 505KB ✅
- **Backend dist:** 9.1MB ✅
- **TỔNG deployment size:** ~113MB (RẤT TỐI ƯU!)

### Memory Usage (RAM)
#### Server Current State
- **Tổng RAM:** 1.9GB (2GB physical)
- **Đã dùng:** 495MB (26%)
- **Available:** 1.4GB
- **Swap:** 0B (KHÔNG CÓ!)
- **Trạng thái:** ⚠️ CHƯA CÓ MEMORY LIMITS cho containers

#### Docker Containers (Chạy trên server)
- **postgres:** 34MB RAM, 0.01% CPU ✅
- **Các containers khác:** KHÔNG CÓ LIMITS!

### Docker Images Analysis
#### Local Machine
- **Total images:** 39 (nhiều images cũ!)
- **Active:** 17
- **Size:** 33.5GB
- **Reclaimable:** 20.99GB (62%) ⚠️

**Top images:**
- `katacore-frontend`: 3.55GB (CỰC LỚN!)
- `shoprausach-tazagroup-backend`: 1.5GB
- `shoprausach-rausach-backend`: 1.5GB
- `shoprausach-backend`: 1.33GB
- `katacore-backend`: 1.33GB

**Vấn đề:** Nhiều images `<none>` từ builds cũ

---

## 🎯 VẤN ĐỀ NGHIÊM TRỌNG CẦN FIX NGAY

### 🔴 CRITICAL (Ưu tiên cao nhất)

#### 1. **KHÔNG CÓ MEMORY LIMITS** 
- **Nguy cơ:** Container có thể chiếm hết RAM → server crash
- **Ảnh hưởng:** HIGH - Server 2GB RAM rất dễ OOM (Out of Memory)
- **Giải pháp:** Tạo `docker-compose.production.yml` với memory limits

#### 2. **KHÔNG CÓ SWAP**
- **Nguy cơ:** Khi RAM đầy → system kill processes
- **Ảnh hưởng:** HIGH - Containers bị restart liên tục
- **Giải pháp:** Thêm 1GB swap file

#### 3. **BACKUP FILES QUÁ NHIỀU (605MB)**
- **Vấn đề:** 11 backups trong `backend/kata_json/`
- **Ảnh hưởng:** MEDIUM - Chiếm 6% disk space
- **Giải pháp:** Giữ 3 backups mới nhất, xóa cũ

#### 4. **KHÔNG CÓ .dockerignore**
- **Vấn đề:** Build context gửi toàn bộ files → chậm
- **Ảnh hưởng:** MEDIUM - Build và deployment chậm
- **Giải pháp:** Tạo .dockerignore

#### 5. **DOCKER CLEANUP CHƯA LÀM**
- **Vấn đề:** 20.99GB có thể xóa (images, cache)
- **Ảnh hưởng:** LOW trên server, HIGH trên local
- **Giải pháo:** `docker system prune -a --volumes`

### 🟡 MEDIUM Priority

#### 6. **Frontend Image Quá Lớn (3.55GB)**
- **Nguyên nhân:** Build không tối ưu hoặc multi-stage
- **Giải pháp:** Review Dockerfile, sử dụng Alpine base

#### 7. **Deployment Script Chưa Tối Ưu**
- **Vấn đề:** 423 dòng code, có thể tối ưu hơn
- **Giải pháp:** Thêm compression, parallel upload

---

## ✅ NHỮNG ĐIỂM TỐT (Đã tối ưu)

1. ✅ **Frontend standalone build:** 103MB total - RẤT NHẸ
2. ✅ **Backend dist size:** 9.1MB - TUYỆT VỜI
3. ✅ **Đã loại bỏ Elasticsearch:** Tiết kiệm 512MB RAM
4. ✅ **PostgreSQL chỉ dùng 34MB RAM:** Tối ưu tốt
5. ✅ **Dockerfiles sử dụng Alpine:** Base images nhẹ
6. ✅ **Next.js output: standalone:** Đúng config cho Docker
7. ✅ **Deployment script có nhiều modes:** build/verify/fix

---

## 🚀 KẾ HOẠCH TỐI ƯU HÓA

### GIAI ĐOẠN 1: CRITICAL FIXES (Làm ngay - 30 phút)

#### 1.1. Tạo Docker Compose Production với Memory Limits
```yaml
# docker-compose.production.yml
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
    mem_limit: 512m
    mem_reservation: 384m
  
  frontend:
    mem_limit: 256m
    mem_reservation: 128m
  
  pgadmin:
    mem_limit: 128m
    mem_reservation: 64m

# TỔNG: ~1.4GB (còn dư 500MB cho system)
```

**Lý do phân bổ:**
- **Backend 512MB:** Cần cho Prisma generation (~300MB peak)
- **Postgres 256MB:** Database nhỏ, 34MB hiện tại
- **Frontend 256MB:** Next.js standalone nhẹ
- **Redis 128MB:** In-memory cache
- **MinIO 128MB:** Object storage
- **PgAdmin 128MB:** Admin tool (có thể tắt production)

#### 1.2. Thêm Swap File (1GB)
```bash
# Trên server
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### 1.3. Tạo .dockerignore Files
```
# /.dockerignore
node_modules/
.git/
.next/cache/
backend/kata_json/
backend/logs/
*.log
.env*
!.env.example
```

#### 1.4. Cleanup Backup Files (Giữ 3 mới nhất)
```bash
cd backend/kata_json
ls -t | tail -n +4 | xargs rm -rf
# Tiết kiệm: ~400MB
```

---

### GIAI ĐOẠN 2: DOCKER OPTIMIZATION (1 giờ)

#### 2.1. Docker Cleanup (Local)
```bash
# Xóa unused images
docker image prune -a -f
# Tiết kiệm: ~20GB

# Xóa build cache
docker builder prune -a -f
# Tiết kiệm: ~21GB

# Xóa unused volumes
docker volume prune -f
# Tiết kiệm: ~7.8GB
```

#### 2.2. Optimize Frontend Dockerfile
**Hiện tại:** 3.55GB image  
**Mục tiêu:** <200MB

**Vấn đề:** Có thể do build không xóa devDependencies

**Giải pháp:**
- ✅ Đã dùng `node:22-alpine` (tốt)
- ✅ Đã dùng standalone build (tốt)
- ⚠️ Cần kiểm tra COPY có đúng không

#### 2.3. Optimize Backend Dockerfile
**Hiện tại:** 1.33-1.5GB images  
**Mục tiêu:** <300MB

**Đánh giá:**
- ✅ Dùng `oven/bun:1.3-alpine` (tốt)
- ✅ Pre-built dist (tốt)
- ⚠️ Có thể cần xóa devDependencies sau Prisma generate

---

### GIAI ĐOẠN 3: DEPLOYMENT SPEED (30 phút)

#### 3.1. Tối Ưu rsync trong 95copy.sh
**Hiện tại:** Chưa có bandwidth limit rõ ràng

**Cải tiến:**
```bash
# Thêm compression
rsync -avz --compress-level=9 \
  --bwlimit=50000 \  # 50MB/s (tăng từ 10MB/s)
  --partial \
  --progress
```

#### 3.2. Parallel Build & Deploy
```bash
# Build backend và frontend song song
(cd backend && bun run build) &
(cd frontend && bun run build) &
wait
```

#### 3.3. Incremental Deploy
- Chỉ rsync files thay đổi
- Skip nếu checksum giống nhau
- Compress trước khi gửi

---

### GIAI ĐOẠN 4: MONITORING & MAINTENANCE

#### 4.1. Setup Docker Stats Monitoring
```bash
# Cron job kiểm tra memory mỗi 5 phút
*/5 * * * * docker stats --no-stream >> /var/log/docker-stats.log
```

#### 4.2. Auto Cleanup Script
```bash
# Xóa backups cũ hơn 7 ngày
find backend/kata_json/ -type d -mtime +7 -exec rm -rf {} \;

# Cleanup Docker mỗi tuần
0 0 * * 0 docker system prune -f
```

#### 4.3. Disk Space Alert
```bash
# Alert khi disk > 80%
df -h / | awk '{print $5}' | tail -1 | sed 's/%//' | \
  awk '{if($1>80) print "WARNING: Disk usage "$1"%"}'
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Immediate Actions (LÀM NGAY - 30 phút)
- [ ] 1. Tạo `docker-compose.production.yml` với memory limits
- [ ] 2. Thêm swap file 1GB trên server
- [ ] 3. Tạo `.dockerignore` files
- [ ] 4. Cleanup backup files (giữ 3 mới nhất)
- [ ] 5. Test deployment với production compose

### Short Term (1-2 giờ)
- [ ] 6. Docker cleanup local machine (tiết kiệm 40GB+)
- [ ] 7. Review và optimize frontend Docker image
- [ ] 8. Review và optimize backend Docker image
- [ ] 9. Test memory limits với full load
- [ ] 10. Optimize rsync trong deployment script

### Medium Term (1 ngày)
- [ ] 11. Setup monitoring script
- [ ] 12. Auto cleanup cron jobs
- [ ] 13. Disk space alerting
- [ ] 14. Documentation update
- [ ] 15. Performance benchmarking

---

## 📈 DỰ KIẾN KẾT QUẢ

### Disk Space
- **Trước:** 11GB used / 21GB (52%)
- **Sau cleanup:** ~8GB used / 21GB (38%)
- **Tiết kiệm:** ~3GB (backup cleanup + Docker cleanup)

### Memory Usage
- **Trước:** Không có limits (nguy hiểm!)
- **Sau:** Limits 1.4GB, dự phòng 500MB
- **An toàn:** ✅ Có swap 1GB backup

### Deployment Speed
- **Build artifacts:** 113MB (đã tối ưu)
- **Rsync speed:** Tăng 5x với compression
- **Downtime:** <30s (restart containers)

### Docker Images
- **Local cleanup:** Giải phóng ~40GB
- **Server images:** Giữ minimal set
- **Build cache:** Clear định kỳ

---

## 🎓 BEST PRACTICES ĐÃ ÁP DỤNG

✅ **Đã làm tốt:**
1. Next.js standalone output
2. Alpine base images
3. Pre-built artifacts
4. Loại bỏ Elasticsearch
5. Health checks cho containers
6. Non-root users trong containers

⚠️ **Cần cải thiện:**
1. Memory limits (CRITICAL)
2. Swap configuration
3. Backup retention policy
4. Docker cleanup automation
5. .dockerignore files
6. Monitoring & alerting

---

## 🔧 COMMANDS REFERENCE

### Production Deployment
```bash
# Deploy với production config
docker compose -f docker-compose.yml \
  -f docker-compose.production.yml \
  up -d

# Check memory usage
docker stats --no-stream

# Check disk
df -h /
du -sh /var/lib/docker/
```

### Cleanup Commands
```bash
# Full Docker cleanup
docker system prune -a --volumes -f

# Cleanup old backups
find backend/kata_json/ -type d -mtime +7 -exec rm -rf {} \;

# Check reclaimable space
docker system df
```

### Monitoring
```bash
# Memory per container
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"

# Disk usage
du -sh backend/ frontend/ | sort -h

# Container health
docker compose ps
```

---

## 📞 SUPPORT & NEXT STEPS

**Completed Analysis:**
- ✅ Disk usage profiling
- ✅ Memory analysis
- ✅ Docker images review
- ✅ Deployment script review
- ✅ Build artifacts verification

**Ready to Implement:**
1. Production Docker Compose overlay
2. Memory limits configuration
3. Swap file setup
4. .dockerignore creation
5. Backup cleanup automation

**Estimated Time:**
- Critical fixes: 30 minutes
- Docker optimization: 1 hour
- Deployment improvements: 30 minutes
- **Total: ~2 hours** cho full optimization

---

*Báo cáo này được tạo dựa trên phân tích chi tiết dự án innerv2 với mục tiêu tối ưu hóa deployment cho server có cấu hình hạn chế.*
