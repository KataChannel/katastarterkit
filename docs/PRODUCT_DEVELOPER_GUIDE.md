# 🥬 Product & Category System - Developer Guide

> Complete GraphQL API for managing vegetable products and categories with Vietnamese market support

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16-pink)](https://graphql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.14-green)](https://www.prisma.io/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](.)

---

## 📖 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [GraphQL Queries](#-graphql-queries)
- [GraphQL Mutations](#-graphql-mutations)
- [Filtering & Pagination](#-filtering--pagination)
- [Demo Data](#-demo-data)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Contributing](#-contributing)

---

## ✨ Features

### 🛍️ Product Management
- [x] Full CRUD operations
- [x] Multiple pricing (price, originalPrice, costPrice)
- [x] Inventory tracking (stock, minStock, maxStock)
- [x] Product variants (sizes, packages)
- [x] Image gallery support
- [x] Flexible JSON attributes
- [x] Vietnamese units (KG, G, BUNDLE, PIECE, BAG, BOX)
- [x] SEO optimization (meta tags)
- [x] Marketing flags (featured, best seller, on sale, new arrival)
- [x] Computed fields (discount %, profit margin)

### 📂 Category Management
- [x] Hierarchical structure (unlimited depth)
- [x] Parent-child relationships
- [x] Full CRUD operations
- [x] SEO optimization
- [x] Product count per category
- [x] Active/Featured flags
- [x] Circular reference prevention

### 🔍 Advanced Features
- [x] Powerful filtering system
- [x] Pagination support
- [x] Search functionality
- [x] JWT authentication
- [x] Input validation
- [x] Error handling
- [x] 25+ database indexes

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Docker (optional)

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd katacore

# 2. Install dependencies
cd backend
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Run migrations
npx prisma migrate dev

# 5. Seed demo data
npx tsx prisma/seeds/product-seed.ts

# 6. Start server
npm run dev
```

### Verify Installation

```bash
# Test API
node ../test-product-api.js

# Expected output:
# ✅ All queries executed successfully!
# ✅ Database seeded with products and categories
# ✅ GraphQL API working properly
```

---

## 📚 API Documentation

### Base URL
```
GraphQL Endpoint: http://localhost:3001/graphql
Playground: http://localhost:3001/graphql
```

### Authentication

All mutations require JWT token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🗄️ Database Schema

### Models

#### Category
```prisma
model Category {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  description     String?
  parentId        String?
  parent          Category? @relation("CategoryHierarchy", fields: [parentId])
  children        Category[] @relation("CategoryHierarchy")
  products        Product[]
  thumbnail       String?
  icon            String?
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  isActive        Boolean   @default(true)
  isFeatured      Boolean   @default(false)
  displayOrder    Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

#### Product
```prisma
model Product {
  id              String         @id @default(cuid())
  name            String
  slug            String         @unique
  description     String?
  shortDesc       String?
  price           Float
  originalPrice   Float?
  costPrice       Float?
  sku             String?        @unique
  barcode         String?        @unique
  stock           Int            @default(0)
  minStock        Int            @default(0)
  maxStock        Int?
  unit            ProductUnit    @default(KG)
  weight          Float?
  origin          String?
  status          ProductStatus  @default(ACTIVE)
  categoryId      String
  category        Category       @relation(fields: [categoryId])
  images          ProductImage[]
  variants        ProductVariant[]
  thumbnail       String?
  attributes      Json?
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  isFeatured      Boolean        @default(false)
  isNewArrival    Boolean        @default(false)
  isBestSeller    Boolean        @default(false)
  isOnSale        Boolean        @default(false)
  displayOrder    Int            @default(0)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}
```

### Enums

```typescript
enum ProductStatus {
  DRAFT
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
  DISCONTINUED
}

enum ProductUnit {
  KG      // Kilogram
  G       // Gram
  BUNDLE  // Bó (Vietnamese)
  PIECE   // Củ (Vietnamese)
  BAG     // Túi
  BOX     // Hộp
}
```

---

## 🔍 GraphQL Queries

### Get All Products

```graphql
query GetProducts {
  products(input: {
    page: 1
    limit: 20
    sortBy: "createdAt"
    sortOrder: desc
  }) {
    items {
      id
      name
      price
      unit
      stock
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

### Get Product by Slug

```graphql
query GetProduct {
  productBySlug(slug: "rau-muong") {
    id
    name
    description
    price
    originalPrice
    discountPercentage
    unit
    stock
    origin
    category {
      name
    }
    variants {
      name
      price
      stock
    }
    images {
      url
      isPrimary
    }
  }
}
```

### Get Category Tree

```graphql
query GetCategoryTree {
  categoryTree {
    id
    name
    slug
    productCount
    children {
      name
      productCount
      children {
        name
        productCount
      }
    }
  }
}
```

### Advanced Filtering

```graphql
query GetFilteredProducts {
  products(input: {
    page: 1
    limit: 20
    filters: {
      search: "rau"
      categoryId: "category-id"
      status: ACTIVE
      minPrice: 10000
      maxPrice: 50000
      isFeatured: true
      inStock: true
      origin: "Đà Lạt"
    }
    sortBy: "price"
    sortOrder: asc
  }) {
    items {
      name
      price
      stock
    }
    total
  }
}
```

---

## ✏️ GraphQL Mutations

### Create Product

```graphql
mutation CreateProduct {
  createProduct(input: {
    name: "Cà chua bi"
    slug: "ca-chua-bi"
    description: "Cà chua bi tươi ngon"
    price: 45000
    categoryId: "category-id"
    unit: KG
    stock: 100
    status: ACTIVE
    origin: "Đà Lạt"
    isFeatured: true
  }) {
    id
    name
    price
  }
}
```

### Update Product

```graphql
mutation UpdateProduct {
  updateProduct(input: {
    id: "product-id"
    price: 42000
    originalPrice: 45000
    isOnSale: true
  }) {
    id
    name
    price
    discountPercentage
  }
}
```

### Add Product Variant

```graphql
mutation AddVariant {
  addProductVariant(input: {
    productId: "product-id"
    name: "500g"
    sku: "SKU-500"
    price: 25000
    stock: 50
    attributes: {
      "weight": "500g"
    }
  }) {
    id
    variants {
      name
      price
    }
  }
}
```

### Create Category

```graphql
mutation CreateCategory {
  createCategory(input: {
    name: "Rau quả nhập khẩu"
    slug: "rau-qua-nhap-khau"
    description: "Rau quả organic nhập khẩu"
    isActive: true
    isFeatured: true
    displayOrder: 5
  }) {
    id
    name
    slug
  }
}
```

---

## 📄 Filtering & Pagination

### Product Filters

```typescript
{
  search?: string              // Search in name, description, SKU
  categoryId?: string          // Filter by category
  status?: ProductStatus       // DRAFT | ACTIVE | INACTIVE | etc.
  minPrice?: number           // Minimum price
  maxPrice?: number           // Maximum price
  isFeatured?: boolean        // Featured products only
  isNewArrival?: boolean      // New arrivals only
  isBestSeller?: boolean      // Best sellers only
  isOnSale?: boolean          // On sale products only
  inStock?: boolean           // In stock only
  origin?: string             // Filter by origin
  units?: ProductUnit[]       // Filter by units
}
```

### Pagination Options

```typescript
{
  page?: number               // Default: 1
  limit?: number              // Default: 20
  sortBy?: string             // Default: "createdAt"
  sortOrder?: "asc" | "desc"  // Default: "desc"
}
```

---

## 🎨 Demo Data

### Categories (4)

1. **Rau xanh** - Vegetables
   - Products: 4 (Rau muống, Cải xanh, Rau dền đỏ, Cải ngọt)
   
2. **Rau củ** - Root vegetables
   - Products: 4 (Cà rốt, Khoai tây, Củ cải trắng, Khoai lang tím)
   
3. **Rau gia vị** - Herbs & spices
   - Products: 4 (Hành lá, Ngò rí, Húng quế, Tía tô)
   
4. **Rau họ đậu** - Legumes
   - Products: 3 (Đậu cove, Đậu que, Đậu Hà Lan hạt)

### Featured Products

- **Rau muống** - 15,000đ/bó (Featured, Best Seller, On Sale)
- **Cải xanh** - 12,000đ/bó (Featured, On Sale)
- **Cà rốt Đà Lạt** - 25,000đ/kg (Featured, Best Seller, 3 variants)
- **Khoai tây** - 28,000đ/kg (Featured, Best Seller)
- **Đậu cove** - 35,000đ/kg (Featured, On Sale)

### Product Variants Example

**Cà rốt Đà Lạt** has 3 variants:
- 500g - 15,000đ
- 1kg - 25,000đ
- 2kg (Túi) - 45,000đ

---

## 🧪 Testing

### Automated Tests

```bash
# Run all tests
node test-product-api.js
```

Tests include:
- ✅ Get categories
- ✅ Get category tree
- ✅ Get products
- ✅ Get featured products
- ✅ Filter by price range
- ✅ Get product by slug
- ✅ Get product with variants

### Manual Testing

```bash
# Open GraphQL Playground
open http://localhost:3001/graphql

# Copy queries from
cat PRODUCT_TEST_QUERIES.graphql
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│          GraphQL API Layer                  │
│  ┌─────────────┐      ┌─────────────┐      │
│  │  Resolvers  │ ───→ │   Services  │      │
│  └─────────────┘      └─────────────┘      │
└─────────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│         Business Logic Layer                │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │ ProductService   │  │ CategoryService │ │
│  │ - CRUD ops       │  │ - Hierarchy     │ │
│  │ - Validation     │  │ - Validation    │ │
│  │ - Stock mgmt     │  │ - Circular ref  │ │
│  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│           Data Access Layer                 │
│            Prisma ORM                       │
└─────────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│            PostgreSQL Database              │
│  Categories | Products | Images | Variants  │
└─────────────────────────────────────────────┘
```

### File Structure

```
backend/
├── src/
│   ├── graphql/
│   │   ├── types/          # GraphQL type definitions
│   │   ├── inputs/         # Input DTOs
│   │   ├── resolvers/      # Query & mutation resolvers
│   │   └── modules/        # NestJS modules
│   ├── services/           # Business logic
│   └── prisma/            # Prisma client
└── prisma/
    ├── schema.prisma       # Database schema
    ├── migrations/         # Database migrations
    └── seeds/             # Demo data seeds
```

---

## 📖 Documentation Files

- **Full Documentation**: `docs/PRODUCT_SYSTEM_COMPLETE.md`
- **Quick Start**: `docs/PRODUCT_QUICK_START.md`
- **Implementation Summary**: `PRODUCT_IMPLEMENTATION_SUMMARY.md`
- **Demo Script**: `DEMO_SCRIPT.md`
- **Test Queries**: `PRODUCT_TEST_QUERIES.graphql`
- **This File**: `docs/PRODUCT_DEVELOPER_GUIDE.md`

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Build: `npm run build`
5. Submit PR

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration
- Add JSDoc comments for complex logic
- Write tests for new features

---

## 📊 Performance

### Database Optimization
- 25+ indexes on frequently queried fields
- Efficient Prisma queries with selective loading
- Pagination to prevent large data loads

### Computed Fields
- `discountPercentage`: Calculated on-demand
- `profitMargin`: Calculated on-demand
- `productCount`: Aggregated per category

---

## 🔒 Security

### Authentication
- JWT required for all mutations
- Public read access for queries

### Validation
- Unique slug enforcement
- Stock validation (no negative values)
- Category existence checks
- Circular reference prevention

### Protection
- SQL injection prevention (Prisma ORM)
- Input sanitization
- GraphQL depth limiting

---

## 🐛 Troubleshooting

### Common Issues

**Server won't start**
```bash
# Check database connection
npx prisma db push

# Regenerate Prisma Client
npx prisma generate
```

**No products showing**
```bash
# Re-seed database
npx tsx prisma/seeds/product-seed.ts
```

**GraphQL schema errors**
```bash
# Rebuild
npm run build

# Check schema
cat src/schema.gql
```

---

## 📞 Support

- **Documentation**: See `docs/` folder
- **Issues**: Create GitHub issue
- **Email**: [Your email]

---

## 📄 License

[Your License]

---

## ✅ Status

- **Version**: 1.0.0
- **Status**: ✅ Production Ready
- **Last Updated**: 09/10/2025
- **Migration**: `20251009144737_add_product_category_system`

---

**Built with ❤️ for Vietnamese market**

🥬 Happy Coding! 🥕
