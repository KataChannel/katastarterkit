# 🚀 HƯỚNG DẪN SỬ DỤNG - MULTI-DOMAIN DEVELOPMENT

## 📋 Tổng quan

Hệ thống hỗ trợ **2 domain** (Rausach & Tazagroup) với **2 môi trường** (Development & Production):

### 🏠 Development (localhost)
- **Rausach**: `localhost:12000` (frontend) + `localhost:12001` (backend)
- **Tazagroup**: `localhost:13000` (frontend) + `localhost:13001` (backend)
- Database, Redis, Minio: Sử dụng **remote server** `116.118.49.243`

### 🚢 Production (server)
- **Rausach**: `116.118.49.243:12000` + `116.118.49.243:12001`
- **Tazagroup**: `116.118.49.243:13000` + `116.118.49.243:13001`
- Database, Redis, Minio: Chạy trên **cùng server** `116.118.49.243`

---

## 🎯 Cách sử dụng

### Option 1: Menu tương tác (Đơn giản nhất)

```bash
./menu.sh
```

Chọn các option:
- `1-2`: Khởi động dev (Rausach/Tazagroup)
- `4-5`: Deploy production
- `7`: Xem status
- `9`: Test kết nối remote services

### Option 2: Scripts trực tiếp

#### 🧑‍💻 Development Mode

**Khởi động Rausach:**
```bash
./dev-start.sh
# Chọn option 1
```

**Khởi động Tazagroup:**
```bash
./dev-start.sh
# Chọn option 2
```

**Khởi động cả 2:**
```bash
./dev-start.sh
# Chọn option 3
```

**Dừng development:**
```bash
./dev-stop.sh
```

#### 🚀 Production Mode

**Deploy Rausach:**
```bash
./prod-deploy.sh rausach
```

**Deploy Tazagroup:**
```bash
./prod-deploy.sh tazagroup
```

**Dừng production:**
```bash
docker-compose -f docker-compose.rausach.yml down
docker-compose -f docker-compose.tazagroup.yml down
```

---

## 📦 Cấu trúc Services

### Rausach
- **Database**: `116.118.49.243:12003` - `rausachcore`
- **Redis**: `116.118.49.243:12004` (shared)
- **Minio**: `116.118.49.243:12007` (shared)
- **PgAdmin**: `116.118.49.243:12002`

### Tazagroup
- **Database**: `116.118.49.243:13003` - `tazagroupcore`
- **Redis**: `116.118.49.243:12004` (shared)
- **Minio**: `116.118.49.243:12007` (shared)
- **PgAdmin**: `116.118.49.243:13002`

---

## ⚙️ Environment Files

Mỗi domain có 2 environment files:

### Development
- `.env.dev.rausach` - Localhost ports, remote services
- `.env.dev.tazagroup` - Localhost ports, remote services

### Production
- `.env.prod.rausach` - Server ports, remote services
- `.env.prod.tazagroup` - Server ports, remote services

---

## 🔄 Workflow thông thường

### 1. Khởi động Development

```bash
# Bước 1: Đảm bảo remote services đang chạy trên server
./test-connection.sh

# Bước 2: Khởi động domain cần làm việc
./dev-start.sh
# Chọn domain: Rausach (1) hoặc Tazagroup (2)

# Bước 3: Mở browser
# Rausach: http://localhost:12000
# Tazagroup: http://localhost:13000
```

### 2. Chuyển đổi domain

```bash
# Dừng domain hiện tại
./dev-stop.sh

# Khởi động domain khác
./dev-start.sh
```

### 3. Deploy lên Production

```bash
# Rausach
./prod-deploy.sh rausach

# Tazagroup
./prod-deploy.sh tazagroup
```

---

## 📝 Các Scripts quan trọng

| Script | Mô tả |
|--------|-------|
| `menu.sh` | Menu tương tác chính |
| `dev-start.sh` | Khởi động development |
| `dev-stop.sh` | Dừng development |
| `prod-deploy.sh` | Deploy production |
| `status.sh` | Kiểm tra trạng thái services |
| `switch-env.sh` | Chuyển đổi environment |
| `test-connection.sh` | Test kết nối remote services |

---

## 🐛 Troubleshooting

### Lỗi: "Can't reach database server"

**Nguyên nhân:** Server `116.118.49.243` chưa chạy database services

**Giải pháp:**
```bash
# 1. SSH vào server
ssh root@116.118.49.243

# 2. Khởi động database services trên server
cd /path/to/project
docker-compose up -d postgres redis minio

# 3. Kiểm tra services đang chạy
docker-compose ps
```

### Lỗi: "Port already in use"

**Giải pháp:**
```bash
# Dừng process đang dùng port
./dev-stop.sh

# Hoặc kill process thủ công
lsof -ti:12000 | xargs kill -9
lsof -ti:12001 | xargs kill -9
```

### Lỗi: "Connection refused to Redis/Minio"

**Giải pháp:**
```bash
# Test connection
./test-connection.sh

# Nếu failed, check server
ssh root@116.118.49.243
docker-compose ps
docker-compose logs redis
docker-compose logs minio
```

---

## 🎨 Development Tips

### 1. Xem logs realtime

```bash
# Backend logs
tail -f dev-rausach-backend.log
tail -f dev-tazagroup-backend.log

# Frontend logs
tail -f dev-rausach-frontend.log
tail -f dev-tazagroup-frontend.log
```

### 2. Restart một service

```bash
# Tìm PID của service
ps aux | grep "bun run dev"

# Kill process cụ thể
kill <PID>

# Restart lại với dev-start.sh
```

### 3. Debug database

```bash
# Connect vào PostgreSQL
psql -h 116.118.49.243 -p 12003 -U postgres -d rausachcore

# Hoặc dùng PgAdmin
# Rausach: http://116.118.49.243:12002
# Tazagroup: http://116.118.49.243:13002
```

---

## ⚡ Quick Commands

```bash
# Setup lần đầu
./menu.sh

# Development thường ngày
./dev-start.sh   # Chọn domain
# Code...
./dev-stop.sh    # Khi xong

# Deploy
./prod-deploy.sh rausach

# Check status
./status.sh

# Test connections
./test-connection.sh
```

---

## 🔐 Security Notes

- **KHÔNG** commit các file `.env.dev.*` và `.env.prod.*`
- File `.gitignore` đã được cấu hình để block tất cả `.env*` files
- Chỉ `.env.example` được commit (template)
- Thay đổi các secrets trong production:
  - `JWT_SECRET`
  - `NEXTAUTH_SECRET`
  - `POSTGRES_PASSWORD`
  - `MINIO_SECRET_KEY`

---

## 📞 Support

Nếu gặp vấn đề:
1. Chạy `./test-connection.sh` để kiểm tra kết nối
2. Chạy `./status.sh` để xem trạng thái services
3. Check logs trong các file `dev-*-backend.log` và `dev-*-frontend.log`

---

**Happy coding! 🚀**
