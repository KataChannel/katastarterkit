# 🛠️ Hướng Dẫn Test & Debug Order Management

## 🎯 Tổng Quan

Tài liệu này hướng dẫn cách test và debug trang quản lý đơn hàng sau khi refactor.

## 🐛 Khắc Phục Lỗi "Chưa có đơn hàng nào"

### Nguyên nhân có thể:

1. **User chưa login** → Backend yêu cầu authentication
2. **User đã login nhưng chưa có orders** → Database trống
3. **GraphQL query error** → Check console logs

### Giải pháp:

## ✅ Option 1: Sử Dụng Mock Data (Nhanh - Cho Demo)

### Bước 1: Enable Mock Data
```bash
# File đã được tạo: frontend/.env.local
NEXT_PUBLIC_USE_MOCK_ORDERS=true
```

### Bước 2: Restart Frontend
```bash
cd frontend
npm run dev
# hoặc
bun dev
```

### Bước 3: Truy cập trang
```
http://localhost:3000/don-hang
```

**Kết quả**: Trang sẽ hiển thị 5 đơn hàng mẫu với đầy đủ data.

**Lưu ý**: Badge "Demo Mode" sẽ xuất hiện ở góc phải để báo hiệu đang dùng mock data.

---

## ✅ Option 2: Seed Database (Cho Production)

### Bước 1: Kiểm tra User
```bash
cd backend
npx prisma studio
# Mở http://localhost:5555
# Kiểm tra bảng User → Cần có ít nhất 1 user
```

### Bước 2: Kiểm tra Products
```bash
# Trong Prisma Studio
# Kiểm tra bảng Product → Cần có ít nhất 1 product với status = 'PUBLISHED'
```

### Bước 3: Run Seed Script
```bash
cd backend
npx ts-node scripts/seed-orders.ts
```

**Output mẫu**:
```
🌱 Starting order seeding...
✅ Found user: admin@example.com (user-id-123)
✅ Found 10 products
🗑️  Deleting 0 existing orders...
✅ Created order 1/5: ORD-1699876543-1 (PENDING)
✅ Created order 2/5: ORD-1699876543-2 (CONFIRMED)
✅ Created order 3/5: ORD-1699876543-3 (PROCESSING)
✅ Created order 4/5: ORD-1699876543-4 (SHIPPING)
✅ Created order 5/5: ORD-1699876543-5 (DELIVERED)

🎉 Order seeding completed successfully!
Created 5 sample orders for user: admin@example.com
```

### Bước 4: Disable Mock Data (nếu đã enable)
```bash
# Sửa frontend/.env.local
NEXT_PUBLIC_USE_MOCK_ORDERS=false
```

### Bước 5: Login & Test
```bash
# 1. Login với user account đã có orders
http://localhost:3000/login

# 2. Truy cập trang orders
http://localhost:3000/don-hang
```

---

## 🔍 Debug GraphQL Query

### Kiểm tra Console Logs
```javascript
// Mở browser console (F12)
// Tìm log: "Orders Query Result: { data, loading, error }"

// Nếu error: 
// - "Authentication required" → Chưa login
// - "Network error" → Backend không chạy
// - Other errors → Check backend logs
```

### Test GraphQL Trực Tiếp
```bash
# 1. Mở GraphQL Playground
http://localhost:4000/graphql

# 2. Set Headers (cần JWT token)
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

# 3. Run Query
query GetMyOrders {
  getMyOrders(skip: 0, take: 10) {
    orders {
      id
      orderNumber
      status
      total
      items {
        productName
        quantity
        price
      }
    }
    total
    hasMore
  }
}
```

### Lấy JWT Token
```bash
# Option 1: Từ browser console
localStorage.getItem('token')

# Option 2: Từ browser DevTools
# Application tab → Local Storage → token

# Option 3: Login API
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"admin@example.com\", password: \"password\") { token } }"
  }'
```

---

## 📊 Kiểm Tra Database

### Prisma Studio
```bash
cd backend
npx prisma studio
```

### SQL Query Trực Tiếp
```sql
-- Kiểm tra orders của user
SELECT o.id, o.orderNumber, o.status, o.total, o.userId
FROM "Order" o
WHERE o.userId = 'USER_ID_HERE'
ORDER BY o.createdAt DESC;

-- Đếm số orders
SELECT COUNT(*) FROM "Order" WHERE userId = 'USER_ID_HERE';

-- Xem order items
SELECT oi.*, o.orderNumber
FROM "OrderItem" oi
JOIN "Order" o ON oi.orderId = o.id
WHERE o.userId = 'USER_ID_HERE';
```

---

## 🚀 Testing Workflow

### 1. Test Empty State
```bash
# Xóa tất cả orders của user
DELETE FROM "OrderItem" WHERE orderId IN (
  SELECT id FROM "Order" WHERE userId = 'USER_ID'
);
DELETE FROM "Order" WHERE userId = 'USER_ID';
```
**Kỳ vọng**: Hiển thị OrderEmptyState với CTA "Mua sắm ngay"

### 2. Test Filtering
```bash
# Tạo orders với các status khác nhau
# Sau đó test filter dropdown
```
**Kỳ vọng**: 
- Filter "Tất cả" → Hiển thị tất cả
- Filter "Đang giao" → Chỉ hiển thị orders với status SHIPPING
- Search → Filter theo order number hoặc product name

### 3. Test Mobile Responsive
```bash
# Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
# Test các breakpoints:
# - Mobile: 375px
# - Tablet: 768px
# - Desktop: 1024px
```

### 4. Test Order Detail
```bash
# Click vào một order card
# Hoặc truy cập trực tiếp:
http://localhost:3000/don-hang/ORD-1699876543-1
```

---

## 🔧 Troubleshooting

### Lỗi: "Authentication required"
**Giải pháp**:
1. Đảm bảo đã login
2. Check JWT token trong localStorage
3. Token có thể đã expired → Login lại

### Lỗi: "Network error"
**Giải pháp**:
1. Check backend có đang chạy không:
   ```bash
   curl http://localhost:4000/graphql
   ```
2. Check CORS settings trong backend
3. Check GraphQL endpoint URL trong frontend config

### Lỗi: Query trả về null/empty
**Giải pháp**:
1. Check userId có đúng không
2. Check database có orders không
3. Check query filter có đúng không
4. Enable mock data để test UI trước

### Mock data không hiển thị
**Giải pháp**:
1. Check `.env.local` file exists
2. Check environment variable: `NEXT_PUBLIC_USE_MOCK_ORDERS=true`
3. Restart frontend server
4. Clear browser cache

---

## 📝 Files Quan Trọng

```
frontend/
├── src/
│   ├── app/(website)/don-hang/
│   │   ├── page.tsx                    # Order list page (refactored)
│   │   └── [orderNumber]/page.tsx      # Order detail page (refactored)
│   ├── components/ecommerce/
│   │   ├── OrderFilters.tsx            # Filter component
│   │   ├── OrderCard.tsx               # Order card component
│   │   ├── OrderItemPreview.tsx        # Item preview component
│   │   ├── OrderEmptyState.tsx         # Empty state component
│   │   ├── OrderSummaryCard.tsx        # Summary card component
│   │   └── ShippingAddressCard.tsx     # Address card component
│   ├── hooks/
│   │   └── useOrderFilters.ts          # Filter logic hook
│   ├── types/
│   │   └── order.types.ts              # Shared types
│   ├── lib/
│   │   └── mockOrderData.ts            # Mock data for testing
│   └── graphql/
│       └── ecommerce.queries.ts        # GraphQL queries
└── .env.local                           # Environment variables

backend/
├── src/
│   ├── graphql/resolvers/
│   │   └── order.resolver.ts           # Order GraphQL resolver
│   └── services/
│       └── order.service.ts            # Order business logic
└── scripts/
    └── seed-orders.ts                  # Seed script
```

---

## 🎯 Quick Commands

```bash
# Enable mock data
echo "NEXT_PUBLIC_USE_MOCK_ORDERS=true" >> frontend/.env.local

# Disable mock data  
echo "NEXT_PUBLIC_USE_MOCK_ORDERS=false" > frontend/.env.local

# Seed database
cd backend && npx ts-node scripts/seed-orders.ts

# Start Prisma Studio
cd backend && npx prisma studio

# Restart frontend
cd frontend && npm run dev

# Check backend
curl http://localhost:4000/graphql

# View logs
# Frontend: Browser console (F12)
# Backend: Terminal where server is running
```

---

## 📚 Documentation

- [REFACTOR_DON_HANG_ECOMMERCE.md](../REFACTOR_DON_HANG_ECOMMERCE.md) - Tài liệu refactoring đầy đủ
- [rulepromt.txt](../promt/rulepromt.txt) - Coding rules
- Components documentation - JSDoc trong từng file component

---

**Last Updated**: 2024-11-11  
**Version**: 1.0.0  
**Author**: GitHub Copilot
