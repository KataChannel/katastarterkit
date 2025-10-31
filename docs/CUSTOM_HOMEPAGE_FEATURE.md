# Tính năng Custom Homepage URL

## Tổng quan

Tính năng này cho phép quản trị viên chỉ định một URL tùy chỉnh làm trang chủ mặc định. **Logic chính: Nếu `site.homepage_url` có giá trị (khác `/` hoặc rỗng), thì khi người dùng truy cập root path (`/`) sẽ được redirect về URL đó.**

## Setting mới

### site.homepage_url (TEXT)
- **Mô tả**: Nếu có giá trị (khác "/" hoặc rỗng), truy cập "/" sẽ redirect về URL này
- **Giá trị mặc định**: `/` (không redirect)
- **Hỗ trợ**: 
  - Root path: `/` (mặc định, **KHÔNG REDIRECT**)
  - Empty string: `""` (không redirect)
  - Internal path: `/home`, `/landing`, `/lms`, `/san-pham` (**REDIRECT**)
  - External URL: `https://example.com`, `https://blog.example.com` (**REDIRECT**)
- **Category**: `GENERAL`
- **Group**: `basic`
- **Order**: 4

## Logic Redirect (Cập nhật mới)

### ✅ Các trường hợp REDIRECT (có giá trị)

```typescript
// Case 1: Internal path
site.homepage_url = "/lms"
→ Truy cập "/" → Redirect to "/lms"

// Case 2: Internal path khác
site.homepage_url = "/san-pham"
→ Truy cập "/" → Redirect to "/san-pham"

// Case 3: External URL
site.homepage_url = "https://blog.example.com"
→ Truy cập "/" → Redirect to "https://blog.example.com"

// Case 4: Subdomain
site.homepage_url = "https://shop.example.com"
→ Truy cập "/" → Redirect to "https://shop.example.com"
```

### ❌ Các trường hợp KHÔNG REDIRECT (không có giá trị)

```typescript
// Case 1: Default root
site.homepage_url = "/"
→ Truy cập "/" → Hiển thị homepage bình thường

// Case 2: Empty string
site.homepage_url = ""
→ Truy cập "/" → Hiển thị homepage bình thường

// Case 3: Null/undefined (setting chưa tồn tại)
site.homepage_url = null
→ Truy cập "/" → Hiển thị homepage bình thường
```

## Cách sử dụng

### 1. Cấu hình Homepage URL

Vào **Admin → Settings → Website → GENERAL Tab → Basic Group**:

1. Tìm setting "URL Trang chủ"
2. Nhập URL mong muốn:
   - `/` - Trang chủ mặc định (không redirect)
   - `/lms` - Redirect đến LMS homepage
   - `/san-pham` - Redirect đến trang sản phẩm
   - `https://blog.example.com` - Redirect đến external URL
3. Click "Lưu thay đổi"

### 2. Kết quả

**Ví dụ 1: Internal redirect**
```
homepage_url = /lms
```
- Truy cập: `http://yoursite.com/` → Redirect đến `http://yoursite.com/lms`
- Admin: `http://yoursite.com/admin` → Không bị redirect
- API: `http://yoursite.com/api/...` → Không bị redirect

**Ví dụ 2: External redirect**
```
homepage_url = https://blog.example.com
```
- Truy cập: `http://yoursite.com/` → Redirect đến `https://blog.example.com`

**Ví dụ 3: Default (không redirect)**
```
homepage_url = /
```
- Truy cập: `http://yoursite.com/` → Hiển thị trang chủ bình thường

## Middleware

File: `frontend/src/middleware/homepage.ts`

### Cách hoạt động (Logic mới):

1. **Check root path**: Chỉ xử lý khi `pathname === '/'`
   - Nếu không phải `/` → Bỏ qua middleware (return next)

2. **Fetch setting**: Query GraphQL public endpoint để lấy `site.homepage_url`
   ```graphql
   query GetPublicHomepage {
     publicWebsiteSettings(keys: ["site.homepage_url"]) {
       key
       value
     }
   }
   ```

3. **Redirect logic** (KEY CHANGE):
   ```typescript
   const homepageUrl = homepageSetting?.value?.trim();
   
   // Nếu KHÔNG có giá trị hoặc giá trị là "/" → KHÔNG redirect
   if (!homepageUrl || homepageUrl === '' || homepageUrl === '/') {
     return NextResponse.next(); // Hiển thị homepage bình thường
   }
   
   // Nếu CÓ giá trị (khác "/" và không rỗng) → REDIRECT
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

4. **Fail open**: Nếu có lỗi khi fetch settings → Allow access (không redirect)

### Ví dụ flow:

**Scenario 1: Có giá trị redirect (Internal)**
```
1. User: GET http://example.com/
2. Middleware: Check pathname === '/'? ✅
3. Middleware: Fetch site.homepage_url
4. Response: homepage_url = "/lms"
5. Check: "/lms" !== "/" && "/lms" !== "" ✅
6. Middleware: NextResponse.redirect("/lms")
7. Browser: GET http://example.com/lms
```

**Scenario 2: Có giá trị redirect (External)**
```
1. User: GET http://example.com/
2. Middleware: Check pathname === '/'? ✅
3. Middleware: Fetch site.homepage_url
4. Response: homepage_url = "https://blog.example.com"
5. Check: URL starts with "https://"? ✅
6. Middleware: NextResponse.redirect("https://blog.example.com")
7. Browser: GET https://blog.example.com
```

**Scenario 3: KHÔNG có giá trị redirect (Default)**
```
1. User: GET http://example.com/
2. Middleware: Check pathname === '/'? ✅
3. Middleware: Fetch site.homepage_url
4. Response: homepage_url = "/"
5. Check: "/" === "/" ✅
6. Middleware: return NextResponse.next()
7. Next.js: Render homepage component
```

## Integration với Offline Middleware

Middleware được chạy theo thứ tự ưu tiên:

1. **Offline Middleware** (priority cao nhất)
   - Check nếu website offline → Redirect to maintenance
   
2. **Homepage Middleware** (priority thứ 2)
   - Check nếu root path → Redirect to custom homepage

3. **Other Middlewares** (nếu có)

Code trong `frontend/middleware.ts`:
```typescript
export async function middleware(request: NextRequest) {
  // 1. Offline middleware (highest priority)
  const offlineResponse = await offlineMiddleware(request);
  if (offlineResponse.status !== 200) {
    return offlineResponse;
  }

  // 2. Homepage middleware
  const homepageResponse = await homepageMiddleware(request);
  if (homepageResponse.status !== 200) {
    return homepageResponse;
  }

  return NextResponse.next();
}
```

## GraphQL Public Resolver

### Fix Authentication Bug

**Problem**: Middleware không có JWT token → `JwtAuthGuard` block request

**Solution**: Sử dụng `publicWebsiteSettings` resolver (không cần authentication)

File: `backend/src/graphql/resolvers/website-setting.resolver.ts`

```typescript
@Query(() => [WebsiteSetting], { name: 'publicWebsiteSettings' })
async getPublicWebsiteSettings(
  @Args('category', { nullable: true }) category?: string,
  @Args('group', { nullable: true }) group?: string,
  @Args('keys', { type: () => [String], nullable: true }) keys?: string[],
): Promise<WebsiteSetting[]> {
  const where: any = {
    isActive: true,
    isPublic: true,  // Chỉ trả về public settings
  };
  if (category) where.category = category;
  if (group) where.group = group;
  if (keys && keys.length > 0) where.key = { in: keys };

  return await this.prisma.websiteSetting.findMany({
    where,
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });
}
```

### Query Examples

**Query với filter keys:**
```graphql
query {
  publicWebsiteSettings(keys: ["site.homepage_url", "site.offline"]) {
    key
    value
  }
}
```

**Query theo category:**
```graphql
query {
  publicWebsiteSettings(category: "GENERAL") {
    key
    value
  }
}
```

**Query theo group:**
```graphql
query {
  publicWebsiteSettings(category: "GENERAL", group: "basic") {
    key
    value
  }
}
```

## Use Cases

### 1. LMS Platform Homepage
Chuyển trang chủ thành LMS thay vì landing page:
```
site.homepage_url = /lms
```

### 2. E-commerce Product Catalog
Hiển thị catalog sản phẩm làm trang chủ:
```
site.homepage_url = /san-pham
```

### 3. Blog Platform
Redirect đến blog platform:
```
site.homepage_url = /bai-viet
```

### 4. Coming Soon / Landing Page
Redirect đến trang landing page custom:
```
site.homepage_url = /landing
```

### 5. External Domain
Redirect đến subdomain hoặc domain khác:
```
site.homepage_url = https://blog.yoursite.com
```

### 6. Maintenance + Custom Homepage
Kết hợp với offline mode:
```
site.offline = false
site.homepage_url = /lms
```
→ Website online, homepage là LMS

```
site.offline = true
site.offline_redirect_url = /maintenance
site.homepage_url = /lms  (ignored khi offline)
```
→ Website offline, redirect to maintenance (homepage setting bị ignore)

## Testing

### Test 1: Internal Redirect
```bash
# 1. Set homepage_url = /lms
# 2. Truy cập: http://localhost:3000/
# Expected: Redirect to /lms

# 3. Truy cập: http://localhost:3000/admin
# Expected: Admin accessible (không redirect)

# 4. Truy cập: http://localhost:3000/lms
# Expected: Direct access (không redirect loop)
```

### Test 2: External Redirect
```bash
# 1. Set homepage_url = https://google.com
# 2. Truy cập: http://localhost:3000/
# Expected: Redirect to https://google.com
```

### Test 3: Default (No Redirect)
```bash
# 1. Set homepage_url = /
# 2. Truy cập: http://localhost:3000/
# Expected: Normal homepage display (không redirect)
```

### Test 4: Combined với Offline Mode
```bash
# 1. Set offline = true, offline_redirect_url = /maintenance
# 2. Set homepage_url = /lms
# 3. Truy cập: http://localhost:3000/
# Expected: Redirect to /maintenance (offline has priority)

# 4. Set offline = false
# 5. Truy cập: http://localhost:3000/
# Expected: Redirect to /lms
```

## Performance

- **Middleware**: Lightweight, chỉ check khi `pathname === '/'`
- **GraphQL Query**: Filter với `keys` → Fast query
- **Public only**: `isPublic: true` → No authentication overhead
- **Caching**: `cache: 'no-store'` → Always fresh data
- **Fail open**: Nếu GraphQL down → Website vẫn accessible

## Security

- ✅ Chỉ public settings (isPublic: true) được expose
- ✅ Admin panel không bị redirect
- ✅ API routes không bị redirect
- ✅ Không expose sensitive data
- ✅ CORS compliant

## Troubleshooting

### Issue: Infinite redirect loop
**Cause**: `homepage_url` trỏ đến path tự redirect về `/`

**Fix**: 
1. Kiểm tra target path có tồn tại không
2. Đảm bảo không có circular redirect
3. Set `homepage_url = /` để disable redirect

### Issue: External redirect không hoạt động
**Cause**: URL format sai

**Fix**: 
1. Phải bắt đầu với `http://` hoặc `https://`
2. Kiểm tra URL valid
3. Test với curl/browser

### Issue: Homepage redirect bị ignore khi offline
**Behavior**: Đây là expected - Offline middleware có priority cao hơn

**Solution**: Tắt offline mode nếu muốn homepage redirect hoạt động

### Issue: Authentication error trong middleware
**Cause**: Dùng authenticated query thay vì public query

**Fix**: Sử dụng `publicWebsiteSettings` query (không cần auth):
```graphql
query {
  publicWebsiteSettings(keys: ["site.homepage_url"]) {
    key
    value
  }
}
```

### Issue: Backend log warning "No token provided"
**Cause**: Middleware gọi query yêu cầu authentication

**Fix**: Đã fix bằng cách:
1. Sử dụng `publicWebsiteSettings` resolver
2. Không gửi Authorization header
3. Filter `isPublic: true` ở backend

## Files Changed

### Backend:
- ✅ `backend/prisma/seeds/website-settings.seed.ts` - Thêm `site.homepage_url` setting
- ✅ `backend/src/graphql/resolvers/website-setting.resolver.ts` - Thêm `keys` filter vào `publicWebsiteSettings`

### Frontend:
- ✅ `frontend/middleware.ts` - Thêm homepage middleware
- ✅ `frontend/src/middleware/homepage.ts` - Homepage redirect logic
- ✅ `frontend/src/middleware/offline.ts` - Fix authentication bug (dùng public query)

### Documentation:
- ✅ `docs/CUSTOM_HOMEPAGE_FEATURE.md` - Documentation

### Database:
- ✅ Seed: 57 settings total (1 new: site.homepage_url)

## Authentication Bug Fix

### Problem
```
[Nest] WARN [JwtAuthGuard] GraphQL - No token provided in Authorization header
GraphQL execution errors: {
  message: 'Authentication token is required'
}
```

### Root Cause
Middleware gọi `websiteSettingFindMany` query → Cần authentication → Middleware không có JWT token → Error

### Solution
1. **Backend**: Thêm `keys` parameter vào `publicWebsiteSettings` resolver
2. **Frontend**: Đổi sang dùng `publicWebsiteSettings` query thay vì `websiteSettingFindMany`
3. **No Auth Required**: `publicWebsiteSettings` không có `@UseGuards(JwtAuthGuard)`

### Code Changes

**Before (offline.ts):**
```typescript
query: `
  query GetOfflineSettings {
    websiteSettingFindMany(  // ❌ Requires auth
      where: { ... }
    ) { key value }
  }
`
```

**After (offline.ts):**
```typescript
query: `
  query GetPublicWebsiteSettings {
    publicWebsiteSettings(  // ✅ No auth required
      keys: ["site.offline", "site.offline_redirect_url"]
    ) { key value }
  }
`
```

**Homepage middleware (homepage.ts):**
```typescript
query: `
  query GetPublicHomepage {
    publicWebsiteSettings(  // ✅ No auth required
      keys: ["site.homepage_url"]
    ) { key value }
  }
`
```

## Summary

### Features Implemented
- ✅ Custom homepage URL setting trong GENERAL/basic group
- ✅ Homepage middleware với redirect logic
- ✅ Hỗ trợ internal và external URLs
- ✅ Integration với offline middleware
- ✅ **FIX**: Authentication bug trong middleware
- ✅ Public GraphQL resolver với keys filter
- ✅ Fail-open security
- ✅ Documentation đầy đủ

### Database
- ✅ Seed: 57 settings (1 new setting added)

### Backend Changes
- ✅ Enhanced `publicWebsiteSettings` resolver
- ✅ Added `keys` parameter for filtering
- ✅ No authentication required

### Frontend Changes
- ✅ Homepage middleware
- ✅ Fixed offline middleware (dùng public query)
- ✅ Main middleware router với priority order

**Status**: ✅ **Production Ready**  
**Version**: 1.0.0  
**Date**: 2025-10-31

## Bonus: Middleware Priority

```
Request → Middleware Chain:

1. Offline Middleware (HIGHEST)
   ├─ Check: site.offline === true?
   ├─ Yes → Redirect to maintenance
   └─ No → Continue

2. Homepage Middleware
   ├─ Check: pathname === '/'?
   ├─ Yes → Check homepage_url
   │   ├─ If set → Redirect
   │   └─ If default → Continue
   └─ No → Continue

3. Future Middlewares
   └─ Add more here...

4. Next.js Router
   └─ Normal routing
```

Offline có priority cao nhất vì:
- Security concern (bảo trì website)
- Ngăn access khi cần thiết
- Homepage redirect không quan trọng bằng maintenance

