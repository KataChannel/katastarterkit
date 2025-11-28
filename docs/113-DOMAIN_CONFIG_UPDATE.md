# Cập Nhật Cấu Hình Domain - Domain Configuration Update

## Tổng Quan / Overview

Cập nhật tất cả các file cấu hình deployment và environment theo cấu trúc domain trong `cautrucdomain.txt`.

---

## 📋 Cấu Trúc Domain / Domain Structure

### Server Chung / Shared Server
- **IP**: 116.118.49.243
- **PostgreSQL**: 116.118.49.243:12003
- **Redis**: 116.118.49.243:12004
- **MinIO**: 116.118.49.243:12007-12008

---

### 1️⃣ RAUSACH - shop.rausachtrangia.com

#### Ports:
- **Frontend**: 12000
- **Backend**: 12001

#### Domains:
- **Frontend**: shop.rausachtrangia.com
- **Backend API**: api.rausachtrangia.com
- **Storage**: storage.rausachtrangia.com

#### Configuration:
- **Database**: rausachcore
- **Bucket**: rausach-uploads
- **Env Files**: .env.dev.rausach, .env.prod.rausach

#### Thay Đổi / Changes:
✅ Thêm PORT=12000 cho frontend container
✅ Thêm validation .env file (không phải directory)

---

### 2️⃣ TAZAGROUP - app.tazagroup.vn

#### Ports:
- **Frontend**: 13000
- **Backend**: 13001

#### Domains:
- **Frontend**: app.tazagroup.vn
- **Backend API**: appapi.tazagroup.vn (ĐANG DÙNG - Working)
- **Storage**: storage.tazagroup.vn

#### Configuration:
- **Database**: tazagroupcore
- **Bucket**: tazagroup-uploads
- **Env Files**: .env.dev.tazagroup, .env.prod.tazagroup

#### Thay Đổi / Changes:
✅ Đã có PORT=13000 cho frontend container
✅ Đã có validation .env file
✅ Cập nhật NEXT_PUBLIC_GRAPHQL_ENDPOINT: api.tazagroup.vn → appapi.tazagroup.vn
✅ Cập nhật NEXT_PUBLIC_BACKEND_URL: api.tazagroup.vn → appapi.tazagroup.vn
✅ Cập nhật NEXT_PUBLIC_SOCKET_URL: api.tazagroup.vn → appapi.tazagroup.vn

**Lưu Ý**: Domain `appapi.tazagroup.vn` đang hoạt động với SSL. Domain `api.tazagroup.vn` cần cập nhật DNS.

---

### 3️⃣ TIMONA - app.timona.edu.vn

#### Ports:
- **Frontend**: 15000
- **Backend**: 15001

#### Domains:
- **Frontend**: app.timona.edu.vn
- **Backend API**: appapi.timona.edu.vn
- **Storage**: storage.timona.edu.vn

#### Configuration:
- **Database**: timonacore
- **Bucket**: timona-uploads
- **Env Files**: .env.dev.timona, .env.prod.timona

#### Thay Đổi / Changes:
✅ Thêm PORT=15000 cho frontend container
✅ Thêm validation .env file (không phải directory)
✅ Cập nhật NEXT_PUBLIC_GRAPHQL_ENDPOINT: api.timona.edu.vn → appapi.timona.edu.vn
✅ Cập nhật NEXT_PUBLIC_BACKEND_URL: api.timona.edu.vn → appapi.timona.edu.vn
✅ Cập nhật NEXT_PUBLIC_SOCKET_URL: api.timona.edu.vn → appapi.timona.edu.vn
✅ Xóa port mapping trùng lặp, chỉ dùng --network host

---

## 🔧 Files Đã Cập Nhật / Updated Files

### Deployment Scripts:
1. **scripts/deploy/deploy-rausach.sh**
   - Thêm PORT=12000 environment variable
   - Thêm .env file validation

2. **scripts/deploy/deploy-tazagroup.sh**
   - Đã có PORT=13000 và validation (không thay đổi)

3. **scripts/deploy/deploy-timona.sh**
   - Thêm PORT=15000 environment variable
   - Thêm .env file validation
   - Sửa docker run commands

### Environment Files:
1. **env/.env.prod.rausach**
   - Giữ nguyên MINIO_BUCKET_NAME: rausach-uploads

2. **env/.env.prod.tazagroup**
   - Sửa backend URLs: api.tazagroup.vn → appapi.tazagroup.vn

3. **env/.env.prod.timona**
   - Sửa backend URLs: api.timona.edu.vn → appapi.timona.edu.vn

---

## 🚀 Hướng Dẫn Deploy / Deployment Guide

### Bước 1: Build Docker Images
```bash
bun run docker:build
```

### Bước 2: Deploy Domain Cụ Thể
```bash
# RAUSACH
bun run deploy:rausach

# TAZAGROUP  
bun run deploy:tazagroup

# TIMONA
bun run deploy:timona
```

### Bước 3: Kiểm Tra Trên Server
```bash
ssh root@116.118.49.243

# Kiểm tra containers
docker ps | grep -E '(shop|tazagroup|timona)'

# Kiểm tra logs
docker logs shopbackend
docker logs shopfrontend
docker logs tazagroup-backend
docker logs tazagroup-frontend
docker logs timona-backend
docker logs timona-frontend

# Kiểm tra ports
netstat -tlnp | grep -E '(12000|12001|13000|13001|15000|15001)'
```

---

## ✅ Validation Checklist

### RAUSACH:
- [ ] Frontend chạy trên port 12000
- [ ] Backend chạy trên port 12001
- [ ] MinIO bucket: shopuploads
- [ ] Domain frontend: https://shop.rausachtrangia.com
- [ ] Domain API: https://api.rausachtrangia.com/graphql

### TAZAGROUP:
- [ ] Frontend chạy trên port 13000
- [ ] Backend chạy trên port 13001
- [ ] MinIO bucket: tazagroup-uploads
- [ ] Domain frontend: https://app.tazagroup.vn
- [ ] Domain API: https://appapi.tazagroup.vn/graphql ✅ (Working)

### TIMONA:
- [ ] Frontend chạy trên port 15000
- [ ] Backend chạy trên port 15001
- [ ] MinIO bucket: timona-uploads
- [ ] Domain frontend: https://app.timona.edu.vn
- [ ] Domain API: https://appapi.timona.edu.vn/graphql

---

## 🔍 Troubleshooting

### Lỗi Port Conflict:
```bash
# Tìm process đang dùng port
netstat -tlnp | grep <PORT>

# Dừng container cũ
docker stop <container_name>
docker rm <container_name>
```

### Lỗi .env là Directory:
```bash
# Xóa directory và tạo file mới
rm -rf /opt/<domain>/.env
scp env/.env.prod.<domain> root@116.118.49.243:/opt/<domain>/.env
```

### Lỗi Connect Database/Redis:
```bash
# Kiểm tra services đang chạy
docker ps | grep -E '(postgres|redis|minio)'

# Kiểm tra ports
netstat -tlnp | grep -E '(12003|12004|12007)'
```

---

## 📝 Notes

1. Tất cả containers dùng `--network host` nên PORT environment variable là BẮT BUỘC
2. File .env phải là regular file, không được là directory
3. Backend APIs dùng subdomain `appapi.*` thay vì `api.*`
4. MinIO buckets phải được tạo trước khi deploy
5. Nginx configs phải được cấu hình trước cho các domains

---

**Last Updated**: 2025-11-28
**Updated By**: GitHub Copilot
**Based On**: cautrucdomain.txt
