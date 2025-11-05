# Simple Production Deployment Guide

## 📋 Tổng Quan
Deployment đơn giản sử dụng PM2 thay vì Docker containers cho backend/frontend.
Chỉ dùng Docker cho databases (PostgreSQL, Redis, Minio).

## 🎯 Ưu Điểm
- ✅ Không build Docker image (tiết kiệm RAM)
- ✅ Dễ debug và xem logs
- ✅ Restart nhanh hơn
- ✅ Memory management tốt hơn với PM2

## 📦 Yêu Cầu Server
- Node.js/Bun installed
- PM2 installed: `npm install -g pm2`
- Docker & Docker Compose (chỉ cho databases)

## 🚀 Deployment Steps

### 1. Chuẩn Bị (One-time)
```bash
# Install PM2 nếu chưa có
npm install -g pm2

# Clone code về server
cd /root
git clone https://github.com/KataChannel/katastarterkit.git innerv2
cd innerv2
git checkout innerv2_dev1
```

### 2. Deploy
```bash
ssh root@116.118.48.208

cd /root/innerv2
git pull origin innerv2_dev1

# Chạy script deploy
./deploy-simple.sh
```

### 3. Kiểm Tra
```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs

# Check specific service
pm2 logs innerv2-backend
pm2 logs innerv2-frontend
```

## 🔧 Cấu Hình Environment

### Backend (.env)
Tạo file `/root/innerv2/backend/.env`:
```bash
NODE_ENV=production
PORT=14001

# Database (Docker internal)
DATABASE_URL="postgresql://postgres:postgres@localhost:14003/tazagroupcore"

# Redis (Docker internal)  
REDIS_HOST=localhost
REDIS_PORT=14004

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d

# Minio (Docker internal)
MINIO_ENDPOINT=localhost
MINIO_PORT=14007
MINIO_ACCESS_KEY=innerv2-admin
MINIO_SECRET_KEY=innerv2-secret-2025

# URLs
FRONTEND_URL=http://116.118.48.208:14000
```

### Frontend (.env.local)
Tạo file `/root/innerv2/frontend/.env.local`:
```bash
NODE_ENV=production

NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:14001/graphql
NEXT_PUBLIC_APP_URL=http://116.118.48.208:14000

NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://116.118.48.208:14000
```

## 📊 PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs
pm2 logs innerv2-backend --lines 100
pm2 logs innerv2-frontend --lines 100

# Restart
pm2 restart innerv2-backend
pm2 restart innerv2-frontend
pm2 restart all

# Stop
pm2 stop innerv2-backend
pm2 stop all

# Monitor
pm2 monit

# Info
pm2 info innerv2-backend
```

## 🐛 Troubleshooting

### Backend không start
```bash
# Check logs
pm2 logs innerv2-backend --err

# Check database connection
cd /root/innerv2/backend
bunx prisma migrate status

# Restart database
docker restart innerv2core-postgres
```

### Frontend không start
```bash
# Check logs
pm2 logs innerv2-frontend --err

# Check build
cd /root/innerv2/frontend
ls -la .next/

# Rebuild
bun run build
pm2 restart innerv2-frontend
```

### Out of Memory
```bash
# Check memory
free -h
pm2 status

# Set memory limit
pm2 delete innerv2-backend
pm2 start dist/main.js --name innerv2-backend --max-memory-restart 400M
pm2 save
```

## 🔄 Update Code

```bash
cd /root/innerv2
git pull origin innerv2_dev1

# Re-deploy
./deploy-simple.sh
```

## 📈 Monitoring

### Real-time Monitor
```bash
pm2 monit
```

### System Resources
```bash
htop
free -h
df -h
```

### PM2 Dashboard (Optional)
```bash
# Install
pm2 install pm2-server-monit

# Access via browser
http://116.118.48.208:9615
```

## 🔐 Production Checklist

- [ ] Đổi JWT_SECRET
- [ ] Đổi NEXTAUTH_SECRET
- [ ] Đổi POSTGRES_PASSWORD
- [ ] Setup firewall (ufw)
- [ ] Setup SSL/HTTPS (certbot)
- [ ] Setup domain
- [ ] Configure Nginx reverse proxy
- [ ] Setup log rotation
- [ ] Setup backup cron job

## 📝 Notes

- Backend chạy trên port 14001
- Frontend chạy trên port 14000
- Databases trong Docker (ports 14003, 14004, 14007)
- PM2 auto-restart on crash
- Logs trong ~/.pm2/logs/
