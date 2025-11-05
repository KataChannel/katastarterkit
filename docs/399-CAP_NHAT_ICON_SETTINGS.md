# Cập Nhật Icon Settings cho SEO Metadata

## Tóm tắt

Đã bổ sung 3 trường icon settings vào SEO configuration, cho phép admin cấu hình favicon và app icons từ Admin Panel.

## Thay đổi

### 1. Database (Backend)
**File**: `backend/scripts/seed-seo-settings.ts`

Thêm 3 settings mới:
- `seo.icon_favicon` - Đường dẫn favicon.ico
- `seo.icon_shortcut` - Đường dẫn shortcut icon (16x16px)
- `seo.icon_apple` - Đường dẫn Apple touch icon (180x180px)

**Kết quả seed**:
```
✨ Created: seo.icon_favicon
✨ Created: seo.icon_shortcut
✨ Created: seo.icon_apple

Total: 22 SEO settings (19 cũ + 3 mới)
```

### 2. Frontend Metadata
**File**: `frontend/src/lib/metadata.ts`

Cập nhật để sử dụng dynamic icons:
```typescript
// Icons từ database
const iconFavicon = seo.icon_favicon || '/favicon.ico';
const iconShortcut = seo.icon_shortcut || '/favicon-16x16.png';
const iconApple = seo.icon_apple || '/apple-touch-icon.png';

// Sử dụng trong metadata
icons: {
  icon: iconFavicon,
  shortcut: iconShortcut,
  apple: iconApple,
}
```

### 3. Admin Panel
**File**: `frontend/src/app/admin/settings/website/page.tsx`

Cập nhật labels cho SEO groups:
- `basic` - Cơ bản
- `meta` - Meta Tags
- `opengraph` - Open Graph
- `twitter` - Twitter Card
- `robots` - Robots & Indexing
- `additional` - Bổ sung
- `icons` - Icons ✨ (mới)

## Cách sử dụng

### Admin UI
1. Truy cập: **Admin > Settings > Website > SEO**
2. Tìm section **Icons** (thứ tự 20-22)
3. Cập nhật đường dẫn:
   - **Favicon**: `/favicon.ico`
   - **Shortcut Icon**: `/favicon-16x16.png`
   - **Apple Touch Icon**: `/apple-touch-icon.png`
4. Lưu thay đổi
5. Reload website để thấy icon mới

### Upload icon mới
1. Chuẩn bị file:
   - `favicon.ico` (16x16, 32x32, 48x48)
   - `favicon-16x16.png` (16x16px)
   - `apple-touch-icon.png` (180x180px)
2. Upload vào thư mục `frontend/public/`
3. Cập nhật đường dẫn trong admin settings
4. Hoặc giữ nguyên tên file mặc định

## Lợi ích

✅ Admin có thể thay đổi icon mà không cần code  
✅ Hỗ trợ đầy đủ: browser favicon, shortcut, Apple touch icon  
✅ Tích hợp với hệ thống SEO settings hiện có  
✅ Có fallback values mặc định  
✅ UI thân thiện với preview ảnh  

## Tổng kết

**Tổng số SEO settings**: 22 (tăng từ 19)  
**Nhóm mới**: Icons (3 settings)  
**Files thay đổi**: 3 files  
**Bug fix**: GraphQL query error (where clause)  
**Lỗi**: 0  
**Status**: ✅ Hoàn thành

---
*Ngày cập nhật: 5/11/2025*
