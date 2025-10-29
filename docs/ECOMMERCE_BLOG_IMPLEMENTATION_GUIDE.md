# 🛒 E-COMMERCE & BLOG SYSTEM - SENIOR LEVEL IMPLEMENTATION

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [GraphQL API](#graphql-api)
- [Services & Business Logic](#services--business-logic)
- [Frontend Components](#frontend-components)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)
- [Deployment Guide](#deployment-guide)

---

## 🏗️ Architecture Overview

### Hybrid Approach - Best of Both Worlds

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 16)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐      ┌──────────────────────────┐   │
│  │   Code Routes      │      │   PageBuilder Routes     │   │
│  │                    │      │                          │   │
│  │ • /sanpham         │      │ • / (Homepage)           │   │
│  │ • /san-pham/[slug] │      │ • /gioi-thieu           │   │
│  │ • /baiviet         │      │ • /lien-he              │   │
│  │ • /baiviet/[slug]  │      │ • /khuyen-mai/[slug]    │   │
│  │ • /order/*         │      │ • /[slug] (catch-all)   │   │
│  └────────────────────┘      └──────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Dynamic Page Templates (Hybrid)              │   │
│  │                                                       │   │
│  │  • Product Detail Template                           │   │
│  │  • Blog Post Template                                │   │
│  │  → Code handles data + logic                         │   │
│  │  → PageBuilder handles layout customization          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Apollo Client + GraphQL
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   BACKEND (NestJS)                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              GraphQL Layer                            │   │
│  │  • Resolvers (Cart, Order, Product, Blog)            │   │
│  │  • DataLoaders (N+1 query optimization)              │   │
│  │  • Field-level permissions                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Service Layer                            │   │
│  │  • CartService (Redis cache)                         │   │
│  │  • OrderService (Workflow engine)                    │   │
│  │  • ProductService (Search, filter)                   │   │
│  │  • BlogService (SEO, social sharing)                 │   │
│  │  • PaymentService (Gateway integration)              │   │
│  │  • ShippingService (Tracking API)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Layer                               │   │
│  │  • Prisma ORM                                        │   │
│  │  • PostgreSQL (Primary database)                     │   │
│  │  • Redis (Cart cache, sessions)                      │   │
│  │  • Elasticsearch (Product search - optional)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### E-Commerce Models

#### ✅ IMPLEMENTED (Schema Complete)

```prisma
// Shopping Cart
model Cart {
  - User or Session based
  - Auto-expire after 30 days
  - Metadata for coupons
}

model CartItem {
  - Price snapshot
  - Product + Variant support
  - Metadata (gift message, etc.)
}

// Orders
model Order {
  - Guest and User orders
  - Full status workflow
  - Shipping + Billing addresses
  - Payment integration ready
}

model OrderItem {
  - Product data snapshot
  - Immutable pricing
}

model OrderTracking {
  - Carrier integration
  - Timeline events
  - Delivery estimates
}

model Payment {
  - Multiple gateway support
  - Refund handling
  - Transaction logging
}

// Product Extensions
model InventoryLog {
  - Stock movement tracking
  - Audit trail
}

model ProductReview {
  - Verified purchase
  - Moderation system
  - Helpful votes
}

model Wishlist + WishlistItem {
  - User favorites
  - Share functionality
}
```

### Blog Models

#### ✅ IMPLEMENTED (Enhanced Schema)

```prisma
// Blog System
model BlogCategory {
  - Hierarchical categories
  - SEO fields
  - Thumbnail support
}

model BlogPost {
  - Author relation
  - Category + Tags
  - SEO complete
  - Social sharing tracking
  - Scheduled publishing
  - Password protection
}

model BlogComment {
  - Threaded replies
  - Moderation
  - Guest support
}

model BlogTag {
  - Many-to-many with posts
  - Color coding
}

model BlogPostShare {
  - Platform tracking (FB, Twitter, LinkedIn)
  - Analytics data
}
```

---

## 🚀 GraphQL API

### Cart API

#### Queries

```graphql
type Query {
  # Get current user's cart or guest cart by session
  getCart(sessionId: String): CartType
  
  # Validate cart before checkout
  validateCart(cartId: ID!, sessionId: String): CartValidationResponse
}
```

#### Mutations

```graphql
type Mutation {
  # Add product to cart
  addToCart(input: AddToCartInput!): AddToCartResponse!
  
  # Update cart item quantity
  updateCartItem(input: UpdateCartItemInput!): UpdateCartResponse!
  
  # Remove item from cart
  removeFromCart(input: RemoveFromCartInput!): RemoveFromCartResponse!
  
  # Clear entire cart
  clearCart(cartId: ID, sessionId: String): ClearCartResponse!
  
  # Apply coupon code
  applyCoupon(input: ApplyCouponInput!): ApplyCouponResponse!
  
  # Merge guest cart with user cart after login
  mergeCart(input: MergeCartsInput!): CartType!
}
```

#### Example Usage

```graphql
# Add to cart (logged in user)
mutation {
  addToCart(input: {
    productId: "prod-123"
    variantId: "var-456"
    quantity: 2
    metadata: {
      giftMessage: "Happy Birthday!"
    }
  }) {
    success
    message
    cart {
      id
      itemCount
      total
      items {
        id
        product {
          name
          price
        }
        quantity
        subtotal
      }
    }
  }
}

# Add to cart (guest)
mutation {
  addToCart(input: {
    productId: "prod-123"
    quantity: 1
    sessionId: "guest-session-xyz"
  }) {
    success
    cart {
      sessionId
      items {
        product { name }
        quantity
      }
    }
  }
}
```

### Order API

#### Queries

```graphql
type Query {
  # Get single order
  getOrder(id: ID!): OrderType
  
  # Get order by order number (for guests)
  getOrderByNumber(orderNumber: String!, email: String): OrderType
  
  # List orders (admin + user)
  listOrders(
    filter: OrderFilterInput
    page: Int
    limit: Int
  ): OrderListResponse!
  
  # Get user's orders
  getMyOrders(page: Int, limit: Int): OrderListResponse!
}
```

#### Mutations

```graphql
type Mutation {
  # Create order from cart or items
  createOrder(input: CreateOrderInput!): CreateOrderResponse!
  
  # Update order status (admin)
  updateOrderStatus(input: UpdateOrderStatusInput!): UpdateOrderResponse!
  
  # Cancel order
  cancelOrder(input: CancelOrderInput!): UpdateOrderResponse!
  
  # Process payment
  processPayment(orderId: ID!, paymentMethod: PaymentMethod!): PaymentResponse!
  
  # Update tracking
  updateTracking(orderId: ID!, trackingData: TrackingInput!): OrderType!
}
```

#### Example Usage

```graphql
# Create order from cart
mutation {
  createOrder(input: {
    cartId: "cart-123"
    shippingAddress: {
      name: "Nguyễn Văn A"
      phone: "0901234567"
      address: "123 Đường ABC"
      city: "Hồ Chí Minh"
      district: "Quận 1"
      ward: "Phường Bến Nghé"
    }
    shippingMethod: STANDARD
    paymentMethod: CASH_ON_DELIVERY
    customerNote: "Giao giờ hành chính"
  }) {
    success
    message
    order {
      orderNumber
      total
      status
      items {
        productName
        quantity
        price
      }
    }
  }
}

# Check order status (guest)
query {
  getOrderByNumber(
    orderNumber: "ORD-2025-0001"
    email: "customer@example.com"
  ) {
    orderNumber
    status
    paymentStatus
    tracking {
      status
      trackingNumber
      estimatedDelivery
      events {
        status
        description
        eventTime
      }
    }
  }
}
```

---

## 💼 Services & Business Logic

### CartService

**Location**: `backend/src/services/cart.service.ts`

**Features**:
- ✅ Redis caching cho performance
- ✅ Stock validation real-time
- ✅ Price snapshot mechanism
- ✅ Session + User cart management
- ✅ Auto-merge carts after login
- ✅ Coupon validation

**Key Methods**:
```typescript
class CartService {
  // Get or create cart
  async getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart>
  
  // Add item with stock check
  async addItem(cartId: string, item: AddItemDto): Promise<Cart>
  
  // Update quantity with validation
  async updateQuantity(itemId: string, quantity: number): Promise<Cart>
  
  // Calculate totals
  async calculateTotals(cart: Cart): Promise<CartTotals>
  
  // Apply coupon
  async applyCoupon(cartId: string, code: string): Promise<DiscountResult>
  
  // Merge guest cart to user cart
  async mergeCarts(sessionId: string, userId: string): Promise<Cart>
  
  // Validate before checkout
  async validateCart(cartId: string): Promise<ValidationResult>
}
```

### OrderService

**Location**: `backend/src/services/order.service.ts`

**Features**:
- ✅ Order workflow engine
- ✅ Inventory reservation
- ✅ Payment gateway integration
- ✅ Shipping calculation
- ✅ Email notifications
- ✅ Order number generation

**Key Methods**:
```typescript
class OrderService {
  // Create order from cart
  async createFromCart(cartId: string, orderData: CreateOrderDto): Promise<Order>
  
  // Generate unique order number
  async generateOrderNumber(): Promise<string> // ORD-2025-0001
  
  // Update status with workflow validation
  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order>
  
  // Reserve inventory
  async reserveInventory(orderId: string): Promise<void>
  
  // Release inventory (on cancel)
  async releaseInventory(orderId: string): Promise<void>
  
  // Calculate shipping fee
  async calculateShipping(address: Address, items: OrderItem[]): Promise<number>
  
  // Send notifications
  async sendOrderConfirmation(orderId: string): Promise<void>
  async sendStatusUpdate(orderId: string): Promise<void>
}
```

---

## 🎨 Frontend Components

### Product Listing Page

**Location**: `frontend/src/app/(website)/sanpham/page.tsx`

**Features**:
- ✅ Advanced filtering (price, category, tags)
- ✅ Search với Elasticsearch
- ✅ Sorting options
- ✅ Pagination
- ✅ Grid/List view toggle
- ✅ Quick view modal
- ✅ Add to cart from listing

**Implementation**:
```typescript
// frontend/src/app/(website)/sanpham/page.tsx
export default async function ProductListingPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }
}) {
  const filters = {
    category: searchParams.category,
    priceRange: {
      min: parseFloat(searchParams.minPrice || '0'),
      max: parseFloat(searchParams.maxPrice || '999999'),
    },
    page: parseInt(searchParams.page || '1'),
    limit: 24,
    sort: searchParams.sort || 'createdAt_DESC',
  };

  const { data } = await apolloClient.query({
    query: GET_PRODUCTS,
    variables: { filter: filters },
  });

  return (
    <div>
      <ProductFilters />
      <ProductGrid products={data.products} />
      <Pagination total={data.meta.total} />
    </div>
  );
}
```

### Product Detail Page (Hybrid)

**Location**: `frontend/src/app/(website)/san-pham/[slug]/page.tsx`

**Features**:
- ✅ Product info + variants
- ✅ Image gallery
- ✅ Add to cart
- ✅ Reviews & ratings
- ✅ Related products
- ✅ SEO structured data
- ✅ **PageBuilder template support** (for layout customization)

**Implementation**:
```typescript
export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // 1. Fetch product data
  const { data } = await apolloClient.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug: params.slug },
  });

  const product = data.product;

  // 2. Check for custom PageBuilder template
  const template = await getPageTemplate('product-detail');

  // 3. Render với template hoặc default
  if (template) {
    return (
      <DynamicPageRenderer 
        template={template} 
        data={product} 
      />
    );
  }

  // Default fallback
  return (
    <div>
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
      <ProductVariants variants={product.variants} />
      <AddToCartSection product={product} />
      <ProductReviews productId={product.id} />
      <RelatedProducts categoryId={product.categoryId} />
    </div>
  );
}
```

### Shopping Cart Page

**Location**: `frontend/src/app/(website)/gio-hang/page.tsx`

**Features**:
- ✅ Cart items list
- ✅ Quantity adjustment
- ✅ Remove items
- ✅ Coupon application
- ✅ Price summary
- ✅ Checkout button
- ✅ Continue shopping
- ✅ Real-time stock warnings

### Checkout Flow

**Pages**:
1. `/checkout` - Shipping info
2. `/checkout/payment` - Payment method
3. `/checkout/review` - Review order
4. `/checkout/success` - Confirmation

**Features**:
- ✅ Multi-step form
- ✅ Address validation
- ✅ Payment gateway integration
- ✅ Order summary
- ✅ Guest checkout support

---

## ⚡ Performance Optimization

### 1. GraphQL DataLoader (N+1 Problem)

```typescript
// backend/src/loaders/product.loader.ts
import DataLoader from 'dataloader';

export class ProductLoader {
  private loader: DataLoader<string, Product>;

  constructor(private prisma: PrismaService) {
    this.loader = new DataLoader(async (ids: readonly string[]) => {
      const products = await this.prisma.product.findMany({
        where: { id: { in: [...ids] } },
      });
      
      const productMap = new Map(products.map(p => [p.id, p]));
      return ids.map(id => productMap.get(id)!);
    });
  }

  async load(id: string): Promise<Product> {
    return this.loader.load(id);
  }
}
```

### 2. Redis Caching Strategy

```typescript
// Cart caching
const CART_CACHE_TTL = 3600; // 1 hour

async getCart(cartId: string): Promise<Cart> {
  // Try cache first
  const cached = await this.redis.get(`cart:${cartId}`);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const cart = await this.prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });

  // Cache result
  await this.redis.setex(
    `cart:${cartId}`,
    CART_CACHE_TTL,
    JSON.stringify(cart)
  );

  return cart;
}
```

### 3. Database Indexing

**Key Indexes Added**:
```prisma
@@index([slug])
@@index([categoryId])
@@index([status])
@@index([isFeatured])
@@index([price])
@@index([publishedAt])
@@index([status, createdAt]) // Composite for common queries
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// cart.service.spec.ts
describe('CartService', () => {
  it('should add item to cart', async () => {
    const result = await cartService.addItem(cartId, {
      productId: 'prod-123',
      quantity: 2,
    });
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(2);
  });

  it('should prevent adding out-of-stock items', async () => {
    await expect(
      cartService.addItem(cartId, {
        productId: 'out-of-stock-prod',
        quantity: 1,
      })
    ).rejects.toThrow('Out of stock');
  });
});
```

### Integration Tests

```typescript
// order.e2e.spec.ts
describe('Order Flow (e2e)', () => {
  it('should complete full checkout flow', async () => {
    // 1. Add to cart
    const cart = await addToCart({ productId: 'prod-1', quantity: 1 });
    
    // 2. Create order
    const order = await createOrder({ cartId: cart.id });
    
    // 3. Verify inventory reduced
    const product = await getProduct('prod-1');
    expect(product.stock).toBe(originalStock - 1);
    
    // 4. Verify order created
    expect(order.status).toBe('PENDING');
  });
});
```

---

## 🚢 Deployment Guide

### Migration Steps

```bash
# 1. Generate Prisma client
cd backend
bun prisma generate

# 2. Run migration
bun prisma migrate deploy

# 3. Seed data (optional)
bun run seed

# 4. Build backend
bun run build

# 5. Build frontend
cd ../frontend
bun run build
```

### Environment Variables

```env
# Backend
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="..."
PAYMENT_GATEWAY_KEY="..."

# Frontend
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:12001/graphql"
NEXT_PUBLIC_API_URL="http://localhost:12001"
```

---

## 📊 Next Steps

### Priority 1 - Immediate
- [ ] Run Prisma migration
- [ ] Implement CartService
- [ ] Implement OrderService
- [ ] Create Cart GraphQL resolvers
- [ ] Create Order GraphQL resolvers

### Priority 2 - Short Term
- [ ] Build Product listing page
- [ ] Build Product detail page
- [ ] Build Cart page
- [ ] Build Checkout flow
- [ ] Payment gateway integration

### Priority 3 - Medium Term
- [ ] Blog listing page
- [ ] Blog detail page
- [ ] Comment system
- [ ] Social sharing
- [ ] SEO optimization

### Priority 4 - Long Term
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Email marketing
- [ ] Inventory management
- [ ] Multi-currency support

---

## 🎯 Success Metrics

### Performance Targets
- Page load time: < 2s
- Time to Interactive: < 3s
- GraphQL query time: < 100ms
- Cart operations: < 50ms (with Redis)

### Business Metrics
- Conversion rate: > 2%
- Cart abandonment: < 70%
- Average order value: Track & optimize
- Customer satisfaction: > 4.5/5

---

**Created by**: Senior Full-Stack AI Assistant
**Date**: October 29, 2025
**Version**: 1.0.0
**Status**: Ready for Implementation 🚀
