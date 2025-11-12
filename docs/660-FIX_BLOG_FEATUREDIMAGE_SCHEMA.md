# Fix Blog GraphQL Schema Mismatch - featuredImage → thumbnailUrl

## Error
```
GraphQL execution errors: {
  operationName: 'GetBlogById',
  errors: [
    {
      message: 'Cannot query field "featuredImage" on type "BlogType".',
      path: undefined,
      locations: [Array]
    }
  ]
}
```

## Root Cause
Frontend was querying `featuredImage` field but backend schema defines it as `thumbnailUrl`.

**Backend Schema (BlogType):**
```graphql
type BlogType {
  ...
  thumbnailUrl: String
  ...
}
```

**Backend Input:**
```graphql
input UpdateBlogInput {
  ...
  thumbnailUrl: String
  ...
}
```

## Fix Applied

### File: `frontend/src/app/admin/blog/[id]/edit/page.tsx`

#### 1. Updated GraphQL Query
**Before:**
```graphql
query GetBlogById($id: ID!) {
  blog(id: $id) {
    ...
    featuredImage  # ❌ Field không tồn tại
    ...
  }
}
```

**After:**
```graphql
query GetBlogById($id: ID!) {
  blog(id: $id) {
    ...
    thumbnailUrl  # ✅ Đúng field name
    ...
  }
}
```

#### 2. Updated Data Mapping
**Before:**
```typescript
onCompleted: (data) => {
  if (data?.blog) {
    setFormData({
      ...
      featuredImage: data.blog.featuredImage || '',  // ❌
      ...
    });
  }
}
```

**After:**
```typescript
onCompleted: (data) => {
  if (data?.blog) {
    setFormData({
      ...
      featuredImage: data.blog.thumbnailUrl || '',  // ✅
      ...
    });
  }
}
```

#### 3. Updated Mutation Input
**Before:**
```typescript
await updateBlog({ 
  variables: { 
    input: {
      ...
      featuredImage: formData.featuredImage || undefined,  // ❌
      ...
    }
  } 
});
```

**After:**
```typescript
await updateBlog({ 
  variables: { 
    input: {
      ...
      thumbnailUrl: formData.featuredImage || undefined,  // ✅
      ...
    }
  } 
});
```

## Schema Alignment

| Component | Field Name | Type | Status |
|-----------|------------|------|--------|
| Backend BlogType | `thumbnailUrl` | String | ✅ Định nghĩa |
| Backend UpdateBlogInput | `thumbnailUrl` | String | ✅ Định nghĩa |
| Frontend Query | `thumbnailUrl` | String | ✅ Fixed |
| Frontend Mutation | `thumbnailUrl` | String | ✅ Fixed |
| Frontend Internal State | `featuredImage` | String | ℹ️ Internal only |

## Note
- Frontend state vẫn sử dụng tên `featuredImage` cho consistency với UI labels
- Chỉ cần map sang `thumbnailUrl` khi communicate với backend (query response & mutation input)
- Pattern tương tự đã được fix trong Product schema (thumbnail vs featuredImage)

## Testing
- ✅ Query blog by ID không còn error
- ✅ Edit page load đúng data
- ✅ Update blog thành công
- ✅ Image preview hiển thị đúng

## Related Fixes
- Tương tự với Product schema: `product.thumbnail` (không phải `featuredImage`)
- Tương tự với Cart schema: đã fix trong `FIX_CART_GRAPHQL_SCHEMA_MISMATCH.md`
