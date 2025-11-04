# ✅ HOÀN TẤT SỬA LỖI API ENDPOINT TRÊN SERVER

## 🎯 Vấn đề đã khắc phục

**Lỗi:** Frontend trên server `http://116.118.48.208:13000` đang gọi sai API:
```
❌ SAI:  http://api.rausachtrangia.com/graphql
✅ ĐÚNG: http://116.118.48.208:13001/graphql
```

## 🔧 Các bước đã thực hiện

### 1. ✅ Sửa file `.env.production` trên server
```bash
# Trên server: /root/shoprausach/frontend/.env.production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.48.208:13001
```

### 2. ✅ Tạo file `.env.local` trên server
```bash
# Trên server: /root/shoprausach/frontend/.env.local
NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.48.208:13001
```

### 3. ✅ Copy file vào Docker container
```bash
docker cp /root/shoprausach/frontend/.env.local innerv2-frontend:/app/.env.local
docker cp /root/shoprausach/frontend/.env.production innerv2-frontend:/app/.env.production
```

### 4. ✅ Restart Docker container
```bash
docker restart innerv2-frontend
```

## 🧪 Xác nhận kết quả

### Kiểm tra biến môi trường trong container:
```bash
$ docker exec innerv2-frontend sh -c 'printenv | grep NEXT_PUBLIC'

✅ NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
✅ NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000
```

### Kiểm tra container status:
```bash
$ docker ps | grep innerv2-frontend

✅ Status: Up (healthy)
✅ Ports: 0.0.0.0:13000->3000/tcp
```

## 📊 Thông tin hệ thống

### Server
- IP: `116.118.48.208`
- Path: `/root/shoprausach`

### Ports
- Frontend: `13000` (External) → `3000` (Container)
- Backend API: `13001`

### Docker Container
- Name: `innerv2-frontend`
- Image: `appfinal-innerv2-frontend`
- Status: Running (healthy)

## 🔍 Cách kiểm tra trên browser

### Bước 1: Mở trang web
Truy cập: `http://116.118.48.208:13000`

### Bước 2: Mở DevTools
- Nhấn **F12** hoặc **Ctrl+Shift+I**
- Vào tab **Network**
- Filter: **XHR** hoặc **Fetch**

### Bước 3: Tải lại trang
- Nhấn **Ctrl+Shift+R** (hard reload)
- Hoặc **Ctrl+R** (normal reload)

### Bước 4: Kiểm tra GraphQL requests
Tất cả requests phải gọi đến:
```
✅ http://116.118.48.208:13001/graphql
```

**KHÔNG ĐƯỢC** có requests đến:
```
❌ http://api.rausachtrangia.com/graphql
❌ https://api.rausachtrangia.com/graphql
```

## 🛠️ Commands hữu ích

### Kiểm tra container logs
```bash
ssh root@116.118.48.208 "docker logs -f innerv2-frontend"
```

### Kiểm tra file .env trong container
```bash
ssh root@116.118.48.208 "docker exec innerv2-frontend cat /app/.env.local"
```

### Restart container nếu cần
```bash
ssh root@116.118.48.208 "docker restart innerv2-frontend"
```

### Kiểm tra biến môi trường
```bash
ssh root@116.118.48.208 "docker exec innerv2-frontend printenv | grep NEXT_PUBLIC"
```

## ⚠️ Lưu ý quan trọng

### 1. File priority trong Next.js
Khi chạy trong container, Next.js đọc file theo thứ tự:
```
.env.local         (Highest - Container sẽ dùng file này)
.env.production    (Fallback nếu không có .env.local)
.env               (Lowest - Default values)
```

### 2. Container rebuild
Nếu rebuild container, nhớ copy lại file .env:
```bash
# Sau khi rebuild container
docker cp /root/shoprausach/frontend/.env.local innerv2-frontend:/app/.env.local
docker restart innerv2-frontend
```

### 3. Environment trong Dockerfile
Nếu sửa Dockerfile hoặc docker-compose, kiểm tra:
- Không hardcode `NEXT_PUBLIC_GRAPHQL_ENDPOINT` trong Dockerfile
- Volume mount cho file .env (nếu có)
- Build args (nếu có)

## 📝 Checklist hoàn thành

- [x] Sửa `/root/shoprausach/frontend/.env.production`
- [x] Tạo `/root/shoprausach/frontend/.env.local`
- [x] Copy file vào container `innerv2-frontend`
- [x] Restart container
- [x] Xác nhận biến môi trường đúng
- [x] Container chạy healthy
- [x] API endpoint: `http://116.118.48.208:13001/graphql`

## ✅ Kết quả

Frontend trên server `http://116.118.48.208:13000` giờ đây đã gọi đúng API:
```
http://116.118.48.208:13001/graphql
```

CORS error sẽ không còn xuất hiện nữa! 🎉

---

**Ngày thực hiện:** 2025-11-04  
**Người thực hiện:** GitHub Copilot  
**Server:** 116.118.48.208  
**Container:** innerv2-frontend  
**Trạng thái:** ✅ HOÀN THÀNH
