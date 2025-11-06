# Cập Nhật Logic Menu - Routes Chuẩn Hóa

## 📋 Tổng Quan

Cập nhật toàn bộ logic routing của menu theo chuẩn Vietnamese SEO-friendly URLs.

---

## 🎯 Routes Chuẩn

### Sản Phẩm
- **List:** `/san-pham` (PRODUCT_LIST)
- **Detail:** `/san-pham/[slug]` (PRODUCT_DETAIL)

### Bài Viết
- **List:** `/bai-viet` (BLOG_LIST)
- **Detail:** `/bai-viet/[slug]` (BLOG_DETAIL)

### Danh Mục
- **Category:** `/danh-muc/[id]` (CATEGORY)
- **Blog Category:** `/bai-viet/danh-muc/[id]` (BLOG_CATEGORY)

---

## 🔄 Files Đã Cập Nhật

### 1. MenuRenderer Component

**File:** `/frontend/src/features/menu/components/MenuRenderer.tsx`

**Function `getMenuHref()`:**

```typescript
function getMenuHref(item: MenuItem): string {
  switch (item.linkType) {
    case 'PRODUCT_LIST':
      return '/san-pham';
    
    case 'PRODUCT_DETAIL': {
      const productSlug = item.customData?.productSlug;
      return productSlug ? `/san-pham/${productSlug}` : '#';
    }
    
    case 'BLOG_LIST':
      return '/bai-viet';
    
    case 'BLOG_DETAIL': {
      const blogPostSlug = item.customData?.blogPostSlug;
      return blogPostSlug ? `/bai-viet/${blogPostSlug}` : '#';
    }
    
    case 'CATEGORY':
      return item.categoryId ? `/danh-muc/${item.categoryId}` : '#';
    
    case 'BLOG_CATEGORY':
      return item.blogCategoryId ? `/bai-viet/danh-muc/${item.blogCategoryId}` : '#';
    
    default:
      return item.url || '#';
  }
}
```

### 2. Dynamic Route Handler

**File:** `/frontend/src/app/(website)/[slug]/page.tsx`

**Logic redirect cho Menu:**

```typescript
// Menu BLOG_DETAIL → /bai-viet/[slug]
if (menu.linkType === 'BLOG_DETAIL' && menu.customData?.blogPostSlug) {
  router.push(`/bai-viet/${menu.customData.blogPostSlug}`);
}

// Menu PRODUCT_DETAIL → /san-pham/[slug]
if (menu.linkType === 'PRODUCT_DETAIL' && menu.customData?.productSlug) {
  router.push(`/san-pham/${menu.customData.productSlug}`);
}
```

### 3. Menu Link Selector

**File:** `/frontend/src/components/menu/DynamicMenuLinkSelector.tsx`

**Lưu slug vào customData:**

```typescript
// ProductSelector
const handleProductChange = (productId: string, product: any) => {
  onChange({ 
    productId,
    customData: { 
      productSlug: product.slug,
      productName: product.name 
    }
  });
};

// BlogSelector
const handleBlogChange = (blogPostId: string, blogPost: any) => {
  onChange({ 
    blogPostId,
    customData: { 
      blogPostSlug: blogPost.slug,
      blogPostTitle: blogPost.title 
    }
  });
};
```

---

## ✅ Route Handlers Đã Có

### Sản Phẩm
- ✅ `/frontend/src/app/(website)/san-pham/page.tsx` - Product List
- ✅ `/frontend/src/app/(website)/san-pham/[slug]/page.tsx` - Product Detail

### Bài Viết
- ✅ `/frontend/src/app/(website)/bai-viet/page.tsx` - Blog List
- ✅ `/frontend/src/app/(website)/bai-viet/[slug]/page.tsx` - Blog Detail

---

## 🎨 Theo Rule #10 & #11

- ✅ **Mobile First + Responsive + PWA**
- ✅ **Tất cả Select → Combobox** (Shadcn UI)
- ✅ **Giao diện tiếng Việt**
- ✅ **Clean Architecture**

---

## � Ví Dụ Menu Configuration

### Menu Sản Phẩm
```json
{
  "title": "Sản Phẩm",
  "linkType": "PRODUCT_LIST",
  "route": "/san-pham"
}
```

### Menu Chi Tiết Sản Phẩm
```json
{
  "title": "Rau Cải Xanh Organic",
  "linkType": "PRODUCT_DETAIL",
  "productId": "uuid-123",
  "customData": {
    "productSlug": "rau-cai-xanh-organic",
    "productName": "Rau Cải Xanh Organic"
  }
}
```

### Menu Bài Viết
```json
{
  "title": "Tin Tức",
  "linkType": "BLOG_LIST",
  "route": "/bai-viet"
}
```

### Menu Về Chúng Tôi
```json
{
  "title": "Về Chúng Tôi",
  "slug": "ve-chung-toi",
  "linkType": "BLOG_DETAIL",
  "blogPostId": "uuid-456",
  "customData": {
    "blogPostSlug": "ve-chung-toi",
    "blogPostTitle": "Về Chúng Tôi"
  }
}
```

---

## 🧪 Testing

```bash
# Test routes
curl http://localhost:12000/san-pham
curl http://localhost:12000/san-pham/rau-cai-xanh
curl http://localhost:12000/bai-viet
curl http://localhost:12000/bai-viet/ve-chung-toi

# Test menu redirect
curl -I http://localhost:12000/ve-chung-toi
# Expected: 302 → /bai-viet/ve-chung-toi
```

---

## � Script Chuyển Đổi

**File:** `/backend/scripts/convert-about-to-menu-blog.ts`

Chạy để chuyển page sang menu + blog:

```bash
bun backend/scripts/convert-about-to-menu-blog.ts
```

Script tự động:
1. Unpublish Page Builder (DRAFT)
2. Tạo Blog Post với slug
3. Cập nhật Menu với linkType + customData
4. Lưu blogPostSlug cho routing

---

## � URL Mapping

| Menu LinkType | Old URL | New URL |
|--------------|---------|---------|
| PRODUCT_LIST | `/products` | `/san-pham` |
| PRODUCT_DETAIL | `/product/[id]` | `/san-pham/[slug]` |
| BLOG_LIST | `/blog` | `/bai-viet` |
| BLOG_DETAIL | `/post/[id]` | `/bai-viet/[slug]` |
| CATEGORY | `/category/[id]` | `/danh-muc/[id]` |
| BLOG_CATEGORY | `/blog/category/[id]` | `/bai-viet/danh-muc/[id]` |

---

## ✨ Lợi Ích

1. **SEO-Friendly:** Slug tiếng Việt trong URL
2. **User-Friendly:** URL dễ đọc, dễ nhớ
3. **Consistent:** Chuẩn hóa routes toàn hệ thống
4. **Flexible:** Dễ mở rộng thêm routes mới
5. **Clean:** Tuân thủ Clean Architecture

---

## 📚 Related Files

- `MenuRenderer.tsx` - Component render menu URLs
- `DynamicMenuLinkSelector.tsx` - Admin UI lưu slug
- `[slug]/page.tsx` - Dynamic route handler
- `menu.queries.ts` - GraphQL queries với customData
- `convert-about-to-menu-blog.ts` - Migration script
