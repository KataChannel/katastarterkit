# 🥬 Kata Product & Category System

> Hệ thống quản lý sản phẩm và danh mục hoàn chỉnh cho nền tảng thương mại điện tử rau củ quả Việt Nam

[![Backend](https://img.shields.io/badge/Backend-NestJS%2010-red?style=flat-square)](https://nestjs.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Latest-e10098?style=flat-square)](https://graphql.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)]()

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Tính Năng](#-tính-năng)
- [Tech Stack](#️-tech-stack)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Components](#-components)
- [Screenshots](#-screenshots)
- [Kiến Trúc](#-kiến-trúc)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Tổng Quan

Hệ thống quản lý sản phẩm và danh mục đầy đủ tính năng, được xây dựng đặc biệt cho thị trường Việt Nam với hỗ trợ:

- ✅ **Vietnamese Market**: Đơn vị tính Việt Nam (bó, củ, kg), xuất xứ (Đà Lạt, Lâm Đồng)
- ✅ **E-commerce Ready**: Giá cả, khuyến mãi, tồn kho, biến thể sản phẩm
- ✅ **Full-stack**: Backend GraphQL API + Frontend Admin UI
- ✅ **Production Ready**: Validation, error handling, testing, documentation

### Quick Stats

| Metric | Backend | Frontend | Total |
|--------|---------|----------|-------|
| **Files** | 20 files | 14 files | 34 files |
| **Code Lines** | ~3,800+ | ~3,500+ | ~7,300+ |
| **API Endpoints** | 18 (8Q + 10M) | - | 18 |
| **Components** | - | 9 | 9 |
| **Custom Hooks** | - | 20+ | 20+ |

---

## ✨ Tính Năng

### Backend (NestJS + GraphQL)

#### 📦 Products
- **CRUD Operations**: Create, Read, Update, Delete products
- **Advanced Filtering**: Search, price range, category, status, flags
- **Stock Management**: Track inventory, low stock alerts
- **Variants**: Multiple size/package options per product
- **Image Gallery**: Multiple product images with ordering
- **Vietnamese Units**: KG, G, BUNDLE (bó), PIECE (củ), BAG (túi), BOX (hộp)
- **Marketing Flags**: Featured, New, Bestseller, Organic
- **Price Management**: Regular price, compare price, cost price
- **Computed Fields**: Discount percentage, profit margin

#### 🗂️ Categories
- **Hierarchical Structure**: Unlimited nesting levels
- **CRUD Operations**: Create, Read, Update, Delete categories
- **Circular Reference Prevention**: Smart validation
- **Product Count**: Auto-calculated per category
- **SEO Ready**: Slugs, meta tags

#### 🔐 Security
- **JWT Authentication**: Secure mutations
- **Input Validation**: Type-safe with class-validator
- **Error Handling**: Meaningful error messages

### Frontend (Next.js 15 + React 19)

#### 🎨 Product Components
- **ProductCard**: 3 variants (default, compact, featured)
- **ProductList**: Flexible grid layouts (2-5 columns)
- **ProductDetail**: Full product page with gallery & variants
- **ProductForm**: 4-tab admin form with validation

#### 🗂️ Category Components
- **CategoryCard**: 3 variants for different use cases
- **CategoryTree**: Hierarchical tree view with expand/collapse
- **CategoryForm**: Create/edit with parent selector
- **CategoryBreadcrumb**: Navigation breadcrumbs

#### 📊 Admin Pages
- **Products Admin**: List, create, edit, delete with filters
- **Categories Admin**: Tree view with CRUD operations
- **Stats Dashboard**: Overview of products & categories
- **Responsive Design**: Works on all devices

#### 🛠️ Developer Features
- **TypeScript**: Full type safety
- **Custom Hooks**: Reusable GraphQL hooks
- **Form Validation**: Zod + react-hook-form
- **Toast Notifications**: User feedback
- **Loading States**: Skeletons & loaders

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL + Prisma ORM
- **Language**: TypeScript 5.9
- **Authentication**: JWT
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.9
- **GraphQL Client**: Apollo Client 3.11
- **UI Components**: shadcn/ui
- **Styling**: TailwindCSS v4
- **Forms**: react-hook-form + zod
- **Notifications**: react-hot-toast

### Database Schema
- **Models**: Category, Product, ProductImage, ProductVariant
- **Enums**: ProductStatus, ProductUnit
- **Indexes**: 25+ performance indexes
- **Relationships**: Category ↔ Product (1:N), Product ↔ Images/Variants (1:N)

---

## 🚀 Cài Đặt

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm hoặc yarn hoặc bun

### 1. Clone Repository

```bash
git clone <repository-url>
cd katacore
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev

# Seed demo data
npx tsx prisma/seeds/product-seed.ts

# Start backend
npm run dev
# Backend running at http://localhost:3001
# GraphQL Playground at http://localhost:3001/graphql
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start frontend
npm run dev
# Frontend running at http://localhost:13000
```

---

## 💻 Sử Dụng

### Access Admin Pages

```bash
# Products Management
http://localhost:13000/admin/products

# Create New Product
http://localhost:13000/admin/products/create

# Edit Product
http://localhost:13000/admin/products/{id}

# Categories Management
http://localhost:13000/admin/categories
```

### GraphQL Playground

```bash
http://localhost:3001/graphql
```

### Example Queries

#### Get All Products
```graphql
query {
  products {
    items {
      id
      name
      price
      stock
      category {
        name
      }
    }
    total
  }
}
```

#### Get Featured Products
```graphql
query {
  products(input: { filters: { isFeatured: true } }) {
    items {
      name
      price
      discountPercentage
      origin
    }
  }
}
```

#### Create Product (requires JWT)
```graphql
mutation {
  createProduct(input: {
    name: "Rau muống"
    categoryId: "category-id"
    price: 15000
    unit: BUNDLE
    stock: 100
    origin: "Đà Lạt"
    isOrganic: true
  }) {
    id
    name
  }
}
```

---

## 📚 API Documentation

### Queries (8)

| Query | Description | Auth |
|-------|-------------|------|
| `products` | List products with filters & pagination | ❌ |
| `product` | Get single product by ID | ❌ |
| `productBySlug` | Get product by slug | ❌ |
| `productsByCategory` | Filter products by category | ❌ |
| `categories` | List categories | ❌ |
| `categoryTree` | Get hierarchical category tree | ❌ |
| `category` | Get single category by ID | ❌ |
| `categoryBySlug` | Get category by slug | ❌ |

### Mutations (13)

| Mutation | Description | Auth |
|----------|-------------|------|
| `createProduct` | Create new product | ✅ |
| `updateProduct` | Update product | ✅ |
| `deleteProduct` | Delete product | ✅ |
| `updateProductStock` | Update stock quantity | ✅ |
| `addProductImage` | Add product image | ✅ |
| `deleteProductImage` | Delete product image | ✅ |
| `addProductVariant` | Add product variant | ✅ |
| `updateProductVariant` | Update variant | ✅ |
| `deleteProductVariant` | Delete variant | ✅ |
| `createCategory` | Create new category | ✅ |
| `updateCategory` | Update category | ✅ |
| `deleteCategory` | Delete category | ✅ |

Xem chi tiết: [Backend API Documentation](docs/PRODUCT_SYSTEM_COMPLETE.md)

---

## 🧩 Components

### Product Components

```tsx
import {
  ProductCard,
  ProductList,
  ProductDetail,
  ProductForm
} from '@/components/product';

// Product Card
<ProductCard 
  product={product} 
  variant="featured"
  onAddToCart={handleAddToCart}
/>

// Product List
<ProductList 
  products={products}
  columns={4}
  loading={loading}
/>
```

### Category Components

```tsx
import {
  CategoryCard,
  CategoryTree,
  CategoryForm
} from '@/components/category';

// Category Tree
<CategoryTree
  categories={categoryTree}
  showActions
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Custom Hooks

```tsx
import { useProducts, useProduct } from '@/hooks/useProducts';
import { useCategories, useCategoryTree } from '@/hooks/useCategories';

// Products
const { products, loading, error } = useProducts({
  filters: { isFeatured: true },
  limit: 12
});

// Categories
const { categoryTree, loading } = useCategoryTree();
```

---

## 📸 Screenshots

### Admin Products List
![Products List](docs/screenshots/products-list.png)

### Product Form
![Product Form](docs/screenshots/product-form.png)

### Category Tree
![Category Tree](docs/screenshots/category-tree.png)

---

## 🏗️ Kiến Trúc

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                │
├─────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  Hooks             │
│  /admin/        │  ProductCard     │  useProducts       │
│  products       │  ProductList     │  useCategories     │
│  categories     │  CategoryTree    │  useProduct        │
│                 │  Forms           │  useCategoryTree   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ GraphQL (Apollo Client)
                   │
┌──────────────────┴──────────────────────────────────────┐
│              BACKEND (NestJS + GraphQL)                 │
├─────────────────────────────────────────────────────────┤
│  Resolvers      │  Services        │  Prisma ORM        │
│  Product        │  ProductService  │  Product Model     │
│  Category       │  CategoryService │  Category Model    │
│                 │                  │  ProductImage      │
│                 │                  │  ProductVariant    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Prisma Client
                   │
┌──────────────────┴──────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                  │
├─────────────────────────────────────────────────────────┤
│  Tables: categories, products, product_images,          │
│          product_variants                               │
│  Indexes: 25+ performance indexes                       │
│  Constraints: Foreign keys, unique constraints          │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run tests
npm run test

# Automated GraphQL tests
node ../test-product-api.js
```

### Frontend Tests

```bash
cd frontend

# Component tests
npm run test

# E2E tests
npm run test:e2e
```

### Manual Testing

Use GraphQL Playground:
```bash
http://localhost:3001/graphql
```

Import test queries from:
```
PRODUCT_TEST_QUERIES.graphql
```

---

## 🚀 Deployment

### Backend Deployment

```bash
cd backend

# Build
npm run build

# Start production
npm run start:prod
```

### Frontend Deployment

```bash
cd frontend

# Build
npm run build

# Start production
npm start
```

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
JWT_SECRET="your-secret-key"
PORT=3001
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:3001/graphql
```

---

## 📖 Documentation

- [📘 Backend Complete Guide](docs/PRODUCT_SYSTEM_COMPLETE.md)
- [🚀 Quick Start Guide](docs/PRODUCT_QUICK_START.md)
- [👨‍💻 Developer Guide](docs/PRODUCT_DEVELOPER_GUIDE.md)
- [🎬 Demo Script](DEMO_SCRIPT.md)
- [✅ Completion Checklist](PRODUCT_COMPLETION_CHECKLIST.md)
- [📊 Implementation Summary](PRODUCT_IMPLEMENTATION_SUMMARY.md)
- [🎉 Backend Success Report](FINAL_SUCCESS_REPORT.md)
- [🎨 Frontend Implementation](FRONTEND_IMPLEMENTATION_COMPLETE.md)

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Backend Developer**: NestJS + GraphQL + Prisma
- **Frontend Developer**: Next.js + React + TypeScript
- **UI/UX Designer**: shadcn/ui + TailwindCSS

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [GraphQL](https://graphql.org/) - Query language for APIs

---

## 📞 Support

For support, email support@kata.vn or join our Slack channel.

---

## 🗺️ Roadmap

- [x] Backend API with GraphQL
- [x] Database schema & migrations
- [x] Demo data seeding
- [x] Frontend components
- [x] Admin pages
- [ ] Customer pages
- [ ] Shopping cart
- [ ] Payment integration
- [ ] Order management
- [ ] Analytics dashboard

---

**Made with ❤️ in Vietnam 🇻🇳**

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 09/10/2025
