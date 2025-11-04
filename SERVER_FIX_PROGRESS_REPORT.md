# ✅ BÁO CÁO SỬA LỖI API ENDPOINT TRÊN SERVER

## 🎯 Vấn đề

Frontend trên server `http://116.118.48.208:13000` đang gọi **SAI API**:
```
❌ SAI:  http://api.rausachtrangia.com/graphql (hoặc https)
✅ ĐÚNG: http://116.118.48.208:13001/graphql
```

## 🔍 Nguyên nhân gốc rễ

### 1. **Next.js bakes `NEXT_PUBLIC_*` vào build time**
- Các biến `NEXT_PUBLIC_GRAPHQL_ENDPOINT` được compile vào file `server.js` khi build
- **KHÔNG THỂ** override runtime bằng environment variables
- Phải **REBUILD** để thay đổi

### 2. **File `.env.production` có endpoint SAI khi build**
```bash
# File: /root/appfinal/frontend/.env.production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.rausachtrangia.com/graphql  ❌ SAI
```

### 3. **Container đang chạy image đã build với config cũ**
- Image: `appfinal-innerv2-frontend`
- File `server.js` trong image có hardcoded endpoint SAI
- Dù có set environment variable runtime cũng KHÔNG có tác dụng

## ✅ Giải pháp đã thực hiện

### Giai đoạn 1: Patch tạm thời (KHÔNG thành công)

#### Thử 1: Sửa `.env` trong container đang chạy
```bash
✅ docker exec innerv2-frontend sed -i "..." /app/.env.production
✅ docker exec innerv2-frontend sed -i "..." /app/frontend/.env.production
❌ Restart container → VẪN gọi API SAI
```
**Kết quả:** THẤT BẠI - Next.js dùng baked config trong server.js

#### Thử 2: Patch trực tiếp file `server.js`
```bash
✅ docker exec innerv2-frontend sed -i "..." /app/frontend/server.js
✅ Restart container
❌ Container bị restart loop
```
**Kết quả:** THẤT BẠI - Làm hỏng file server.js

#### Thử 3: Tạo container mới với env variables
```bash
✅ docker run -e NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql ...
✅ Container chạy được
❌ Code client-side VẪN gọi API SAI
```
**Kết quả:** THẤT BẠI - Env runtime không override được baked config

### Giai đoạn 2: Giải pháp chính thức (ĐANG THỰC HIỆN)

#### Bước 1: Sửa `.env.production` trên server
```bash
ssh root@116.118.48.208
cd /root/appfinal/frontend
sed -i 's|https://api.rausachtrangia.com/graphql|http://116.118.48.208:13001/graphql|g' .env.production
```
✅ Hoàn tất

#### Bước 2: Sửa `.env.production` local
```bash
# File: /mnt/chikiet/kataoffical/shoprausach/frontend/.env.production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
```
✅ Hoàn tất

#### Bước 3: Xóa build cũ local
```bash
cd /mnt/chikiet/kataoffical/shoprausach/frontend
rm -rf .next
```
✅ Hoàn tất

#### Bước 4: Build lại với config ĐÚNG
```bash
cd /mnt/chikiet/kataoffical/shoprausach/frontend
NODE_ENV=production bun run build
```
🔄 **ĐANG CHẠY** - Mất khoảng 2-3 phút

#### Bước 5: Sync build lên server
```bash
rsync -avz .next/standalone/ root@116.118.48.208:/root/appfinal/frontend/.next/standalone/
rsync -avz .next/static/ root@116.118.48.208:/root/appfinal/frontend/.next/static/
rsync -avz public/ root@116.118.48.208:/root/appfinal/frontend/public/
```
⏳ Chờ build hoàn tất

#### Bước 6: Rebuild Docker image
```bash
ssh root@116.118.48.208
cd /root/appfinal
docker-compose -f docker-compose.hybrid.yml build --no-cache innerv2-frontend
```
⏳ Chờ build hoàn tất

#### Bước 7: Recreate container
```bash
docker stop innerv2-frontend-new
docker rm innerv2-frontend-new
docker-compose -f docker-compose.hybrid.yml up -d innerv2-frontend
```
⏳ Chờ deploy hoàn tất

## 📝 Các file đã sửa

### 1. Server: `/root/appfinal/frontend/.env.production`
```bash
BEFORE: NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.rausachtrangia.com/graphql
AFTER:  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
```

### 2. Local: `/mnt/chikiet/kataoffical/shoprausach/frontend/.env.production`
```bash
BEFORE: NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:13001/graphql
AFTER:  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
```

### 3. Server: `/root/shoprausach/frontend/.env.production`
```bash
BEFORE: NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.rausachtrangia.com/graphql
AFTER:  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
```

## 🔧 Scripts đã tạo

### 1. `verify-api-endpoint.sh`
Kiểm tra cấu hình hiện tại
```bash
./verify-api-endpoint.sh
```

### 2. `fix-api-endpoint-production.sh`
Auto fix và restart (cho server có bun/npm)
```bash
./fix-api-endpoint-production.sh
```

### 3. `deploy-fix-api-to-server.sh` ⭐
**SCRIPT CHÍNH** - Build local và deploy lên server
```bash
./deploy-fix-api-to-server.sh
```

## 🧪 Cách kiểm tra sau khi deploy

### Kiểm tra 1: Container status
```bash
ssh root@116.118.48.208 "docker ps | grep innerv2-frontend"
```
Kỳ vọng: `Up X minutes (healthy)`

### Kiểm tra 2: Environment variables
```bash
ssh root@116.118.48.208 "docker exec innerv2-frontend printenv | grep NEXT_PUBLIC_GRAPHQL"
```
Kỳ vọng: `NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql`

### Kiểm tra 3: Frontend response
```bash
curl -I http://116.118.48.208:13000
```
Kỳ vọng: `HTTP/1.1 200 OK`

### Kiểm tra 4: Browser DevTools (QUAN TRỌNG NHẤT)
1. Mở: `http://116.118.48.208:13000`
2. Nhấn **F12** → Tab **Network** → Filter **XHR**
3. Hard reload: **Ctrl+Shift+R**
4. Xem GraphQL requests → Phải gọi: `http://116.118.48.208:13001/graphql` ✅

## ⏳ Trạng thái hiện tại

- [x] Sửa `.env.production` trên server
- [x] Sửa `.env.production` local
- [x] Xóa build cũ local
- [🔄] Build lại local (ĐANG CHẠY - ~2-3 phút)
- [ ] Sync build lên server
- [ ] Rebuild Docker image
- [ ] Recreate container
- [ ] Test trên browser

## 📌 Lưu ý quan trọng

### 1. Next.js NEXT_PUBLIC_* variables
- Được embed vào build tại build time
- **KHÔNG THỂ** thay đổi runtime
- Phải rebuild để sửa

### 2. Docker container
- Chỉ copy file từ host vào image
- Không build code trong container
- Image đã có sẵn compiled code

### 3. Để sửa lỗi này lần sau
```bash
1. Sửa .env.production
2. Xóa .next/
3. Build lại: bun run build
4. Rebuild Docker image
5. Recreate container
```

---

**Ngày:** 2025-11-04  
**Server:** 116.118.48.208  
**Container:** innerv2-frontend  
**Trạng thái:** 🔄 ĐANG TRIỂN KHAI
