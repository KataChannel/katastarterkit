# 🎬 Demo Script - Product & Category System

## 🎯 Objective
Demonstrate the complete Product & Category GraphQL API with real Vietnamese vegetable products.

---

## 📋 Prerequisites

```bash
# 1. Ensure database is running
docker ps | grep postgres

# 2. Navigate to backend
cd backend

# 3. Apply migrations (if needed)
npx prisma migrate dev

# 4. Seed demo data
npx tsx prisma/seeds/product-seed.ts

# 5. Start server
npm run dev
```

**Server URL:** `http://localhost:3001`
**GraphQL Playground:** `http://localhost:3001/graphql`

---

## 🎭 Demo Flow

### Part 1: Category Management (5 minutes)

#### 1.1 Get All Categories

```graphql
query GetCategories {
  categories(input: {
    page: 1
    limit: 10
    sortBy: "displayOrder"
    sortOrder: asc
  }) {
    items {
      id
      name
      slug
      description
      productCount
      isFeatured
    }
    total
  }
}
```

**Expected Result:**
- 4 categories: Rau xanh, Rau củ, Rau gia vị, Rau họ đậu
- Each with productCount
- Sorted by displayOrder

#### 1.2 Get Category Tree

```graphql
query GetCategoryTree {
  categoryTree {
    id
    name
    slug
    productCount
    isFeatured
    children {
      name
      productCount
    }
  }
}
```

**Show:** Hierarchical structure ready for subcategories

#### 1.3 Get Single Category

```graphql
query GetCategoryBySlug {
  categoryBySlug(slug: "rau-xanh") {
    id
    name
    description
    productCount
    metaTitle
    metaDescription
  }
}
```

**Highlight:** SEO fields, product count

---

### Part 2: Product Browsing (10 minutes)

#### 2.1 Get All Products

```graphql
query GetAllProducts {
  products(input: {
    page: 1
    limit: 10
    sortBy: "createdAt"
    sortOrder: desc
  }) {
    items {
      id
      name
      slug
      price
      unit
      stock
      origin
      category {
        name
      }
    }
    total
    page
    totalPages
    hasMore
  }
}
```

**Show:**
- 15 products loaded
- Vietnamese units (KG, BUNDLE)
- Origins (Đà Lạt, Lâm Đồng)
- Pagination info

#### 2.2 Get Featured Products

```graphql
query GetFeaturedProducts {
  products(input: {
    filters: {
      isFeatured: true
    }
  }) {
    items {
      name
      price
      unit
      isFeatured
      isBestSeller
      category {
        name
      }
    }
    total
  }
}
```

**Expected:** Rau muống, Cải xanh, Cà rốt, Khoai tây, Đậu cove

#### 2.3 Filter by Price Range

```graphql
query GetProductsByPriceRange {
  products(input: {
    filters: {
      minPrice: 10000
      maxPrice: 20000
      inStock: true
    }
  }) {
    items {
      name
      price
      unit
      stock
    }
    total
  }
}
```

**Show:** Only products between 10k-20k VND

#### 2.4 Get Products by Category

```graphql
query GetProductsByCategory($categoryId: ID!) {
  productsByCategory(categoryId: $categoryId, input: {
    page: 1
    limit: 20
  }) {
    items {
      name
      price
      unit
      origin
    }
    total
  }
}
```

**Variables:** Use Rau xanh category ID
**Show:** Only products in Rau xanh category

---

### Part 3: Product Details (8 minutes)

#### 3.1 Get Product with Discount

```graphql
query GetProductWithDiscount {
  productBySlug(slug: "rau-muong") {
    id
    name
    description
    price
    originalPrice
    unit
    stock
    origin
    discountPercentage
    isFeatured
    isBestSeller
    isOnSale
    category {
      name
    }
    images {
      url
      isPrimary
      alt
    }
  }
}
```

**Highlight:**
- Computed field: `discountPercentage` = 16.67%
- Original price: 18,000đ → Sale price: 15,000đ
- Featured & Best Seller flags
- Image support

#### 3.2 Get Product with Variants

```graphql
query GetProductWithVariants {
  productBySlug(slug: "ca-rot-da-lat") {
    name
    description
    price
    originalPrice
    unit
    discountPercentage
    profitMargin
    variants {
      id
      name
      sku
      price
      stock
      attributes
      isActive
      order
    }
  }
}
```

**Show:**
- Base product: 25,000đ/kg
- Variants:
  - 500g = 15,000đ
  - 1kg = 25,000đ
  - 2kg (Túi) = 45,000đ
- Different pricing per variant
- Stock tracking per variant

#### 3.3 Get Product Attributes

```graphql
query GetProductAttributes {
  productBySlug(slug: "rau-muong") {
    name
    price
    origin
    attributes
    metaTitle
    metaKeywords
  }
}
```

**Show:** Flexible JSON attributes:
```json
{
  "organic": true,
  "pesticide_free": true,
  "freshness": "Hái trong ngày"
}
```

---

### Part 4: Advanced Filtering (7 minutes)

#### 4.1 Search Products

```graphql
query SearchProducts {
  products(input: {
    filters: {
      search: "đậu"
    }
  }) {
    items {
      name
      price
      category {
        name
      }
    }
    total
  }
}
```

**Expected:** Đậu cove, Đậu que, Đậu Hà Lan hạt

#### 4.2 Get Best Sellers

```graphql
query GetBestSellers {
  products(input: {
    filters: {
      isBestSeller: true
    }
  }) {
    items {
      name
      price
      unit
      category {
        name
      }
    }
  }
}
```

**Expected:** Rau muống, Cải xanh, Khoai tây, Hành lá, Ngò rí

#### 4.3 Get New Arrivals

```graphql
query GetNewArrivals {
  products(input: {
    filters: {
      isNewArrival: true
    }
    sortBy: "createdAt"
    sortOrder: desc
  }) {
    items {
      name
      price
      isNewArrival
    }
  }
}
```

**Expected:** Cải ngọt, Khoai lang tím, Đậu Hà Lan hạt

#### 4.4 Get Products on Sale

```graphql
query GetOnSaleProducts {
  products(input: {
    filters: {
      isOnSale: true
    }
  }) {
    items {
      name
      price
      originalPrice
      discountPercentage
    }
  }
}
```

**Show:** Products with originalPrice > price

---

### Part 5: Mutations - Create & Update (10 minutes)

⚠️ **Important:** Mutations require JWT authentication!

**Setup Authentication:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

#### 5.1 Create New Category

```graphql
mutation CreateCategory {
  createCategory(input: {
    name: "Rau quả nhập khẩu"
    slug: "rau-qua-nhap-khau"
    description: "Rau quả organic nhập khẩu từ Úc, Nhật"
    isActive: true
    isFeatured: false
    displayOrder: 5
  }) {
    id
    name
    slug
  }
}
```

**Show:** New category created

#### 5.2 Create New Product

```graphql
mutation CreateProduct {
  createProduct(input: {
    name: "Cà chua bi"
    slug: "ca-chua-bi"
    description: "Cà chua bi tươi ngon, ngọt mát"
    shortDesc: "Cà chua bi ngọt"
    price: 45000
    sku: "CTB-001"
    stock: 80
    minStock: 10
    unit: KG
    origin: "Đà Lạt"
    status: ACTIVE
    categoryId: "CATEGORY_ID_FROM_STEP_5.1"
    isFeatured: true
    isNewArrival: true
  }) {
    id
    name
    slug
    price
    category {
      name
    }
  }
}
```

**Show:** New product created and linked to category

#### 5.3 Update Product

```graphql
mutation UpdateProduct {
  updateProduct(input: {
    id: "PRODUCT_ID_FROM_STEP_5.2"
    price: 42000
    originalPrice: 45000
    isOnSale: true
  }) {
    id
    name
    price
    originalPrice
    discountPercentage
    isOnSale
  }
}
```

**Show:** Price updated, discount calculated automatically

#### 5.4 Add Product Variant

```graphql
mutation AddProductVariant {
  addProductVariant(input: {
    productId: "PRODUCT_ID_FROM_STEP_5.2"
    name: "500g"
    sku: "CTB-001-500"
    price: 25000
    stock: 50
    attributes: {
      "weight": "500g"
    }
    isActive: true
    order: 1
  }) {
    id
    variants {
      name
      price
      stock
    }
  }
}
```

**Show:** Variant added to product

#### 5.5 Update Stock

```graphql
mutation UpdateStock {
  updateProductStock(
    id: "PRODUCT_ID"
    quantity: -10
  ) {
    id
    name
    stock
  }
}
```

**Show:** Stock reduced by 10 (simulating a sale)

---

### Part 6: Error Handling (5 minutes)

#### 6.1 Duplicate Slug

```graphql
mutation CreateDuplicateProduct {
  createProduct(input: {
    name: "Test Product"
    slug: "rau-muong"  # Existing slug
    price: 10000
    categoryId: "VALID_ID"
    unit: KG
  }) {
    id
  }
}
```

**Expected Error:** "Product with slug rau-muong already exists"

#### 6.2 Invalid Category

```graphql
mutation CreateProductInvalidCategory {
  createProduct(input: {
    name: "Test Product"
    slug: "test-product"
    price: 10000
    categoryId: "invalid-id"
    unit: KG
  }) {
    id
  }
}
```

**Expected Error:** "Category with ID invalid-id not found"

#### 6.3 Negative Stock

```graphql
mutation InvalidStock {
  updateProductStock(
    id: "PRODUCT_ID"
    quantity: -1000  # More than available stock
  ) {
    id
  }
}
```

**Expected Error:** "Insufficient stock"

---

### Part 7: Automated Test Script (3 minutes)

```bash
# Run automated tests
node test-product-api.js
```

**Show:**
- ✅ Test 1: Get Categories
- ✅ Test 2: Get Category Tree
- ✅ Test 3: Get Products
- ✅ Test 4: Get Featured Products
- ✅ Test 5: Get Products by Price Range
- ✅ Test 6: Get Product by Slug
- ✅ Test 7: Get Product with Variants

**Expected Output:**
```
✅ All queries executed successfully!
✅ Database seeded with products and categories
✅ GraphQL API working properly
✅ Filters, pagination, and relationships working
```

---

## 🎯 Key Points to Highlight

### 1. Vietnamese Market Focus
- ✅ Units: Bó, Củ, Kg (not just kg)
- ✅ Origins: Đà Lạt, Lâm Đồng
- ✅ Local names: Rau muống, Ngò rí, Tía tô

### 2. E-commerce Features
- ✅ Multiple pricing (regular, sale, cost)
- ✅ Inventory management
- ✅ Product variants
- ✅ Marketing flags

### 3. Developer Experience
- ✅ Type-safe GraphQL API
- ✅ Comprehensive filtering
- ✅ Pagination support
- ✅ Error handling

### 4. Performance
- ✅ 25+ database indexes
- ✅ Efficient queries
- ✅ Computed fields

### 5. Production Ready
- ✅ Zero errors
- ✅ Full authentication
- ✅ Input validation
- ✅ Comprehensive docs

---

## 📊 Demo Statistics to Mention

- **4 Categories** (hierarchical structure)
- **15 Products** (real Vietnamese vegetables)
- **3 Product Variants** (Cà rốt sizes)
- **8 Queries** (full CRUD + search)
- **10 Mutations** (create, update, delete)
- **25+ Indexes** (performance optimized)
- **0 Errors** (production ready)

---

## 🎬 Closing

### Summary
"We've successfully implemented a complete Product & Category management system with:
- Full GraphQL API with 8 queries and 10 mutations
- Vietnamese market support (units, origins, local names)
- E-commerce features (variants, pricing, inventory)
- Advanced filtering and pagination
- 15 demo products across 4 categories
- Zero errors, production-ready code"

### Next Steps
"The backend is complete. Next phase:
- Frontend components (ProductCard, CategoryTree)
- Admin pages for management
- Shopping cart integration
- Customer-facing shop pages"

---

**Demo Duration:** ~45 minutes
**Difficulty:** Intermediate
**Prerequisites:** Basic GraphQL knowledge
**Repository:** [Your repo URL]
**Documentation:** `docs/PRODUCT_SYSTEM_COMPLETE.md`
