# 📖 Hướng Dẫn Tạo Dynamic Product Page Template

## 🎯 Mục Tiêu
Tạo **1 trang template duy nhất** có thể hiển thị thông tin cho **nhiều sản phẩm khác nhau** dựa trên slug động.

---

## 📊 So Sánh Phương Pháp

### ❌ Cách Cũ (Static Pages)
```
/product/giay-nike-air-max     → Page ID: 1
/product/giay-adidas-ultra     → Page ID: 2  
/product/giay-puma-suede       → Page ID: 3
... (phải tạo 100+ pages cho 100 sản phẩm)
```

### ✅ Cách Mới (Dynamic Page Template)
```
/product/:slug                  → Page Template ID: 1
  ↓ Dynamic Data Loading
  - /product/giay-nike-air-max  → Product ID: 101
  - /product/giay-adidas-ultra  → Product ID: 102
  - /product/giay-puma-suede    → Product ID: 103
... (1 template cho vô số sản phẩm)
```

---

## 🛠️ PHẦN 1: CẬP NHẬT DATABASE SCHEMA

### Bước 1.1: Thêm field `isDynamic` và `dynamicConfig` vào Page

**File:** `backend/src/schema/page.graphql`

```graphql
type Page {
  id: ID!
  title: String!
  slug: String!
  status: PageStatus!
  seoTitle: String
  seoDescription: String
  seoKeywords: [String!]
  blocks: [PageBlock!]
  layoutSettings: PageLayoutSettings
  isHomepage: Boolean
  
  # 🆕 Dynamic Page Fields
  isDynamic: Boolean!          # Flag: trang này có phải dynamic không?
  dynamicConfig: DynamicConfig # Cấu hình dynamic data
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 🆕 Dynamic Configuration Type
type DynamicConfig {
  # Data source configuration
  dataSource: String!           # "product" | "post" | "category" | "custom"
  dataQuery: String             # GraphQL query để load data
  
  # URL pattern
  slugPattern: String!          # VD: "/product/:productSlug"
  slugField: String!            # Field nào trong data là slug (VD: "slug")
  
  # Data binding
  dataBindings: [DataBinding!]  # Map data fields → block content
}

type DataBinding {
  blockId: String!              # Block nào sẽ nhận data
  sourceField: String!          # Field nào từ data source
  targetProperty: String!       # Property nào của block (VD: "content.html")
}

input DynamicConfigInput {
  dataSource: String!
  dataQuery: String
  slugPattern: String!
  slugField: String!
  dataBindings: [DataBindingInput!]
}

input DataBindingInput {
  blockId: String!
  sourceField: String!
  targetProperty: String!
}

# 🆕 Update CreatePageInput
input CreatePageInput {
  title: String!
  slug: String!
  status: PageStatus
  seoTitle: String
  seoDescription: String
  seoKeywords: [String!]
  blocks: [PageBlockInput!]
  layoutSettings: PageLayoutSettingsInput
  isHomepage: Boolean
  
  isDynamic: Boolean            # 🆕
  dynamicConfig: DynamicConfigInput  # 🆕
}

# 🆕 Update UpdatePageInput
input UpdatePageInput {
  title: String
  slug: String
  status: PageStatus
  seoTitle: String
  seoDescription: String
  seoKeywords: [String!]
  blocks: [PageBlockInput!]
  layoutSettings: PageLayoutSettingsInput
  isHomepage: Boolean
  
  isDynamic: Boolean            # 🆕
  dynamicConfig: DynamicConfigInput  # 🆕
}
```

### Bước 1.2: Update Prisma Schema

**File:** `backend/prisma/schema.prisma`

```prisma
model Page {
  id                String              @id @default(cuid())
  title             String
  slug              String              @unique
  content           Json?
  status            PageStatus          @default(DRAFT)
  seoTitle          String?
  seoDescription    String?
  seoKeywords       String[]
  blocks            Json?               // PageBlock[]
  layoutSettings    Json?
  isHomepage        Boolean             @default(false)
  
  // 🆕 Dynamic Page Fields
  isDynamic         Boolean             @default(false)
  dynamicConfig     Json?               // DynamicConfig object
  
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  @@index([slug])
  @@index([status])
  @@index([isDynamic])  // 🆕 Index for filtering dynamic pages
}
```

**Chạy migration:**
```bash
cd backend
npx prisma migrate dev --name add_dynamic_page_support
```

---

## 🎨 PHẦN 2: CẬP NHẬT FRONTEND TYPES

### Bước 2.1: Update Page Interface

**File:** `frontend/src/types/page-builder.ts`

```typescript
// 🆕 Dynamic Configuration Types
export interface DynamicConfig {
  dataSource: 'product' | 'post' | 'category' | 'custom';
  dataQuery?: string;
  slugPattern: string;        // VD: "/product/:productSlug"
  slugField: string;          // VD: "slug"
  dataBindings: DataBinding[];
}

export interface DataBinding {
  blockId: string;            // Block ID trong page template
  sourceField: string;        // Field từ product data (VD: "name", "price")
  targetProperty: string;     // Property của block (VD: "content.html")
  transform?: string;         // Optional: transformation function
}

// 🆕 Update Page Interface
export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: any;
  status: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  blocks?: PageBlock[];
  layoutSettings?: PageLayoutSettings;
  isHomepage?: boolean;
  
  // 🆕 Dynamic Page Support
  isDynamic?: boolean;
  dynamicConfig?: DynamicConfig;
  
  createdAt: string;
  updatedAt: string;
}
```

---

## 🏗️ PHẦN 3: TẠO DYNAMIC PRODUCT PAGE TEMPLATE

### Bước 3.1: Tạo Page Template trong Page Builder

**UI Flow:**

1. **Mở Page Builder** → Click "Create New Page"

2. **Fill Form:**
   ```
   Title: "Product Template"
   Slug: "/product/:productSlug"  ← Chú ý dấu :productSlug
   Status: Published
   
   ✅ [x] This is a dynamic page
   
   Data Source: Product
   Slug Field: slug
   ```

3. **Design Layout với Blocks:**

   **Block 1: Hero Image (Image Block)**
   - ID: `hero-image`
   - Data Binding: `product.images[0].url` → `content.src`

   **Block 2: Product Title (Text Block)**
   - ID: `product-title`
   - Data Binding: `product.name` → `content.html`
   - Style: h1, font-size: 2.5rem, font-weight: bold

   **Block 3: Price (Text Block)**
   - ID: `product-price`
   - Data Binding: `product.price` → `content.html`
   - Transform: `formatCurrency`
   - Style: font-size: 1.5rem, color: red

   **Block 4: Description (Rich Text Block)**
   - ID: `product-description`
   - Data Binding: `product.description` → `content.html`

   **Block 5: Add to Cart Button (Button Block)**
   - ID: `add-to-cart-btn`
   - Data Binding: `product.id` → `content.productId`
   - Action: `addToCart`

### Bước 3.2: Configure Data Bindings

**Dynamic Config Object:**
```json
{
  "dataSource": "product",
  "dataQuery": "getProductBySlug",
  "slugPattern": "/product/:productSlug",
  "slugField": "slug",
  "dataBindings": [
    {
      "blockId": "hero-image",
      "sourceField": "images[0].url",
      "targetProperty": "content.src"
    },
    {
      "blockId": "product-title",
      "sourceField": "name",
      "targetProperty": "content.html"
    },
    {
      "blockId": "product-price",
      "sourceField": "price",
      "targetProperty": "content.html",
      "transform": "formatCurrency"
    },
    {
      "blockId": "product-description",
      "sourceField": "description",
      "targetProperty": "content.html"
    },
    {
      "blockId": "add-to-cart-btn",
      "sourceField": "id",
      "targetProperty": "content.productId"
    }
  ]
}
```

---

## 🔧 PHẦN 4: CẬP NHẬT PAGE BUILDER UI

### Bước 4.1: Add Dynamic Page Toggle

**File:** `frontend/src/components/page-builder/PageSettingsForm.tsx`

Thêm vào tab "General":

```tsx
{/* 🆕 Dynamic Page Toggle */}
<div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
  <div className="space-y-0.5">
    <Label className="text-sm font-medium text-blue-900">
      Dynamic Page Template
    </Label>
    <p className="text-xs text-blue-600">
      Use this page as a template for multiple items with different slugs
    </p>
  </div>
  <Switch
    checked={formData.isDynamic || false}
    onCheckedChange={(checked) => handleChange('isDynamic', checked)}
  />
</div>

{/* 🆕 Show Dynamic Config when enabled */}
{formData.isDynamic && (
  <DynamicPageConfig
    config={formData.dynamicConfig}
    blocks={formData.blocks}
    onChange={(config) => handleChange('dynamicConfig', config)}
  />
)}
```

### Bước 4.2: Create DynamicPageConfig Component

**File:** `frontend/src/components/page-builder/DynamicPageConfig.tsx`

```tsx
'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Link2 } from 'lucide-react';
import type { DynamicConfig, DataBinding, PageBlock } from '@/types/page-builder';

interface DynamicPageConfigProps {
  config?: DynamicConfig;
  blocks?: PageBlock[];
  onChange: (config: DynamicConfig) => void;
}

export function DynamicPageConfig({ config, blocks = [], onChange }: DynamicPageConfigProps) {
  const [localConfig, setLocalConfig] = React.useState<DynamicConfig>(
    config || {
      dataSource: 'product',
      slugPattern: '',
      slugField: 'slug',
      dataBindings: [],
    }
  );

  const updateConfig = (updates: Partial<DynamicConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const addBinding = () => {
    const newBinding: DataBinding = {
      blockId: '',
      sourceField: '',
      targetProperty: 'content.html',
    };
    updateConfig({
      dataBindings: [...localConfig.dataBindings, newBinding],
    });
  };

  const updateBinding = (index: number, updates: Partial<DataBinding>) => {
    const newBindings = [...localConfig.dataBindings];
    newBindings[index] = { ...newBindings[index], ...updates };
    updateConfig({ dataBindings: newBindings });
  };

  const removeBinding = (index: number) => {
    updateConfig({
      dataBindings: localConfig.dataBindings.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 border-l-4 border-blue-500 pl-4">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Link2 className="w-4 h-4" />
        Dynamic Configuration
      </h3>

      {/* Data Source */}
      <div className="space-y-2">
        <Label className="text-sm">Data Source</Label>
        <Select
          value={localConfig.dataSource}
          onValueChange={(value) => updateConfig({ dataSource: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="post">Blog Post</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="custom">Custom API</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Slug Pattern */}
      <div className="space-y-2">
        <Label className="text-sm">URL Pattern</Label>
        <Input
          value={localConfig.slugPattern}
          onChange={(e) => updateConfig({ slugPattern: e.target.value })}
          placeholder="/product/:productSlug"
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500">
          Use <code className="bg-gray-100 px-1 rounded">:paramName</code> for dynamic segments
        </p>
      </div>

      {/* Slug Field */}
      <div className="space-y-2">
        <Label className="text-sm">Slug Field Name</Label>
        <Input
          value={localConfig.slugField}
          onChange={(e) => updateConfig({ slugField: e.target.value })}
          placeholder="slug"
          className="font-mono text-sm"
        />
      </div>

      {/* Data Bindings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Data Bindings</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBinding}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Binding
          </Button>
        </div>

        {localConfig.dataBindings.map((binding, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            {/* Block Selection */}
            <div className="col-span-4">
              <Label className="text-xs text-gray-600">Block</Label>
              <Select
                value={binding.blockId}
                onValueChange={(value) => updateBinding(index, { blockId: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.type} - {block.id.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source Field */}
            <div className="col-span-3">
              <Label className="text-xs text-gray-600">Source Field</Label>
              <Input
                value={binding.sourceField}
                onChange={(e) => updateBinding(index, { sourceField: e.target.value })}
                placeholder="name"
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* Target Property */}
            <div className="col-span-4">
              <Label className="text-xs text-gray-600">Target Property</Label>
              <Input
                value={binding.targetProperty}
                onChange={(e) => updateBinding(index, { targetProperty: e.target.value })}
                placeholder="content.html"
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* Remove Button */}
            <div className="col-span-1 flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBinding(index)}
                className="h-8 w-8 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {localConfig.dataBindings.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No data bindings configured. Click "Add Binding" to start.
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔄 PHẦN 5: RUNTIME DATA LOADING

### Bước 5.1: Create Dynamic Page Renderer

**File:** `frontend/src/components/DynamicPageRenderer.tsx`

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { PageRenderer } from '@/components/page-builder/PageRenderer';
import type { Page, PageBlock } from '@/types/page-builder';

interface DynamicPageRendererProps {
  pageTemplate: Page;
  slug: string;
}

// GraphQL query để load product data
const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    getProductBySlug(slug: $slug) {
      id
      name
      slug
      description
      price
      images {
        url
        alt
      }
      category {
        name
      }
      stock
      sku
    }
  }
`;

export function DynamicPageRenderer({ pageTemplate, slug }: DynamicPageRendererProps) {
  const [renderedBlocks, setRenderedBlocks] = useState<PageBlock[]>([]);

  // Load product data based on slug
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug || !pageTemplate.isDynamic,
  });

  // Apply data bindings to blocks
  useEffect(() => {
    if (!data || !pageTemplate.dynamicConfig || !pageTemplate.blocks) {
      setRenderedBlocks(pageTemplate.blocks || []);
      return;
    }

    const productData = data.getProductBySlug;
    const { dataBindings } = pageTemplate.dynamicConfig;

    // Clone blocks và apply data bindings
    const updatedBlocks = pageTemplate.blocks.map((block) => {
      const binding = dataBindings.find((b) => b.blockId === block.id);
      if (!binding) return block;

      // Get value from product data
      const value = getNestedValue(productData, binding.sourceField);
      
      // Apply transform if specified
      const transformedValue = binding.transform
        ? applyTransform(value, binding.transform)
        : value;

      // Set value to target property
      return setNestedValue(block, binding.targetProperty, transformedValue);
    });

    setRenderedBlocks(updatedBlocks);
  }, [data, pageTemplate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-2">Product not found</p>
          <p className="text-gray-600">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  // Render page với updated blocks
  return (
    <PageRenderer
      page={{
        ...pageTemplate,
        blocks: renderedBlocks,
      }}
    />
  );
}

// Helper: Get nested value from object
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => {
    // Handle array access: images[0].url
    const arrayMatch = prop.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      return current?.[arrayName]?.[parseInt(index)];
    }
    return current?.[prop];
  }, obj);
}

// Helper: Set nested value in object
function setNestedValue(obj: any, path: string, value: any): any {
  const clone = JSON.parse(JSON.stringify(obj));
  const parts = path.split('.');
  let current = clone;

  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }

  current[parts[parts.length - 1]] = value;
  return clone;
}

// Helper: Apply transformation
function applyTransform(value: any, transform: string): any {
  switch (transform) {
    case 'formatCurrency':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    
    case 'formatDate':
      return new Date(value).toLocaleDateString('vi-VN');
    
    case 'uppercase':
      return String(value).toUpperCase();
    
    case 'lowercase':
      return String(value).toLowerCase();
    
    default:
      return value;
  }
}
```

---

## 🌐 PHẦN 6: ROUTING SETUP

### Bước 6.1: Create Dynamic Route

**File:** `frontend/src/app/product/[slug]/page.tsx`

```tsx
import { Metadata } from 'next';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { DynamicPageRenderer } from '@/components/DynamicPageRenderer';

// GraphQL query để load page template
const GET_DYNAMIC_PAGE_TEMPLATE = gql`
  query GetDynamicPageTemplate($slugPattern: String!) {
    getPageBySlugPattern(slugPattern: $slugPattern) {
      id
      title
      slug
      isDynamic
      dynamicConfig
      blocks
      layoutSettings
      seoTitle
      seoDescription
      seoKeywords
    }
  }
`;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Load product data for SEO
  const { data } = await apolloClient.query({
    query: gql`
      query GetProductBySlug($slug: String!) {
        getProductBySlug(slug: $slug) {
          name
          description
          images { url }
        }
      }
    `,
    variables: { slug: params.slug },
  });

  const product = data?.getProductBySlug;

  return {
    title: product?.name || 'Product',
    description: product?.description?.substring(0, 160),
    openGraph: {
      images: [product?.images?.[0]?.url],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Load page template
  const { data } = await apolloClient.query({
    query: GET_DYNAMIC_PAGE_TEMPLATE,
    variables: { slugPattern: '/product/:productSlug' },
  });

  const pageTemplate = data?.getPageBySlugPattern;

  if (!pageTemplate) {
    return <div>Page template not found</div>;
  }

  return <DynamicPageRenderer pageTemplate={pageTemplate} slug={params.slug} />;
}
```

---

## ✅ PHẦN 7: TEST & VERIFY

### Test Case 1: Tạo Template

1. Mở Page Builder
2. Create New Page:
   - Title: "Product Template"
   - Slug: "/product/:productSlug"
   - Enable "Dynamic Page"
   - Data Source: "Product"
3. Add blocks và configure data bindings
4. Save template

### Test Case 2: Test với Sản Phẩm

```
Product 1:
URL: /product/giay-nike-air-max
→ Load data từ product với slug "giay-nike-air-max"
→ Render template với product data

Product 2:
URL: /product/giay-adidas-ultra
→ Load data từ product với slug "giay-adidas-ultra"
→ Render template với product data (cùng layout)
```

### Test Case 3: Verify Data Bindings

Kiểm tra mỗi block có hiển thị đúng data:
- ✅ Hero image = product.images[0].url
- ✅ Title = product.name
- ✅ Price = formatCurrency(product.price)
- ✅ Description = product.description

---

## 📝 PHẦN 8: BEST PRACTICES

### 1. SEO Optimization

```typescript
// Dynamic SEO từ product data
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
    title: `${product.name} - Mua ngay giá tốt`,
    description: product.description,
    keywords: product.tags,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(img => img.url),
    },
  };
}
```

### 2. Error Handling

```tsx
// Graceful fallback khi product không tồn tại
if (!productData) {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Sản phẩm không tồn tại</h1>
      <p className="text-gray-600 mb-8">
        Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không còn kinh doanh.
      </p>
      <a href="/products" className="btn-primary">
        Xem tất cả sản phẩm
      </a>
    </div>
  );
}
```

### 3. Performance

```tsx
// Implement ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

// Pre-generate popular products
export async function generateStaticParams() {
  const products = await getPopularProducts(100);
  return products.map(p => ({ slug: p.slug }));
}
```

### 4. Analytics

```tsx
// Track page views per product
useEffect(() => {
  if (productData) {
    analytics.track('Product Viewed', {
      productId: productData.id,
      productName: productData.name,
      price: productData.price,
    });
  }
}, [productData]);
```

---

## 🎯 KẾT QUẢ

### ✅ Lợi Ích

1. **Tiết kiệm thời gian**: Tạo 1 template thay vì 100+ pages
2. **Consistency**: Tất cả sản phẩm có cùng layout chuyên nghiệp
3. **Easy maintenance**: Sửa template → tất cả sản phẩm tự động update
4. **SEO friendly**: Dynamic meta tags cho từng sản phẩm
5. **Scalable**: Thêm 1000 sản phẩm không cần tạo thêm page

### 📊 Metrics

```
Before (Static):
- 100 products = 100 pages
- Update design = Edit 100 pages
- Maintenance time: High

After (Dynamic):
- 100 products = 1 template
- Update design = Edit 1 template
- Maintenance time: Low
```

---

## 🚀 NÂNG CAO

### Custom Data Sources

Tạo template cho nhiều loại data:

1. **Blog Posts**: `/blog/:postSlug`
2. **Categories**: `/category/:categorySlug`
3. **Landing Pages**: `/promo/:campaignSlug`
4. **User Profiles**: `/user/:username`

### Advanced Bindings

```typescript
{
  blockId: 'related-products',
  sourceField: 'relatedProducts',
  targetProperty: 'content.items',
  transform: 'mapToCards'  // Custom transform
}
```

### Conditional Rendering

```typescript
{
  blockId: 'sale-badge',
  sourceField: 'onSale',
  targetProperty: 'visible',  // Show/hide block
  condition: 'equals',
  conditionValue: true
}
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [GraphQL Data Loading](https://www.apollographql.com/docs/react/data/queries/)
- [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

**Chúc bạn thành công! 🎉**
