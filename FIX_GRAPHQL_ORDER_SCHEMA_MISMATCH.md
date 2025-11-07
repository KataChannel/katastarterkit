# Fix Bug GraphQL Schema Mismatch - Order & Cart

## 🐛 Vấn đề

GraphQL execution errors khi tạo đơn hàng:
```
Field "shippingAddress" must not have a selection since type "JSON!" has no subfields.
Cannot query field "product" on type "OrderItemType". Did you mean "productId"?
```

## 🔍 Nguyên nhân

### 1. ShippingAddress Type Mismatch
**Backend Schema**: `shippingAddress: GraphQLJSON` (không có subfields)
**Frontend Query**: Cố gắng query nested fields như `fullName`, `phone`, `address`...

### 2. OrderItem Structure Mismatch
**Backend Schema**: `OrderItemType` có flat fields: `productId`, `productName`, `thumbnail`...
**Frontend Query**: Cố gắng query nested `product { name, slug, featuredImage }`

### 3. Field Name Mismatches
- Backend: `name`, `customerNote`, `total`
- Frontend: `fullName`, `notes`, `totalAmount`

## ✅ Giải pháp

### 1. Fix CREATE_ORDER Mutation
**File: `frontend/src/graphql/ecommerce.queries.ts`**

```graphql
# ❌ SAI - Cố query nested fields từ JSON
shippingAddress {
  fullName
  phone
  address
}
items {
  product {
    name
    featuredImage
  }
}

# ✅ ĐÚNG - ShippingAddress là JSON, items có flat fields
shippingAddress  # No nested fields
items {
  id
  productId
  productName
  variantName
  sku
  thumbnail
  quantity
  price
  subtotal
}
```

### 2. Fix GET_ORDER & GET_ORDER_DETAIL Queries
Cập nhật tất cả order queries để khớp với backend schema:

```graphql
query GetOrder($orderId: ID!) {
  order(orderId: $orderId) {
    # Pricing
    total          # NOT totalAmount
    subtotal
    shippingFee
    tax
    discount
    
    # Addresses (JSON type)
    shippingAddress  # NOT nested object
    billingAddress
    
    # Items (flat structure)
    items {
      productId      # NOT product.id
      productName    # NOT product.name
      thumbnail      # NOT product.thumbnailUrl
      variantName    # NOT variant.name
      sku
      quantity
      price
      subtotal
    }
    
    # Tracking
    tracking {
      events {
        id
        status
        description
        location
        eventTime  # NOT timestamp
      }
    }
    
    # Notes
    customerNote   # NOT notes
    internalNote
  }
}
```

### 3. Fix Input Variables
**File: `frontend/src/app/(website)/thanh-toan/page.tsx`**

```tsx
// ❌ SAI - Field name không khớp
shippingAddress: {
  fullName: formData.fullName,  // Backend expect 'name'
  ...
}

// ✅ ĐÚNG
shippingAddress: {
  name: formData.fullName,      // Khớp với ShippingAddressInput
  phone: formData.phone,
  address: formData.address,
  city: formData.city,
  district: formData.district,
  ward: formData.ward,
}

// ❌ SAI
notes: formData.notes

// ✅ ĐÚNG
customerNote: formData.notes
```

### 4. Fix UI Components
**File: `frontend/src/app/(website)/don-hang/[orderNumber]/page.tsx`**

Parse JSON address và update item display:

```tsx
// Parse shippingAddress từ JSON
const shippingAddress = typeof order.shippingAddress === 'string' 
  ? JSON.parse(order.shippingAddress) 
  : order.shippingAddress;

// Access fields
{shippingAddress?.name || shippingAddress?.fullName || 'N/A'}
{shippingAddress?.phone || 'N/A'}

// Items không có nested product
{item.productName}        // NOT item.product.name
{item.thumbnail}          // NOT item.product.thumbnailUrl
{item.variantName}        // NOT item.variant.name
{item.sku}                // NOT item.product.sku

// Tracking events
{order.tracking?.events}  // NOT order.trackingEvents

// Notes
{order.customerNote}      // NOT order.notes

// Total
{order.total}             // NOT order.totalAmount
```

## 📝 Files đã sửa

### 1. GraphQL Queries
✅ `frontend/src/graphql/ecommerce.queries.ts`
- `CREATE_ORDER` mutation
- `GET_ORDER` query
- `GET_ORDER_DETAIL` query

### 2. Checkout Page
✅ `frontend/src/app/(website)/thanh-toan/page.tsx`
- Fix input field names (`name` thay vì `fullName`)
- Fix notes field (`customerNote` thay vì `notes`)

### 3. Order Detail Page
✅ `frontend/src/app/(website)/don-hang/[orderNumber]/page.tsx`
- Parse `shippingAddress` JSON
- Update OrderDetail interface
- Fix items display (flat structure)
- Fix tracking events path
- Fix field names

## 🎯 Backend Schema Reference

### OrderType
```typescript
@ObjectType()
export class OrderType {
  shippingAddress: GraphQLJSON      // ⚠️ JSON, not nested object
  billingAddress?: GraphQLJSON       // ⚠️ JSON, not nested object
  items: OrderItemType[]
  tracking?: OrderTrackingType
  total: Float                       // NOT totalAmount
  customerNote?: string              // NOT notes
  internalNote?: string
}
```

### OrderItemType
```typescript
@ObjectType()
export class OrderItemType {
  productId?: string                 // ⚠️ Flat field
  productName: string                // ⚠️ Flat field
  variantName?: string               // ⚠️ Flat field
  sku?: string                       // ⚠️ Flat field
  thumbnail?: string                 // ⚠️ Flat field
  quantity: Int
  price: Float
  subtotal: Float
  // ❌ NO nested product or variant objects
}
```

### ShippingAddressInput
```typescript
@InputType()
export class ShippingAddressInput {
  name: string         // ⚠️ NOT fullName
  phone: string
  address: string
  city: string
  district: string
  ward: string
  zipCode?: string
}
```

## ✨ Kết quả

### ✅ Hoàn thành
1. **CREATE_ORDER** mutation hoạt động chính xác
2. **GET_ORDER** query trả về đúng structure
3. **UI hiển thị** order detail chính xác
4. **Không còn GraphQL errors**
5. **Type safety** với TypeScript interfaces

### 🎯 Benefits
- ✅ Schema khớp 100% với backend
- ✅ No runtime GraphQL errors
- ✅ Type-safe với TypeScript
- ✅ Code clean và maintainable
- ✅ Flexible với JSON fields

### 📊 Test Checklist
- ✅ Tạo đơn hàng thành công
- ✅ Hiển thị thông tin shipping address
- ✅ Hiển thị danh sách sản phẩm trong order
- ✅ Hiển thị tracking events (nếu có)
- ✅ Hiển thị customer notes
- ✅ Tính toán total chính xác

## 💡 Bài học

### 1. GraphQL JSON Type
Khi backend dùng `GraphQLJSON`, frontend KHÔNG được query nested fields:
```graphql
# ❌ SAI
shippingAddress {
  name
  phone
}

# ✅ ĐÚNG
shippingAddress  # Scalar value, parse on frontend
```

### 2. Flat vs Nested Structure
Backend OrderItem dùng flat structure (denormalized) để optimize performance:
```typescript
// ❌ Normalized (nhiều joins)
item.product.name

// ✅ Denormalized (1 query)
item.productName
```

### 3. Field Naming Consistency
Luôn check backend schema trước khi viết queries:
- `name` vs `fullName`
- `customerNote` vs `notes`
- `total` vs `totalAmount`
- `eventTime` vs `timestamp`

## 🚀 Next Steps
- [ ] Add order status update mutations
- [ ] Add order cancellation
- [ ] Add tracking number updates
- [ ] Add payment integration
- [ ] Add refund handling

✨ **Bug đã được fix triệt để theo đúng backend schema!**
