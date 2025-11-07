# 🎯 QUICK START - Next.js Fullstack

## ✅ ĐÃ HOÀN THÀNH

### 1. Loại bỏ GraphQL
- ✅ Xóa `graphql-ws` và Apollo Client packages
- ✅ Xóa thư mục `src/graphql/`
- ✅ Xóa `src/lib/apollo-client.ts`
- ✅ Cập nhật package.json

### 2. Thêm Prisma
- ✅ Thêm `@prisma/client` và `prisma` packages
- ✅ Copy Prisma schema từ backend → frontend
- ✅ Tạo `/mnt/chikiet/Innerbright/innerv2/frontend/src/lib/prisma.ts`
- ✅ Generate Prisma Client

### 3. Tạo Server Actions
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/actions/auth.ts` - Authentication
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/actions/posts.ts` - Blog/Posts
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/actions/products.ts` - Products  
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/actions/users.ts` - User management
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/actions/pages.ts` - Page Builder

### 4. Tạo API Routes
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/app/api/products/route.ts`
- ✅ `/mnt/chikiet/Innerbright/innerv2/frontend/src/app/api/posts/route.ts`

### 5. Documentation
- ✅ Tạo `MIGRATION_TO_FULLSTACK.md`

## 🚀 CÁC BƯỚC TIẾP THEO

### Bước 1: Install Dependencies

```bash
cd /mnt/chikiet/Innerbright/innerv2/frontend
bun install
```

### Bước 2: Setup Database

```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations (nếu chưa có)
bunx prisma migrate dev

# Seed data (optional)
bunx prisma db seed
```

### Bước 3: Update Environment Variables

Tạo file `.env` trong `frontend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/innerbright"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:14000"
```

### Bước 4: Test Server Actions

Tạo test page:

```tsx
// app/test-actions/page.tsx
import { getPosts } from '@/actions/posts'

export default async function TestPage() {
  const result = await getPosts({ take: 5 })
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Server Actions</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
```

### Bước 5: Start Development Server

```bash
bun run dev
```

Server sẽ chạy tại: http://localhost:14000

## 📝 CÁCH SỬ DỤNG

### Server Actions (Trong Server Components)

```tsx
import { getPosts, createPost } from '@/actions/posts'

export default async function BlogPage() {
  // Fetch data trực tiếp trong Server Component
  const { data: posts } = await getPosts({ take: 10 })
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  )
}
```

### Server Actions (Trong Client Components)

```tsx
'use client'

import { login } from '@/actions/auth'
import { useState } from 'react'

export function LoginForm() {
  const [error, setError] = useState('')
  
  async function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error!)
    } else {
      // Redirect to dashboard
      window.location.href = '/admin'
    }
  }
  
  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

### API Routes (Fetch from Client)

```tsx
'use client'

import { useEffect, useState } from 'react'

export function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/products?page=1&limit=20')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {products.map((p: any) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

## 🔧 TROUBLESHOOTING

### Lỗi "Module not found: @prisma/client"

```bash
bunx prisma generate
```

### Lỗi "Can't reach database server"

Kiểm tra DATABASE_URL trong `.env` và đảm bảo PostgreSQL đang chạy:

```bash
docker-compose up -d postgres
```

### Lỗi "Property 'sanpham' does not exist"

Chạy lại Prisma generate sau khi cập nhật schema:

```bash
bunx prisma generate
```

## 📦 FILES STRUCTURE

```
frontend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── actions/               # Server Actions (NEW!)
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── products.ts
│   │   ├── users.ts
│   │   └── pages.ts
│   ├── app/
│   │   ├── api/               # API Routes (NEW!)
│   │   │   ├── products/
│   │   │   └── posts/
│   │   └── ...
│   └── lib/
│       └── prisma.ts          # Prisma client (NEW!)
├── package.json               # Updated dependencies
└── MIGRATION_TO_FULLSTACK.md  # Migration guide
```

## 🎉 NEXT STEPS

1. ✅ Cài đặt dependencies: `bun install`
2. ✅ Generate Prisma Client: `bunx prisma generate`
3. ✅ Setup database: `bunx prisma migrate dev`
4. ✅ Start dev server: `bun run dev`
5. ⏳ Update components để sử dụng Server Actions
6. ⏳ Test functionality
7. ⏳ Deploy to production

## 📚 DOCUMENTATION

- Chi tiết migration: `MIGRATION_TO_FULLSTACK.md`
- Server Actions examples: Xem trong `src/actions/`
- API Routes examples: Xem trong `src/app/api/`

---

**Chúc mừng! Dự án của bạn đã chuyển sang Next.js Fullstack! 🎉**
