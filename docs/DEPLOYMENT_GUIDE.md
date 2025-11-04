# Complete Deployment Guide - Low Resource Server
**Server Specs**: 1 Core CPU, 2GB RAM, 20GB Disk

## Table of Contents
1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Server Setup](#server-setup)
3. [Deployment Steps](#deployment-steps)
4. [Post-deployment Verification](#post-deployment-verification)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

---

## Pre-deployment Checklist

### ✅ Local Environment
- [ ] Code committed to git
- [ ] All tests passing
- [ ] Backend built successfully (`cd backend && bun run build`)
- [ ] Frontend built successfully (`cd frontend && bun run build`)
- [ ] Environment variables configured
- [ ] Cleanup completed (`./scripts/cleanup-before-deploy.sh`)

### ✅ Server Requirements
- [ ] Ubuntu/Debian Linux
- [ ] Docker installed (version 24+)
- [ ] Docker Compose installed (version 2.20+)
- [ ] Nginx installed
- [ ] SSL certificates (Let's Encrypt)
- [ ] SSH access configured
- [ ] Firewall configured (ports 80, 443, 22)

### ✅ DNS Configuration
- [ ] `innerbright.vn` → `116.118.48.208`
- [ ] `api.innerbright.vn` → `116.118.48.208`

---

## Server Setup

### 1. Initial Server Configuration

```bash
# Connect to server
ssh root@116.118.48.208

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Install Nginx
apt install nginx -y

# Install Certbot
apt install certbot python3-certbot-nginx -y

# Create project directory
mkdir -p /root/innerv2
```

### 2. Configure Environment Variables

```bash
# On server: Create .env file
cat > /root/innerv2/.env << 'EOF'
NODE_ENV=production
PORT=14001
FRONTEND_PORT=14000
FRONTEND_URL=https://innerbright.vn
API_URL=https://api.innerbright.vn

DATABASE_URL="postgresql://postgres:STRONG_PASSWORD_HERE@116.118.48.208:14003/innerv2core"
POSTGRES_DB=innerv2core
POSTGRES_USER=postgres
POSTGRES_PASSWORD=STRONG_PASSWORD_HERE
POSTGRES_PORT=14003

DOCKER_DATABASE_URL="postgresql://postgres:STRONG_PASSWORD_HERE@postgres:5432/innerv2core"

REDIS_HOST=116.118.48.208
REDIS_PORT=14004
REDIS_PASSWORD=STRONG_PASSWORD_HERE

DOCKER_REDIS_HOST=redis
DOCKER_REDIS_PORT=6379

MINIO_ENDPOINT=116.118.48.208
MINIO_PORT=14007
MINIO_CONSOLE_PORT=14008
MINIO_ACCESS_KEY=innerv2core-admin
MINIO_SECRET_KEY=STRONG_SECRET_HERE
MINIO_BUCKET_NAME=uploads

DOCKER_MINIO_ENDPOINT=minio
DOCKER_MINIO_PORT=9000
DOCKER_MINIO_ACCESS_KEY=innerv2core-admin
DOCKER_MINIO_SECRET_KEY=STRONG_SECRET_HERE

JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://innerbright.vn

NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.innerbright.vn/graphql
NEXT_PUBLIC_API_URL=https://api.innerbright.vn
NEXT_PUBLIC_APP_URL=https://innerbright.vn

NEXT_OTEL_ENABLED=false
NEXT_TELEMETRY_DISABLED=1

PGADMIN_DEFAULT_EMAIL=admin@innerv2core.com
PGADMIN_DEFAULT_PASSWORD=STRONG_PASSWORD_HERE
PGADMIN_PORT=14002
EOF
```

### 3. Configure Nginx

**Frontend (innerbright.vn):**
```bash
cat > /etc/nginx/sites-available/innerbright.vn << 'EOF'
server {
    server_name innerbright.vn;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:14000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_http_version 1.1;
    }

    listen 80;
}
EOF

ln -sf /etc/nginx/sites-available/innerbright.vn /etc/nginx/sites-enabled/
```

**Backend API (api.innerbright.vn):**
```bash
cat > /etc/nginx/sites-available/api.innerbright.vn << 'EOF'
server {
    server_name api.innerbright.vn;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:14001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    listen 80;
}
EOF

ln -sf /etc/nginx/sites-available/api.innerbright.vn /etc/nginx/sites-enabled/
```

**Test and Reload Nginx:**
```bash
nginx -t
systemctl reload nginx
```

### 4. Configure SSL Certificates

```bash
# Frontend SSL
certbot --nginx -d innerbright.vn --non-interactive --agree-tos --email admin@innerbright.vn --redirect

# Backend API SSL
certbot --nginx -d api.innerbright.vn --non-interactive --agree-tos --email admin@innerbright.vn --redirect

# Verify
certbot certificates
```

---

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

**From Local Machine:**

```bash
# 1. Cleanup before deploy
./scripts/cleanup-before-deploy.sh

# 2. Deploy application only (Backend + Frontend)
./scripts/95copy.sh --app

# Expected output:
# - Code synced to server
# - Docker cleanup (free disk space)
# - Backend build (512MB memory limit)
# - Frontend build (256MB memory limit)
# - Containers started with memory limits
# - Deployment completed in ~5-10 minutes
```

### Option 2: Manual Deployment

**Step 1: Sync Code to Server**
```bash
rsync -avz --delete \
  --exclude 'node_modules/.cache' \
  --exclude '.next/cache' \
  --exclude '.git' \
  --exclude 'logs/*.log' \
  ./ root@116.118.48.208:/root/innerv2/
```

**Step 2: On Server - Deploy**
```bash
ssh root@116.118.48.208

cd /root/innerv2

# Deploy application services
docker compose -f docker-compose.yml -f docker-compose.production.yml down
docker image prune -af
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d --build backend frontend

# Check status
docker compose ps
docker stats --no-stream
```

---

## Post-deployment Verification

### 1. Check Container Status

```bash
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose ps"

# Expected:
# ✅ All containers UP
# ✅ Backend (healthy)
# ✅ Frontend (healthy)
# ✅ PostgreSQL (healthy)
# ✅ Redis (healthy)
# ✅ MinIO (healthy)
```

### 2. Check Memory Usage

```bash
ssh root@116.118.48.208 "docker stats --no-stream"

# Expected:
# Backend:  ~350-400MB / 512MB (70-80%)
# Frontend: ~80-100MB / 256MB (30-40%)
# PostgreSQL: ~100-150MB / 256MB
# Redis: ~20-40MB / 128MB
# MinIO: ~30-50MB / 128MB
# Total: ~1600-1800MB / 1900MB (85-95%)
```

### 3. Test API Endpoints

**From Local Machine:**
```bash
./scripts/test-api.sh

# Expected:
# ✅ GraphQL endpoint accessible
# ✅ SSL certificate valid
# ✅ Security headers present
# ✅ DNS resolution correct
```

**Manual Tests:**
```bash
# Test frontend
curl -I https://innerbright.vn

# Test backend GraphQL
curl -X POST https://api.innerbright.vn/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { queryType { name } } }"}'

# Expected response:
# {"data":{"__schema":{"queryType":{"name":"Query"}}}}
```

### 4. Check Logs

```bash
# Backend logs
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose logs backend --tail 50"

# Frontend logs
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose logs frontend --tail 50"

# Check for errors
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose logs --tail 100 | grep -i error"
```

---

## Monitoring & Maintenance

### Daily Monitoring

**1. Memory Check:**
```bash
ssh root@116.118.48.208 "free -h && docker stats --no-stream"
```

**2. Disk Space Check:**
```bash
ssh root@116.118.48.208 "df -h /"
```

**3. Container Health:**
```bash
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose ps"
```

### Weekly Maintenance

**1. Cleanup Docker:**
```bash
ssh root@116.118.48.208 "docker system prune -af --volumes"
```

**2. Update SSL Certificates:**
```bash
ssh root@116.118.48.208 "certbot renew --dry-run"
```

**3. Backup Database:**
```bash
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose exec postgres pg_dump -U postgres innerv2core > backup_$(date +%Y%m%d).sql"
```

### Monthly Tasks

**1. System Updates:**
```bash
ssh root@116.118.48.208 "apt update && apt upgrade -y"
```

**2. Review Logs:**
```bash
ssh root@116.118.48.208 "journalctl -u docker --since '1 month ago' | grep -i error"
```

**3. Performance Review:**
```bash
ssh root@116.118.48.208 "docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}'"
```

---

## Troubleshooting

### Issue: Backend Out of Memory (OOM Killed)

**Symptoms:**
- Backend container keeps restarting
- Logs show "Killed" message
- Memory usage at 100%

**Solution:**
```bash
# Check current memory limit
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose config | grep mem_limit"

# Backend should be 512MB, not 384MB or 256MB
# If not, update docker-compose.production.yml

# Restart backend
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose restart backend"
```

### Issue: Disk Space Full

**Symptoms:**
- "No space left on device" errors
- Build failures
- Container crashes

**Solution:**
```bash
# Check disk usage
ssh root@116.118.48.208 "df -h /"

# Clean Docker
ssh root@116.118.48.208 "docker system prune -af --volumes"

# Remove old logs
ssh root@116.118.48.208 "find /root/innerv2/backend/logs -type f -mtime +7 -delete"

# Remove old backups
ssh root@116.118.48.208 "find /root/innerv2/backups -type d -mtime +30 -exec rm -rf {} +"
```

### Issue: Frontend 404 Errors

**Symptoms:**
- Pages show 404
- Static files not loading
- Blank pages

**Solution:**
```bash
# Check if .next/standalone exists
ssh root@116.118.48.208 "ls -la /root/innerv2/frontend/.next/standalone"

# If missing, redeploy
./scripts/95copy.sh --app

# Or rebuild frontend only
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose -f docker-compose.yml -f docker-compose.production.yml up -d --build frontend"
```

### Issue: Database Connection Failed

**Symptoms:**
- Backend can't connect to PostgreSQL
- "ECONNREFUSED" errors
- "password authentication failed"

**Solution:**
```bash
# Check PostgreSQL status
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose ps postgres"

# Check PostgreSQL logs
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose logs postgres --tail 50"

# Verify connection
ssh root@116.118.48.208 "docker exec innerv2core-postgres psql -U postgres -d innerv2core -c 'SELECT 1;'"

# Restart PostgreSQL
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose restart postgres"
```

### Issue: SSL Certificate Expired

**Symptoms:**
- "Your connection is not private" warning
- SSL certificate expired errors

**Solution:**
```bash
# Check certificates
ssh root@116.118.48.208 "certbot certificates"

# Renew certificates
ssh root@116.118.48.208 "certbot renew --nginx"

# Force renewal
ssh root@116.118.48.208 "certbot renew --force-renewal --nginx"
```

### Issue: High Memory Usage

**Symptoms:**
- Server slow/unresponsive
- OOM killer active
- Containers restarting

**Solution:**
```bash
# Check what's using memory
ssh root@116.118.48.208 "docker stats --no-stream"

# Option 1: Restart heavy services
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose restart backend"

# Option 2: Stop non-essential services
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose stop pgadmin"

# Option 3: Reduce memory for PgAdmin (if needed)
# Edit docker-compose.production.yml: pgadmin mem_limit from 96m to 64m
```

---

## Performance Optimization Tips

### 1. Optimize Database Queries
- Use indexes on frequently queried columns
- Enable query logging to find slow queries
- Use connection pooling

### 2. Enable Redis Caching
- Cache GraphQL queries
- Cache frequently accessed data
- Set appropriate TTL values

### 3. Optimize Frontend
- Enable CDN for static assets
- Compress images
- Use lazy loading

### 4. Monitor Resource Usage
```bash
# Set up monitoring script
cat > /root/monitor.sh << 'EOF'
#!/bin/bash
while true; do
    clear
    echo "=== System Resources ==="
    free -h
    echo ""
    echo "=== Docker Stats ==="
    docker stats --no-stream
    echo ""
    echo "=== Disk Usage ==="
    df -h /
    sleep 5
done
EOF

chmod +x /root/monitor.sh
```

---

## Quick Reference Commands

```bash
# Deploy application only
./scripts/95copy.sh --app

# Deploy with rebuild
./scripts/95copy.sh --build-server

# Quick restart (no rebuild)
./scripts/95copy.sh --quick

# Deploy infrastructure only
./scripts/95copy.sh --infra

# Cleanup before deploy
./scripts/cleanup-before-deploy.sh

# Test API
./scripts/test-api.sh

# Check server status
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose ps"

# View logs
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose logs -f backend"

# Restart service
ssh root@116.118.48.208 "cd /root/innerv2 && docker compose restart backend"

# Clean Docker
ssh root@116.118.48.208 "docker system prune -af"
```

---

## Support & Resources

- **Documentation**: `/docs/API_CONFIGURATION.md`
- **Server**: 116.118.48.208
- **Frontend**: https://innerbright.vn
- **Backend API**: https://api.innerbright.vn/graphql
- **Support Email**: admin@innerbright.vn

---

**Last Updated**: November 4, 2025
**Version**: 2.0
