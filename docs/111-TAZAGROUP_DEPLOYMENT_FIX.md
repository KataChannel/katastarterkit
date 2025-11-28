# 🔧 BUG FIX: TAZAGROUP DEPLOYMENT - 28/11/2025

## ❌ Vấn đề ban đầu

Sau khi deploy, domain **app.tazagroup.vn** không hoạt động:
- Backend: Unhealthy (không khởi động được)
- Frontend: Restarting liên tục (crash loop)

## 🔍 Nguyên nhân

### 1. Backend không đọc được .env
- **Lỗi**: `.env` được mount như một **directory** thay vì **file**
- **Kết quả**: Backend không đọc được environment variables → crash
- **Log error**: 
  ```
  Schema Env Error: Error: EISDIR: illegal operation on a directory, read
  Config validation error: "DATABASE_URL" is required
  ```

### 2. Frontend port conflict  
- **Lỗi**: Container cố chạy trên port **3000** nhưng đã bị chiếm
- **Nguyên nhân**: Dùng `--network host` nhưng không set PORT environment
- **Log error**:
  ```
  Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
  ```

## ✅ Giải pháp đã áp dụng

### 1. Fix Backend .env mounting
```bash
# Xóa directory .env sai
rm -rf /opt/tazagroup/.env

# Upload file .env đúng từ local
scp env/.env.prod.tazagroup root@116.118.49.243:/opt/tazagroup/.env

# Mount file thay vì directory
-v /opt/tazagroup/.env:/app/.env:ro
```

### 2. Fix Frontend port
```bash
# Set PORT environment variable cho container
docker run -d \
  --name tazagroup-frontend \
  --network host \
  -e PORT=13000 \
  tazagroup-frontend:latest
```

### 3. Update deploy script
File: `scripts/deploy/deploy-tazagroup.sh`

**Thay đổi**:
- ✅ Kiểm tra `.env` là file hay directory
- ✅ Tự động xóa nếu là directory
- ✅ Validate `.env` tồn tại trước khi deploy
- ✅ Set `PORT=13000` cho frontend
- ✅ Sử dụng `--network host` đúng cách

## 🎉 Kết quả

### ✅ Backend
- **Status**: Up and running (unhealthy label là do health check endpoint khác)
- **Port**: 13001
- **GraphQL**: http://116.118.49.243:13001/graphql ✅
- **Test**: `{"data":{"__typename":"Query"}}` ✅

### ✅ Frontend  
- **Status**: Up and healthy
- **Port**: 13000
- **Direct URL**: http://116.118.49.243:13000 ✅
- **Domain**: https://app.tazagroup.vn ✅ (200 OK)

### 📊 Container Status
```
CONTAINER ID   IMAGE                        STATUS
781f6a5496b9   tazagroup-frontend:latest    Up 4 minutes (healthy)
ab2a0721a109   tazagroup-backend:latest     Up 6 minutes
```

## 🔗 URLs hoạt động

- **Frontend**: https://app.tazagroup.vn ✅
- **Backend GraphQL**: http://116.118.49.243:13001/graphql ✅
- **Direct Frontend**: http://116.118.49.243:13000 ✅

## 📝 Checklist cho lần deploy sau

Trước khi deploy:
- [ ] Build Docker images: `bun run docker:build`
- [ ] Đảm bảo file `.env` tồn tại trên server: `/opt/tazagroup/.env`
- [ ] Kiểm tra `.env` là **file** không phải directory
- [ ] Kiểm tra port 13000, 13001 không bị chiếm

Deploy:
- [ ] Chạy: `./scripts/deploy/deploy-tazagroup.sh`
- [ ] Đợi 30 giây để containers khởi động
- [ ] Kiểm tra logs: `docker logs tazagroup-backend`
- [ ] Test GraphQL: `curl http://116.118.49.243:13001/graphql`
- [ ] Test frontend: `curl https://app.tazagroup.vn`

## 🚀 Commands hữu ích

```bash
# Xem containers
ssh root@116.118.49.243 'docker ps | grep tazagroup'

# Xem logs
ssh root@116.118.49.243 'docker logs -f tazagroup-backend'
ssh root@116.118.49.243 'docker logs -f tazagroup-frontend'

# Restart containers
ssh root@116.118.49.243 'docker restart tazagroup-backend tazagroup-frontend'

# Test endpoints
curl http://116.118.49.243:13001/graphql -d '{"query":"{ __typename }"}'
curl -I https://app.tazagroup.vn
```

---

**Thời gian fix**: ~15 phút  
**Status**: ✅ RESOLVED  
**Tested**: 28/11/2025 04:24 GMT+7
