# 🔧 Deployment Fix - Infrastructure Configuration

## Vấn đề đã sửa

Sau khi chạy `./deploy-optimized.sh`, backend container bị **unhealthy** vì không kết nối được với database services.

### Root Cause
- Backend cố kết nối đến: `shoppostgres`, `redis`, `minio`
- Nhưng các services này **chưa được deploy** trên server
- Chỉ có old containers (rausach-postgres, rausach-redis, rausach-minio) với ports khác

## Giải pháp

### 1. **Chuẩn hóa cấu hình theo `docker-compose.hybrid.yml`**

Đã cập nhật 2 file để khớp với hybrid.yml:

#### ✅ `docker-compose.infra.yml`
```yaml
services:
  shoppostgres:
    container_name: shoppostgres
    ports: ["12003:5432"]
    networks: [hybrid-network]
  
  redis:
    container_name: shared-redis
    ports: ["12004:6379"]
    networks: [hybrid-network]
  
  minio:
    container_name: shared-minio
    ports: ["12007:9000", "12008:9001"]
    networks: [hybrid-network]

networks:
  hybrid-network:
    name: rausach-network  # ← QUAN TRỌNG!
```

#### ✅ `docker-compose.app.yml`
```yaml
services:
  shopbackend:
    environment:
      DATABASE_URL: postgresql://postgres:postgres@shoppostgres:5432/rausachcore
      REDIS_HOST: redis          # ← Service name, NOT container name
      MINIO_ENDPOINT: minio      # ← Service name, NOT container name
    networks: [hybrid-network]

networks:
  hybrid-network:
    external: true
    name: rausach-network  # ← QUAN TRỌNG!
```

### 2. **Thêm Pre-deployment Check**

Script `deploy-optimized.sh` giờ tự động kiểm tra infrastructure trước khi deploy:

```bash
# Check if rausach-network exists
# Check if shoppostgres, shared-redis, shared-minio are running
```

Nếu thiếu, sẽ hiển thị:
```
❌ INFRASTRUCTURE NOT READY!

Please deploy infrastructure first:
   ./deploy-infrastructure.sh
```

## Quy trình Deploy đúng

### Bước 1: Deploy Infrastructure (Lần đầu)
```bash
./deploy-infrastructure.sh
```
Hoặc: `bun run dev` → Chọn `4`

**Tạo:**
- ✅ shoppostgres (port 12003)
- ✅ shared-redis (port 12004)  
- ✅ shared-minio (port 12007-12008)
- ✅ rausach-network

### Bước 2: Deploy Application
```bash
./deploy-optimized.sh
```
Hoặc: `bun run dev` → Chọn `5`

**Deploy:**
- ✅ shopbackend (port 12001) - Kết nối đến infrastructure
- ✅ shopfrontend (port 12000) - Kết nối đến backend

## Các thay đổi chính

| File | Thay đổi | Lý do |
|------|----------|-------|
| `docker-compose.infra.yml` | Network `hybrid-network` → name `rausach-network` | Khớp với hybrid.yml |
| `docker-compose.app.yml` | `REDIS_HOST: redis` thay vì `shared-redis` | Dùng service name, không phải container name |
| `docker-compose.app.yml` | `MINIO_ENDPOINT: minio` thay vì `shared-minio` | Dùng service name, không phải container name |
| `deploy-optimized.sh` | Thêm infrastructure check | Ngăn deploy app khi thiếu infrastructure |
| `check-infrastructure.sh` | Script mới | Kiểm tra infrastructure độc lập |

## Network Configuration

**Quan trọng:** Docker compose `networks` hoạt động như sau:

```yaml
networks:
  hybrid-network:        # ← Tên trong compose file (service reference)
    name: rausach-network  # ← Tên thực tế của network trong Docker
```

- Trong compose file: Services dùng `hybrid-network`
- Trong Docker: Network có tên `rausach-network`
- Services kết nối với nhau qua **service names**: `redis`, `minio`, `shoppostgres`

## Kiểm tra trạng thái

### Check Infrastructure
```bash
./check-infrastructure.sh
```

### Check Full Deployment
```bash
./check-deployment-status.sh
```

### Manual Check
```bash
ssh root@116.118.49.243 "docker ps | grep -E 'shoppostgres|shared-redis|shared-minio'"
```

## Troubleshooting

### Backend vẫn unhealthy?
```bash
# 1. Check logs
ssh root@116.118.49.243 "docker logs shopbackend --tail 50"

# 2. Check network
ssh root@116.118.49.243 "docker network inspect rausach-network"

# 3. Restart backend
ssh root@116.118.49.243 "docker restart shopbackend"
```

### Services không connect được?
```bash
# Verify service names trong network
ssh root@116.118.49.243 "docker network inspect rausach-network | grep -A 5 Containers"
```

Các container phải có service names:
- `redis` → shared-redis container
- `minio` → shared-minio container  
- `shoppostgres` → shoppostgres container

## Next Steps

1. ✅ Deploy infrastructure: `./deploy-infrastructure.sh`
2. ✅ Wait for health checks to pass (30-60s)
3. ✅ Deploy application: `./deploy-optimized.sh`
4. ✅ Verify: `./check-deployment-status.sh`
5. ✅ Test: https://shop.rausachtrangia.com

---
**Updated:** 26/11/2025  
**Status:** ✅ Configuration Fixed
