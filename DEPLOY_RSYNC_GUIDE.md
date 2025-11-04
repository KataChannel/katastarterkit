# 🚀 Deploy Bằng Rsync - Không Cần Git

## 📖 Tổng Quan

Script deployment đã được cập nhật để **copy file trực tiếp từ local lên server** bằng **rsync**, không cần sử dụng Git. Điều này đảm bảo code hiện tại trên máy local của bạn sẽ được deploy chính xác lên server.

## ✨ Ưu Điểm

### 1. **Deploy Code Hiện Tại**
- Deploy chính xác code đang có trên máy local
- Không cần commit hoặc push lên Git
- Thích hợp cho testing và development

### 2. **Tốc Độ Nhanh**
- Rsync chỉ sync những file thay đổi
- Không tải toàn bộ repo như git clone
- Deploy lại rất nhanh (chỉ upload file mới/thay đổi)

### 3. **Tiết Kiệm Bandwidth**
- Chỉ upload những file khác nhau
- Tự động exclude node_modules, .git, logs, data
- Giảm thời gian upload đáng kể

## 🔧 Yêu Cầu

### 1. Cài Đặt Rsync (Local)
```bash
# Ubuntu/Debian
sudo apt-get install rsync

# macOS
brew install rsync

# CentOS/RHEL
sudo yum install rsync
```

### 2. Cấu Hình SSH Key
```bash
# Tạo SSH key nếu chưa có
ssh-keygen -t rsa -b 4096

# Copy key lên server
ssh-copy-id root@116.118.48.208

# Test kết nối
ssh root@116.118.48.208
```

## 🚀 Cách Sử Dụng

### Phương Án 1: Quick Deploy (Khuyến Nghị)
```bash
chmod +x deploy-remote-quick.sh
./deploy-remote-quick.sh
```

### Phương Án 2: Deploy Thủ Công
```bash
chmod +x deploy-to-remote.sh
./deploy-to-remote.sh
```

### Phương Án 3: Custom Settings
```bash
# Set custom SSH user/port
export SSH_USER="admin"
export SSH_PORT="2222"

# Deploy
./deploy-to-remote.sh
```

## 📦 Files Được Sync

### ✅ Được Upload
- Tất cả source code: `frontend/`, `backend/`, `docker/`
- Configuration files: `docker-compose.yml`, `Dockerfile`, `.env.production`
- Scripts: `run.sh`, `entrypoint.sh`
- Documentation: `README.md`, `docs/`
- Database schemas: `prisma/schema.prisma`

### ❌ Không Upload (Auto Excluded)
- `.git/` - Git repository
- `node_modules/` - Dependencies (sẽ install trên server)
- `.next/` - Build output
- `dist/` - Build output
- `logs/` - Log files
- `data/postgres/`, `data/redis/`, `data/minio/` - Database data
- `.env.local`, `.env.development` - Local env files
- `.vscode/`, `.idea/` - IDE configs

## 🔄 Quy Trình Deploy

### Bước 1: Kiểm Tra Kết Nối
```bash
Testing SSH connection to root@116.118.48.208:22...
SSH connection successful
```

### Bước 2: Cài Đặt Dependencies (Auto)
```bash
Checking server dependencies...
Docker already installed: Docker version 24.0.7
Docker Compose already installed: Docker Compose version v2.23.0
```

### Bước 3: Sync Files
```bash
Syncing files from local to server...
Local: /chikiet/Innerbright/innerv2
Remote: root@116.118.48.208:/opt/innerv2

sending incremental file list
./
README.md
docker-compose.build.yml
backend/src/main.ts
frontend/pages/index.tsx
...

sent 2.45M bytes  received 1.23K bytes  456.78K bytes/sec
total size is 15.67M  speedup is 6.38
```

### Bước 4: Setup Environment
```bash
Setting up environment configuration...
.env.production already exists, keeping existing configuration
```

### Bước 5: Build & Deploy
```bash
Starting deployment...
Building and starting containers...
[+] Building 125.4s (45/45) FINISHED
[+] Running 6/6
 ✓ Container innerv2-postgres-1  Started
 ✓ Container innerv2-redis-1     Started
 ✓ Container innerv2-minio-1     Started
 ✓ Container innerv2-backend-1   Started
 ✓ Container innerv2-frontend-1  Started
```

## 🎯 So Sánh: Git vs Rsync

| Feature | Git Deploy | Rsync Deploy |
|---------|-----------|--------------|
| **Speed** | Slow (clone all) | Fast (only changes) |
| **Code** | From repository | From local |
| **Commit** | Must commit | No need |
| **Internet** | Need good connection | Less bandwidth |
| **Use Case** | Production | Development/Testing |
| **Flexibility** | Less flexible | Very flexible |

## ⚡ Tối Ưu Hóa

### 1. Exclude Patterns
File `.rsyncignore` được tự động apply:
```bash
--exclude '.git'
--exclude 'node_modules'
--exclude '.next'
--exclude 'dist'
--exclude 'logs/*'
--exclude 'data/*'
```

### 2. Incremental Sync
- Lần đầu: Upload ~15-20MB (tùy project)
- Lần sau: Chỉ upload file thay đổi (<1MB thường)
- Sử dụng `--delete` để xóa file không còn

### 3. Compression
- Auto compress khi transfer
- Giảm bandwidth ~60-70%
- Tốc độ tùy theo kết nối

## 🔍 Monitoring

### Xem Quá Trình Sync
```bash
# Rsync output shows progress
sending incremental file list
backend/src/controllers/user.controller.ts
  12,345 100%   1.23MB/s    0:00:00 (xfr#1, to-chk=456/789)
```

### Kiểm Tra Sau Deploy
```bash
# SSH vào server
ssh root@116.118.48.208

# Xem files đã sync
cd /opt/innerv2
ls -lh

# Kiểm tra timestamp
stat backend/src/main.ts
```

## 🛠️ Troubleshooting

### 1. Rsync Không Tìm Thấy
```bash
# Cài đặt rsync
sudo apt-get install rsync  # Ubuntu/Debian
brew install rsync          # macOS
```

### 2. Permission Denied
```bash
# Kiểm tra SSH key
ssh -v root@116.118.48.208

# Re-add SSH key
ssh-copy-id root@116.118.48.208
```

### 3. Slow Transfer
```bash
# Check connection
ping 116.118.48.208

# Use compression
rsync -avz ... # -z enables compression
```

### 4. Exclude Không Hoạt Động
```bash
# Verify exclude patterns in script
grep "exclude" deploy-to-remote.sh

# Test rsync dry-run
rsync -avz --dry-run --exclude 'node_modules' ...
```

## 📊 Best Practices

### 1. Test Local Trước
```bash
# Build local để kiểm tra errors
./run.sh

# Nếu ok, mới deploy
./deploy-remote-quick.sh
```

### 2. Backup Trước Khi Deploy
```bash
# SSH vào server
ssh root@116.118.48.208

# Backup project
cd /opt
tar -czf innerv2-backup-$(date +%Y%m%d-%H%M%S).tar.gz innerv2/
```

### 3. Deploy Từng Phần
```bash
# Deploy chỉ backend
rsync -avz backend/ root@116.118.48.208:/opt/innerv2/backend/

# Deploy chỉ frontend
rsync -avz frontend/ root@116.118.48.208:/opt/innerv2/frontend/
```

### 4. Verify Sau Deploy
```bash
# Test endpoints
curl http://116.118.48.208:14000
curl http://116.118.48.208:14001/health

# Check logs
ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose logs -f'
```

## 🔄 Update Code

### Deploy Code Mới
```bash
# Edit code local
nano backend/src/controllers/user.controller.ts

# Deploy ngay lập tức
./deploy-remote-quick.sh
```

### Rollback
```bash
# SSH vào server
ssh root@116.118.48.208
cd /opt/innerv2

# Nếu có backup
tar -xzf ../innerv2-backup-20250105-143000.tar.gz

# Restart services
docker compose -f docker-compose.build.yml restart
```

## 📝 Notes

- ✅ Không cần commit code trước khi deploy
- ✅ Deploy chính xác code đang có trên máy
- ✅ Tốc độ nhanh hơn git clone
- ✅ Tiết kiệm bandwidth
- ⚠️ Chỉ dùng cho development/testing
- ⚠️ Production nên dùng Git hoặc CI/CD
- ⚠️ Nhớ test local trước khi deploy

## 🎓 Example Workflow

```bash
# 1. Edit code
vim backend/src/main.ts

# 2. Test local
./run.sh

# 3. Verify local works
curl http://localhost:3000/health

# 4. Deploy to remote
./deploy-remote-quick.sh

# 5. Verify remote
curl http://116.118.48.208:14001/health

# 6. Check logs if needed
ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose logs -f backend'
```

## 🚀 Quick Reference

```bash
# Deploy nhanh
./deploy-remote-quick.sh

# Xem logs
ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose logs -f'

# Restart service
ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose restart backend'

# Check status
ssh root@116.118.48.208 'cd /opt/innerv2 && docker compose ps'
```
