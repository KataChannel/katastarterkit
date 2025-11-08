# Website Settings System - Hệ thống Cài đặt Website

## Tổng quan

Hệ thống cài đặt website cho phép quản lý và tùy chỉnh toàn bộ thông tin, giao diện và cấu hình của website thông qua admin panel. Tất cả settings được lưu trong database và có thể cập nhật real-time mà không cần restart server.

## Cấu trúc Database

### Model: `WebsiteSetting`

```prisma
model WebsiteSetting {
  id          String          @id @default(uuid())
  key         String          @unique // "header.logo", "footer.copyright"
  value       String?         @db.Text
  type        SettingType     // TEXT, BOOLEAN, NUMBER, COLOR, IMAGE, URL, JSON
  category    SettingCategory // GENERAL, HEADER, FOOTER, SEO, SOCIAL, etc.
  label       String          // Tên hiển thị
  description String?         // Mô tả
  group       String?         // Nhóm con
  order       Int             // Thứ tự hiển thị
  isActive    Boolean
  isPublic    Boolean         // Public có thể lấy không cần auth
  options     Json?           // Options cho SELECT type
  validation  Json?           // Rules validation
  createdAt   DateTime
  updatedAt   DateTime
  createdBy   String?
  updatedBy   String?
  creator     User?
  updater     User?
}
```

### Enums

**SettingType**:
- `TEXT` - Văn bản ngắn
- `TEXTAREA` - Văn bản dài
- `NUMBER` - Số
- `BOOLEAN` - Bật/Tắt
- `COLOR` - Màu sắc (hex)
- `IMAGE` - URL ảnh
- `URL` - Đường dẫn
- `JSON` - Dữ liệu JSON
- `SELECT` - Dropdown

**SettingCategory**:
- `GENERAL` - Cài đặt chung
- `HEADER` - Header
- `FOOTER` - Footer
- `SEO` - SEO
- `SOCIAL` - Mạng xã hội
- `CONTACT` - Liên hệ
- `APPEARANCE` - Giao diện
- `ANALYTICS` - Phân tích
- `PAYMENT` - Thanh toán
- `SHIPPING` - Vận chuyển

## Settings đã tạo (36 settings)

### 🌐 GENERAL (3 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `site.name` | TEXT | "Inner Bright" | Tên website |
| `site.tagline` | TEXT | "Nông Sản Thực Phẩm Sạch" | Slogan |
| `site.description` | TEXTAREA | "Chuyên cung cấp..." | Mô tả website |

### 📐 HEADER (11 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `header.logo` | IMAGE | "/assets/images/logo.svg" | Logo header |
| `header.logo_width` | NUMBER | 80 | Chiều rộng logo (px) |
| `header.background_color` | COLOR | "#57A345" | Màu nền header |
| `header.text_color` | COLOR | "#FFFFFF" | Màu chữ header |
| `header.show_search` | BOOLEAN | true | Hiển thị tìm kiếm |
| `header.show_cart` | BOOLEAN | true | Hiển thị giỏ hàng |
| `header.show_user_menu` | BOOLEAN | true | Hiển thị menu user |
| `header.banner_enabled` | BOOLEAN | true | Hiển thị banner |
| `header.banner_height` | NUMBER | 208 | Chiều cao banner (px) |
| `header.banner_autoplay` | BOOLEAN | true | Banner tự động chuyển |
| `header.banner_interval` | NUMBER | 5000 | Thời gian chuyển (ms) |

### 📏 FOOTER (4 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `footer.background_color` | COLOR | "#000000" | Màu nền footer |
| `footer.text_color` | COLOR | "#FFFFFF" | Màu chữ footer |
| `footer.show_visitor_stats` | BOOLEAN | true | Hiển thị thống kê |
| `footer.show_social_links` | BOOLEAN | true | Hiển thị social links |

### 📞 CONTACT (5 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `contact.company_name` | TEXT | "CTY TNHH..." | Tên công ty |
| `contact.address` | TEXTAREA | "Tầng 3, An Phú Plaza..." | Địa chỉ |
| `contact.phone` | TEXT | "0865770009" | SĐT |
| `contact.phone_display` | TEXT | "0865.77.0009" | SĐT hiển thị |
| `contact.email` | TEXT | "mart.rausach..." | Email |

### 🌍 SOCIAL (6 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `social.facebook` | URL | "https://facebook.com/..." | Facebook URL |
| `social.facebook_enabled` | BOOLEAN | true | Hiển thị Facebook |
| `social.tiktok` | URL | "https://tiktok.com/..." | TikTok URL |
| `social.tiktok_enabled` | BOOLEAN | true | Hiển thị TikTok |
| `social.youtube` | URL | "https://youtube.com/..." | YouTube URL |
| `social.youtube_enabled` | BOOLEAN | true | Hiển thị YouTube |

### 🔍 SEO (4 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `seo.meta_title` | TEXT | "Inner Bright..." | Meta title |
| `seo.meta_description` | TEXTAREA | "Chuyên cung cấp..." | Meta description |
| `seo.keywords` | TEXTAREA | "rau sạch, thực phẩm..." | Keywords |
| `seo.og_image` | IMAGE | "/assets/images/logo.svg" | OG image |

### 🎨 APPEARANCE (3 settings)
| Key | Type | Default | Mô tả |
|-----|------|---------|-------|
| `appearance.primary_color` | COLOR | "#57A345" | Màu chính |
| `appearance.secondary_color` | COLOR | "#FAA61A" | Màu phụ |
| `appearance.accent_color` | COLOR | "#65b009" | Màu nhấn |

## Backend Implementation

### 1. Migration
```bash
cd backend
bunx prisma migrate dev --name add_website_settings
```

### 2. Seed Data
```bash
bun run prisma/seeds/website-settings.seed.ts
```
✅ Đã tạo 36 settings mặc định

### 3. GraphQL Schema & Resolvers
**File**: `backend/src/graphql/schemas/websitesetting.graphql`
**File**: `backend/src/graphql/resolvers/websitesetting.resolver.ts`

**Queries**:
- `websiteSettings` - Lấy tất cả (cần auth)
- `publicWebsiteSettings` - Lấy public (không cần auth)
- `websiteSetting(key)` - Lấy 1 setting
- `websiteSettingsByCategory(category)` - Lấy theo category
- `headerSettings` - Lấy header settings
- `footerSettings` - Lấy footer settings
- `websiteSettingsMap` - Lấy dạng key-value object

**Mutations**:
- `createWebsiteSetting` - Tạo mới
- `updateWebsiteSetting` - Cập nhật 1
- `updateWebsiteSettings` - Cập nhật nhiều
- `deleteWebsiteSetting` - Xóa
- `bulkUpdateWebsiteSettings` - Bulk update từ JSON

## Frontend Implementation

### 1. Hooks
**File**: `frontend/src/hooks/useWebsiteSettings.ts`

```typescript
import { useHeaderSettings, useFooterSettings, settingsToMap } from '@/hooks/useWebsiteSettings';

// Lấy header settings
const { data: headerSettingsRaw = [] } = useHeaderSettings();
const headerSettings = settingsToMap(headerSettingsRaw);

// Sử dụng
const logo = headerSettings['header.logo'];
const bgColor = headerSettings['header.background_color'];
const showSearch = headerSettings['header.show_search']; // boolean
```

**Available Hooks**:
- `useWebsiteSettings(category?)` - Lấy tất cả hoặc theo category
- `useHeaderSettings()` - Header settings
- `useFooterSettings()` - Footer settings
- `useContactSettings()` - Contact settings
- `useSocialSettings()` - Social settings
- `useWebsiteSettingsMap(category?)` - Dạng key-value map
- `useWebsiteSetting(key)` - Lấy 1 setting cụ thể

**Helper Functions**:
- `parseSettingValue(setting)` - Parse value theo type
- `settingsToMap(settings)` - Convert array → object

### 2. Updated Components

#### **WebsiteHeader** (`website-header.tsx`)
**Changes**:
```typescript
✅ Import hooks
✅ Load header & contact settings
✅ Dynamic logo (URL + size)
✅ Dynamic background color
✅ Dynamic phone number
✅ Conditional rendering (search, cart, user menu)
✅ Dynamic banner (height, autoplay, interval)
```

**Settings Used**:
- `header.logo`, `header.logo_width`
- `header.background_color`, `header.text_color`
- `header.show_search`, `header.show_cart`, `header.show_user_menu`
- `header.banner_enabled`, `header.banner_height`
- `contact.phone`, `contact.phone_display`

#### **WebsiteFooter** (`website-footer.tsx`)
**Changes**:
```typescript
✅ Import hooks
✅ Load footer, contact & social settings
✅ Dynamic background color
✅ Dynamic company info
✅ Dynamic social links (conditional)
✅ Conditional visitor stats
```

**Settings Used**:
- `footer.background_color`, `footer.text_color`
- `footer.show_visitor_stats`, `footer.show_social_links`
- `contact.company_name`, `contact.address`, `contact.phone_display`, `contact.email`
- `social.facebook`, `social.facebook_enabled`
- `social.tiktok`, `social.tiktok_enabled`
- `social.youtube`, `social.youtube_enabled`

### 3. Admin UI
**File**: `frontend/src/app/admin/settings/website/page.tsx`

**Features**:
- ✅ 7 category tabs (General, Header, Footer, Contact, Social, SEO, Appearance)
- ✅ Grouped settings by `group` field
- ✅ Smart input rendering based on `type`:
  - TEXT → Input
  - TEXTAREA → Textarea
  - NUMBER → Input[type=number]
  - BOOLEAN → Switch
  - COLOR → Color picker + text input
  - IMAGE → Input + preview
  - URL → Input
  - SELECT → Dropdown
  - JSON → Code editor
- ✅ Real-time editing with change tracking
- ✅ Bulk save changes
- ✅ Reset functionality
- ✅ Public/Private indicator
- ✅ Type badges
- ✅ Setting key display
- ✅ Validation support

**Access**: `/admin/settings/website`

## Usage Examples

### 1. Thay đổi màu header
1. Vào `/admin/settings/website`
2. Tab **Header**
3. Tìm **"Màu nền Header"**
4. Chọn màu mới
5. Click **"Lưu thay đổi"**
6. Refresh trang chủ → Header đổi màu ngay lập tức

### 2. Ẩn giỏ hàng
1. Tab **Header**
2. Tìm **"Hiển thị giỏ hàng"**
3. Tắt switch
4. Lưu → Icon giỏ hàng biến mất

### 3. Thay logo
1. Tab **Header**
2. **"Logo Header"** → Nhập URL mới
3. **"Chiều rộng Logo"** → Điều chỉnh size
4. Lưu → Logo mới hiển thị

### 4. Cập nhật thông tin công ty
1. Tab **Contact**
2. Sửa tên, địa chỉ, phone, email
3. Lưu → Footer & Header update tự động

### 5. Ẩn/Hiện social links
1. Tab **Social**
2. Tắt **"Hiển thị Facebook/TikTok/YouTube"**
3. Lưu → Icons biến mất khỏi footer

### 6. Điều chỉnh banner
1. Tab **Header**
2. **"Chiều cao Banner"** → 300px
3. **"Thời gian chuyển"** → 3000ms
4. **"Banner tự động chuyển"** → Tắt
5. Lưu → Banner update

## API Examples

### GraphQL Queries

**Lấy all header settings (public)**:
```graphql
query {
  publicWebsiteSettings(category: HEADER) {
    key
    value
    type
    label
  }
}
```

**Lấy settings dạng map**:
```graphql
query {
  websiteSettingsMap(category: HEADER)
}
```

**Response**:
```json
{
  "header.logo": "/assets/images/logo.svg",
  "header.logo_width": 80,
  "header.background_color": "#57A345",
  "header.show_search": true,
  ...
}
```

### GraphQL Mutations

**Update 1 setting**:
```graphql
mutation {
  updateWebsiteSetting(
    key: "header.background_color"
    input: { value: "#FF0000" }
  ) {
    key
    value
    updatedAt
  }
}
```

**Update nhiều settings**:
```graphql
mutation {
  updateWebsiteSettings(
    settings: [
      { key: "header.show_cart", value: "false" }
      { key: "header.show_search", value: "false" }
    ]
  ) {
    key
    value
  }
}
```

**Bulk update từ JSON**:
```graphql
mutation {
  bulkUpdateWebsiteSettings(
    data: "{\"header.logo\":\"/new-logo.svg\",\"footer.background_color\":\"#333\"}"
  ) {
    key
    value
  }
}
```

## Dynamic GraphQL

Hệ thống sử dụng **Unified Dynamic GraphQL** nên có thể query bằng cách:

```graphql
query {
  findMany(
    modelName: "websiteSetting"
    input: {
      where: { category: "HEADER", isActive: true, isPublic: true }
      orderBy: { order: "asc" }
    }
  ) {
    id
    key
    value
    type
    label
  }
}
```

```graphql
mutation {
  updateOne(
    modelName: "websiteSetting"
    input: {
      where: { key: "header.logo" }
      data: { value: "/new-logo.png" }
    }
  ) {
    id
    key
    value
  }
}
```

## Type Safety

Frontend hooks có type definitions đầy đủ:

```typescript
interface WebsiteSettings {
  'site.name'?: string;
  'header.logo'?: string;
  'header.logo_width'?: number;
  'header.show_search'?: boolean;
  'footer.background_color'?: string;
  [key: string]: any;
}

const { settings } = useWebsiteSettingsMap('HEADER');
// settings.header.logo - Type: string | undefined
// settings.header.show_search - Type: boolean | undefined
```

## Performance

- ✅ **Caching**: Settings được cache ở frontend
- ✅ **Public Settings**: Không cần authentication để lấy public settings
- ✅ **Indexed**: Database có index trên `category`, `key`, `isActive`
- ✅ **Lazy Loading**: Chỉ load settings cần thiết cho từng component
- ✅ **Memo**: Settings map được memoized với `useMemo`

## Security

- ✅ **Private Settings**: Chỉ admin mới xem/sửa được settings với `isPublic = false`
- ✅ **Authentication Required**: Mutations cần auth token
- ✅ **Audit Trail**: Lưu `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- ✅ **Validation**: Support validation rules trong `validation` field

## Future Enhancements

### Phase 2
- [ ] Setting history/versioning
- [ ] Rollback to previous values
- [ ] Import/Export settings (JSON/YAML)
- [ ] Setting templates
- [ ] Multi-language settings
- [ ] Setting groups/presets

### Phase 3
- [ ] Real-time preview khi edit
- [ ] A/B testing settings
- [ ] Scheduled setting changes
- [ ] Setting permissions (role-based)
- [ ] Setting search & filter
- [ ] Validation schema builder

## Files Created/Modified

### Backend
```
✅ backend/prisma/schema.prisma (+ WebsiteSetting model, enums)
✅ backend/prisma/migrations/xxx_add_website_settings/migration.sql
✅ backend/prisma/seeds/website-settings.seed.ts (36 settings)
✅ backend/src/graphql/schemas/websitesetting.graphql
✅ backend/src/graphql/resolvers/websitesetting.resolver.ts
```

### Frontend
```
✅ frontend/src/hooks/useWebsiteSettings.ts (hooks + helpers)
✅ frontend/src/components/layout/website-header.tsx (updated)
✅ frontend/src/components/layout/website-footer.tsx (updated)
✅ frontend/src/app/admin/settings/website/page.tsx (new admin UI)
```

## Testing

### Test Settings Load
```bash
# Check header settings loaded
curl http://localhost:12000 → Header có logo + màu đúng

# Check footer settings loaded
curl http://localhost:12000 → Footer có company info + social links
```

### Test Admin UI
```
1. Login vào admin
2. Vào /admin/settings/website
3. Chuyển tab → Settings load
4. Edit 1 setting → Hiển thị unsaved changes
5. Click Save → Settings update
6. Refresh trang chủ → Thay đổi áp dụng
```

### Test Dynamic GraphQL
```graphql
# Playground: http://localhost:13000/graphql
query TestSettings {
  publicWebsiteSettings(category: HEADER) {
    key
    value
    type
  }
}
```

## Troubleshooting

### Settings không load
- Check console logs: `console.log('headerSettings', headerSettings)`
- Verify seed đã chạy: `SELECT * FROM website_settings LIMIT 5`
- Check GraphQL query: DevTools → Network → GraphQL requests

### Admin UI không hiển thị
- Check route: `/admin/settings/website`
- Check authentication
- Check permissions

### Thay đổi không apply
- Hard refresh (Ctrl+Shift+R)
- Check cache
- Verify database updated: `SELECT * FROM website_settings WHERE key = 'header.logo'`

## Best Practices

1. **Naming Convention**: `{category}.{name}` (e.g., `header.logo`, `footer.text_color`)
2. **Type Consistency**: Luôn dùng đúng type cho value
3. **Public Settings**: Chỉ set `isPublic=true` cho settings không nhạy cảm
4. **Validation**: Thêm validation rules cho NUMBER, URL, etc.
5. **Defaults**: Luôn có fallback values trong code
6. **Documentation**: Comment rõ ràng cho settings phức tạp

## Kết luận

✅ **Hoàn thành 100%**:
- Database schema & migration
- Seed 36 settings mặc định
- GraphQL schema & resolvers  
- Frontend hooks & helpers
- Header & Footer dynamic rendering
- Admin UI đầy đủ với 7 categories
- Type-safe với TypeScript
- Documentation đầy đủ

**Website settings system** cho phép quản lý toàn bộ cấu hình website qua admin panel, không cần code hay restart server. Mọi thay đổi apply real-time và được audit đầy đủ.
