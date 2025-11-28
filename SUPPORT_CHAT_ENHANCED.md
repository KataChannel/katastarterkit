# Tính Năng Support Chat Nâng Cao - Real-time

## Tổng Quan

Đã cập nhật hệ thống support chat với các tính năng nâng cao:
- **Popup chat** với nhiều phương thức xác thực
- **Real-time messaging** với WebSocket
- **Customer identification** và tracking
- **Social login** (Zalo, Facebook, Google)

## Các Thay Đổi Chính

### 1. Database Schema (Prisma)

#### Thêm Enum CustomerAuthType
```prisma
enum CustomerAuthType {
  GUEST
  PHONE
  ZALO
  FACEBOOK
  GOOGLE
  USER_ACCOUNT
}
```

#### Cập nhật SupportConversation Model
- `authType`: Loại xác thực khách hàng
- `socialAuthId`: ID từ social platform
- `socialAuthToken`: Access token từ social
- `socialAuthData`: Dữ liệu profile (JSON)
- `customerIdentifier`: Unique identifier để tracking

#### Cập nhật SupportMessage Model
- `customerAuthType`: Loại khách hàng khi gửi message
- `customerAuthIcon`: Icon emoji để hiển thị (👤📱💬👥🔍)

### 2. Backend Services

#### SocialAuthService
**File**: `backend/src/support-chat/services/social-auth.service.ts`

Chức năng:
- Verify Zalo OAuth token
- Verify Facebook OAuth token  
- Verify Google OAuth token
- Generate customer identifier
- Get auth icon for display

#### SupportConversationService Updates
**Method**: `createConversationWithAuth()`

Hỗ trợ tạo conversation với:
- Guest (chỉ tên)
- Phone authentication (tên + số điện thoại)
- Social login (Zalo, Facebook, Google)

#### SupportMessageService Updates
**Method**: `createMessage()` - Enhanced

- Track `customerAuthType` trong mỗi message
- Auto-generate `customerAuthIcon` based on auth type
- Maintain authentication context

### 3. Real-time Gateway

#### SupportChatGateway Updates
**File**: `backend/src/support-chat/gateways/support-chat.gateway.ts`

**New Events**:
- `update_customer_auth`: Cập nhật thông tin auth của customer
- `customer_auth_updated`: Broadcast khi auth được cập nhật

**Enhanced Events**:
- `send_message`: Bao gồm `customerAuthType`

### 4. GraphQL API

#### New Mutation
```graphql
mutation CreateSupportConversationWithAuth($input: CreateConversationWithAuthInput!) {
  createSupportConversationWithAuth(input: $input) {
    id
    conversationCode
    customerName
    authType
    platform
  }
}
```

#### Input Type
```typescript
CreateConversationWithAuthInput {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  authType: string // GUEST, PHONE, ZALO, FACEBOOK, GOOGLE
  socialAccessToken?: string
  platform?: string
}
```

### 5. Frontend - Chat Widget Enhanced

#### SupportChatWidgetEnhanced Component
**File**: `frontend/src/components/support-chat/SupportChatWidgetEnhanced.tsx`

**Tính năng**:

##### Auth Options
- **Tab 1 - Số điện thoại**: Nhập tên + số điện thoại
- **Tab 2 - Đăng nhập**: Buttons cho Zalo, Facebook, Google

##### Customer Identification
- Hiển thị icon theo auth type trong messages
- Track auth type cho từng message
- Real-time sync auth info

##### Message Display
```typescript
// Icons hiển thị:
GUEST: '👤'
PHONE: '📱'
ZALO: '💬'
FACEBOOK: '👥'
GOOGLE: '🔍'
USER_ACCOUNT: '🔐'
```

##### Props
```typescript
interface SupportChatWidgetEnhancedProps {
  apiUrl?: string
  websocketUrl?: string
  primaryColor?: string
  position?: 'bottom-right' | 'bottom-left'
  enableZaloLogin?: boolean
  enableFacebookLogin?: boolean
  enableGoogleLogin?: boolean
}
```

## Luồng Hoạt Động

### 1. Guest với Phone Number
```
User mở chat → Nhập tên + SĐT → Submit
→ Backend tạo conversation với authType='PHONE'
→ WebSocket join conversation
→ Messages có icon 📱
```

### 2. Social Login (Zalo/Facebook/Google)
```
User mở chat → Click "Đăng nhập với X"
→ OAuth flow → Nhận access token
→ Backend verify token với social platform
→ Lấy profile data (name, email, avatar)
→ Tạo conversation với authType='ZALO|FACEBOOK|GOOGLE'
→ Store socialAuthId, socialAuthData
→ Messages có icon tương ứng (💬👥🔍)
```

### 3. Message Tracking
```
Khi customer gửi message:
→ Include customerAuthType
→ Backend auto-generate customerAuthIcon
→ Store trong SupportMessage
→ Real-time broadcast với icon
→ Agent thấy icon trong message list
```

## Cấu Hình Cần Thiết

### Environment Variables

Xem file `.env.support-chat.example` để có danh sách đầy đủ các biến môi trường cần thiết.

#### Backend (.env)
```env
# Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Zalo (optional - for backend verification)
ZALO_APP_ID=your_zalo_app_id
ZALO_APP_SECRET=your_zalo_app_secret

# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend (.env.local)
```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001/support-chat

# Social Auth
NEXT_PUBLIC_ZALO_APP_ID=your_zalo_app_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### OAuth Redirect URIs Setup

#### Zalo
1. Đăng ký app tại: https://developers.zalo.me/
2. Thêm OAuth Redirect URI: `http://localhost:12000/oauth-callback/zalo/callback` (dev)
3. Production: `https://yourdomain.com/oauth-callback/zalo/callback`

#### Facebook
1. Tạo app tại: https://developers.facebook.com/
2. Thêm Facebook Login product
3. OAuth Redirect URI: `http://localhost:12000/oauth-callback/facebook/callback` (dev)
4. Production: `https://yourdomain.com/oauth-callback/facebook/callback`

#### Google
1. Tạo project tại: https://console.cloud.google.com/
2. Enable Google+ API
3. Tạo OAuth 2.0 credentials
4. Authorized redirect URIs: `http://localhost:12000/oauth-callback/google/callback` (dev)
5. Production: `https://yourdomain.com/oauth-callback/google/callback`

## Sử Dụng

### Embed Widget

#### Trong Next.js App
```tsx
import SupportChatWidgetEnhanced from '@/components/support-chat/SupportChatWidgetEnhanced';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <SupportChatWidgetEnhanced
        apiUrl={process.env.NEXT_PUBLIC_API_URL}
        websocketUrl={process.env.NEXT_PUBLIC_WS_URL}
        primaryColor="#2563eb"
        position="bottom-right"
        enableZaloLogin={true}
        enableFacebookLogin={true}
        enableGoogleLogin={true}
      />
    </>
  );
}
```

#### Demo Page
Xem demo tại: `/demo/support-chat-enhanced`

#### Custom Configuration
```tsx
<SupportChatWidgetEnhanced
  apiUrl="https://api.yourdomain.com"
  websocketUrl="https://api.yourdomain.com/support-chat"
  primaryColor="#10b981"  // Custom color
  position="bottom-left"  // Left side
  enableZaloLogin={true}
  enableFacebookLogin={false}  // Disable Facebook
  enableGoogleLogin={true}
/>
```

## Database Migration

Chạy migration để cập nhật schema:

```bash
cd backend
bun run db:migrate
# hoặc
bun prisma migrate dev --name add_customer_auth_tracking
```

## Testing

### Test Guest Chat
1. Mở widget
2. Tab "Số điện thoại"
3. Nhập tên + SĐT
4. Gửi messages
5. Verify icon 📱 hiển thị

### Test Social Login
1. Mở widget
2. Tab "Đăng nhập"
3. Click button social
4. Hoàn thành OAuth flow
5. Verify icon social hiển thị trong messages

## Lưu Ý

### Routing Structure
⚠️ **Important**: OAuth callbacks được đặt trong `/oauth-callback/` để tránh xung đột với route group `(auth)/`
- `app/(auth)/` → Login, Register, Forgot Password pages (no URL segment)
- `app/oauth-callback/` → OAuth callbacks (có URL segment `/oauth-callback/`)

### Social OAuth Implementation
- Zalo, Facebook, Google OAuth flows cần implement đầy đủ trên frontend
- Cần đăng ký apps trên các platforms và lấy credentials
- Access tokens cần được validate trên backend trước khi sử dụng

### Security
- Access tokens được store encrypted
- Validate tokens với social platforms
- Không expose sensitive data trong responses

### Performance
- WebSocket connection được tái sử dụng
- Messages được cache locally
- Optimistic updates cho UX tốt hơn

## Tích Hợp Với Admin Dashboard

Admin dashboard hiện có sẽ tự động nhận:
- Customer auth type từ conversation
- Icons trong message list
- Customer identification data
- Social profile info (nếu có)

## Next Steps

1. Implement đầy đủ OAuth flows cho Zalo, Facebook, Google
2. Add file upload support
3. Add quick replies based on customer type
4. Add analytics tracking theo auth type
5. Implement customer history lookup by identifier

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 2024  
**Tác giả**: rausachcore Team
