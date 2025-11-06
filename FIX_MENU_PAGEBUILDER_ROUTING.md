# ✅ Fix: Menu & Page Builder Routing Conflict

## 📅 Ngày: 6/11/2025

---

## ❌ Vấn Đề

### Tình huống:
1. **Tạo Page Builder** với slug `/ve-chung-toi` → ✅ Hoạt động bình thường
2. **Xóa Page Builder**, chỉ giữ **Menu** trỏ đến `/ve-chung-toi` → ❌ **404 Error**

### Nguyên nhân:
- Component `[slug]/page.tsx` CHỈ query **Page Builder** (GET_PAGE_BY_SLUG)
- Không kiểm tra **Menu** có tồn tại với slug đó không
- Khi Page Builder bị xóa → trả về 404, dù Menu vẫn còn

---

## ✅ Giải Pháp: Fallback Chain

### Logic Mới:
```
Dynamic Route /[slug] xử lý theo thứ tự ưu tiên:

1. Page Builder (Priority 1)
   ↓ Nếu không tìm thấy
   
2. Menu (Priority 2 - Fallback)
   ├─ Có externalUrl → Redirect ra ngoài
   ├─ Có route → Redirect nội bộ  
   └─ Không có → Hiển thị UI "Đang xây dựng"
   ↓ Nếu không tìm thấy
   
3. 404 Not Found
```

---

## 🔧 Thay Đổi Code

### File: `frontend/src/app/(website)/[slug]/page.tsx`

**1. Thêm Import:**
```tsx
import { GET_MENU_BY_SLUG } from '@/graphql/menu.queries';
import { useRouter } from 'next/navigation';
import { ExternalLink, Info } from 'lucide-react';
```

**2. Thêm Query Menu:**
```tsx
// Query 1: Page Builder (Priority)
const { data: pageData, loading: pageLoading } = useQuery(
  GET_PAGE_BY_SLUG, 
  { variables: { slug }, skip: !slug }
);

// Query 2: Menu Fallback (chỉ chạy nếu Page không tồn tại)
const { data: menuData, loading: menuLoading } = useQuery(
  GET_MENU_BY_SLUG,
  { 
    variables: { slug }, 
    skip: !slug || !!pageData?.getPageBySlug 
  }
);
```

**3. Priority Logic:**
```tsx
// ✅ Case 1: Page Builder exists
if (pageData?.getPageBySlug) {
  return <PageBuilderRenderer page={pageData.getPageBySlug} />;
}

// ✅ Case 2: Menu exists (Fallback)
if (menuData?.menuBySlug) {
  const menu = menuData.menuBySlug;
  
  // 2a: External URL → Redirect
  if (menu.externalUrl) {
    window.location.href = menu.externalUrl;
    return <RedirectingUI />;
  }
  
  // 2b: Internal Route → Redirect
  if (menu.route) {
    router.push(menu.route);
    return <RedirectingUI />;
  }
  
  // 2c: Fallback UI "Đang xây dựng"
  return <MenuFallbackUI menu={menu} />;
}

// ✅ Case 3: Not Found
return notFound();
```

---

## 🎨 Fallback UI Component

### Design (Shadcn UI + Mobile First):
```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
  <div className="container mx-auto px-4 py-16 max-w-4xl">
    
    {/* Header */}
    <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
      <div className="flex items-start gap-4">
        <Info className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">{menu.title}</h1>
          <p className="text-gray-600">{menu.description}</p>
        </div>
      </div>
    </div>
    
    {/* Under Construction */}
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <h2 className="font-semibold text-amber-900">
        Trang đang được xây dựng
      </h2>
      <p className="text-amber-800">
        Nội dung đang được chuẩn bị...
      </p>
      
      {/* Children Menus */}
      {menu.children?.length > 0 && (
        <ul>
          {menu.children.map(child => (
            <li>
              <Link href={child.route || child.url}>
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    
    {/* Back Button */}
    <button onClick={() => router.back()}>
      ← Quay lại trang trước
    </button>
  </div>
</div>
```

---

## 📋 Test Cases

### Test 1: Page Builder Priority ✅
```
Setup:
- Page Builder: slug="ve-chung-toi", status=PUBLISHED
- Menu: slug="ve-chung-toi", isActive=true

Truy cập: /ve-chung-toi
Kết quả: Hiển thị Page Builder (blocks)
```

### Test 2: Menu Fallback - External URL ✅
```
Setup:
- Page Builder: KHÔNG tồn tại
- Menu: slug="ve-chung-toi", externalUrl="https://example.com"

Truy cập: /ve-chung-toi
Kết quả: Redirect đến https://example.com
```

### Test 3: Menu Fallback - Internal Route ✅
```
Setup:
- Page Builder: KHÔNG tồn tại
- Menu: slug="ve-chung-toi", route="/about"

Truy cập: /ve-chung-toi
Kết quả: Redirect đến /about
```

### Test 4: Menu Fallback - UI Only ✅
```
Setup:
- Page Builder: KHÔNG tồn tại
- Menu: slug="ve-chung-toi", title="Về chúng tôi", NO route/url

Truy cập: /ve-chung-toi
Kết quả: Hiển thị Fallback UI "Đang xây dựng"
```

### Test 5: Both Not Found ✅
```
Setup:
- Page Builder: KHÔNG tồn tại
- Menu: KHÔNG tồn tại

Truy cập: /ve-chung-toi
Kết quả: 404 Not Found
```

### Test 6: Menu Inactive ✅
```
Setup:
- Page Builder: KHÔNG tồn tại
- Menu: slug="ve-chung-toi", isActive=false

Truy cập: /ve-chung-toi
Kết quả: 404 Not Found
```

---

## 🎯 Kết Quả

### Trước khi Fix:
- ❌ Xóa Page Builder → 404 (dù Menu còn)
- ❌ User experience kém
- ❌ Không linh hoạt

### Sau khi Fix:
- ✅ Page Builder vẫn là priority
- ✅ Menu làm fallback nếu không có Page
- ✅ Hỗ trợ redirect (external/internal)
- ✅ Fallback UI thân thiện
- ✅ Không bao giờ 404 nếu Menu tồn tại
- ✅ Mobile First + Responsive (Shadcn UI)

---

## 📊 Performance

### Query Strategy:
- **Sequential Queries**: Page → Menu (không parallel)
- **Skip Logic**: Menu query chỉ chạy nếu Page không tồn tại
- **Network Calls**: Tối đa 2 queries, thực tế 1 query (vì skip)

### Loading States:
1. Slug resolving → Spinner
2. Page loading → Spinner
3. Menu loading (nếu cần) → Spinner
4. Content render

---

## 🚀 Testing

### Manual Test:
```bash
# 1. Tạo Page Builder "ve-chung-toi"
Admin > Page Builder > New Page
- Title: "Về chúng tôi"
- Slug: "ve-chung-toi"
- Status: Published

# 2. Truy cập
http://localhost:12001/ve-chung-toi
Expect: Hiển thị Page Builder ✅

# 3. Xóa Page Builder
Admin > Page Builder > Delete "ve-chung-toi"

# 4. Tạo Menu
Admin > Menu > New Menu
- Title: "Về chúng tôi"
- Slug: "ve-chung-toi"
- Type: HEADER
- isActive: true

# 5. Truy cập lại
http://localhost:12001/ve-chung-toi
Expect: Hiển thị Fallback UI ✅ (Không 404!)

# 6. Thêm route vào Menu
Admin > Menu > Edit
- Route: "/about"

# 7. Truy cập lại
http://localhost:12001/ve-chung-toi
Expect: Redirect đến /about ✅
```

---

## 📁 Files Changed

### Modified:
- `frontend/src/app/(website)/[slug]/page.tsx` (Main fix)

### Used Libraries:
- `@apollo/client` - GraphQL queries
- `next/navigation` - Router, notFound
- `lucide-react` - Icons (ExternalLink, Info)
- `shadcn/ui` - UI components (Button, etc.)

### Related Files:
- `frontend/src/graphql/queries/pages.ts` - GET_PAGE_BY_SLUG
- `frontend/src/graphql/menu.queries.ts` - GET_MENU_BY_SLUG
- `frontend/src/components/layout/website-header.tsx` - Menu rendering

---

## 📚 Documentation

- `MENU_PAGEBUILDER_ROUTING_ANALYSIS.md` - Phân tích chi tiết vấn đề
- `FIX_MENU_PAGEBUILDER_ROUTING.md` - Tài liệu này

---

## ✅ Checklist

- [x] Implement fallback chain logic
- [x] Add GET_MENU_BY_SLUG query
- [x] Handle external URL redirect
- [x] Handle internal route redirect
- [x] Design fallback UI (Shadcn + Mobile First)
- [x] Add children menus support
- [x] Add back button
- [x] No TypeScript errors
- [x] Follow rulepromt.txt guidelines
- [x] Vietnamese UI
- [x] Responsive design
- [ ] Manual testing với các scenarios
- [ ] Production deployment

---

**Status:** ✅ **Implementation Complete - Ready for Testing**

**Rule Applied:**
- ✅ Clean Architecture (Rule 2)
- ✅ Performance Optimization (Rule 3) - Sequential queries với skip
- ✅ User Experience (Rule 5) - Không 404 nếu Menu tồn tại
- ✅ Code Quality (Rule 6) - Logic rõ ràng, maintainable
- ✅ Shadcn UI Mobile First (Rule 10)
- ✅ Vietnamese UI (Rule 12)
- ✅ Tài liệu ngắn gọn (Rule 9)
