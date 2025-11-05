# 📋 Tóm Tắt Cấu Hình Deploy Production - Server 1 Core 2GB RAM

## ✅ Đã Hoàn Thành

### 1. Docker Compose Tối Ưu (`docker-compose.prod.yml`)
- **Tổng memory allocation**: ~1.5GB / 2GB
- **Services enabled**:
  - PostgreSQL: 256MB (limit) / 128MB (reserved)
  - Redis: 128MB (limit) / 64MB (reserved)  
  - Minio: 256MB (limit) / 128MB (reserved)
  - Backend: 512MB (limit) / 256MB (reserved)
  - Frontend: 384MB (limit) / 192MB (reserved)

- **Services disabled**:
  - ❌ Elasticsearch (quá nặng ~512MB)
  - ❌ pgAdmin (không cần production)
  - ❌ GraphQL Playground (security)

### 2. Production Dockerfiles
- `backend/Dockerfile.prod`: Multi-stage build, minified
- `frontend/Dockerfile.prod`: Standalone output, optimized

### 3. PostgreSQL Optimization
- Max connections: 30 (từ 100)
- Shared buffers: 64MB (từ 128MB)
- Work mem: 4MB (từ 8MB)
- Effective cache size: 128MB (từ 4GB)

### 4. Redis Optimization
- Max memory: 100MB
- Eviction policy: allkeys-lru
- AOF disabled (chỉ dùng RDB snapshots)

### 5. Node.js Optimization
- Backend: `--max-old-space-size=384`
- Frontend: `--max-old-space-size=256`

### 6. Scripts
- `deploy-low-memory.sh`: Auto deploy with health checks
- `monitor.sh`: Real-time system monitoring
- `QUICK_START.sh`: One-command deploy

### 7. Health Checks
- Backend: `/health` endpoint
- Frontend: `/api/health` endpoint
- All containers: Docker healthcheck configured

### 8. Documentation
- `DEPLOYMENT_LOW_MEMORY.md`: Complete deployment guide
- Troubleshooting steps
- Maintenance procedures

## 🚀 Cách Deploy

### Option 1: Quick Start (Khuyến nghị)
```bash
./QUICK_START.sh
```

### Option 2: Full Control
```bash
./deploy-low-memory.sh
```

### Option 3: Manual
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📊 Resource Usage Dự Kiến

| Component | Memory | CPU | Notes |
|-----------|--------|-----|-------|
| PostgreSQL | 256MB | 0.3 | Optimized for small data |
| Redis | 128MB | 0.1 | LRU eviction enabled |
| Minio | 256MB | 0.2 | Object storage |
| Backend | 512MB | 0.5 | NestJS + GraphQL |
| Frontend | 384MB | 0.4 | Next.js standalone |
| **Total** | **~1.5GB** | **1.0** | System có 2GB RAM |

## 🔧 Monitoring

### Real-time Dashboard
```bash
./monitor.sh
```

Hiển thị:
- CPU, Memory, Disk usage
- Container status
- Endpoint health (Backend, Frontend, GraphQL)
- Docker stats

### Manual Checks
```bash
# System resources
free -h
df -h

# Docker stats
docker stats

# Container logs
docker compose -f docker-compose.prod.yml logs -f
docker logs -f innerv2-backend
```

## ⚠️ Lưu Ý Quan Trọng

### 1. Sequential Startup
**PHẢI** start services theo thứ tự:
1. PostgreSQL (đợi 10s)
2. Redis (đợi 5s)
3. Minio (đợi 5s)
4. Backend (đợi 20s)
5. Frontend

Script `deploy-low-memory.sh` đã tự động làm điều này.

### 2. Memory Management
- Không bao giờ vượt quá limits đã set
- Monitor thường xuyên với `./monitor.sh`
- Nếu OOM, giảm limits hoặc disable services không cần thiết

### 3. Database Backups
```bash
# Auto backup (trong deploy script)
mkdir -p backups
docker exec innerv2-postgres pg_dump -U postgres tazagroupcore > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### 4. Security
**Trước khi deploy production:**
- [ ] Đổi `JWT_SECRET` trong `.env.production`
- [ ] Đổi `NEXTAUTH_SECRET`
- [ ] Đổi `POSTGRES_PASSWORD`
- [ ] Đổi `MINIO_ACCESS_KEY` và `MINIO_SECRET_KEY`
- [ ] **Revoke Google OAuth credentials cũ**
- [ ] Tạo OAuth credentials mới

## �� Endpoints

| Service | URL | Internal Port | External Port |
|---------|-----|---------------|---------------|
| Frontend | http://116.118.48.208:14000 | 3000 | 14000 |
| Backend | http://116.118.48.208:14001 | 4000 | 14001 |
| GraphQL | http://116.118.48.208:14001/graphql | 4000 | 14001 |
| Minio Console | http://116.118.48.208:14008 | 9001 | 14008 |
| PostgreSQL | localhost:14003 | 5432 | 14003 |
| Redis | localhost:14004 | 6379 | 14004 |

## 🐛 Troubleshooting Common Issues

### Backend Crash (OOM)
```bash
# Check memory
docker stats innerv2-backend

# Reduce max-old-space-size
# Edit docker-compose.prod.yml line: NODE_OPTIONS: "--max-old-space-size=256"
docker compose -f docker-compose.prod.yml up -d backend
```

### Database Connection Failed
```bash
# Check PostgreSQL
docker exec innerv2-postgres pg_isready -U postgres

# Restart
docker compose -f docker-compose.prod.yml restart postgres
sleep 10
docker compose -f docker-compose.prod.yml restart backend
```

### Frontend 502 Error
```bash
# Check backend is running
curl http://localhost:14001/health

# Check frontend logs
docker logs innerv2-frontend

# Restart
docker compose -f docker-compose.prod.yml restart frontend
```

## 📈 Next Steps

1. **Deploy lên server 116.118.48.208**
   ```bash
   # Trên server
   cd /chikiet/Innerbright/innerv2
   git pull origin innerv2_dev1
   ./deploy-low-memory.sh
   ```

2. **Setup monitoring**
   ```bash
   # Terminal 1: Deploy
   ./deploy-low-memory.sh
   
   # Terminal 2: Monitor
   ./monitor.sh
   ```

3. **Setup domain & SSL** (Optional)
   - Cấu hình domain trỏ về 116.118.48.208
   - Setup Nginx reverse proxy
   - Cài Let's Encrypt SSL certificate

4. **Production checklist**
   - [ ] Backup database schedule (cron job)
   - [ ] Log rotation
   - [ ] Firewall rules
   - [ ] SSL certificates
   - [ ] Revoke old OAuth credentials

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `docker compose -f docker-compose.prod.yml logs -f`
2. Check monitoring: `./monitor.sh`
3. Check disk space: `df -h`
4. Check memory: `free -h`
5. Refer to: `DEPLOYMENT_LOW_MEMORY.md`

---

**Created**: $(date +'%Y-%m-%d')
**Server**: 116.118.48.208 (1 Core, 2GB RAM, 10GB Disk)
**Status**: ✅ Ready for deployment
