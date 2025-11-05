# Hướng Dẫn Deploy Lên Server 1 Core, 2GB RAM

## 📊 Cấu hình Server
- **IP**: 116.118.48.208
- **CPU**: 1 Core
- **RAM**: 2GB
- **Disk**: 10GB
- **OS**: Linux

## 🎯 Tối Ưu Hóa

### Memory Allocation (Tổng: ~1.5GB / 2GB)
```
PostgreSQL:  256MB (limit) / 128MB (reserved)
Redis:       128MB (limit) / 64MB (reserved)
Minio:       256MB (limit) / 128MB (reserved)
Backend:     512MB (limit) / 256MB (reserved)
Frontend:    384MB (limit) / 192MB (reserved)
System:      ~500MB (cho OS và buffer)
```

### Services Disabled
- ❌ Elasticsearch (quá nặng ~512MB)
- ❌ pgAdmin (không cần thiết production)
- ❌ GraphQL Playground (security)

### Optimizations Applied
- ✅ PostgreSQL: Giảm connections (30), shared_buffers (64MB)
- ✅ Redis: LRU eviction, maxmemory 100MB
- ✅ Node.js: --max-old-space-size giảm (256-384MB)
- ✅ Sequential startup (tránh memory spike)
- ✅ Docker resource limits
- ✅ Production builds (minified, tree-shaken)

## 🚀 Deploy Steps

### 1. Chuẩn Bị
```bash
cd /chikiet/Innerbright/innerv2

# Kiểm tra file tồn tại
ls -la docker-compose.prod.yml
ls -la .env.production
ls -la deploy-low-memory.sh
```

### 2. Cấu Hình Environment
```bash
# Chỉnh sửa .env.production nếu cần
nano .env.production

# Quan trọng: Đổi JWT_SECRET và NEXTAUTH_SECRET!
# Tạo secret mới:
openssl rand -base64 32
```

### 3. Deploy
```bash
# Option A: Dùng script tự động (khuyến nghị)
./deploy-low-memory.sh

# Option B: Manual
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d postgres redis minio
sleep 15
docker compose -f docker-compose.prod.yml up -d backend
sleep 20
docker compose -f docker-compose.prod.yml up -d frontend
```

### 4. Run Migrations
```bash
# Sau khi backend khởi động (~30s)
docker exec innerv2-backend bunx prisma migrate deploy
```

### 5. Verify
```bash
# Check containers
docker ps

# Check health
curl http://localhost:14001/health
curl http://localhost:14000/api/health

# Check logs
docker compose -f docker-compose.prod.yml logs -f
```

## 📡 Endpoints

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://116.118.48.208:14000 | 14000 |
| Backend API | http://116.118.48.208:14001 | 14001 |
| GraphQL | http://116.118.48.208:14001/graphql | 14001 |
| Minio Console | http://116.118.48.208:14008 | 14008 |

## 🔍 Monitoring

### Real-time Monitor
```bash
./monitor.sh
# Hiển thị: CPU, Memory, Disk, Container status, Health checks
```

### Docker Stats
```bash
docker stats
```

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker logs -f innerv2-backend
docker logs -f innerv2-frontend
```

### Memory Check
```bash
free -h
docker stats --no-stream
```

## 🛠️ Troubleshooting

### Out of Memory (OOM)
```bash
# Check memory
free -h

# Clear system cache
sudo sync
echo 3 | sudo tee /proc/sys/vm/drop_caches

# Restart services sequentially
docker compose -f docker-compose.prod.yml restart postgres
sleep 10
docker compose -f docker-compose.prod.yml restart backend
sleep 10
docker compose -f docker-compose.prod.yml restart frontend
```

### Container Không Start
```bash
# Check logs
docker logs innerv2-backend

# Check resources
docker inspect innerv2-backend | grep -A 20 "Resources"

# Force recreate
docker compose -f docker-compose.prod.yml up -d --force-recreate backend
```

### Database Connection Error
```bash
# Check PostgreSQL
docker exec innerv2-postgres pg_isready -U postgres

# Check connection from backend
docker exec innerv2-backend sh -c 'nc -zv postgres 5432'

# Restart PostgreSQL
docker compose -f docker-compose.prod.yml restart postgres
sleep 10
docker compose -f docker-compose.prod.yml restart backend
```

### Backend Crash
```bash
# Check logs
docker logs --tail 100 innerv2-backend

# Common causes:
# 1. Database not ready → wait 15s after postgres start
# 2. OOM → reduce max-old-space-size in docker-compose.prod.yml
# 3. Migration failed → run manually: docker exec innerv2-backend bunx prisma migrate deploy
```

## 🔧 Maintenance

### Backup Database
```bash
# Auto backup in deploy script
# Manual backup:
mkdir -p backups
docker exec innerv2-postgres pg_dump -U postgres tazagroupcore > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# Stop backend first
docker compose -f docker-compose.prod.yml stop backend

# Restore
cat backups/backup_YYYYMMDD_HHMMSS.sql | docker exec -i innerv2-postgres psql -U postgres -d tazagroupcore

# Restart backend
docker compose -f docker-compose.prod.yml start backend
```

### Update Code
```bash
# Pull latest code
git pull origin innerv2_dev1

# Rebuild and redeploy
./deploy-low-memory.sh
```

### Clean Up Disk Space
```bash
# Remove old images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove all stopped containers
docker container prune -f
```

## ⚠️ Important Notes

1. **Memory Management**: Server có 2GB RAM, tuyệt đối không được vượt quá limits
2. **Sequential Startup**: Luôn start services từng cái một (postgres → redis → minio → backend → frontend)
3. **Health Checks**: Đợi health check passed trước khi start service tiếp theo
4. **Backups**: Backup database trước mỗi lần deploy
5. **Monitoring**: Chạy `./monitor.sh` để theo dõi resources liên tục
6. **Production Secrets**: Đổi JWT_SECRET và NEXTAUTH_SECRET trong .env.production

## 📈 Performance Tips

1. **Giảm max_connections trong PostgreSQL** nếu backend không cần nhiều connections
2. **Tăng Redis maxmemory** nếu có cache miss cao (nhưng không quá 256MB)
3. **Disable source maps** trong production builds
4. **Enable compression** trong Nginx reverse proxy nếu có
5. **Use CDN** cho static assets nếu có budget

## 🔐 Security Checklist

- [ ] Đổi POSTGRES_PASSWORD trong .env.production
- [ ] Đổi JWT_SECRET
- [ ] Đổi NEXTAUTH_SECRET
- [ ] Đổi MINIO_ACCESS_KEY và MINIO_SECRET_KEY
- [ ] Disable GraphQL Playground (GRAPHQL_PLAYGROUND=false)
- [ ] Disable GraphQL Introspection (GRAPHQL_INTROSPECTION=false)
- [ ] **Revoke Google OAuth credentials cũ (897974685698-...)**
- [ ] Tạo OAuth credentials mới
- [ ] Setup firewall rules (chỉ allow ports 14000, 14001)
- [ ] Setup SSL/TLS certificates (Let's Encrypt)

## 🎓 Additional Resources

- [Docker Memory Limits](https://docs.docker.com/config/containers/resource_constraints/)
- [PostgreSQL Memory Tuning](https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server)
- [Redis Memory Optimization](https://redis.io/docs/management/optimization/memory-optimization/)
- [Next.js Production Checklist](https://nextjs.org/docs/deployment)
- [NestJS Production Best Practices](https://docs.nestjs.com/faq/http-adapter#production)
