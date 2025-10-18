# 🎉 Page Builder E-commerce Demo Setup - Quick Guide

## ✅ Đã hoàn thành

### 1. Cài đặt Components
- ✅ ProductListBlock component
- ✅ ProductDetailBlock component  
- ✅ Format utilities (formatPrice, calculateDiscount)
- ✅ BlockType enum updated (PRODUCT_LIST, PRODUCT_DETAIL)
- ✅ Database migration completed
- ✅ Prisma client regenerated

### 2. Page đã tạo
Page "**products**" đã tồn tại với:
- Slug: `products`
- Title: "Sản Phẩm"
- 22 blocks (bao gồm 1 PRODUCT_LIST block ở order 0)

## 🚀 Cách sử dụng

### Test Product List Block

#### Option 1: Sử dụng page có sẵn
```bash
# Truy cập page products
http://localhost:3001/products
```

Page này đã có PRODUCT_LIST block với config:
- Title: "Sản phẩm nổi bật"
- Limit: 12 sản phẩm
- Filter: isFeatured = true
- Layout: Grid 3 cột
- Show: Price, Category, Add to Cart

#### Option 2: Tạo page mới với Page Builder
1. Login: http://localhost:3001/login
2. Vào Page Builder
3. Tạo page mới hoặc edit page "products"
4. Từ LeftPanel → Tab "Elements"
5. Chọn category "E-commerce"
6. Drag "Product List" block vào canvas
7. Configure trong RightPanel:
   - Title, subtitle
   - Limit số sản phẩm
   - Filters (featured, new, price range, category)
   - Layout (grid/list)
   - Columns (2, 3, 4)
   - Toggle options (price, category, description, add to cart)
8. Save page

### Test Product Detail Block

#### Step 1: Tạo Product Detail Page
```bash
# Via SQL (nếu chưa có)
docker exec -i katacore-postgres psql -U postgres -d katacore <<EOF
INSERT INTO "Page" (id, title, slug, description, status, "createdBy", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Chi tiết sản phẩm',
  'product-detail',
  'Product detail template',
  'PUBLISHED',
  '9ae9e59b-177c-41a8-b047-c197a343e8c3',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET "updatedAt" = NOW()
RETURNING id, slug;
EOF
```

#### Step 2: Thêm Product Detail Block
1. Edit page "product-detail" trong Page Builder
2. Add "Product Detail" block từ E-commerce category
3. Configure:
   - Leave `productSlug` empty (sẽ lấy từ URL)
   - Enable: Gallery, Description, Specs
   - Disable: Reviews, Related (chưa có data)
   - Layout: default
4. Save

#### Step 3: Test với product có sẵn
```bash
# Lấy danh sách products từ database
docker exec -i katacore-postgres psql -U postgres -d katacore -c \
"SELECT id, name, slug, price, stock FROM \"Product\" LIMIT 5;"

# Example outputs:
# rau-muong, ca-rot-da-lat, hanh-la, dua-leo-baby, ca-chua-bi

# Test URLs:
http://localhost:3001/products/rau-muong
http://localhost:3001/products/ca-rot-da-lat
http://localhost:3001/products/hanh-la
```

## 🎨 Configuration Options

### ProductListBlock Props

```typescript
{
  title: string;           // "Sản phẩm nổi bật"
  subtitle: string;        // "Khám phá sản phẩm chất lượng"
  limit: number;           // 12
  categoryId: string;      // Optional: filter by category
  filters: {
    isFeatured: boolean;   // true = only featured
    isNew: boolean;        // true = only new arrivals
    minPrice: number;      // Price range
    maxPrice: number;
    search: string;        // Search query
  },
  layout: 'grid' | 'list', // Display mode
  columns: 2 | 3 | 4,      // Grid columns
  showPrice: boolean,
  showCategory: boolean,
  showDescription: boolean,
  showAddToCart: boolean,
  cardVariant: 'default' | 'compact' | 'detailed'
}
```

### ProductDetailBlock Props

```typescript
{
  productSlug: string;     // Optional: if empty, use URL slug
  showGallery: boolean,    // Show image gallery
  showDescription: boolean, // Show description tab
  showSpecs: boolean,      // Show specifications tab
  showReviews: boolean,    // Show reviews (future)
  showRelated: boolean,    // Show related products (future)
  layout: 'default' | 'wide' | 'sidebar'
}
```

## 📊 GraphQL Queries Sử dụng

### ProductListBlock
```graphql
query GetProducts($input: GetProductsInput) {
  products(input: $input) {
    items {
      id
      name
      slug
      price
      originalPrice
      thumbnail
      stock
      category { name }
      isFeatured
      isNewArrival
      discountPercentage
    }
    total
    page
    totalPages
  }
}
```

### ProductDetailBlock
```graphql
query GetProductBySlug($slug: String!) {
  productBySlug(slug: $slug) {
    id
    name
    slug
    description
    shortDesc
    price
    originalPrice
    sku
    unit
    stock
    weight
    origin
    thumbnail
    category { name slug }
    images { url alt isPrimary }
    variants { 
      name 
      price 
      stock 
      isDefault 
    }
    isFeatured
    isNewArrival
    discountPercentage
  }
}
```

## 🧪 Testing Checklist

### Product List
- [ ] Page loads without errors
- [ ] Products display in grid
- [ ] Images load correctly
- [ ] Prices format correctly (VND)
- [ ] Badges show (New, Featured, Discount)
- [ ] Category names display
- [ ] Pagination works
- [ ] Empty state shows when no products
- [ ] Loading skeleton appears during fetch
- [ ] Click product → goes to detail page

### Product Detail
- [ ] Product loads by slug
- [ ] Image gallery displays
- [ ] All product info shows
- [ ] Price displays correctly
- [ ] Stock status shows
- [ ] Variants selector works (if has variants)
- [ ] Description tab works
- [ ] Specs tab shows correct data
- [ ] Add to cart button visible
- [ ] Breadcrumbs work
- [ ] 404 state for invalid slug

## 🐛 Troubleshooting

### Problem: Product List không hiển thị
**Solution**:
1. Check console for GraphQL errors
2. Verify products exist: `docker exec -i katacore-postgres psql -U postgres -d katacore -c "SELECT COUNT(*) FROM \"Product\";"`
3. Check filters - maybe no products match
4. Try removing filters (set to empty object)

### Problem: Product Detail 404
**Solution**:
1. Check product slug: `SELECT slug FROM \"Product\" WHERE id = 'your-id';`
2. Verify URL matches slug exactly
3. Check page slug is "product-detail" or create dynamic route
4. Ensure product status is ACTIVE

### Problem: Images không hiển thị
**Solution**:
1. Check thumbnail URL in database
2. Verify CORS settings
3. Check Next.js Image domains config
4. Use absolute URLs for images

### Problem: GraphQL query fails
**Solution**:
1. Check backend is running: http://localhost:3000/graphql
2. Test query in GraphQL Playground
3. Check network tab for errors
4. Verify Apollo Client is configured

## 📚 Tài liệu liên quan

- **Product API**: `/docs/99-PRODUCT_CATEGORY_README.md`
- **Page Builder**: `/docs/PAGEBUILDER_QUICK_REFERENCE.md`
- **E-commerce Integration**: `/PAGEBUILDER_ECOMMERCE_INTEGRATION_COMPLETE.md`
- **GraphQL Queries**: `/frontend/src/graphql/product.queries.ts`

## 🎯 Next Steps

### Immediate
1. Test existing "products" page
2. Create product-detail page
3. Add Product Detail block
4. Test with real product slugs

### Short-term
- Add product search
- Add filters UI (price range, categories)
- Add sort options
- Add view toggle (grid/list)

### Long-term
- Shopping cart block
- Checkout block  
- Order tracking
- Product reviews
- Wishlist
- Product comparison

## 💡 Tips

1. **Performance**: Use pagination for large product lists
2. **SEO**: Set proper seoTitle and seoDescription for product pages
3. **Images**: Optimize images (WebP, proper sizes)
4. **Caching**: Apollo Client caches queries automatically
5. **Error handling**: Always check loading and error states
6. **Mobile**: Test responsive design on mobile devices

## 🎉 Demo URLs

```bash
# Product List
http://localhost:3001/products

# Product Detail (examples)
http://localhost:3001/products/rau-muong
http://localhost:3001/products/ca-rot-da-lat
http://localhost:3001/products/hanh-la
http://localhost:3001/products/dua-leo-baby
http://localhost:3001/products/ca-chua-bi

# Page Builder
http://localhost:3001/admin/pages
```

---

**Status**: ✅ Ready to test!  
**Documentation**: Complete  
**Support**: Check troubleshooting section above
