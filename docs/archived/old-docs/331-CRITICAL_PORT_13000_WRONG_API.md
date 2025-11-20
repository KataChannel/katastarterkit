# 🔴 VẤN ĐỀ NGHIÊM TRỌNG: Port 13000 Đang Gọi API Sai

## 🐛 Hiện Tượng

Khi truy cập http://116.118.49.243:13000:
- ✅ Trang web hiển thị OK
- ❌ **Đang gọi:** `http://api.rausachtrangia.com/graphql`
- ✅ **Cần gọi:** `http://116.118.49.243:13001/graphql`

## 🔍 Phân Tích

### 1. Không Có Process Nào Listen Port 13000 Trên Server Local
```bash
$ ss -tlnp | grep 13000
# (Không có kết quả)

$ docker ps | grep 13000
# (Không có container)
```

### 2. Frontend Local Đang Chạy Trên Port 12000
```bash
$ ps aux | grep "next dev"
node .../next dev -p 12000  # ← Port 12000, KHÔNG phải 13000!
```

### 3. Port 13000 Serve Static Build Cũ
- Build time: `2025-11-04 05:43`
- Sử dụng config: `.env.production` với `api.rausachtrangia.com`
- Đang serve từ: **Server production khác hoặc Reverse Proxy**

## ❓ Có Thể Là Gì?

### Kịch Bản 1: Reverse Proxy / Load Balancer
- Router/Firewall forward port 13000 từ server khác
- Apache/Nginx proxy từ domain production
- CDN cache static content cũ

### Kịch Bản 2: Container/VM Khác
- Docker container đang chạy background  
- VM/LXC container riêng
- Cloud instance khác

### Kịch Bản 3: Build Static Đã Deploy
- Build production được deploy lên hosting
- Static files trên CDN
- Old deployment chưa được terminate

## ✅ GIẢI PHÁP

### Giải Pháp 1: Start Frontend Local Trên Port 13000

**Bước 1:** Dừng frontend đang chạy port 12000
```bash
# Tìm process
ps aux | grep "next dev"

# Kill process (thay PID)
kill <PID>
```

**Bước 2:** Xóa cache và start port 13000
```bash
cd /mnt/chikiet/kataoffical/shoprausach/frontend

# Xóa cache
rm -rf .next

# Start trên port 13000
./start-frontend-tazagroup.sh

# HOẶC thủ công:
npm run dev -- -p 13000
```

**Bước 3:** Verify
```bash
curl http://localhost:13000
# Phải chạy từ localhost

# Test API endpoint
curl -s http://localhost:13000 | grep graphql
```

### Giải Pháp 2: Tìm Và Dừng Process/Container Đang Serve Port 13000

```bash
# Tìm tất cả processes
sudo lsof -i :13000

# Tìm Docker containers
docker ps -a | grep 13000

# Tìm trong systemd services
systemctl list-units | grep -E "next|node|frontend"

# Kiểm tra cron jobs
crontab -l | grep -E "next|frontend"
```

### Giải Pháp 3: Rebuild Frontend Với Env Đúng

**Tạo file `.env.production.local`:**
```env
# Production environment for LOCAL server
NEXT_PUBLIC_APP_URL=http://116.118.49.243:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.49.243:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.49.243:13001
NEXTAUTH_URL=http://116.118.49.243:13000
```

**Build lại:**
```bash
cd frontend

# Build với env mới
npm run build

# Start production server
npm run start -- -p 13000
```

## 🔧 TROUBLESHOOTING

### Kiểm Tra 1: Tìm Nguồn Port 13000
```bash
# Network connections
sudo netstat -tulnp | grep 13000

# Routing
ip route

# iptables
sudo iptables -L -n -v | grep 13000

# Firewall
sudo ufw status | grep 13000
```

### Kiểm Tra 2: DNS/Proxy
```bash
# Hosts file
cat /etc/hosts | grep -E "116.118.49.243|rausachtrangia|tazagroup"

# Apache vhosts
ls -la /etc/apache2/sites-enabled/
cat /etc/apache2/sites-enabled/*.conf | grep -E "13000|ProxyPass"

# Nginx
cat /etc/nginx/sites-enabled/* | grep -E "13000|proxy_pass"
```

### Kiểm Tra 3: Xác Định Build Nguồn
```bash
# Check .next BUILD_ID
cat frontend/.next/BUILD_ID
stat frontend/.next/BUILD_ID

# Check last build
ls -lh frontend/.next/server/

# Check environment used
cat frontend/.env.production
```

## 🎯 KHUYẾN NGHỊ

### ✅ Làm Ngay
1. **Tìm và dừng process đang serve port 13000**
2. **Start frontend local trên port 13000 với env đúng**
3. **Verify bằng browser DevTools > Network tab**

### ⚠️ Cảnh Báo
- Port 13000 đang serve từ **nguồn không xác định**
- Có thể là **production deployment cũ** đang conflict
- Cần **identify và terminate** để tránh confusion

### 📝 Next Steps
1. Run script để tìm process:
   ```bash
   sudo lsof -i :13000
   sudo netstat -tulnp | grep 13000
   ```

2. Nếu không tìm thấy local:
   - Kiểm tra router/firewall port forwarding
   - Kiểm tra cloud instances
   - Kiểm tra DNS records

3. Sau khi tìm được:
   - Stop/disable old deployment
   - Start fresh frontend trên port 13000
   - Update DNS nếu cần

---

**Status:** 🔴 CRITICAL - Frontend đang kết nối API sai  
**Priority:** P0 - Fix ngay lập tức  
**Impact:** Users không thể sử dụng trang http://116.118.49.243:13000
