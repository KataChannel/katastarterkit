# Dynamic Product Detail Page - Hướng dẫn sử dụng

## Tổng quan

Đã tạo thành công trang "Sản Phẩm Chi Tiết" sử dụng Dynamic Page Template. Trang này tự động hiển thị thông tin sản phẩm dựa trên slug trong URL.

## Cấu trúc đã tạo

### 1. GraphQL Queries (`frontend/src/graphql/queries/products.ts`)
- `GET_PRODUCTS` - Lấy danh sách sản phẩm (có phân trang)
- `GET_PRODUCT_BY_SLUG` - Lấy chi tiết sản phẩm theo slug
- `GET_PRODUCT_BY_ID` - Lấy chi tiết sản phẩm theo ID

### 2. Dynamic Route (`frontend/src/app/(website)/san-pham/[slug]/page.tsx`)
Route handler tự động cho mọi trang sản phẩm:
- URL pattern: `/san-pham/[slug]`
- Ví dụ: `/san-pham/rau-muong`, `/san-pham/rau-cai-huu-co`

### 3. Scripts
- `scripts/test-products.js` - Kiểm tra sản phẩm có trong database
- `scripts/create-product-detail-page.js` - Tạo dynamic page template (optional)

## Cách sử dụng

### Truy cập trang sản phẩm

Hiện tại có 2 sản phẩm trong database:

1. **Rau muống**
   - URL: http://localhost:12000/san-pham/rau-muong
   - Giá: 15,000 đ
   - Tồn kho: 100

2. **Rau cải hữu cơ**
   - URL: http://localhost:12000/san-pham/rau-cai-huu-co
   - Giá: 12,000 đ
   - Tồn kho: 80

### Test trang sản phẩm

```bash
# Kiểm tra sản phẩm trong database
node scripts/test-products.js

# Test GraphQL query trực tiếp
curl -s http://localhost:12001/graphql -H "Content-Type: application/json" -d '{"query":"query { productBySlug(slug: \"rau-muong\") { id name slug price stock } }"}' | python3 -m json.tool

# Test trang web (browser)
open http://localhost:12000/san-pham/rau-muong
```

## Tính năng của trang sản phẩm

### Hiển thị thông tin
- ✅ Tên sản phẩm
- ✅ Breadcrumb navigation
- ✅ Hình ảnh sản phẩm (primary image + gallery)
- ✅ Giá hiện tại
- ✅ Giá gốc (nếu có giảm giá)
- ✅ Phần trăm giảm giá
- ✅ Mô tả ngắn
- ✅ Trạng thái tồn kho
- ✅ Thông tin sản phẩm (SKU, đơn vị, danh mục)
- ✅ Tags
- ✅ Mô tả chi tiết (HTML)
- ✅ Các phiên bản sản phẩm (variants)

### Tương tác
- ✅ Nút "Thêm vào giỏ hàng" (disabled khi hết hàng)
- ✅ Nút "Mua ngay"
- ✅ Thumbnail gallery (click để xem ảnh lớn)

### SEO
- ✅ Dynamic title
- ✅ Meta description
- ✅ Meta keywords
- ✅ Structured breadcrumb

## Cấu trúc dữ liệu sản phẩm

```graphql
type Product {
  id: ID!
  name: String!
  slug: String!
  description: String
  shortDesc: String
  price: Float!
  originalPrice: Float
  sku: String
  stock: Int!
  unit: String!
  status: String!
  images: [ProductImage]
  category: Category
  tags: [Tag]
  variants: [ProductVariant]
  seoTitle: String
  seoDescription: String
  seoKeywords: [String]
}
```

## Responsive Design

Trang sản phẩm được thiết kế responsive:
- **Desktop**: Grid 2 cột (hình ảnh bên trái, thông tin bên phải)
- **Mobile**: Stack dọc (hình ảnh trên, thông tin dưới)

## Tùy chỉnh

### Thay đổi layout
File: `frontend/src/app/(website)/san-pham/[slug]/page.tsx`

### Thêm tính năng
1. **Related Products** - Sản phẩm liên quan
2. **Reviews** - Đánh giá sản phẩm
3. **Quantity Selector** - Chọn số lượng
4. **Add to Cart API** - Kết nối với giỏ hàng thật

### Styling
- Sử dụng Tailwind CSS classes
- Màu chính: Red (#e74c3c) cho giá, Green (#27ae60) cho nút CTA
- Typography: Responsive font sizes

## Troubleshooting

### Lỗi "Product not found"
- Kiểm tra slug có đúng không
- Chạy `node scripts/test-products.js` để xem danh sách sản phẩm

### Lỗi GraphQL
- Kiểm tra backend đang chạy: `curl http://localhost:12001/graphql`
- Xem logs backend

### Ảnh không hiển thị
- Kiểm tra cấu hình `images.remotePatterns` trong `next.config.js`
- Verify URL ảnh trong database

## Next Steps

1. ✅ Tạo trang danh sách sản phẩm `/san-pham`
2. ✅ Thêm giỏ hàng functionality
3. ✅ Tạo trang thanh toán
4. ✅ Thêm product search
5. ✅ Thêm product filters (theo danh mục, giá, etc.)

## API Endpoints

### Frontend (Next.js)
- Product Detail: `http://localhost:12000/san-pham/[slug]`
- Homepage: `http://localhost:12000`

### Backend (GraphQL)
- GraphQL Playground: `http://localhost:12001/graphql`
- REST API: `http://localhost:12001/api`

## Environment Variables

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql
NEXT_PUBLIC_APP_URL=http://localhost:12000
```

## Dependencies

### Frontend
- `@apollo/client` - GraphQL client
- `next` v16.0.0 - Framework
- `react` v19.1.1 - UI library
- `graphql` - GraphQL

### Backend
- `@nestjs/graphql` - GraphQL server
- `@nestjs/apollo` - Apollo integration
- `prisma` - Database ORM

## Database Schema

Sản phẩm được lưu trong bảng `Product` với các quan hệ:
- `Product` -> `Category` (many-to-one)
- `Product` -> `Tag` (many-to-many)
- `Product` -> `ProductImage` (one-to-many)
- `Product` -> `ProductVariant` (one-to-many)

## Testing

```bash
# Test query products
curl -s http://localhost:12001/graphql -H "Content-Type: application/json" \
  -d '{"query":"query { products(input: { page: 1, limit: 10 }) { items { id name slug price } } }"}' \
  | python3 -m json.tool

# Test query product by slug
curl -s http://localhost:12001/graphql -H "Content-Type: application/json" \
  -d '{"query":"query { productBySlug(slug: \"rau-muong\") { id name price description } }"}' \
  | python3 -m json.tool
```

## License

MIT
