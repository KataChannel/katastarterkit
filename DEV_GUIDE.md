# 🚀 HƯỚNG DẪN PHÁT TRIỂN VÀ TRIỂN KHAI

## 📋 Tổng quan

Dự án hỗ trợ **2 chế độ làm việc**:

1. **Development (localhost)** - Phát triển trên máy local
2. **Production (server)** - Triển khai lên server 116.118.49.243

### 🏗️ Kiến trúc Multi-Domain

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED INFRASTRUCTURE                     │
│  📦 PostgreSQL (12003, 13003)                               │
│  🔴 Redis (12004)                                           │
│  📁 Minio (12007)                                           │
└─────────────────────────────────────────────────────────────┘
          ↑                              ↑
          │                              │
┌─────────┴──────────┐        ┌─────────┴──────────┐
│   RAUSACH DOMAIN   │        │ TAZAGROUP DOMAIN   │
│ Frontend:  12000   │        │ Frontend:  13000   │
│ Backend:   12001   │        │ Backend:   13001   │
└────────────────────┘        └────────────────────┘
```

---

## 🛠️ DEVELOPMENT MODE (Localhost)

### ✅ Yêu cầu

- Bun >= 1.1.0
- Node.js >= 18
- Access tới server 116.118.49.243 (Database, Redis, Minio)

### 🚀 Khởi động Development

#### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
# Cho phép thực thi script
chmod +x dev-start.sh dev-stop.sh switch-env.sh

# Khởi động với menu lựa chọn
./dev-start.sh

# Menu sẽ hiện:
# 1) Rausach    (localhost:12000 + localhost:12001)
# 2) Tazagroup  (localhost:13000 + localhost:13001)
# 3) Both       (Cả 2 domain)
# 4) Exit
```

#### Cách 2: Thủ công

**Rausach Domain:**
```bash
# Terminal 1 - Backend
cp .env.dev.rausach backend/.env
cd backend
PORT=12001 bun run dev

# Terminal 2 - Frontend
cp .env.dev.rausach frontend/.env.local
cd frontend
bun run dev -- -p 12000
```

**Tazagroup Domain:**
```bash
# Terminal 1 - Backend
cp .env.dev.tazagroup backend/.env
cd backend
PORT=13001 bun run dev

# Terminal 2 - Frontend
cp .env.dev.tazagroup frontend/.env.local
cd frontend
bun run dev -- -p 13000
```

### 🛑 Dừng Development

```bash
./dev-stop.sh
```

### 🔄 Chuyển đổi môi trường nhanh

```bash
./switch-env.sh

# Menu:
# 1) Dev - Rausach      (localhost:12000-12001)
# 2) Dev - Tazagroup    (localhost:13000-13001)
# 3) Prod - Rausach     (116.118.49.243:12000-12001)
# 4) Prod - Tazagroup   (116.118.49.243:13000-13001)
```

---

## 🌐 PRODUCTION MODE (Server)

### 🚀 Deploy lên Server

#### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
# Cho phép thực thi
chmod +x prod-deploy.sh

# Deploy với menu
./prod-deploy.sh

# Menu:
# 1) Rausach         (116.118.49.243:12000-12001)
# 2) Tazagroup       (116.118.49.243:13000-13001)
# 3) Multi-domain    (Cả 2 domain)
# 4) Exit
```

#### Cách 2: Thủ công với Docker Compose

**Deploy Rausach:**
```bash
docker-compose -f docker-compose.rausach.yml up -d --build
```

**Deploy Tazagroup:**
```bash
docker-compose -f docker-compose.tazagroup.yml up -d --build
```

**Deploy Multi-domain (cả 2):**
```bash
docker-compose -f docker-compose.multi-domain.yml up -d --build
```

### 📊 Quản lý Production

**Xem logs:**
```bash
docker-compose -f docker-compose.rausach.yml logs -f
docker-compose -f docker-compose.tazagroup.yml logs -f
docker-compose -f docker-compose.multi-domain.yml logs -f
```

**Kiểm tra status:**
```bash
docker-compose -f docker-compose.rausach.yml ps
docker-compose -f docker-compose.tazagroup.yml ps
```

**Dừng services:**
```bash
docker-compose -f docker-compose.rausach.yml down
docker-compose -f docker-compose.tazagroup.yml down
docker-compose -f docker-compose.multi-domain.yml down
```

**Restart services:**
```bash
docker-compose -f docker-compose.rausach.yml restart
docker-compose -f docker-compose.tazagroup.yml restart
```

---

## 📂 Cấu trúc File Môi trường

```
.
├── .env.dev.rausach      # Dev - Rausach (localhost)
├── .env.dev.tazagroup    # Dev - Tazagroup (localhost)
├── .env.prod.rausach     # Production - Rausach (server)
├── .env.prod.tazagroup   # Production - Tazagroup (server)
├── dev-start.sh          # Script khởi động dev
├── dev-stop.sh           # Script dừng dev
├── prod-deploy.sh        # Script deploy production
├── switch-env.sh         # Script chuyển môi trường nhanh
├── docker-compose.rausach.yml      # Docker cho Rausach
├── docker-compose.tazagroup.yml    # Docker cho Tazagroup
└── docker-compose.multi-domain.yml # Docker cho cả 2
```

---

## 🌍 URL và Port Mapping

### Development (Localhost)

| Domain    | Frontend | Backend | GraphQL |
|-----------|----------|---------|---------|
| Rausach   | http://localhost:12000 | http://localhost:12001 | http://localhost:12001/graphql |
| Tazagroup | http://localhost:13000 | http://localhost:13001 | http://localhost:13001/graphql |

**Shared Services (Remote):**
- Database: `116.118.49.243:12003` (rausachcore), `116.118.49.243:13003` (tazagroupcore)
- Redis: `116.118.49.243:12004`
- Minio: `116.118.49.243:12007`

### Production (Server)

| Domain    | Frontend | Backend | GraphQL |
|-----------|----------|---------|---------|
| Rausach   | http://116.118.49.243:12000 | http://116.118.49.243:12001 | http://116.118.49.243:12001/graphql |
| Tazagroup | http://116.118.49.243:13000 | http://116.118.49.243:13001 | http://116.118.49.243:13001/graphql |

---

## 🔥 Quick Commands

### Development
```bash
# Khởi động dev
./dev-start.sh

# Dừng dev
./dev-stop.sh

# Chuyển môi trường
./switch-env.sh

# Xem logs
tail -f dev-rausach-backend.log
tail -f dev-rausach-frontend.log
tail -f dev-tazagroup-backend.log
tail -f dev-tazagroup-frontend.log
```

### Production
```bash
# Deploy
./prod-deploy.sh

# Hoặc thủ công
docker-compose -f docker-compose.rausach.yml up -d --build
docker-compose -f docker-compose.tazagroup.yml up -d --build
docker-compose -f docker-compose.multi-domain.yml up -d --build

# Logs
docker-compose -f docker-compose.multi-domain.yml logs -f

# Stop
docker-compose -f docker-compose.multi-domain.yml down
```

---

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra port đang dùng
lsof -ti:12000
lsof -ti:12001
lsof -ti:13000
lsof -ti:13001

# Kill process trên port cụ thể
kill -9 $(lsof -ti:12000)

# Hoặc dùng script
./dev-stop.sh
```

### Không kết nối được database/redis/minio
```bash
# Kiểm tra kết nối tới server
ping 116.118.49.243

# Test port
telnet 116.118.49.243 12003  # PostgreSQL Rausach
telnet 116.118.49.243 13003  # PostgreSQL Tazagroup
telnet 116.118.49.243 12004  # Redis
telnet 116.118.49.243 12007  # Minio
```

### Environment variables không đúng
```bash
# Kiểm tra file .env hiện tại
cat backend/.env | head -10
cat frontend/.env.local | head -10

# Dùng switch-env.sh để chuyển đúng môi trường
./switch-env.sh
```

### Docker container không start
```bash
# Xem logs chi tiết
docker-compose -f docker-compose.rausach.yml logs

# Rebuild từ đầu
docker-compose -f docker-compose.rausach.yml down
docker-compose -f docker-compose.rausach.yml up -d --build --force-recreate
```

---

## 💡 Best Practices

1. **Development**: Luôn dùng `dev-start.sh` để tránh nhầm lẫn môi trường
2. **Production**: Test kỹ trên localhost trước khi deploy
3. **Environment**: Dùng `switch-env.sh` khi cần chuyển đổi nhanh
4. **Logs**: Thường xuyên check logs để phát hiện lỗi sớm
5. **Backup**: Backup database trước khi deploy phiên bản mới

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. File `.env` có đúng không
2. Ports có bị chiếm không
3. Kết nối tới server 116.118.49.243 có ổn không
4. Logs của backend/frontend

---

## 📝 Notes

- **Dev mode**: Backend và Frontend chạy trực tiếp với Bun (nhanh, hot reload)
- **Prod mode**: Chạy trong Docker containers (isolated, production-ready)
- **Database/Redis/Minio**: Dev dùng remote server, Prod cũng dùng server
- **Port allocation**: Rausach (12xxx), Tazagroup (13xxx)
