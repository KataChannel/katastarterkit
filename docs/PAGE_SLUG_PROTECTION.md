# Page Slug Protection - Bảo vệ Slug trong Page Builder

## Tổng quan

Hệ thống đã được nâng cấp để bảo vệ các slug quan trọng, tránh xung đột giữa Page Builder và Static Routes.

## Danh sách Reserved Slugs

Các slug sau đây **KHÔNG** được phép tạo trong Page Builder:

### Routes chính
- `bai-viet` - Trang danh sách bài viết
- `san-pham` - Trang danh sách sản phẩm
- `gio-hang` - Giỏ hàng
- `thanh-toan` - Thanh toán
- `tai-khoan` - Tài khoản người dùng

### Authentication
- `dang-nhap` - Đăng nhập
- `dang-ky` - Đăng ký
- `quen-mat-khau` - Quên mật khẩu

### System Routes
- `admin` - Admin panel
- `api` - API endpoints
- `auth` - Authentication routes
- `graphql` - GraphQL endpoint

### Technical Routes
- `_next` - Next.js internal
- `static` - Static files
- `public` - Public files
- `images` - Images directory
- `assets` - Assets directory

## Cách hoạt động

### 1. Khi tạo Page mới

```graphql
mutation {
  createPage(input: {
    title: "Bài viết"
    slug: "bai-viet"  # ❌ Sẽ bị reject
    status: PUBLISHED
  }) {
    id
    slug
  }
}
```

**Response:**
```json
{
  "errors": [{
    "message": "Slug \"bai-viet\" đã được hệ thống sử dụng. Vui lòng chọn slug khác."
  }]
}
```

### 2. Khi update Page

```graphql
mutation {
  updatePage(
    id: "page-id"
    input: {
      slug: "san-pham"  # ❌ Sẽ bị reject
    }
  ) {
    id
    slug
  }
}
```

**Response:** Tương tự như trên.

### 3. Lấy danh sách Reserved Slugs

```graphql
query {
  getReservedSlugs
}
```

**Response:**
```json
{
  "data": {
    "getReservedSlugs": [
      "bai-viet",
      "san-pham",
      "gio-hang",
      "thanh-toan",
      "tai-khoan",
      "dang-nhap",
      "dang-ky",
      "quen-mat-khau",
      "admin",
      "api",
      "auth",
      "graphql",
      "_next",
      "static",
      "public",
      "images",
      "assets"
    ]
  }
}
```

## Frontend Integration

### Validate slug trước khi submit

```typescript
// Example: React component
import { useQuery } from '@apollo/client';

const GET_RESERVED_SLUGS = gql`
  query GetReservedSlugs {
    getReservedSlugs
  }
`;

function PageForm() {
  const { data } = useQuery(GET_RESERVED_SLUGS);
  const reservedSlugs = data?.getReservedSlugs || [];

  const handleSubmit = (values) => {
    if (reservedSlugs.includes(values.slug)) {
      // Show error
      setError('slug', {
        message: `Slug "${values.slug}" đã được hệ thống sử dụng.`
      });
      return;
    }
    
    // Proceed with submission
    createPage(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Real-time validation

```typescript
// Debounced slug validation
const validateSlug = async (slug: string) => {
  // Check reserved slugs
  if (reservedSlugs.includes(slug)) {
    return 'Slug này đã được hệ thống sử dụng';
  }
  
  // Check existing pages
  const exists = await checkSlugExists(slug);
  if (exists) {
    return 'Slug này đã tồn tại';
  }
  
  return undefined;
};
```

## Testing

### Test Case 1: Create page với reserved slug

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "mutation { createPage(input: { title: \"Test\", slug: \"bai-viet\", status: PUBLISHED }) { id slug } }"
  }'
```

**Expected:** Error message về reserved slug

### Test Case 2: Create page với slug hợp lệ

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "mutation { createPage(input: { title: \"About Us\", slug: \"gioi-thieu\", status: PUBLISHED }) { id slug } }"
  }'
```

**Expected:** Page được tạo thành công

### Test Case 3: Get reserved slugs

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getReservedSlugs }"
  }'
```

**Expected:** Array of reserved slugs

## Routing Priority

Khi user truy cập một URL:

1. **Static Routes** (highest priority)
   - `/bai-viet` → Trang danh sách bài viết (static)
   - `/san-pham` → Trang danh sách sản phẩm (static)

2. **Dynamic Routes từ Page Builder**
   - `/gioi-thieu` → Page từ Page Builder
   - `/chinh-sach` → Page từ Page Builder

3. **404 Page** (lowest priority)
   - Nếu không match cả static và dynamic routes

## Thêm Reserved Slug mới

Nếu cần thêm slug mới vào danh sách bảo vệ:

1. Mở file `/backend/src/services/page.service.ts`
2. Thêm slug vào array `RESERVED_SLUGS`
3. Restart server

```typescript
private readonly RESERVED_SLUGS = [
  'bai-viet',
  'san-pham',
  // ... existing slugs
  'slug-moi-cua-ban', // ← Thêm ở đây
];
```

## Benefits

✅ **Tránh xung đột routing** - Static routes luôn có priority cao nhất

✅ **UX tốt hơn** - User biết ngay slug không hợp lệ khi tạo page

✅ **Dễ maintain** - Centralized list of reserved slugs

✅ **Type-safe** - Validation ở cả backend và có thể sync sang frontend

## Notes

- Reserved slugs validation chỉ áp dụng cho **root-level slugs**
- Nested paths vẫn có thể sử dụng (ví dụ: `/blog/bai-viet` không bị block)
- Case-insensitive comparison (sẽ check lowercase)

---

**Updated:** 30/10/2025
**Author:** GitHub Copilot
