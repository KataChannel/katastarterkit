# Deployment Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Deployment Architecture](#deployment-architecture)
3. [Docker & Docker Compose](#docker--docker-compose)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Recovery](#backup--recovery)
9. [Scaling](#scaling)
10. [Troubleshooting](#troubleshooting)

## Overview

The application is deployed using Docker and Docker Compose for local/staging environments, with support for Kubernetes for production scaling.

### Stack Components
- **Frontend**: Next.js application (Node.js)
- **Backend**: NestJS application (Node.js)
- **Database**: PostgreSQL 16
- **Cache**: Redis
- **File Storage**: MinIO (S3-compatible)
- **Reverse Proxy**: Nginx (optional)

### Deployment Environments
- **Local**: Docker Compose on developer machine
- **Staging**: Docker Compose on staging server
- **Production**: Kubernetes or Docker Swarm

## Deployment Architecture

### Infrastructure Diagram
```
┌─────────────────────────────────────────────────┐
│         Load Balancer / Nginx                   │
└─────────────────────────────────────────────────┘
         │                    │
┌────────────────┐  ┌────────────────┐
│ Frontend       │  │ Backend        │
│ (Next.js)      │  │ (NestJS)       │
│ Port: 3000     │  │ Port: 14000    │
└────────────────┘  └────────────────┘
         │                    │
         └────────────────────┘
                  │
    ┌─────────────┬──────────┬──────────┐
    │             │          │          │
┌────────┐   ┌────────┐  ┌────────┐  ┌────────┐
│  Postgres  │  │ Redis  │  │ MinIO  │  │Metrics │
│  Port:5432 │  │ 6379   │  │ 9000   │  │        │
└────────┘   └────────┘  └────────┘  └────────┘
```

## Docker & Docker Compose

### Docker Compose Configuration
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres
    environment:
      POSTGRES_DB: shoprausach
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  minio:
    image: minio/minio:latest
    container_name: minio
    environment:
      MINIO_ROOT_USER: ${MINIO_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD:-minioadmin}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/minio_data
    command: server /minio_data --console-address ":9001"
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD:-password}@postgres:5432/shoprausach
      REDIS_HOST: redis
      REDIS_PORT: 6379
      MINIO_ENDPOINT: minio:9000
      JWT_SECRET: ${JWT_SECRET:-secret}
      NODE_ENV: ${NODE_ENV:-development}
    ports:
      - "14000:14000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
      minio:
        condition: service_started
    networks:
      - app-network
    volumes:
      - ./backend/src:/app/src

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:14000/graphql
      NODE_ENV: ${NODE_ENV:-development}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:
  minio_data:

networks:
  app-network:
    driver: bridge
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v

# Rebuild images
docker-compose up -d --build
```

## Local Development Setup

### Prerequisites
```bash
# Check versions
node --version    # >= 18
bun --version      # >= 1.3.0
docker --version   # >= 20.10
docker-compose --version  # >= 1.29
```

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd shoprausach

# Copy environment files
cp .env.example .env.local

# Start Docker services
docker-compose up -d

# Wait for PostgreSQL (check health)
docker-compose ps

# Run database migrations
cd backend
bun run prisma:migrate dev
bun run prisma:seed

# Start development servers
cd backend && bun dev     # Terminal 1
cd frontend && bun dev    # Terminal 2

# Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:14000
# GraphQL: http://localhost:14000/graphql
# MinIO: http://localhost:9001
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/shoprausach
DB_PASSWORD=password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# MinIO
MINIO_ENDPOINT=minio:9000
MINIO_REGION=us-east-1
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600

# API
API_PORT=14000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Application
APP_NAME=ShopRauSach
APP_VERSION=1.0.0
```

## Production Deployment

### Pre-Deployment Checklist
```
Frontend:
- [ ] All tests passing (bun test)
- [ ] No console errors
- [ ] Production environment variables configured
- [ ] Build optimizations applied
- [ ] CDN configured for static assets
- [ ] CORS properly configured

Backend:
- [ ] All tests passing (bun test)
- [ ] Database migrations applied
- [ ] RBAC roles seeded
- [ ] Error handling tested
- [ ] Rate limiting enabled
- [ ] Logging configured

Infrastructure:
- [ ] SSL certificates configured
- [ ] Database backups scheduled
- [ ] Monitoring alerts configured
- [ ] Log aggregation setup
- [ ] Auto-scaling configured
- [ ] Disaster recovery plan documented
```

### Production Build

**Frontend**
```bash
cd frontend

# Build optimized bundle
bun run build

# Verify build
ls -lah .next/

# Start production server
bun start

# Or use Docker
docker build -t frontend:prod .
docker run -p 3000:3000 frontend:prod
```

**Backend**
```bash
cd backend

# Build optimized bundle
bun run build

# Verify build
ls -lah dist/

# Start production server
bun start

# Or use Docker
docker build -t backend:prod .
docker run -p 14000:14000 backend:prod
```

### Docker Image Optimization
```dockerfile
# Frontend Dockerfile (optimized)
FROM node:20-slim as builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["bun", "start"]

# Backend Dockerfile (optimized)
FROM node:20-slim as builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 14000
CMD ["bun", "start"]
```

### Database Setup
```bash
# Connect to production database
psql -h prod-db.example.com -U postgres -d shoprausach

# Run migrations
bun run prisma:migrate deploy

# Seed initial data
bun run prisma:seed

# Verify schema
\dt  # List all tables
```

### SSL/TLS Configuration
```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d yourdomain.com

# Configure Nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# Auto-renewal
0 0 1 * * /usr/bin/certbot renew
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun test
        
      - name: Build
        run: bun run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/production'
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            git pull origin production
            docker-compose up -d --build
```

## Monitoring & Logging

### Application Monitoring
```typescript
// Backend: Enable detailed logging
import { Logger } from '@nestjs/common';

const logger = new Logger('MyService');

logger.log('Application started');
logger.error('An error occurred', error.stack);
logger.debug('Debug information');
logger.warn('Warning message');
```

### Log Aggregation
```bash
# View all Docker logs
docker-compose logs

# Follow specific service
docker-compose logs -f backend

# Save logs to file
docker-compose logs > logs.txt

# For production, use ELK Stack or similar:
# - Elasticsearch for storage
# - Logstash for processing
# - Kibana for visualization
```

### Health Checks
```bash
# Frontend health
curl http://localhost:3000/health

# Backend health
curl http://localhost:14000/health

# Database health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli ping

# MinIO health
curl -I http://localhost:9000/minio/health/live
```

### Performance Monitoring
```bash
# Backend performance
curl http://localhost:14000/metrics

# Database query performance
EXPLAIN ANALYZE SELECT * FROM "User" WHERE email = 'user@example.com';

# Container resource usage
docker stats

# System resource usage
free -h    # Memory
df -h      # Disk
top        # CPU
```

## Backup & Recovery

### Database Backup
```bash
# Manual backup
docker-compose exec postgres pg_dump -U postgres shoprausach > backup.sql

# Backup with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U postgres shoprausach > backup_${TIMESTAMP}.sql

# Restore from backup
docker-compose exec -i postgres psql -U postgres shoprausach < backup.sql
```

### File Storage Backup (MinIO)
```bash
# Backup bucket
docker-compose exec minio mc mirror minio/data /backup/data

# Restore bucket
docker-compose exec minio mc mirror /backup/data minio/data
```

### Complete System Backup
```bash
#!/bin/bash
BACKUP_DIR="/backups/shoprausach"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec postgres pg_dump -U postgres shoprausach > \
  $BACKUP_DIR/db_${TIMESTAMP}.sql

# Docker volumes backup
for volume in postgres_data redis_data minio_data; do
  docker run --rm \
    -v ${volume}:/data \
    -v $BACKUP_DIR:/backup \
    alpine tar czf /backup/${volume}_${TIMESTAMP}.tar.gz -C /data .
done

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
```

## Scaling

### Horizontal Scaling
```yaml
# Scale frontend services
services:
  frontend-1:
    # Same as frontend
  frontend-2:
    # Same as frontend
  frontend-3:
    # Same as frontend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Vertical Scaling
```bash
# Increase Docker resource limits
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### Load Balancing
```nginx
upstream backend {
  server backend:14000;
  server backend-2:14000;
  server backend-3:14000;
}

upstream frontend {
  server frontend:3000;
  server frontend-2:3000;
  server frontend-3:3000;
}

server {
  listen 80;
  
  location /api {
    proxy_pass http://backend;
  }
  
  location / {
    proxy_pass http://frontend;
  }
}
```

## Troubleshooting

### Common Issues

**1. Container won't start**
```bash
# Check logs
docker-compose logs backend

# Verify image exists
docker images

# Rebuild image
docker-compose up -d --build

# Check resource limits
docker stats
```

**2. Database connection error**
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection manually
psql -h localhost -U postgres -d shoprausach

# Restart PostgreSQL
docker-compose restart postgres
```

**3. Out of disk space**
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune
docker volume prune

# Remove old logs
docker-compose logs --tail 0 > /dev/null

# Check specific volumes
docker volume ls
du -sh /var/lib/docker/volumes/*/
```

**4. Memory issues**
```bash
# Check memory usage
docker stats

# Increase swap
free -h

# Optimize container memory
docker-compose down
# Edit docker-compose.yml: memory: 4G
docker-compose up -d
```

**5. Port conflicts**
```bash
# Check port usage
netstat -tuln | grep :3000
lsof -i :14000

# Kill process using port
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Changed from 3000
```

## Disaster Recovery

### Recovery Procedures

**Database Recovery**
```bash
# 1. Verify backup exists
ls -la /backups/shoprausach/db_*.sql

# 2. Stop application
docker-compose stop backend frontend

# 3. Restore database
docker-compose exec -i postgres psql -U postgres shoprausach < /backups/shoprausach/db_latest.sql

# 4. Restart application
docker-compose up -d backend frontend

# 5. Verify data integrity
curl http://localhost:14000/graphql
```

**Full System Recovery**
```bash
# 1. Backup current state
docker-compose down -v

# 2. Restore from backup
tar -xzf /backups/shoprausach/full_backup.tar.gz -C /

# 3. Start services
docker-compose up -d

# 4. Run migrations
bun run prisma:migrate deploy

# 5. Verify services
docker-compose ps
```

## Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [Let's Encrypt](https://letsencrypt.org)

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainers**: Development Team
