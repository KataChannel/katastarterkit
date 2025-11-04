# ⚡ QUICK REFERENCE - DEPLOYMENT COMMANDS

## 🚀 DEPLOYMENT

### First Time Setup
```bash
# 1. Setup environment
cp .env.production.template .env.production
nano .env.production

# 2. Check system
./pre-deploy-check.sh

# 3. Deploy
./deploy-optimized.sh
```

### Update/Redeploy
```bash
git pull
./cleanup-production.sh
./deploy-optimized.sh
```

## 📊 MONITORING

```bash
# Quick status
./monitor.sh

# Resource usage
docker stats --no-stream

# Container status
docker compose -f docker-compose.production.yml ps

# Logs
docker compose -f docker-compose.production.yml logs -f [service]
```

## 🔧 MAINTENANCE

### Daily
```bash
./monitor.sh
```

### Weekly
```bash
./cleanup-production.sh
docker system prune -f
```

### Monthly
```bash
# Backup
docker exec rausachcore-postgres pg_dump -U postgres rausachcore > backup_$(date +%Y%m%d).sql

# Vacuum
docker exec rausachcore-postgres vacuumdb -U postgres -d rausachcore --analyze
```

## ⚠️ EMERGENCY

### Out of Memory
```bash
sudo fallocate -l 4G /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
docker compose -f docker-compose.production.yml restart
```

### Disk Full
```bash
docker system prune -a -f
find /var/lib/docker/containers -name "*.log" -exec truncate -s 0 {} \;
```

### Services Down
```bash
docker compose -f docker-compose.production.yml restart [service]
# or full restart:
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d
```

## 🔍 HEALTH CHECKS

```bash
# Backend
curl http://localhost:4000/health

# Frontend
curl http://localhost:3000/api/health

# GraphQL
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__typename}"}'

# PostgreSQL
docker exec rausachcore-postgres pg_isready -U postgres

# Redis
docker exec rausachcore-redis redis-cli ping
```

## 📝 USEFUL COMMANDS

```bash
# View logs
docker logs rausachcore-backend --tail=100 -f
docker logs rausachcore-frontend --tail=100 -f

# Execute in container
docker exec -it rausachcore-backend bash
docker exec -it rausachcore-postgres psql -U postgres

# Restart specific service
docker compose -f docker-compose.production.yml restart backend

# Rebuild service
docker compose -f docker-compose.production.yml up -d --build --force-recreate backend

# Stop all
docker compose -f docker-compose.production.yml down

# Start all
docker compose -f docker-compose.production.yml up -d
```

## 📊 RESOURCE ALLOCATION

```
PostgreSQL:  512MB (256-512MB)
Redis:       192MB (128-192MB)
Minio:       256MB (128-256MB)
Backend:     640MB (384-640MB)
Frontend:    512MB (256-512MB)
System:      ~200MB
-----------------------------------
Total:       ~2.1GB / 2GB RAM
```

## 📁 KEY FILES

```
deploy-optimized.sh              # Main deployment
pre-deploy-check.sh             # Pre-flight checks
cleanup-production.sh           # Cleanup & optimize
monitor.sh                      # Resource monitoring
.env.production                 # Environment config
docker-compose.production.yml   # Production compose
DEPLOYMENT_GUIDE.md            # Full documentation
```

## 🆘 TROUBLESHOOTING

| Problem | Quick Fix |
|---------|-----------|
| OOM Crash | `sudo swapon -a && docker compose -f docker-compose.production.yml restart` |
| Disk Full | `docker system prune -a -f` |
| Slow Query | `docker exec rausachcore-postgres vacuumdb -U postgres -d rausachcore` |
| Container Down | `docker compose -f docker-compose.production.yml restart [service]` |
| Build Failed | `./cleanup-production.sh && ./deploy-optimized.sh` |

## 🔒 SECURITY

- [ ] Change all default passwords
- [ ] JWT_SECRET >= 32 chars
- [ ] NEXTAUTH_SECRET >= 32 chars
- [ ] Strong DB password
- [ ] Firewall configured
- [ ] SSL/TLS enabled

---

**Quick Help:** `cat QUICK_REFERENCE.md | grep -A 3 "keyword"`
