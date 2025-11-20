# 🚀 Hướng Dẫn Deploy Multi-Domain (Không dùng Makefile)

## 📋 Tổng quan

Có 2 phương án deploy:
- **Hybrid** (Khuyên dùng): Database riêng, Redis & Minio chung - RAM: ~1.8GB
- **Multi-Domain**: Tất cả services chung - RAM: ~1.5GB

---

## 🎯 Cách 1: Sử dụng Script Đơn Giản (KHUYÊN DÙNG)

### Hybrid Deployment

#### Khởi động
```bash
# Khởi động tất cả
./start-hybrid.sh all

# Chỉ Rausach
./start-hybrid.sh rausach

# Chỉ Tazagroup
./start-hybrid.sh tazagroup

# Chỉ Redis + Minio (shared)
./start-hybrid.sh shared
```

#### Dừng
```bash
# Dừng tất cả
./stop-hybrid.sh all

# Dừng Rausach
./stop-hybrid.sh rausach

# Dừng Tazagroup
./stop-hybrid.sh tazagroup
```

#### Logs
```bash
# Xem logs tất cả
./logs-hybrid.sh all

# Logs Rausach
./logs-hybrid.sh rausach

# Logs Tazagroup
./logs-hybrid.sh tazagroup
```

#### Trạng thái
```bash
./status-hybrid.sh
```

### Multi-Domain Deployment

```bash
# Khởi động
./start-multi-domain.sh all          # Tất cả
./start-multi-domain.sh rausach      # Chỉ Rausach
./start-multi-domain.sh tazagroup    # Chỉ Tazagroup

# Dừng
./stop-multi-domain.sh all           # Tất cả
./stop-multi-domain.sh rausach       # Chỉ Rausach
./stop-multi-domain.sh tazagroup     # Chỉ Tazagroup
```

---

## 🎯 Cách 2: Sử dụng Docker Compose Trực Tiếp

### Hybrid Deployment

```bash
# Khởi động tất cả
docker compose -f docker-compose.hybrid.yml up -d

# Chỉ Rausach
docker compose -f docker-compose.hybrid.yml up -d \
  redis minio rausach-postgres rausach-backend rausach-frontend

# Chỉ Tazagroup
docker compose -f docker-compose.hybrid.yml up -d \
  redis minio tazagroup-postgres tazagroup-backend tazagroup-frontend

# Dừng tất cả
docker compose -f docker-compose.hybrid.yml down

# Xem logs
docker compose -f docker-compose.hybrid.yml logs -f --tail=100

# Trạng thái
docker compose -f docker-compose.hybrid.yml ps
```

### Multi-Domain Deployment

```bash
# Khởi động tất cả
docker compose -f docker-compose.multi-domain.yml up -d

# Chỉ Rausach
docker compose -f docker-compose.multi-domain.yml up -d \
  postgres redis minio rausach-backend rausach-frontend

# Chỉ Tazagroup
docker compose -f docker-compose.multi-domain.yml up -d \
  postgres redis minio tazagroup-backend tazagroup-frontend

# Dừng tất cả
docker compose -f docker-compose.multi-domain.yml down

# Xem logs
docker compose -f docker-compose.multi-domain.yml logs -f

# Trạng thái
docker compose -f docker-compose.multi-domain.yml ps
```

---

## 🎯 Cách 3: Sử dụng Script Interactive Menu

### Hybrid
```bash
./deploy-hybrid.sh
```

Sau đó chọn số để thực hiện hành động:
- 1: Khởi động tất cả
- 2: Khởi động Rausach
- 3: Khởi động Tazagroup
- 5: Dừng tất cả
- 11: Xem trạng thái
- ... (xem menu để biết thêm)

### Multi-Domain
```bash
./deploy-multi-domain.sh
```

---

## 📊 URLs Truy Cập

### Rausach (12xxx ports)
- Frontend: http://116.118.49.243:12000
- Backend: http://116.118.49.243:12001/graphql
- Database: 116.118.49.243:12003

### Tazagroup (13xxx ports)
- Frontend: http://116.118.49.243:13000
- Backend: http://116.118.49.243:13001/graphql
- Database: 116.118.49.243:13003

### Shared Services
- Minio: http://116.118.49.243:12008
- Redis: 116.118.49.243:12004

---

## 🔧 Các Lệnh Hữu Ích

### Xem resource usage
```bash
docker stats
```

### Xem logs từng service
```bash
# Hybrid
docker compose -f docker-compose.hybrid.yml logs -f rausach-backend
docker compose -f docker-compose.hybrid.yml logs -f tazagroup-frontend

# Multi-Domain
docker compose -f docker-compose.multi-domain.yml logs -f rausach-backend
```

### Restart service
```bash
# Hybrid
docker compose -f docker-compose.hybrid.yml restart rausach-backend

# Multi-Domain
docker compose -f docker-compose.multi-domain.yml restart
```

### Rebuild images
```bash
# Hybrid
docker compose -f docker-compose.hybrid.yml build --no-cache

# Multi-Domain
docker compose -f docker-compose.multi-domain.yml build --no-cache
```

### Dọn dẹp (XÓA volumes!)
```bash
# Hybrid
docker compose -f docker-compose.hybrid.yml down -v

# Multi-Domain
docker compose -f docker-compose.multi-domain.yml down -v
```

---

## 🆘 Troubleshooting

### Lỗi "docker compose command not found"
Nếu server dùng Docker Compose v1:
```bash
# Thay "docker compose" bằng "docker-compose"
docker-compose -f docker-compose.hybrid.yml up -d
```

Scripts đã tự động detect, không cần lo!

### RAM không đủ
```bash
# Tạo swap file 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Container restart liên tục
```bash
# Xem logs để debug
docker compose -f docker-compose.hybrid.yml logs rausach-backend

# Kiểm tra .env files
ls -la .env.*
```

---

## 📚 So Sánh Phương Án

| Tiêu chí | Hybrid | Multi-Domain |
|----------|--------|--------------|
| **RAM** | ~1.8GB | ~1.5GB |
| **Database** | Riêng biệt | Chung (2 DB) |
| **Redis** | Shared | Shared |
| **Minio** | Shared | Shared |
| **Độ ổn định** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Khuyên dùng** | ✅ Production | Testing/Dev |

---

**Lưu ý:** Đã loại bỏ Makefile khỏi project. Sử dụng scripts bash hoặc Docker Compose trực tiếp!
