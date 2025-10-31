# Tính năng Offline Website (Maintenance Mode)

## Tổng quan

Tính năng này cho phép quản trị viên chuyển website sang chế độ offline (bảo trì) và redirect người dùng đến một trang tùy chỉnh.

## Các Settings mới

### 1. site.offline (BOOLEAN)
- **Mô tả**: Bật/tắt chế độ offline
- **Giá trị mặc định**: `false`
- **Group**: `maintenance`
- **Order**: 100

### 2. site.offline_redirect_url (TEXT)
- **Mô tả**: URL redirect khi website offline
- **Giá trị mặc định**: `/maintenance`
- **Hỗ trợ**: 
  - Internal path: `/maintenance`, `/coming-soon`, etc.
  - External URL: `https://example.com/maintenance`
- **Group**: `maintenance`
- **Order**: 101

### 3. site.offline_message (TEXTAREA)
- **Mô tả**: Thông báo hiển thị trên trang maintenance
- **Giá trị mặc định**: "Website đang trong quá trình bảo trì. Vui lòng quay lại sau."
- **Group**: `maintenance`
- **Order**: 102

## Cách sử dụng

### 1. Bật Offline Mode

Vào **Admin → Settings → Website → GENERAL Tab → Maintenance Group**:

1. Bật switch "Chế độ Offline"
2. Nhập URL redirect (mặc định: `/maintenance`)
3. Tùy chỉnh thông báo (optional)
4. Click "Lưu thay đổi"

### 2. Tắt Offline Mode

1. Tắt switch "Chế độ Offline"
2. Click "Lưu thay đổi"

## Middleware

File: `frontend/middleware.ts` và `frontend/src/middleware/offline.ts`

### Cách hoạt động:

1. **Check whitelist**: Các path sau luôn accessible:
   - `/api/*` - API routes
   - `/admin/*` - Admin panel
   - `/_next/*` - Next.js internals
   - `/favicon.ico` - Favicon
   - `/assets/*` - Static assets
   - `/maintenance` - Maintenance page itself

2. **Fetch settings**: Query GraphQL để lấy `site.offline` và `site.offline_redirect_url`

3. **Redirect logic**:
   - Nếu `site.offline = true` → Redirect đến `offline_redirect_url`
   - Nếu `site.offline = false` và user đang ở maintenance page → Redirect về home

4. **Fail open**: Nếu có lỗi khi fetch settings → Allow access (không block)

## Trang Maintenance

File: `frontend/src/app/maintenance/page.tsx`

### Features:

- ✅ Responsive design (mobile-first)
- ✅ Gradient background đẹp mắt
- ✅ Animation loading dots
- ✅ Hiển thị thông báo từ settings
- ✅ Button "Tải lại trang" và "Về trang chủ"
- ✅ Hiển thị contact email (nếu có)
- ✅ Brand consistency với site name

### Screenshot Layout:

```
┌─────────────────────────────────────┐
│                                     │
│       🔧 Icon (animated)            │
│                                     │
│     Đang bảo trì (Large)            │
│                                     │
│  Thông báo từ settings (Medium)     │
│                                     │
│     ● ● ● (Loading dots)            │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Time Est │  │ Contact  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  [Tải lại]  [Về trang chủ]         │
│                                     │
│  © 2025 Site Name                   │
└─────────────────────────────────────┘
```

## GraphQL Query

```graphql
query GetOfflineSettings {
  websiteSettingFindMany(
    where: {
      OR: [
        { key: { equals: "site.offline" } }
        { key: { equals: "site.offline_redirect_url" } }
      ]
    }
  ) {
    key
    value
  }
}
```

## Use Cases

### 1. Planned Maintenance
```
site.offline = true
site.offline_redirect_url = /maintenance
site.offline_message = "Website đang nâng cấp tính năng mới. Dự kiến hoàn thành lúc 14:00 ngày 01/11/2025."
```

### 2. Emergency Downtime
```
site.offline = true
site.offline_redirect_url = /maintenance
site.offline_message = "Hệ thống đang gặp sự cố tạm thời. Chúng tôi đang khắc phục. Xin lỗi vì sự bất tiện này."
```

### 3. Coming Soon
```
site.offline = true
site.offline_redirect_url = /coming-soon
site.offline_message = "Website sắp ra mắt! Hãy quay lại vào ngày 15/11/2025."
```

### 4. External Redirect
```
site.offline = true
site.offline_redirect_url = https://blog.example.com/announcement
site.offline_message = "Vui lòng xem thông báo tại blog của chúng tôi."
```

## Testing

### Test 1: Enable Offline Mode
```bash
# 1. Bật offline mode trong admin
# 2. Truy cập homepage: http://localhost:3000
# Expected: Redirect to /maintenance

# 3. Truy cập admin: http://localhost:3000/admin
# Expected: Admin accessible (whitelist)

# 4. Truy cập API: http://localhost:3000/api/...
# Expected: API accessible (whitelist)
```

### Test 2: Disable Offline Mode
```bash
# 1. Tắt offline mode trong admin
# 2. Truy cập /maintenance: http://localhost:3000/maintenance
# Expected: Redirect to home

# 3. Truy cập homepage: http://localhost:3000
# Expected: Normal access
```

### Test 3: External Redirect
```bash
# 1. Set offline_redirect_url = https://example.com
# 2. Bật offline mode
# 3. Truy cập homepage
# Expected: Redirect to https://example.com
```

## Performance

- **Middleware**: Lightweight, chỉ 1 GraphQL query
- **Caching**: `cache: 'no-store'` để luôn check latest settings
- **Fail open**: Nếu GraphQL down → Website vẫn accessible

## Security

- ✅ Admin panel luôn accessible (whitelist)
- ✅ API routes không bị block
- ✅ Static files (_next, assets) không bị block
- ✅ Không expose sensitive info trong redirect

## Troubleshooting

### Issue: Infinite redirect loop
**Cause**: `offline_redirect_url` trỏ đến path không trong whitelist và không phải `/maintenance`

**Fix**: 
1. Set `offline_redirect_url = /maintenance`
2. Hoặc thêm custom path vào whitelist trong `offline.ts`

### Issue: Admin panel bị block
**Cause**: Middleware config sai

**Fix**: Verify `/admin` trong WHITELIST_PATHS

### Issue: Offline mode không hoạt động
**Cause**: GraphQL query failed

**Debug**:
```bash
# Check GraphQL endpoint
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ websiteSettingFindMany(where:{key:{equals:\"site.offline\"}}){key value}}"}'
```

## Roadmap

### Future Enhancements:
- [ ] Scheduled maintenance (auto enable/disable)
- [ ] IP whitelist (cho phép một số IP access khi offline)
- [ ] Custom maintenance template selector
- [ ] Email notification khi bật offline mode
- [ ] Analytics tracking (số người bị redirect)

## Files Changed

### Backend:
- ✅ `backend/prisma/seeds/website-settings.seed.ts` - Thêm 3 settings mới

### Frontend:
- ✅ `frontend/middleware.ts` - Main middleware
- ✅ `frontend/src/middleware/offline.ts` - Offline logic
- ✅ `frontend/src/app/maintenance/page.tsx` - Maintenance page
- ✅ `docs/OFFLINE_WEBSITE_FEATURE.md` - Documentation

### Database:
- ✅ Seed: 56 settings (3 new: offline, offline_redirect_url, offline_message)

## Summary

Tính năng offline website đã được triển khai hoàn chỉnh với:
- ✅ 3 settings mới trong GENERAL/maintenance group
- ✅ Middleware tự động redirect
- ✅ Trang maintenance responsive, đẹp mắt
- ✅ Hỗ trợ cả internal và external redirect
- ✅ Whitelist admin, API, static files
- ✅ Fail-open security
- ✅ Documentation đầy đủ

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Date**: 2025-01-31
