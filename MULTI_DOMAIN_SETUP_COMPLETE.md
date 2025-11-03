# 🎉 Multi-Domain Deployment Setup Complete!

## ✅ Đã Tạo Các Files Sau

### 📦 Docker Configuration
```
docker-compose.multi-domain.yml  - Main Docker Compose file (Shared Infrastructure)
scripts/init-multi-db.sh         - Script khởi tạo 2 databases
```

### 🚀 Deployment Scripts
```
deploy-multi-domain.sh           - Script quản lý deployment (Interactive Menu)
start-rausach-only.sh            - Khởi động chỉ domain Rausach
start-tazagroup-only.sh          - Khởi động chỉ domain Tazagroup
stop-rausach-only.sh             - Dừng domain Rausach
stop-tazagroup-only.sh           - Dừng domain Tazagroup
check-system-multi-domain.sh     - Kiểm tra hệ thống trước khi deploy
```

### 📝 Makefile
```
Makefile.multi-domain            - Quản lý deployment qua make commands
```

### 📚 Documentation
```
QUICK_START_MULTI_DOMAIN.md      - Hướng dẫn khởi động nhanh
HUONG_DAN_MULTI_DOMAIN.md        - Hướng dẫn chi tiết đầy đủ
SO_SANH_PHUONG_AN_DEPLOY.md      - So sánh các phương án triển khai
MULTI_DOMAIN_SETUP_COMPLETE.md   - File này (summary)
```

---

## 🎯 Kiến Trúc Hệ Thống

### Shared Infrastructure Approach

```
┌────────────────────────────────────────────────────┐
│         Cloud Server (1 Core / 1GB RAM)            │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │      SHARED INFRASTRUCTURE SERVICES          │ │
│  ├──────────────────────────────────────────────┤ │
│  │                                              │ │
│  │  PostgreSQL (Port 12003)                     │ │
│  │    ├─ Database: rausachcore                  │ │
│  │    └─ Database: tazagroupcore                │ │
│  │                                              │ │
│  │  Redis (Port 12004)                          │ │
│  │    └─ Shared cache with key prefixes         │ │
│  │                                              │ │
│  │  Minio (Port 12007, Console 12008)           │ │
│  │    ├─ Bucket: rausach-uploads                │ │
│  │    └─ Bucket: tazagroup-uploads              │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                     │                             │
│         ┌───────────┴────────────┐                │
│         │                        │                │
│  ┌──────▼─────────┐      ┌──────▼─────────┐      │
│  │ RAUSACH DOMAIN │      │ TAZAGROUP      │      │
│  ├────────────────┤      ├────────────────┤      │
│  │ Backend  12001 │      │ Backend  13001 │      │
│  │ Frontend 12000 │      │ Frontend 13000 │      │
│  └────────────────┘      └────────────────┘      │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Resource Allocation

| Service | Memory Limit | Memory Reserve | Port(s) |
|---------|--------------|----------------|---------|
| PostgreSQL (shared) | 256MB | 128MB | 12003 |
| Redis (shared) | 128MB | 64MB | 12004 |
| Minio (shared) | 128MB | 64MB | 12007, 12008 |
| Rausach Backend | 256MB | 128MB | 12001 |
| Rausach Frontend | 256MB | 128MB | 12000 |
| Tazagroup Backend | 256MB | 128MB | 13001 |
| Tazagroup Frontend | 256MB | 128MB | 13000 |
| **TOTAL** | **~1.4GB** | **~700MB** | - |

---

## 🚀 Quick Start Guide

### Bước 1: Kiểm Tra Hệ Thống

```bash
./check-system-multi-domain.sh
```

Nếu có cảnh báo về RAM/Swap, chạy:

```bash
make -f Makefile.multi-domain setup-swap
make -f Makefile.multi-domain optimize-server
```

### Bước 2: Khởi Động Services

**Cách 1: Sử dụng Menu (Khuyến nghị cho người mới)**
```bash
./deploy-multi-domain.sh
# Chọn option 1: Khởi động tất cả services
```

**Cách 2: Sử dụng Makefile (Nhanh)**
```bash
make -f Makefile.multi-domain start-all
```

**Cách 3: Sử dụng Scripts Riêng Lẻ**
```bash
# Chỉ khởi động Rausach (tiết kiệm RAM)
./start-rausach-only.sh

# Hoặc chỉ khởi động Tazagroup
./start-tazagroup-only.sh
```

**Cách 4: Sử dụng Docker Compose Trực Tiếp**
```bash
docker-compose -f docker-compose.multi-domain.yml up -d
```

### Bước 3: Kiểm Tra Trạng Thái

```bash
make -f Makefile.multi-domain status
```

### Bước 4: Truy Cập Ứng Dụng

**Rausach Domain:**
- Frontend: http://116.118.49.243:12000
- Backend GraphQL: http://116.118.49.243:12001/graphql

**Tazagroup Domain:**
- Frontend: http://116.118.49.243:13000
- Backend GraphQL: http://116.118.49.243:13001/graphql

**Shared Services:**
- Minio Console: http://116.118.49.243:12008
  - Username: minio-admin
  - Password: minio-secret-2025

---

## 📋 Common Commands Cheat Sheet

### Start/Stop Commands

```bash
# Khởi động tất cả
make -f Makefile.multi-domain start-all

# Khởi động từng domain
make -f Makefile.multi-domain start-rausach
make -f Makefile.multi-domain start-tazagroup

# Dừng tất cả
make -f Makefile.multi-domain stop-all

# Dừng từng domain
make -f Makefile.multi-domain stop-rausach
make -f Makefile.multi-domain stop-tazagroup
```

### Monitoring Commands

```bash
# Xem trạng thái và resource usage
make -f Makefile.multi-domain status

# Xem logs
make -f Makefile.multi-domain logs              # Tất cả
make -f Makefile.multi-domain logs-rausach      # Chỉ Rausach
make -f Makefile.multi-domain logs-tazagroup    # Chỉ Tazagroup

# Monitor realtime
docker stats
```

### Backup/Restore Commands

```bash
# Backup
make -f Makefile.multi-domain backup-rausach
make -f Makefile.multi-domain backup-tazagroup

# Restore
make -f Makefile.multi-domain restore-rausach BACKUP_FILE=./backups/rausach_20250103.sql
make -f Makefile.multi-domain restore-tazagroup BACKUP_FILE=./backups/tazagroup_20250103.sql
```

### Maintenance Commands

```bash
# Restart tất cả
make -f Makefile.multi-domain restart

# Build lại images
make -f Makefile.multi-domain build

# Dọn dẹp (XÓA volumes!)
make -f Makefile.multi-domain clean
```

---

## 🔧 Configuration Files

### Environment Files

Bạn đã có sẵn 2 files:
- `.env.rausach` - Configuration cho domain Rausach
- `.env.tazagroup` - Configuration cho domain Tazagroup

**Lưu ý:** Đảm bảo các thông tin sau đã được cập nhật đúng:

**File `.env.rausach`:**
```bash
PORT=12001
FRONTEND_URL=http://116.118.49.243:12000
POSTGRES_DB=rausachcore
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/rausachcore
MINIO_BUCKET_NAME=rausach-uploads
NEXT_PUBLIC_APP_URL=http://116.118.49.243:12000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:12001/graphql
```

**File `.env.tazagroup`:**
```bash
PORT=13001
FRONTEND_URL=http://116.118.49.243:13000
POSTGRES_DB=tazagroupcore
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/tazagroupcore
MINIO_BUCKET_NAME=tazagroup-uploads
NEXT_PUBLIC_APP_URL=http://116.118.49.243:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:13001/graphql
```

---

## 💡 Tips & Best Practices

### Tiết Kiệm RAM

1. **Chạy từng domain riêng lẻ khi cần:**
   ```bash
   # Buổi sáng: Làm việc với Rausach
   make -f Makefile.multi-domain start-rausach
   
   # Buổi chiều: Chuyển sang Tazagroup
   make -f Makefile.multi-domain stop-rausach
   make -f Makefile.multi-domain start-tazagroup
   ```

2. **Tắt services không dùng:**
   - Comment out Elasticsearch trong docker-compose nếu không dùng search

3. **Monitor thường xuyên:**
   ```bash
   watch -n 2 'docker stats --no-stream'
   ```

### Tiết Kiệm Disk Space

```bash
# Xóa logs cũ
sudo sh -c 'truncate -s 0 /var/lib/docker/containers/*/*-json.log'

# Dọn dẹp Docker
docker system prune -f

# Xóa images không dùng
docker image prune -a
```

### Bảo Mật

1. **Đổi mật khẩu mặc định** trong env files:
   - POSTGRES_PASSWORD
   - MINIO_ACCESS_KEY / MINIO_SECRET_KEY
   - JWT_SECRET
   - NEXTAUTH_SECRET

2. **Setup firewall:**
   ```bash
   sudo ufw allow 12000/tcp
   sudo ufw allow 12001/tcp
   sudo ufw allow 13000/tcp
   sudo ufw allow 13001/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

3. **Backup thường xuyên:**
   ```bash
   # Tạo cron job backup hàng ngày
   crontab -e
   # Thêm dòng:
   0 2 * * * cd /path/to/project && make -f Makefile.multi-domain backup-rausach
   0 3 * * * cd /path/to/project && make -f Makefile.multi-domain backup-tazagroup
   ```

---

## 🆘 Troubleshooting

### Container bị OOM (Out of Memory)

```bash
# Kiểm tra
dmesg | grep -i 'killed process'

# Giải pháp 1: Tăng swap
sudo swapoff /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096
sudo mkswap /swapfile
sudo swapon /swapfile

# Giải pháp 2: Chỉ chạy 1 domain
make -f Makefile.multi-domain stop-tazagroup
```

### Port đã được sử dụng

```bash
# Tìm process đang dùng port
sudo lsof -i :12000

# Kill process
sudo kill -9 <PID>
```

### Database connection error

```bash
# Restart PostgreSQL
docker restart shared-postgres

# Xem logs
docker logs shared-postgres -f
```

### Build failed

```bash
# Clean và build lại
docker system prune -a
make -f Makefile.multi-domain build
```

---

## 📚 Đọc Thêm

- `QUICK_START_MULTI_DOMAIN.md` - Quick start guide
- `HUONG_DAN_MULTI_DOMAIN.md` - Hướng dẫn chi tiết
- `SO_SANH_PHUONG_AN_DEPLOY.md` - So sánh phương án deploy

---

## 🎯 Next Steps

1. ✅ Đọc qua `QUICK_START_MULTI_DOMAIN.md`
2. ✅ Chạy `./check-system-multi-domain.sh`
3. ✅ Setup swap nếu cần
4. ✅ Khởi động services
5. ✅ Test cả 2 domains
6. ✅ Setup backup schedule
7. ✅ Monitor resources
8. ✅ (Optional) Setup domain names với Nginx

---

## 📞 Support

Nếu gặp vấn đề:

1. Xem logs: `make -f Makefile.multi-domain logs`
2. Kiểm tra trạng thái: `make -f Makefile.multi-domain status`
3. Đọc troubleshooting trong `HUONG_DAN_MULTI_DOMAIN.md`
4. Check system: `./check-system-multi-domain.sh`

---

## ✨ Summary

Bạn đã có một hệ thống **multi-domain deployment** hoàn chỉnh với:

- ✅ Shared infrastructure để tiết kiệm tài nguyên
- ✅ 2 databases riêng biệt cho mỗi domain
- ✅ Scripts quản lý đơn giản
- ✅ Tối ưu cho server cấu hình thấp
- ✅ Documentation đầy đủ
- ✅ Backup/restore tools
- ✅ Monitoring và troubleshooting guides

**Chúc bạn deploy thành công! 🚀**
