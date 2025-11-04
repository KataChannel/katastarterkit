# 🚀 REMOTE DEPLOYMENT GUIDE

## Tổng quan

Script `remote-deploy.sh` cho phép bạn tự động deploy code lên server **116.118.49.243** và chạy docker-compose trực tiếp trên server.

## Sự khác biệt giữa các script deploy

### 1. **prod-deploy.sh** (Local Deployment)
- ✅ Chạy docker-compose trên máy **LOCAL**
- ✅ Sử dụng IP server trong file .env
- ✅ Connect tới remote services (PostgreSQL, Redis, Minio)
- ❌ **KHÔNG** deploy code lên server
- 📍 Phù hợp cho: Test production mode trên local

### 2. **remote-deploy.sh** (Remote Deployment) ⭐ NEW
- ✅ SSH vào server 116.118.49.243
- ✅ Rsync code lên server
- ✅ Chạy docker-compose **TRÊN SERVER**
- ✅ Deploy thực sự lên production
- 📍 Phù hợp cho: Deploy production thật

## Yêu cầu

### 1. SSH Access
Bạn cần có quyền SSH vào server:

```bash
# Test SSH connection
ssh root@116.118.49.243

# Nếu chưa setup SSH key
ssh-copy-id root@116.118.49.243
```

### 2. Rsync
```bash
# Check nếu đã có rsync
which rsync

# Nếu chưa có, cài đặt:
# Ubuntu/Debian
sudo apt-get install rsync

# macOS
brew install rsync
```

### 3. Docker trên server
Server phải đã cài đặt Docker và Docker Compose:
```bash
ssh root@116.118.49.243 'docker --version && docker-compose --version'
```

## Cấu hình Server

### 1. Cấu trúc thư mục trên server

Script sẽ deploy vào các thư mục sau:

```
/opt/shoprausach/
├── rausach/          ← Deploy option 1 (Rausach)
├── tazagroup/        ← Deploy option 2 (Tazagroup)
└── multi-domain/     ← Deploy option 3 (Multi-domain)
```

### 2. Thay đổi cấu hình (nếu cần)

Mở file `remote-deploy.sh` và sửa phần CONFIGURATION:

```bash
# ============ CONFIGURATION ============
REMOTE_SERVER="116.118.49.243"     # IP server
REMOTE_USER="root"                  # SSH user
REMOTE_PORT="22"                    # SSH port

# Remote paths
REMOTE_BASE_PATH="/opt/shoprausach"
REMOTE_PATH_RAUSACH="$REMOTE_BASE_PATH/rausach"
REMOTE_PATH_TAZAGROUP="$REMOTE_BASE_PATH/tazagroup"
REMOTE_PATH_MULTI="$REMOTE_BASE_PATH/multi-domain"
```

## Cách sử dụng

### Option 1: Chạy trực tiếp

```bash
./remote-deploy.sh
```

### Option 2: Từ menu.sh (Recommended)

```bash
./menu.sh
# Chọn option 6: Deploy to Remote Server
```

## Quy trình Deploy

### Step 1: Chọn domain

```
Chọn domain để deploy:

  1) 🌟 Rausach    (deploy to: /opt/shoprausach/rausach)
  2) 🏢 Tazagroup  (deploy to: /opt/shoprausach/tazagroup)
  3) 🔥 Multi-domain (deploy to: /opt/shoprausach/multi-domain)
  4) ⚙️  Configure server settings
  5) 🧪 Test SSH connection
  6) ❌ Exit
```

### Step 2: Xác nhận deployment plan

Script sẽ hiển thị chi tiết:

```
🎯 DEPLOYMENT PLAN

Domain:        rausach
Local Path:    /mnt/chikiet/kataoffical/shoprausach
Remote Path:   /opt/shoprausach/rausach
Compose File:  docker-compose.rausach.yml
Env File:      .env.prod.rausach

Steps:
  1. Check SSH connection
  2. Sync code to server
  3. Deploy with docker-compose
  4. Show deployment info

Continue with deployment? (y/N):
```

### Step 3: Auto deployment

Script tự động thực hiện:

1. **Check SSH Connection**
   - Kiểm tra kết nối SSH
   - Timeout 5s
   - Hiển thị lỗi nếu không connect được

2. **Sync Code**
   - Rsync code từ local lên server
   - Exclude: node_modules, .git, .env*, logs, build folders
   - Hiển thị progress bar

3. **Deploy on Server**
   - SSH vào server
   - Copy file .env tương ứng
   - Stop containers cũ
   - Build và start containers mới
   - Hiển thị status

4. **Show Info**
   - URLs để access services
   - Commands để view logs, restart, stop

## Files được sync

### ✅ Được sync
- Source code (backend/, frontend/, src/)
- Docker files (docker-compose*.yml, Dockerfile)
- Config files (package.json, tsconfig.json, etc.)
- Scripts (*.sh)

### ❌ Không sync (excluded)
- node_modules
- .git
- .env* (trừ .env.example)
- *.log
- dist/
- build/
- .next/
- .DS_Store

## Sau khi Deploy

### Kiểm tra services

```bash
# Rausach
Frontend:  http://116.118.49.243:12000
Backend:   http://116.118.49.243:12001/graphql
Database:  116.118.49.243:12003
PgAdmin:   http://116.118.49.243:12002

# Tazagroup
Frontend:  http://116.118.49.243:13000
Backend:   http://116.118.49.243:13001/graphql
Database:  116.118.49.243:13003
PgAdmin:   http://116.118.49.243:13002

# Shared Services
Redis:     116.118.49.243:12004
Minio:     116.118.49.243:12007
Console:   http://116.118.49.243:12008
```

### View logs

```bash
# Rausach
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml logs -f'

# Tazagroup
ssh root@116.118.49.243 'cd /opt/shoprausach/tazagroup && docker-compose -f docker-compose.tazagroup.yml logs -f'
```

### Restart services

```bash
# Rausach
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml restart'

# Tazagroup
ssh root@116.118.49.243 'cd /opt/shoprausach/tazagroup && docker-compose -f docker-compose.tazagroup.yml restart'
```

### Stop services

```bash
# Rausach
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml down'

# Tazagroup
ssh root@116.118.49.243 'cd /opt/shoprausach/tazagroup && docker-compose -f docker-compose.tazagroup.yml down'
```

## Troubleshooting

### 1. SSH Connection Failed

**Lỗi:**
```
❌ Cannot connect to server
```

**Giải pháp:**
```bash
# 1. Test SSH manually
ssh root@116.118.49.243

# 2. Setup SSH key
ssh-copy-id root@116.118.49.243

# 3. Check firewall
# Đảm bảo port 22 mở trên server

# 4. Check SSH config
cat ~/.ssh/config
```

### 2. Rsync Failed

**Lỗi:**
```
❌ Failed to sync code
```

**Giải pháp:**
```bash
# 1. Check rsync installed
which rsync

# 2. Test rsync manually
rsync -avz --dry-run ./ root@116.118.49.243:/tmp/test/

# 3. Check disk space on server
ssh root@116.118.49.243 'df -h'
```

### 3. Docker Compose Failed

**Lỗi:**
```
❌ Deployment failed
```

**Giải pháp:**
```bash
# 1. Check Docker running on server
ssh root@116.118.49.243 'docker ps'

# 2. Check docker-compose version
ssh root@116.118.49.243 'docker-compose --version'

# 3. View detailed logs
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml logs'

# 4. Check .env file
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && cat .env'
```

### 4. Services Not Starting

**Giải pháp:**
```bash
# 1. Check if remote services are running
./test-connection.sh

# 2. Start remote services if needed
./start-server-services.sh

# 3. Check port conflicts
ssh root@116.118.49.243 'netstat -tulpn | grep -E "(12000|12001|13000|13001)"'

# 4. Restart Docker daemon
ssh root@116.118.49.243 'systemctl restart docker'
```

## Best Practices

### 1. Luôn test local trước

```bash
# Test local với prod config
./prod-deploy.sh
```

### 2. Backup trước khi deploy

```bash
# SSH vào server và backup
ssh root@116.118.49.243
cd /opt/shoprausach/rausach
docker-compose -f docker-compose.rausach.yml down
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .
```

### 3. Deploy từng domain một

- Deploy Rausach trước → Test
- Deploy Tazagroup sau → Test
- Chỉ deploy Multi-domain khi cần thiết

### 4. Monitor logs sau deploy

```bash
# Watch logs real-time
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml logs -f --tail=100'
```

### 5. Health check

```bash
# Check container health
ssh root@116.118.49.243 'docker ps --format "table {{.Names}}\t{{.Status}}"'

# Check services response
curl http://116.118.49.243:12000
curl http://116.118.49.243:12001/graphql
```

## Rollback

Nếu có vấn đề sau deploy:

```bash
# 1. SSH vào server
ssh root@116.118.49.243

# 2. Restore từ backup
cd /opt/shoprausach/rausach
docker-compose -f docker-compose.rausach.yml down
rm -rf *
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz

# 3. Restart services
docker-compose -f docker-compose.rausach.yml up -d
```

## Security Notes

### 1. SSH Keys
- **KHÔNG** push SSH private keys lên Git
- Sử dụng SSH agent forwarding nếu cần

### 2. Environment Files
- File .env.prod.* chứa production credentials
- **KHÔNG** commit vào Git (đã có .gitignore)
- Backup an toàn ở nơi khác

### 3. Server Access
- Giới hạn SSH access
- Sử dụng firewall
- Enable fail2ban
- Regular security updates

## Next Steps

1. ✅ Test SSH connection: `./remote-deploy.sh` → Option 5
2. ✅ Configure server settings if needed: Option 4
3. ✅ Deploy domain đầu tiên (Rausach recommended)
4. ✅ Verify services running
5. ✅ Deploy domain thứ hai nếu cần

## Support

Nếu gặp vấn đề:

1. Check logs: `./menu.sh` → Option 7
2. Test connections: `./menu.sh` → Option 12
3. Start server services: `./menu.sh` → Option 13
4. Review this guide
5. Check troubleshooting section

---

**Happy Deploying! 🚀**
