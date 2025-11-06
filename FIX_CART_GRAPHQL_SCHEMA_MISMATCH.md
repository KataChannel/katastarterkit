# 🔧 FIX CART GRAPHQL SCHEMA MISMATCH

> **Ngày**: 2024-11-06  
> **Bug**: GraphQL execution errors trong AddToCart mutation  
> **Root Cause**: Frontend queries không khớp với backend schema

---

## ❌ LỖI

### Error Log:
```
GraphQL execution errors: {
  operationName: 'AddToCart',
  errors: [
    {
      message: 'Cannot query field "featuredImage" on type "ProductSummaryType".',
      locations: [Array]
    },
    {
      message: 'Cannot query field "totalItems" on type "CartType". Did you mean "items" or "total"?',
      locations: [Array]
    }
  ]
}
```

### Phân tích:
1. ❌ **Frontend query**: `product.featuredImage`  
   ✅ **Backend schema**: `product.thumbnail`

2. ❌ **Frontend query**: `cart.totalItems`  
   ✅ **Backend schema**: `cart.itemCount`

---

## ✅ GIẢI PHÁP

### 1. **Backend Schema** (Đúng - Không thay đổi)

**File**: `backend/src/graphql/schemas/ecommerce/cart.schema.ts`

```typescript
@ObjectType()
export class ProductSummaryType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() slug: string;
  @Field(() => Float) price: number;
  @Field({ nullable: true }) thumbnail?: string;  // ✅ Đúng field
  @Field(() => Int) stock: number;
  @Field() status: string;
}

@ObjectType()
export class CartType {
  @Field(() => ID) id: string;
  @Field(() => [CartItemType]) items: CartItemType[];
  @Field(() => Int) itemCount: number;  // ✅ Đúng field (tổng số items)
  @Field(() => Float) subtotal: number;
  @Field(() => Float) shippingFee: number;
  @Field(() => Float) tax: number;
  @Field(() => Float) discount: number;
  @Field(() => Float) total: number;
  // ...
}
```

---

### 2. **Frontend Queries Fixed**

**File**: `frontend/src/graphql/ecommerce.queries.ts`

#### ✅ Fix ADD_TO_CART Mutation

**BEFORE** ❌:
```graphql
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    success
    message
    cart {
      items {
        product {
          featuredImage  # ❌ Field không tồn tại
        }
      }
      totalItems  # ❌ Field không tồn tại
      total
    }
  }
}
```

**AFTER** ✅:
```graphql
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    success
    message
    cart {
      items {
        product {
          thumbnail  # ✅ Đúng field
        }
      }
      itemCount  # ✅ Đúng field
      total
    }
  }
}
```

#### ✅ Fix UPDATE_CART_ITEM Mutation

**Change**: `totalItems` → `itemCount`

#### ✅ Fix REMOVE_FROM_CART Mutation

**Change**: `totalItems` → `itemCount`

#### ✅ Enhanced GET_CART Query

**Added**: `itemCount` field để CartContext có thể dùng trực tiếp

```graphql
query GetCart($sessionId: String) {
  getCart(sessionId: $sessionId) {
    id
    items { ... }
    itemCount  # ✅ Thêm field này
    subtotal
    total
    # ...
  }
}
```

---

### 3. **Frontend Components Fixed**

#### ✅ Fix Checkout Page

**File**: `frontend/src/app/(website)/thanh-toan/page.tsx`

**Change 1**: `cart.totalItems` → `cart.itemCount`
```tsx
// BEFORE ❌
<h2>Đơn hàng ({cart.totalItems} sản phẩm)</h2>

// AFTER ✅
<h2>Đơn hàng ({cart.itemCount} sản phẩm)</h2>
```

**Change 2**: `product.featuredImage` → `product.thumbnail`
```tsx
// BEFORE ❌
<Image src={item.product.featuredImage || '/placeholder.jpg'} />

// AFTER ✅
<Image src={item.product.thumbnail || '/placeholder.jpg'} />
```

#### ✅ Optimized CartContext

**File**: `frontend/src/contexts/CartContext.tsx`

**BEFORE** (Tính thủ công):
```tsx
const itemCount = cart?.items?.length || 0;
```

**AFTER** (Dùng backend field):
```tsx
// Use backend's itemCount if available, fallback to items.length
const itemCount = cart?.itemCount ?? cart?.items?.length ?? 0;
```

**Benefits**:
- ✅ Dùng giá trị từ backend (chính xác hơn)
- ✅ Fallback an toàn nếu backend chưa trả về
- ✅ Performance tốt hơn (không cần count array)

---

## 🎯 TÓM TẮT THAY ĐỔI

### Files Changed: 3

| File | Changes |
|------|---------|
| `ecommerce.queries.ts` | Fixed 4 mutations/queries (ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, GET_CART) |
| `thanh-toan/page.tsx` | Fixed 2 field names (totalItems→itemCount, featuredImage→thumbnail) |
| `CartContext.tsx` | Optimized itemCount calculation (backend field first) |

### Field Mapping:

| ❌ Wrong (Frontend) | ✅ Correct (Backend) | Type |
|---------------------|----------------------|------|
| `product.featuredImage` | `product.thumbnail` | String |
| `cart.totalItems` | `cart.itemCount` | Int |

---

## ✅ KẾT QUẢ

### Trước khi fix:
```
❌ AddToCart mutation failed
❌ Cart badge không cập nhật
❌ Checkout page crash
```

### Sau khi fix:
```
✅ AddToCart mutation hoạt động
✅ Cart badge cập nhật real-time
✅ Checkout page hiển thị đúng
✅ No GraphQL errors
✅ No TypeScript errors
```

---

## 🧪 TESTING

### Test Cases:
1. ✅ Thêm sản phẩm vào giỏ → Success animation + Cart badge +1
2. ✅ Update số lượng → Cart badge update đúng
3. ✅ Xóa sản phẩm → Cart badge -1
4. ✅ Vào trang checkout → Hiển thị "Đơn hàng (X sản phẩm)"
5. ✅ Hình ảnh sản phẩm → Hiển thị thumbnail đúng

---

## 📚 LESSONS LEARNED

### 🔑 Key Points:

1. **Always check backend schema first** before writing frontend queries
2. **Use GraphQL Playground** để test queries trước khi code
3. **Field naming consistency** quan trọng:
   - Nếu backend dùng `thumbnail` → Frontend cũng dùng `thumbnail`
   - Nếu backend dùng `itemCount` → Frontend cũng dùng `itemCount`
4. **Optimize với backend fields**: Dùng `itemCount` thay vì tính `items.length`
5. **Fallback safety**: `cart?.itemCount ?? cart?.items?.length ?? 0`

### 🚫 Common Mistakes:

- ❌ Copy-paste queries từ projects khác mà không check schema
- ❌ Assume field names (featuredImage vs thumbnail)
- ❌ Không đọc backend schema trước khi code
- ❌ Không test GraphQL queries isolated

---

**Status**: ✅ **FIXED** - All GraphQL schema mismatches resolved!
