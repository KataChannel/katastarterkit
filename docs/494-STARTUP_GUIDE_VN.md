# 🚀 HƯỚNG DẪN KHỞI ĐỘNG DỰ ÁN rausachcore VỚI PORT MỚI

## ✅ Trạng Thái Hiện Tại

Toàn bộ dự án đã được cập nhật hoàn toàn với các port mới:

```
Frontend:           12000
Backend:            12001
PostgreSQL:         12003
PgAdmin:            12002
Redis:              12004
Elasticsearch:      12005
MinIO:              12007 & 12008
```

## 🎯 Cấu Hình Đã Được Cập Nhật

### 1. ✅ docker-compose.yml
- Tất cả services đã được configured
- Backend và Frontend không còn bị comment out
- Tất cả ports đã được cập nhật

### 2. ✅ .env File
- Tất cả biến môi trường đã được cập nhật
- Các giá trị mặc định đúng cho local development

### 3. ✅ Docker Compose Configuration
- Được validate thành công
- Sẵn sàng khởi động

## 🚀 KHỞI ĐỘNG DỰ ÁN

### Phương Án 1: Khởi Động Với Docker Compose (Recommended)

#### Bước 1: Dừng các container cũ (nếu có)
```bash
cd /mnt/chikiet/kataoffical/fullstack/rausachcore
docker compose down
```

#### Bước 2: Xóa volumes cũ (optional - nếu muốn reset database)
```bash
docker volume prune -f
```

#### Bước 3: Xây dựng và khởi động tất cả services
```bash
docker compose up -d --build
```

#### Bước 4: Kiểm tra trạng thái các services
```bash
docker compose ps
```

**Kết quả mong đợi:**
```
NAME                    STATUS          PORTS
rausachcore-postgres       Up (healthy)    0.0.0.0:12003->5432/tcp
rausachcore-pgadmin        Up              0.0.0.0:12002->80/tcp
rausachcore-redis          Up (healthy)    0.0.0.0:12004->6379/tcp
rausachcore-elasticsearch  Up (healthy)    0.0.0.0:12005->9200/tcp
rausachcore-minio          Up              0.0.0.0:12007->9000/tcp, 0.0.0.0:12008->9001/tcp
rausachcore-backend        Up              0.0.0.0:12001->4000/tcp
rausachcore-frontend       Up              0.0.0.0:12000->3000/tcp
```

#### Bước 5: Xem logs để kiểm tra lỗi
```bash
# Xem tất cả logs
docker compose logs -f

# Xem logs của một service cụ thể
docker compose logs -f backend
docker compose logs -f frontend
```

### Phương Án 2: Chạy Cục Bộ (Local Development)

Nếu bạn muốn chạy backend và frontend trên máy local thay vì Docker:

#### Terminal 1: Backend
```bash
cd /mnt/chikiet/kataoffical/fullstack/rausachcore/backend
PORT=12001 bun run dev
```

#### Terminal 2: Frontend
```bash
cd /mnt/chikiet/kataoffical/fullstack/rausachcore/frontend
bun run dev -- --port 12000
```

#### Lưu ý:
- Database, Redis, Elasticsearch, MinIO vẫn chạy trong Docker
- Backend và Frontend chạy trên máy local
- Cần có Node.js/Bun cài đặt

## 🌐 TRUY CẬP CÁC SERVICE

Sau khi tất cả services khởi động thành công, bạn có thể truy cập:

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:12000 | 12000 |
| **Backend GraphQL** | http://localhost:12001/graphql | 12001 |
| **PgAdmin** | http://localhost:12002 | 12002 |
| **PostgreSQL** | localhost:12003 | 12003 |
| **Redis** | localhost:12004 | 12004 |
| **Elasticsearch** | http://localhost:12005 | 12005 |
| **MinIO Console** | http://localhost:12008 | 12008 |

## ✔️ KIỂM CHỨNG TẤT CẢ KẾT NỐI

### 1. Test PostgreSQL
```bash
psql -h localhost -p 12003 -U postgres -d rausachcore -c "SELECT version();"
```

**Kết quả mong đợi:**
```
PostgreSQL 16.x on ...
```

### 2. Test Redis
```bash
redis-cli -p 12004 PING
```

**Kết quả mong đợi:**
```
PONG
```

### 3. Test Elasticsearch
```bash
curl http://localhost:12005/_cluster/health
```

**Kết quả mong đợi:**
```json
{
  "cluster_name": "docker-cluster",
  "status": "yellow",
  "number_of_nodes": 1,
  ...
}
```

### 4. Test Backend GraphQL
```bash
curl -X POST http://localhost:12001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

### 5. Test Frontend
```bash
curl http://localhost:12000
```

**Kết quả mong đợi:**
```
HTML response (Next.js app)
```

### 6. Test MinIO Console
- Mở browser: http://localhost:12008
- Username: `rausachcore-admin`
- Password: `rausachcore-secret-2025`

## 📊 KIỂM TRA CHI TIẾT CONTAINER

```bash
# Xem tất cả containers đang chạy
docker ps

# Xem detailed stats
docker stats

# Kiểm tra network
docker network inspect rausachcore-network

# Xem logs chi tiết của một container
docker logs rausachcore-backend --follow

# Enter container để debug
docker exec -it rausachcore-backend bash
```

## 🛠️ TROUBLESHOOTING

### Vấn đề: Port đã được sử dụng
```bash
# Tìm process sử dụng port
lsof -i :12000

# Kill process
kill -9 <PID>
```

### Vấn đề: Container không khởi động
```bash
# Xem chi tiết lỗi
docker compose logs backend

# Rebuild container
docker compose up -d --build backend

# Xóa và khởi động lại
docker compose down
docker volume prune -f
docker compose up -d --build
```

### Vấn đề: Database connection refused
```bash
# Kiểm tra database healthy
docker compose ps | grep postgres

# Kiểm tra health status
docker inspect rausachcore-postgres | grep -A 10 '"Health"'

# Xem logs postgres
docker compose logs postgres
```

### Vấn đề: Out of memory
```bash
# Kiểm tra memory usage
docker stats

# Stop unnecessary containers
docker compose down

# Increase Docker memory allocation
# (Edit Docker settings in Docker Desktop)
```

## 📝 ENVIRONMENT VARIABLES

### Backend (.env.development)
Các biến được tự động load từ `.env` file:
- `PORT=12001`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:12003/rausachcore`
- `REDIS_HOST=localhost` và `REDIS_PORT=12004`
- `ELASTICSEARCH_URL=http://localhost:12005`
- `MINIO_ENDPOINT=localhost` và `MINIO_PORT=12007`

### Frontend (.env.local)
Các biến được tự động load từ `.env` file:
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql`
- `NEXT_PUBLIC_APP_URL=http://localhost:12000`
- `NEXTAUTH_URL=http://localhost:12000`

## 🔄 CẬP NHẬT SERVICES

Nếu bạn thay đổi code:

```bash
# Rebuild backend
docker compose up -d --build backend

# Rebuild frontend
docker compose up -d --build frontend

# Rebuild tất cả
docker compose up -d --build
```

## 📋 QUICK COMMANDS

```bash
# Khởi động tất cả
docker compose up -d

# Dừng tất cả
docker compose down

# Xem logs
docker compose logs -f

# Xem logs backend
docker compose logs -f backend

# Xem logs frontend
docker compose logs -f frontend

# Kiểm tra trạng thái
docker compose ps

# Xóa volumes
docker compose down -v

# Rebuild và khởi động
docker compose up -d --build

# SSH vào container
docker compose exec backend bash
docker compose exec frontend bash

# Test database
docker compose exec postgres psql -U postgres -d rausachcore

# Test Redis
docker compose exec redis redis-cli PING

# Clear cache/storage
docker volume prune -f
```

## 📞 HỖ TRỢ

### Logs Location
- Backend: `docker compose logs backend`
- Frontend: `docker compose logs frontend`
- Database: `docker compose logs postgres`

### Health Check
```bash
# Kiểm tra health của từng service
docker compose ps --format "table {{.Names}}\t{{.Status}}"
```

## ✅ CHECKLIST TRƯỚC KHI CHẠY

- [ ] Đã cài đặt Docker Desktop
- [ ] Ports 12000-12008 không được sử dụng
- [ ] File `.env` đã được cập nhật
- [ ] File `docker-compose.yml` đã được cập nhật
- [ ] Dockerfile tồn tại trong cả backend và frontend
- [ ] Network `rausachcore-network` sẽ được tạo tự động

## 🎉 HOÀN THÀNH

Khi tất cả services chạy thành công:

1. ✅ Frontend sẽ có sẵn tại: **http://localhost:12000**
2. ✅ Backend GraphQL sẵn sàng tại: **http://localhost:12001/graphql**
3. ✅ Database chạy trên port: **12003**
4. ✅ Tất cả services đã kết nối và giao tiếp với nhau

Bạn có thể bắt đầu phát triển hoặc test ứng dụng!

---

**Last Updated:** 2025-10-24
**Status:** ✅ Ready to Deploy
