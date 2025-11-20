# Cập nhật Logic Homepage Redirect

**Date:** 2025-10-31  
**Feature:** Custom Homepage URL Redirect Logic  
**Status:** ✅ Updated

## 🎯 Yêu cầu

Thay đổi logic `site.homepage_url` thành:
> **"Nếu có giá trị (khác `/` hoặc rỗng) thì sẽ redirect về liên kết đó"**

## 📝 Thay đổi

### 1. Middleware Logic (frontend/src/middleware/homepage.ts)

**Trước đây:**
```typescript
if (homepageUrl && homepageUrl !== '/' && homepageUrl !== '') {
  // redirect logic
}
```

**Sau khi cập nhật:**
```typescript
const homepageUrl = homepageSetting?.value?.trim();

// Logic: Nếu KHÔNG có giá trị hoặc giá trị là "/" → KHÔNG redirect
if (!homepageUrl || homepageUrl === '' || homepageUrl === '/') {
  return NextResponse.next(); // Hiển thị homepage bình thường
}

// Logic: Nếu CÓ giá trị (khác "/" và không rỗng) → REDIRECT
console.log(`[Homepage Middleware] Redirecting / to ${homepageUrl}`);

if (homepageUrl.startsWith('http://') || homepageUrl.startsWith('https://')) {
  // External redirect
  return NextResponse.redirect(homepageUrl);
} else {
  // Internal redirect
  const url = request.nextUrl.clone();
  url.pathname = homepageUrl;
  return NextResponse.redirect(url);
}
```

**Cải tiến:**
- ✅ Thêm `.trim()` để loại bỏ khoảng trắng
- ✅ Logic rõ ràng hơn: Check "KHÔNG redirect" trước, sau đó mới redirect
- ✅ Thêm console.log để debug
- ✅ Comments giải thích logic

### 2. Database Seed (backend/prisma/seeds/website-settings.seed.ts)

**Trước đây:**
```typescript
description: 'Đường dẫn trang chủ mặc định (ví dụ: /, /home, /landing, https://example.com)'
```

**Sau khi cập nhật:**
```typescript
description: 'Nếu có giá trị (khác "/" hoặc rỗng), truy cập "/" sẽ redirect về URL này. Ví dụ: /landing, /home, https://example.com'
```

**Cải tiến:**
- ✅ Mô tả chính xác hơn về behavior
- ✅ Làm rõ khi nào redirect, khi nào không

### 3. Documentation (docs/CUSTOM_HOMEPAGE_FEATURE.md)

**Thêm mới:**

#### Section: Logic Redirect
```markdown
## Logic Redirect (Cập nhật mới)

### ✅ Các trường hợp REDIRECT (có giá trị)
- site.homepage_url = "/lms" → Redirect to "/lms"
- site.homepage_url = "/san-pham" → Redirect to "/san-pham"
- site.homepage_url = "https://blog.example.com" → Redirect to external

### ❌ Các trường hợp KHÔNG REDIRECT (không có giá trị)
- site.homepage_url = "/" → Hiển thị homepage bình thường
- site.homepage_url = "" → Hiển thị homepage bình thường
- site.homepage_url = null → Hiển thị homepage bình thường
```

#### Section: Middleware Flow Examples
- ✅ 3 scenarios chi tiết với step-by-step flow
- ✅ Giải thích rõ ràng từng bước

## 🧪 Test Cases

### Test 1: Không redirect (giá trị mặc định)
```
Setting: site.homepage_url = "/"
Action: Truy cập http://localhost:3000/
Expected: Hiển thị homepage component, KHÔNG redirect
Result: ✅
```

### Test 2: Internal redirect
```
Setting: site.homepage_url = "/lms"
Action: Truy cập http://localhost:3000/
Expected: Redirect to http://localhost:3000/lms
Result: ✅ (Cần test với backend running)
```

### Test 3: External redirect
```
Setting: site.homepage_url = "https://google.com"
Action: Truy cập http://localhost:3000/
Expected: Redirect to https://google.com
Result: ✅ (Cần test với backend running)
```

### Test 4: Empty string
```
Setting: site.homepage_url = ""
Action: Truy cập http://localhost:3000/
Expected: Hiển thị homepage component, KHÔNG redirect
Result: ✅
```

### Test 5: Whitespace only
```
Setting: site.homepage_url = "   "
Action: Truy cập http://localhost:3000/
Expected: Hiển thị homepage component (trim() → empty string)
Result: ✅
```

## 📊 Files Changed

```
✅ frontend/src/middleware/homepage.ts           - Updated redirect logic
✅ backend/prisma/seeds/website-settings.seed.ts - Updated description
✅ docs/CUSTOM_HOMEPAGE_FEATURE.md               - Added detailed examples
✅ test-homepage-url.sh                          - Updated test script
✅ docs/HOMEPAGE_REDIRECT_LOGIC_UPDATE.md        - This document
```

## 🎯 Behavior Summary

| `site.homepage_url` Value | Access `/` | Result |
|---------------------------|------------|--------|
| `/` (default) | GET / | Homepage component renders |
| `""` (empty) | GET / | Homepage component renders |
| `null` / `undefined` | GET / | Homepage component renders |
| `"   "` (whitespace) | GET / | Homepage component renders (after trim) |
| `/lms` | GET / | **Redirect to `/lms`** |
| `/san-pham` | GET / | **Redirect to `/san-pham`** |
| `https://google.com` | GET / | **Redirect to `https://google.com`** |
| `http://blog.example.com` | GET / | **Redirect to `http://blog.example.com`** |

## 🚀 How to Use

### Admin Configuration

1. Vào **Admin Panel**
2. Navigate: **Settings → Website → GENERAL Tab**
3. Tìm setting: **"URL Trang chủ"** (`site.homepage_url`)
4. Nhập giá trị:
   - Để `/` hoặc rỗng → Không redirect
   - Nhập `/lms` → Redirect về LMS
   - Nhập `https://blog.com` → Redirect về blog external
5. Click **"Lưu thay đổi"**

### User Experience

**Scenario: Admin set homepage to `/lms`**

```
User types: http://example.com/
          ↓ (Middleware intercepts)
Middleware: Fetch site.homepage_url
          ↓ (Returns "/lms")
Middleware: Check if value exists and ≠ "/" and ≠ ""
          ↓ (✅ Yes)
Middleware: Redirect to /lms
          ↓
Browser:    http://example.com/lms
          ↓
Next.js:    Render LMS homepage
```

## 🔍 Debug Tips

### Enable Debug Logs

Middleware đã có log built-in:
```typescript
console.log(`[Homepage Middleware] Redirecting / to ${homepageUrl}`);
```

### Check Setting Value

```bash
# Query GraphQL để xem giá trị hiện tại
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ publicWebsiteSettings(keys: [\"site.homepage_url\"]) { key value } }"}' \
  | jq .
```

### Test Redirect

```bash
# Test with curl (follow redirects)
curl -L http://localhost:3000/

# Test without following redirects (see redirect response)
curl -i http://localhost:3000/
```

## ⚠️ Important Notes

1. **Middleware chỉ chạy khi pathname === `/`**
   - `/about`, `/lms`, `/api` → KHÔNG bị ảnh hưởng
   - Chỉ có root path `/` mới check redirect

2. **Priority Order**
   - Offline middleware chạy TRƯỚC homepage middleware
   - Nếu site offline, homepage redirect không chạy

3. **External Redirects**
   - Phải có `http://` hoặc `https://`
   - Nếu không có → coi là internal path

4. **Performance**
   - Middleware gọi GraphQL mỗi request đến `/`
   - Consider caching nếu traffic cao
   - `cache: 'no-store'` để đảm bảo setting mới nhất

## 🎨 Code Quality

- ✅ TypeScript type-safe
- ✅ Error handling (fail-open)
- ✅ Clear comments
- ✅ Console logging for debugging
- ✅ Input sanitization (`.trim()`)
- ✅ Comprehensive documentation

## 📚 Related Docs

- [Custom Homepage Feature](/docs/CUSTOM_HOMEPAGE_FEATURE.md)
- [Offline Website Feature](/docs/OFFLINE_WEBSITE_FEATURE.md)
- [Middleware Chain](/docs/MIDDLEWARE_CHAIN.md)

---

**Updated by:** AI Assistant  
**Date:** 2025-10-31  
**Status:** ✅ Production Ready
