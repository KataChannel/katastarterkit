# ✅ Fix Bug: Frontend Port 13000 Không Kết Nối API

## 🐛 Vấn Đề

**URL:** http://116.118.48.208:13000/  
**Lỗi:** Frontend không kết nối được API

## 🔍 Nguyên Nhân

### 1. Frontend đang chạy sai PORT
- ❌ **Đang chạy:** Port 12000 (Rausach)
- ✅ **Cần chạy:** Port 13000 (Innerv2)

### 2. File `.env` cấu hình SAI
Frontend `frontend/.env` đang có:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql  # ❌ SAI
NEXT_PUBLIC_BACKEND_URL=http://localhost:12001                # ❌ SAI
```

Phải là:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql  # ✅ ĐÚNG
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001                # ✅ ĐÚNG
```

## ✅ Giải Pháp Đã Áp Dụng

### 1. Tạo file `.env.local` cho Innerv2
File: `frontend/.env.local`
```env
# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
NEXTAUTH_URL=http://116.118.48.208:13000

# Next.js Frontend - Innerv2 Domain (13xxx ports)
NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.48.208:13001

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=897974685698-621ekaodhnha7ssfaml6m1u418ab2ucq.apps.googleusercontent.com
```

### 2. Tạo scripts khởi động

#### `start-frontend-innerv2.sh`
```bash
#!/bin/bash
cd frontend
npm run dev -- -p 13000
```

#### `start-frontend-rausach.sh`
```bash
#!/bin/bash
cd frontend
npm run dev  # Port 12000 (mặc định)
```

## 🚀 Cách Fix

### Bước 1: Dừng Frontend Đang Chạy
Tìm terminal đang chạy `next dev -p 12000` và nhấn **Ctrl+C**

### Bước 2: Khởi Động Lại Đúng Port

**Cho Innerv2 (Port 13000):**
```bash
./start-frontend-innerv2.sh
```

**HOẶC thủ công:**
```bash
cd frontend
npm run dev -- -p 13000
```

### Bước 3: Kiểm Tra

1. Mở trình duyệt: http://116.118.48.208:13000
2. Mở Developer Tools (F12) > Network tab
3. Reload trang (F5)
4. Kiểm tra requests đến:
   - ✅ `http://116.118.48.208:13001/graphql`
   - ❌ KHÔNG phải `localhost` hoặc port `12001`

## 📊 Cấu Hình Đúng

### Innerv2 (13xxx)
| Service | URL |
|---------|-----|
| **Frontend** | http://116.118.48.208:13000 |
| **Backend** | http://116.118.48.208:13001 |
| **GraphQL** | http://116.118.48.208:13001/graphql |
| **Database** | 116.118.48.208:13003 |

### Rausach (12xxx)
| Service | URL |
|---------|-----|
| **Frontend** | http://116.118.48.208:12000 |
| **Backend** | http://116.118.48.208:12001 |
| **GraphQL** | http://116.118.48.208:12001/graphql |
| **Database** | 116.118.48.208:12003 |

## ✅ Kiểm Tra Backend Hoạt Động

```bash
# Test GraphQL endpoint
curl http://116.118.48.208:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__typename}"}'

# Kết quả phải là:
{"data":{"__typename":"Query"}}

# Test CORS
curl -I -X OPTIONS http://116.118.48.208:13001/graphql \
  -H "Origin: http://116.118.48.208:13000"

# Phải thấy header:
Access-Control-Allow-Origin: http://116.118.48.208:13000
```

## 🔧 Troubleshooting

### Frontend vẫn không kết nối API?

1. **Xóa cache Next.js:**
   ```bash
   cd frontend
   rm -rf .next
   ```

2. **Restart frontend:**
   ```bash
   # Dừng (Ctrl+C) và chạy lại
   npm run dev -- -p 13000
   ```

3. **Kiểm tra file .env.local:**
   ```bash
   cat frontend/.env.local | grep GRAPHQL
   # Phải thấy: NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
   ```

4. **Kiểm tra browser console:**
   - Mở F12 > Console
   - Tìm lỗi CORS, network, hoặc 404

### Backend không chạy?

```bash
# Kiểm tra backend process
ps aux | grep "node.*13001"

# Kiểm tra port
ss -tlnp | grep 13001

# Restart backend
cd backend
bun dev
# hoặc: npm run start:dev
```

## 📁 Files Đã Tạo/Sửa

- ✅ `frontend/.env.local` - Config Innerv2
- ✅ `start-frontend-innerv2.sh` - Script khởi động Innerv2
- ✅ `start-frontend-rausach.sh` - Script khởi động Rausach
- ✅ `fix-frontend-api-connection.sh` - Hướng dẫn fix
- ✅ `FIX_FRONTEND_API_CONNECTION.md` - Tài liệu này

## 🎯 Kết Luận

**Root Cause:** Frontend đang chạy sai port (12000 thay vì 13000) và cấu hình API endpoint sai (localhost thay vì IP server)

**Solution:** Tạo `.env.local` với config đúng và restart frontend trên port 13000

**Status:** ✅ FIXED - Cần restart frontend để áp dụng

---

**Ngày fix:** 2025-11-04  
**Files modified:** 5  
**Scripts created:** 3
