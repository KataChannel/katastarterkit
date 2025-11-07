# 🚀 Migration from GraphQL to Next.js Fullstack

## Overview

Dự án đã được chuyển đổi từ architecture GraphQL + Apollo Client sang **Next.js Fullstack** với Server Actions và API Routes.

## Thay đổi chính

### ❌ Removed
- Apollo Client
- GraphQL client
- graphql-ws
- Tất cả GraphQL queries/mutations/subscriptions
- Apollo Provider và configs

### ✅ Added  
- **Prisma Client** trong Next.js
- **Server Actions** (thay cho GraphQL mutations)
- **API Routes** (thay cho GraphQL queries)
- Server-side data fetching
- Edge-optimized database queries

## Architecture mới

```
frontend/
├── prisma/              # Prisma schema
│   └── schema.prisma
├── src/
│   ├── actions/         # Server Actions (thay GraphQL mutations)
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── products.ts
│   │   ├── users.ts
│   │   └── pages.ts
│   ├── app/
│   │   └── api/         # API Routes (thay GraphQL queries)
│   └── lib/
│       └── prisma.ts    # Prisma client singleton
```

## Server Actions

### Authentication

```typescript
import { login, register, logout } from '@/actions/auth'

// Login
const result = await login(email, password)

// Register
const result = await register({
  email,
  password,
  username,
  firstName,
  lastName
})

// Logout
await logout()
```

### Posts/Blog

```typescript
import { getPosts, createPost, updatePost, deletePost } from '@/actions/posts'

// Get posts
const { data: posts, total } = await getPosts({
  take: 10,
  skip: 0,
  where: { status: 'PUBLISHED' }
})

// Create post
const result = await createPost({
  title: 'My Post',
  content: '...',
  slug: 'my-post',
  author: { connect: { id: userId } }
})

// Update post
await updatePost(postId, { title: 'Updated Title' })

// Delete post (soft delete)
await deletePost(postId)
```

### Products

```typescript
import { getProducts, getProductBySlug, createProduct } from '@/actions/products'

// Get products
const { data: products } = await getProducts({
  take: 20,
  where: { categoryId: 'category-id' }
})

// Get by slug
const { data: product } = await getProductBySlug('product-slug')

// Create product
await createProduct({
  name: 'Product Name',
  price: 99.99,
  slug: 'product-name'
})
```

### Users

```typescript
import { getUsers, createUser, updateUser } from '@/actions/users'

// Get users
const { data: users } = await getUsers({ take: 20 })

// Create user
await createUser({
  username: 'john',
  email: 'john@example.com',
  password: 'password123'
})
```

### Pages (Page Builder)

```typescript
import { getPages, getPageBySlug, createPage } from '@/actions/pages'

// Get pages
const { data: pages } = await getPages()

// Get by slug
const { data: page } = await getPageBySlug('about-us')

// Create page
await createPage({
  title: 'About Us',
  slug: 'about-us',
  content: '...',
  author: { connect: { id: userId } }
})
```

## API Routes (Optional)

Nếu cần REST API endpoints:

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { getPosts } from '@/actions/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const take = parseInt(searchParams.get('take') || '10')
  const skip = parseInt(searchParams.get('skip') || '0')
  
  const result = await getPosts({ take, skip })
  
  return NextResponse.json(result)
}
```

## Component Usage

### Server Components (Recommended)

```tsx
// app/san-pham/page.tsx
import { getProducts } from '@/actions/products'

export default async function ProductsPage() {
  const { data: products } = await getProducts({ take: 20 })
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Client Components with Server Actions

```tsx
'use client'

import { createPost } from '@/actions/posts'
import { useState } from 'react'

export function CreatePostForm() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createPost({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      // ...
    })
    setLoading(false)
    
    if (result.success) {
      // Handle success
    }
  }
  
  return (
    <form action={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

### Client Components with fetch (API Routes)

```tsx
'use client'

import { useEffect, useState } from 'react'

export function ProductList() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.data))
  }, [])
  
  return <div>{/* render products */}</div>
}
```

## Database Setup

```bash
# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Seed database
bunx prisma db seed
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key-min-32-characters"
JWT_EXPIRES_IN="7d"
```

## Benefits

✅ **Simpler Architecture**: Không cần GraphQL server riêng  
✅ **Better Performance**: Direct database access, no GraphQL overhead  
✅ **Type Safety**: Prisma types tự động generate  
✅ **Less Dependencies**: Loại bỏ Apollo Client, GraphQL packages  
✅ **Server Actions**: Built-in progressive enhancement  
✅ **Edge Ready**: Có thể deploy lên Edge Runtime  
✅ **Easier Deployment**: Chỉ deploy 1 Next.js app  

## Migration Checklist

- [x] Remove GraphQL dependencies
- [x] Add Prisma to frontend
- [x] Create Prisma client singleton
- [x] Create Server Actions (auth, posts, products, users, pages)
- [x] Remove GraphQL folders
- [x] Update documentation
- [ ] Update components to use Server Actions
- [ ] Test all functionality
- [ ] Update deployment configs

## Support

Nếu gặp vấn đề, kiểm tra:
1. Prisma client đã được generate: `bunx prisma generate`
2. Database migrations đã chạy: `bunx prisma migrate dev`
3. Environment variables đã setup đúng
4. Server Actions chỉ chạy trên server (file có 'use server')
