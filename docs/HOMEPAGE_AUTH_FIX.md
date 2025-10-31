# Homepage Authentication Error Fix

## 📋 Problem Description

When accessing the homepage (or any public page), users encountered authentication errors in the backend logs:

```
[Nest] WARN [JwtAuthGuard] GraphQL - No token provided
GraphQL execution errors: {
  operationName: 'FindMany',
  errors: [{ message: 'Authentication token is required' }]
}
```

### Root Cause

The `WebsiteHeader` component (used in the website layout) was calling `useFindMany('menu')` to load navigation menus. This hook uses the universal `findMany` GraphQL query which requires authentication via `@UseGuards(JwtAuthGuard)`.

Since the header is rendered on all public pages (including the homepage), unauthenticated visitors triggered authentication errors every time they accessed a page.

**Impact:**
- ❌ Backend logs filled with authentication warnings
- ❌ Poor developer experience (error noise)
- ❌ Potential performance overhead from failed auth checks
- ✅ Menu still displayed (errors suppressed in frontend)

---

## 🔧 Solution Implemented

### Approach: Create Public Menu Resolver

Instead of modifying the protected `findMany` resolver, we created a dedicated public resolver specifically for menu queries that don't require authentication.

**Why this approach?**
- ✅ Keeps security model intact (findMany still protected)
- ✅ Explicit public API for menus
- ✅ Better separation of concerns
- ✅ No authentication overhead for public menu queries
- ✅ Frontend uses dedicated public endpoint

---

## 📁 Files Changed

### Backend

#### 1. **New File: `backend/src/graphql/resolvers/menu-public.resolver.ts`**

Created a new resolver with two public queries (no authentication required):

```typescript
@Resolver()
export class MenuPublicResolver {
  /**
   * Get Public Menus
   * No authentication required
   */
  @Query(() => [GraphQLJSON], { name: 'publicMenus' })
  async publicMenus(
    @Args('type', { nullable: true }) type?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('isVisible', { nullable: true }) isVisible?: boolean,
    @Args('orderBy', { nullable: true }) orderBy?: any,
    @Args('includeChildren', { defaultValue: true }) includeChildren?: boolean,
    // ... more args
  ): Promise<any[]> {
    // Fetches menu items with nested children (up to 3 levels)
    return await this.prisma.menu.findMany({ ... });
  }

  /**
   * Get Public Menu by ID
   * No authentication required
   */
  @Query(() => GraphQLJSON, { name: 'publicMenuById', nullable: true })
  async publicMenuById(
    @Args('id') id: string,
    @Args('includeChildren', { defaultValue: true }) includeChildren?: boolean,
  ): Promise<any | null> {
    return await this.prisma.menu.findUnique({ ... });
  }
}
```

**Key Features:**
- ✅ No `@UseGuards(JwtAuthGuard)` decorator
- ✅ Supports filtering by type (HEADER, FOOTER, etc.)
- ✅ Supports active/visible filters
- ✅ Nested children loading (up to 3 levels)
- ✅ Proper Prisma types with `SortOrder.asc`
- ✅ Logger for debugging

#### 2. **Modified: `backend/src/graphql/graphql.module.ts`**

Registered the new resolver in the GraphQL module:

```typescript
import { MenuPublicResolver } from './resolvers/menu-public.resolver';

@Module({
  providers: [
    // ... existing resolvers
    MenuPublicResolver, // ✅ Added
  ],
})
```

### Frontend

#### 3. **Modified: `frontend/src/graphql/menu.queries.ts`**

Added new public menu queries:

```typescript
/**
 * Get Public Menus (No authentication required)
 */
export const GET_PUBLIC_MENUS = gql`
  query GetPublicMenus(
    $type: String
    $isActive: Boolean
    $isVisible: Boolean
    $orderBy: JSON
    $includeChildren: Boolean
  ) {
    publicMenus(
      type: $type
      isActive: $isActive
      isVisible: $isVisible
      orderBy: $orderBy
      includeChildren: $includeChildren
    )
  }
`;

export const GET_PUBLIC_MENU_BY_ID = gql`
  query GetPublicMenuById($id: String!, $includeChildren: Boolean) {
    publicMenuById(id: $id, includeChildren: $includeChildren)
  }
`;
```

#### 4. **Modified: `frontend/src/components/layout/website-header.tsx`**

Replaced `useFindMany` with `useQuery` + `GET_PUBLIC_MENUS`:

**Before:**
```typescript
const { data: headerMenus = [], loading, error } = useFindMany('menu', {
  where: { type: 'HEADER', isActive: true, isVisible: true },
  // ... includes
}, {
  fetchPolicy: 'network-only',
});
```

**After:**
```typescript
const { data, loading, error } = useQuery(GET_PUBLIC_MENUS, {
  variables: {
    type: 'HEADER',
    isActive: true,
    isVisible: true,
    orderBy: { order: 'asc' },
    includeChildren: true,
  },
  fetchPolicy: 'network-only',
});

const headerMenus = data?.publicMenus || [];
```

**Changes:**
- ✅ Now uses `GET_PUBLIC_MENUS` query (no auth required)
- ✅ Simplified variables structure
- ✅ Backend handles nested children loading
- ✅ No authentication errors logged
- ✅ Cleaner error handling

---

## 🧪 Testing

### Test Case 1: Homepage Access (Unauthenticated)

**Steps:**
1. Clear cookies/logout
2. Navigate to `http://localhost:3000/`
3. Check browser console
4. Check backend logs

**Expected Result:**
- ✅ Homepage loads successfully
- ✅ Header menu items displayed
- ✅ **No authentication errors in backend logs**
- ✅ **No GraphQL errors in browser console**

### Test Case 2: Menu Items Display

**Steps:**
1. Access homepage
2. Verify header navigation menu appears
3. Test dropdown menus (if any)
4. Click menu links

**Expected Result:**
- ✅ All active/visible menu items load
- ✅ Nested menus (children) work correctly
- ✅ Menu navigation functions properly

### Test Case 3: Backend Performance

**Steps:**
1. Access homepage 10 times
2. Monitor backend logs
3. Check for authentication overhead

**Expected Result:**
- ✅ No JWT verification attempts for menu queries
- ✅ No "No token provided" warnings
- ✅ Fast menu loading (no auth check overhead)

### Test Case 4: Protected Routes Still Work

**Steps:**
1. Login as admin
2. Access `/admin/menus` (or similar protected page)
3. Verify protected menu mutations work

**Expected Result:**
- ✅ Protected routes still require authentication
- ✅ Menu CRUD operations still protected
- ✅ Only **public queries** bypass authentication

---

## 🔄 Migration Guide

If you have other components using `useFindMany('menu')` for public menu queries, migrate them:

### Before (Protected Query):
```typescript
import { useFindMany } from '@/hooks/useDynamicGraphQL';

const { data: menus } = useFindMany('menu', {
  where: { type: 'HEADER', isActive: true }
});
```

### After (Public Query):
```typescript
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_MENUS } from '@/graphql/menu.queries';

const { data } = useQuery(GET_PUBLIC_MENUS, {
  variables: {
    type: 'HEADER',
    isActive: true,
    includeChildren: true,
  }
});
const menus = data?.publicMenus || [];
```

**When to use which:**
- ✅ Use `GET_PUBLIC_MENUS` for: Website header, footer, public navigation
- ✅ Use `useFindMany('menu')` for: Admin menu management, protected pages

---

## 📊 Results

### Before Fix:
```
[Nest] 418996 - 10/31/2025, 3:14:49 PM WARN [JwtAuthGuard] GraphQL - No token provided
[Nest] 418996 - 10/31/2025, 3:14:49 PM WARN [JwtAuthGuard] GraphQL - No token provided
[Nest] 418996 - 10/31/2025, 3:14:49 PM WARN [JwtAuthGuard] GraphQL - No token provided
// ... repeated on every page load
```

### After Fix:
```
[Nest] 418996 - 10/31/2025, 3:20:15 PM LOG [MenuPublicResolver] 🌐 Public Menu Resolver ready
[Nest] 418996 - 10/31/2025, 3:20:20 PM DEBUG [MenuPublicResolver] ✅ Fetched 5 public menus (type: HEADER)
// Clean logs, no authentication errors! ✅
```

---

## 🎯 Key Takeaways

1. **Public vs Protected Queries:**
   - Public pages should use dedicated public GraphQL queries
   - Don't use protected universal queries for public components

2. **Security Model:**
   - Universal `findMany` resolver remains protected
   - Menu model has dedicated public resolver for read-only access
   - Write operations (create/update/delete) still require authentication

3. **Performance:**
   - No JWT verification overhead for public menu queries
   - Reduced backend log noise
   - Better separation of public vs protected APIs

4. **Developer Experience:**
   - Clear intent: `publicMenus` vs `findMany`
   - Cleaner logs (no error noise)
   - Easier debugging

---

## 📚 Related Documentation

- **LMS Authentication Fix:** `LMS_AUTHENTICATION_FIX.md` - Fixed protected LMS pages
- **Homepage Redirect Logic:** `HOMEPAGE_REDIRECT_LOGIC_UPDATE.md` - Custom homepage URL feature
- **Universal Dynamic Resolver:** `backend/src/graphql/resolvers/universal-dynamic.resolver.ts` - Protected dynamic queries

---

## ✅ Checklist

- [x] Created `MenuPublicResolver` with public menu queries
- [x] Registered resolver in GraphQL module
- [x] Added `GET_PUBLIC_MENUS` query to frontend
- [x] Updated `WebsiteHeader` to use public query
- [x] Verified no TypeScript errors
- [x] Tested homepage loads without auth errors
- [x] Documented solution and migration guide
- [x] Verified protected routes still work

---

**Author:** Senior Full-Stack Engineer  
**Date:** October 31, 2025  
**Status:** ✅ COMPLETED
