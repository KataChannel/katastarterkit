# 🎯 Multi-Domain Development System

## ✅ ĐÃ HOÀN THÀNH

Hệ thống quản lý môi trường phát triển và triển khai đa domain đã được thiết lập hoàn chỉnh!

---

## 📦 Các File Đã Tạo

### 🔧 Environment Files
- `.env.dev.rausach` - Development Rausach (localhost:12000-12001)
- `.env.dev.tazagroup` - Development Tazagroup (localhost:13000-13001)
- `.env.prod.rausach` - Production Rausach (116.118.49.243:12000-12001)
- `.env.prod.tazagroup` - Production Tazagroup (116.118.49.243:13000-13001)

### 🚀 Scripts
- `menu.sh` - Menu chính điều khiển tất cả
- `dev-start.sh` - Khởi động development
- `dev-stop.sh` - Dừng development
- `prod-deploy.sh` - Deploy production
- `status.sh` - Kiểm tra trạng thái hệ thống
- `switch-env.sh` - Chuyển đổi môi trường nhanh
- `test-connection.sh` - Test kết nối tới remote services

### 🐳 Docker Compose Files
- `docker-compose.rausach.yml` - Deploy Rausach
- `docker-compose.tazagroup.yml` - Deploy Tazagroup
- `docker-compose.multi-domain.yml` - Deploy cả 2 domain

### 📖 Documentation
- `QUICK_START_DEV.md` - Hướng dẫn nhanh
- `DEV_GUIDE.md` - Hướng dẫn chi tiết

---

## 🎯 CÁCH SỬ DỤNG

### 🚀 Bắt đầu nhanh

```bash
# Chạy menu chính (khuyến nghị)
./menu.sh
```

### 💻 Development (Localhost)

```bash
# Cách 1: Dùng menu
./menu.sh
# Chọn option 1, 8, 9, hoặc 10

# Cách 2: Script trực tiếp
./dev-start.sh
# Chọn Rausach, Tazagroup, hoặc Both

# Cách 3: NPM scripts
bun run dev:rausach    # Rausach (localhost:12000-12001)
bun run dev:tazagroup  # Tazagroup (localhost:13000-13001)
```

**Development URLs:**
- Rausach Frontend: http://localhost:12000
- Rausach Backend: http://localhost:12001/graphql
- Tazagroup Frontend: http://localhost:13000
- Tazagroup Backend: http://localhost:13001/graphql

**Remote Services (Shared):**
- Database: 116.118.49.243:12003 (rausach), 116.118.49.243:13003 (tazagroup)
- Redis: 116.118.49.243:12004
- Minio: 116.118.49.243:12007

### 🛑 Dừng Development

```bash
./dev-stop.sh
```

### 🌐 Production Deployment

```bash
# Cách 1: Dùng menu
./menu.sh
# Chọn option 5

# Cách 2: Script trực tiếp
./prod-deploy.sh
# Chọn Rausach, Tazagroup, hoặc Multi-domain

# Cách 3: NPM scripts
bun run docker:prod:rausach    # Deploy Rausach
bun run docker:prod:tazagroup  # Deploy Tazagroup
bun run docker:prod:multi      # Deploy cả 2
```

**Production URLs:**
- Rausach: http://116.118.49.243:12000 (frontend), http://116.118.49.243:12001/graphql (backend)
- Tazagroup: http://116.118.49.243:13000 (frontend), http://116.118.49.243:13001/graphql (backend)

### 📊 Kiểm tra Status

```bash
./status.sh
```

### 🔄 Chuyển đổi môi trường

```bash
./switch-env.sh
```

### 🔌 Test kết nối

```bash
./test-connection.sh
```

---

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│           REMOTE SERVER (116.118.49.243)                    │
│  📦 PostgreSQL - Port 12003 (rausach), 13003 (tazagroup)   │
│  🔴 Redis - Port 12004                                      │
│  📁 Minio - Port 12007                                      │
└─────────────────────────────────────────────────────────────┘
          ↑                              ↑
          │                              │
┌─────────┴──────────┐        ┌─────────┴──────────┐
│   RAUSACH          │        │   TAZAGROUP        │
│                    │        │                    │
│ Development:       │        │ Development:       │
│  Frontend: 12000   │        │  Frontend: 13000   │
│  Backend:  12001   │        │  Backend:  13001   │
│                    │        │                    │
│ Production:        │        │ Production:        │
│  Frontend: 12000   │        │  Frontend: 13000   │
│  Backend:  12001   │        │  Backend:  13001   │
└────────────────────┘        └────────────────────┘
```

---

## ✨ Tính năng

✅ **Tách biệt môi trường**: Dev và Production hoàn toàn độc lập
✅ **Multi-domain**: Hỗ trợ nhiều domain với cơ sở hạ tầng chung
✅ **Dễ dàng chuyển đổi**: Scripts tự động hóa việc chuyển môi trường
✅ **Hot reload**: Development mode hỗ trợ hot reload
✅ **Docker ready**: Production chạy trong container
✅ **Status monitoring**: Kiểm tra trạng thái dễ dàng
✅ **Connection testing**: Test kết nối tới remote services

---

## 📝 Notes

1. **Development mode**: Backend và Frontend chạy trực tiếp với Bun (nhanh, hot reload)
2. **Production mode**: Chạy trong Docker containers (isolated, production-ready)
3. **Database/Redis/Minio**: Cả dev và prod đều dùng remote server
4. **Port allocation**: Rausach (12xxx), Tazagroup (13xxx)

---

## 🆘 Troubleshooting

### Port bị chiếm
```bash
./dev-stop.sh
# Hoặc
./status.sh  # Xem port nào đang chạy
```

### Không kết nối được remote services
```bash
./test-connection.sh
```

### Environment không đúng
```bash
./switch-env.sh
# Hoặc check:
cat backend/.env | head -5
```

### Container không start
```bash
docker-compose -f docker-compose.rausach.yml logs
```

---

## 📚 Chi tiết hơn

Xem file [DEV_GUIDE.md](./DEV_GUIDE.md) để biết thêm chi tiết!

---

## 🎉 Hoàn tất!

Hệ thống đã sẵn sàng sử dụng. Chạy `./menu.sh` để bắt đầu!

**Made with ❤️ for Easy Development**
