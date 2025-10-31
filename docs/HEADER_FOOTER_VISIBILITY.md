# Header & Footer Visibility Settings

## 📋 Tổng Quan

Hệ thống cho phép ẩn/hiện Header và Footer trên toàn bộ website thông qua **Website Settings**.

## ✨ Tính Năng

### 1. **Ẩn/Hiện Header**
- **Key**: `header.enabled`
- **Type**: `BOOLEAN`
- **Default**: `true`
- **Mô tả**: Bật/tắt header trên toàn bộ website

### 2. **Ẩn/Hiện Footer**
- **Key**: `footer.enabled`
- **Type**: `BOOLEAN`
- **Default**: `true`
- **Mô tả**: Bật/tắt footer trên toàn bộ website

## 🎯 Cách Sử Dụng

### Admin UI

1. **Truy cập Admin Settings**
   ```
   http://localhost:12000/admin/settings/website
   ```

2. **Tab HEADER**
   - Tìm setting: **"Hiển thị Header"**
   - Toggle ON/OFF để bật/tắt header
   - Click **Save Changes**

3. **Tab FOOTER**
   - Tìm setting: **"Hiển thị Footer"**
   - Toggle ON/OFF để bật/tắt footer
   - Click **Save Changes**

4. **Kiểm Tra**
   - Refresh trang chủ: `http://localhost:12000`
   - Header/Footer sẽ xuất hiện hoặc biến mất theo settings

### GraphQL API

#### Query Settings

```graphql
query GetHeaderFooterSettings {
  publicWebsiteSettings(category: HEADER) {
    key
    value
    type
    label
  }
  
  publicWebsiteSettings(category: FOOTER) {
    key
    value
    type
    label
  }
}
```

#### Update Settings

```graphql
mutation UpdateHeaderVisibility {
  updateWebsiteSetting(
    key: "header.enabled"
    input: { value: "false" }
  ) {
    id
    key
    value
  }
}

mutation UpdateFooterVisibility {
  updateWebsiteSetting(
    key: "footer.enabled"
    input: { value: "false" }
  ) {
    id
    key
    value
  }
}
```

### Programmatic Usage

#### Frontend Hook

```typescript
import { useWebsiteSetting } from '@/hooks/useWebsiteSettings';

function MyComponent() {
  const { value: headerEnabled, loading } = useWebsiteSetting('header.enabled');
  const { value: footerEnabled } = useWebsiteSetting('footer.enabled');

  return (
    <div>
      <p>Header: {headerEnabled ? 'Visible' : 'Hidden'}</p>
      <p>Footer: {footerEnabled ? 'Visible' : 'Hidden'}</p>
    </div>
  );
}
```

#### Backend (Prisma)

```typescript
// Get settings
const headerEnabled = await prisma.websiteSetting.findUnique({
  where: { key: 'header.enabled' }
});

// Update settings
await prisma.websiteSetting.update({
  where: { key: 'header.enabled' },
  data: { value: 'false' }
});
```

## 🏗️ Implementation Details

### Database Schema

```prisma
model WebsiteSetting {
  id          String   @id @default(uuid())
  key         String   @unique
  value       String?  @db.Text
  type        SettingType @default(TEXT)
  category    SettingCategory @default(GENERAL)
  // ... other fields
}
```

### Settings Data

```typescript
// Header Visibility
{
  key: 'header.enabled',
  value: 'true',
  type: 'BOOLEAN',
  category: 'HEADER',
  label: 'Hiển thị Header',
  description: 'Bật/tắt header trên toàn bộ website',
  group: 'visibility',
  order: 0,
  isPublic: true,
}

// Footer Visibility
{
  key: 'footer.enabled',
  value: 'true',
  type: 'BOOLEAN',
  category: 'FOOTER',
  label: 'Hiển thị Footer',
  description: 'Bật/tắt footer trên toàn bộ website',
  group: 'visibility',
  order: 0,
  isPublic: true,
}
```

### Layout Integration

**File**: `frontend/src/app/(website)/layout.tsx`

```typescript
'use client';

import { WebsiteFooter } from '@/components/layout/website-footer';
import { WebsiteHeader } from '@/components/layout/website-header';
import { useWebsiteSetting } from '@/hooks/useWebsiteSettings';
import { ReactNode } from 'react';

export default function websiteLayout({ children }: websiteLayoutProps) {
  // Load settings
  const { value: headerEnabled, loading: headerLoading } = useWebsiteSetting('header.enabled');
  const { value: footerEnabled, loading: footerLoading } = useWebsiteSetting('footer.enabled');

  // Default to true if loading or not set
  const showHeader = headerLoading ? true : (headerEnabled !== false);
  const showFooter = footerLoading ? true : (footerEnabled !== false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && <WebsiteHeader />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <WebsiteFooter />}
    </div>
  );
}
```

## 📊 Use Cases

### 1. **Landing Pages**
Tắt header/footer cho landing pages đơn giản:
```
header.enabled = false
footer.enabled = false
```

### 2. **Maintenance Mode**
Chỉ hiển thị nội dung chính, ẩn navigation:
```
header.enabled = false
footer.enabled = true (với thông báo maintenance)
```

### 3. **Embedded Pages**
Khi embed trang vào iframe, ẩn header/footer để tiết kiệm không gian:
```
header.enabled = false
footer.enabled = false
```

### 4. **Print-Friendly**
Tối ưu cho in ấn:
```
header.enabled = false (ẩn navigation khi in)
footer.enabled = true (giữ copyright)
```

## 🔧 Customization

### Per-Page Override

Nếu cần override cho từng trang, có thể mở rộng bằng cách:

1. **Thêm vào Page Model**:
```prisma
model Page {
  // ... existing fields
  overrideHeaderVisibility Boolean? @default(null)
  overrideFooterVisibility Boolean? @default(null)
}
```

2. **Update Layout Logic**:
```typescript
const showHeader = page?.overrideHeaderVisibility ?? headerEnabled;
const showFooter = page?.overrideFooterVisibility ?? footerEnabled;
```

### Dynamic Routes

Có thể tạo settings theo route pattern:
```
header.enabled.path./landing = false
footer.enabled.path./checkout = false
```

## 🧪 Testing

### Manual Testing

1. **Test Header ON/OFF**:
   ```bash
   # Turn off header
   curl -X POST http://localhost:12001/graphql \
     -H 'Content-Type: application/json' \
     -d '{"query":"mutation { updateWebsiteSetting(key:\"header.enabled\", input:{value:\"false\"}) { value } }"}'
   
   # Verify on website
   curl http://localhost:12000 | grep "WebsiteHeader"
   # Should return empty if hidden
   ```

2. **Test Footer ON/OFF**:
   ```bash
   # Turn off footer
   curl -X POST http://localhost:12001/graphql \
     -H 'Content-Type: application/json' \
     -d '{"query":"mutation { updateWebsiteSetting(key:\"footer.enabled\", input:{value:\"false\"}) { value } }"}'
   
   # Verify on website
   curl http://localhost:12000 | grep "WebsiteFooter"
   # Should return empty if hidden
   ```

### Automated Testing

```typescript
// frontend/tests/e2e/header-footer-visibility.spec.ts
import { test, expect } from '@playwright/test';

test('should hide header when setting is disabled', async ({ page }) => {
  // Disable header via admin
  await page.goto('/admin/settings/website');
  await page.click('text=HEADER');
  await page.click('label:has-text("Hiển thị Header") + div');
  await page.click('button:has-text("Save Changes")');
  
  // Verify header is hidden
  await page.goto('/');
  await expect(page.locator('header')).not.toBeVisible();
});

test('should hide footer when setting is disabled', async ({ page }) => {
  // Disable footer via admin
  await page.goto('/admin/settings/website');
  await page.click('text=FOOTER');
  await page.click('label:has-text("Hiển thị Footer") + div');
  await page.click('button:has-text("Save Changes")');
  
  // Verify footer is hidden
  await page.goto('/');
  await expect(page.locator('footer')).not.toBeVisible();
});
```

## 📝 Database Seed

Settings được tạo tự động khi chạy seed:

```bash
cd backend
bun run prisma/seeds/website-settings.seed.ts
```

Output:
```
🌱 Seeding Website Settings...
✅ Created/Updated 53 website settings
✅ Website Settings seeding completed
```

## 🚀 Deployment

### Production Checklist

- [ ] Seed settings đã chạy trong production DB
- [ ] Test header ON/OFF trên staging
- [ ] Test footer ON/OFF trên staging
- [ ] Verify default values = `true`
- [ ] Document cho team marketing
- [ ] Cache busting nếu dùng CDN

### Performance

- Settings được cache trong memory (React state)
- Loading state được xử lý (default = visible)
- No layout shift khi loading

## 🔗 Related Files

### Backend
```
✅ backend/prisma/seeds/website-settings.seed.ts (2 settings added)
✅ backend/prisma/schema.prisma (WebsiteSetting model)
```

### Frontend
```
✅ frontend/src/app/(website)/layout.tsx (updated)
✅ frontend/src/hooks/useWebsiteSettings.ts (interfaces updated)
```

### Documentation
```
✅ docs/HEADER_FOOTER_VISIBILITY.md (this file)
✅ docs/201-WEBSITE_SETTINGS_SYSTEM.md (parent documentation)
```

## 💡 Tips

1. **Default to Visible**: Nếu có lỗi, header/footer vẫn hiển thị (fail-safe)
2. **Cache Strategy**: Settings được cache, thay đổi cần refresh
3. **Admin Only**: Chỉ admin mới có thể thay đổi settings
4. **Real-time**: Dùng GraphQL subscriptions nếu cần real-time updates

## 🆘 Troubleshooting

### Header/Footer không ẩn

1. **Check database**:
   ```sql
   SELECT * FROM website_settings WHERE key IN ('header.enabled', 'footer.enabled');
   ```

2. **Check cache**:
   - Hard refresh: `Ctrl + Shift + R`
   - Clear browser cache

3. **Check console**:
   ```javascript
   console.log('Header enabled:', headerEnabled);
   console.log('Footer enabled:', footerEnabled);
   ```

### Settings không lưu

1. **Check permissions**: User phải có quyền admin
2. **Check GraphQL**: Verify mutation chạy thành công
3. **Check logs**: Backend logs có errors?

---

**Version**: 1.0  
**Last Updated**: October 31, 2025  
**Author**: Development Team
