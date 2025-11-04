# Dynamic SEO Metadata Configuration

## Tổng quan

Metadata của website (title, description, Open Graph, Twitter cards, robots) hiện đã được cấu hình động từ **Admin Settings > Website > SEO**.

## Kiến trúc

### 1. Database Settings (Backend)
- **Location**: Table `WebsiteSetting` với `category = 'SEO'`
- **Script**: `/backend/scripts/seed-seo-settings.ts`
- **Total**: 19 SEO settings được tổ chức theo nhóm:

#### Nhóm Basic (2 settings)
- `seo.site_name` - Tên website
- `seo.site_tagline` - Slogan website

#### Nhóm Meta (3 settings)
- `seo.meta_title` - Meta title cho search engine
- `seo.meta_description` - Meta description
- `seo.keywords` - Keywords (phân cách bằng dấu phẩy)

#### Nhóm Open Graph (5 settings)
- `seo.og_title` - Title khi share
- `seo.og_description` - Description khi share
- `seo.og_image` - Image URL (1200x630px)
- `seo.og_type` - Type (website/article/product/blog)
- `seo.og_locale` - Locale (vi_VN/en_US)

#### Nhóm Twitter (5 settings)
- `seo.twitter_card` - Card type (summary_large_image/summary/app/player)
- `seo.twitter_title` - Twitter title
- `seo.twitter_description` - Twitter description
- `seo.twitter_image` - Twitter image URL
- `seo.twitter_site` - Twitter handle (@username)

#### Nhóm Robots (2 settings)
- `seo.robots_index` - Cho phép index (true/false)
- `seo.robots_follow` - Cho phép follow links (true/false)

#### Nhóm Additional (2 settings)
- `seo.author` - Tên tác giả/team
- `seo.canonical_url` - Canonical URL (để tránh duplicate content)

### 2. Metadata Generation (Frontend)
- **File**: `/frontend/src/lib/metadata.ts`
- **Function**: `generateMetadata()` - Async function fetch settings từ GraphQL
- **Caching**: `cache: 'no-store'` để luôn lấy data mới nhất

### 3. Root Layout (Frontend)
- **File**: `/frontend/src/app/layout.tsx`
- **Export**: `generateMetadata()` function (Next.js convention)
- **Behavior**: Next.js tự động gọi function này khi build/render page

## Cách sử dụng

### 1. Cấu hình SEO Settings

Truy cập: **Admin Panel > Settings > Website > Tab SEO**

Các trường có thể chỉnh sửa:
- ✏️ Basic info: Site name, tagline
- 🔍 Meta tags: Title, description, keywords
- 📱 Social sharing: Open Graph, Twitter cards
- 🤖 Search engines: Robots index/follow
- 📝 Additional: Author, canonical URL

### 2. Seed Initial Data

Nếu cần reset về giá trị mặc định:

```bash
cd backend
npx ts-node scripts/seed-seo-settings.ts
```

Output:
```
🔍 SEO SETTINGS MIGRATION
============================================================
✨ Created: seo.site_name
✨ Created: seo.site_tagline
✅ Updated: seo.meta_title
...
📊 SUMMARY:
   Created: 15
   Updated: 3
   Skipped: 1
   Total: 19
============================================================
```

### 3. Verify Metadata

Sau khi thay đổi settings:

1. **Local Development**: Reload trang để thấy metadata mới
2. **Production**: Deploy lại hoặc rebuild để apply changes
3. **Check HTML**: View page source và tìm các thẻ:
   ```html
   <title>...</title>
   <meta name="description" content="..." />
   <meta property="og:title" content="..." />
   <meta name="twitter:card" content="..." />
   ```

### 4. Testing Social Sharing

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

Paste URL và kiểm tra preview.

## Fallback Strategy

Nếu không fetch được settings từ database, hệ thống sử dụng giá trị mặc định:

```typescript
const siteName = seo.site_name || 'Rau Sạch Trần Gia';
const metaTitle = seo.meta_title || 'Rau Sạch Trần Gia - Rau sạch, an toàn cho sức khỏe';
// ... etc
```

## Performance

- **Fetch**: GraphQL query khi generate metadata (build time hoặc request time)
- **Cache**: `cache: 'no-store'` đảm bảo luôn lấy data mới nhất
- **Impact**: Minimal - chỉ 1 GraphQL query khi load trang

## Troubleshooting

### Metadata không update

1. **Check backend**: Settings đã lưu trong database chưa?
   ```sql
   SELECT key, value FROM "WebsiteSetting" WHERE category = 'SEO';
   ```

2. **Check GraphQL endpoint**: `NEXT_PUBLIC_GRAPHQL_ENDPOINT` có đúng không?
   ```bash
   echo $NEXT_PUBLIC_GRAPHQL_ENDPOINT
   ```

3. **Rebuild frontend**:
   ```bash
   cd frontend
   npm run build
   ```

### GraphQL query lỗi

Check console log:
- ❌ "Failed to fetch SEO settings" → Backend không chạy
- ❌ "Error fetching SEO settings" → Network/CORS issue

### Social sharing không hiển thị ảnh

1. Check image path: `/og-image.png` phải tồn tại trong `/public`
2. Image size: Khuyến nghị 1200x630px
3. Image format: PNG hoặc JPG
4. Clear cache social platform (Facebook debugger, Twitter validator)

## Best Practices

1. ✅ **Always test social sharing** sau khi thay đổi OG/Twitter settings
2. ✅ **Use descriptive keywords** phân cách bằng dấu phẩy
3. ✅ **Keep title < 60 chars** để hiển thị đầy đủ trên search results
4. ✅ **Keep description < 160 chars** cho meta description
5. ✅ **Use high-quality images** (1200x630px) cho social sharing
6. ✅ **Set canonical URL** nếu có nhiều URLs trỏ về cùng content

## Example Values

```typescript
// Good examples
seo.meta_title = "Rau Sạch Trần Gia - Rau sạch, an toàn cho sức khỏe"
seo.meta_description = "Chuyên cung cấp rau sạch, thực phẩm hữu cơ chất lượng cao, an toàn cho sức khỏe. Giao hàng tận nơi tại TP.HCM."
seo.keywords = "rau sạch, rau hữu cơ, thực phẩm an toàn, rau sạch trần gia, rau sạch tphcm"
seo.og_image = "/og-image.png"
seo.twitter_site = "@rausachtrangia"
```

## Migration Notes

### Trước đây (Hardcoded)
```typescript
export const metadata: Metadata = {
  title: 'Rau Sạch Trần Gia',
  description: 'Enterprise Fullstack Starter Kit...',
  // ... hardcoded values
};
```

### Bây giờ (Dynamic)
```typescript
export async function generateMetadata() {
  return await getMetadata(); // Fetch from database
}
```

### Benefits
- ✅ Admin có thể thay đổi SEO settings qua UI
- ✅ Không cần code changes để update metadata
- ✅ Consistent với các settings khác (CONTACT, AUTH, etc.)
- ✅ Centralized configuration trong admin panel

## Related Files

```
backend/
├── scripts/seed-seo-settings.ts          # Seed script
└── prisma/schema.prisma                  # WebsiteSetting model

frontend/
├── src/
│   ├── app/layout.tsx                    # Root layout với generateMetadata
│   └── lib/metadata.ts                   # Metadata generation logic
```

## Future Enhancements

- [ ] Per-page metadata override
- [ ] Multi-language SEO settings
- [ ] SEO preview trong admin panel
- [ ] Auto-generate meta description từ content
- [ ] Structured data (JSON-LD) support
