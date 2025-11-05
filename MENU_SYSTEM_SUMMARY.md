# Hệ Thống Quản Lý Menu Động - Tổng Hợp

## ⚠️ BUG FIX (2024-11-05)

### Vấn Đề Đã Được Khắc Phục:
1. **File menu.queries.ts bị lỗi**: Component code (DynamicMenuLinkSelector) đã bị nhầm lẫn gộp vào file GraphQL queries
2. **Missing DynamicMenuLinkSelector component**: Component không tồn tại dù được import
3. **Edit page có mutation thừa**: Trang edit vẫn import CREATE_MENU_ADMIN không cần thiết

### Giải Pháp:
✅ Tách riêng GraphQL queries ra file `/frontend/src/graphql/menu.queries.ts`  
✅ Tạo component riêng `/frontend/src/components/menu/DynamicMenuLinkSelector.tsx`  
✅ Loại bỏ CREATE_MENU_ADMIN khỏi trang edit  
✅ Fix biến `creating` và `isEdit` không cần thiết trong edit page  

---

## 1. Tổng Quan

Đã tạo hệ thống quản lý menu động với khả năng liên kết đến sản phẩm, bài viết, và pages với điều kiện tùy chỉnh.

## 2. Thay Đổi Database (Prisma Schema)

### Enum Mới
```prisma
enum MenuLinkType {
  URL             // URL tùy chỉnh
  PRODUCT_LIST    // Danh sách sản phẩm có điều kiện
  PRODUCT_DETAIL  // Chi tiết 1 sản phẩm
  BLOG_LIST       // Danh sách bài viết có điều kiện
  BLOG_DETAIL     // Chi tiết 1 bài viết
  PAGE            // Trang từ Page Builder
  CATEGORY        // Danh mục sản phẩm
  BLOG_CATEGORY   // Danh mục bài viết
}
```

### Fields Mới trong Menu Model
- `linkType`: Loại liên kết động
- `productId`: ID sản phẩm (cho PRODUCT_DETAIL)
- `blogPostId`: ID bài viết (cho BLOG_DETAIL)
- `pageId`: ID page (cho PAGE)
- `categoryId`: ID danh mục sản phẩm
- `blogCategoryId`: ID danh mục bài viết
- `queryConditions`: JSON chứa điều kiện lọc (sort, limit, featured, onSale,...)

## 3. Backend Files Đã Tạo

### GraphQL Types
**File:** `backend/src/graphql/types/menu.type.ts`
- MenuType ObjectType với đầy đủ fields
- Enums: MenuTypeEnum, MenuTargetEnum, MenuLinkTypeEnum
- Field `finalUrl` tự động tính toán dựa trên linkType

### GraphQL Inputs
**File:** `backend/src/graphql/inputs/menu.input.ts`
- CreateMenuInput: Tạo menu mới
- UpdateMenuInput: Cập nhật menu
- Hỗ trợ tất cả các field bao gồm dynamic linking

### Service
**File:** `backend/src/services/menu.service.ts`

**Chức Năng:**
- `getMenus(type)`: Lấy danh sách menu theo type, trả về dạng tree
- `getMenuById(id)`: Lấy menu theo ID
- `getMenuBySlug(slug)`: Lấy menu theo slug
- `createMenu(input)`: Tạo menu mới (auto calculate level, path)
- `updateMenu(id, input)`: Cập nhật menu
- `deleteMenu(id)`: Xóa menu (kiểm tra protected)
- `reorderMenus(items)`: Sắp xếp lại thứ tự menu

**Helper Methods:**
- `buildMenuTree()`: Xây dựng cấu trúc tree từ flat list
- `addFinalUrl()`: Tính toán URL cuối cùng dựa trên linkType

**URL Mapping:**
- PRODUCT_LIST → `/san-pham?sort=...&limit=...`
- PRODUCT_DETAIL → `/san-pham/{productId}`
- BLOG_LIST → `/bai-viet?sort=...&limit=...`
- BLOG_DETAIL → `/bai-viet/{blogPostId}`
- CATEGORY → `/danh-muc/{categoryId}`
- BLOG_CATEGORY → `/bai-viet/danh-muc/{blogCategoryId}`
- PAGE → `/page/{pageId}`

### Resolver
**File:** `backend/src/graphql/resolvers/menu.resolver.ts`
- Queries: menus, menu, menuBySlug
- Mutations: createMenu, updateMenu, deleteMenu, reorderMenus
- Auth Guard: Sử dụng JwtAuthGuard cho mutations

## 4. Frontend Files Đã Tạo

### GraphQL Queries
**File:** `frontend/src/graphql/menu.queries.ts` (đã cập nhật)

**Queries Mới:**
- GET_MENU_BY_ID_ADMIN: Load menu để edit
- GET_PRODUCTS_FOR_MENU: Lấy danh sách sản phẩm để chọn
- GET_BLOGS_FOR_MENU: Lấy danh sách bài viết để chọn
- GET_CATEGORIES: Lấy danh mục sản phẩm
- GET_BLOG_CATEGORIES: Lấy danh mục bài viết
- GET_MENUS_TREE: Lấy cấu trúc menu để chọn parent

**Mutations:**
- CREATE_MENU_ADMIN: Tạo menu
- UPDATE_MENU_ADMIN: Cập nhật menu
- DELETE_MENU_ADMIN: Xóa menu

### Component: Dynamic Menu Link Selector
**File:** `frontend/src/components/menu/DynamicMenuLinkSelector.tsx`

**Chức Năng:**
Render form phù hợp dựa trên linkType đã chọn:

1. **PRODUCT_LIST**: Form điều kiện
   - Sắp xếp: Mới nhất, Bán chạy, Xem nhiều, Giá tăng/giảm
   - Giới hạn: Số lượng sản phẩm
   - Checkbox: Chỉ sản phẩm nổi bật
   - Checkbox: Chỉ sản phẩm giảm giá

2. **PRODUCT_DETAIL**: Select sản phẩm
   - Search box với icon
   - Select dropdown với danh sách sản phẩm

3. **BLOG_LIST**: Form điều kiện
   - Sắp xếp: Mới nhất, Cũ nhất, Xem nhiều, Nổi bật
   - Giới hạn: Số lượng bài viết
   - Checkbox: Chỉ bài viết nổi bật

4. **BLOG_DETAIL**: Select bài viết
   - Search box
   - Select dropdown với danh sách bài viết

5. **CATEGORY**: Select danh mục sản phẩm
6. **BLOG_CATEGORY**: Select danh mục bài viết
7. **PAGE**: Input Page ID/Slug

### Pages Admin

**File:** `frontend/src/app/admin/menu/create/page.tsx`
**File:** `frontend/src/app/admin/menu/[id]/edit/page.tsx`

**Tính Năng:**
✅ Form đầy đủ với validation
✅ Auto-generate slug từ tiêu đề (hỗ trợ tiếng Việt)
✅ Select menu cha (hierarchical)
✅ Dynamic link selector dựa trên linkType
✅ Icon picker (Lucide icons)
✅ Badge configuration
✅ CSS class custom
✅ Active/Visible toggles
✅ Mobile First + Responsive layout
✅ Vietnamese UI
✅ Loading states + Error handling
✅ Toast notifications

**Form Sections:**
1. **Thông Tin Cơ Bản**: Title, Slug, Description, Type, Parent, Order
2. **Cấu Hình Liên Kết**: Link Type selector + Dynamic form
3. **Hiển Thị**: Icon, Image, Badge, CSS Class
4. **Cài Đặt**: Active, Visible toggles

## 5. Ví Dụ Sử Dụng

### Tạo Menu "Sản Phẩm Bán Chạy"
```typescript
{
  title: "Sản Phẩm Bán Chạy",
  slug: "san-pham-ban-chay",
  type: "HEADER",
  linkType: "PRODUCT_LIST",
  queryConditions: {
    sort: "bestseller",
    limit: 20,
    featured: true
  }
}
// → URL: /san-pham?sort=bestseller&limit=20&featured=true
```

### Tạo Menu Link Đến Bài Viết
```typescript
{
  title: "Hướng Dẫn Mua Hàng",
  slug: "huong-dan-mua-hang",
  type: "FOOTER",
  linkType: "BLOG_DETAIL",
  blogPostId: "uuid-123-456"
}
// → URL: /bai-viet/uuid-123-456
```

### Tạo Menu Danh Mục
```typescript
{
  title: "Rau Sạch",
  slug: "rau-sach",
  type: "HEADER",
  linkType: "CATEGORY",
  categoryId: "cat-uuid-789"
}
// → URL: /danh-muc/cat-uuid-789
```

## 6. Tuân Thủ rulepromt.txt

✅ **Code Like Senior**: Clean architecture, service layer, proper validation
✅ **Dynamic GraphQL**: Tất cả queries/mutations đều dynamic, không hardcode
✅ **ShadCN UI**: Card, Input, Select, Switch, Button, Label, Textarea
✅ **Mobile First + Responsive**: Grid responsive, flex-col sm:flex-row
✅ **Vietnamese UI**: Tất cả labels, placeholders, messages tiếng Việt
✅ **PWA Ready**: Client-side routing, optimistic UI updates

## 7. Next Steps (Tùy Chọn)

1. Tạo trang danh sách menu `/admin/menu`
2. Implement drag & drop reorder menus
3. Tích hợp menu vào header/footer components
4. Preview menu trước khi publish
5. Import/Export menu configuration
6. Menu permissions dựa trên user roles

## 8. Database Migration

Schema đã được push thành công:
```bash
npx prisma db push
✓ Database in sync
✓ Generated Prisma Client
```

Các field mới đã được thêm vào bảng `menus`:
- linkType (enum)
- productId, blogPostId, pageId
- categoryId, blogCategoryId
- queryConditions (jsonb)
