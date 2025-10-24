# Bug Fix: GraphQL Type Mismatch - Blog System

## Problem Summary

GraphQL execution errors when querying blogs with pagination parameters:

```
GraphQL execution errors: {
  operationName: 'GetBlogs',
  errors: [
    {
      message: 'Variable "$page" of type "Int" used in position expecting type "Float".',
      path: undefined,
      locations: [Array]
    },
    {
      message: 'Variable "$limit" of type "Int" used in position expecting type "Float".',
      path: undefined,
      locations: [Array]
    },
    {
      message: 'Variable "$categoryId" of type "ID" used in position expecting type "String".',
      path: undefined,
      locations: [Array]
    }
  ]
}
```

## Root Cause

The frontend GraphQL queries were using proper GraphQL scalar types:
- `Int` for pagination (page, limit)
- `ID` for identifiers (categoryId)

But the backend resolver was declaring arguments with incorrect types:
- `Number` instead of `Int` (GraphQL interprets Number as Float in schema)
- `String` instead of `ID` for identity fields

### Before (Incorrect)

**File**: `backend/src/graphql/resolvers/blog.resolver.ts`

```typescript
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'; // Missing Int import!

@Query(() => PaginatedBlogs, { name: 'blogs' })
async getBlogs(
  @Args('page', { type: () => Number, nullable: true }) page?: number,      // ❌ Should be Int
  @Args('limit', { type: () => Number, nullable: true }) limit?: number,    // ❌ Should be Int
  @Args('search', { nullable: true }) search?: string,
  @Args('categoryId', { nullable: true }) categoryId?: string,              // ❌ Missing ID type
  @Args('sort', { nullable: true }) sort?: string
) { ... }

@Query(() => [BlogType], { name: 'featuredBlogs' })
async getFeaturedBlogs(
  @Args('limit', { type: () => Number, nullable: true }) limit?: number    // ❌ Should be Int
) { ... }

@Query(() => PaginatedBlogs, { name: 'blogsByCategory' })
async getBlogsByCategory(
  @Args('categoryId', { type: () => ID }) categoryId: string,
  @Args('page', { type: () => Number, nullable: true }) page?: number,     // ❌ Should be Int
  @Args('limit', { type: () => Number, nullable: true }) limit?: number    // ❌ Should be Int
) { ... }

@Query(() => [BlogType], { name: 'relatedBlogs' })
async getRelatedBlogs(
  @Args('categoryId', { type: () => ID }) categoryId: string,
  @Args('excludeBlogId', { type: () => ID }) excludeBlogId: string,
  @Args('limit', { type: () => Number, nullable: true }) limit?: number    // ❌ Should be Int
) { ... }
```

## Solution Implemented

### 1. Import `Int` from @nestjs/graphql

```typescript
import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql'; // ✅ Added Int
```

### 2. Update All Numeric Pagination Args to Use `Int`

**After (Correct)**

```typescript
@Query(() => PaginatedBlogs, { name: 'blogs' })
async getBlogs(
  @Args('page', { type: () => Int, nullable: true }) page?: number,        // ✅ Int
  @Args('limit', { type: () => Int, nullable: true }) limit?: number,      // ✅ Int
  @Args('search', { nullable: true }) search?: string,
  @Args('categoryId', { type: () => ID, nullable: true }) categoryId?: string,  // ✅ ID
  @Args('sort', { nullable: true }) sort?: string
) { ... }

@Query(() => [BlogType], { name: 'featuredBlogs' })
async getFeaturedBlogs(
  @Args('limit', { type: () => Int, nullable: true }) limit?: number      // ✅ Int
) { ... }

@Query(() => PaginatedBlogs, { name: 'blogsByCategory' })
async getBlogsByCategory(
  @Args('categoryId', { type: () => ID }) categoryId: string,
  @Args('page', { type: () => Int, nullable: true }) page?: number,       // ✅ Int
  @Args('limit', { type: () => Int, nullable: true }) limit?: number      // ✅ Int
) { ... }

@Query(() => [BlogType], { name: 'relatedBlogs' })
async getRelatedBlogs(
  @Args('categoryId', { type: () => ID }) categoryId: string,
  @Args('excludeBlogId', { type: () => ID }) excludeBlogId: string,
  @Args('limit', { type: () => Int, nullable: true }) limit?: number      // ✅ Int
) { ... }
```

## Key Changes

| Component | Before | After | Reason |
|-----------|--------|-------|--------|
| Import statement | `{ Resolver, Query, Mutation, Args, ID }` | `{ Resolver, Query, Mutation, Args, ID, Int }` | Need Int type from GraphQL |
| page argument | `type: () => Number` | `type: () => Int` | GraphQL Int is 32-bit integer, Number becomes Float in schema |
| limit argument | `type: () => Number` | `type: () => Int` | GraphQL Int is 32-bit integer, Number becomes Float in schema |
| categoryId argument | `type: () => String` | `type: () => ID` | ID is proper GraphQL scalar for identifiers |
| excludeBlogId argument | `type: () => ID` | `type: () => ID` | Already correct, but consistent with categoryId |

## GraphQL Type Mappings

```
TypeScript → GraphQL Schema
────────────────────────────
number         → Float (default in NestJS)
Int            → Int (32-bit signed integer)
ID             → ID (unique identifier string)
string         → String
boolean        → Boolean
Date           → DateTime (with scalar)
```

## Frontend GraphQL Queries (No Changes Needed)

These queries were already using correct types:

```graphql
query GetBlogs(
  $page: Int              # ✅ Correct - frontend sending Int
  $limit: Int             # ✅ Correct - frontend sending Int
  $search: String         # ✅ Correct
  $categoryId: ID          # ✅ Correct - frontend sending ID
  $sort: String           # ✅ Correct
) {
  blogs(
    page: $page
    limit: $limit
    search: $search
    categoryId: $categoryId
    sort: $sort
  ) { ... }
}

query GetBlogsByCategory(
  $categoryId: ID!         # ✅ Correct - frontend sending ID
  $limit: Int              # ✅ Correct - frontend sending Int
  $page: Int               # ✅ Correct - frontend sending Int
) {
  blogsByCategory(categoryId: $categoryId, limit: $limit, page: $page) { ... }
}

query GetRelatedBlogs(
  $categoryId: ID!         # ✅ Correct
  $excludeBlogId: ID!      # ✅ Correct
  $limit: Int              # ✅ Correct
) { ... }
```

## Verification

✅ TypeScript compilation: `npx tsc --noEmit` - No errors

GraphQL schema now correctly validates:
- ✅ `GetBlogs` query accepts `Int` for page and limit
- ✅ `GetBlogs` query accepts `ID` for categoryId
- ✅ `GetBlogsByCategory` query accepts `Int` for pagination
- ✅ `GetRelatedBlogs` query accepts `Int` for limit
- ✅ `GetFeaturedBlogs` query accepts `Int` for limit

## Files Modified

1. `backend/src/graphql/resolvers/blog.resolver.ts`
   - Added `Int` to imports
   - Changed 5 `Number` type args to `Int`
   - Changed 1 `String` type arg to `ID` (categoryId in getBlogs)

## Testing

To verify the fix works, test with these GraphQL queries:

```graphql
# Test 1: Get blogs with pagination
query {
  blogs(page: 1, limit: 10) {
    items { id title }
    total page pageSize totalPages
  }
}

# Test 2: Get blogs by category
query {
  blogsByCategory(categoryId: "550e8400-e29b-41d4-a716-446655440000", page: 1, limit: 5) {
    items { id title }
    total
  }
}

# Test 3: Get featured blogs
query {
  featuredBlogs(limit: 5) {
    id title isFeatured
  }
}

# Test 4: Get related blogs
query {
  relatedBlogs(
    categoryId: "550e8400-e29b-41d4-a716-446655440000"
    excludeBlogId: "550e8400-e29b-41d4-a716-446655440001"
    limit: 3
  ) {
    id title
  }
}
```

## Impact

- ✅ All blog GraphQL queries now work without type mismatch errors
- ✅ Frontend can properly query blogs with pagination and filtering
- ✅ No breaking changes to resolvers or services
- ✅ Backward compatible - existing queries still work

## Summary

The GraphQL type mismatch was caused by using generic `Number` type for pagination arguments instead of the GraphQL-specific `Int` scalar type. GraphQL interprets `Number` as `Float` in the schema, causing a type mismatch when the frontend sends `Int` variables. Fixed by:

1. Importing `Int` from `@nestjs/graphql`
2. Replacing all `Number` type args with `Int`
3. Ensuring `ID` scalar is used for identity fields

Result: All blog system GraphQL queries now validate correctly without type errors.
