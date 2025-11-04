# 🚀 Quick Start - Multi-Domain Deployment

Triển khai 2 domain (Rausach + Innerv2) trên server 1 Core / 1GB RAM / 5GB Storage

## ⚡ Khởi Động Nhanh

### 1️⃣ Cài Đặt Docker (Chỉ lần đầu)

```bash
# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user vào docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2️⃣ Tạo Swap File (Quan trọng!)

```bash
make -f Makefile.multi-domain setup-swap
make -f Makefile.multi-domain optimize-server
```

### 3️⃣ Khởi Động Services

**Khởi động TẤT CẢ (cả 2 domain):**
```bash
make -f Makefile.multi-domain start-all
```

**HOẶC khởi động từng domain để tiết kiệm RAM:**

```bash
# Chỉ Rausach
make -f Makefile.multi-domain start-rausach

# Chỉ Innerv2
make -f Makefile.multi-domain start-innerv2
```

### 4️⃣ Kiểm Tra Trạng Thái

```bash
make -f Makefile.multi-domain status
```

## 🌐 URLs Truy Cập

**Rausach Domain (Port 12xxx):**
- Frontend: http://116.118.48.208:12000
- Backend GraphQL: http://116.118.48.208:12001/graphql

**Innerv2 Domain (Port 13xxx):**
- Frontend: http://116.118.48.208:13000
- Backend GraphQL: http://116.118.48.208:13001/graphql

**Shared Services:**
- Minio Console: http://116.118.48.208:12008
- PostgreSQL: 116.118.48.208:12003

## 📋 Lệnh Hay Dùng

```bash
# Xem menu trợ giúp
make -f Makefile.multi-domain help

# Xem logs
make -f Makefile.multi-domain logs              # Tất cả
make -f Makefile.multi-domain logs-rausach      # Chỉ Rausach
make -f Makefile.multi-domain logs-innerv2    # Chỉ Innerv2

# Dừng services
make -f Makefile.multi-domain stop-all          # Dừng tất cả
make -f Makefile.multi-domain stop-rausach      # Dừng Rausach
make -f Makefile.multi-domain stop-innerv2    # Dừng Innerv2

# Backup database
make -f Makefile.multi-domain backup-rausach
make -f Makefile.multi-domain backup-innerv2

# Restore database
make -f Makefile.multi-domain restore-rausach BACKUP_FILE=./backups/rausach_20250103.sql
make -f Makefile.multi-domain restore-innerv2 BACKUP_FILE=./backups/innerv2_20250103.sql
```

## 🔧 Sử Dụng Scripts

**Script tương tác (Menu):**
```bash
chmod +x deploy-multi-domain.sh
./deploy-multi-domain.sh
```

**Scripts nhanh:**
```bash
chmod +x start-rausach-only.sh start-innerv2-only.sh
chmod +x stop-rausach-only.sh stop-innerv2-only.sh

./start-rausach-only.sh      # Khởi động Rausach
./start-innerv2-only.sh    # Khởi động Innerv2
./stop-rausach-only.sh       # Dừng Rausach
./stop-innerv2-only.sh     # Dừng Innerv2
```

## 📊 Giám Sát Tài Nguyên

```bash
# Xem resource usage
docker stats

# Xem memory/CPU từng container
make -f Makefile.multi-domain status

# Kiểm tra swap
free -h

# Kiểm tra disk
df -h
```

## ❗ Xử Lý Sự Cố Thường Gặp

### Container bị OOM (Out of Memory)

```bash
# Kiểm tra log OOM
dmesg | grep -i 'killed process'

# Tăng swap lên 4GB
sudo swapoff /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Port đã được sử dụng

```bash
# Kiểm tra port
sudo netstat -tulpn | grep LISTEN

# Kill process (ví dụ port 12000)
sudo kill -9 $(sudo lsof -t -i:12000)
```

### Database connection error

```bash
# Restart PostgreSQL
docker restart shared-postgres

# Xem logs
docker logs shared-postgres
```

## 🔐 Bảo Mật

### Mở firewall ports

```bash
sudo ufw allow 12000/tcp  # Rausach Frontend
sudo ufw allow 12001/tcp  # Rausach Backend
sudo ufw allow 13000/tcp  # Innerv2 Frontend
sudo ufw allow 13001/tcp  # Innerv2 Backend
sudo ufw allow 12008/tcp  # Minio Console
sudo ufw allow 22/tcp     # SSH
sudo ufw enable
```

### Đổi mật khẩu

Cập nhật trong `.env.rausach` và `.env.innerv2`:
- POSTGRES_PASSWORD
- REDIS_PASSWORD
- MINIO_ACCESS_KEY
- MINIO_SECRET_KEY
- JWT_SECRET
- NEXTAUTH_SECRET

## 📖 Tài Liệu Chi Tiết

Xem file `HUONG_DAN_MULTI_DOMAIN.md` để biết thêm chi tiết về:
- Kiến trúc hệ thống
- Setup domain name với Nginx
- Cấu hình SSL
- Tối ưu hiệu năng
- Troubleshooting chi tiết

## 💡 Tips

**Tiết kiệm RAM:**
- Chỉ chạy 1 domain tại 1 thời điểm
- Tắt Elasticsearch nếu không dùng search

**Tiết kiệm Disk:**
```bash
# Xóa logs cũ
sudo sh -c 'truncate -s 0 /var/lib/docker/containers/*/*-json.log'

# Dọn dẹp Docker
docker system prune -f
```

**Monitoring:**
```bash
# Cài htop để monitor realtime
sudo apt install htop -y
htop
```

## 🎯 Mức Sử Dụng Tài Nguyên

| Scenario | RAM Usage | CPU Usage |
|----------|-----------|-----------|
| Cả 2 domain | ~1.4GB (với swap) | 40-60% |
| Chỉ 1 domain | ~700MB | 20-30% |
| Infrastructure only | ~512MB | 10-15% |

**Khuyến nghị:**
- ✅ Server 1GB RAM + 2GB Swap: Chạy được cả 2 domain
- ⚠️ Traffic cao: Nên nâng lên 2GB RAM
- 🚀 Tốt nhất: 2GB RAM + 2GB Swap cho performance ổn định
