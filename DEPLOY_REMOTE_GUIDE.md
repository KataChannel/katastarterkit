# 🚀 Hướng Dẫn Deploy Lên Server 116.118.48.208

## 📋 Cấu Hình Server
- **IP**: 116.118.48.208
- **CPU**: 1 Core
- **RAM**: 2GB
- **Disk**: 10GB
- **OS**: Linux

## 🔧 Yêu Cầu Trước Khi Deploy

### 1. Cấu Hình SSH Key (Bắt Buộc)
```bash
# Tạo SSH key nếu chưa có
ssh-keygen -t rsa -b 4096

# Copy SSH key lên server
ssh-copy-id root@116.118.48.208

# Test kết nối
ssh root@116.118.48.208
```

### 2. Kiểm Tra Kết Nối
```bash
# Ping server
ping 116.118.48.208

# Test SSH
ssh root@116.118.48.208 "echo 'Connection successful'"
```

## 🚀 Cách Deploy

### Phương Án 1: Deploy Tự Động (Khuyến Nghị)
```bash
# Tại thư mục project
chmod +x deploy-remote-quick.sh
./deploy-remote-quick.sh
```

### Phương Án 2: Deploy Thủ Công
```bash
# 1. Make script executable
chmod +x deploy-to-remote.sh

# 2. Run deployment
./deploy-to-remote.sh
```

### Phương Án 3: Deploy Với Custom Settings
```bash
# Set environment variables
export SSH_USER="admin"           # Nếu không dùng root
export SSH_PORT="2222"            # Nếu SSH không dùng port 22
export REPO_URL="your-repo-url"   # Nếu dùng repo khác

# Deploy
./deploy-to-remote.sh
```

## 📊 Monitoring & Management

### Kiểm Tra Trạng Thái
```bash
# SSH vào server
ssh root@116.118.48.208

# Di chuyển vào thư mục project
cd /opt/innerv2

# Xem trạng thái containers
docker compose -f docker-compose.build.yml ps

# Xem logs
docker compose -f docker-compose.build.yml logs -f

# Xem logs của một service cụ thể
docker compose -f docker-compose.build.yml logs -f backend
docker compose -f docker-compose.build.yml logs -f frontend
```

### Quản Lý Services
```bash
# Restart services
docker compose -f docker-compose.build.yml restart

# Stop services
docker compose -f docker-compose.build.yml down

# Start services
docker compose -f docker-compose.build.yml up -d

# Rebuild và restart
docker compose -f docker-compose.build.yml up -d --build
```

### Kiểm Tra Resource Usage
```bash
# Xem memory & CPU usage
docker stats

# Xem disk usage
df -h

# Xem container resource limits
docker compose -f docker-compose.build.yml config
```

## 🌐 Truy Cập Ứng Dụng

Sau khi deploy thành công, truy cập:

- **Frontend**: http://116.118.48.208:14000
- **Backend API**: http://116.118.48.208:14001
- **GraphQL Playground**: http://116.118.48.208:14001/graphql
- **Minio (Storage)**: http://116.118.48.208:14007
- **Minio Console**: http://116.118.48.208:14008

## 🔍 Troubleshooting

### 1. Không Kết Nối Được SSH
```bash
# Kiểm tra SSH service
ssh root@116.118.48.208 "systemctl status sshd"

# Kiểm tra firewall
ssh root@116.118.48.208 "ufw status"

# Thử kết nối với verbose
ssh -v root@116.118.48.208
```

### 2. Out of Memory
```bash
# Kiểm tra memory
ssh root@116.118.48.208 "free -h"

# Xem container memory usage
ssh root@116.118.48.208 "docker stats --no-stream"

# Restart services để giải phóng memory
ssh root@116.118.48.208 "cd /opt/innerv2 && docker compose -f docker-compose.build.yml restart"
```

### 3. Out of Disk Space
```bash
# Kiểm tra disk
ssh root@116.118.48.208 "df -h"

# Cleanup Docker
ssh root@116.118.48.208 "docker system prune -af --volumes"

# Xóa old images
ssh root@116.118.48.208 "docker image prune -af"
```

### 4. Container Không Start
```bash
# Xem logs chi tiết
ssh root@116.118.48.208 "cd /opt/innerv2 && docker compose -f docker-compose.build.yml logs backend"

# Xem error messages
ssh root@116.118.48.208 "cd /opt/innerv2 && docker compose -f docker-compose.build.yml ps"

# Restart container
ssh root@116.118.48.208 "cd /opt/innerv2 && docker compose -f docker-compose.build.yml restart backend"
```

### 5. Port Đã Được Sử Dụng
```bash
# Kiểm tra ports đang dùng
ssh root@116.118.48.208 "netstat -tulpn | grep LISTEN"

# Kill process đang dùng port
ssh root@116.118.48.208 "fuser -k 14001/tcp"
```

## 🔄 Update Ứng Dụng

### Update Code Mới
```bash
# Re-deploy
./deploy-to-remote.sh

# Hoặc trên server
ssh root@116.118.48.208
cd /opt/innerv2
git pull origin innerv2
docker compose -f docker-compose.build.yml up -d --build
```

### Rollback Về Version Cũ
```bash
ssh root@116.118.48.208
cd /opt/innerv2
git log --oneline -10  # Xem history
git checkout <commit-hash>
docker compose -f docker-compose.build.yml up -d --build
```

## 🛡️ Bảo Mật

### 1. Thay Đổi Passwords
```bash
# SSH vào server
ssh root@116.118.48.208
cd /opt/innerv2

# Edit .env.production
nano .env.production

# Update passwords:
# - POSTGRES_PASSWORD
# - REDIS_PASSWORD
# - MINIO_SECRET_KEY
# - JWT_SECRET
# - NEXTAUTH_SECRET

# Restart services
docker compose -f docker-compose.build.yml down
docker compose -f docker-compose.build.yml up -d
```

### 2. Setup Firewall
```bash
ssh root@116.118.48.208

# Enable UFW
ufw enable

# Allow SSH
ufw allow 22/tcp

# Allow application ports
ufw allow 14000/tcp  # Frontend
ufw allow 14001/tcp  # Backend

# Check status
ufw status
```

### 3. Setup SSL (Khuyến Nghị)
```bash
# Install Certbot
ssh root@116.118.48.208 "apt-get install -y certbot"

# Setup nginx reverse proxy với SSL
# (Cần domain name, không dùng được với IP)
```

## 📈 Tối Ưu Hóa

### 1. Memory Optimization
Cấu hình đã được tối ưu cho 2GB RAM:
- PostgreSQL: 512MB max
- Redis: 128MB max
- Backend: 640MB max
- Frontend: 512MB max
- Minio: 256MB max

### 2. Disk Optimization
```bash
# Auto cleanup old logs
ssh root@116.118.48.208 "echo '0 2 * * * docker system prune -f' | crontab -"

# Setup log rotation
ssh root@116.118.48.208
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
EOF
```

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker compose logs -f`
2. Kiểm tra resource: `docker stats`
3. Restart services: `docker compose restart`
4. Cleanup và redeploy: `docker system prune -af && ./deploy-to-remote.sh`

## 📝 Notes

- Lần deploy đầu tiên sẽ mất ~5-10 phút (download images, build)
- Các lần deploy sau sẽ nhanh hơn (~2-3 phút)
- Server 2GB RAM có thể chạy ổn định với cấu hình đã tối ưu
- Nên setup monitoring để theo dõi resource usage
