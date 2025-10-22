# GraphQL Fragment Deduplication Fix

## Problem Statement

The application was showing GraphQL warnings about duplicate fragment names:

```
Warning: fragment with name CategoryBasicFields already exists.
graphql-tag enforces all fragment names across your application to be unique

Warning: fragment with name UserFragment already exists.
graphql-tag enforces all fragment names across your application to be unique
```

## Root Cause

The same GraphQL fragments were defined in multiple files:

### CategoryBasicFields - Defined in 2 files:
1. `src/graphql/category.queries.ts` (line 8)
2. `src/graphql/product.queries.ts` (line 33)

### UserFragment - Defined in 2 files:
1. `src/lib/graphql/user-queries.ts` (line 5)
2. `src/lib/graphql/dynamic-queries.ts` (line 354)

### Other Duplicates Found:
- `PostFragment` - in dynamic-queries.ts
- `CommentFragment` - in dynamic-queries.ts  
- `ProductImageFields` - in product.queries.ts
- `ProductVariantFields` - in product.queries.ts

## Solution

Created a centralized shared fragments file to consolidate all GraphQL fragments and prevent duplication.

### Files Created:
- `src/lib/graphql/shared-fragments.ts` - Central repository for all shared GraphQL fragments

### Files Modified:

#### 1. `src/graphql/category.queries.ts`
- Removed local fragment definitions for `CATEGORY_BASIC_FRAGMENT`, `CATEGORY_WITH_COUNT_FRAGMENT`, `CATEGORY_TREE_FRAGMENT`
- Added imports from shared-fragments.ts
- Re-exports for backward compatibility

#### 2. `src/graphql/product.queries.ts`
- Removed duplicate `CATEGORY_BASIC_FRAGMENT`
- Re-exported `PRODUCT_IMAGE_FRAGMENT` and `PRODUCT_VARIANT_FRAGMENT` from shared
- Kept `PRODUCT_BASIC_FRAGMENT` and `PRODUCT_FULL_FRAGMENT` (product-specific)

#### 3. `src/lib/graphql/user-queries.ts`
- Removed local `USER_FRAGMENT` definition
- Added import from shared-fragments.ts
- Re-exports for backward compatibility

#### 4. `src/lib/graphql/dynamic-queries.ts`
- Added imports of `USER_FRAGMENT`, `POST_FRAGMENT`, `COMMENT_FRAGMENT` from shared
- Removed duplicate fragment definitions in `CommonFragments` object
- Updated `CommonFragments` to reference imported fragments

### Shared Fragments Consolidated:

```typescript
// Category Fragments
CATEGORY_BASIC_FRAGMENT
CATEGORY_WITH_COUNT_FRAGMENT
CATEGORY_TREE_FRAGMENT

// Product Fragments
PRODUCT_IMAGE_FRAGMENT
PRODUCT_VARIANT_FRAGMENT
PRODUCT_BASIC_FRAGMENT

// User Fragments
USER_FRAGMENT

// Common Model Fragments
POST_FRAGMENT
COMMENT_FRAGMENT
```

## Backward Compatibility

All consuming files maintain backward compatibility through re-exports:

```typescript
// Before fix
import { CATEGORY_BASIC_FRAGMENT } from '@/graphql/category.queries';

// After fix (still works)
import { CATEGORY_BASIC_FRAGMENT } from '@/graphql/category.queries';

// Also works now (preferred)
import { CATEGORY_BASIC_FRAGMENT } from '@/lib/graphql/shared-fragments';
```

## Benefits

✅ **Eliminates GraphQL warnings** - No more duplicate fragment name warnings  
✅ **Single source of truth** - All fragments defined once in shared-fragments.ts  
✅ **Backward compatible** - Existing imports still work through re-exports  
✅ **Centralized maintenance** - Easy to manage and update fragments in one place  
✅ **Type-safe** - All TypeScript types verified  
✅ **Clean codebase** - Reduced duplication across multiple files  

## Testing

- ✅ TypeScript type-check passes: `npm run type-check`
- ✅ No compilation errors
- ✅ All imports resolve correctly
- ✅ Fragment references work in queries and mutations
- ✅ Backward compatibility maintained

## Files Structure

```
frontend/src/lib/graphql/
├── shared-fragments.ts          [NEW] Central fragments repository
├── category.queries.ts          [MODIFIED] Imports from shared
├── product.queries.ts           [MODIFIED] Imports from shared
├── user-queries.ts              [MODIFIED] Imports from shared
└── dynamic-queries.ts           [MODIFIED] Imports from shared
```

## Migration Notes

For any new code:
- Define shared fragments in `src/lib/graphql/shared-fragments.ts`
- Import from shared-fragments.ts instead of creating duplicates
- Use re-exports for backward compatibility if needed

## Verification

Run the following commands to verify the fix:

```bash
# Type checking
npm run type-check

# Verify no GraphQL fragment warnings (during dev/build)
npm run dev
# or
npm run build
```

The application should now run without the GraphQL duplicate fragment warnings.
