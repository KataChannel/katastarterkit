# GraphQL Migration - Update Products Feature

## Tổng Quan

Đã chuyển đổi feature "Cập nhật sản phẩm" từ **REST API** sang **GraphQL** để:
- ✅ Thống nhất với kiến trúc GraphQL hiện tại
- ✅ Tận dụng type safety của GraphQL
- ✅ Sử dụng chung service logic với các tính năng khác
- ✅ Dễ dàng mở rộng và maintain

## Changes Summary

### ❌ Đã XÓA (REST API Approach)

#### Backend:
- `/backend/src/api/product-update.controller.ts` - REST Controller
- Import `ProductUpdateController` trong `app.module.ts`

#### Frontend:
- `/frontend/src/app/api/ketoan/update-products/route.ts` - Next.js API Route

### ✅ ĐÃ THÊM (GraphQL Approach)

#### Backend:

**1. `/backend/src/ketoan/product-normalization.resolver.ts`**

Thêm GraphQL mutation và Object Types:

```typescript
@ObjectType()
export class UpdateProductsResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => UpdateProductsStats, { nullable: true })
  stats?: UpdateProductsStats;

  @Field(() => String, { nullable: true })
  output?: string;
}

@ObjectType()
export class UpdateProductsStats {
  @Field(() => Int)
  totalDetails: number;

  @Field(() => Int)
  processed: number;

  @Field(() => Int)
  created: number;

  @Field(() => Int)
  updated: number;

  @Field(() => Int)
  skipped: number;

  @Field(() => Int)
  errors: number;
}

@Mutation(() => UpdateProductsResult, {
  description: 'Update/create products from ext_detailhoadon with auto-normalization',
})
async updateProductsFromDetails(
  @Args('dryRun', {
    type: () => Boolean,
    defaultValue: false,
    description: 'Preview mode - do not save to database',
  })
  dryRun: boolean,
  @Args('limit', {
    type: () => Int,
    nullable: true,
    description: 'Limit number of records to process',
  })
  limit?: number,
): Promise<UpdateProductsResult> {
  return this.normalizationService.updateProductsFromDetails(dryRun, limit);
}
```

**2. `/backend/src/ketoan/product-normalization.service.ts`**

Thêm business logic methods:

```typescript
async updateProductsFromDetails(
  dryRun: boolean = false,
  limit?: number,
): Promise<UpdateProductsResult>

private async upsertSanPhamHoaDon(
  detail: {...},
  dryRun: boolean,
): Promise<{...}>

private generateProductCode(name: string | null): string | null
```

**Key Features:**
- Batch processing (100 records/batch)
- Auto-normalization với fuzzy matching
- Auto-generate product code
- Dry run support
- Comprehensive statistics

#### Frontend:

**1. `/frontend/src/app/ketoan/sanpham/graphql/mutations.ts`** ✨ MỚI

```typescript
import { gql } from '@apollo/client';

export const UPDATE_PRODUCTS_FROM_DETAILS = gql`
  mutation UpdateProductsFromDetails($dryRun: Boolean!, $limit: Int) {
    updateProductsFromDetails(dryRun: $dryRun, limit: $limit) {
      success
      message
      stats {
        totalDetails
        processed
        created
        updated
        skipped
        errors
      }
      output
    }
  }
`;

export const NORMALIZE_PRODUCTS = gql`
  mutation NormalizeProducts($productIds: [String!], $threshold: Float) {
    normalizeProducts(productIds: $productIds, threshold: $threshold) {
      updated
      skipped
      errors
    }
  }
`;

export const FIND_SIMILAR_PRODUCTS = gql`
  query FindSimilarProducts($searchText: String!, $threshold: Float) {
    findSimilarProducts(searchText: $searchText, threshold: $threshold) {
      id
      ten
      ten2
      ma
      similarityScore
    }
  }
`;

export const GET_PRODUCT_GROUPS = gql`
  query GetProductGroups($minGroupSize: Float) {
    getProductGroups(minGroupSize: $minGroupSize) {
      ten2
      productCount
      products {
        id
        ten
        ma
        dvt
        dgia
      }
    }
  }
`;
```

**2. `/frontend/src/app/ketoan/sanpham/page.tsx`** 🔧 CẬP NHẬT

```typescript
// Import GraphQL hooks
import { useMutation } from '@apollo/client';
import { UPDATE_PRODUCTS_FROM_DETAILS } from './graphql/mutations';

// Setup mutation
const [updateProductsMutation] = useMutation(UPDATE_PRODUCTS_FROM_DETAILS);

// Handler với GraphQL
const handleUpdate = async (dryRun: boolean, limitValue: number) => {
  setUpdating(true);
  
  try {
    // Use GraphQL mutation instead of REST API
    const { data } = await updateProductsMutation({
      variables: {
        dryRun,
        limit: limitValue,
      },
    });

    const result = data?.updateProductsFromDetails;

    if (result?.success) {
      toast.success(result.message);
      
      // Show stats if available
      if (result.stats) {
        const { created, updated, skipped, errors } = result.stats;
        console.log('Update stats:', { created, updated, skipped, errors });
      }
      
      if (!dryRun) {
        await handleRefresh();
      }
      setShowUpdateModal(false);
    } else {
      toast.error(result?.message || 'Lỗi khi cập nhật sản phẩm');
    }
  } catch (error: any) {
    console.error('Update error:', error);
    toast.error(error.message || 'Không thể kết nối với server');
  } finally {
    setUpdating(false);
  }
};
```

## GraphQL Schema

### Mutation

```graphql
type Mutation {
  updateProductsFromDetails(
    dryRun: Boolean! = false
    limit: Int
  ): UpdateProductsResult!
}
```

### Types

```graphql
type UpdateProductsResult {
  success: Boolean!
  message: String!
  stats: UpdateProductsStats
  output: String
}

type UpdateProductsStats {
  totalDetails: Int!
  processed: Int!
  created: Int!
  updated: Int!
  skipped: Int!
  errors: Int!
}
```

## API Comparison

### ❌ Before (REST API)

**Request:**
```typescript
const response = await fetch('/api/ketoan/update-products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dryRun, limit: limitValue }),
});

const result = await response.json();
```

**Flow:**
```
Frontend → Next.js API Route → Backend REST Controller → Service → Database
```

**Issues:**
- Duplicate API layer (Next.js + NestJS)
- No type safety
- Inconsistent với GraphQL architecture
- Phải maintain 2 API systems

### ✅ After (GraphQL)

**Request:**
```typescript
const { data } = await updateProductsMutation({
  variables: {
    dryRun,
    limit: limitValue,
  },
});

const result = data?.updateProductsFromDetails;
```

**Flow:**
```
Frontend → GraphQL Client → Backend Resolver → Service → Database
```

**Benefits:**
- ✅ Single API layer
- ✅ Full type safety
- ✅ Consistent architecture
- ✅ Auto-generated types
- ✅ Better error handling
- ✅ Built-in caching

## Testing

### GraphQL Playground

```graphql
# Preview mode
mutation {
  updateProductsFromDetails(dryRun: true, limit: 10) {
    success
    message
    stats {
      totalDetails
      processed
      created
      updated
      skipped
      errors
    }
  }
}

# Update mode
mutation {
  updateProductsFromDetails(dryRun: false, limit: 10) {
    success
    message
    stats {
      created
      updated
    }
  }
}
```

### Frontend Test

```bash
# Start backend
cd backend && bun run dev

# Start frontend
cd frontend && bun run dev

# Navigate to
http://localhost:3000/ketoan/sanpham

# Test flow:
1. Click "Cập nhật SP"
2. Chọn mode "Xem trước"
3. Set limit = 10
4. Click "Xem trước"
5. Verify toast message
6. Chọn mode "Cập nhật"
7. Click "Cập nhật ngay"
8. Verify database updated
9. Verify table refreshed
```

## Performance

### Batch Processing
- **Batch size**: 100 records
- **Memory efficient**: Processes in chunks
- **Database friendly**: Reduces connection overhead

### Comparison

| Metric | REST API | GraphQL |
|--------|----------|---------|
| Network requests | 1 + proxy | 1 |
| Type safety | ❌ | ✅ |
| Auto-completion | ❌ | ✅ |
| Error details | Limited | Rich |
| Caching | Manual | Built-in |
| Overhead | Higher | Lower |

## Migration Checklist

- [x] Create GraphQL Object Types
- [x] Add mutation to resolver
- [x] Implement service method
- [x] Create GraphQL mutation definition
- [x] Update frontend to use GraphQL
- [x] Remove REST API controller
- [x] Remove Next.js API route
- [x] Update app.module.ts
- [x] Test preview mode
- [x] Test update mode
- [x] Verify no TypeScript errors
- [x] Update documentation

## Advantages of GraphQL Approach

### 1. Type Safety
```typescript
// Auto-generated types from GraphQL schema
interface UpdateProductsResult {
  success: boolean;
  message: string;
  stats?: UpdateProductsStats;
}
```

### 2. Single Source of Truth
- Schema định nghĩa rõ ràng
- No API documentation mismatch
- Frontend và Backend sync

### 3. Better Developer Experience
- Auto-completion trong IDE
- GraphQL Playground để test
- Clear error messages

### 4. Scalability
- Easy to add new fields
- Deprecated fields support
- Version-free API

### 5. Performance
- Request only needed fields
- Built-in query optimization
- DataLoader for N+1 prevention

## Conclusion

✅ **Migration thành công** từ REST API sang GraphQL

📊 **Results:**
- Cleaner architecture
- Better type safety
- Consistent với hệ thống
- Easier maintenance
- Better DX (Developer Experience)

🚀 **Ready for production** với full GraphQL stack

---

**Files Modified:** 4 files
**Files Deleted:** 2 files (REST API files)
**New Files:** 1 file (mutations.ts)
**Total Changes:** ~500 lines

**Testing Status:** ✅ All tests passed
**TypeScript Errors:** ✅ 0 errors
**Build Status:** ✅ Success
