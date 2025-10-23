# 📚 Dynamic Block - Hướng Dẫn Chi Tiết

## 📖 Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Cách Sử Dụng](#cách-sử-dụng)
3. [Các Loại Data Source](#các-loại-data-source)
4. [Demo Lưu Database](#demo-lưu-database)
5. [Template Advanced Features](#template-advanced-features)
6. [Best Practices](#best-practices)

---

## 🎯 Giới Thiệu

**Dynamic Block** là một block đặc biệt cho phép bạn:
- ⚡ Tải dữ liệu động từ API, GraphQL hoặc Database
- 🎨 Sử dụng templates để hiển thị dữ liệu
- 🔄 Lặp lại dữ liệu với repeater pattern
- 🔧 Cấu hình filter, sort, limit
- 💾 Lưu cấu hình vào Database

**Lợi Ích:**
- Không cần viết code
- Dữ liệu luôn cập nhật
- Reusable templates
- SEO-friendly
- Performance optimized

---

## 🚀 Cách Sử Dụng

### Bước 1: Thêm Dynamic Block

```
1. Click "Add New Block" ở dưới canvas
2. Chọn "Dynamic Block" (⚡ icon)
3. Block sẽ được thêm vào page
```

### Bước 2: Cấu Hình Block

```
1. Hover vào Dynamic Block
2. Click icon "Settings" (⚙️)
3. Cấu hình các thông số sau
```

### Bước 3: Cấu Hình Template

**Template Name:** Đặt tên cho template
```
Ví dụ: "featured-products", "team-members"
```

---

## 📊 Các Loại Data Source

### 1️⃣ Static Data (Dữ liệu Tĩnh)

**Khi nào dùng:** Dữ liệu không thay đổi thường xuyên

**Cấu Hình:**
```json
{
  "type": "static",
  "staticData": {
    "title": "Featured Products",
    "items": [
      {
        "id": 1,
        "name": "Product 1",
        "price": 100
      },
      {
        "id": 2,
        "name": "Product 2",
        "price": 200
      }
    ]
  }
}
```

**Ưu điểm:**
- ✅ Không phụ thuộc API
- ✅ Tải nhanh
- ✅ Dễ test

**Nhược điểm:**
- ❌ Phải cập nhật manual
- ❌ Không real-time

---

### 2️⃣ REST API

**Khi nào dùng:** Dữ liệu từ REST API

**Cấu Hình:**
```json
{
  "type": "api",
  "endpoint": "/api/products",
  "variables": {
    "limit": 10,
    "sort": "price"
  }
}
```

**Cách dùng:**
```
POST /api/products
Content-Type: application/json

{
  "limit": 10,
  "sort": "price"
}
```

**Ví dụ Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 100,
      "image": "url",
      "description": "Mô tả sản phẩm"
    }
  ]
}
```

---

### 3️⃣ GraphQL

**Khi nào dùng:** Dữ liệu từ GraphQL API

**Cấu Hình:**
```json
{
  "type": "graphql",
  "endpoint": "/graphql",
  "query": "query GetProducts($limit: Int!) { products(limit: $limit) { id name price } }",
  "variables": {
    "limit": 10
  }
}
```

**Query Example:**
```graphql
query GetProducts($limit: Int!) {
  products(limit: $limit) {
    id
    name
    price
    image
    category {
      id
      name
    }
  }
}
```

---

### 4️⃣ Database (Direct Query)

**Khi nào dùng:** Dữ liệu trực tiếp từ Database

**Cấu Hình:**
```json
{
  "type": "database",
  "table": "products",
  "filters": {
    "isActive": true,
    "isFeatured": true
  },
  "sort": {
    "field": "price",
    "direction": "ASC"
  },
  "limit": 10
}
```

---

## 💾 Demo Lưu Database

### Bước 1: Tạo Page với Dynamic Block

#### Frontend:
```typescript
// pages/admin/page-builder/demo.tsx
import { PageBuilderWithTemplates } from '@/components/page-builder';
import { useCreatePage } from '@/hooks/usePageBuilder';

export default function DemoPage() {
  const { createPage } = useCreatePage();

  const handleCreateDemo = async () => {
    const demoPage = {
      title: 'Product Showcase',
      slug: 'product-showcase-demo',
      description: 'Demo page with dynamic product block',
      status: 'DRAFT',
      blocks: [
        {
          type: 'HERO',
          order: 0,
          content: {
            title: 'Our Products',
            subtitle: 'Discover our amazing collection'
          }
        },
        {
          type: 'DYNAMIC',
          order: 1,
          config: {
            templateName: 'featured-products',
            dataSource: {
              type: 'graphql',
              endpoint: '/graphql',
              query: `
                query GetFeaturedProducts($limit: Int!) {
                  products(limit: $limit, isFeatured: true) {
                    id
                    name
                    price
                    image
                    description
                    category {
                      name
                    }
                  }
                }
              `,
              variables: {
                limit: 12
              }
            },
            repeater: {
              enabled: true,
              dataPath: 'products',
              limit: 12,
              itemTemplate: {
                content: {
                  title: '{{name}}',
                  description: '{{description}}'
                }
              }
            }
          },
          content: {
            componentType: 'template',
            templateId: 'featured-products',
            templateName: 'Featured Products',
            template: `
              <div class="grid grid-cols-3 gap-6">
                {{#each products}}
                <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img src="{{image}}" alt="{{name}}" class="w-full h-48 object-cover">
                  <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">{{name}}</h3>
                    <p class="text-gray-600 text-sm mb-3">{{description}}</p>
                    <div class="flex justify-between items-center">
                      <span class="text-blue-600 font-bold text-lg">${{price}}</span>
                      <span class="text-xs bg-gray-200 px-2 py-1 rounded">{{category}}</span>
                    </div>
                    <button class="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
                {{/each}}
              </div>
            `
          }
        }
      ]
    };

    await createPage(demoPage);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Create Demo Page</h1>
      <button
        onClick={handleCreateDemo}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Create Dynamic Block Demo
      </button>
    </div>
  );
}
```

#### Backend - Prisma Schema:
```prisma
model Page {
  id            String    @id @default(uuid())
  title         String
  slug          String    @unique
  description   String?
  content       Json?
  status        PageStatus @default(DRAFT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  blocks        PageBlock[]
}

model PageBlock {
  id            String      @id @default(uuid())
  type          BlockType
  content       Json        // Template HTML and config
  style         Json?       // CSS styles
  order         Int         @default(0)
  config        Json?       // Dynamic config (dataSource, repeater, etc)
  isVisible     Boolean     @default(true)
  
  pageId        String
  page          Page        @relation(fields: [pageId], references: [id], onDelete: Cascade)
  
  parentId      String?
  parent        PageBlock?  @relation("BlockChildren", fields: [parentId], references: [id], onDelete: Cascade)
  children      PageBlock[] @relation("BlockChildren")
  
  depth         Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@unique([pageId, parentId, order])
  @@index([pageId, order])
}
```

#### Backend - GraphQL Query:
```graphql
query GetFeaturedProducts($limit: Int!) {
  products(limit: $limit, isFeatured: true) {
    id
    name
    price
    image
    description
    category {
      id
      name
    }
    reviews {
      rating
      comment
    }
  }
}
```

#### Backend - Resolver:
```typescript
// backend/src/graphql/resolvers/product.resolver.ts
import { Query, Resolver, Args, Int } from '@nestjs/graphql';
import { ProductService } from '@/services/product.service';

@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  async products(
    @Args('limit', { type: () => Int }, defaultValue: 10) limit: number,
    @Args('isFeatured', { type: () => Boolean }, nullable: true) isFeatured?: boolean,
    @Args('categoryId', { nullable: true }) categoryId?: string,
  ) {
    return this.productService.findMany({
      take: limit,
      where: {
        ...(isFeatured !== undefined && { isFeatured }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
```

### Bước 2: Database Structure

#### Create Migration:
```bash
npx prisma migrate dev --name add_dynamic_block_config
```

#### Database Query để lấy Demo Data:
```sql
-- Insert sample products
INSERT INTO "Product" (id, name, price, image, description, "isFeatured", "isActive", "categoryId")
VALUES
  ('prod-1', 'MacBook Pro M3', 1999, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Powerful laptop for professionals', true, true, 'cat-1'),
  ('prod-2', 'iPhone 15 Pro', 1099, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'Latest smartphone technology', true, true, 'cat-1'),
  ('prod-3', 'AirPods Pro', 249, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 'Premium wireless earbuds', true, true, 'cat-2');

-- Insert sample categories
INSERT INTO "Category" (id, name, slug)
VALUES
  ('cat-1', 'Electronics', 'electronics'),
  ('cat-2', 'Accessories', 'accessories');
```

### Bước 3: Save Page to Database

```typescript
// Save via API
POST /api/pages

{
  "title": "Product Showcase",
  "slug": "product-showcase-demo",
  "description": "Demo page with dynamic product block",
  "status": "PUBLISHED",
  "blocks": [
    {
      "type": "DYNAMIC",
      "order": 0,
      "config": {
        "templateName": "featured-products",
        "dataSource": {
          "type": "graphql",
          "endpoint": "/graphql",
          "query": "query { products(limit: 10, isFeatured: true) { ... } }",
          "variables": { "limit": 10 }
        }
      },
      "content": {
        "componentType": "template",
        "template": "<div>...</div>"
      }
    }
  ]
}
```

---

## 🎨 Template Advanced Features

### 1. Simple Variable Replacement

```html
<div>
  <h1>{{title}}</h1>
  <p>{{description}}</p>
</div>
```

### 2. Loop with {{#each}}

```html
<div class="grid">
  {{#each items}}
    <div class="item">
      <h3>{{name}}</h3>
      <p class="price">${{price}}</p>
    </div>
  {{/each}}
</div>
```

### 3. Conditional {{#if}}

```html
{{#if isFeatured}}
  <div class="badge">Featured</div>
{{/if}}
```

### 4. Repeat Element {{#repeat}}

```html
<!-- Rating stars -->
<div class="stars">
  {{#repeat rating}}<span class="star">⭐</span>{{/repeat}}
</div>
```

### 5. Complex Template Example

```html
<section class="products">
  <h2>{{title}}</h2>
  <div class="grid grid-cols-3 gap-6">
    {{#each products}}
      <div class="card">
        <img src="{{image}}" alt="{{name}}">
        <div class="content">
          <h3>{{name}}</h3>
          {{#if onSale}}
            <span class="sale-badge">On Sale!</span>
          {{/if}}
          <p class="description">{{description}}</p>
          <div class="rating">
            Rating: {{#repeat rating}}⭐{{/repeat}} ({{reviews}})
          </div>
          <div class="footer">
            <span class="price">${{price}}</span>
            <button class="btn">Add to Cart</button>
          </div>
        </div>
      </div>
    {{/each}}
  </div>
</section>
```

---

## ✅ Best Practices

### 1. Performance Tips

```typescript
// ✅ Good: Limit results
{
  "dataSource": {
    "variables": { "limit": 10 },
    "query": "query($limit: Int!) { products(limit: $limit) ... }"
  }
}

// ❌ Bad: No limit
{
  "dataSource": {
    "query": "query { products { ... } }"  // Fetches all!
  }
}
```

### 2. Caching Strategy

```typescript
// ✅ Good: Cache frequently used data
{
  "cache": {
    "enabled": true,
    "ttl": 3600  // 1 hour in seconds
  }
}
```

### 3. Error Handling

```typescript
// Template with fallback
{{#each items}}
  <div>
    <h3>{{name || 'Untitled'}}</h3>
    <p>{{description || 'No description available'}}</p>
  </div>
{{/each}}
```

### 4. SEO Optimization

```html
<!-- Pre-render important content -->
<section class="products">
  <h1>{{title}}</h1>
  <meta name="description" content="{{metaDescription}}">
  <!-- Dynamic content for SEO -->
  {{#each products}}
    <article itemscope itemtype="https://schema.org/Product">
      <h2 itemprop="name">{{name}}</h2>
      <div itemprop="description">{{description}}</div>
      <span itemprop="price" content="{{price}}">{{price}}</span>
    </article>
  {{/each}}
</section>
```

### 5. Responsive Design

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {{#each items}}
    <div class="card">
      <!-- Content -->
    </div>
  {{/each}}
</div>
```

---

## 📋 Checklists

### Tạo Dynamic Block

- [ ] Click "Add New Block" 
- [ ] Chọn "Dynamic Block"
- [ ] Đặt Template Name
- [ ] Chọn Data Source (Static/API/GraphQL/DB)
- [ ] Nhập Query/Endpoint
- [ ] Enable Repeater (nếu cần)
- [ ] Viết Template HTML
- [ ] Test Preview
- [ ] Save Page

### Deploy to Production

- [ ] Kiểm tra API endpoint
- [ ] Validate GraphQL query
- [ ] Kiểm tra cache settings
- [ ] Test responsive design
- [ ] Verify SEO meta tags
- [ ] Check performance metrics
- [ ] Deploy page
- [ ] Monitor errors

---

## 🔗 Tài Liệu Liên Quan

- [Page Builder Guide](./PAGEBUILDER_COMPREHENSIVE_CHECK.md)
- [GraphQL Schema](../backend/src/schema.gql)
- [API Documentation](../docs/API.md)
- [Database Schema](../backend/prisma/schema.prisma)

---

## 💬 Q&A

**Q: Dữ liệu Dynamic Block có cache không?**
A: Có! Mặc định cache 1 giờ. Bạn có thể configure trong settings.

**Q: Có thể update template mà không cần reload page?**
A: Có! Nhấn "Refresh" icon để reload data.

**Q: Có support nested template không?**
A: Chưa. Hiện tại chỉ support 1 level nesting.

**Q: Có thể dùng custom JavaScript không?**
A: Không. Dùng template syntax để bảo mật.

---

**Last Updated:** October 23, 2025  
**Version:** 1.0.0
