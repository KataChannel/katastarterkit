# 🐛 BUG FIX REPORT - GraphQL Schema Mismatches

> **Ngày**: 2024-11-06  
> **Vấn đề**: GraphQL queries không khớp với backend schema  
> **Status**: ✅ FIXED

---

## 🔍 CÁC LỖI PHÁT HIỆN

### 1. ❌ GET_CART - Field `couponCode` không tồn tại

**Error Log**:
```
Cannot query field "couponCode" on type "CartType".
```

**Root Cause**:
- Frontend query yêu cầu field `couponCode` trực tiếp
- Backend CartType **không có** `couponCode` field
- Backend lưu coupon trong `metadata` (JSON field)

**Fix Applied**:
```typescript
// BEFORE (❌ Wrong)
export const GET_CART = gql`
  query GetCart($sessionId: String) {
    getCart(sessionId: $sessionId) {
      ...
      couponCode  // ❌ Field không tồn tại
    }
  }
`;

// AFTER (✅ Fixed)
export const GET_CART = gql`
  query GetCart($sessionId: String) {
    getCart(sessionId: $sessionId) {
      ...
      metadata  // ✅ Đúng - couponCode nằm trong metadata
    }
  }
`;
```

---

### 2. ❌ GET_USER_ORDERS - Query name không đúng

**Error Log**:
```
Cannot query field "orders" on type "Query". 
Did you mean "folders" or "folder"?
```

**Root Cause**:
- Frontend dùng query `orders`
- Backend **không có** query `orders`
- Backend chỉ có: `getMyOrders`, `listOrders`, `getOrder`, `getOrderByNumber`

**Fix Applied**:
```typescript
// BEFORE (❌ Wrong)
export const GET_USER_ORDERS = gql`
  query GetUserOrders($status: OrderStatus, $limit: Int, $offset: Int) {
    orders(status: $status, limit: $limit, offset: $offset) {  // ❌ Query không tồn tại
      id
      orderNumber
      status
      totalAmount
      ...
    }
  }
`;

// AFTER (✅ Fixed)
export const GET_USER_ORDERS = gql`
  query GetMyOrders($skip: Int, $take: Int) {
    getMyOrders(skip: $skip, take: $take) {  // ✅ Đúng query name
      orders {
        id
        orderNumber
        status
        total  // ✅ Đổi totalAmount → total
        ...
      }
      total
      hasMore
    }
  }
`;
```

**Additional Changes**:
- Response structure: Backend trả về `{ orders: [], total, hasMore }` thay vì array trực tiếp
- Field names: `totalAmount` → `total`
- Variables: `limit/offset` → `skip/take`

---

### 3. ❌ WISHLIST - Backend chưa implement

**Error Log**:
```
Cannot query field "wishlist" on type "Query".
```

**Root Cause**:
- Frontend có queries: `GET_WISHLIST`, `ADD_TO_WISHLIST`, `REMOVE_FROM_WISHLIST`
- Backend **không có** WishlistResolver
- Database có schema nhưng chưa có service/resolver

**Fix Applied**:
```typescript
// BEFORE (❌ Wrong - sử dụng queries không tồn tại)
import { GET_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '@/graphql/ecommerce.queries';

// AFTER (✅ Fixed - comment out và export null)
// ============================================================================
// WISHLIST QUERIES (Backend not implemented yet - commented out)
// ============================================================================

// export const GET_WISHLIST = gql`...`;
// export const ADD_TO_WISHLIST = gql`...`;
// export const REMOVE_FROM_WISHLIST = gql`...`;

// Temporary mock exports to prevent import errors
export const GET_WISHLIST = null;
export const ADD_TO_WISHLIST = null;
export const REMOVE_FROM_WISHLIST = null;
```

**UI Changes**:
1. **Product Detail Page**: Wishlist button → Disabled với tooltip "Chức năng đang phát triển"
2. **Header**: Wishlist icon → Commented out
3. **EcommerceNavigation**: Wishlist menu item → Commented out
4. **Wishlist Page**: Giữ nguyên file nhưng không accessible

---

## 📂 FILES MODIFIED

### ✅ GraphQL Queries Fixed
**File**: `frontend/src/graphql/ecommerce.queries.ts`

**Changes**:
1. ✅ `GET_CART`: Removed `couponCode`, added `metadata`
2. ✅ `GET_USER_ORDERS`: 
   - Renamed query: `orders` → `getMyOrders`
   - Updated variables: `status/limit/offset` → `skip/take`
   - Updated response structure: Direct array → `{ orders, total, hasMore }`
   - Field name: `totalAmount` → `total`
3. ✅ Wishlist queries: Commented out + exported as `null`

---

### ✅ Frontend Components Updated

**1. Product Detail Page**
**File**: `frontend/src/app/(website)/san-pham/[slug]/page.tsx`

**Changes**:
- ❌ Removed: `ADD_TO_WISHLIST`, `REMOVE_FROM_WISHLIST` imports
- ❌ Commented: Wishlist mutations and handler
- ✅ Updated: Wishlist button → Disabled state

```tsx
// BEFORE
<button onClick={handleToggleWishlist} ...>
  <Heart className={isInWishlist ? 'fill-red-500' : ''} />
</button>

// AFTER
<button disabled title="Chức năng đang phát triển" ...>
  <Heart className="text-gray-400" />
</button>
```

---

**2. Header Component**
**File**: `frontend/src/components/layout/website-header.tsx`

**Changes**:
- ❌ Commented: Wishlist button (Heart icon)
- ✅ Kept: Cart badge, Orders button

```tsx
// Wishlist - Disabled (backend not implemented)
// {isAuthenticated && (
//   <Button onClick={() => router.push('/yeu-thich')}>
//     <Heart className="w-5 h-5" />
//   </Button>
// )}
```

---

**3. Ecommerce Navigation**
**File**: `frontend/src/components/ecommerce/EcommerceNavigation.tsx`

**Changes**:
- ❌ Commented: Wishlist menu item
- ✅ Kept: Tài khoản, Đơn hàng, Địa chỉ, Thanh toán

```tsx
// Wishlist - disabled (backend not implemented)
// {
//   icon: Heart,
//   label: 'Sản phẩm yêu thích',
//   href: '/yeu-thich',
//   description: 'Danh sách wishlist',
// },
```

---

**4. Orders Page**
**File**: `frontend/src/app/(website)/don-hang/page.tsx`

**Changes**:
1. ✅ Removed duplicate `GET_USER_ORDERS` definition
2. ✅ Imported from centralized `ecommerce.queries.ts`
3. ✅ Updated data access:
   ```tsx
   // BEFORE
   const orders = data?.orders || [];
   
   // AFTER
   const orders = data?.getMyOrders?.orders || [];
   const total = data?.getMyOrders?.total || 0;
   ```
4. ✅ Added client-side status filter (backend query không có filter parameter)

---

## 🎯 BACKEND SCHEMA CHÍNH XÁC

### Cart Query
```graphql
type Query {
  getCart(sessionId: String): CartType
}

type CartType {
  id: ID!
  userId: ID
  sessionId: String
  items: [CartItemType!]!
  subtotal: Float!
  discount: Float!
  tax: Float!
  total: Float!
  metadata: JSON  # ← couponCode nằm đây
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Order Queries
```graphql
type Query {
  getOrder(orderId: ID!): OrderType
  getOrderByNumber(orderNumber: String!, email: String): OrderType
  listOrders(filter: OrderFilterInput): OrderListResponse!
  getMyOrders(skip: Int, take: Int): OrderListResponse!  # ← User's orders
}

type OrderListResponse {
  orders: [OrderType!]!
  total: Int!
  hasMore: Boolean!
  message: String
  errors: [String!]
}
```

### Wishlist (NOT IMPLEMENTED ❌)
```graphql
# ❌ KHÔNG TỒN TẠI - CẦN IMPLEMENT
type Query {
  wishlist: WishlistType  # ← Chưa có resolver
}

type Mutation {
  addToWishlist(productId: ID!): MutationResponse  # ← Chưa có resolver
  removeFromWishlist(productId: ID!): MutationResponse  # ← Chưa có resolver
}
```

---

## ✅ TESTING CHECKLIST

### Cart
- [x] `GET_CART` query chạy thành công
- [x] Field `metadata` trả về data (JSON)
- [x] Không còn lỗi `couponCode` field
- [x] Cart badge hiển thị số lượng đúng

### Orders
- [x] `getMyOrders` query chạy thành công
- [x] Response structure: `{ orders: [], total, hasMore }`
- [x] Order list hiển thị đúng
- [x] Filter by status hoạt động (client-side)
- [x] Search by order number/product name hoạt động

### Wishlist
- [x] Wishlist queries không gây crash
- [x] Product detail wishlist button disabled
- [x] Header không hiện wishlist icon
- [x] Navigation menu không có wishlist item
- [x] No console errors related to wishlist

---

## 🚀 NEXT STEPS (Optional - Backend Work)

### Implement Wishlist Backend

**1. Create WishlistService**
```bash
backend/src/services/wishlist.service.ts
```

**2. Create WishlistResolver**
```bash
backend/src/graphql/resolvers/wishlist.resolver.ts
```

**3. Create GraphQL Schema**
```bash
backend/src/graphql/schemas/ecommerce/wishlist.schema.ts
```

**4. Add to EcommerceModule**
```typescript
// backend/src/ecommerce/ecommerce.module.ts
providers: [
  ...
  WishlistService,
  WishlistResolver,
]
```

**5. Uncomment Frontend Code**
- Uncomment queries in `ecommerce.queries.ts`
- Uncomment wishlist button in product detail
- Uncomment wishlist icon in header
- Uncomment wishlist menu item in navigation

---

## 📊 IMPACT SUMMARY

### ✅ Fixed Issues
1. ✅ Cart query: `couponCode` field error → Fixed
2. ✅ Orders query: Wrong query name → Fixed
3. ✅ Wishlist: Missing backend → Gracefully disabled

### ✅ No Breaking Changes
- Cart functionality: ✅ Working
- Orders functionality: ✅ Working
- Product browsing: ✅ Working
- Checkout: ✅ Working
- Wishlist: ⏸️ Disabled (graceful degradation)

### ✅ Zero Errors
- No GraphQL execution errors
- No TypeScript compile errors
- No runtime crashes
- Clean console logs

---

**Status**: ✅ **ALL ISSUES RESOLVED**

Backend và Frontend giờ đã hoàn toàn sync về schema. Wishlist feature đã được disable một cách graceful - không gây lỗi và sẵn sàng enable khi backend implement xong.
