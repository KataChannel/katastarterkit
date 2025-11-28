# 🚀 LMS DEPLOYMENT GUIDE - HƯỚNG DẪN TRIỂN KHAI

## 📚 Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Build Docker Images](#build-docker-images)
3. [Deploy lên Server](#deploy-lên-server)
4. [Kiểm tra và xác minh](#kiểm-tra-và-xác-minh)
5. [Troubleshooting](#troubleshooting)

---

## 🖥️ Yêu cầu hệ thống

### Server
- **OS**: Ubuntu 20.04+ hoặc CentOS 7+
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **CPU**: 2 cores trở lên
- **Disk**: 50GB free space
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Local Development
- **Bun.js**: Version 1.0+
- **Node.js**: Version 18+ (nếu không dùng Bun)
- **SSH Access**: Đến server

---

## 🏗️ Build Docker Images

### Bước 1: Chuẩn bị

```bash
# Di chuyển đến thư mục project
cd /mnt/chikiet/kataoffical/shoprausach

# Đảm bảo các dependencies đã được install
bun install
cd backend && bun install && cd ..
cd frontend && bun install && cd ..
```

### Bước 2: Build Images

#### Option 1: Build tất cả domains
```bash
bun run docker:build
```

Lệnh này sẽ:
- Build backend images cho: rausach, tazagroup, timona
- Build frontend images cho: rausach, tazagroup, timona
- Save images thành `.tar.gz` files trong `docker-images/`

#### Option 2: Build từng domain

**Build RAUSACH:**
```bash
./scripts/build/build-rausach.sh
```

**Build TAZAGROUP:**
```bash
./scripts/build/build-tazagroup.sh
```

**Build TIMONA:**
```bash
./scripts/build/build-timona.sh
```

### Bước 3: Kiểm tra images

```bash
ls -lh docker-images/
```

Kết quả mong đợi:
```
rausach-backend.tar.gz   (200-300MB)
rausach-frontend.tar.gz  (100-200MB)
tazagroup-backend.tar.gz (200-300MB)
tazagroup-frontend.tar.gz (100-200MB)
timona-backend.tar.gz    (200-300MB)
timona-frontend.tar.gz   (100-200MB)
```

---

## 🚀 Deploy lên Server

### Cấu hình SSH

Đảm bảo bạn có thể SSH vào server:
```bash
ssh root@116.118.49.243
```

### Deploy TAZAGROUP

```bash
./scripts/deploy/deploy-tazagroup.sh
```

**Quy trình deploy:**
1. ✅ Kiểm tra Docker images tồn tại
2. 📦 Upload images lên server
3. 🔄 Load images vào Docker
4. 🛑 Dừng containers cũ
5. 🚀 Khởi động containers mới
6. 🧹 Dọn dẹp images cũ

**Ports:**
- Frontend: 13000
- Backend: 13001
- URL: http://app.tazagroup.vn

### Deploy RAUSACH

```bash
./scripts/deploy/deploy-rausach.sh
```

**Ports:**
- Frontend: 12000
- Backend: 12001
- URL: http://shop.rausachtrangia.com

### Deploy TIMONA

```bash
./scripts/deploy/deploy-timona.sh
```

**Ports:**
- Frontend: 15000
- Backend: 15001
- URL: http://app.timona.edu.vn

---

## ✅ Kiểm tra và xác minh

### Kiểm tra containers đang chạy

SSH vào server:
```bash
ssh root@116.118.49.243

# Kiểm tra TAZAGROUP
docker ps | grep tazagroup

# Kiểm tra RAUSACH
docker ps | grep -E '(shopbackend|shopfrontend)'

# Kiểm tra TIMONA
docker ps | grep timona
```

### Kiểm tra logs

```bash
# TAZAGROUP
docker logs -f tazagroup-backend
docker logs -f tazagroup-frontend

# RAUSACH
docker logs -f shopbackend
docker logs -f shopfrontend

# TIMONA
docker logs -f timona-backend
docker logs -f timona-frontend
```

### Kiểm tra health

```bash
# Backend health
curl http://116.118.49.243:13001/health
curl http://116.118.49.243:12001/health
curl http://116.118.49.243:15001/health

# GraphQL endpoints
curl http://116.118.49.243:13001/graphql -d '{"query":"{__typename}"}'
curl http://116.118.49.243:12001/graphql -d '{"query":"{__typename}"}'
curl http://116.118.49.243:15001/graphql -d '{"query":"{__typename}"}'
```

### Kiểm tra frontend

Truy cập URLs:
- http://app.tazagroup.vn
- http://shop.rausachtrangia.com
- http://app.timona.edu.vn

---

## 🐛 Troubleshooting

### Lỗi: Docker image not found

**Triệu chứng:**
```
❌ Error: Docker image not found: ./docker-images/tazagroup-backend.tar.gz
```

**Nguyên nhân:**
- Chưa build Docker images
- Build failed nhưng không có thông báo
- Files bị xóa

**Giải pháp:**
```bash
# Build lại images
bun run docker:build

# Hoặc build từng domain
./scripts/build/build-tazagroup.sh
```

### Lỗi: Cannot connect to Docker daemon

**Triệu chứng:**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Nguyên nhân:**
- Docker chưa chạy trên server
- Permission issue

**Giải pháp:**
```bash
# SSH vào server
ssh root@116.118.49.243

# Start Docker
systemctl start docker
systemctl enable docker

# Check status
systemctl status docker
```

### Lỗi: Port already in use

**Triệu chứng:**
```
Error: bind: address already in use
```

**Nguyên nhân:**
- Container cũ vẫn chạy
- Process khác đang dùng port

**Giải pháp:**
```bash
# Xem container đang chạy
docker ps

# Stop containers cũ
docker stop tazagroup-backend tazagroup-frontend
docker rm tazagroup-backend tazagroup-frontend

# Hoặc check process dùng port
lsof -i :13001
kill -9 <PID>
```

### Lỗi: Container stops immediately

**Triệu chứng:**
Container start nhưng tắt ngay

**Nguyên nhân:**
- Lỗi trong code
- Environment variables thiếu/sai
- Database không kết nối được

**Giải pháp:**
```bash
# Xem logs
docker logs tazagroup-backend

# Check environment
docker exec -it tazagroup-backend env

# Check .env file
cat /opt/tazagroup/.env
```

### Lỗi: Frontend không load

**Triệu chứng:**
- Trang trắng
- 502 Bad Gateway
- Không kết nối được

**Nguyên nhân:**
- Backend chưa chạy
- CORS issues
- Nginx config sai

**Giải pháp:**
```bash
# 1. Check backend đang chạy
curl http://localhost:13001/health

# 2. Check frontend logs
docker logs tazagroup-frontend

# 3. Check Nginx config
cat /etc/nginx/sites-enabled/tazagroup.conf
nginx -t
systemctl reload nginx
```

### Lỗi: Database connection failed

**Triệu chứng:**
```
Error: connect ECONNREFUSED 116.118.49.243:12003
```

**Nguyên nhân:**
- PostgreSQL không chạy
- Firewall block port
- Wrong credentials

**Giải pháp:**
```bash
# Check PostgreSQL
docker ps | grep postgres

# Test connection
psql -h 116.118.49.243 -p 12003 -U postgres -d tazagroupcore

# Check .env
grep DATABASE_URL /opt/tazagroup/.env
```

---

## 🔄 Cập nhật ứng dụng

### Quick Update (Code changes only)

```bash
# 1. Build images mới
bun run docker:build

# 2. Deploy
./scripts/deploy/deploy-tazagroup.sh
```

### Full Update (Dependencies changed)

```bash
# 1. Pull code mới
git pull origin main

# 2. Install dependencies
bun install
cd backend && bun install && cd ..
cd frontend && bun install && cd ..

# 3. Build & Deploy
bun run docker:build
./scripts/deploy/deploy-tazagroup.sh
```

---

## 📊 Monitoring

### Resource Usage

```bash
# SSH vào server
ssh root@116.118.49.243

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Docker stats
docker stats
```

### Application Logs

```bash
# Real-time logs
docker logs -f --tail 100 tazagroup-backend

# Last 1000 lines
docker logs --tail 1000 tazagroup-backend

# Save logs to file
docker logs tazagroup-backend > backend.log
```

---

## 🔒 Security Checklist

Trước khi deploy production:

- ✅ Đổi tất cả default passwords
- ✅ Update JWT_SECRET
- ✅ Update NEXTAUTH_SECRET
- ✅ Enable HTTPS (SSL certificates)
- ✅ Configure firewall
- ✅ Enable rate limiting
- ✅ Setup backup strategy
- ✅ Configure monitoring & alerts
- ✅ Review environment variables
- ✅ Test disaster recovery

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check logs đầu tiên
2. Xem [Troubleshooting](#troubleshooting)
3. Search trong docs
4. Liên hệ team DevOps

---

**🔗 Liên kết hữu ích**:
- [Trang chủ LMS Manual](./LMS-MANUAL-INDEX.md)
- [Architecture Documentation](./02-ARCHITECTURE.md)
- [API Reference](./06-API-REFERENCE.md)

**Cập nhật**: 28/11/2025
