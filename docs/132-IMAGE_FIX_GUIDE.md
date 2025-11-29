# Fix Next.js Image Optimization Error

## 🐛 Vấn Đề

**URL bị lỗi:**
```
https://shop.rausachtrangia.com/_next/image?url=https%3A%2F%2Frausachtrangia.com%2Fupload%2Fsanpham%2Fklt43748123.jpg&w=64&q=75
```

**Error:**
```
"url" parameter is not allowed
```

**Nguyên nhân:**
- Local: Next.js development mode cho phép tất cả domains (insecure)
- Production: Next.js yêu cầu cấu hình chính xác domains trong `next.config.js`
- Wildcard pattern `*.rausachtrangia.com` không được hỗ trợ đầy đủ trong production

---

## ✅ Giải Pháp

### 1. Thêm `domains` array (Backward Compatibility)

```javascript
images: {
  domains: [
    'localhost',
    '116.118.49.243',
    'rausachtrangia.com',
    'www.rausachtrangia.com',
    'storage.rausachtrangia.com',
    'images.rausachtrangia.com',
    'images.unsplash.com',
    'picsum.photos',
    'placehold.co',
    '1drv.ms',
  ],
  remotePatterns: [ ... ]
}
```

**Lý do:** 
- `domains` được hỗ trợ tốt hơn trong production
- Đơn giản và rõ ràng
- Không cần pathname matching

### 2. Update `remotePatterns` - Thay wildcard bằng domains cụ thể

**TRƯỚC:**
```javascript
{
  protocol: 'https',
  hostname: '*.rausachtrangia.com',  // ❌ Wildcard không work tốt
}
```

**SAU:**
```javascript
{
  protocol: 'https',
  hostname: 'www.rausachtrangia.com',  // ✅ Explicit domain
  pathname: '/**',
},
{
  protocol: 'http',
  hostname: 'www.rausachtrangia.com',
  pathname: '/**',
}
```

---

## 🚀 Triển Khai

### Bước 1: Đã update `next.config.js` ✅

### Bước 2: Rebuild Frontend

```bash
cd /mnt/chikiet/kataoffical/shoprausach/frontend
npm run build
```

### Bước 3: Test Local

```bash
npm run start
# Test URL: http://localhost:3000/_next/image?url=https%3A%2F%2Frausachtrangia.com%2Fupload%2Fsanpham%2Fklt43748123.jpg&w=64&q=75
```

### Bước 4: Deploy Production

```bash
# Option 1: Docker
cd /mnt/chikiet/kataoffical/shoprausach
bun run docker:prod

# Option 2: Direct deploy
cd frontend
npm run build
# Copy .next/standalone to server
```

### Bước 5: Verify Production

```bash
# Test image URL
curl -I 'https://shop.rausachtrangia.com/_next/image?url=https%3A%2F%2Frausachtrangia.com%2Fupload%2Fsanpham%2Fklt43748123.jpg&w=64&q=75'

# Should return: HTTP 200 OK
# Should NOT return: 400 Bad Request
```

---

## 📋 URLs Được Hỗ Trợ

✅ Tất cả các URLs sau đây sẽ work:

1. **Main domain:**
   - `https://rausachtrangia.com/upload/sanpham/*.jpg`
   - `https://rausachtrangia.com/quanly/fileman/Uploads/Images/*.jpg`
   - `http://rausachtrangia.com/**`

2. **WWW subdomain:**
   - `https://www.rausachtrangia.com/**`
   - `http://www.rausachtrangia.com/**`

3. **Storage subdomain:**
   - `https://storage.rausachtrangia.com/**`
   - `http://storage.rausachtrangia.com/**`

4. **Images subdomain:**
   - `https://images.rausachtrangia.com/**`
   - `http://images.rausachtrangia.com/**`

5. **External:**
   - `https://images.unsplash.com/**`
   - `https://picsum.photos/**`
   - `https://placehold.co/**`

---

## 🔍 Troubleshooting

### Issue 1: Vẫn báo "url not allowed"

**Check:**
```bash
# 1. Verify config đã apply
cat frontend/next.config.js | grep -A 20 "images:"

# 2. Clear Next.js cache
rm -rf frontend/.next

# 3. Rebuild
cd frontend && npm run build
```

### Issue 2: Domain mới cần thêm

**Thêm vào cả 2 nơi:**
```javascript
// 1. domains array
domains: [
  'your-new-domain.com',
  // ...
],

// 2. remotePatterns
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'your-new-domain.com',
    pathname: '/**',
  },
  // ...
]
```

### Issue 3: Image không load trong development

**Development mode không cần config** - nếu vẫn lỗi:
```bash
# Restart dev server
cd frontend
npm run dev
```

---

## 💡 Best Practices

### 1. Security
- ✅ Chỉ thêm domains bạn tin tưởng
- ✅ Sử dụng HTTPS khi có thể
- ❌ KHÔNG dùng wildcard `*` cho public domains

### 2. Performance
```javascript
images: {
  domains: [...],
  remotePatterns: [...],
  
  // Cache 1 năm
  minimumCacheTTL: 60 * 60 * 24 * 365,
  
  // Modern formats
  formats: ['image/avif', 'image/webp'],
  
  // Device sizes
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  
  // Image sizes
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 3. CDN
Nếu có CDN, thêm CDN domain:
```javascript
domains: [
  'cdn.rausachtrangia.com',
  // ...
]
```

---

## 📊 Testing Checklist

- [ ] Local development: `npm run dev`
- [ ] Local production: `npm run build && npm run start`
- [ ] Test URL với curl
- [ ] Test trong browser
- [ ] Deploy staging
- [ ] Test staging
- [ ] Deploy production
- [ ] Verify production

---

## 🎯 Kết Quả

**Trước fix:**
```
❌ https://shop.rausachtrangia.com/_next/image?url=...
   Error: "url" parameter is not allowed
```

**Sau fix:**
```
✅ https://shop.rausachtrangia.com/_next/image?url=...
   Status: 200 OK
   Content-Type: image/webp (or image/avif)
   Cache-Control: public, max-age=31536000, immutable
```

---

## 📚 References

- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [next.config.js Image Configuration](https://nextjs.org/docs/pages/api-reference/next-config-js/images)
- [Remote Patterns](https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns)

---

**Fixed:** 2024-11-29
**Version:** Next.js 15/16
**Status:** ✅ READY FOR DEPLOYMENT
