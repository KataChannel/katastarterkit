# 🔍 Phân Tích Vấn Đề: Menu vs Page Builder Routing

## 📅 Ngày: 6/11/2025

---

## ❌ Vấn Đề Hiện Tại

### Kịch Bản 1: Tạo Page Builder `/ve-chung-toi`
```
Admin tạo:
1. Page Builder với slug "ve-chung-toi"
2. Thêm content, blocks, publish

Frontend:
✅ Truy cập http://localhost:12001/ve-chung-toi
✅ Hiển thị đúng nội dung từ Page Builder
✅ Route: /app/(website)/[slug]/page.tsx xử lý
```

### Kịch Bản 2: Xóa Page Builder, Chỉ Giữ Menu
```
Admin:
1. Xóa Page Builder "ve-chung-toi"
2. Tạo Menu trỏ đến /ve-chung-toi (hoặc một URL khác)

Frontend:
❌ Truy cập http://localhost:12001/ve-chung-toi
❌ Kết quả: 404 Not Found
❌ Lý do: [slug] page.tsx không tìm thấy Page từ GraphQL query
```

---

## 🔍 Phân Tích Routing Hiện Tại

### File Structure
```
frontend/src/app/
├── (website)/
│   ├── layout.tsx               # Website layout với Header + Footer
│   ├── [slug]/
│   │   └── page.tsx            # ❗ Dynamic page - CHỈ render PageBuilder
│   ├── bai-viet/
│   │   └── page.tsx            # Blog listing
│   ├── san-pham/
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/page.tsx     # Product detail
│   └── gio-hang/
       └── page.tsx             # Cart
```

### Flow Hiện Tại

**1. User truy cập `/ve-chung-toi`**

**2. Next.js Router:**
```
- Check static routes: ❌ Không match
- Check dynamic route: ✅ Match /[slug]/page.tsx
```

**3. Component `[slug]/page.tsx`:**
```tsx
const { data, loading, error } = useQuery(GET_PAGE_BY_SLUG, {
  variables: { slug: 've-chung-toi' },
  skip: slug === null,
  errorPolicy: 'all'
});

// ❌ PROBLEM: Nếu không có Page Builder -> error/notFound
if (error || !data?.getPageBySlug || slug === '') {
  return notFound(); // ❌ 404 Error
}
```

**4. Vấn đề:**
- Component CHỈ query Page Builder (GET_PAGE_BY_SLUG)
- KHÔNG check Menu có liên kết đến slug này không
- Nếu Page Builder bị xóa → 404, dù Menu vẫn tồn tại

---

## 🔧 Rule Từ `rulepromt.txt`

```
1. Code Principal Engineer
2. Architecture (Clean Architecture)
3. Performance Optimizations
4. Developer Experience
5. User Experience
6. Code Quality
7. Bỏ qua testing
8. Không git
9. Chỉ tạo 1 file .md tổng hợp ngắn gọn cuối cùng bằng tiếng việt
10. Frontend chuẩn shadcn UI code giao diện Mobile First + Responsive + PWA
11. Tất cả Select đổi thành Combobox
12. Giao diện tiếng việt
13. Tất cả Dialog sử dụng theo layout header, footer, content scrollable
```

### Áp Dụng Cho Vấn Đề Này:
- **Rule 1-2**: Clean Architecture - Tách biệt routing logic Page vs Menu
- **Rule 3**: Performance - Tránh multiple queries không cần thiết
- **Rule 5**: User Experience - Menu không nên dẫn đến 404
- **Rule 6**: Code Quality - Logic rõ ràng, dễ maintain

---

## ✅ Giải Pháp Đề Xuất

### Option 1: Fallback Chain (RECOMMENDED)

**Concept:**
```
Dynamic Route /[slug] xử lý theo thứ tự:
1. Kiểm tra Page Builder trước (ưu tiên cao)
2. Nếu không có, kiểm tra Menu
3. Nếu Menu tồn tại, hiển thị fallback UI hoặc redirect
4. Nếu không có cả hai → 404
```

**Implementation:**
```tsx
// frontend/src/app/(website)/[slug]/page.tsx

export default function DynamicPage({ params }: DynamicPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  
  // Query 1: Page Builder
  const { data: pageData, loading: pageLoading, error: pageError } = useQuery(
    GET_PAGE_BY_SLUG,
    { variables: { slug }, skip: !slug }
  );
  
  // Query 2: Menu (only if Page not found)
  const { data: menuData, loading: menuLoading } = useQuery(
    GET_MENU_BY_SLUG,
    { 
      variables: { slug }, 
      skip: !slug || !!pageData?.getPageBySlug // Skip if Page exists
    }
  );
  
  // Priority Logic
  if (pageLoading || menuLoading) return <Loading />;
  
  // Case 1: Page Builder exists → Render blocks
  if (pageData?.getPageBySlug) {
    return <PageBuilderRenderer page={pageData.getPageBySlug} />;
  }
  
  // Case 2: Menu exists but no Page → Handle gracefully
  if (menuData?.menuBySlug) {
    const menu = menuData.menuBySlug;
    
    // Option 2a: Redirect to menu's target URL
    if (menu.externalUrl) {
      return <RedirectToExternal url={menu.externalUrl} />;
    }
    
    // Option 2b: Render fallback content
    return (
      <div className="container mx-auto py-12">
        <h1>{menu.title}</h1>
        <p>Trang này đang được xây dựng.</p>
        {menu.description && <p>{menu.description}</p>}
      </div>
    );
  }
  
  // Case 3: Both not found → 404
  return notFound();
}
```

**Pros:**
- ✅ Không 404 khi Menu tồn tại
- ✅ Ưu tiên Page Builder (content-first)
- ✅ Graceful fallback
- ✅ Tương thích ngược

**Cons:**
- ⚠️ 2 queries (nhưng sequential, chỉ 1 execute ở một thời điểm)
- ⚠️ Cần design fallback UI

---

### Option 2: Unified Query

**Concept:**
```
Backend cung cấp 1 query duy nhất:
getRouteBySlug(slug) {
  type: 'PAGE' | 'MENU' | 'NOT_FOUND'
  data: Page | Menu | null
}
```

**Implementation Backend:**
```typescript
// backend/src/graphql/resolvers/route.resolver.ts

@Query(() => RouteType)
async getRouteBySlug(@Args('slug') slug: string) {
  // 1. Check Page Builder first
  const page = await this.prisma.page.findUnique({
    where: { slug },
    include: { blocks: true }
  });
  
  if (page && page.status === 'PUBLISHED') {
    return { type: 'PAGE', data: page };
  }
  
  // 2. Check Menu
  const menu = await this.prisma.menu.findUnique({
    where: { slug }
  });
  
  if (menu && menu.isActive) {
    return { type: 'MENU', data: menu };
  }
  
  // 3. Not found
  return { type: 'NOT_FOUND', data: null };
}
```

**Frontend:**
```tsx
const { data } = useQuery(GET_ROUTE_BY_SLUG, { variables: { slug } });

switch (data?.getRouteBySlug.type) {
  case 'PAGE':
    return <PageBuilderRenderer page={data.data} />;
  case 'MENU':
    return <MenuFallback menu={data.data} />;
  default:
    return notFound();
}
```

**Pros:**
- ✅ 1 query duy nhất
- ✅ Performance tốt hơn
- ✅ Logic tập trung ở backend

**Cons:**
- ⚠️ Cần refactor backend
- ⚠️ Migration effort lớn

---

### Option 3: Menu Redirect Logic

**Concept:**
```
Menu không bao giờ có slug giống Page Builder.
Menu chỉ là navigation, không có content page riêng.
Nếu click menu → redirect đến target URL (externalUrl, route, url)
```

**Implementation:**
```tsx
// Trong WebsiteHeader component

headerMenus.map(menu => {
  const href = menu.externalUrl || menu.route || menu.url || `/${menu.slug}`;
  
  return (
    <Link href={href} target={menu.target === 'BLANK' ? '_blank' : undefined}>
      {menu.title}
    </Link>
  );
});
```

**Behavior:**
```
Menu "Về chúng tôi":
- title: "Về chúng tôi"
- slug: "ve-chung-toi-menu" (khác slug page)
- route: "/ve-chung-toi" (trỏ đến page slug)

User click menu → redirect to /ve-chung-toi (page builder)
```

**Pros:**
- ✅ Tách biệt rõ ràng Menu vs Page
- ✅ Không conflict slug
- ✅ Đơn giản nhất

**Cons:**
- ⚠️ Yêu cầu admin cấu hình đúng
- ⚠️ Nếu Page bị xóa → Menu vẫn trỏ đến 404

---

## 🎯 Recommendation

### CHỌN: **Option 1 - Fallback Chain**

**Lý do:**
1. **User Experience**: Không bao giờ 404 nếu Menu tồn tại
2. **Backward Compatible**: Không phá vỡ logic hiện tại
3. **Flexible**: Admin có thể có Menu mà không cần Page Builder
4. **Clear Separation**: Page Builder là content, Menu là navigation

**Implementation Steps:**
1. ✅ Thêm query GET_MENU_BY_SLUG vào `[slug]/page.tsx`
2. ✅ Implement fallback logic (Page → Menu → 404)
3. ✅ Design fallback UI component
4. ✅ Test scenarios:
   - Page exists, no Menu
   - Menu exists, no Page
   - Both exist (Page priority)
   - Neither exists (404)

---

## 📝 Test Cases

### Test 1: Page Builder Priority
```
Setup:
- Page: slug="ve-chung-toi", status=PUBLISHED
- Menu: slug="ve-chung-toi", isActive=true

Expected:
✅ Hiển thị nội dung từ Page Builder
```

### Test 2: Menu Fallback
```
Setup:
- Page: KHÔNG tồn tại
- Menu: slug="ve-chung-toi", isActive=true, externalUrl="/about"

Expected:
✅ Redirect đến /about HOẶC hiển thị fallback UI
```

### Test 3: Both Missing
```
Setup:
- Page: KHÔNG tồn tại
- Menu: KHÔNG tồn tại

Expected:
✅ 404 Not Found
```

### Test 4: Menu Inactive
```
Setup:
- Page: KHÔNG tồn tại
- Menu: slug="ve-chung-toi", isActive=false

Expected:
✅ 404 Not Found (như thể menu không tồn tại)
```

---

## 🚀 Next Steps

1. **Implement Option 1** trong `[slug]/page.tsx`
2. **Create MenuFallback component** (shadcn UI, mobile-first)
3. **Update documentation**
4. **Manual testing** với các scenarios trên

---

## 📚 Related Files

- `frontend/src/app/(website)/[slug]/page.tsx` - Dynamic route handler
- `frontend/src/components/layout/website-header.tsx` - Menu rendering
- `frontend/src/graphql/menu.queries.ts` - Menu GraphQL queries
- `frontend/src/graphql/queries/pages.ts` - Page Builder queries
- `backend/src/menu/menu.resolver.ts` - Menu backend resolver
- `backend/src/services/menu.service.ts` - Menu service logic

---

**Status:** 🔄 **Analysis Complete - Ready for Implementation**
