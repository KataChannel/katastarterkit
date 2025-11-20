# SEO Settings Management Guide

## Quick Access

Admin Panel → Settings → Website → **SEO Tab**

URL: `http://localhost:13000/admin/settings/website`

## Settings Overview

### 📋 Basic Settings (2)

| Setting | Description | Example |
|---------|-------------|---------|
| **Site Name** | Tên chính thức của website | `Rau Sạch Trần Gia` |
| **Site Tagline** | Slogan ngắn gọn | `Rau sạch, an toàn cho sức khỏe` |

### 🔍 Meta Tags (3)

| Setting | Description | Max Length | Example |
|---------|-------------|------------|---------|
| **Meta Title** | Tiêu đề hiển thị trên tab browser & search results | ~60 chars | `Rau Sạch Trần Gia - Rau sạch, an toàn cho sức khỏe` |
| **Meta Description** | Mô tả ngắn hiển thị trong search results | ~160 chars | `Chuyên cung cấp rau sạch, thực phẩm hữu cơ...` |
| **Keywords** | Từ khóa SEO (phân cách bằng dấu phẩy) | - | `rau sạch, rau hữu cơ, thực phẩm an toàn` |

### 📱 Open Graph (5)

Cấu hình hiển thị khi share trên Facebook, LinkedIn, etc.

| Setting | Description | Example |
|---------|-------------|---------|
| **OG Title** | Tiêu đề khi share | `Rau Sạch Trần Gia` |
| **OG Description** | Mô tả khi share | `Chuyên cung cấp rau sạch, thực phẩm hữu cơ...` |
| **OG Image** | URL ảnh (1200x630px) | `/og-image.png` |
| **OG Type** | Loại nội dung | `website` / `article` / `product` / `blog` |
| **OG Locale** | Ngôn ngữ và vùng | `vi_VN` / `en_US` |

### 🐦 Twitter Cards (5)

Cấu hình hiển thị khi share trên Twitter/X

| Setting | Description | Example |
|---------|-------------|---------|
| **Card Type** | Loại card | `summary_large_image` (recommended) |
| **Twitter Title** | Tiêu đề trên Twitter | `Rau Sạch Trần Gia` |
| **Twitter Description** | Mô tả trên Twitter | `Chuyên cung cấp rau sạch...` |
| **Twitter Image** | URL ảnh | `/og-image.png` |
| **Twitter Site** | Twitter handle | `@rausachtrangia` |

### 🤖 Robots & Indexing (2)

| Setting | Description | Recommended |
|---------|-------------|-------------|
| **Allow Index** | Cho phép search engines index website | ✅ `true` (production) |
| **Allow Follow** | Cho phép search engines follow links | ✅ `true` (production) |

### 📝 Additional (2)

| Setting | Description | Example |
|---------|-------------|---------|
| **Author** | Tên tác giả/team phát triển | `Rau Sạch Trần Gia Team` |
| **Canonical URL** | URL chính thức (tránh duplicate content) | Leave empty hoặc `https://rausachtrangia.com` |

## How to Update

### Via Admin UI

1. Login as ADMIN
2. Navigate to **Admin → Settings → Website**
3. Click **SEO** tab
4. Update fields
5. Click **Save Changes**
6. Rebuild frontend (production) hoặc reload page (development)

### Via Database (Advanced)

```sql
-- Update meta title
UPDATE "WebsiteSetting" 
SET value = 'New Title Here'
WHERE key = 'seo.meta_title';

-- Update OG image
UPDATE "WebsiteSetting" 
SET value = '/new-og-image.png'
WHERE key = 'seo.og_image';
```

### Via Seed Script

```bash
cd backend

# Edit scripts/seed-seo-settings.ts
# Update values in seoSettings array

# Run seed
npx ts-node scripts/seed-seo-settings.ts
```

## Best Practices

### ✅ Meta Title
- Keep under 60 characters
- Include primary keyword
- Make it compelling for clicks
- Format: `Primary Keyword - Secondary Keyword | Brand`

**Good**: `Rau Sạch Trần Gia - Thực Phẩm Hữu Cơ Cao Cấp`  
**Bad**: `Welcome to Our Website About Organic Vegetables and Healthy Food Products`

### ✅ Meta Description
- Keep under 160 characters
- Include call-to-action
- Be specific and descriptive
- Include 1-2 keywords naturally

**Good**: `Chuyên cung cấp rau sạch, thực phẩm hữu cơ chất lượng cao. Giao hàng tận nơi tại TP.HCM. Đặt hàng ngay!`  
**Bad**: `This is our website where we sell vegetables.`

### ✅ Keywords
- Use 5-10 relevant keywords
- Separate by commas
- Focus on long-tail keywords
- Match user search intent

**Good**: `rau sạch tphcm, rau hữu cơ giao tận nơi, thực phẩm sạch cao cấp`  
**Bad**: `rau, thực phẩm, ăn, uống, mua, bán`

### ✅ Open Graph Image
- **Size**: 1200x630px (Facebook recommended)
- **Format**: PNG or JPG
- **File size**: < 1MB
- **Content**: Include logo, text, visual appeal
- **Path**: Store in `/public/` folder

### ✅ Twitter Site Handle
- Format: `@username` (include @ symbol)
- Use your official Twitter/X account
- Must be verified account for badge

### ✅ Robots Settings

| Environment | Index | Follow |
|-------------|-------|--------|
| Production | ✅ true | ✅ true |
| Staging | ❌ false | ❌ false |
| Development | ❌ false | ❌ false |

## Testing

### 1. Check HTML Output

View page source (`Ctrl+U`) and verify:

```html
<title>Rau Sạch Trần Gia - Rau sạch, an toàn cho sức khỏe</title>
<meta name="description" content="Chuyên cung cấp rau sạch..." />
<meta property="og:title" content="Rau Sạch Trần Gia" />
<meta property="og:image" content="http://localhost:13000/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
```

### 2. Test Social Sharing

**Facebook Debugger**  
https://developers.facebook.com/tools/debug/

1. Paste your URL
2. Click "Debug"
3. Check preview
4. Click "Scrape Again" if needed

**Twitter Card Validator**  
https://cards-dev.twitter.com/validator

1. Paste your URL
2. Click "Preview card"
3. Verify image and text

**LinkedIn Post Inspector**  
https://www.linkedin.com/post-inspector/

1. Paste your URL
2. Click "Inspect"
3. Verify preview

### 3. Google Search Console

After deploying to production:

1. Add site to Google Search Console
2. Submit sitemap
3. Check "URL Inspection" tool
4. Monitor "Performance" for impressions/clicks

## Troubleshooting

### Meta tags not updating

**Cause**: Next.js caches metadata  
**Solution**: 
```bash
cd frontend
rm -rf .next
npm run build
```

### Social sharing shows old image

**Cause**: Facebook/Twitter caches images  
**Solution**: Use debugger tools and click "Scrape Again"

### Image not showing in preview

**Checklist**:
- ✅ Image exists in `/public/og-image.png`
- ✅ Image size is 1200x630px
- ✅ Image URL is absolute (includes domain)
- ✅ Image is publicly accessible
- ✅ File size < 1MB

### Keywords not working

**Note**: Meta keywords tag is largely ignored by Google since 2009. Focus on:
- Quality content
- Natural keyword usage in title/description
- Structured data (JSON-LD)
- Backlinks

## Monitoring

### Google Analytics
- Track organic search traffic
- Monitor bounce rate
- Check page views per session

### Google Search Console
- Track impressions
- Monitor click-through rate (CTR)
- Check average position
- Fix indexing issues

### Social Media Analytics
- Facebook Insights (shares, reactions)
- Twitter Analytics (retweets, likes)
- LinkedIn Analytics (impressions, clicks)

## Common Use Cases

### Case 1: Launching New Campaign

```
Before launch:
1. Update Meta Title with campaign keywords
2. Update Meta Description with offer/CTA
3. Create campaign-specific OG image
4. Update OG Title/Description
5. Test social sharing
6. Deploy changes
```

### Case 2: Seasonal Updates

```
Example: Tết Holiday
- Meta Title: "Rau Sạch Tết 2025 - Đặt Hàng Sớm"
- OG Image: Update with Tết theme
- Description: Include Tết offer
```

### Case 3: Rebranding

```
1. Update Site Name
2. Update all titles (Meta, OG, Twitter)
3. Update @twitter_site handle
4. Create new branded OG image
5. Update author/creator info
```

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/) for structured data

## Support

Need help? Contact:
- 📧 Email: contact@rausachtrangia.com
- 💬 Support Chat: Available in admin panel
- 📚 Documentation: `/docs/SEO_METADATA_CONFIGURATION.md`
