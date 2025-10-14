# Page Builder - Quick Start Guide

## 🚀 Bắt Đầu Nhanh

### 1. Tạo Page Mới

```typescript
// Frontend: PageBuilder component
import PageBuilder from '@/components/page-builder/PageBuilder';

function App() {
  return <PageBuilder />;
}
```

### 2. Thêm Section Block

Trong UI, click "Add Block" → Chọn "Section"

Hoặc qua GraphQL:
```graphql
mutation {
  addBlock(
    pageId: "your-page-id"
    input: {
      type: SECTION
      content: {
        containerWidth: "lg"
        backgroundColor: "#ffffff"
        padding: { top: 80, bottom: 80 }
      }
      order: 1
    }
  ) {
    id
    type
  }
}
```

### 3. Thêm Grid Inside Section

```graphql
mutation {
  addBlock(
    pageId: "your-page-id"
    input: {
      type: GRID
      parentId: "section-block-id"
      depth: 1
      content: {
        columns: 3
        gap: 20
        responsive: { sm: 1, md: 2, lg: 3 }
      }
      order: 1
    }
  ) {
    id
  }
}
```

### 4. Thêm Cards Inside Grid

```graphql
mutation {
  addBlock(
    pageId: "your-page-id"
    input: {
      type: CARD
      parentId: "grid-block-id"
      depth: 2
      content: {
        title: "Feature 1"
        description: "Amazing feature"
      }
      order: 1
    }
  ) {
    id
  }
}
```

---

## 📋 Block Types Cheat Sheet

### Content Blocks
- `TEXT` - Rich text content
- `IMAGE` - Images
- `HERO` - Hero sections
- `BUTTON` - Call-to-action buttons
- `TEAM` - Team member cards
- `STATS` - Statistics display
- `CONTACT_INFO` - Contact information
- `COMPLETED_TASKS` - Task lists

### Container Blocks (Có thể chứa children)
- `CONTAINER` - Generic flexible container
- `SECTION` - Full-width section với background
- `GRID` - CSS Grid responsive (1-12 columns)
- `FLEX_ROW` - Horizontal flexbox layout
- `FLEX_COLUMN` - Vertical flexbox layout

### Dynamic Block
- `DYNAMIC` - Data-driven block với templates

---

## 🎨 Layout Examples

### Two-Column Layout

```typescript
{
  type: 'FLEX_ROW',
  content: {
    gap: 24,
    justifyContent: 'between'
  },
  children: [
    { type: 'TEXT', content: { content: 'Left' } },
    { type: 'IMAGE', content: { src: '/img.jpg' } }
  ]
}
```

### Three-Column Grid

```typescript
{
  type: 'GRID',
  content: {
    columns: 3,
    gap: 20,
    responsive: { sm: 1, md: 2, lg: 3 }
  },
  children: [
    { type: 'CARD', content: { title: 'Card 1' } },
    { type: 'CARD', content: { title: 'Card 2' } },
    { type: 'CARD', content: { title: 'Card 3' } }
  ]
}
```

### Hero Section

```typescript
{
  type: 'SECTION',
  content: {
    backgroundImage: '/hero.jpg',
    containerWidth: 'lg',
    padding: { top: 100, bottom: 100 }
  },
  children: [
    {
      type: 'CONTAINER',
      content: { alignment: 'center' },
      children: [
        {
          type: 'HERO',
          content: {
            title: 'Welcome',
            subtitle: 'Build amazing pages'
          }
        },
        {
          type: 'BUTTON',
          content: {
            text: 'Get Started',
            href: '/signup'
          }
        }
      ]
    }
  ]
}
```

---

## 🔧 Dynamic Block Examples

### Product List từ API

```typescript
{
  type: 'DYNAMIC',
  config: {
    dataSource: {
      type: 'api',
      endpoint: '/api/products'
    },
    repeater: {
      enabled: true,
      dataPath: 'products',
      itemTemplate: {
        type: 'CARD',
        content: {
          title: '{{name}}',
          price: '{{price}}'
        }
      },
      limit: 12
    }
  }
}
```

### GraphQL Query

```typescript
{
  type: 'DYNAMIC',
  config: {
    dataSource: {
      type: 'graphql',
      endpoint: '/graphql',
      query: `
        query GetPosts {
          posts {
            id
            title
            excerpt
          }
        }
      `
    },
    repeater: {
      enabled: true,
      dataPath: 'data.posts',
      itemTemplate: {
        type: 'CARD',
        content: {
          title: '{{title}}',
          description: '{{excerpt}}'
        }
      }
    }
  }
}
```

### Với Conditional Rendering

```typescript
{
  type: 'DYNAMIC',
  config: {
    dataSource: { type: 'api', endpoint: '/api/products' },
    conditions: [
      {
        field: 'price',
        operator: 'lessThan',
        value: 1000
      },
      {
        field: 'inStock',
        operator: 'equals',
        value: true,
        logic: 'AND'
      }
    ],
    repeater: {
      enabled: true,
      dataPath: 'products'
    }
  }
}
```

---

## 📊 GraphQL Queries

### Get Page với Nested Blocks

```graphql
query GetPage($id: ID!) {
  page(id: $id) {
    id
    title
    slug
    blocks {
      id
      type
      content
      order
      depth
      parentId
      children {
        id
        type
        content
        order
        depth
        children {
          id
          type
          content
        }
      }
    }
  }
}
```

### Create Page với Blocks

```graphql
mutation CreatePage {
  createPage(
    input: {
      title: "Landing Page"
      slug: "landing"
      status: PUBLISHED
    }
  ) {
    id
    title
  }
}
```

### Add Block

```graphql
mutation AddBlock($pageId: ID!, $input: CreatePageBlockInput!) {
  addBlock(pageId: $pageId, input: $input) {
    id
    type
    content
  }
}
```

### Update Block

```graphql
mutation UpdateBlock($id: ID!, $input: UpdatePageBlockInput!) {
  updateBlock(id: $id, input: $input) {
    id
    content
  }
}
```

---

## 🎯 Best Practices

### 1. Structure Organization

```
Page
└─ Section (Hero)
   └─ Container
      ├─ Hero Block
      └─ Button

└─ Section (Features)
   └─ Container
      └─ Grid
         ├─ Card (Feature 1)
         ├─ Card (Feature 2)
         └─ Card (Feature 3)

└─ Section (CTA)
   └─ Container
      ├─ Text
      └─ Button
```

### 2. Responsive Design

Luôn set responsive options cho Grid:
```typescript
{
  type: 'GRID',
  content: {
    columns: 4,
    responsive: {
      sm: 1,   // Mobile: 1 column
      md: 2,   // Tablet: 2 columns
      lg: 4    // Desktop: 4 columns
    }
  }
}
```

### 3. Dynamic Content

Sử dụng Dynamic Block cho data từ API:
```typescript
// ✅ Good
{
  type: 'DYNAMIC',
  config: {
    dataSource: { type: 'api', endpoint: '/api/products' }
  }
}

// ❌ Bad - Hardcode data
{
  type: 'GRID',
  children: [
    { type: 'CARD', content: { title: 'Product 1' } },
    { type: 'CARD', content: { title: 'Product 2' } },
    // ...
  ]
}
```

### 4. Nesting Depth

Giữ nesting depth <= 3-4 levels:
```
✅ Good:
Section → Container → Grid → Card

❌ Too deep:
Section → Container → Grid → Container → Card → Text → Button
```

### 5. Performance

- Use `parentId: null` để query root blocks
- Include children chỉ khi cần
- Limit nested include depth (max 4 levels)

---

## 🐛 Troubleshooting

### Block không hiển thị

1. Check `isVisible: true`
2. Check `parentId` đúng
3. Check `order` value

### Children không render

1. Verify `parentId` matches parent block ID
2. Check `depth` value correct
3. Ensure recursive rendering enabled

### Dynamic Block không fetch data

1. Check endpoint URL correct
2. Verify dataSource type ('api', 'graphql', 'static')
3. Check network tab for errors
4. Verify dataPath matches response structure

---

## 📚 Resources

- Full Documentation: `PAGE_BUILDER_COMPLETE_VIETNAMESE_SUMMARY.md`
- Implementation Details: `PAGE_BUILDER_NESTED_BLOCKS_IMPLEMENTATION.md`
- Type Definitions: `frontend/src/types/page-builder.ts`
- Components: `frontend/src/components/page-builder/blocks/`

---

## 🎉 Happy Building!

Bây giờ bạn có thể:
- ✅ Tạo nested block structures
- ✅ Build responsive layouts
- ✅ Fetch dynamic data
- ✅ Use templates và variables
- ✅ Create complex pages

**Let's build something amazing! 🚀**
