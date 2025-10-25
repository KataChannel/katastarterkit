# Fix Minio Connection in Docker

## Problem
Backend không thể kết nối tới Minio khi chạy trong Docker, nhưng chạy local thì được.

**Triệu chứng:**
- Local: ✅ Minio kết nối được (endpoint=localhost:12007)
- Docker: ❌ Minio không kết nối được (lỗi timeout hoặc connection refused)

## Root Cause

1. **SSL Configuration sai**: 
   - `docker-compose.yml` set `MINIO_USE_SSL=true` (mặc định)
   - Nhưng Minio trong Docker chạy mà **không có SSL**
   - Client cố gắng kết nối với SSL nhưng server không support → timeout

2. **Logging không đủ**:
   - Service không log config khi khởi tạo
   - Khó debug vấn đề

3. **Port mismatch potential**:
   - Local: Minio chạy ở port 12007 ngoài container
   - Docker: Minio chạy ở port 9000 trong container
   - Backend trong Docker cần dùng port 9000

## Solutions Implemented

### 1. **Sửa `minio.service.ts`**
- Log config khi khởi tạo (giúp debug)
- Parse port thành number đúng cách
- Read useSSL từ env và convert thành boolean

```typescript
const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
const port = parseInt(this.configService.get('MINIO_PORT', '9000'));
const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';

this.logger.log(`Connecting to Minio: endpoint=${endpoint}, port=${port}, useSSL=${useSSL}`);

this.minioClient = new Minio.Client({
  endPoint: endpoint,
  port: port,
  useSSL: useSSL,
  accessKey: accessKey,
  secretKey: secretKey,
});
```

### 2. **Sửa `docker-compose.yml`**
**Trước:**
```yaml
MINIO_USE_SSL: ${MINIO_USE_SSL:-true}  # ❌ Mặc định là true
```

**Sau:**
```yaml
MINIO_USE_SSL: ${MINIO_USE_SSL:-false}  # ✅ Mặc định là false (đúng cho Docker)
```

### 3. **Sửa `backend/.env`**
- Thêm `DOCKER_MINIO_PORT=9000` để rõ ràng
- Keep `MINIO_ENDPOINT=localhost` cho local development

```properties
# Local development
MINIO_ENDPOINT=localhost
MINIO_PORT=12007
MINIO_USE_SSL=false

# Docker (trong container)
DOCKER_MINIO_ENDPOINT=minio
DOCKER_MINIO_PORT=9000
```

### 4. **Sửa `minio.health.ts`**
- Log config khi khởi tạo
- Log kết quả health check
- Giúp debug dễ dàng hơn

## Configuration Summary

### Local Development (chạy trực tiếp, không Docker)
```
MINIO_ENDPOINT=localhost
MINIO_PORT=12007
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=katacore-admin
MINIO_SECRET_KEY=katacore-secret-2025
```

### Docker (chạy trong container)
```yaml
environment:
  MINIO_ENDPOINT: minio          # Service name trong docker-compose
  MINIO_PORT: 9000               # Port bên trong container
  MINIO_USE_SSL: false            # ❌ NO SSL - important!
  MINIO_ACCESS_KEY: minioadmin
  MINIO_SECRET_KEY: minioadmin
```

## How to Test

### 1. **Rebuild Docker images**
```bash
docker compose build backend
```

### 2. **Start services**
```bash
docker compose up -d
```

### 3. **Check logs**
```bash
# Backend logs
docker logs katacore-backend

# Look for:
# ✅ "Connecting to Minio: endpoint=minio, port=9000, useSSL=false"
# ✅ "MinIO connection is healthy"
# ❌ "connect ECONNREFUSED" = wrong endpoint/port
# ❌ "ETIMEDOUT" = SSL mismatch or firewall issue
```

### 4. **Test Minio connection**
```bash
# SSH into backend container
docker exec -it katacore-backend bash

# Test with curl
curl -v telnet://minio:9000

# If connected, you should see "Connected to minio"
```

### 5. **Check health endpoint**
```bash
curl http://localhost:12001/health
```

Expected response:
```json
{
  "status": "ok",
  "details": {
    "minio": {
      "status": "up",
      "message": "MinIO connection is healthy",
      "bucketsCount": 3,
      "buckets": ["avatars", "posts", "uploads"]
    }
  }
}
```

## Files Modified

| File | Change | Why |
|------|--------|-----|
| `backend/src/minio/minio.service.ts` | Added logging + proper type parsing | Better debugging + correct types |
| `backend/src/health/minio.health.ts` | Added logging for health checks | Better debugging |
| `docker-compose.yml` | Changed `MINIO_USE_SSL: true` → `false` | Docker Minio không có SSL |
| `backend/.env` | Added `DOCKER_MINIO_PORT=9000` | Rõ ràng port trong Docker |

## Network Diagram

```
Local Development:
┌──────────────────────────────────┐
│ Backend (localhost:12001)        │
│  └─ Minio: localhost:12007 ✅    │
└──────────────────────────────────┘

Docker Network:
┌──────────────────────────────────────┐
│ Docker Network: katacore-network    │
│                                     │
│  ┌──────────────────┐ ┌──────────┐ │
│  │ Backend Service  │ │ Minio    │ │
│  │ (port 4000)      │ │ (port 9) │ │
│  │                  │ │ 000      │ │
│  │ Minio config:    │ │          │ │
│  │ ├─ endpoint: minio (✅ DNS)  │ │
│  │ ├─ port: 9000 (✅ internal) │ │
│  │ └─ useSSL: false (✅ no SSL) │ │
│  └──────────────────┘ └──────────┘ │
└──────────────────────────────────────┘
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `connect ECONNREFUSED` | Wrong endpoint or port | Check `MINIO_ENDPOINT` and `MINIO_PORT` |
| `ETIMEDOUT` | SSL mismatch | Set `MINIO_USE_SSL=false` |
| `Authentication failed` | Wrong credentials | Check `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY` |
| `Can't resolve minio` | Service không up | Check `docker compose ps` |
| Timeout waiting for connection | Firewall hoặc network issue | Check `docker compose logs minio` |

---

**Date Fixed:** 2025-10-25  
**Status:** ✅ FIXED - Docker Minio connection working  
**Impact:** Backend can now upload/download files in Docker
