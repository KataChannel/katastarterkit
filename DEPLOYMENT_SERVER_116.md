# 🚀 DEPLOYMENT TO SERVER 116.118.48.208

## 📊 SERVER INFO

- **IP:** 116.118.48.208
- **CPU:** 1 Core
- **RAM:** 2GB
- **Disk:** 10GB SSD

## 🔌 PORTS CONFIGURATION

| Service | Port | URL |
|---------|------|-----|
| Frontend | 14000 | http://116.118.48.208:14000 |
| Backend | 14001 | http://116.118.48.208:14001 |
| GraphQL | 14001 | http://116.118.48.208:14001/graphql |
| PostgreSQL | 14003 | Internal only |
| Redis | 14004 | Internal only |
| Minio API | 14007 | http://116.118.48.208:14007 |
| Minio Console | 14008 | http://116.118.48.208:14008 |
| PgAdmin | 14002 | http://116.118.48.208:14002 (optional) |

## 🚀 QUICK DEPLOY

```bash
# Deploy one command
./deploy-to-server.sh
```

Script tự động:
1. ✅ Check resources
2. ✅ Setup swap (2GB)
3. ✅ Build backend & frontend locally
4. ✅ Cleanup Docker
5. ✅ Deploy với Docker Compose
6. ✅ Show status

## 📝 MANUAL DEPLOY

### Bước 1: Build Local

```bash
# Backend
cd backend
bun install --frozen-lockfile
bun run build
rm -rf node_modules
bun install --production --frozen-lockfile
cd ..

# Frontend
cd frontend
bun install --frozen-lockfile
bun run build
cd ..
```

### Bước 2: Deploy

```bash
# Stop old containers
docker compose -f docker-compose.production.yml down

# Deploy
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build

# Check status
docker compose -f docker-compose.production.yml ps
```

## 🔍 MONITORING

```bash
# View all containers
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f

# View specific service logs
docker compose -f docker-compose.production.yml logs -f backend

# Resource usage
docker stats --no-stream

# Quick monitor
./monitor.sh
```

## 🧪 TESTING

```bash
# Test Backend Health
curl http://116.118.48.208:14001/health

# Test Frontend
curl http://116.118.48.208:14000

# Test GraphQL
curl -X POST http://116.118.48.208:14001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__typename}"}'

# Test Database
docker exec innerv2core-postgres pg_isready -U postgres

# Test Redis
docker exec innerv2core-redis redis-cli -a 123456 ping
```

## 🔧 MANAGEMENT

### Start/Stop Services

```bash
# Stop all
docker compose -f docker-compose.production.yml down

# Start all
docker compose -f docker-compose.production.yml up -d

# Restart specific service
docker compose -f docker-compose.production.yml restart backend

# Rebuild specific service
docker compose -f docker-compose.production.yml up -d --build --force-recreate backend
```

### Database Management

```bash
# Backup
docker exec innerv2core-postgres pg_dump -U postgres innerv2core > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i innerv2core-postgres psql -U postgres innerv2core < backup.sql

# Access psql
docker exec -it innerv2core-postgres psql -U postgres -d innerv2core

# Vacuum
docker exec innerv2core-postgres vacuumdb -U postgres -d innerv2core --analyze
```

### Redis Management

```bash
# Access CLI
docker exec -it innerv2core-redis redis-cli -a 123456

# Check memory
docker exec innerv2core-redis redis-cli -a 123456 INFO memory

# Clear cache
docker exec innerv2core-redis redis-cli -a 123456 FLUSHALL
```

## 📊 RESOURCE ALLOCATION

```yaml
PostgreSQL:  512MB  (256-512MB)
Redis:       192MB  (128-192MB)
Minio:       256MB  (128-256MB)
Backend:     640MB  (384-640MB)
Frontend:    512MB  (256-512MB)
System:      ~200MB
────────────────────────────────
Total:       ~2.1GB / 2GB RAM
```

## ⚠️ TROUBLESHOOTING

### Container Won't Start

```bash
# Check logs
docker logs innerv2core-backend --tail=100
docker logs innerv2core-frontend --tail=100

# Check resources
free -h
df -h

# Restart
docker compose -f docker-compose.production.yml restart [service]
```

### Out of Memory

```bash
# Check swap
free -h

# Increase swap
sudo fallocate -l 4G /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Restart containers
docker compose -f docker-compose.production.yml restart
```

### Port Already in Use

```bash
# Check what's using port
sudo netstat -tulpn | grep :14000
sudo netstat -tulpn | grep :14001

# Kill process
sudo kill -9 <PID>

# Or change port in .env.production
```

### Disk Full

```bash
# Cleanup Docker
docker system prune -a -f

# Remove old logs
find /var/lib/docker/containers -name "*.log" -exec truncate -s 0 {} \;

# Check disk usage
du -sh /var/lib/docker/*
```

## 🔄 UPDATE PROCESS

```bash
# 1. Pull latest code
git pull

# 2. Backup database
docker exec innerv2core-postgres pg_dump -U postgres innerv2core > backup_pre_update.sql

# 3. Redeploy
./deploy-to-server.sh

# 4. Verify
curl http://116.118.48.208:14001/health
```

## 🔒 SECURITY

### Important
- ✅ Firewall configured for ports 14000-14008
- ✅ PostgreSQL only accessible from localhost
- ✅ Redis password protected
- ✅ Minio credentials secured
- ⚠️ Setup SSL/TLS for production (use Nginx reverse proxy)

### Recommended
```bash
# Setup UFW firewall
sudo ufw allow 14000/tcp  # Frontend
sudo ufw allow 14001/tcp  # Backend
sudo ufw allow 14007/tcp  # Minio
sudo ufw allow 14008/tcp  # Minio Console
sudo ufw enable

# Or use iptables
sudo iptables -A INPUT -p tcp --dport 14000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 14001 -j ACCEPT
```

## 📚 FILES

- **docker-compose.production.yml** - Production Docker Compose
- **.env.production** - Environment variables
- **deploy-to-server.sh** - Automated deployment script
- **backend/Dockerfile.production** - Backend image
- **frontend/Dockerfile.production** - Frontend image

## 🆘 SUPPORT COMMANDS

```bash
# Quick status
docker compose -f docker-compose.production.yml ps

# Quick logs
docker compose -f docker-compose.production.yml logs --tail=50

# Quick restart all
docker compose -f docker-compose.production.yml restart

# Emergency stop
docker compose -f docker-compose.production.yml down

# Emergency redeploy
./deploy-to-server.sh
```

---

**Server:** 116.118.48.208  
**Last Updated:** 2025-01-04  
**Status:** ✅ Production Ready
