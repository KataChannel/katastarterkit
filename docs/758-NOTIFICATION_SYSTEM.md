# 🔔 Hệ Thống Notification & Push Notification

## 📋 Tổng Quan

Hệ thống notification đã được triển khai hoàn chỉnh cho chức năng đặt hàng thành công, bao gồm:

- **Database Notification**: Lưu trữ notification trong PostgreSQL
- **Real-time Notification**: Gửi qua websocket + push notification
- **Email Notification**: Gửi email cho ORDER type
- **UI Component**: Notification bell trên header với dropdown list

## 🏗️ Kiến Trúc

### Backend Layer

**1. NotificationService** (`backend/src/services/notification.service.ts`)
- `create()`: Tạo notification mới (database + real-time)
- `createOrderNotification()`: Tạo notification khi đặt hàng thành công
- `getNotifications()`: Lấy danh sách notifications với filters
- `getUnreadCount()`: Đếm số notification chưa đọc
- `markAsRead()`: Đánh dấu đã đọc
- `markAllAsRead()`: Đánh dấu tất cả đã đọc
- `delete()`: Xóa notification
- `deleteAllRead()`: Xóa tất cả đã đọc

**2. OrderService Integration** (`backend/src/services/order.service.ts`)
```typescript
// Sau khi tạo order thành công
await this.notificationService.createOrderNotification(
  userId,
  input.guestEmail,
  order.orderNumber,
  order.total,
  order,
);
```

**3. NotificationResolver** (`backend/src/graphql/resolvers/notification.resolver.ts`)
- `getNotifications`: Query danh sách notifications
- `getUnreadNotificationsCount`: Query số notification chưa đọc
- `markNotificationAsRead`: Mutation đánh dấu đã đọc
- `markAllNotificationsAsRead`: Mutation đánh dấu tất cả đã đọc
- `deleteNotification`: Mutation xóa notification
- `deleteAllReadNotifications`: Mutation xóa tất cả đã đọc

**4. RealTimeNotificationService** (`backend/src/realtime/real-time-notification.service.ts`)
- Gửi notification qua websocket
- Gửi push notification
- Gửi email notification (cho ORDER type)
- Hỗ trợ offline queue

### Frontend Layer

**1. GraphQL Queries** (`frontend/src/graphql/notification.queries.ts`)
```graphql
GET_NOTIFICATIONS
GET_UNREAD_NOTIFICATIONS_COUNT
MARK_NOTIFICATION_AS_READ
MARK_ALL_NOTIFICATIONS_AS_READ
DELETE_NOTIFICATION
DELETE_ALL_READ_NOTIFICATIONS
```

**2. NotificationBell Component** (`frontend/src/components/notifications/NotificationBell.tsx`)
- Icon bell với badge hiển thị số notification chưa đọc
- Dropdown menu hiển thị danh sách notifications
- Auto-refresh mỗi 30 giây
- Hỗ trợ đánh dấu đã đọc/xóa từng notification
- Tích hợp push notification permission request

**3. Push Notification Hook** (`frontend/src/hooks/usePushNotifications.ts`)
- `requestPermission()`: Request push notification permission
- `sendNotification()`: Gửi push notification
- `isSupported`: Check browser support
- `permission`: Trạng thái permission hiện tại

**4. Website Header Integration** (`frontend/src/components/layout/website-header.tsx`)
- NotificationBell component được thêm vào header (mobile + desktop)
- Vị trí: giữa logo và shopping cart icon

## 📊 Database Schema

```prisma
model Notification {
  id          String   @id @default(uuid())
  userId      String
  title       String
  message     String
  type        String   // ORDER, SYSTEM, PROMOTION, TASK, MENTION
  isRead      Boolean  @default(false)
  data        Json?
  taskId      String?
  mentionedBy String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user      User  @relation("UserNotifications", ...)
  task      Task? @relation(...)
  mentioner User? @relation("NotificationMentioner", ...)
}
```

## 🎯 Flow Đặt Hàng Thành Công

1. User đặt hàng thành công qua `OrderService.createFromCart()`
2. Order được tạo trong database với transaction
3. `NotificationService.createOrderNotification()` được gọi
4. Notification được tạo cho:
   - **Customer** (nếu có userId): "🎉 Đặt hàng thành công"
   - **Admin** (tất cả admin active): "🛍️ Đơn hàng mới"
5. Real-time notification được gửi qua:
   - **Websocket**: Cập nhật UI ngay lập tức
   - **Push Notification**: Hiển thị browser notification
   - **Email**: Gửi email xác nhận (cho ORDER type)
6. Frontend NotificationBell tự động cập nhật badge count

## 🔧 Cấu Hình

### Backend Module (`backend/src/ecommerce/ecommerce.module.ts`)
```typescript
@Module({
  imports: [PrismaModule],
  providers: [
    RedisService,
    AdvancedCacheService,
    PerformanceMetricsService,
    RealTimeNotificationService,
    NotificationService,
    CartService,
    OrderService,
    CartResolver,
    OrderResolver,
    NotificationResolver,
  ],
  exports: [CartService, OrderService, NotificationService],
})
```

### Frontend Auto-Request Permission
NotificationBell tự động request push notification permission sau 2 giây khi user đăng nhập:
```typescript
useEffect(() => {
  if (isAuthenticated && permission === 'default') {
    const timer = setTimeout(() => {
      requestPermission();
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [isAuthenticated, permission, requestPermission]);
```

## ✨ Features

### Customer Notifications
- ✅ Thông báo đặt hàng thành công
- ✅ Hiển thị order number và tổng giá trị
- ✅ Real-time update qua websocket
- ✅ Push notification trên browser
- ✅ Email xác nhận đơn hàng

### Admin Notifications
- ✅ Thông báo đơn hàng mới
- ✅ Hiển thị thông tin customer (email/ẩn danh)
- ✅ Hiển thị order number và giá trị
- ✅ Badge đỏ cho notification chưa đọc
- ✅ Real-time update

### UI/UX
- ✅ Mobile First design
- ✅ Responsive layout
- ✅ Icon emoji cho từng loại notification
- ✅ Time ago (VN locale) cho timestamp
- ✅ Dropdown scrollable với max 20 items
- ✅ Hover actions (mark read, delete)
- ✅ Empty state design
- ✅ Loading state
- ✅ Badge count (99+ khi > 99)

## 🚀 Cách Sử Dụng

### Test Notification System

1. **Đăng nhập vào website**
2. **Thêm sản phẩm vào giỏ hàng**
3. **Đi đến trang thanh toán**
4. **Hoàn tất đơn hàng**
5. **Kiểm tra notification bell** - sẽ có badge đỏ hiển thị
6. **Click vào bell icon** - xem notification dropdown
7. **Push notification** - nếu đã cho phép, sẽ hiển thị browser notification

### Admin Dashboard

1. **Đăng nhập với tài khoản ADMIN**
2. **Notification bell sẽ hiển thị đơn hàng mới**
3. **Click để xem chi tiết**
4. **Đánh dấu đã đọc hoặc xóa**

## 📝 Notes

- **RealTimeNotificationService**: Đang dùng placeholder cho email/SMS (cần tích hợp service thật)
- **Push Notification**: Cần service worker đã được setup sẵn trong `frontend/public/sw.js`
- **Offline Queue**: Notification sẽ được queue nếu user offline và gửi khi online
- **Auto Polling**: Frontend poll mỗi 30 giây để cập nhật notification count
- **Permission Request**: Chỉ request 1 lần khi user đăng nhập lần đầu

## 🔐 Security

- ✅ Authentication required cho tất cả notification endpoints
- ✅ User chỉ xem được notification của mình
- ✅ JwtAuthGuard protect tất cả queries/mutations
- ✅ Validation userId trong resolver

## 🎨 UI Components

- **shadcn/ui**: DropdownMenu, Button, Badge, ScrollArea
- **Lucide Icons**: Bell, Check, Trash2, X
- **date-fns**: Format timestamp (VN locale)
- **Tailwind CSS**: Responsive styling

## 🔄 Future Enhancements

- [ ] Mark as read when user clicks notification
- [ ] Navigate to order detail page when click notification
- [ ] Filter notifications by type
- [ ] Pagination for notification list
- [ ] Email service integration (SendGrid/AWS SES)
- [ ] SMS notification integration
- [ ] Push notification for order status updates
- [ ] Notification preferences settings

---

**Tác giả**: GitHub Copilot  
**Ngày tạo**: 19/11/2025  
**Version**: 1.0
