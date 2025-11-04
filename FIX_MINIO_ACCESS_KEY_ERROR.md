# ✅ Fix Lỗi: Minio Access Key Not Found

## 🐛 Lỗi

```
[Nest] ERROR [MinioService] Error ensuring bucket exists: 
The Access Key Id you provided does not exist in our records.
S3Error: The Access Key Id you provided does not exist in our records.
```

## 🔍 Nguyên Nhân

File `.env` đang sử dụng credentials **không đúng** với Minio server:

### ❌ Credentials Cũ (SAI)
```env
MINIO_ACCESS_KEY=rausachcore-admin
MINIO_SECRET_KEY=rausachcore-secret-2025
```

### ✅ Credentials Đúng (Docker Compose)
```env
MINIO_ROOT_USER: minio-admin
MINIO_ROOT_PASSWORD: minio-secret-2025
```

Trong `docker-compose.hybrid.yml` và `docker-compose.multi-domain.yml`, Minio được cấu hình với:
- **Access Key:** `minio-admin`
- **Secret Key:** `minio-secret-2025`

## ✅ Giải Pháp

### Cách 1: Chạy Script Tự Động (KHUYÊN DÙNG)

```bash
./fix-minio-credentials.sh
```

Script sẽ tự động cập nhật:
- ✅ `backend/.env`
- ✅ `.env.rausach`
- ✅ `.env.tazagroup`

### Cách 2: Sửa Thủ Công

Mở các file `.env` và cập nhật:

**1. File: `backend/.env`**
```env
# Minio Object Storage
MINIO_ENDPOINT=116.118.49.243
MINIO_PORT=12007
MINIO_ACCESS_KEY=minio-admin          # ✅ ĐỔI TỪ rausachcore-admin
MINIO_SECRET_KEY=minio-secret-2025    # ✅ GIỮ NGUYÊN
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=uploads
```

**2. File: `.env.rausach`**
```env
MINIO_ACCESS_KEY=minio-admin          # ✅ ĐỔI
MINIO_SECRET_KEY=minio-secret-2025    # ✅ GIỮ NGUYÊN
MINIO_BUCKET_NAME=rausach-uploads
```

**3. File: `.env.tazagroup`**
```env
MINIO_ACCESS_KEY=minio-admin          # ✅ ĐỔI
MINIO_SECRET_KEY=minio-secret-2025    # ✅ GIỮ NGUYÊN
MINIO_BUCKET_NAME=tazagroup-uploads
```

## 🔄 Restart Backend

Sau khi sửa xong, **BẮT BUỘC** phải restart backend:

### Nếu chạy Local
```bash
cd backend

# Với npm
npm run start:dev

# Với bun
bun run start:dev

# Hoặc yarn
yarn start:dev
```

### Nếu chạy Docker
```bash
# Hybrid
docker compose -f docker-compose.hybrid.yml restart rausach-backend
docker compose -f docker-compose.hybrid.yml restart tazagroup-backend

# Multi-Domain
docker compose -f docker-compose.multi-domain.yml restart rausach-backend
docker compose -f docker-compose.multi-domain.yml restart tazagroup-backend
```

## ✅ Kiểm Tra Đã Fix

### 1. Kiểm tra logs
```bash
# Nếu chạy local
tail -f backend/logs/app.log

# Nếu chạy docker
docker compose -f docker-compose.hybrid.yml logs -f rausach-backend
```

### 2. Không còn lỗi
Bạn sẽ thấy:
```
✅ [MinioService] Bucket 'uploads' is ready
```

Thay vì:
```
❌ [MinioService] Error ensuring bucket exists: The Access Key Id...
```

### 3. Test upload file
Thử upload file qua GraphQL hoặc API để đảm bảo Minio hoạt động:
```graphql
mutation {
  uploadFile(file: ...) {
    url
    filename
  }
}
```

## 🌐 Truy Cập Minio Console

Để kiểm tra trực tiếp:

**URL:** http://116.118.49.243:12008

**Đăng nhập:**
- Username: `minio-admin`
- Password: `minio-secret-2025`

## 📊 Thông Tin Minio

| Thông tin | Giá trị |
|-----------|---------|
| **Endpoint** | 116.118.49.243:12007 (API) |
| **Console** | http://116.118.49.243:12008 |
| **Access Key** | minio-admin |
| **Secret Key** | minio-secret-2025 |
| **SSL** | false |
| **Buckets** | rausach-uploads, tazagroup-uploads |

## 🔧 Nếu Muốn Đổi Credentials

Nếu muốn dùng credentials khác, cần cập nhật ở **2 nơi**:

### 1. Docker Compose
Sửa `docker-compose.hybrid.yml` hoặc `docker-compose.multi-domain.yml`:
```yaml
minio:
  environment:
    MINIO_ROOT_USER: your-new-admin      # ✅ ĐỔI
    MINIO_ROOT_PASSWORD: your-new-secret # ✅ ĐỔI
```

### 2. File .env
```env
MINIO_ACCESS_KEY=your-new-admin      # ✅ PHẢI GIỐNG MINIO_ROOT_USER
MINIO_SECRET_KEY=your-new-secret     # ✅ PHẢI GIỐNG MINIO_ROOT_PASSWORD
```

Sau đó restart Minio:
```bash
docker compose -f docker-compose.hybrid.yml restart minio
```

## 🆘 Troubleshooting

### Vẫn còn lỗi sau khi fix?

1. **Kiểm tra .env đã load chưa:**
   ```bash
   cd backend
   cat .env | grep MINIO_ACCESS_KEY
   # Phải thấy: MINIO_ACCESS_KEY=minio-admin
   ```

2. **Restart lại backend:**
   ```bash
   # Kill process cũ
   pkill -f "node.*backend"
   
   # Start lại
   cd backend && npm run start:dev
   ```

3. **Kiểm tra Minio có chạy không:**
   ```bash
   docker ps | grep minio
   
   # Nếu không có, start Minio
   docker compose -f docker-compose.hybrid.yml up -d minio
   ```

4. **Test connection:**
   ```bash
   curl http://116.118.49.243:12007/minio/health/live
   # Phải trả về OK
   ```

---

**Ngày fix:** 2025-11-04  
**Trạng thái:** ✅ ĐÃ FIX  
**Files đã sửa:**
- ✅ `backend/.env`
- ✅ `.env.rausach`
- ✅ `.env.tazagroup`
