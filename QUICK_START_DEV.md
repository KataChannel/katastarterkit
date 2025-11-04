# 🎯 HƯỚNG DẪN NHANH - BẮT ĐẦU NGAY

## ✅ Setup lần đầu (1 phút)

### Bước 1: Đảm bảo server đang chạy

Trên server `116.118.49.243`, các services sau phải đang chạy:
- PostgreSQL (ports: 12003, 13003)
- Redis (port: 12004)
- Minio (port: 12007)

### Bước 2: Test kết nối

```bash
./test-connection.sh
```

Nếu tất cả ✅ OK → Tiếp tục
Nếu có ❌ FAILED → Liên hệ admin server

---

## 🚀 Khởi động Development (10 giây)

### Cách 1: Dùng Menu (Khuyến nghị)

```bash
./menu.sh
```

Chọn:
- `1` - Rausach (localhost:12000)
- `2` - Tazagroup (localhost:13000)
- `3` - Cả 2 domain

### Cách 2: Lệnh trực tiếp

**Rausach:**
```bash
./dev-start.sh
# Nhập: 1
```

**Tazagroup:**
```bash
./dev-start.sh
# Nhập: 2
```

**Cả 2:**
```bash
./dev-start.sh
# Nhập: 3
```

---

## 🛑 Dừng Development

```bash
./dev-stop.sh
```

---

## 📍 URLs sau khi khởi động

### Rausach Dev
- Frontend: http://localhost:12000
- Backend: http://localhost:12001/graphql
- Database: 116.118.49.243:12003

### Tazagroup Dev
- Frontend: http://localhost:13000
- Backend: http://localhost:13001/graphql
- Database: 116.118.49.243:13003

---

## 🔥 Workflow hàng ngày

```bash
# Sáng: Bật project
./dev-start.sh
# Chọn domain cần làm

# Code, code, code... ☕

# Tối: Tắt project
./dev-stop.sh
```

---

## 🚢 Deploy lên Server Production

### Rausach
```bash
./prod-deploy.sh rausach
```

### Tazagroup
```bash
./prod-deploy.sh tazagroup
```

Sau khi deploy:
- Rausach: http://116.118.49.243:12000
- Tazagroup: http://116.118.49.243:13000

---

## 📋 Các lệnh hay dùng

| Lệnh | Chức năng |
|------|-----------|
| `./menu.sh` | Menu chính (dễ nhất) |
| `./dev-start.sh` | Bật dev |
| `./dev-stop.sh` | Tắt dev |
| `./status.sh` | Xem trạng thái |
| `./test-connection.sh` | Test kết nối server |

---

## 🐛 Gặp lỗi?

### "Can't reach database"
→ Server chưa bật database. Liên hệ admin hoặc SSH vào server bật lại

### "Port already in use"
```bash
./dev-stop.sh
```

### "Connection refused"
```bash
./test-connection.sh
# Check xem service nào bị lỗi
```

---

## 💡 Tips

### Xem logs
```bash
# Backend
tail -f dev-rausach-backend.log
tail -f dev-tazagroup-backend.log

# Frontend
tail -f dev-rausach-frontend.log
tail -f dev-tazagroup-frontend.log
```

### Làm 2 domain cùng lúc
```bash
./dev-start.sh
# Chọn 3 (Both)

# Mở 2 tab browser:
# Tab 1: localhost:12000 (Rausach)
# Tab 2: localhost:13000 (Tazagroup)
```

---

## ⚠️ Lưu ý

- **Development**: Frontend/Backend chạy localhost, Database/Redis/Minio dùng server
- **Production**: Tất cả chạy trên server 116.118.49.243
- Không commit file `.env.dev.*` và `.env.prod.*`
- File này chỉ dùng cho môi trường local/server của team

---

## 🎓 Tài liệu chi tiết

Đọc thêm: [DEV_GUIDE.md](./DEV_GUIDE.md)

---

**Chúc code vui vẻ! 🎉**
