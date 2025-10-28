# 🎯 EXAMPLE: Dynamic Product Page Configuration

## Ví Dụ 1: Basic Product Page

### Page Template Settings
```json
{
  "title": "Product Template",
  "slug": "/product/:productSlug",
  "isDynamic": true,
  "status": "PUBLISHED",
  "dynamicConfig": {
    "dataSource": "product",
    "slugPattern": "/product/:productSlug",
    "slugField": "slug",
    "dataBindings": [
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
        "blockId": "product-image",
        "sourceField": "images[0].url",
        "targetProperty": "content.src"
      },
      {
        "blockId": "product-description",
        "sourceField": "description",
        "targetProperty": "content.html"
      }
    ]
  }
}
```

### Blocks Configuration
```json
{
  "blocks": [
    {
      "id": "product-image",
      "type": "image",
      "content": {
        "src": "",
        "alt": "Product Image",
        "width": "100%",
        "height": "auto"
      },
      "styles": {
        "maxWidth": "600px",
        "margin": "0 auto"
      }
    },
    {
      "id": "product-title",
      "type": "text",
      "content": {
        "html": "<h1>Product Name</h1>",
        "fontSize": 32,
        "fontWeight": "bold"
      }
    },
    {
      "id": "product-price",
      "type": "text",
      "content": {
        "html": "0 VND",
        "fontSize": 24,
        "color": "#dc2626",
        "fontWeight": "600"
      }
    },
    {
      "id": "product-description",
      "type": "richtext",
      "content": {
        "html": "<p>Product description</p>"
      }
    }
  ]
}
```

---

## Ví Dụ 2: Advanced Product Page với Related Products

### Data Bindings
```json
{
  "dataBindings": [
    // Hero Section
    {
      "blockId": "hero-image",
      "sourceField": "images[0].url",
      "targetProperty": "content.src"
    },
    {
      "blockId": "hero-badge",
      "sourceField": "category.name",
      "targetProperty": "content.html",
      "transform": "uppercase"
    },
    
    // Product Info
    {
      "blockId": "product-name",
      "sourceField": "name",
      "targetProperty": "content.html"
    },
    {
      "blockId": "product-sku",
      "sourceField": "sku",
      "targetProperty": "content.html"
    },
    {
      "blockId": "product-stock",
      "sourceField": "stock",
      "targetProperty": "content.html"
    },
    
    // Pricing
    {
      "blockId": "original-price",
      "sourceField": "originalPrice",
      "targetProperty": "content.html",
      "transform": "formatCurrency"
    },
    {
      "blockId": "sale-price",
      "sourceField": "price",
      "targetProperty": "content.html",
      "transform": "formatCurrency"
    },
    {
      "blockId": "discount-badge",
      "sourceField": "discountPercent",
      "targetProperty": "content.html"
    },
    
    // Gallery
    {
      "blockId": "gallery-1",
      "sourceField": "images[1].url",
      "targetProperty": "content.src"
    },
    {
      "blockId": "gallery-2",
      "sourceField": "images[2].url",
      "targetProperty": "content.src"
    },
    {
      "blockId": "gallery-3",
      "sourceField": "images[3].url",
      "targetProperty": "content.src"
    },
    
    // Details
    {
      "blockId": "full-description",
      "sourceField": "fullDescription",
      "targetProperty": "content.html"
    },
    {
      "blockId": "specifications",
      "sourceField": "specifications",
      "targetProperty": "content.items"
    },
    
    // CTA
    {
      "blockId": "add-to-cart-btn",
      "sourceField": "id",
      "targetProperty": "content.productId"
    },
    {
      "blockId": "buy-now-btn",
      "sourceField": "id",
      "targetProperty": "content.productId"
    }
  ]
}
```

---

## Ví Dụ 3: Blog Post Template

### Configuration
```json
{
  "title": "Blog Post Template",
  "slug": "/blog/:postSlug",
  "isDynamic": true,
  "dynamicConfig": {
    "dataSource": "post",
    "slugPattern": "/blog/:postSlug",
    "slugField": "slug",
    "dataBindings": [
      {
        "blockId": "post-title",
        "sourceField": "title",
        "targetProperty": "content.html"
      },
      {
        "blockId": "post-date",
        "sourceField": "publishedAt",
        "targetProperty": "content.html",
        "transform": "formatDate"
      },
      {
        "blockId": "post-author",
        "sourceField": "author.name",
        "targetProperty": "content.html"
      },
      {
        "blockId": "post-cover",
        "sourceField": "coverImage.url",
        "targetProperty": "content.src"
      },
      {
        "blockId": "post-content",
        "sourceField": "content",
        "targetProperty": "content.html"
      },
      {
        "blockId": "post-category",
        "sourceField": "category.name",
        "targetProperty": "content.html"
      },
      {
        "blockId": "post-tags",
        "sourceField": "tags",
        "targetProperty": "content.items"
      }
    ]
  }
}
```

---

## Ví Dụ 4: Category Landing Page

### Configuration
```json
{
  "title": "Category Template",
  "slug": "/category/:categorySlug",
  "isDynamic": true,
  "dynamicConfig": {
    "dataSource": "category",
    "slugPattern": "/category/:categorySlug",
    "slugField": "slug",
    "dataBindings": [
      {
        "blockId": "category-title",
        "sourceField": "name",
        "targetProperty": "content.html"
      },
      {
        "blockId": "category-description",
        "sourceField": "description",
        "targetProperty": "content.html"
      },
      {
        "blockId": "category-banner",
        "sourceField": "bannerImage.url",
        "targetProperty": "content.src"
      },
      {
        "blockId": "product-count",
        "sourceField": "productCount",
        "targetProperty": "content.html"
      },
      {
        "blockId": "products-grid",
        "sourceField": "products",
        "targetProperty": "content.items"
      }
    ]
  }
}
```

---

## GraphQL Queries Examples

### Get Product by Slug
```graphql
query GetProductBySlug($slug: String!) {
  getProductBySlug(slug: $slug) {
    id
    name
    slug
    description
    fullDescription
    price
    originalPrice
    discountPercent
    sku
    stock
    
    images {
      url
      alt
    }
    
    category {
      id
      name
      slug
    }
    
    specifications {
      name
      value
    }
    
    relatedProducts {
      id
      name
      slug
      price
      images {
        url
      }
    }
  }
}
```

### Get Blog Post by Slug
```graphql
query GetPostBySlug($slug: String!) {
  getPostBySlug(slug: $slug) {
    id
    title
    slug
    content
    excerpt
    publishedAt
    
    coverImage {
      url
      alt
    }
    
    author {
      name
      avatar
      bio
    }
    
    category {
      name
      slug
    }
    
    tags {
      name
      slug
    }
    
    relatedPosts {
      id
      title
      slug
      excerpt
      coverImage {
        url
      }
    }
  }
}
```

### Get Category by Slug
```graphql
query GetCategoryBySlug($slug: String!) {
  getCategoryBySlug(slug: $slug) {
    id
    name
    slug
    description
    productCount
    
    bannerImage {
      url
      alt
    }
    
    products(limit: 20) {
      id
      name
      slug
      price
      images {
        url
      }
    }
    
    subcategories {
      id
      name
      slug
      productCount
    }
  }
}
```

---

## Transform Functions Available

### formatCurrency
```typescript
// Input: 199000
// Output: "199.000 ₫"
```

### formatDate
```typescript
// Input: "2025-10-28T10:30:00Z"
// Output: "28/10/2025"
```

### uppercase
```typescript
// Input: "electronics"
// Output: "ELECTRONICS"
```

### lowercase
```typescript
// Input: "SALE"
// Output: "sale"
```

### Custom Transform (Advanced)
```typescript
// In DynamicPageRenderer.tsx, add custom transforms:
case 'formatDiscount':
  return `Giảm ${value}%`;

case 'formatStock':
  return value > 0 ? `Còn ${value} sản phẩm` : 'Hết hàng';

case 'formatRating':
  return `⭐ ${value}/5`;
```

---

## Testing Examples

### Test URLs

**Product Pages:**
- `/product/giay-nike-air-max` → Load product with slug "giay-nike-air-max"
- `/product/giay-adidas-ultraboost` → Load product with slug "giay-adidas-ultraboost"
- `/product/ao-thun-polo` → Load product with slug "ao-thun-polo"

**Blog Posts:**
- `/blog/huong-dan-chon-giay-the-thao` → Load post
- `/blog/xu-huong-thoi-trang-2025` → Load post

**Categories:**
- `/category/giay-the-thao` → Load category
- `/category/ao-khoac` → Load category

### Expected Behavior

1. **Valid Product:**
   - ✅ Load product data from GraphQL
   - ✅ Apply data bindings to blocks
   - ✅ Render page with product information
   - ✅ SEO meta tags from product data

2. **Invalid Product:**
   - ❌ Show "Product not found" page
   - ❌ Suggest alternative products
   - ❌ Link to category or homepage

3. **Loading State:**
   - ⏳ Show loading spinner
   - ⏳ "Loading product..." message

---

## Performance Tips

### 1. Use Static Generation
```typescript
// Generate static pages for popular products
export async function generateStaticParams() {
  const products = await getPopularProducts(100);
  return products.map(p => ({ slug: p.slug }));
}

export const revalidate = 3600; // Revalidate every hour
```

### 2. Optimize Images
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={productImage}
  alt={productName}
  width={600}
  height={400}
  priority
/>
```

### 3. Cache GraphQL Queries
```typescript
const { data } = useQuery(GET_PRODUCT, {
  variables: { slug },
  fetchPolicy: 'cache-first',
  nextFetchPolicy: 'cache-and-network',
});
```

---

## Troubleshooting

### Issue: Data not showing
**Solution:** Check data bindings match your GraphQL schema
```typescript
// Wrong:
sourceField: "productName"  // ❌ Field doesn't exist

// Correct:
sourceField: "name"  // ✅ Matches GraphQL schema
```

### Issue: Images not loading
**Solution:** Verify image paths and use absolute URLs
```typescript
// Wrong:
images[0].url → "/uploads/image.jpg"  // ❌ Relative path

// Correct:
images[0].url → "https://cdn.example.com/uploads/image.jpg"  // ✅ Absolute URL
```

### Issue: Transform not working
**Solution:** Check transform function name spelling
```typescript
// Wrong:
transform: "formatCurency"  // ❌ Typo

// Correct:
transform: "formatCurrency"  // ✅ Correct spelling
```

---

**Happy Building! 🚀**
