# 🚀 Deployment Guide - Rausach

## 📋 Overview

Hệ thống deployment được tách riêng thành 2 phần:
- **Infrastructure** (Postgres, Redis, Minio) - Chạy độc lập, ít thay đổi
- **Application** (Backend, Frontend) - Deploy thường xuyên khi có code mới

## 🎯 Quick Start

### 1️⃣ Deploy Infrastructure (Lần đầu tiên)

```bash
# Option 1: Sử dụng menu
bun run dev
# Chọn: 4. Deploy Infrastructure to Server

# Option 2: Chạy trực tiếp
./scripts/deployment/deploy-infrastructure.sh
```

**Khi nào cần chạy:**
- Lần đầu setup server
- Thay đổi cấu hình database
- Nâng cấp version PostgreSQL/Redis/Minio

### 2️⃣ Deploy Application (Mỗi lần có code mới)

```bash
# Option 1: Sử dụng menu
bun run dev
# Chọn: 5. Deploy App to Server

# Option 2: Chạy trực tiếp
./scripts/deployment/deploy-optimized.sh
```

**Khi nào cần chạy:**
- Có code mới ở Backend hoặc Frontend
- Fix bug
- Update features

## 📦 Menu Options

```
🚀 Rausach - Dev & Deploy Menu

📦 DEVELOPMENT:
  1. Dev - Full (Backend + Frontend)         → Dev local
  2. Dev - Backend Only                      → Dev backend only
  3. Dev - Frontend Only                     → Dev frontend only

🐳 DEPLOYMENT:
  4. Deploy Infrastructure to Server         → Deploy DB, Redis, Minio
  5. Deploy App to Server                    → Deploy Backend + Frontend
  6. Stop Services (App/Infrastructure/All)  → Stop services trên server
  7. Show Docker Images                      → Xem images trên server
  8. Cleanup Docker                          → Dọn dẹp images cũ
  9. Rollback to Previous Version            → Quay lại version trước

🗄️  DATABASE:
  10. Prisma Studio                          → Mở Prisma Studio
  11. Database Migrate                       → Chạy migration

🛠️  UTILITIES:
  12. Docker - Start Dev Services (Local)    → Start services local
  13. Docker - Stop Dev Services (Local)     → Stop services local
  14. Kill Ports (12000-12001)               → Kill port đang chạy
```

## 🔄 Deployment Workflow

### Lần đầu tiên setup server:

```bash
# Bước 1: Deploy infrastructure
bun run dev → Chọn 4

# Bước 2: Chờ infrastructure sẵn sàng (30-60 giây)

# Bước 3: Deploy application
bun run dev → Chọn 5
```

### Cập nhật code hàng ngày:

```bash
# Chỉ cần deploy application
bun run dev → Chọn 5
```

## 📝 Docker Compose Files

### `docker-compose.infra.yml`
- PostgreSQL (port 12003)
- Redis (port 12004)
- Minio (port 12007, 12008)

### `docker-compose.app.yml`
- Backend (port 12001)
- Frontend (port 12000)

## 🛠️ Manual Commands

### Deploy Infrastructure
```bash
./deploy-infrastructure.sh
```

### Deploy Application
```bash
./deploy-optimized.sh
```

### Stop Services
```bash
./stop-services.sh
```

### View Logs (trên server)
```bash
# App logs
ssh root@116.118.49.243 "cd /root/shoprausach && docker compose -f docker-compose.app.yml logs -f"

# Infrastructure logs
ssh root@116.118.49.243 "cd /root/shoprausach && docker compose -f docker-compose.infra.yml logs -f"
```

### Restart Services (trên server)
```bash
# Restart app only
ssh root@116.118.49.243 "cd /root/shoprausach && docker compose -f docker-compose.app.yml restart"

# Restart infrastructure (cẩn thận!)
ssh root@116.118.49.243 "cd /root/shoprausach && docker compose -f docker-compose.infra.yml restart"
```

## 🔧 Package.json Scripts

```json
{
  "dev": "./scripts/dev-deploy-menu.sh",              // Mở menu
  "docker:infra": "docker compose -f docker-compose.infra.yml up -d",
  "docker:app": "docker compose -f docker-compose.app.yml up -d",
  "docker:down:app": "docker compose -f docker-compose.app.yml down",
  "docker:down:infra": "docker compose -f docker-compose.infra.yml down"
}
```

## 🌐 Connection Info

### Production Server: `116.118.49.243`

| Service    | Port  | URL/Connection                      |
|------------|-------|-------------------------------------|
| Frontend   | 12000 | http://116.118.49.243:12000         |
| Backend    | 12001 | http://116.118.49.243:12001/graphql |
| PostgreSQL | 12003 | postgres://postgres:postgres@...    |
| Redis      | 12004 | redis://116.118.49.243:12004        |
| Minio API  | 12007 | http://116.118.49.243:12007         |
| Minio UI   | 12008 | http://116.118.49.243:12008         |

## 🔐 Default Credentials

```
PostgreSQL:
  User: postgres
  Password: postgres
  Database: rausachcore

Redis:
  No password

Minio:
  User: minio-admin
  Password: minio-secret-2025
```

## ⚡ Performance Benefits

### Deployment được tách riêng:

✅ **Infrastructure** (deploy 1 lần):
- Không cần rebuild khi deploy app
- Ổn định, không bị restart
- Tiết kiệm tài nguyên server

✅ **Application** (deploy thường xuyên):
- Build local → Transfer → Deploy
- Không tốn CPU/RAM server để build
- Deploy nhanh (~2-3 phút)
- Force recreate containers mỗi lần
- No cache, đảm bảo code mới nhất

## 🐛 Troubleshooting

### Route 404 trên production nhưng work ở local:

**Vấn đề:** Route như `/admin/blog-tree` hoạt động ở local nhưng 404 trên server.

**Nguyên nhân:** Build script trước đây build vào `.next` nhưng Docker copy từ `.next-rausach`.

**Giải pháp (đã fix):**
- `next.config.js` đã được cập nhật với `distDir: process.env.NEXT_DIST_DIR || '.next'`
- `deploy-optimized.sh` build với `NEXT_DIST_DIR=.next-rausach`
- Tất cả routes giờ được build đúng vào `.next-rausach`

**Test trước khi deploy:**
```bash
# Option 1: Dùng menu
bun run dev → Chọn 12 (Test Build Frontend)

# Option 2: Chạy trực tiếp
./build-frontend-prod.sh
```

### Infrastructure không start được:
```bash
# Xem logs
ssh root@116.118.49.243 "docker compose -f /root/shoprausach/docker-compose.infra.yml logs"

# Restart
ssh root@116.118.49.243 "cd /root/shoprausach && docker compose -f docker-compose.infra.yml down && docker compose -f docker-compose.infra.yml up -d"
```

### App không nhận code mới:
```bash
# Deploy lại với force recreate
./deploy-optimized.sh
```

### Rollback về version trước:
```bash
bun run dev → Chọn 9 (Rollback)
```

### Xem resource usage:
```bash
ssh root@116.118.49.243 "docker stats --no-stream"
```

## 📊 Monitoring

### Check container status:
```bash
ssh root@116.118.49.243 "docker ps"
```

### Check logs:
```bash
# App
ssh root@116.118.49.243 "docker logs shopbackend -f"
ssh root@116.118.49.243 "docker logs shopfrontend -f"

# Infrastructure
ssh root@116.118.49.243 "docker logs shoppostgres -f"
ssh root@116.118.49.243 "docker logs shared-redis -f"
ssh root@116.118.49.243 "docker logs shared-minio -f"
```

## 🎓 Best Practices

1. **Deploy Infrastructure trước, App sau**
2. **Không restart Infrastructure khi không cần thiết**
3. **Test local trước khi deploy**
4. **Dùng menu để tránh lỗi command**
5. **Check logs sau mỗi lần deploy**
6. **Backup database trước khi update infrastructure**

---

Made with ❤️ by Rausach Team
