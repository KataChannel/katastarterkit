# 🔧 API.TAZAGROUP.VN - SETUP & FIX - 28/11/2025

## 📋 Tổng quan

Domain API cho TAZAGROUP backend có 2 options:
1. **`appapi.tazagroup.vn`** ✅ - Đã setup, có SSL, hoạt động
2. **`api.tazagroup.vn`** ⚠️ - Mới setup, HTTP only, chờ DNS update

## ✅ Domain đang hoạt động: appapi.tazagroup.vn

### Status
- **HTTP**: Redirect → HTTPS ✅
- **HTTPS**: 200 OK ✅  
- **SSL**: Let's Encrypt certificate ✅
- **GraphQL**: https://appapi.tazagroup.vn/graphql ✅

### Test
```bash
# Test GraphQL
curl -X POST https://appapi.tazagroup.vn/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Response: {"data":{"__typename":"Query"}}
```

### Configuration
- **File**: `/etc/nginx/sites-enabled/appapi.tazagroup.vn`
- **Backend**: `http://116.118.49.243:13001`
- **CORS**: Configured for `https://app.tazagroup.vn`
- **SSL**: `/etc/letsencrypt/live/appapi.tazagroup.vn/`

---

## ⚠️ Domain mới setup: api.tazagroup.vn

### Status
- **HTTP**: 404 (DNS chưa trỏ đúng) ⚠️
- **HTTPS**: Chưa có SSL certificate ❌
- **Backend**: Proxy tới port 13001 ✅ (config đã có)

### Vấn đề

#### DNS không trỏ đúng
```bash
# Domain đang trỏ về:
api.tazagroup.vn → 103.221.222.71 ❌

# Cần trỏ về:
api.tazagroup.vn → 116.118.49.243 ✅
```

### Giải pháp

#### Bước 1: Update DNS (Cần làm)
Vào quản lý DNS và tạo A record:
```
Type: A
Name: api
Value: 116.118.49.243
TTL: 300
```

#### Bước 2: Chờ DNS propagate
```bash
# Kiểm tra DNS đã update chưa (chạy trên local)
dig api.tazagroup.vn +short

# Nên trả về: 116.118.49.243
```

#### Bước 3: Tạo SSL certificate (Sau khi DNS OK)
```bash
ssh root@116.118.49.243
certbot --nginx -d api.tazagroup.vn --non-interactive --agree-tos --email admin@tazagroup.vn --redirect
```

#### Bước 4: Update Nginx config để bật HTTPS
Sau khi có SSL, Certbot sẽ tự động update config thêm block HTTPS.

---

## 🎯 Recommendation

### Option 1: Dùng appapi.tazagroup.vn (Recommended ✅)
- ✅ Đã hoạt động
- ✅ Có SSL
- ✅ Không cần thay đổi gì

**Frontend config**:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://appapi.tazagroup.vn/graphql
```

### Option 2: Chuyển sang api.tazagroup.vn (Cần update DNS)
Nếu muốn domain ngắn hơn:
1. Update DNS: api.tazagroup.vn → 116.118.49.243
2. Chờ DNS propagate (5-60 phút)
3. Chạy certbot để có SSL
4. Update frontend config

**Frontend config** (sau khi có SSL):
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.tazagroup.vn/graphql
```

---

## 📊 Backend Container Status

```bash
# Container đang chạy
docker ps | grep tazagroup-backend

# Output:
ab2a0721a109   tazagroup-backend:latest   Up 10 minutes   tazagroup-backend
```

**Backend Info**:
- **Port**: 13001
- **Status**: Running ✅
- **Health**: OK (GraphQL responding)
- **Database**: Connected to 127.0.0.1:12003 ✅
- **Redis**: Connected to 127.0.0.1:12004 ✅
- **MinIO**: Connected ✅

---

## 🔗 URLs Summary

### ✅ Working URLs
| URL | Status | Use Case |
|-----|--------|----------|
| https://app.tazagroup.vn | ✅ 200 | Frontend |
| https://appapi.tazagroup.vn/graphql | ✅ 200 | Backend API |
| http://116.118.49.243:13000 | ✅ 200 | Frontend direct |
| http://116.118.49.243:13001/graphql | ✅ 200 | Backend direct |

### ⚠️ Pending URLs (Cần DNS update)
| URL | Status | Issue |
|-----|--------|-------|
| http://api.tazagroup.vn | ❌ 404 | DNS trỏ sai IP |
| https://api.tazagroup.vn | ❌ N/A | Chưa có SSL |

---

## 🧪 Testing Commands

### Test Backend trực tiếp (IP)
```bash
# Health check (NestJS không có /health endpoint mặc định)
curl http://116.118.49.243:13001/

# GraphQL introspection
curl -X POST http://116.118.49.243:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### Test qua Domain
```bash
# appapi.tazagroup.vn (Working)
curl -X POST https://appapi.tazagroup.vn/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# api.tazagroup.vn (Pending DNS)
# Sẽ hoạt động sau khi DNS update
```

---

## 📝 Next Steps

### Ngay lập tức
- [x] Backend container running ✅
- [x] appapi.tazagroup.vn working ✅
- [x] Nginx config for api.tazagroup.vn created ✅

### Cần làm (nếu muốn dùng api.tazagroup.vn)
- [ ] Update DNS: api.tazagroup.vn → 116.118.49.243
- [ ] Chờ DNS propagate (5-60 phút)
- [ ] Run certbot để có SSL
- [ ] Test lại domain

### Hoặc (Recommended)
- [x] Dùng appapi.tazagroup.vn - đã sẵn sàng! ✅

---

## 🚀 Frontend Integration

Update file `.env` của frontend:

```bash
# Option 1: Dùng appapi (Recommended - Đã có SSL)
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://appapi.tazagroup.vn/graphql

# Option 2: Dùng api (Sau khi DNS + SSL OK)
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.tazagroup.vn/graphql
```

---

**Status**: ✅ Backend working với domain **appapi.tazagroup.vn**  
**Updated**: 28/11/2025 04:35 GMT+7  
**Note**: Domain **api.tazagroup.vn** chờ DNS update để hoạt động
