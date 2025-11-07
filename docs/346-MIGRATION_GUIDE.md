# Migration Guide: GraphQL → Next.js Fullstack

## ✅ Đã Hoàn Thành

### 1. Backend Removal
- ✅ Xóa toàn bộ thư mục `backend/`
- ✅ Xóa backend workspace khỏi root `package.json`
- ✅ Cập nhật documentation (README.md, MIGRATION_COMPLETE.md)

### 2. Apollo Client Removal
- ✅ Xóa `@apollo/client` khỏi dependencies
- ✅ Tạo universal stubs: `src/lib/apollo-client-stubs.ts`
- ✅ Thay thế tất cả imports (11 files):
  - `src/components/posts/post-list.tsx`
  - `src/components/team/InviteMemberDialog.tsx`
  - `src/hooks/useDynamicGraphQL.ts`
  - `src/hooks/useHR.ts`
  - `src/hooks/useProjects.ts`
  - `src/hooks/useTodos.ts`
  - `src/lib/apollo-cache.ts`
  - `src/lib/test-graphql.ts`
  - `src/test/setup.ts`
  - `src/utils/customTemplates.ts`
  - `src/utils/customTemplatesDb.ts`

### 3. Server Actions Implementation
- ✅ Tạo `src/actions/products.ts` - Product CRUD operations
- ✅ Migrate `useProducts.ts` sang Server Actions
- ✅ Các Server Actions khác đã có sẵn trong dự án

## 🔄 Đang Thực Hiện

### 4. Hook Migration to Server Actions

#### ✅ Đã Migrate:
- **useProducts.ts** - Hoàn toàn migrate sang Server Actions
  - Queries: getProducts, getProductById, getProductBySlug, searchProducts
  - Mutations: createProduct, updateProduct, deleteProduct
  - Utilities: useProductManagement, useProductFilters

#### ⏳ Cần Migrate:
1. **useAuth.ts** - Authentication hooks
   - Login, Register, Logout
   - Session management
   - Password reset

2. **usePosts.ts** - Blog/Posts hooks
   - Get posts, create, update, delete
   - Comments, likes, shares

3. **useHR.ts** - HR Management
   - Employee profiles
   - Leave requests
   - Attendance

4. **useProjects.ts** - Project Management
   - Projects CRUD
   - Project members
   - Tasks

5. **useTodos.ts** - Todo/Tasks
   - Task CRUD
   - Task assignments
   - Task filters

## 📋 Migration Pattern

### Old Pattern (GraphQL + Apollo Client):
```typescript
import { useQuery, useMutation } from '@apollo/client'
import { GET_ITEMS, CREATE_ITEM } from '@/graphql/queries'

export function useItems() {
  const { data, loading, error } = useQuery(GET_ITEMS)
  const [createItem] = useMutation(CREATE_ITEM)
  
  return {
    items: data?.items || [],
    loading,
    error,
    createItem: (input) => createItem({ variables: { input } })
  }
}
```

### New Pattern (Server Actions):
```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItems, createItem } from '@/actions/items'

export function useItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getItems()
      if (result.success) {
        setItems(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const create = async (data) => {
    try {
      const result = await createItem(data)
      if (result.success) {
        await fetchItems() // Refresh list
        return result.data
      }
      throw new Error(result.error)
    } catch (err) {
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    createItem: create,
    refetch: fetchItems,
  }
}
```

## 📝 Server Action Pattern

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getItems() {
  try {
    const items = await prisma.item.findMany()
    
    return {
      success: true,
      data: items,
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      success: false,
      error: 'Failed to fetch items',
    }
  }
}

export async function createItem(data) {
  try {
    const item = await prisma.item.create({ data })
    
    revalidatePath('/items') // Revalidate cache
    
    return {
      success: true,
      data: item,
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      success: false,
      error: 'Failed to create item',
    }
  }
}
```

## 🎯 Next Steps

### Immediate (Priority 1):
1. **Fix TypeScript Errors** - Sửa các lỗi cú pháp hiện tại
2. **Migrate useAuth** - Critical cho authentication
3. **Migrate usePosts** - Quan trọng cho blog functionality

### Short Term (Priority 2):
4. **Migrate useHR** - HR management
5. **Migrate useProjects** - Project management
6. **Migrate useTodos** - Task management

### Medium Term (Priority 3):
7. **Setup NextAuth.js** - Replace current auth với NextAuth + Prisma
8. **Remove GraphQL Stubs** - Xóa apollo-client-stubs.ts sau khi migrate xong
9. **Remove Old Files** - Xóa các file .old.ts và GraphQL query files

### Long Term (Priority 4):
10. **Add React Query** - Optional caching layer
11. **Optimize Server Actions** - Add proper caching strategies
12. **Write Tests** - Test coverage cho Server Actions
13. **Performance Audit** - Optimize database queries

## 🔍 Testing Checklist

- [ ] Build passes: `bun run build`
- [ ] Type check passes: `bun run type-check`
- [ ] Products CRUD works
- [ ] Authentication works
- [ ] Posts/Blog works
- [ ] File uploads work
- [ ] Search functionality works
- [ ] Admin panel works

## 📚 Resources

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [NextAuth.js](https://next-auth.js.org/)
- [React Hooks Best Practices](https://react.dev/reference/react)

## ⚠️ Important Notes

1. **Stubs are temporary** - apollo-client-stubs.ts chỉ để tránh breaking changes
2. **Console warnings** - Deprecation warnings là có chủ ý
3. **Gradual migration** - Không cần migrate tất cả cùng lúc
4. **Test thoroughly** - Test mỗi hook sau khi migrate
5. **Revalidation** - Nhớ dùng `revalidatePath()` trong Server Actions

## 🎉 Benefits After Migration

- ✅ No GraphQL complexity
- ✅ Type-safe with Prisma
- ✅ Better performance (no client-side GraphQL parsing)
- ✅ Simpler architecture
- ✅ Server-side rendering ready
- ✅ Easier to debug
- ✅ Smaller bundle size
