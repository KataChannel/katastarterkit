# Fix Bug Chọn Sản Phẩm/Bài Viết Không Hoạt Động - 06/11/2025

## 🐛 Bug

**Triệu chứng:** Khi chọn sản phẩm hoặc bài viết trong Cấu Hình Liên Kết, không có phản hồi/không lưu được.

---

## 🔍 Nguyên Nhân

**File:** `DynamicMenuLinkSelector.tsx`

**Vấn đề:** Mismatch giữa callback onChange

```typescript
// ❌ SAI - Wrapper onChange expect string, nhưng nhận object
case 'PRODUCT_DETAIL':
  return <ProductSelector 
    value={value.productId} 
    onChange={(v) => onChange({ productId: v })}  // ← Expect v = string
  />

// Nhưng ProductSelector trả về object:
const handleProductChange = (productId: string) => {
  onChange({
    productId: selectedProduct.id,
    customData: { ... }  // ← Trả về object
  });
}
```

**Kết quả:**
- `onChange` nhận: `{ productId: { productId: "abc", customData: {...} } }`
- Thay vì: `{ productId: "abc", customData: {...} }`

---

## ✅ Giải Pháp

**Xóa wrapper onChange, pass trực tiếp:**

```typescript
// ✅ ĐÚNG
case 'PRODUCT_DETAIL':
  return <ProductSelector 
    value={value.productId} 
    onChange={onChange}  // ← Pass trực tiếp
  />

case 'BLOG_DETAIL':
  return <BlogSelector 
    value={value.blogPostId} 
    onChange={onChange}  // ← Pass trực tiếp
  />
```

---

## 📝 File Đã Fix

**1 file:**
- ✅ `DynamicMenuLinkSelector.tsx` - Xóa wrapper onChange cho PRODUCT_DETAIL và BLOG_DETAIL

**Changes:**
```diff
- onChange={(v) => onChange({ productId: v })}
+ onChange={onChange}

- onChange={(v) => onChange({ blogPostId: v })}
+ onChange={onChange}
```

---

## 🧪 Test

```bash
# Test flow
1. Admin → Menu → Create/Edit
2. Link Type: PRODUCT_DETAIL
3. Chọn sản phẩm từ Combobox
4. ✅ Sản phẩm được chọn, hiển thị trong combobox
5. Save menu
6. ✅ customData lưu đúng { productSlug, productName }

# Tương tự với BLOG_DETAIL
7. Link Type: BLOG_DETAIL  
8. Chọn bài viết
9. ✅ Bài viết được chọn
10. customData lưu đúng { blogPostSlug, blogPostTitle }
```

---

## ✅ Kết Quả

**Trước:**
- Chọn sản phẩm/bài viết → Không phản hồi ❌
- customData không được lưu ❌

**Sau:**
- Chọn sản phẩm/bài viết → Hiển thị ngay ✅
- customData lưu đúng format ✅
- Form validation hoạt động ✅

---

**Status:** ✅ Fixed  
**Files:** 1 file  
**Lines changed:** 2 lines  
**Impact:** HIGH - Core functionality
