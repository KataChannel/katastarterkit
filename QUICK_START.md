# 🚀 QUICK START GUIDE - E-COMMERCE & BLOG SYSTEM

## ⚡ TL;DR - Start Here

```bash
# 1. Run setup script
chmod +x setup-ecommerce-blog.sh
./setup-ecommerce-blog.sh

# 2. Start dev servers
bun run dev

# 3. Test the system
# - Products: http://localhost:12000/sanpham
# - Blog: http://localhost:12000/baiviet
# - GraphQL: http://localhost:12001/graphql
```

---

## 📁 Key Files

### Documentation (READ FIRST)
```
✅ IMPLEMENTATION_SUMMARY.md        # Overview của toàn bộ system
✅ docs/ECOMMERCE_BLOG_IMPLEMENTATION_GUIDE.md  # Chi tiết technical
✅ docs/IMPLEMENTATION_CHECKLIST.md  # 150+ tasks checklist
```

### Database
```
✅ backend/prisma/schema.prisma     # 18 models added/enhanced
✅ backend/prisma/migrations/README_ECOMMERCE_BLOG.sql  # Migration guide
```

### GraphQL Schemas
```
✅ backend/src/graphql/schemas/ecommerce/cart.schema.ts   # Cart API
✅ backend/src/graphql/schemas/ecommerce/order.schema.ts  # Order API
```

---

## 🎯 What You Got

### ✅ Completed (Ready to Use)
1. **Database Schema** - 18 models với full relations
2. **GraphQL Types** - Cart & Order schemas
3. **Documentation** - 1,300+ lines comprehensive guide
4. **Setup Scripts** - Automated deployment
5. **Checklist** - 150+ implementation tasks

### ⏳ Next Steps (TODO)
1. Run database migration
2. Implement CartService
3. Implement OrderService
4. Create GraphQL resolvers
5. Build frontend pages

---

## 🗄️ Database Models Added

### E-Commerce (8 models)
- `Cart` + `CartItem` - Shopping cart
- `Order` + `OrderItem` - Orders
- `OrderTracking` + `OrderTrackingEvent` - Tracking
- `Payment` - Payments
- `InventoryLog` - Stock tracking
- `ProductReview` - Reviews
- `Wishlist` + `WishlistItem` - Favorites

### Blog (5 models - Enhanced)
- `BlogCategory` - Categories (hierarchical)
- `BlogPost` - Posts (với SEO, social)
- `BlogComment` - Comments (threaded)
- `BlogTag` + `BlogPostTag` - Tags
- `BlogPostShare` - Social sharing tracking

---

## 🚦 Migration Commands

```bash
# Format schema
cd backend
bunx prisma format

# Create migration
bunx prisma migrate dev --name ecommerce_blog_system

# Generate client
bunx prisma generate

# View in Prisma Studio
bunx prisma studio
```

---

## 📊 API Examples

### Cart API
```graphql
# Add to cart
mutation {
  addToCart(input: {
    productId: "prod-123"
    quantity: 2
  }) {
    success
    cart {
      id
      itemCount
      total
    }
  }
}

# Get cart
query {
  getCart {
    items {
      product { name price }
      quantity
      subtotal
    }
    total
  }
}
```

### Order API
```graphql
# Create order
mutation {
  createOrder(input: {
    cartId: "cart-123"
    shippingAddress: {
      name: "Nguyễn Văn A"
      phone: "0901234567"
      address: "123 ABC Street"
      city: "HCM"
      district: "Quận 1"
      ward: "Phường 1"
    }
    paymentMethod: CASH_ON_DELIVERY
  }) {
    success
    order {
      orderNumber
      total
      status
    }
  }
}

# Track order
query {
  getOrderByNumber(
    orderNumber: "ORD-2025-0001"
    email: "customer@example.com"
  ) {
    status
    tracking {
      status
      events {
        description
        eventTime
      }
    }
  }
}
```

---

## 🎨 Frontend Pages Structure

### Code Routes (High Performance)
```
/sanpham                    # Product listing
/san-pham/[slug]           # Product detail
/baiviet                   # Blog listing
/baiviet/[slug]           # Blog detail
/gio-hang                  # Shopping cart
/checkout                  # Checkout flow
/checkout/payment          # Payment
/checkout/success          # Confirmation
/don-hang                  # Order history
/don-hang/[id]            # Order tracking
```

### PageBuilder Routes (Marketing Flexibility)
```
/                          # Homepage
/gioi-thieu               # About
/lien-he                  # Contact
/khuyen-mai/[slug]        # Campaign pages
/[slug]                   # Catch-all
```

### Hybrid (Dynamic Templates)
```
Product Detail Template    # Code + PageBuilder
Blog Post Template        # Code + PageBuilder
```

---

## 💻 Service Implementation Pattern

### Example: CartService
```typescript
// backend/src/services/cart.service.ts
@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async addItem(cartId: string, item: AddItemDto) {
    // 1. Validate stock
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId }
    });
    
    if (product.stock < item.quantity) {
      throw new Error('Out of stock');
    }

    // 2. Add to cart
    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: product.price, // Snapshot
      }
    });

    // 3. Update cache
    await this.invalidateCartCache(cartId);

    return this.getCart(cartId);
  }

  async getCart(cartId: string) {
    // Try cache first
    const cached = await this.redis.get(`cart:${cartId}`);
    if (cached) return JSON.parse(cached);

    // Fetch from DB
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true, variant: true }
        }
      }
    });

    // Cache for 1 hour
    await this.redis.setex(
      `cart:${cartId}`,
      3600,
      JSON.stringify(cart)
    );

    return cart;
  }
}
```

---

## 🔧 Environment Setup

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:port/database"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"

# Payment Gateways
VNPAY_TMN_CODE=""
VNPAY_HASH_SECRET=""
VNPAY_URL=""

MOMO_PARTNER_CODE=""
MOMO_ACCESS_KEY=""
MOMO_SECRET_KEY=""

# Email
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:12001/graphql"
NEXT_PUBLIC_API_URL="http://localhost:12001"
NEXT_PUBLIC_SITE_URL="http://localhost:12000"
```

---

## 📈 Performance Targets

```
Page Load:           < 2s
Time to Interactive: < 3s
GraphQL Query:       < 100ms
Cart Operations:     < 50ms (with Redis)
Database Query:      < 50ms (with indexes)
```

---

## 🧪 Testing Commands

```bash
# Unit tests
bun test

# E2E tests
bun test:e2e

# Coverage
bun test:cov

# Watch mode
bun test:watch
```

---

## 🚀 Deployment Checklist

```
□ Environment variables configured
□ Database migrated
□ Redis configured
□ Email service setup
□ Payment gateway configured
□ SSL certificate installed
□ CDN configured
□ Monitoring setup (Sentry)
□ Analytics setup (GA)
□ Smoke tests passed
```

---

## 📞 Support & Resources

### Documentation
- Main Guide: `docs/ECOMMERCE_BLOG_IMPLEMENTATION_GUIDE.md`
- Checklist: `docs/IMPLEMENTATION_CHECKLIST.md`
- Summary: `IMPLEMENTATION_SUMMARY.md`

### External Resources
- [Prisma Docs](https://www.prisma.io/docs)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [Next.js Commerce](https://nextjs.org/commerce)

---

## ⚠️ Important Notes

1. **Backup before migration**: `pg_dump database > backup.sql`
2. **Test in development first**: Never run migrations on production directly
3. **Old Blog models removed**: Blog, BlogCategory, BlogTag replaced
4. **User model updated**: 9 new relations added
5. **Product model updated**: 5 new relations added

---

## 🎯 Priority Actions

1. ✅ Read `IMPLEMENTATION_SUMMARY.md`
2. ⬜ Run database migration
3. ⬜ Implement CartService
4. ⬜ Implement OrderService
5. ⬜ Create GraphQL resolvers
6. ⬜ Build Product pages
7. ⬜ Build Checkout flow
8. ⬜ Build Blog pages

---

**Status**: ✅ Phase 1 Complete - Ready for Implementation  
**Next**: Run Migration → Implement Services → Build Pages  
**ETA**: 2-3 weeks for full implementation

🚀 **Let's build something amazing!**
