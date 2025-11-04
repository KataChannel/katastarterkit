# 🚀 Quick Deployment Guide

## 📌 Script Tối Ưu Nhất: `deploy-production.sh`

Script này kết hợp điểm mạnh của:
- ✅ `95copy.sh` - Build verification, rsync optimization
- ✅ `deploy-hybrid.sh` - Multi-domain support, interactive menu
- ✅ Auto-detection Docker Compose v1/v2
- ✅ Pre-deployment checks & health checks
- ✅ Automatic database backup

**File:** `deploy-production.sh` (28KB, 890 lines)

---

## ⚡ Quick Start

### 1️⃣ Production Deployment (Khuyến nghị)

```bash
# Full deployment với build
./deploy-production.sh --mode hybrid --build

# Deployment không build (nhanh hơn)
./deploy-production.sh --mode hybrid --no-docker-build
```

### 2️⃣ Interactive Menu (Dễ sử dụng)

```bash
./deploy-production.sh --interactive
```

### 3️⃣ Deploy từng domain riêng

```bash
# Chỉ Rausach
./deploy-production.sh --mode rausach --build-frontend

# Chỉ Innerv2
./deploy-production.sh --mode innerv2 --build-frontend

# Chỉ shared services (Redis + Minio)
./deploy-production.sh --mode shared
```

### 4️⃣ Fix Mode (Khi có lỗi 404, assets missing)

```bash
./deploy-production.sh --fix
```

### 5️⃣ Verify Build (Kiểm tra trước khi deploy)

```bash
./deploy-production.sh --verify
```

---

## 📋 Các Options

```bash
--mode <mode>       # hybrid, rausach, innerv2, shared
--build             # Build frontend + backend
--build-frontend    # Chỉ build frontend
--build-backend     # Chỉ build backend
--no-docker-build   # Skip Docker rebuild (nhanh hơn)
--verify            # Kiểm tra build không deploy
--fix               # Fix mode - sync critical files
--no-backup         # Skip database backup
--interactive       # Interactive menu
--help              # Hiển thị help
```

---

## 🎯 Use Cases

### Case 1: Deploy lần đầu
```bash
./deploy-production.sh --mode hybrid --build
```

### Case 2: Update code nhanh (đã có build)
```bash
./deploy-production.sh --mode hybrid --no-docker-build
```

### Case 3: Fix production issue
```bash
./deploy-production.sh --fix
```

### Case 4: Deploy sau khi sửa frontend
```bash
./deploy-production.sh --mode hybrid --build-frontend
```

### Case 5: Test local build
```bash
./deploy-production.sh --verify
```

---

## 🔍 Deployment Flow

```
1. Pre-deployment Checks
   ✓ SSH connection
   ✓ Docker installed
   ✓ .env files correct
   ✓ Disk space
   ✓ Memory available

2. Build (nếu có --build)
   ✓ Frontend: bun/npm build
   ✓ Backend: Prisma generate

3. Verify Build Output
   ✓ .next/standalone
   ✓ .next/static
   ✓ public/
   ✓ Prisma client

4. Backup Databases (auto)
   ✓ Rausach DB
   ✓ Innerv2 DB

5. Deploy to Server
   ✓ Rsync với exclude list
   ✓ Optimized compression

6. Docker Deployment
   ✓ docker-compose.hybrid.yml
   ✓ Start services by mode

7. Health Checks
   ✓ Frontend URLs
   ✓ Backend GraphQL
   ✓ Database connections

8. Summary Report
   ✓ URLs
   ✓ Status
   ✓ Next steps
```

---

## 🌐 URLs Sau Khi Deploy

### Rausach Domain
- Frontend: http://116.118.48.208:12000
- Backend: http://116.118.48.208:12001/graphql
- Database: 116.118.48.208:12003

### Innerv2 Domain
- Frontend: http://116.118.48.208:13000
- Backend: http://116.118.48.208:13001/graphql
- Database: 116.118.48.208:13003

### Shared Services
- Minio Console: http://116.118.48.208:12008
- Redis: 116.118.48.208:12004

---

## 🐛 Troubleshooting

### Lỗi: SSH connection failed
```bash
# Cấu hình SSH key
ssh-copy-id root@116.118.48.208
```

### Lỗi: Build verification failed
```bash
# Build lại frontend
cd frontend
bun run build
cd ..

# Verify
./deploy-production.sh --verify
```

### Lỗi: Docker container failed
```bash
# SSH vào server kiểm tra
ssh root@116.118.48.208
cd /root/shoprausach
docker compose -f docker-compose.hybrid.yml logs -f
```

### Lỗi: Port already in use
```bash
# SSH vào server
ssh root@116.118.48.208

# Kiểm tra port
netstat -tlnp | grep 12000

# Stop conflicting containers
docker ps -a
docker stop <container_id>
```

### Memory cao (>90%)
```bash
# SSH vào server
ssh root@116.118.48.208

# Check memory
free -h
docker stats

# Restart containers
cd /root/shoprausach
docker compose -f docker-compose.hybrid.yml restart
```

---

## 📊 So Sánh Scripts

| Feature | 95copy.sh | deploy-hybrid.sh | **deploy-production.sh** |
|---------|-----------|------------------|--------------------------|
| **Build support** | ✅ Frontend | ❌ | ✅ Frontend + Backend |
| **Multi-domain** | ❌ | ✅ | ✅ |
| **Auto backup** | ❌ | ✅ Limited | ✅ Full |
| **Health checks** | ❌ | ❌ | ✅ |
| **Interactive menu** | ❌ | ✅ | ✅ Enhanced |
| **Pre-checks** | ✅ Limited | ✅ | ✅ Comprehensive |
| **Fix mode** | ✅ | ❌ | ✅ |
| **Verify mode** | ✅ | ❌ | ✅ |
| **Docker v1/v2** | ❌ | ✅ | ✅ |
| **Progress info** | ✅ | ✅ | ✅ Enhanced |
| **Lines of code** | 424 | 306 | **890** 🏆 |

---

## ✅ Checklist Trước Khi Deploy

- [ ] Code đã commit và push lên Git
- [ ] .env.rausach DATABASE_URL = rausachcore ✅
- [ ] .env.innerv2 Redis/Minio ports = 12004/12007 ✅
- [ ] Frontend build thành công (nếu --build)
- [ ] SSH key đã cấu hình
- [ ] Server có đủ disk space (>2GB free)
- [ ] Server có đủ RAM (1.5-2GB)
- [ ] Backup database gần nhất (nếu production)

---

## 🎓 Examples Chi Tiết

### Example 1: First Production Deploy
```bash
# Step 1: Verify local build
./deploy-production.sh --verify

# Step 2: Deploy với build
./deploy-production.sh --mode hybrid --build

# Step 3: Test URLs
curl http://116.118.48.208:12000
curl http://116.118.48.208:13000

# Step 4: Check logs
ssh root@116.118.48.208 'cd /root/shoprausach && docker compose -f docker-compose.hybrid.yml logs -f --tail=50'
```

### Example 2: Quick Update (Code change only)
```bash
# Skip build, skip docker rebuild (fastest)
./deploy-production.sh --mode hybrid --no-docker-build
```

### Example 3: Frontend Update
```bash
# Build frontend only, deploy
./deploy-production.sh --mode hybrid --build-frontend
```

### Example 4: Backend Update
```bash
# Build backend only, deploy
./deploy-production.sh --mode hybrid --build-backend
```

### Example 5: Emergency Fix
```bash
# Fix mode: sync critical files + restart
./deploy-production.sh --fix
```

---

## 📚 Tài Liệu Liên Quan

1. **BAO_CAO_HYBRID_DEPLOYMENT_VA_BUG_FIXES.md** - Báo cáo tổng hợp (700+ lines)
2. **docs/320-HUONG_DAN_HYBRID_DEPLOYMENT.md** - Hướng dẫn chi tiết
3. **HE_THONG_USER_VA_PHAN_QUYEN.md** - Auth & Authorization
4. **.env.rausach** & **.env.innerv2** - Environment configs

---

## 🔗 Useful Commands

```bash
# View deployment help
./deploy-production.sh --help

# SSH to server
ssh root@116.118.48.208

# Check server status
ssh root@116.118.48.208 'cd /root/shoprausach && docker compose -f docker-compose.hybrid.yml ps'

# View logs
ssh root@116.118.48.208 'cd /root/shoprausach && docker compose -f docker-compose.hybrid.yml logs -f'

# Check resource usage
ssh root@116.118.48.208 'docker stats'

# Manual backup
ssh root@116.118.48.208 'cd /root/shoprausach && mkdir -p backups && docker exec rausach-postgres pg_dump -U postgres rausachcore > backups/manual_$(date +%Y%m%d).sql'

# Restart specific service
ssh root@116.118.48.208 'cd /root/shoprausach && docker compose -f docker-compose.hybrid.yml restart rausach-frontend'
```

---

## 🎉 Kết Luận

**`deploy-production.sh`** là script tối ưu nhất cho production deployment:

✅ **All-in-one** - Build, verify, deploy, health check  
✅ **Multi-mode** - Hybrid, single domain, fix mode  
✅ **Safe** - Auto backup, pre-checks, verification  
✅ **Fast** - Optimized rsync, skip options  
✅ **User-friendly** - Interactive menu, colored output  
✅ **Production-ready** - Comprehensive error handling  

**Khuyến nghị:** Sử dụng `--interactive` lần đầu để làm quen với các options!

---

**Ngày tạo:** 3/11/2025  
**Version:** 1.0  
**Script size:** 28KB (890 lines)  
**Status:** ✅ Production Ready
