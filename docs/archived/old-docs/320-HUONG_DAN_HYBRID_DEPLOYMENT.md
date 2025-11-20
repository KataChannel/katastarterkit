# Hướng Dẫn Chi Tiết: Phương Án 3 - Hybrid Multi-Domain

## 🎯 Tổng Quan

**Phương Án Hybrid** là giải pháp **CÂN BẰNG TỐI ƯU** giữa:
- ✅ Database isolation (quan trọng cho data safety)
- ✅ Cache & Storage shared (tiết kiệm tài nguyên)
- ✅ Performance tốt
- ✅ Chi phí hợp lý

### Kiến Trúc

```
┌──────────────────────────────────────────────────────┐
│         Cloud Server (1-2C / 1.5-2GB / 7GB)          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │     SHARED LAYER (Redis + Minio)               │ │
│  │  • Redis: Caching, sessions, pub/sub          │ │
│  │  • Minio: Object storage, file uploads        │ │
│  └────────────────────────────────────────────────┘ │
│                    │          │                     │
│          ┌─────────┴──────────┴─────────┐          │
│          │                              │          │
│  ┌───────▼────────────┐      ┌─────────▼────────┐ │
│  │  RAUSACH DOMAIN    │      │  TAZAGROUP       │ │
│  ├────────────────────┤      ├──────────────────┤ │
│  │ PostgreSQL         │      │ PostgreSQL       │ │
│  │  (dedicated)       │      │  (dedicated)     │ │
│  │ • rausachcore DB   │      │ • tazagroupcore  │ │
│  │ • Port: 12003      │      │ • Port: 13003    │ │
│  ├────────────────────┤      ├──────────────────┤ │
│  │ Backend (12001)    │      │ Backend (13001)  │ │
│  │ Frontend (12000)   │      │ Frontend (13000) │ │
│  └────────────────────┘      └──────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Phân Bổ Tài Nguyên

| Service | Memory | Port | Dedicated/Shared |
|---------|--------|------|------------------|
| **Rausach PostgreSQL** | 256MB | 12003 | Dedicated |
| **Tazagroup PostgreSQL** | 256MB | 13003 | Dedicated |
| **Redis** | 128MB | 12004 | **Shared** |
| **Minio** | 128MB | 12007/12008 | **Shared** |
| Rausach Backend | 256MB | 12001 | Dedicated |
| Rausach Frontend | 256MB | 12000 | Dedicated |
| Tazagroup Backend | 256MB | 13001 | Dedicated |
| Tazagroup Frontend | 256MB | 13000 | Dedicated |
| **TOTAL** | **~1.8GB** | - | - |

---

## 🚀 Setup Nhanh

### Bước 1: Chuẩn Bị Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Bước 2: Tạo Swap File (Khuyến nghị 1GB)

```bash
# Tạo 1GB swap
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

### Bước 3: Clone và Setup

```bash
# Clone repo (hoặc upload code)
cd /path/to/project

# Kiểm tra files cần thiết
ls -la .env.rausach .env.tazagroup docker-compose.hybrid.yml

# Cấp quyền
chmod +x deploy-hybrid.sh
```

### Bước 4: Khởi Động

```bash
# Sử dụng Makefile (khuyến nghị)
make -f Makefile.hybrid start-all

# Hoặc script menu
./deploy-hybrid.sh

# Hoặc Docker Compose trực tiếp
docker-compose -f docker-compose.hybrid.yml up -d
```

### Bước 5: Kiểm Tra

```bash
# Xem trạng thái
make -f Makefile.hybrid status

# Xem logs
make -f Makefile.hybrid logs

# Test URLs
curl http://116.118.49.243:12000  # Rausach
curl http://116.118.49.243:13000  # Tazagroup
```

---

## 📋 Quản Lý Hàng Ngày

### Sử Dụng Makefile (Khuyến nghị)

```bash
# Xem menu
make -f Makefile.hybrid help

# Khởi động/Dừng
make -f Makefile.hybrid start-all
make -f Makefile.hybrid stop-all

# Khởi động riêng từng domain
make -f Makefile.hybrid start-rausach
make -f Makefile.hybrid start-tazagroup

# Xem logs
make -f Makefile.hybrid logs              # Tất cả
make -f Makefile.hybrid logs-rausach      # Chỉ Rausach
make -f Makefile.hybrid logs-tazagroup    # Chỉ Tazagroup

# Trạng thái
make -f Makefile.hybrid status

# Backup
make -f Makefile.hybrid backup-rausach
make -f Makefile.hybrid backup-tazagroup

# Restore
make -f Makefile.hybrid restore-rausach BACKUP_FILE=./backups/rausach_20250103.sql
make -f Makefile.hybrid restore-tazagroup BACKUP_FILE=./backups/tazagroup_20250103.sql
```

### Sử Dụng Script Menu

```bash
./deploy-hybrid.sh
```

Menu options:
1. Khởi động tất cả
2. Khởi động chỉ Rausach
3. Khởi động chỉ Tazagroup
4. Khởi động chỉ shared services
5-7. Dừng services
8-10. Xem logs
11. Trạng thái
12. Restart
13-16. Backup/Restore
17-18. Build/Clean

---

## 💾 Backup & Restore

### Backup Tự Động (Cron Job)

```bash
# Edit crontab
crontab -e

# Thêm dòng sau (backup lúc 2AM và 3AM mỗi ngày)
0 2 * * * cd /path/to/project && make -f Makefile.hybrid backup-rausach
0 3 * * * cd /path/to/project && make -f Makefile.hybrid backup-tazagroup
```

### Backup Thủ Công

```bash
# Backup Rausach
make -f Makefile.hybrid backup-rausach

# Backup Tazagroup
make -f Makefile.hybrid backup-tazagroup

# Backup cả 2
make -f Makefile.hybrid backup-rausach && make -f Makefile.hybrid backup-tazagroup
```

### Restore

```bash
# List backups
ls -lh backups/

# Restore Rausach
make -f Makefile.hybrid restore-rausach BACKUP_FILE=./backups/rausach_20250103_120000.sql

# Restore Tazagroup
make -f Makefile.hybrid restore-tazagroup BACKUP_FILE=./backups/tazagroup_20250103_120000.sql
```

### Backup Remote (Khuyến nghị)

```bash
# Upload lên cloud storage
# Ví dụ với S3
aws s3 cp ./backups/ s3://your-bucket/backups/ --recursive

# Hoặc scp đến server backup
scp ./backups/*.sql user@backup-server:/backup/path/
```

---

## 🔍 Monitoring & Troubleshooting

### Monitoring Realtime

```bash
# Docker stats
docker stats

# Watch status
watch -n 2 'docker-compose -f docker-compose.hybrid.yml ps'

# Memory usage
free -h

# Disk usage
df -h

# Swap usage
swapon --show
```

### Check Logs

```bash
# Container logs
docker logs rausach-postgres -f
docker logs tazagroup-postgres -f
docker logs shared-redis -f
docker logs shared-minio -f

# Application logs
docker logs rausach-backend -f
docker logs tazagroup-backend -f
```

### Common Issues

#### Database Connection Error

```bash
# Check PostgreSQL
docker ps | grep postgres
docker logs rausach-postgres
docker logs tazagroup-postgres

# Restart database
docker restart rausach-postgres
docker restart tazagroup-postgres
```

#### Out of Memory

```bash
# Check memory
free -h

# Check which container
docker stats --no-stream

# Increase swap
sudo swapoff /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### Port Already in Use

```bash
# Find process
sudo lsof -i :12003

# Kill process
sudo kill -9 <PID>
```

---

## 🔐 Bảo Mật

### Firewall Setup

```bash
# Install UFW
sudo apt install ufw -y

# Allow ports
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 12000/tcp    # Rausach Frontend
sudo ufw allow 12001/tcp    # Rausach Backend
sudo ufw allow 13000/tcp    # Tazagroup Frontend
sudo ufw allow 13001/tcp    # Tazagroup Backend
sudo ufw allow 12008/tcp    # Minio Console (optional, có thể block)

# Enable
sudo ufw enable

# Check status
sudo ufw status
```

### Đổi Mật Khẩu Mặc Định

**File `.env.rausach`:**
```bash
POSTGRES_PASSWORD=<strong-password-rausach>
MINIO_ACCESS_KEY=rausach-admin-<random>
MINIO_SECRET_KEY=<strong-secret-key>
JWT_SECRET=<random-32-char-string>
NEXTAUTH_SECRET=<random-32-char-string>
```

**File `.env.tazagroup`:**
```bash
POSTGRES_PASSWORD=<strong-password-tazagroup>
MINIO_ACCESS_KEY=tazagroup-admin-<random>
MINIO_SECRET_KEY=<strong-secret-key>
JWT_SECRET=<random-32-char-string>
NEXTAUTH_SECRET=<random-32-char-string>
```

### SSL Setup với Nginx (Optional)

```bash
# Install Nginx
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Tạo config cho Rausach
sudo nano /etc/nginx/sites-available/rausach

# Tạo config cho Tazagroup
sudo nano /etc/nginx/sites-available/tazagroup

# Enable sites
sudo ln -s /etc/nginx/sites-available/rausach /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/tazagroup /etc/nginx/sites-enabled/

# Get SSL certificates
sudo certbot --nginx -d rausach.com -d www.rausach.com
sudo certbot --nginx -d tazagroup.com -d www.tazagroup.com
```

---

## 📈 Performance Optimization

### Database Tuning

**PostgreSQL Config** (cho server 1.5-2GB RAM):

```bash
# Access container
docker exec -it rausach-postgres bash

# Edit postgresql.conf
# shared_buffers = 128MB
# effective_cache_size = 512MB
# maintenance_work_mem = 64MB
# checkpoint_completion_target = 0.9
# wal_buffers = 16MB
# max_connections = 50
```

### Redis Optimization

```bash
# Trong docker-compose.hybrid.yml đã config:
# --maxmemory 128mb
# --maxmemory-policy allkeys-lru
```

### Application Level

```bash
# Enable caching
# Use CDN for static assets
# Optimize images
# Enable gzip compression
# Minify JS/CSS
```

---

## 🔄 Scaling Strategy

### Khi Nào Scale?

Cần scale khi:
- RAM usage > 80% thường xuyên
- CPU usage > 70% sustained
- Response time > 2s
- Database connections > 40/50

### Option 1: Vertical Scaling

Nâng cấp server hiện tại:
```
1.5GB RAM → 2GB RAM → 4GB RAM
1 Core → 2 Cores
```

### Option 2: Tách Database Ra

```bash
# Server 1: Applications only (Backend + Frontend)
# Server 2: Databases only (PostgreSQL instances)
# Server 3: Shared services (Redis + Minio)
```

### Option 3: Move to Fully Isolated

```bash
# Migration từ Hybrid → Fully Isolated
# 1. Backup databases
make -f Makefile.hybrid backup-rausach
make -f Makefile.hybrid backup-tazagroup

# 2. Stop current
make -f Makefile.hybrid stop-all

# 3. Switch to fully isolated
docker-compose -f docker-compose.fully-isolated.yml up -d

# 4. Restore databases
# ...
```

---

## ✅ Checklist Maintenance

### Hàng Ngày
- [ ] Check logs: `make -f Makefile.hybrid logs`
- [ ] Check resource: `docker stats`
- [ ] Monitor disk: `df -h`

### Hàng Tuần
- [ ] Backup databases
- [ ] Review error logs
- [ ] Clean Docker: `docker system prune -f`
- [ ] Clean logs: `sudo sh -c 'truncate -s 0 /var/lib/docker/containers/*/*-json.log'`

### Hàng Tháng
- [ ] Update Docker images
- [ ] Security updates: `sudo apt update && sudo apt upgrade -y`
- [ ] Review backups
- [ ] Test restore procedure
- [ ] Check SSL certificates
- [ ] Review performance metrics

---

## 🎯 Best Practices

### DO ✅

1. **Backup thường xuyên** - Mỗi ngày
2. **Monitor resources** - Dùng tools như htop, docker stats
3. **Test restore** - Ít nhất 1 lần/tháng
4. **Update security patches** - Khi có
5. **Use swap** - Ít nhất 1GB
6. **Setup alerts** - Khi RAM/Disk > 80%
7. **Document changes** - Ghi lại mọi thay đổi

### DON'T ❌

1. **Không bỏ qua backups**
2. **Không skip security updates**
3. **Không deploy thẳng production** - Test trước
4. **Không dùng default passwords**
5. **Không allow tất cả ports** - Chỉ mở cần thiết
6. **Không xóa logs** - Trước khi analyze
7. **Không restart** - Khi không hiểu vấn đề

---

## 📞 Support & Help

### Logs Location

```bash
# Container logs
/var/lib/docker/containers/<container-id>/<container-id>-json.log

# Application logs (if configured)
./logs/rausach/
./logs/tazagroup/
```

### Useful Commands

```bash
# Shell vào container
docker exec -it rausach-backend /bin/sh
docker exec -it rausach-postgres psql -U postgres

# Copy files
docker cp rausach-backend:/app/logs/ ./logs/

# Network debugging
docker network ls
docker network inspect hybrid-multi-domain-network
```

### Resources

- Docker Docs: https://docs.docker.com/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Redis Docs: https://redis.io/documentation
- Minio Docs: https://min.io/docs/

---

## 🎉 Tổng Kết

Phương án Hybrid cung cấp:
- ✅ **Database isolation** - An toàn nhất cho data
- ✅ **Cost effective** - Chi phí hợp lý
- ✅ **Easy management** - Dễ quản lý
- ✅ **Production ready** - Sẵn sàng cho production
- ✅ **Scalable** - Dễ scale khi cần

**Đây là lựa chọn tốt nhất cho production với budget trung bình!** 🏆
