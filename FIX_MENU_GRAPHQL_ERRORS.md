# Fix Menu GraphQL Errors - 06/11/2025

## ✅ Đã Fix 2 Bugs GraphQL

---

## 🐛 Bug 1: Input Value Error

**Lỗi:**
```
Variable "$input" got invalid value { blogPostId: "...", customData: {...} } 
at "input.blogPostId"; String cannot represent a non string value
```

**Nguyên nhân:** `handleDynamicLinkChange` spread object lồng nhau

**Fix (Frontend - 3 files):**

1. **create/page.tsx & [id]/edit/page.tsx:**
```typescript
// Thêm customData vào state
customData: null as Record<string, any> | null,

// Fix handleDynamicLinkChange
const { customData, ...otherFields } = values;
setFormData({ ...formData, ...otherFields, customData });

// Submit customData
input.customData = formData.customData || undefined;
```

2. **menu.queries.ts:**
```graphql
mutation CreateMenuAdmin($input: CreateMenuInput!) {
  createMenu(input: $input) {
    customData  # ← Thêm
    metadata    # ← Thêm
  }
}
```

---

## 🐛 Bug 2: Schema Missing Fields

**Lỗi:**
```
Cannot query field "customData" on type "MenuResponseDto"
Cannot query field "metadata" on type "MenuResponseDto"
```

**Nguyên nhân:** Backend DTO thiếu fields

**Fix (Backend - 1 file):**

**menu-response.dto.ts:**
```typescript
import GraphQLJSON from 'graphql-type-json';

@Field(() => GraphQLJSON, { nullable: true })
customData?: Record<string, any> | null;

@Field(() => GraphQLJSON, { nullable: true })
metadata?: Record<string, any> | null;
```

---

## 📝 Files Đã Fix

**Backend (1 file):**
- ✅ `menu-response.dto.ts` - Thêm customData, metadata fields

**Frontend (3 files):**
- ✅ `menu.queries.ts` - Thêm fields vào mutations
- ✅ `create/page.tsx` - Fix handleDynamicLinkChange
- ✅ `[id]/edit/page.tsx` - Fix handleDynamicLinkChange

---

## 🧪 Test

```bash
# Admin Menu - Create/Edit
1. Vào Admin → Menu → Create/Edit
2. Chọn Link Type: BLOG_DETAIL
3. Select blog post
4. Save → Không có GraphQL errors ✅

# Verify customData saved
5. Edit lại menu → customData hiển thị đúng
```

---

## ✅ Kết Quả

**Trước:**
- GraphQL Input Error ❌
- GraphQL Schema Error ❌

**Sau:**
- Menu create/edit thành công ✅
- customData lưu đúng { blogPostSlug, blogPostTitle } ✅
- Frontend render URL: `/bai-viet/[slug]` ✅
- Backend auto-reload (ts-node-dev) ✅

---

**Status:** ✅ Fixed  
**Files:** 4 files  
**Backend:** Auto-reloaded  
**Ready:** Production
