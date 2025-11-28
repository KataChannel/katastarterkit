# Multi-Domain Deployment Guide

Hệ thống hỗ trợ 3 domains chạy trên cùng 1 server (116.118.49.243):

## 📋 Danh Sách Domains

### 1. RAUSACH - shop.rausachtrangia.com
- **Frontend**: Port 12000
- **Backend**: Port 12001
- **Storage**: storage.rausachtrangia.com (MinIO bucket: `shopuploads`)
- **Env Files**: `.env.dev.rausach`, `.env.prod.rausach`

### 2. TAZAGROUP - app.tazagroup.vn
- **Frontend**: Port 13000
- **Backend**: Port 13001
- **Storage**: storage.tazagroup.vn (MinIO bucket: `tazagroup-uploads`)
- **Env Files**: `.env.dev.tazagroup`, `.env.prod.tazagroup`

### 3. TIMONA - app.timona.edu.vn
- **Frontend**: Port 15000
- **Backend**: Port 15001
- **Storage**: storage.timona.edu.vn (MinIO bucket: `timona-uploads`)
- **Env Files**: `.env.dev.timona`, `.env.prod.timona`

---

## 🚀 Development Mode

### Chạy Dev cho từng domain:

```bash
# RAUSACH
bun run dev:rausach

# TAZAGROUP
bun run dev:tazagroup

# TIMONA
bun run dev:timona
```

### Chạy riêng Backend hoặc Frontend:

```bash
# Backend only
bun run dev:rausach:backend
bun run dev:tazagroup:backend
bun run dev:timona:backend

# Frontend only
bun run dev:rausach:frontend
bun run dev:tazagroup:frontend
bun run dev:timona:frontend
```

---

## 🏗️ Build & Deploy

### Build Complete (Code + Docker Images + Deploy):

```bash
# RAUSACH
bun run deploy:rausach

# TAZAGROUP
bun run deploy:tazagroup

# TIMONA
bun run deploy:timona
```

### Hoặc build từng bước:

#### Step 1: Build Code
```bash
bun run build:rausach
bun run build:tazagroup
bun run build:timona
```

#### Step 2: Build Docker Images
```bash
bun run build:rausach:image
bun run build:tazagroup:image
bun run build:timona:image
```

#### Step 3: Save Images to tar.gz
```bash
bun run build:rausach:save
bun run build:tazagroup:save
bun run build:timona:save
```

#### Step 4: Deploy to Server
```bash
./scripts/deploy-rausach.sh
./scripts/deploy-tazagroup.sh
./scripts/deploy-timona.sh
```

---

## 🗄️ Database Management

### RAUSACH Database:
```bash
bun run db:migrate:rausach    # Run migrations
bun run db:push:rausach       # Push schema changes
bun run db:seed:rausach       # Seed data
bun run db:studio:rausach     # Open Prisma Studio
bun run db:reset:rausach      # Reset database
```

### TAZAGROUP Database:
```bash
bun run db:migrate:tazagroup
bun run db:push:tazagroup
bun run db:seed:tazagroup
bun run db:studio:tazagroup
bun run db:reset:tazagroup
```

### TIMONA Database:
```bash
bun run db:migrate:timona
bun run db:push:timona
bun run db:seed:timona
bun run db:studio:timona
bun run db:reset:timona
```

---

## 🔧 Server Setup Requirements

Trên server (116.118.49.243), cần tạo các thư mục:

```bash
# Tạo thư mục cho từng domain
sudo mkdir -p /opt/rausach
sudo mkdir -p /opt/tazagroup
sudo mkdir -p /opt/timona

# Copy file .env.prod vào từng thư mục
sudo cp .env.prod.rausach /opt/rausach/.env
sudo cp .env.prod.tazagroup /opt/tazagroup/.env
sudo cp .env.prod.timona /opt/timona/.env
```

---

## 📦 Docker Images Location

Các Docker images được lưu tại: `./docker-images/`

- `rausach-backend.tar.gz`, `rausach-frontend.tar.gz`
- `tazagroup-backend.tar.gz`, `tazagroup-frontend.tar.gz`
- `timona-backend.tar.gz`, `timona-frontend.tar.gz`

**Lưu ý**: Các file này đã được thêm vào `.gitignore` vì quá lớn cho GitHub.

---

## 🛠️ Utilities

```bash
# Kill all ports
bun run kill:ports

# Setup dependencies
bun run setup

# Clean all node_modules
bun run clean

# Lint & Format
bun run lint
bun run format
```

---

## 📝 Environment Variables Structure

Mỗi file `.env.dev.*` và `.env.prod.*` cần có:

```env
# Database
DATABASE_URL="postgresql://user:pass@116.118.49.243:12003/dbname"

# Redis
REDIS_HOST="116.118.49.243"
REDIS_PORT="12004"

# MinIO
MINIO_ENDPOINT="116.118.49.243"
MINIO_PORT="12007"
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_BUCKET_NAME="shopuploads" # hoặc tazagroup-uploads, timona-uploads

# URLs
NEXT_PUBLIC_API_URL="http://shop.rausachtrangia.com/graphql"
NEXT_PUBLIC_STORAGE_URL="http://storage.rausachtrangia.com"
```

---

## 🔄 Deployment Flow

```
1. Dev locally với .env.dev.*
   ↓
2. Build code với .env.prod.*
   ↓
3. Build Docker images
   ↓
4. Save images to tar.gz
   ↓
5. Upload to server (SCP)
   ↓
6. Load images on server
   ↓
7. Stop old containers
   ↓
8. Start new containers
   ↓
9. Verify deployment
```

---

## ⚠️ Important Notes

1. **Ports**: Đảm bảo ports không bị conflict:
   - RAUSACH: 12000-12001
   - TAZAGROUP: 13000-13001
   - TIMONA: 15000-15001

2. **SSH Access**: Cần có SSH key để deploy lên server

3. **Docker Images**: Không commit vào Git (đã có trong .gitignore)

4. **Environment Files**: 
   - `.env.dev.*` cho development
   - `.env.prod.*` cho production
   - Không commit files này vào Git

5. **MinIO Buckets**: Mỗi domain có bucket riêng

---

## 🆘 Troubleshooting

### Port đã được sử dụng:
```bash
bun run kill:ports
```

### Container không start:
```bash
# Check logs trên server
ssh root@116.118.49.243
docker logs rausach-backend
docker logs rausach-frontend
```

### Database connection failed:
```bash
# Test connection
bun run db:studio:rausach
```

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Logs của container trên server
2. Environment variables đã đúng chưa
3. Ports có conflict không
4. Database connection có OK không
