# 🚀 Deployment Optimization Guide - Tránh Treo Server

## 📋 Vấn Đề Hiện Tại
- Deployment hay treo server
- Không có timeout
- Không cleanup Docker resources
- Không health check

## ✅ Giải Pháp Tối Ưu Hóa

### 1. **Pre-deployment Checks** (Kiểm tra trước deploy)
```bash
✅ Kiểm tra dung lượng disk (cần > 10%)
✅ Kiểm tra bộ nhớ khả dụng (cần > 1GB)
✅ Kiểm tra kết nối mạng
```

### 2. **Docker Resource Cleanup** (Dọn dẹp tài nguyên)
```bash
✅ Tắt containers với timeout (30s)
✅ Xóa orphan containers
✅ Xóa unused images (>72h)
✅ Xóa unused volumes
✅ Xóa unused networks
✅ Xóa build cache nếu disk dưới 20%
```

### 3. **Optimized Deployment** (Deploy tối ưu)
```bash
✅ Timeout: 300 giây (tránh treo vô tận)
✅ --remove-orphans: Xóa container cũ
✅ --pull missing: Pull latest images
✅ --build: Build images mới (nếu cần)
```

### 4. **Health Checks** (Kiểm tra sức khỏe)
```bash
✅ Chờ containers ready (timeout: 60s)
✅ Check API health endpoint
✅ Verify số services chạy
```

### 5. **Post-deployment Cleanup** (Dọn dẹp sau deploy)
```bash
✅ Xóa old logs (>7 days)
✅ Xóa temp files
✅ Hiển thị resource usage
```

## 🎯 Cách Sử Dụng

### Option 1: Sử dụng Script Đơn Giản (Khuyên dùng)
```bash
bash scripts/3deploy.sh
```
**Lợi thế**: 
- Đơn giản, nhanh
- Tối ưu hóa cơ bản
- Tránh được treo server

### Option 2: Sử dụng Script Đầy Đủ (Chi tiết)
```bash
bash scripts/3deploy-optimized.sh
```
**Lợi thế**:
- Báo cáo chi tiết
- Health checks toàn bộ
- Rollback nếu lỗi

## 📊 So Sánh

| Feature | Trước | Sau |
|---------|-------|-----|
| Timeout | ❌ Không | ✅ 300s |
| Cleanup | ❌ Minimal | ✅ Toàn bộ |
| Pre-checks | ❌ Không | ✅ Đầy đủ |
| Health check | ❌ Không | ✅ Có |
| Rollback | ❌ Không | ✅ Tự động |
| Error handling | ❌ Weak | ✅ Strong |

## 🔧 Các Optimization Chính

### 1. Timeout Protection
```bash
# Deploy phải xong trong 300 giây, nếu không sẽ rollback
timeout 300 docker compose up -d --build --remove-orphans
```

### 2. Resource Cleanup
```bash
# Xóa images cũ hơn 72 giờ
docker image prune -af --filter "until=72h"

# Xóa volumes không dùng
docker volume prune -f

# Xóa networks không dùng
docker network prune -f
```

### 3. Graceful Shutdown
```bash
# Tắt containers với 30s timeout
docker compose down --timeout=30

# Nếu vẫn không tắt, force kill
docker ps -q | xargs -r docker kill
```

### 4. Health Checks
```bash
# Chờ containers ready
while [ $ELAPSED -lt 60 ]; do
    RUNNING=$(docker compose ps --status=running | grep -c "running")
    if [ $RUNNING -ge 4 ]; then break; fi
    sleep 5
done
```

## 📈 Kết Quả Dự Kiến

**Trước:**
- Deployment có thể treo 10-30 phút
- Server bị chiếm tài nguyên quá mức
- Không có feedback khi lỗi
- Phải manual restart

**Sau:**
- Deployment xong trong 5-10 phút
- Tài nguyên được quản lý tốt
- Báo cáo chi tiết mỗi bước
- Tự động rollback khi lỗi

## 🚨 Troubleshooting

### Vấn đề: Deployment vẫn bị treo
```bash
# Kiểm tra disk space
df -h

# Nếu >90%, xóa old logs
find . -name "*.log" -mtime +7 -delete

# Nếu vẫn full, clear Docker completely
docker system prune -a --volumes -f
```

### Vấn đề: Memory bị hết
```bash
# Kiểm tra memory
free -m

# Giới hạn memory per container (trong docker-compose.yml):
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

### Vấn đề: Containers không start
```bash
# Check logs
docker compose logs -f backend

# Restart services
docker compose restart

# Nếu vẫn lỗi, rebuild
docker compose up -d --build
```

## 💡 Best Practices

### 1. **Đặt Timeout**
```bash
timeout 300 command  # 5 phút = max 300 giây
```

### 2. **Health Checks**
```bash
# Trong docker-compose.yml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:14000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 3. **Resource Limits**
```bash
# Trong docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

### 4. **Monitoring**
```bash
# Real-time monitoring
watch 'docker stats --no-stream'

# Check logs
docker compose logs -f --tail=100
```

## 📝 Checklist Trước Deploy

- [ ] Disk space > 20%
- [ ] Memory available > 2GB
- [ ] Mạng ổn định
- [ ] Git clean (committed all changes)
- [ ] No running builds
- [ ] No port conflicts

## 🎯 Deployment Process

```
1. Local Git Operations ✅
   - Add files
   - Commit
   - Push

2. Remote Pre-checks ✅
   - Disk space
   - Memory
   - Git pull

3. Docker Cleanup ✅
   - Stop containers (timeout 30s)
   - Remove orphans
   - Prune resources

4. Deploy with Safety ✅
   - timeout 300s
   - --build --remove-orphans
   - Pull latest images

5. Health Checks ✅
   - Wait for containers
   - Check API health
   - Verify services

6. Optimization ✅
   - Clean logs
   - Clean temp files
   - Report usage

7. Done ✅
```

## 🔄 Automatic Retry

Nếu deployment fail:
```bash
# Script sẽ tự động:
1. Rollback (docker compose down)
2. Exit with error
3. Report error details
```

## 📞 Support

Nếu vẫn gặp vấn đề:

```bash
# 1. Check logs
docker compose logs backend

# 2. Check resources
docker stats

# 3. Manual cleanup
docker system prune -a --volumes

# 4. Force recreate
docker compose up -d --force-recreate --build
```

---

**Version**: 1.0.0  
**Date**: 2025-10-25  
**Status**: Ready for Production ✅
