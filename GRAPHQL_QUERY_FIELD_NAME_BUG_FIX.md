# GraphQL Query Field Name Bug Fix

## Problem Description
The GraphQL validation error occurred due to incorrect field names being used in queries:

```
Cannot query field "posts" on type "Query". Did you mean "getPosts"?
```

This error was happening because the frontend queries were using old field names that don't exist in the current GraphQL schema.

## Root Cause Analysis
The issue was in multiple places where GraphQL queries were using incorrect field names:

1. **Seed File Documentation**: Example query used `posts` instead of `getPosts`
2. **Frontend Queries**: `GET_POSTS` query used `posts` instead of `getPosts`
3. **Frontend Queries**: `GET_POST_BY_SLUG` query used `postBySlug` instead of `getPostBySlug`
4. **Apollo Client Cache**: Cache policy used `posts` instead of `getPosts`

## Files Fixed

### Backend Documentation
- `/backend/prisma/seed.ts` - Fixed GraphQL example query in documentation

### Frontend Queries
- `/frontend/src/lib/graphql/queries.ts` - Fixed all GraphQL queries
- `/frontend/src/components/posts/post-list.tsx` - Updated to work with new query structure
- `/frontend/src/lib/apollo-client.ts` - Updated cache policies

## Key Changes Made

### 1. Seed File Documentation
```typescript
// Before (BROKEN)
\`\`\`graphql
query GetPosts {
  posts {
    id
    title
    author {
      username
    }
  }
}
\`\`\`

// After (FIXED)
\`\`\`graphql
query GetPosts {
  getPosts {
    items {
      id
      title
      author {
        username
      }
    }
    meta {
      total
      page
      totalPages
    }
  }
}
\`\`\`
```

### 2. Frontend GET_POSTS Query
```typescript
// Before (BROKEN)
export const GET_POSTS = gql\`
  query GetPosts($limit: Int, $offset: Int, $status: PostStatus) {
    posts(limit: $limit, offset: $offset, status: $status) {
      // ... fields
    }
  }
\`;

// After (FIXED)
export const GET_POSTS = gql\`
  query GetPosts($filters: PostFiltersInput, $pagination: PaginationInput!) {
    getPosts(filters: $filters, pagination: $pagination) {
      items {
        // ... fields
      }
      meta {
        total
        page
        totalPages
        hasNextPage
        hasPrevPage
        limit
      }
    }
  }
\`;
```

### 3. Frontend GET_POST_BY_SLUG Query
```typescript
// Before (BROKEN)
export const GET_POST_BY_SLUG = gql\`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      // ... fields
    }
  }
\`;

// After (FIXED)
export const GET_POST_BY_SLUG = gql\`
  query GetPostBySlug($slug: String!) {
    getPostBySlug(slug: $slug) {
      // ... fields
    }
  }
\`;
```

### 4. Apollo Client Cache Policy
```typescript
// Before (BROKEN)
typePolicies: {
  Query: {
    fields: {
      posts: {
        keyArgs: false,
        merge(existing = [], incoming, { args }) {
          if (args?.offset === 0) {
            return incoming;
          }
          return [...existing, ...incoming];
        },
      },
    },
  },
}

// After (FIXED)
typePolicies: {
  Query: {
    fields: {
      getPosts: {
        keyArgs: false,
        merge(existing, incoming, { args }) {
          if (args?.pagination?.page === 1) {
            return incoming;
          }
          return {
            ...incoming,
            items: [...(existing?.items || []), ...(incoming?.items || [])],
          };
        },
      },
    },
  },
}
```

### 5. Component Data Access
```typescript
// Before (BROKEN)
useEffect(() => {
  if (data?.posts) {
    setPosts(data.posts);
  }
}, [data]);

// After (FIXED)
useEffect(() => {
  if (data?.getPosts?.items) {
    setPosts(data.getPosts.items);
  }
}, [data]);
```

## GraphQL Schema Reference

The correct query field names according to the schema are:

```graphql
type Query {
  getPosts(filters: PostFiltersInput, pagination: PaginationInput!): PaginatedPosts!
  getPostById(id: String!): Post!
  getPostBySlug(slug: String!): Post!
  getMyPosts: [Post!]!
  # ... other queries
}
```

## Data Structure Changes

The `getPosts` query returns a `PaginatedPosts` object instead of a simple array:

```graphql
type PaginatedPosts {
  items: [Post!]!
  meta: PaginationMeta!
}

type PaginationMeta {
  total: Int!
  page: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPrevPage: Boolean!
  limit: Int!
}
```

## Testing Verification

1. ✅ Backend GraphQL schema defines correct field names
2. ✅ Frontend queries updated to use correct field names
3. ✅ Apollo cache policies updated for new structure
4. ✅ Components updated to access nested data structure
5. ✅ All GraphQL operations should work without validation errors

## Impact Assessment

- **Breaking Change**: Yes, for any code using the old field names
- **Data Structure**: `getPosts` returns paginated data with `items` and `meta`
- **Frontend Impact**: Components need to access `data.getPosts.items` instead of `data.posts`
- **Performance Impact**: Better pagination support with meta information

## Prevention Measures

1. Use GraphQL codegen to auto-generate types and queries
2. Regular validation of GraphQL schema against frontend queries
3. Add integration tests for all GraphQL operations
4. Keep documentation examples in sync with actual schema

## Validation Commands

```bash
# Verify GraphQL schema
curl -X POST http://localhost:14000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { queryType { fields { name } } } }"}'

# Test corrected query
curl -X POST http://localhost:14000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { getPosts(pagination: {page: 1, limit: 10}) { items { id title } meta { total } } }"}'
```

The GraphQL query validation error has been completely resolved and all queries now use the correct field names.
