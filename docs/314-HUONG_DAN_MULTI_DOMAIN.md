# Hướng Dẫn Triển Khai Multi-Domain trên Cloud Server Cấu Hình Thấp

## 📋 Tổng Quan

Hệ thống này cho phép chạy **2 domain** (rausach.com + innerv2.com) trên **cùng một source code** và **cùng một server** với cấu hình thấp:

- **CPU**: 1 Core
- **RAM**: 1GB
- **Storage**: 5GB

## 🏗️ Kiến Trúc

### Chia Sẻ Infrastructure Services
Để tiết kiệm tài nguyên, các service sau được **chia sẻ** giữa 2 domain:

1. **PostgreSQL** - 1 instance, 2 databases riêng biệt
   - `rausachcore` - Database cho domain Rausach
   - `innerv2core` - Database cho domain Innerv2
   
2. **Redis** - 1 instance, sử dụng key prefix để phân biệt
   
3. **Minio** - 1 instance, 2 buckets riêng biệt
   - `rausach-uploads` - Bucket cho domain Rausach
   - `innerv2-uploads` - Bucket cho domain Innerv2

### Services Riêng Biệt Cho Mỗi Domain

**Domain Rausach (Ports 12xxx):**
- Frontend: `http://116.118.48.208:12000`
- Backend: `http://116.118.48.208:12001/graphql`

**Domain Innerv2 (Ports 13xxx):**
- Frontend: `http://116.118.48.208:13000`
- Backend: `http://116.118.48.208:13001/graphql`

**Shared Services:**
- PostgreSQL: Port `12003`
- Redis: Port `12004`
- Minio API: Port `12007`
- Minio Console: Port `12008`

## 📁 Cấu Trúc Files

```
.
├── .env.rausach              # Environment variables cho domain Rausach
├── .env.innerv2            # Environment variables cho domain Innerv2
├── docker-compose.multi-domain.yml  # Docker Compose cho multi-domain
├── deploy-multi-domain.sh    # Script quản lý deployment
├── scripts/
│   └── init-multi-db.sh      # Script khởi tạo 2 databases
└── backend/
    └── Dockerfile            # Shared Dockerfile
```

## 🚀 Cài Đặt và Triển Khai

### 1. Chuẩn Bị Server

```bash
# Update hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Thêm user vào group docker
sudo usermod -aG docker $USER
newgrp docker

# Kiểm tra cài đặt
docker --version
docker-compose --version
```

### 2. Tối Ưu Server Cho Cấu Hình Thấp

```bash
# Tạo swap file 2GB (quan trọng cho server 1GB RAM!)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Kiểm tra swap
free -h

# Tối ưu kernel parameters
sudo tee -a /etc/sysctl.conf <<EOF
vm.swappiness=10
vm.vfs_cache_pressure=50
net.core.somaxconn=1024
EOF
sudo sysctl -p
```

### 3. Clone Source Code

```bash
# Clone repository
git clone <your-repo-url>
cd shoprausach

# Đảm bảo files env đã có
ls -la .env.rausach .env.innerv2
```

### 4. Kiểm Tra Cấu Hình ENV Files

**File `.env.rausach`:**
```bash
# Các port quan trọng cho domain Rausach
PORT=12001
FRONTEND_URL=http://116.118.48.208:12000
POSTGRES_DB=rausachcore
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/rausachcore
MINIO_BUCKET_NAME=rausach-uploads
```

**File `.env.innerv2`:**
```bash
# Các port quan trọng cho domain Innerv2
PORT=13001
FRONTEND_URL=http://116.118.48.208:13000
POSTGRES_DB=innerv2core
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/innerv2core
MINIO_BUCKET_NAME=innerv2-uploads
```

### 5. Cấp Quyền và Khởi Chạy

```bash
# Cấp quyền thực thi
chmod +x deploy-multi-domain.sh
chmod +x scripts/init-multi-db.sh

# Chạy deployment script
./deploy-multi-domain.sh
```

## 🎮 Sử Dụng Deploy Script

Script `deploy-multi-domain.sh` cung cấp menu tương tác:

```
1) Khởi động tất cả services (cả 2 domain)
2) Khởi động chỉ domain Rausach (12xxx)
3) Khởi động chỉ domain Innerv2 (13xxx)
4) Dừng tất cả services
5) Dừng chỉ domain Rausach
6) Dừng chỉ domain Innerv2
7) Xem logs tất cả services
8) Xem logs domain Rausach
9) Xem logs domain Innerv2
10) Xem trạng thái services
11) Khởi động lại tất cả
12) Build lại images
13) Dọn dẹp volumes và rebuild
0) Thoát
```

### Ví Dụ Sử Dụng

**Khởi động tất cả:**
```bash
./deploy-multi-domain.sh
# Chọn option 1
```

**Khởi động chỉ 1 domain để tiết kiệm tài nguyên:**
```bash
./deploy-multi-domain.sh
# Chọn option 2 (Rausach) hoặc 3 (Innerv2)
```

**Xem logs realtime:**
```bash
./deploy-multi-domain.sh
# Chọn option 7/8/9 tùy theo domain cần xem
```

## 📊 Giám Sát Tài Nguyên

### Kiểm Tra Sử Dụng RAM/CPU

```bash
# Xem tổng quan
docker stats

# Xem chi tiết từng container
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
```

### Mức Sử Dụng Tài Nguyên Dự Kiến

| Service | Memory Limit | Memory Reserve | CPU |
|---------|--------------|----------------|-----|
| PostgreSQL | 256MB | 128MB | Shared |
| Redis | 128MB | 64MB | Shared |
| Minio | 128MB | 64MB | Shared |
| Rausach Backend | 256MB | 128MB | Shared |
| Rausach Frontend | 256MB | 128MB | Shared |
| Innerv2 Backend | 256MB | 128MB | Shared |
| Innerv2 Frontend | 256MB | 128MB | Shared |
| **TỔNG** | **~1.4GB** | **~700MB** | 1 Core |

**Lưu ý:** Nhờ có swap file 2GB, hệ thống có thể chạy ổn định.

## 🔧 Quản Lý và Bảo Trì

### Backup Database

```bash
# Backup database Rausach
docker exec shared-postgres pg_dump -U postgres rausachcore > backup-rausach-$(date +%Y%m%d).sql

# Backup database Innerv2
docker exec shared-postgres pg_dump -U postgres innerv2core > backup-innerv2-$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Restore database Rausach
docker exec -i shared-postgres psql -U postgres rausachcore < backup-rausach.sql

# Restore database Innerv2
docker exec -i shared-postgres psql -U postgres innerv2core < backup-innerv2.sql
```

### Xóa Logs Cũ (Giải Phóng Dung Lượng)

```bash
# Xóa logs Docker cũ
sudo sh -c 'truncate -s 0 /var/lib/docker/containers/*/*-json.log'

# Dọn dẹp Docker system
docker system prune -f
```

### Update Code

```bash
# Pull code mới
git pull origin main

# Rebuild và restart
./deploy-multi-domain.sh
# Chọn option 12 (Build lại) sau đó option 11 (Restart)
```

## 🔐 Bảo Mật

### Mở Firewall Ports

```bash
# Cho phép các ports cần thiết
sudo ufw allow 12000/tcp  # Rausach Frontend
sudo ufw allow 12001/tcp  # Rausach Backend
sudo ufw allow 13000/tcp  # Innerv2 Frontend
sudo ufw allow 13001/tcp  # Innerv2 Backend
sudo ufw allow 12008/tcp  # Minio Console
sudo ufw allow 22/tcp     # SSH
sudo ufw enable
```

### Đổi Mật Khẩu Mặc Định

Nhớ cập nhật trong files `.env.rausach` và `.env.innerv2`:

```bash
# PostgreSQL
POSTGRES_PASSWORD=<strong-password>

# Redis (nếu cần)
REDIS_PASSWORD=<strong-password>

# Minio
MINIO_ACCESS_KEY=<access-key>
MINIO_SECRET_KEY=<strong-secret-key>

# JWT
JWT_SECRET=<random-32-char-string>
NEXTAUTH_SECRET=<random-32-char-string>
```

## ❗ Xử Lý Sự Cố

### Container Bị OOM (Out of Memory)

```bash
# Kiểm tra container nào bị kill
dmesg | grep -i 'killed process'

# Tăng swap hoặc giảm số domain chạy đồng thời
# Option 1: Tăng swap lên 4GB
sudo swapoff /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096
sudo mkswap /swapfile
sudo swapon /swapfile

# Option 2: Chỉ chạy 1 domain tại 1 thời điểm
```

### Database Connection Error

```bash
# Kiểm tra PostgreSQL có chạy không
docker ps | grep postgres

# Xem logs PostgreSQL
docker logs shared-postgres

# Restart PostgreSQL
docker restart shared-postgres
```

### Port Đã Được Sử Dụng

```bash
# Kiểm tra port nào đang dùng
sudo netstat -tulpn | grep LISTEN

# Kill process đang dùng port (ví dụ port 12000)
sudo kill -9 $(sudo lsof -t -i:12000)
```

## 🌐 Setup Domain Name (Tùy Chọn)

Nếu muốn sử dụng domain name thay vì IP:

### 1. Cài Nginx Reverse Proxy

```bash
sudo apt install nginx -y
```

### 2. Cấu Hình Nginx

**File `/etc/nginx/sites-available/rausach`:**
```nginx
server {
    listen 80;
    server_name rausach.com www.rausach.com;

    location / {
        proxy_pass http://localhost:12000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /graphql {
        proxy_pass http://localhost:12001/graphql;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

**File `/etc/nginx/sites-available/innerv2`:**
```nginx
server {
    listen 80;
    server_name innerv2.com www.innerv2.com;

    location / {
        proxy_pass http://localhost:13000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /graphql {
        proxy_pass http://localhost:13001/graphql;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 3. Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/rausach /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/innerv2 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Setup SSL với Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d rausach.com -d www.rausach.com
sudo certbot --nginx -d innerv2.com -d www.innerv2.com
```

## 📈 Tối Ưu Hiệu Năng

### 1. Giảm Build Time

Sử dụng multi-stage builds và cache layers:

```dockerfile
# Ví dụ trong Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

### 2. Tắt Services Không Cần Thiết

Nếu không dùng Elasticsearch:

```bash
# Comment out hoặc xóa service elasticsearch trong docker-compose.multi-domain.yml
```

### 3. Sử Dụng CDN

Upload static assets lên CDN (Cloudflare, AWS CloudFront) để giảm tải server.

## 🎯 Kết Luận

Hệ thống multi-domain này cho phép bạn:

✅ Chạy 2 domain độc lập trên cùng server cấu hình thấp
✅ Chia sẻ infrastructure để tiết kiệm tài nguyên
✅ Dễ dàng scale từng domain riêng lẻ
✅ Quản lý tập trung qua 1 script
✅ Tiết kiệm chi phí server

**Lưu ý quan trọng:**
- Server 1GB RAM + 2GB Swap là đủ để chạy cả 2 domain
- Nếu traffic cao, nên nâng cấp lên 2GB RAM
- Backup database thường xuyên
- Monitor tài nguyên để tránh OOM

## 📞 Support

Nếu gặp vấn đề, kiểm tra logs:

```bash
# Xem logs tất cả
./deploy-multi-domain.sh
# Chọn option 7

# Hoặc xem trực tiếp
docker-compose -f docker-compose.multi-domain.yml logs -f
```
