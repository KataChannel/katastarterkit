# 🔧 CẬP NHẬT: SERVICE HEALTH CHECK

## 📅 Ngày: November 4, 2025

## ✅ Những gì đã cập nhật

### 1. **dev-start.sh** - Kiểm tra services trước khi khởi động Development

**Tính năng mới:**
- ✅ Tự động kiểm tra kết nối đến PostgreSQL, Redis, Minio trước khi start
- ✅ Hiển thị trạng thái từng service (✅ OK hoặc ❌ FAILED)
- ✅ Cho phép user tiếp tục hoặc dừng nếu có service lỗi
- ✅ Hướng dẫn cách fix nếu service không available

**Cách hoạt động:**
```bash
./dev-start.sh
# Chọn domain
# → Script tự động check:
#   - PostgreSQL (port 12003 hoặc 13003)
#   - Redis (port 12004)
#   - Minio (port 12007)
# → Nếu OK: Tiếp tục khởi động
# → Nếu FAILED: Hiện warning + hướng dẫn fix
```

---

### 2. **prod-deploy.sh** - Kiểm tra services trước khi Deploy Production

**Tính năng mới:**
- ✅ Kiểm tra tất cả services cần thiết trước deploy
- ✅ Kiểm tra cả port connectivity VÀ authentication (PostgreSQL, Redis)
- ✅ Ngăn deployment nếu thiếu services quan trọng
- ✅ Hướng dẫn chi tiết cách start services trên server

**Services được kiểm tra:**
- PostgreSQL (port + authentication)
- Redis (port + PING command)
- Minio (port + console port)

**Cách hoạt động:**
```bash
./prod-deploy.sh rausach
# → Script check:
#   - PostgreSQL Rausach (12003) + auth test
#   - Redis (12004) + PING test
#   - Minio (12007, 12008)
# → Nếu tất cả OK: Deploy
# → Nếu có lỗi: Dừng + hướng dẫn fix
```

---

### 3. **test-connection.sh** - Cải tiến Test Connection Tool

**Tính năng mới:**
- ✅ Đếm số services failed
- ✅ Exit code 1 nếu có lỗi (dùng được trong CI/CD)
- ✅ Hướng dẫn fix chi tiết hơn
- ✅ Màu sắc rõ ràng hơn (CYAN cho instructions)

**Output mới:**
```
✅ All services are available!
🎉 Ready for development and deployment!
```

Hoặc nếu lỗi:
```
❌ 3 service(s) failed!
⚠️  Some services are not available!

To fix this issue:
  1. SSH to server: ssh root@116.118.49.243
  2. Start services: docker-compose up -d postgres redis minio
  3. Verify: docker-compose ps
  4. Test again: ./test-connection.sh
```

---

### 4. **start-server-services.sh** - Script MỚI để bật services trên server

**Tính năng:**
- ✅ SSH vào server và start services từ máy local
- ✅ Menu chọn services cần start:
  - All services (PostgreSQL + Redis + Minio)
  - PostgreSQL only
  - Redis only
  - Minio only
  - Rausach PostgreSQL only
  - Tazagroup PostgreSQL only
  - Show running services
- ✅ Tự động detect project directory trên server
- ✅ Hiển thị status sau khi start

**Cách dùng:**
```bash
./start-server-services.sh

# Chọn option:
# 1 = All Services
# 2 = PostgreSQL only
# 3 = Redis only
# etc.

# Script sẽ:
# - SSH vào server
# - Tìm project directory
# - Run: docker-compose up -d [services]
# - Show: docker-compose ps
```

---

### 5. **menu.sh** - Thêm options mới

**Options mới:**
```
11) 🧪 Test Remote Connections    → ./test-connection.sh
12) 🚀 Start Server Services      → ./start-server-services.sh
13) 🔧 Install Dependencies       (đã có, đổi số)
14) 🗄️  Database Studio            (đã có, đổi số)
15) 📦 Clean Project              (đã có, đổi số)
```

---

## 🎯 Lợi ích

### 1. **Tránh lỗi runtime**
- Không còn start dev rồi mới phát hiện "Can't reach database"
- Biết trước services nào đang lỗi

### 2. **Hướng dẫn rõ ràng**
- User biết chính xác phải làm gì khi có lỗi
- Command cụ thể để fix

### 3. **Tiết kiệm thời gian**
- Không phải restart nhiều lần
- Phát hiện vấn đề ngay từ đầu

### 4. **Production safety**
- Không deploy khi thiếu services
- Giảm downtime

---

## 📋 Workflow mới

### Development:
```bash
# Cách 1: Dùng menu
./menu.sh
→ Chọn 11: Test connections
→ Nếu OK, chọn 1: Start development

# Cách 2: Trực tiếp
./test-connection.sh        # Kiểm tra trước
./dev-start.sh             # Start (có check tự động)
```

### Production:
```bash
# Cách 1: Dùng menu
./menu.sh
→ Chọn 11: Test connections
→ Nếu OK, chọn 5: Deploy production

# Cách 2: Trực tiếp
./test-connection.sh        # Kiểm tra trước
./prod-deploy.sh rausach   # Deploy (có check tự động)
```

### Start services trên server:
```bash
# Cách 1: Dùng menu
./menu.sh
→ Chọn 12: Start server services
→ Chọn services cần start

# Cách 2: Trực tiếp
./start-server-services.sh
→ Chọn option
```

---

## 🔧 Technical Details

### Check Functions

**Port connectivity:**
```bash
timeout 3 bash -c "cat < /dev/null > /dev/tcp/$HOST/$PORT"
```

**PostgreSQL authentication:**
```bash
PGPASSWORD=$pass psql -h $host -p $port -U $user -d $db -c "SELECT 1;"
```

**Redis PING:**
```bash
redis-cli -h $host -p $port -a "$pass" PING
```

### Exit Codes
- `0` = All services OK
- `1` = Some services failed

### Colors
- 🟢 GREEN = Success
- 🔴 RED = Error
- 🟡 YELLOW = Warning
- 🔵 BLUE = Info
- 🔷 CYAN = Instructions

---

## 📚 Files Modified

1. ✅ `dev-start.sh` - Added `check_remote_services()` function
2. ✅ `prod-deploy.sh` - Added `check_deployment_requirements()` function
3. ✅ `test-connection.sh` - Enhanced with better error handling
4. ✅ `menu.sh` - Added new menu options
5. ✅ `start-server-services.sh` - NEW file

---

## 🧪 Testing

### Test scenario 1: Services running
```bash
./test-connection.sh
# Expected: All ✅ OK
```

### Test scenario 2: Services not running
```bash
./test-connection.sh
# Expected: Some ❌ FAILED + instructions
# Exit code: 1
```

### Test scenario 3: Dev start with services OK
```bash
./dev-start.sh
# Expected: 
# - Check shows all ✅
# - Proceed to start
```

### Test scenario 4: Dev start with services down
```bash
./dev-start.sh
# Expected:
# - Check shows ❌ FAILED
# - Ask: Continue anyway? (y/N)
# - If N: Exit
# - If Y: Proceed (at your own risk)
```

---

## 💡 Next Steps

1. **Kiểm tra servers:**
   ```bash
   ./test-connection.sh
   ```

2. **Nếu services chưa chạy:**
   ```bash
   ./start-server-services.sh
   # Hoặc SSH vào server manual
   ```

3. **Khởi động development:**
   ```bash
   ./dev-start.sh
   ```

---

## 🆘 Troubleshooting

### "All checks failed"
→ Server không bật hoặc firewall block
→ SSH vào server check: `docker-compose ps`

### "Port open but auth check skipped"
→ psql hoặc redis-cli chưa cài trên máy local
→ Port connectivity OK, có thể tiếp tục

### "SSH connection failed"
→ Check SSH credentials
→ Try manual: `ssh root@116.118.49.243`

---

**✅ Cập nhật hoàn tất! Hệ thống giờ an toàn hơn và user-friendly hơn!** 🎉
