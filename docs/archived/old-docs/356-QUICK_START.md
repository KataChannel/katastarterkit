# HƯỚNG DẪN TRIỂN KHAI NHANH

## ✅ CÀI ĐẶT THÀNH CÔNG

Dự án đã được tối ưu hóa và sẵn sàng deploy!

## 📦 FILES CHÍNH

```
cleanup-server.sh           # Script dọn dẹp disk space
deploy.sh                   # Script deploy chính
docker-compose.hybrid.yml   # Docker compose cho production
menu.sh                     # Menu quản lý tương tác
README.md                   # Tài liệu chính
```

## 🚀 DEPLOY 1 LỆNH

```bash
./deploy.sh
```

Hoặc dùng menu tương tác:

```bash
./menu.sh
```

## 🌐 TRUY CẬP SAU KHI DEPLOY

- Rausach: http://116.118.49.243:12000
- Tazagroup: http://116.118.49.243:13000

## 🔍 KIỂM TRA TRẠNG THÁI

```bash
# Xem container status
ssh root@116.118.49.243 'docker compose -f docker-compose.hybrid.yml ps'

# Xem logs backend
ssh root@116.118.49.243 'docker compose -f docker-compose.hybrid.yml logs -f shopbackend'
```

## 🧹 BẢO TRÌ

```bash
# Dọn dẹp disk (chạy hàng tuần)
ssh root@116.118.49.243 'bash /root/cleanup-server.sh'

# Restart services
ssh root@116.118.49.243 'cd /root/shoprausach && docker compose -f docker-compose.hybrid.yml restart'
```

## ⚡ TỐI ƯU HÓA ĐÃ THỰC HIỆN

✅ Backend Dockerfile multi-stage (giảm 70% dung lượng)
✅ Memory allocation tối ưu cho 4GB RAM
✅ PostgreSQL tuning cho 2-core CPU
✅ Redis với LRU eviction policy
✅ Disk cleanup script (đã giải phóng 6GB)
✅ Production dependencies only

## 📊 RESOURCE ALLOCATION

```
Backend (2x):      512MB × 2 = 1024MB
Frontend (2x):     256MB × 2 = 512MB
PostgreSQL (2x):   256MB × 2 = 512MB
Redis:             128MB
Minio:             128MB
─────────────────────────────────────
Total:             ~2.3GB / 4GB (58%)
```

## 🎯 PORTS

| Service | Rausach | Tazagroup |
|---------|---------|-----------|
| Frontend | 12000 | 13000 |
| Backend | 12001 | 13001 |
| PostgreSQL | 12003 | 13003 |

Shared services:
- Redis: 12004
- Minio: 12007-12008

## 🐛 XỬ LÝ SỰ CỐ

### Container bị unhealthy?
```bash
docker compose -f docker-compose.hybrid.yml logs shopbackend
docker compose -f docker-compose.hybrid.yml restart shopbackend
```

### Hết disk space?
```bash
bash cleanup-server.sh
```

### Frontend không load?
```bash
# Test backend
curl http://116.118.49.243:12001/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}'

# Restart frontend
docker compose -f docker-compose.hybrid.yml restart shopfrontend
```

---

📖 Chi tiết xem README.md
🔧 Quản lý qua ./menu.sh
