# Google Search Console Verification Setup

## 📋 Tổng Quan

Hệ thống hỗ trợ **2 phương pháp** xác thực Google Search Console:
1. ✅ **HTML File Verification** - File verification tại `/googleca2f7c2a9539b58a.html`
2. ✅ **HTML Meta Tag** - Meta tag trong `<head>` của website

## 🎯 Phương Pháp Verification

### Phương Pháp 1: HTML File (Recommended)

**File Location**: `frontend/public/googleca2f7c2a9539b58a.html`

**Nội dung**:
```html
google-site-verification: googleca2f7c2a9539b58a.html
```

**URL Access**:
- Local: `http://localhost:12000/googleca2f7c2a9539b58a.html`
- Server: `http://116.118.49.243:12000/googleca2f7c2a9539b58a.html`
- Production: `https://rausachtrangia.com/googleca2f7c2a9539b58a.html`

**Cách hoạt động**:
1. File nằm trong `frontend/public/` directory
2. Next.js tự động serve static files từ `/public`
3. Dockerfile copy `public/` vào Docker image
4. Route handler backup tại `src/app/googleca2f7c2a9539b58a.html/route.ts`

### Phương Pháp 2: HTML Meta Tag

**Meta Tag** (tự động thêm vào `<head>`):
```html
<meta name="google-site-verification" content="googleca2f7c2a9539b58a" />
```

**Cách hoạt động**:
1. Setting trong database: `seo.google_site_verification = 'googleca2f7c2a9539b58a'`
2. `lib/metadata.ts` fetch setting và thêm vào metadata
3. Next.js render meta tag trong `<head>`

## 🔧 Setup & Configuration

### 1. File đã có sẵn

```bash
# File verification
frontend/public/googleca2f7c2a9539b58a.html

# Route handler (backup)
frontend/src/app/googleca2f7c2a9539b58a.html/route.ts

# Test script
scripts/test-google-verification.sh
```

### 2. Database Setting

Setting đã được seed vào database:

```typescript
{
  key: 'seo.google_site_verification',
  value: 'googleca2f7c2a9539b58a',
  type: 'TEXT',
  category: 'SEO',
  label: 'Google Site Verification',
  description: 'Google Search Console verification code',
}
```

### 3. Deployment Flow

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
# → File accessible tại http://server:12000/googleca2f7c2a9539b58a.html
```

## ✅ Testing

### A. Test Local

```bash
# Method 1: Run test script
./scripts/test-google-verification.sh

# Method 2: Manual curl
curl http://localhost:12000/googleca2f7c2a9539b58a.html

# Expected output:
# google-site-verification: googleca2f7c2a9539b58a.html
```

### B. Test Production

```bash
# Server
curl http://116.118.49.243:12000/googleca2f7c2a9539b58a.html

# Domain (sau khi setup DNS)
curl https://rausachtrangia.com/googleca2f7c2a9539b58a.html
```

### C. Test Meta Tag

```bash
# Check HTML source
curl https://rausachtrangia.com | grep "google-site-verification"

# Expected:
# <meta name="google-site-verification" content="googleca2f7c2a9539b58a" />
```

## 🌐 Google Search Console Setup

### Step 1: Add Property

1. Truy cập: https://search.google.com/search-console
2. Click "Add property"
3. Nhập domain: `rausachtrangia.com`

### Step 2: Choose Verification Method

**Option A: HTML file upload**
1. Select "HTML file"
2. Download file (nếu khác)
3. Upload: `googleca2f7c2a9539b58a.html`
4. Click "Verify"

**Option B: HTML tag**
1. Select "HTML tag"
2. Copy meta tag
3. Paste vào `<head>` (đã tự động)
4. Click "Verify"

### Step 3: Verify

1. Click "Verify" button
2. Google sẽ check:
   - File: `https://rausachtrangia.com/googleca2f7c2a9539b58a.html`
   - Or Meta tag trong `<head>`
3. Nếu thành công → Property added!

## 🔍 Troubleshooting

### Issue 1: File Not Found (404)

**Symptom**: `curl` returns 404

**Solutions**:
```bash
# 1. Check file exists in public/
ls -la frontend/public/googleca2f7c2a9539b58a.html

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
cat frontend/public/googleca2f7c2a9539b58a.html

# Should be exactly:
# google-site-verification: googleca2f7c2a9539b58a.html

# 2. Fix if wrong
echo "google-site-verification: googleca2f7c2a9539b58a.html" > frontend/public/googleca2f7c2a9539b58a.html
```

### Issue 3: Meta Tag Not Found

**Symptom**: No meta tag in HTML

**Solutions**:
```bash
# 1. Check database setting
bun backend/src/seed/seed-website-settings.ts

# 2. Verify in admin panel
# Go to: /admin/settings/website → SEO → Google Site Verification

# 3. Check metadata.ts
# Ensure verification field is added

# 4. Clear cache
# Restart both backend and frontend
```

### Issue 4: Google Can't Access

**Symptom**: Google verification fails

**Solutions**:
1. **Check robots.txt**: Ensure not blocking Googlebot
   ```txt
   User-agent: Googlebot
   Allow: /googleca2f7c2a9539b58a.html
   ```

2. **Check HTTPS**: Ensure SSL certificate valid
   ```bash
   curl -I https://rausachtrangia.com/googleca2f7c2a9539b58a.html
   ```

3. **Check DNS**: Ensure domain pointing to server
   ```bash
   nslookup rausachtrangia.com
   ping rausachtrangia.com
   ```

4. **Check Firewall**: Ensure port 443/80 open
   ```bash
   # On server
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

## 📦 File Structure

```
frontend/
├── public/
│   └── googleca2f7c2a9539b58a.html      # Verification file
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Uses generateMetadata
│   │   └── googleca2f7c2a9539b58a.html/
│   │       └── route.ts                  # Route handler backup
│   └── lib/
│       └── metadata.ts                   # Adds meta tag

backend/
└── src/
    └── seed/
        └── seed-website-settings.ts      # Seeds verification setting

scripts/
└── test-google-verification.sh           # Test script

Dockerfile.rausach                         # Copies public/ files
```

## 🚀 Deployment Checklist

- [x] File exists: `frontend/public/googleca2f7c2a9539b58a.html`
- [x] Route handler: `src/app/googleca2f7c2a9539b58a.html/route.ts`
- [x] Database setting seeded
- [x] Meta tag added via metadata.ts
- [x] Dockerfile copies public/ files
- [x] Test script created
- [ ] Test locally: `http://localhost:12000/googleca2f7c2a9539b58a.html`
- [ ] Deploy to server
- [ ] Test on server: `http://116.118.49.243:12000/googleca2f7c2a9539b58a.html`
- [ ] Setup DNS pointing to server
- [ ] Test on domain: `https://rausachtrangia.com/googleca2f7c2a9539b58a.html`
- [ ] Verify in Google Search Console

## 📊 Verification Methods Comparison

| Method | Pros | Cons | Recommended |
|--------|------|------|-------------|
| **HTML File** | ✅ Simple<br>✅ No code changes<br>✅ Easy to remove | ❌ One more file to maintain | ⭐⭐⭐⭐⭐ |
| **Meta Tag** | ✅ Dynamic from DB<br>✅ No file needed<br>✅ Centralized config | ❌ Requires DB setting<br>❌ Cache issues | ⭐⭐⭐⭐ |
| **DNS TXT** | ✅ Universal<br>✅ Works for all subdomains | ❌ Requires DNS access<br>❌ Propagation delay | ⭐⭐⭐ |
| **Google Analytics** | ✅ Already have GA | ❌ Requires GA setup first | ⭐⭐ |

## 💡 Best Practices

1. **Keep Both Methods**: File + Meta tag for redundancy
2. **Don't Delete File**: After verification, keep file for re-verification
3. **Version Control**: Commit verification file to git
4. **Monitor**: Set up alerts if verification fails
5. **Document**: Keep verification code in secure notes

## 🔐 Security Notes

- ✅ Verification code is public (safe to share)
- ✅ File has no sensitive data
- ✅ Read-only access only
- ⚠️ Don't remove file after verification (Google re-checks)

## 📝 Related Documentation

- [Google Search Console Help](https://support.google.com/webmasters/answer/9008080)
- [Next.js Static Files](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

---

**Last Updated**: November 27, 2025
**Status**: ✅ Ready for deployment
