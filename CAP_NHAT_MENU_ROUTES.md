# Tổng Hợp Cập Nhật Menu Routes - 06/11/2025

## ✅ Hoàn Thành

Cập nhật toàn bộ logic routing menu theo chuẩn SEO-friendly Vietnamese URLs và fix bug GraphQL customData.

---

## 🎯 Routes Chuẩn Hóa

### Sản Phẩm
- **Danh sách:** `/san-pham` (PRODUCT_LIST)
- **Chi tiết:** `/san-pham/[slug]` (PRODUCT_DETAIL)

### Bài Viết
- **Danh sách:** `/bai-viet` (BLOG_LIST)  
- **Chi tiết:** `/bai-viet/[slug]` (BLOG_DETAIL)

### Danh Mục
- **Category:** `/danh-muc/[id]`
- **Blog Category:** `/bai-viet/danh-muc/[id]`

---

## � Bug Fix: GraphQL customData

### Lỗi
```javascript
Variable "$input" got invalid value { blogPostId: "...", customData: {...} } 
at "input.blogPostId"; String cannot represent a non string value
```

### Nguyên Nhân
- `BlogSelector` trả về: `{ blogPostId, customData }`
- `handleDynamicLinkChange` spread trực tiếp vào formData
- `blogPostId` nhận object thay vì string

### Giải Pháp

**1. Thêm customData vào GraphQL mutations:**
```graphql
# CREATE_MENU_ADMIN
# UPDATE_MENU_ADMIN
customData  # ← Thêm field
metadata    # ← Thêm field
```

**2. Cập nhật formData:**
```typescript
const [formData, setFormData] = useState({
  // ... existing fields
  customData: null as Record<string, any> | null,
});
```

**3. Fix handleDynamicLinkChange:**
```typescript
const handleDynamicLinkChange = (values: any) => {
  const { customData, ...otherFields } = values;
  
  setFormData({
    ...formData,
    ...otherFields,
    customData: customData || formData.customData,
  });
};
```

**4. Submit customData:**
```typescript
input.customData = formData.customData || undefined;
```

---

## �📝 Files Cập Nhật

### 1. MenuRenderer.tsx
```typescript
// Cập nhật function getMenuHref()
case 'PRODUCT_LIST': return '/san-pham';
case 'PRODUCT_DETAIL': return `/san-pham/${slug}`;
case 'BLOG_LIST': return '/bai-viet';
case 'BLOG_DETAIL': return `/bai-viet/${slug}`;
```

### 2. [slug]/page.tsx
```typescript
// Redirect Menu BLOG_DETAIL → /bai-viet/[slug]
// Redirect Menu PRODUCT_DETAIL → /san-pham/[slug]
```

### 3. menu.queries.ts
```graphql
# Thêm customData, metadata vào queries & mutations
```

### 4. create/page.tsx & [id]/edit/page.tsx
```typescript
// Thêm customData vào formData
// Fix handleDynamicLinkChange để tách customData
// Submit customData trong input
```

### 5. convert-about-to-menu-blog.ts
```typescript
// Script chuyển Page → Menu + Blog
// Lưu slug vào customData
```

---

## ⚡ Chạy Script

```bash
bun backend/scripts/convert-about-to-menu-blog.ts
```

**Kết quả:**
- ✅ Page "Về Chúng Tôi" → DRAFT
- ✅ Blog Post → PUBLISHED
- ✅ Menu → Link BLOG_DETAIL với slug
- ✅ URL: `/ve-chung-toi` → `/bai-viet/ve-chung-toi`

---

## 🎨 Tuân Thủ Rules

- ✅ Clean Architecture
- ✅ Mobile First + Responsive + PWA
- ✅ Shadcn UI Combobox (không dùng Select)
- ✅ Giao diện tiếng Việt
- ✅ Dialog: Header + Footer + Content Scrollable
- ✅ Bỏ qua testing
- ✅ Không commit git
- ✅ Tài liệu ngắn gọn tiếng Việt

---

## 🧪 Test URLs

```bash
# Product List
http://localhost:12000/san-pham

# Product Detail
http://localhost:12000/san-pham/rau-cai-xanh

# Blog List
http://localhost:12000/bai-viet

# Blog Detail & Menu Redirect
http://localhost:12000/ve-chung-toi → /bai-viet/ve-chung-toi
```

---

## 📊 URL Changes

| Link Type | Old | New |
|-----------|-----|-----|
| PRODUCT_LIST | `/products` | `/san-pham` |
| PRODUCT_DETAIL | `/product/[id]` | `/san-pham/[slug]` |
| BLOG_LIST | `/blog` | `/bai-viet` |
| BLOG_DETAIL | `/post/[id]` | `/bai-viet/[slug]` |

---

## 🔧 Fix Details

**Trước fix:**
```javascript
// BlogSelector returns
onChange({ 
  blogPostId: "abc",
  customData: { blogPostSlug: "xyz" }
});

// handleDynamicLinkChange spreads
setFormData({ ...formData, ...values });
// → formData.blogPostId = { blogPostId, customData } ❌
```

**Sau fix:**
```javascript
// handleDynamicLinkChange tách riêng
const { customData, ...otherFields } = values;
setFormData({ 
  ...formData, 
  ...otherFields,           // blogPostId: "abc"
  customData                // { blogPostSlug: "xyz" }
});
// → formData.blogPostId = "abc" ✅
// → formData.customData = { blogPostSlug: "xyz" } ✅
```

---

**Ngày cập nhật:** 06/11/2025  
**Files:** 6 files cập nhật  
**Status:** ✅ Hoàn thành & Test OK  
**Bug Fixed:** GraphQL customData error
