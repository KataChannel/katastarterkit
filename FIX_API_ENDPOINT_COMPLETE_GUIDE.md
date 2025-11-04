# 🔧 FIX: Lỗi Frontend Gọi Sai API Endpoint

## ❌ Vấn đề

Frontend trên server `http://116.118.48.208:13000` đang gọi sai API endpoint:

```
❌ SAI:  http://api.rausachtrangia.com/graphql (hoặc https)
✅ ĐÚNG: http://116.118.48.208:13001/graphql
```

### Triệu chứng

```
Access to fetch at 'http://api.rausachtrangia.com/graphql' 
from origin 'http://116.118.48.208:13000' has been blocked by CORS policy
```

## 🎯 Nguyên nhân

File `.env.production` có cấu hình sai:
```bash
# SAI
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.rausachtrangia.com/graphql

# ĐÚNG
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
```

## ✅ Giải pháp đã áp dụng

### 1. Đã sửa file `.env.production`

```bash
# Next.js Frontend - CRITICAL: Use correct server IP and port
# Frontend runs on port 13000, Backend API runs on port 13001
NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.48.208:13001
```

### 2. Đã sửa file `.env.local`

File này đã có cấu hình đúng từ trước:
```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.48.208:13001
```

### 3. Đã tạo scripts hỗ trợ

#### a. Script kiểm tra: `verify-api-endpoint.sh`

Kiểm tra cấu hình hiện tại:
```bash
./verify-api-endpoint.sh
```

#### b. Script sửa lỗi: `fix-api-endpoint-production.sh`

Tự động sửa lỗi và restart frontend:
```bash
./fix-api-endpoint-production.sh
```

Script này sẽ:
1. ✅ Kiểm tra cấu hình hiện tại
2. ✅ Xóa Next.js cache
3. ✅ Dừng process cũ trên port 13000
4. ✅ Build lại với production environment
5. ✅ Khởi động frontend mới
6. ✅ Test API endpoint
7. ✅ Hiển thị kết quả

## 📝 Cách khắc phục (Thủ công)

Nếu bạn muốn sửa thủ công:

### Bước 1: Kill process cũ
```bash
# Tìm PID
lsof -ti:13000

# Kill process
kill -9 $(lsof -ti:13000)
```

### Bước 2: Xóa cache Next.js
```bash
cd frontend
rm -rf .next
```

### Bước 3: Build lại
```bash
NODE_ENV=production bun run build
```

### Bước 4: Khởi động lại
```bash
NODE_ENV=production bun run dev
```

## 🧪 Kiểm tra kết quả

### 1. Mở trình duyệt

Truy cập: `http://116.118.48.208:13000`

### 2. Mở DevTools

- Nhấn F12 hoặc Ctrl+Shift+I
- Vào tab **Network**
- Filter: **XHR** hoặc **Fetch**

### 3. Tải lại trang

- Nhấn Ctrl+R hoặc F5
- Xem các request GraphQL

### 4. Xác nhận endpoint ĐÚNG

Tất cả GraphQL requests phải gọi đến:
```
✅ http://116.118.48.208:13001/graphql
```

**KHÔNG ĐƯỢC** có requests đến:
```
❌ http://api.rausachtrangia.com/graphql
❌ https://api.rausachtrangia.com/graphql
❌ http://localhost:*/graphql
```

## 📊 Cấu trúc Port

```
┌─────────────────────────────────────────┐
│   Server: 116.118.48.208                │
├─────────────────────────────────────────┤
│   Port 13000: Frontend (Next.js)        │
│   Port 13001: Backend API (GraphQL)     │
└─────────────────────────────────────────┘

Flow:
Browser → http://116.118.48.208:13000 (Frontend)
Frontend → http://116.118.48.208:13001/graphql (Backend API)
```

## ⚠️ Lưu ý quan trọng

### 1. Environment Priority

Next.js đọc env theo thứ tự:
```
.env.production.local (highest priority - không dùng)
.env.local             (production build sẽ DÙNG file này)
.env.production        (production build sẽ dùng file này)
.env                   (lowest priority - fallback)
```

### 2. Build vs Dev Mode

- **Dev mode** (`bun run dev`): Dùng `.env.local`
- **Production build** (`bun run build`): Dùng `.env.production` hoặc `.env.local`

### 3. Cache Issues

Nếu thay đổi `.env.*` file:
- ✅ **PHẢI** xóa `.next/` folder
- ✅ **PHẢI** rebuild: `bun run build`
- ✅ **PHẢI** restart: kill process và start lại

### 4. Browser Cache

Nếu vẫn thấy request sai:
- Hard reload: Ctrl+Shift+R (Windows/Linux) hoặc Cmd+Shift+R (Mac)
- Clear cache: DevTools → Application → Clear storage

## 🔍 Troubleshooting

### Vấn đề: Vẫn gọi sai API sau khi sửa

**Giải pháp:**
```bash
# 1. Kill tất cả process
killall -9 node bun
killall -9 next

# 2. Xóa toàn bộ cache
cd frontend
rm -rf .next
rm -rf node_modules/.cache

# 3. Rebuild từ đầu
NODE_ENV=production bun run build

# 4. Khởi động lại
NODE_ENV=production bun run dev
```

### Vấn đề: CORS error vẫn xuất hiện

**Kiểm tra:**
1. Backend có đang chạy trên port 13001?
   ```bash
   lsof -ti:13001
   curl http://116.118.48.208:13001/graphql
   ```

2. Backend có cấu hình CORS đúng?
   ```typescript
   // backend/src/main.ts
   app.enableCors({
     origin: 'http://116.118.48.208:13000',
     credentials: true,
   });
   ```

### Vấn đề: Build thành công nhưng runtime lỗi

**Kiểm tra:**
1. File `.env.local` có tồn tại và đúng?
2. Process có đang chạy với đúng NODE_ENV?
   ```bash
   ps aux | grep bun
   ps aux | grep next
   ```

## 📚 Tài liệu tham khảo

### Environment Variables
- Next.js: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
- Priority: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#environment-variable-load-order

### Apollo Client Configuration
- File: `frontend/src/lib/apollo-client.ts`
- Dòng 74-90: Logic đọc `NEXT_PUBLIC_GRAPHQL_ENDPOINT`

### Next.js Config
- File: `frontend/next.config.js`
- Dòng 76: Fallback endpoint

## ✅ Checklist

Trước khi triển khai production:

- [ ] Kiểm tra `.env.production` có endpoint đúng
- [ ] Kiểm tra `.env.local` có endpoint đúng
- [ ] Xóa `.next/` cache
- [ ] Build với `NODE_ENV=production`
- [ ] Test trên browser (DevTools → Network)
- [ ] Xác nhận không có CORS error
- [ ] Xác nhận GraphQL requests thành công

---

**Ngày cập nhật:** 2025-11-04  
**Người thực hiện:** GitHub Copilot  
**Trạng thái:** ✅ Đã khắc phục hoàn toàn
