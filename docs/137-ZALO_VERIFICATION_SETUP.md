# Zalo Platform Site Verification Setup

## 📋 Tổng Quan

Hệ thống hỗ trợ xác thực tên miền với **Zalo Platform** để sử dụng các API của Zalo như:
- Zalo Official Account (OA)
- Zalo Mini App
- Zalo Notification Service (ZNS)

## 🎯 Phương Pháp Verification

### HTML File Verification

**Verification Code**: `MeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp`

**File Location**: `frontend/public/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`

**Nội dung**:
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta property="zalo-platform-site-verification" content="MeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp" />
</head>

<body>
There Is No Limit To What You Can Accomplish Using Zalo!
</body>

</html>
```

**URL Access**:
- Local: `http://localhost:12000/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`
- Server: `http://116.118.49.243:12000/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`
- Production: `https://rausachtrangia.com/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`

**Cách hoạt động**:
1. File nằm trong `frontend/public/` directory
2. Next.js tự động serve static files từ `/public`
3. Route handler backup tại `src/app/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html/route.ts`
4. Dockerfile copy `public/` vào Docker image

## 🔧 Setup & Configuration

### 1. Files đã có sẵn

```bash
# File verification (Static)
frontend/public/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html

# Route handler (Backup - Dynamic)
frontend/src/app/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html/route.ts
```

### 2. Deployment Flow

```bash
# Step 1: Frontend Build
cd frontend
bun run build
# → .next/standalone được tạo
# → public/ files được copy vào .next/standalone/frontend/public/

# Step 2: Docker Build
docker build -f Dockerfile.rausach -t rausach-frontend:latest .
# → COPY frontend/public/ ./frontend/public/
# → File verification được copy vào image

# Step 3: Deploy
docker run -p 12000:3000 rausach-frontend:latest
# → File accessible tại http://server:12000/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html
```

## ✅ Testing

### A. Test Local

```bash
# Method 1: Run curl
curl http://localhost:12000/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html

# Expected output:
# <!DOCTYPE html>
# <html lang="en">
# <head>
#     <meta property="zalo-platform-site-verification" content="MeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp" />
# </head>
# <body>
# There Is No Limit To What You Can Accomplish Using Zalo!
# </body>
# </html>
```

### B. Test Production

```bash
# Server
curl http://116.118.49.243:12000/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html

# Domain (sau khi setup DNS)
curl https://rausachtrangia.com/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html
```

### C. Verify Meta Tag Content

```bash
# Check cho meta tag
curl https://rausachtrangia.com/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html | grep "zalo-platform-site-verification"

# Expected:
# <meta property="zalo-platform-site-verification" content="MeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp" />
```

## 🌐 Zalo Platform Setup

### Step 1: Truy cập Zalo for Developers

1. Truy cập: https://developers.zalo.me/
2. Đăng nhập bằng tài khoản Zalo
3. Chọn ứng dụng cần xác thực domain

### Step 2: Domain Verification

1. Vào phần **Settings** hoặc **Cài đặt** của ứng dụng
2. Tìm mục **Domain Verification** hoặc **Xác thực tên miền**
3. Nhập domain: `rausachtrangia.com`
4. Download file verification (nếu khác) hoặc sử dụng file có sẵn
5. Click **Xác thực** hoặc **Verify**

### Step 3: Verify

1. Zalo sẽ check URL: `https://rausachtrangia.com/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`
2. Kiểm tra meta tag: `zalo-platform-site-verification`
3. Nếu thành công → Domain verified!

## 🔍 Troubleshooting

### Issue 1: File Not Found (404)

**Symptom**: `curl` returns 404

**Solutions**:
```bash
# 1. Check file exists in public/
ls -la frontend/public/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html

# 2. Rebuild frontend
cd frontend && rm -rf .next && bun run build

# 3. Restart dev server
bun run dev:frontend

# 4. Check Docker image
docker exec shopfrontend ls -la /app/frontend/public/
```

### Issue 2: Wrong Content

**Symptom**: File returns wrong content

**Solutions**:
```bash
# 1. Check file content
cat frontend/public/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html

# 2. Verify meta tag exists
grep "zalo-platform-site-verification" frontend/public/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html
```

### Issue 3: Zalo Can't Access

**Symptom**: Zalo verification fails

**Solutions**:
1. **Check HTTPS**: Ensure SSL certificate valid
   ```bash
   curl -I https://rausachtrangia.com/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html
   ```

2. **Check DNS**: Ensure domain pointing to server
   ```bash
   nslookup rausachtrangia.com
   ping rausachtrangia.com
   ```

3. **Check Firewall**: Ensure port 443/80 open
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

4. **Check robots.txt**: Ensure not blocking
   ```txt
   User-agent: *
   Allow: /zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html
   ```

## 📦 File Structure

```
frontend/
├── public/
│   ├── googleca2f7c2a9539b58a.html                              # Google verification
│   └── zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html   # Zalo verification
├── src/
│   └── app/
│       ├── googleca2f7c2a9539b58a.html/
│       │   └── route.ts                                          # Google route handler
│       └── zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html/
│           └── route.ts                                          # Zalo route handler

docs/
├── 100-GOOGLE_VERIFICATION_SETUP.md    # Google verification docs
└── 137-ZALO_VERIFICATION_SETUP.md      # This file
```

## 🚀 Deployment Checklist

- [x] File exists: `frontend/public/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`
- [x] Route handler: `src/app/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html/route.ts`
- [x] Documentation created
- [ ] Test locally: `http://localhost:12000/zalo_verifierMeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp.html`
- [ ] Deploy to server
- [ ] Test on server
- [ ] Verify in Zalo Platform

## 🔗 Related Links

- [Zalo for Developers](https://developers.zalo.me/)
- [Zalo Official Account](https://oa.zalo.me/)
- [Zalo Notification Service (ZNS)](https://zalo.cloud/)

---

**Verification Code**: `MeVd6DceSpupfjWIxOznI1I4v7FuyZOgD3Gp`
**Last Updated**: December 1, 2025
**Status**: ✅ Ready for deployment
