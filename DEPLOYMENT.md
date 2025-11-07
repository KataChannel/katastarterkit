# InnerV2 Core - Infrastructure Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- SSH access to server (116.118.48.208)
- SSH key configured for passwordless access
- `.env` file configured in project root

### Option 1: Full Auto Deployment (Recommended)

Deploy infrastructure and configure frontend in one command:

```bash
# Make script executable
chmod +x deploy-all.sh

# Deploy everything
./deploy-all.sh
```

This will:
1. ✅ Deploy PostgreSQL, Redis, MinIO to server
2. ✅ Update frontend `.env` with server connections
3. ✅ Push Prisma schema to database
4. ✅ Generate Prisma Client

### Option 2: Manual Step-by-Step

#### Step 1: Deploy Infrastructure Only

```bash
# Deploy PostgreSQL, Redis, MinIO to server
chmod +x deploy-infrastructure.sh
./deploy-infrastructure.sh
```

#### Step 2: Update Frontend Configuration

```bash
# Update frontend/.env to use remote server
chmod +x update-frontend-env.sh
./update-frontend-env.sh 116.118.48.208
```

#### Step 3: Sync Database Schema

```bash
cd frontend
bunx prisma db push
bunx prisma generate
cd ..
```

#### Step 4: Start Frontend

```bash
cd frontend
bun run dev
```

## 📦 Infrastructure Components

### Deployed to Server (116.118.48.208)

| Service | Port | Access | Credentials |
|---------|------|--------|-------------|
| **PostgreSQL** | 14003 | `116.118.48.208:14003` | postgres/postgres |
| **pgAdmin** | 14002 | http://116.118.48.208:14002 | admin@innerv2core.com/admin123 |
| **Redis** | 14004 | `116.118.48.208:14004` | Password: 123456 |
| **MinIO API** | 14007 | http://116.118.48.208:14007 | innerv2core-admin/innerv2core-secret-2025 |
| **MinIO Console** | 14008 | http://116.118.48.208:14008 | innerv2core-admin/innerv2core-secret-2025 |

### Running Locally

| Service | Port | Access |
|---------|------|--------|
| **Frontend** | 14000 | http://localhost:14000 |

## 🔧 Management Commands

### Check Infrastructure Status

```bash
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose ps'
```

### View Logs

```bash
# All services
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose logs -f'

# Specific service
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose logs -f postgres'
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose logs -f redis'
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose logs -f minio'
```

### Restart Services

```bash
# Restart all services
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose restart'

# Restart specific service
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose restart postgres'
```

### Stop Infrastructure

```bash
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose down'
```

### Start Infrastructure

```bash
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose up -d'
```

## 🗄️ Database Management

### Access Database via psql

```bash
# From local machine
psql "postgresql://postgres:postgres@116.118.48.208:14003/innerv2core"

# Via Docker on server
ssh root@116.118.48.208 'docker exec -it innerv2core-postgres psql -U postgres -d innerv2core'
```

### Backup Database

```bash
# Create backup
ssh root@116.118.48.208 'docker exec innerv2core-postgres pg_dump -U postgres innerv2core > /tmp/backup.sql'

# Download backup
scp root@116.118.48.208:/tmp/backup.sql ./backups/backup-$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Upload backup to server
scp ./backups/backup.sql root@116.118.48.208:/tmp/

# Restore
ssh root@116.118.48.208 'docker exec -i innerv2core-postgres psql -U postgres innerv2core < /tmp/backup.sql'
```

## 🗂️ MinIO (File Storage)

### Access MinIO Console

1. Navigate to http://116.118.48.208:14008
2. Login with credentials:
   - Username: `innerv2core-admin`
   - Password: `innerv2core-secret-2025`

### Create Initial Bucket

```bash
# Access MinIO container
ssh root@116.118.48.208 'docker exec -it innerv2core-minio sh'

# Inside container, install mc client
mc alias set myminio http://localhost:9000 innerv2core-admin innerv2core-secret-2025

# Create bucket
mc mb myminio/uploads

# Set bucket policy to public-read
mc anonymous set download myminio/uploads

# Exit
exit
```

## 🔴 Redis Management

### Connect to Redis

```bash
# Via redis-cli from local machine (if installed)
redis-cli -h 116.118.48.208 -p 14004 -a 123456

# Via Docker on server
ssh root@116.118.48.208 'docker exec -it innerv2core-redis redis-cli -a 123456'
```

### Common Redis Commands

```redis
# Check connection
PING

# Get all keys
KEYS *

# Flush all data (DANGEROUS!)
FLUSHALL

# Get info
INFO

# Monitor real-time commands
MONITOR
```

## 🔥 Firewall Configuration

If services are not accessible from external network, configure firewall on server:

```bash
# SSH to server
ssh root@116.118.48.208

# Allow required ports
ufw allow 14002/tcp comment 'pgAdmin'
ufw allow 14003/tcp comment 'PostgreSQL'
ufw allow 14004/tcp comment 'Redis'
ufw allow 14007/tcp comment 'MinIO API'
ufw allow 14008/tcp comment 'MinIO Console'

# Reload firewall
ufw reload

# Check status
ufw status
```

## 📊 Monitoring

### Check Resource Usage

```bash
ssh root@116.118.48.208 'docker stats'
```

### Check Disk Usage

```bash
ssh root@116.118.48.208 'df -h'
ssh root@116.118.48.208 'docker system df'
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose logs <service-name>'

# Check container status
ssh root@116.118.48.208 'docker ps -a'

# Recreate container
ssh root@116.118.48.208 'cd /opt/innerv2 && docker-compose up -d --force-recreate <service-name>'
```

### Connection Refused

1. Check if container is running: `docker ps`
2. Check if port is exposed: `docker port <container-name>`
3. Check firewall rules: `ufw status`
4. Check if service is listening: `netstat -tulpn | grep <port>`

### Database Migration Issues

```bash
# Reset database (DANGEROUS - deletes all data!)
cd frontend
bunx prisma migrate reset --force

# Push schema without migration
bunx prisma db push --force-reset
```

## 📝 Environment Variables

### Frontend .env (Auto-configured by scripts)

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@116.118.48.208:14003/innerv2core"

# Redis
REDIS_HOST=116.118.48.208
REDIS_PORT=14004
REDIS_PASSWORD=123456
ENABLE_REDIS=true

# MinIO
MINIO_ENDPOINT=116.118.48.208
MINIO_PORT=14007
MINIO_ACCESS_KEY=innerv2core-admin
MINIO_SECRET_KEY=innerv2core-secret-2025
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=uploads
```

## 🔒 Security Best Practices

1. **Change Default Passwords** in `.env` before deployment
2. **Use SSL/TLS** for production (configure reverse proxy)
3. **Restrict Database Access** to specific IPs
4. **Enable Redis Authentication** (already configured with password)
5. **Regular Backups** of database and MinIO data
6. **Monitor Logs** for suspicious activity

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify services are healthy: `docker-compose ps`
3. Review this documentation
4. Contact development team
