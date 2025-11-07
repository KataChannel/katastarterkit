# Bổ Sung Tính Năng E-Commerce - Kế Hoạch Thực Hiện

## 📊 Tình Trạng Hiện Tại

### ✅ Đã Có (Backend):
- **Database Schema**: Cart, Order, OrderTracking, Payment, ProductReview, Wishlist
- **GraphQL Schemas**: CartSchema, OrderSchema (480 lines)
- **Services**: CartService (730 lines), OrderService (620 lines)
- **Resolvers**: CartResolver, OrderResolver
- **Features**: Guest checkout, payment methods, shipping tracking, inventory management

### ✅ Đã Có (Frontend):
- `/san-pham` - Danh sách sản phẩm
- `/san-pham/[slug]` - Chi tiết sản phẩm
- `/gio-hang` - Giỏ hàng (cần hoàn thiện)
- `/thanh-toan` - Checkout (cần hoàn thiện)

### ❌ Còn Thiếu (Frontend):
1. **Trang đơn hàng** (`/don-hang`)
2. **Chi tiết đơn hàng** (`/don-hang/[orderNumber]`)
3. **Theo dõi đơn hàng (Guest)** (`/theo-doi-don-hang`)
4. **Xác nhận đơn hàng** (`/thanh-toan/thanh-cong`)
5. **Wishlist** (`/yeu-thich`)
6. **Product Reviews** (trong trang chi tiết sản phẩm)
7. **Shared Components**: OrderStatusBadge, PaymentMethodBadge, OrderTimeline, etc.

---

## 🎯 Kế Hoạch Thực Hiện

### Phase 1: Shared Components (Ưu tiên cao)

#### 1.1. OrderStatusBadge
**File**: `frontend/src/components/ecommerce/OrderStatusBadge.tsx`

**Props**:
```typescript
{
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}
```

**OrderStatus**:
- PENDING - Chờ xác nhận (yellow)
- CONFIRMED - Đã xác nhận (blue)
- PROCESSING - Đang xử lý (indigo)
- PACKAGING - Đang đóng gói (purple)
- READY_TO_SHIP - Sẵn sàng giao (cyan)
- SHIPPING - Đang giao hàng (blue)
- DELIVERED - Đã giao hàng (green)
- COMPLETED - Hoàn thành (green)
- CANCELLED - Đã hủy (red)
- RETURNED - Đã hoàn trả (orange)
- REFUNDED - Đã hoàn tiền (gray)

#### 1.2. PaymentMethodBadge
**File**: `frontend/src/components/ecommerce/PaymentMethodBadge.tsx`

**PaymentMethod**:
- CASH_ON_DELIVERY - Thanh toán khi nhận hàng
- BANK_TRANSFER - Chuyển khoản ngân hàng
- CREDIT_CARD - Thẻ tín dụng
- MOMO - Ví MoMo
- ZALOPAY - Ví ZaloPay
- VNPAY - Cổng VNPay

#### 1.3. OrderTimeline
**File**: `frontend/src/components/ecommerce/OrderTimeline.tsx`

**Features**:
- Timeline vertical/horizontal (responsive)
- Check marks cho completed steps
- Timestamps cho mỗi step
- Current step highlight
- Mobile: Compact view
- Desktop: Full timeline

**Events từ OrderTrackingEvent**:
- ORDER_PLACED
- PAYMENT_CONFIRMED
- PROCESSING_STARTED
- PACKAGING_STARTED
- READY_FOR_SHIPPING
- PICKED_UP
- IN_TRANSIT
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED
- RETURNED
- REFUNDED

#### 1.4. PriceDisplay
**File**: `frontend/src/components/ecommerce/PriceDisplay.tsx`

**Features**:
- Format tiền VND
- Original price (strikethrough)
- Discount badge
- Size variants (sm, md, lg)

#### 1.5. QuantitySelector
**File**: `frontend/src/components/ecommerce/QuantitySelector.tsx`

**Features**:
- Plus/minus buttons
- Input field (editable)
- Min/max validation
- Stock limit
- Disabled state
- Loading state (khi update)

---

### Phase 2: Order Management Pages

#### 2.1. Trang Đơn Hàng `/don-hang/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Breadcrumb: Trang chủ > Đơn hàng        │
├─────────────────────────────────────────┤
│ Filters: [Status] [Date Range] [Search]│
├─────────────────────────────────────────┤
│ Orders (Grid/List)                      │
│ ┌───────────────────────────────────┐   │
│ │ Order Card                        │   │
│ │ #ORD-20251106-0001   [SHIPPING]  │   │
│ │ 2 sản phẩm - 350.000đ            │   │
│ │ [Xem chi tiết] [Theo dõi]        │   │
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│ Pagination                              │
└─────────────────────────────────────────┘
```

**Features**:
- ✅ Filter theo status (Combobox)
- ✅ Search theo order number/product name
- ✅ Date range picker
- ✅ Order cards với thumbnail sản phẩm
- ✅ Status badge
- ✅ Quick actions: View, Track, Cancel
- ✅ Empty state khi chưa có đơn
- ✅ Pagination
- ✅ Mobile: Stack layout
- ✅ Desktop: Grid 2 columns

**GraphQL Query**:
```graphql
query GetMyOrders($page: Int, $limit: Int, $status: OrderStatus, $search: String) {
  myOrders(page: $page, limit: $limit, status: $status, search: $search) {
    items {
      id
      orderNumber
      status
      paymentStatus
      total
      createdAt
      items {
        product {
          name
          thumbnailUrl
        }
        quantity
      }
    }
    total
    page
    totalPages
  }
}
```

#### 2.2. Chi Tiết Đơn Hàng `/don-hang/[orderNumber]/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Breadcrumb: ... > Đơn hàng > #ORD-xxx       │
├─────────────────────────────────────────────┤
│ Order Header                                │
│ #ORD-20251106-0001        [SHIPPING]        │
│ Ngày đặt: 06/11/2025 14:30                  │
├─────────────────────────────────────────────┤
│ Order Timeline (Horizontal on desktop)      │
│ ○─────○─────●─────○─────○                   │
│ Đặt   Xác   Đang  Giao  Hoàn                │
│ hàng  nhận  gói   hàng  thành               │
├─────────────────────────────────────────────┤
│ 2 Columns (Desktop) | Stack (Mobile)        │
│ ┌─────────────────┬─────────────────────┐   │
│ │ Order Items     │ Summary             │   │
│ │ [Product 1]     │ Tạm tính: 300.000đ  │   │
│ │ [Product 2]     │ Phí ship: 30.000đ   │   │
│ │                 │ Giảm giá: -10.000đ  │   │
│ │ Shipping Info   │ Tổng: 320.000đ      │   │
│ │ Name, Phone     │                     │   │
│ │ Address         │ [Hủy đơn]          │   │
│ │                 │ [Liên hệ]          │   │
│ │ Payment         │ [In hóa đơn]       │   │
│ │ COD             │                     │   │
│ └─────────────────┴─────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Features**:
- ✅ OrderTimeline component
- ✅ Product list với hình ảnh, số lượng, giá
- ✅ Shipping address display
- ✅ Payment method display
- ✅ Order summary (subtotal, shipping, discount, total)
- ✅ Cancel order button (nếu status cho phép)
- ✅ Contact support button
- ✅ Print invoice button
- ✅ Tracking events timeline (events từ OrderTrackingEvent)

**GraphQL Query**:
```graphql
query GetOrder($orderNumber: String!) {
  getOrderByNumber(orderNumber: $orderNumber) {
    id
    orderNumber
    status
    paymentStatus
    paymentMethod
    shippingMethod
    subtotal
    shippingFee
    discount
    total
    shippingAddress {
      name
      phone
      address
      city
      district
      ward
    }
    items {
      id
      quantity
      price
      product {
        name
        slug
        thumbnailUrl
      }
    }
    tracking {
      currentStatus
      events {
        status
        description
        createdAt
      }
    }
    createdAt
  }
}
```

#### 2.3. Theo Dõi Đơn Hàng (Guest) `/theo-doi-don-hang/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Hero: Theo dõi đơn hàng                 │
├─────────────────────────────────────────┤
│ Tracking Form (Center Card)            │
│ ┌───────────────────────────────────┐   │
│ │ Mã đơn hàng:                      │   │
│ │ [ORD-20251106-0001]               │   │
│ │                                   │   │
│ │ Email hoặc SĐT:                   │   │
│ │ [user@example.com]                │   │
│ │                                   │   │
│ │ [Tra cứu đơn hàng]                │   │
│ └───────────────────────────────────┘   │
│                                         │
│ (Sau khi tra cứu thành công)           │
│ ┌───────────────────────────────────┐   │
│ │ Order Timeline                    │   │
│ │ Order Details                     │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Features**:
- ✅ Form input: Order number + Email/Phone
- ✅ Validation
- ✅ GraphQL query getOrderByNumber
- ✅ Display order timeline
- ✅ Display order details (read-only)
- ✅ No authentication required
- ✅ Rate limiting (prevent abuse)

**GraphQL Query**:
```graphql
query TrackOrder($orderNumber: String!, $email: String!) {
  getOrderByNumber(orderNumber: $orderNumber, email: $email) {
    # Same fields as GetOrder
  }
}
```

#### 2.4. Xác Nhận Đơn Hàng `/thanh-toan/thanh-cong/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Success Animation (Checkmark)           │
│                                         │
│ 🎉 Đặt hàng thành công!                 │
│                                         │
│ Mã đơn hàng: #ORD-20251106-0001         │
│ ┌───────────────────────────────────┐   │
│ │ Order Summary                     │   │
│ │ 2 sản phẩm - 350.000đ             │   │
│ │ Giao hàng tới: Nguyễn Văn A       │   │
│ │ Thanh toán: COD                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│ [Theo dõi đơn hàng]                     │
│ [Tiếp tục mua sắm]                      │
└─────────────────────────────────────────┘
```

**Features**:
- ✅ Success animation (framer-motion)
- ✅ Order number display (lớn, prominent)
- ✅ Order summary
- ✅ Next steps guide
- ✅ Track order button
- ✅ Continue shopping button
- ✅ Email notification note

---

### Phase 3: Hoàn Thiện Pages Hiện Có

#### 3.1. Giỏ Hàng `/gio-hang/page.tsx` (Cập nhật)

**Cần thêm**:
- ✅ QuantitySelector component
- ✅ Stock warnings (còn x sản phẩm)
- ✅ Coupon input field
- ✅ Apply coupon mutation
- ✅ Remove item confirmation dialog
- ✅ Empty cart state (attractive)
- ✅ Recommended products (khi empty)
- ✅ Sticky cart summary (mobile)

**GraphQL Mutations cần check**:
```graphql
mutation UpdateCartItem($itemId: ID!, $quantity: Int!)
mutation RemoveFromCart($itemId: ID!)
mutation ApplyCoupon($code: String!)
mutation ClearCart
```

#### 3.2. Thanh Toán `/thanh-toan/page.tsx` (Cập nhật)

**Multi-step Form**:

**Step 1: Shipping Address**
- Name, Phone, Email
- Province/City (Combobox)
- District (Combobox - load based on province)
- Ward (Combobox - load based on district)
- Address detail
- Address type (Home/Office)
- Save address checkbox (nếu logged in)

**Step 2: Shipping Method**
- STANDARD - Giao hàng tiêu chuẩn (3-5 ngày) - 30.000đ
- EXPRESS - Giao hàng nhanh (1-2 ngày) - 50.000đ
- SAME_DAY - Giao trong ngày (nếu available) - 70.000đ
- PICKUP - Tự đến lấy - 0đ

**Step 3: Payment Method**
- CASH_ON_DELIVERY (default)
- BANK_TRANSFER (show bank info)
- VNPAY (redirect)
- MOMO (QR code)
- ZALOPAY (redirect)

**Step 4: Review Order**
- Order items (read-only)
- Shipping address (read-only, có nút edit)
- Payment method (read-only, có nút edit)
- Order summary
- Terms and conditions checkbox
- Place order button

**Features**:
- ✅ Progress indicator (4 steps)
- ✅ Back/Next buttons
- ✅ Form validation (zod)
- ✅ Save to localStorage (prevent loss)
- ✅ Loading state khi submit
- ✅ Error handling
- ✅ Redirect to /thanh-toan/thanh-cong on success

**GraphQL Mutation**:
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    success
    message
    order {
      id
      orderNumber
      status
      total
    }
  }
}
```

---

### Phase 4: Wishlist & Reviews

#### 4.1. Wishlist `/yeu-thich/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────┐
│ Breadcrumb: Trang chủ > Yêu thích       │
├─────────────────────────────────────────┤
│ Wishlist Items (Grid)                  │
│ ┌───────┬───────┬───────┐               │
│ │ [❤️]  │ [❤️]  │ [❤️]  │               │
│ │ Prod  │ Prod  │ Prod  │               │
│ │ A     │ B     │ C     │               │
│ │ [🛒]  │ [🛒]  │ [🛒]  │               │
│ └───────┴───────┴───────┘               │
└─────────────────────────────────────────┘
```

**Features**:
- ✅ Product grid (3 cols desktop, 2 cols tablet, 1 col mobile)
- ✅ Remove from wishlist (heart icon)
- ✅ Add to cart button
- ✅ Stock status
- ✅ Price display
- ✅ Empty state
- ✅ Move to cart (all items)

**GraphQL**:
```graphql
query GetWishlist {
  wishlist {
    items {
      id
      product {
        id
        name
        slug
        price
        thumbnailUrl
        stock
      }
    }
  }
}

mutation AddToWishlist($productId: ID!)
mutation RemoveFromWishlist($productId: ID!)
```

#### 4.2. Product Reviews (Component trong `/san-pham/[slug]`)

**Component**: `frontend/src/components/ecommerce/ProductReviews.tsx`

**Features**:
- ✅ Rating stars display
- ✅ Review list với pagination
- ✅ Filter by rating (5★, 4★, ...)
- ✅ Sort (newest, helpful, rating)
- ✅ Verified purchase badge
- ✅ Review photos (nếu có)
- ✅ Helpful/Report buttons
- ✅ Add review form (authenticated users, verified purchase only)

**GraphQL**:
```graphql
query GetProductReviews($productId: ID!, $page: Int, $rating: Int) {
  productReviews(productId: $productId, page: $page, rating: $rating) {
    items {
      id
      rating
      comment
      images
      verifiedPurchase
      user {
        name
      }
      createdAt
    }
    averageRating
    totalReviews
    ratingBreakdown {
      rating
      count
    }
  }
}

mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    success
    message
    review {
      id
      rating
      comment
    }
  }
}
```

---

### Phase 5: GraphQL Queries Update

**File**: `frontend/src/graphql/ecommerce.queries.ts`

**Cần thêm**:

```typescript
// Orders
export const GET_MY_ORDERS = gql`...`
export const GET_ORDER_BY_NUMBER = gql`...`
export const CANCEL_ORDER = gql`...`

// Wishlist
export const GET_WISHLIST = gql`...`
export const ADD_TO_WISHLIST = gql`...`
export const REMOVE_FROM_WISHLIST = gql`...`
export const MOVE_TO_CART = gql`...`

// Reviews
export const GET_PRODUCT_REVIEWS = gql`...`
export const CREATE_REVIEW = gql`...`
export const UPDATE_REVIEW = gql`...`
export const DELETE_REVIEW = gql`...`

// Address (nếu backend support)
export const GET_MY_ADDRESSES = gql`...`
export const CREATE_ADDRESS = gql`...`
export const UPDATE_ADDRESS = gql`...`
export const DELETE_ADDRESS = gql`...`
```

---

## 🎨 Design System (shadcn UI)

### Components Cần Dùng:

**Form & Input**:
- ✅ Input
- ✅ Combobox (thay cho Select - theo rule 11)
- ✅ Textarea
- ✅ Checkbox
- ✅ RadioGroup
- ✅ DatePicker (date range)

**Display**:
- ✅ Card, CardHeader, CardContent, CardFooter
- ✅ Badge
- ✅ Separator
- ✅ Avatar
- ✅ AspectRatio (cho images)

**Feedback**:
- ✅ Dialog (cho confirmations)
- ✅ Alert
- ✅ Toast (cho notifications)
- ✅ Progress (cho order timeline)
- ✅ Skeleton (loading states)

**Navigation**:
- ✅ Button
- ✅ Breadcrumb
- ✅ Tabs
- ✅ Pagination

**Layout**:
- ✅ ScrollArea
- ✅ Accordion (cho FAQs)

### Dialog Layout Standard:

Theo rule 12: "Tất cả Dialog sử dụng theo layout header, footer, content scrollable"

```typescript
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>...</DialogTitle>
      <DialogDescription>...</DialogDescription>
    </DialogHeader>
    
    <ScrollArea className="max-h-[60vh]">
      {/* Scrollable content */}
    </ScrollArea>
    
    <DialogFooter>
      <Button variant="outline">Hủy</Button>
      <Button>Xác nhận</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 📱 Mobile First + Responsive

### Breakpoints:
- **Mobile**: < 640px (1 col, stack layout, horizontal scroll categories)
- **Tablet**: 640px - 1024px (2 cols, some sidebar visible)
- **Desktop**: > 1024px (3 cols, full sidebar, spacious layout)

### Responsive Patterns:

**Order Cards**:
- Mobile: Full width, vertical stack, compact info
- Desktop: Grid 2 cols, horizontal layout, full info

**Order Timeline**:
- Mobile: Vertical timeline với compact labels
- Desktop: Horizontal timeline với full descriptions

**Checkout Form**:
- Mobile: Full width, single column, sticky summary
- Desktop: 2 columns (form left, summary right), fixed summary

**Product Grid**:
- Mobile: 1 col (full width cards)
- Tablet: 2 cols
- Desktop: 3 or 4 cols

---

## 🚀 Implementation Priority

### Sprint 1: Core Order Features (Week 1)
1. ✅ Shared Components (OrderStatusBadge, PaymentMethodBadge, OrderTimeline)
2. ✅ My Orders page (`/don-hang`)
3. ✅ Order Detail page (`/don-hang/[orderNumber]`)
4. ✅ GraphQL queries update

### Sprint 2: Guest & Checkout (Week 2)
1. ✅ Guest order tracking (`/theo-doi-don-hang`)
2. ✅ Order success page (`/thanh-toan/thanh-cong`)
3. ✅ Hoàn thiện Checkout flow (`/thanh-toan`)
4. ✅ Hoàn thiện Cart page (`/gio-hang`)

### Sprint 3: Wishlist & Reviews (Week 3)
1. ✅ Wishlist page (`/yeu-thich`)
2. ✅ Product Reviews component
3. ✅ Review submission flow
4. ✅ Polish & bug fixes

---

## 📊 Success Metrics

**Functionality**:
- ✅ Tất cả trang load không lỗi
- ✅ GraphQL queries hoạt động chính xác
- ✅ Form validation works
- ✅ Responsive trên tất cả devices
- ✅ No TypeScript errors
- ✅ Build successful

**UX**:
- ✅ Mobile First design
- ✅ Loading states rõ ràng
- ✅ Error messages hữu ích
- ✅ Smooth animations (framer-motion)
- ✅ Accessible (keyboard nav, screen readers)

**Performance**:
- ✅ Page load < 3s
- ✅ Images optimized (Next.js Image)
- ✅ Lazy loading
- ✅ No layout shifts

---

## 🔧 Technical Notes

### State Management:
- Apollo Client cache cho GraphQL data
- React state cho UI state
- localStorage cho cart persistence (guest users)
- Context cho user auth status

### Error Handling:
```typescript
try {
  const { data } = await createOrder({ variables: input });
  if (data.createOrder.success) {
    router.push(`/thanh-toan/thanh-cong?order=${data.createOrder.order.orderNumber}`);
  } else {
    toast.error(data.createOrder.message);
  }
} catch (error) {
  toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
  console.error(error);
}
```

### Loading States:
```typescript
{loading && <Skeleton />}
{error && <Alert variant="destructive">{error.message}</Alert>}
{data && <OrderList orders={data.orders} />}
```

### Optimistic Updates:
```typescript
const [updateCart] = useMutation(UPDATE_CART_ITEM, {
  optimisticResponse: {
    updateCartItem: {
      __typename: 'UpdateCartResponse',
      success: true,
      cart: {
        // ... optimistic data
      }
    }
  },
  update: (cache, { data }) => {
    // Update cache
  }
});
```

---

## 📝 Checklist Cuối Cùng

### Code Quality:
- [ ] TypeScript strict mode enabled
- [ ] No console.log in production
- [ ] All components have proper types
- [ ] Error boundaries implemented
- [ ] Proper loading states
- [ ] Proper error states

### Accessibility:
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus management
- [ ] Color contrast meets WCAG AA

### Performance:
- [ ] Images optimized
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Memoization where needed
- [ ] Bundle size < 300kb (initial)

### Testing:
- [ ] Manual testing on Chrome, Firefox, Safari
- [ ] Mobile testing (iOS, Android)
- [ ] Guest user flow works
- [ ] Authenticated user flow works
- [ ] Error scenarios handled

### Documentation:
- [ ] README updated
- [ ] API docs updated
- [ ] Component docs (Storybook nếu có)
- [ ] Deployment guide

---

## 🎯 Kết Luận

Dự án đã có **backend hoàn chỉnh** cho E-commerce. Cần bổ sung:

1. **7 trang frontend mới**
2. **6 shared components**
3. **GraphQL queries update**
4. **Hoàn thiện 2 trang hiện có**

Ước tính: **~3,000-4,000 lines code** cần viết.

Thời gian: **2-3 tuần** (1 developer, full-time).

**Tech Stack**:
- Frontend: Next.js 16, React 19, TypeScript
- UI: shadcn UI v2 (Mobile First + Responsive + PWA)
- GraphQL: Apollo Client
- Animation: framer-motion
- Form: react-hook-form + zod
- Language: Tiếng Việt

**Outcome**: Hệ thống E-commerce hoàn chỉnh, production-ready, chuẩn Senior Engineer.
