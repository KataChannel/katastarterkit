# 📊 HƯỚNG DẪN TÍCH HỢP ANALYTICS & SUPPORT CHAT

> **Ngày cập nhật**: 01/12/2025  
> **Phiên bản**: 1.0.0  
> **Tác giả**: KataCore Team

---

## MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Phần 1: Cấu hình Analytics cho Footer](#phần-1-cấu-hình-analytics-cho-footer)
3. [Phần 2: Cấu hình đăng nhập Support Chat](#phần-2-cấu-hình-đăng-nhập-support-chat)
4. [Phần 3: Tổng hợp biến môi trường](#phần-3-tổng-hợp-biến-môi-trường)
5. [Checklist tích hợp](#checklist-tích-hợp)

---

## TỔNG QUAN

Dự án RauSach đã có sẵn hệ thống **Analytics** và **Support Chat** hoàn chỉnh. Tài liệu này hướng dẫn cách cấu hình để sử dụng các tính năng này.

### Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  website-footer │  │ SupportChatWidget│  │ OAuth Callbacks │  │
│  │  (Thống kê GA)  │  │ (Chat realtime) │  │ (Social Login)  │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
│  ┌────────▼────────┐  ┌────────▼────────┐          │           │
│  │ useVisitorStats │  │ Socket.IO Client│◄─────────┘           │
│  │     (Hook)      │  │                 │                       │
│  └────────┬────────┘  └────────┬────────┘                       │
└───────────┼────────────────────┼────────────────────────────────┘
            │ GraphQL            │ WebSocket
            ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (NestJS)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │AnalyticsService │  │ SupportChatGateway│ │SocialAuthService│  │
│  │  (GA4 API)      │  │   (WebSocket)   │  │  (OAuth verify) │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌───────────────────┐  ┌────────────────┐  ┌───────────────────┐
│  Google Analytics │  │   PostgreSQL   │  │ Zalo/FB/Google    │
│      GA4 API      │  │   + Redis      │  │    OAuth APIs     │
└───────────────────┘  └────────────────┘  └───────────────────┘
```

---

## PHẦN 1: CẤU HÌNH ANALYTICS CHO FOOTER

### 1.1. Tổng quan hệ thống Analytics

| Component | File | Chức năng |
|-----------|------|-----------|
| Backend Service | `backend/src/analytics/analytics.service.ts` | Kết nối Google Analytics GA4 |
| Backend Resolver | `backend/src/analytics/analytics.resolver.ts` | GraphQL API |
| Frontend Hook | `frontend/src/hooks/useVisitorStats.ts` | Hook lấy dữ liệu |
| Footer Component | `frontend/src/components/layout/website-footer.tsx` | Hiển thị thống kê |

### 1.2. Cách cấu hình Google Analytics

#### Bước 1: Tạo Service Account trên Google Cloud

```bash
# 1. Vào Google Cloud Console: https://console.cloud.google.com
# 2. Tạo Project mới hoặc chọn Project hiện có
# 3. Enable "Google Analytics Data API":
#    - APIs & Services → Library → Search "Google Analytics Data API" → Enable
# 4. Tạo Service Account:
#    - IAM & Admin → Service Accounts → Create Service Account
#    - Đặt tên, ví dụ: "analytics-reader"
#    - Tải JSON credentials về máy
```

#### Bước 2: Cấp quyền trong Google Analytics

```bash
# 1. Vào Google Analytics: https://analytics.google.com
# 2. Admin → Account Access Management
# 3. Click "+" → Add users
# 4. Nhập email của Service Account (từ file JSON)
# 5. Cấp quyền "Viewer" (chỉ cần đọc)
# 6. Click "Add"
```

#### Bước 3: Lấy GA4 Property ID

```bash
# Trong Google Analytics:
# 1. Admin → Property Settings
# 2. Property ID nằm ở góc trên bên phải
# 3. Format: 123456789 (chỉ số, KHÔNG có prefix "G-")

# Lưu ý: Property ID khác với Measurement ID (G-XXXXXXXX)
```

#### Bước 4: Thêm vào file `.env` của backend

```dotenv
# ==========================================
# Google Analytics GA4 API (lấy thống kê cho footer)
# ==========================================
GA4_PROPERTY_ID=123456789

# Cách 1: Sử dụng file JSON credentials (development)
# Đặt file JSON vào backend/ và trỏ đường dẫn
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account.json

# Cách 2: Sử dụng JSON string (production/docker)
# Copy toàn bộ nội dung file JSON vào biến này
GOOGLE_CREDENTIALS_JSON='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"analytics@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

### 1.3. Cấu hình Website Settings (Admin UI)

Footer sử dụng setting `footer.show_visitor_stats` để bật/tắt hiển thị thống kê.

#### Cách 1: Qua Admin UI

```
1. Đăng nhập với tài khoản Admin
2. Vào: /admin/settings/website
3. Chọn Tab "Footer"
4. Bật toggle "Hiển thị thống kê truy cập"
5. Click "Lưu thay đổi"
```

#### Cách 2: Seed vào database

Thêm vào file `backend/prisma/seed.ts`:

```typescript
// Seed footer visitor stats setting
await prisma.websiteSetting.upsert({
  where: { key: 'footer.show_visitor_stats' },
  update: {},
  create: {
    key: 'footer.show_visitor_stats',
    value: 'true',
    category: 'FOOTER',
    description: 'Hiển thị thống kê truy cập ở footer',
  },
});
```

Chạy seed:

```bash
cd backend
bun prisma db seed
```

### 1.4. Data Flow - Luồng dữ liệu

```
Google Analytics GA4
        │
        │ GA4 Data API
        ▼
Backend (analytics.service.ts)
        │
        │ - getRealtimeUsers()
        │ - getTodayVisits()
        │ - getThisMonthVisits()
        │ - getTotalVisits()
        │
        │ Cache: Redis (30s - 24h TTL)
        ▼
GraphQL Query: visitorStats
        │
        │ Apollo Client
        ▼
Frontend (useVisitorStats hook)
        │
        │ pollInterval: 60000ms (1 phút)
        ▼
website-footer.tsx
        │
        └─► Hiển thị:
            - Đang truy cập: X người
            - Hôm nay: X lượt
            - Trong tháng: X lượt
            - Tổng truy cập: X lượt
```

### 1.5. GraphQL API

#### Query: visitorStats

```graphql
query GetVisitorStats {
  visitorStats {
    realtime    # Số người đang online
    today       # Lượt truy cập hôm nay
    thisMonth   # Lượt truy cập tháng này
    total       # Tổng lượt truy cập (từ đầu năm)
  }
}
```

#### Query: realtimeUsers

```graphql
query GetRealtimeUsers {
  realtimeUsers  # Chỉ lấy số người đang online
}
```

#### Query: isAnalyticsConfigured

```graphql
query IsAnalyticsConfigured {
  isAnalyticsConfigured  # true/false - kiểm tra đã cấu hình chưa
}
```

### 1.6. Test Analytics

#### Test qua cURL

```bash
# Test GraphQL query
curl -X POST http://localhost:12001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ visitorStats { realtime today thisMonth total } }"}'

# Expected response (khi chưa cấu hình - mock data):
{
  "data": {
    "visitorStats": {
      "realtime": 23,
      "today": 456,
      "thisMonth": 8765,
      "total": 98765
    }
  }
}
```

#### Test qua GraphQL Playground

1. Mở: `http://localhost:12001/graphql`
2. Chạy query ở trên
3. Nếu chưa cấu hình GA4, sẽ nhận được mock data (số ngẫu nhiên)

### 1.7. Xử lý khi chưa có credentials

Khi chưa cấu hình Google Analytics credentials, hệ thống sẽ:

1. Log warning: `"GA4_PROPERTY_ID không được cấu hình, Analytics sẽ trả về dữ liệu mẫu"`
2. Trả về mock data với số ngẫu nhiên:
   - realtime: 5-55 người
   - today: 100-600 lượt
   - month: 2000-12000 lượt
   - total: 50000-150000 lượt

Điều này cho phép development/testing mà không cần cấu hình thật.

---

## PHẦN 2: CẤU HÌNH ĐĂNG NHẬP SUPPORT CHAT

### 2.1. Tổng quan hệ thống Support Chat

Hệ thống Support Chat hỗ trợ nhiều phương thức xác thực khách hàng:

| Auth Type | Icon | Mô tả | Yêu cầu |
|-----------|------|-------|---------|
| GUEST | 👤 | Chỉ nhập tên | Không |
| PHONE | 📱 | Tên + Số điện thoại | Không |
| ZALO | 💬 | Đăng nhập Zalo | Zalo App credentials |
| FACEBOOK | 👥 | Đăng nhập Facebook | Facebook App credentials |
| GOOGLE | 🔍 | Đăng nhập Google | Google OAuth credentials |
| USER_ACCOUNT | 🔐 | Tài khoản hệ thống | Đã đăng nhập website |

### 2.2. Files quan trọng

```
backend/
├── src/support-chat/
│   ├── support-chat.module.ts              # Module chính
│   ├── gateways/
│   │   └── support-chat.gateway.ts         # WebSocket Gateway
│   ├── services/
│   │   ├── support-conversation.service.ts # Quản lý conversation
│   │   ├── support-message.service.ts      # Quản lý messages
│   │   ├── social-auth.service.ts          # Xác thực social login
│   │   └── ai-assistant.service.ts         # AI suggestions
│   └── resolvers/
│       └── support-conversation.resolver.ts # GraphQL resolvers

frontend/
├── src/components/support-chat/
│   ├── SupportChatWidget.tsx               # Widget đơn giản
│   ├── SupportChatWidgetEnhanced.tsx       # Widget có social login
│   ├── SupportChatWidgetWrapper.tsx        # Wrapper component
│   └── AdminChatDashboard.tsx              # Dashboard cho admin
├── src/lib/
│   └── social-auth.ts                      # OAuth helpers
└── src/graphql/support-chat/
    └── support-chat.graphql.ts             # GraphQL queries/mutations
```

### 2.3. Cấu hình Social Login

#### A. Google OAuth

**Bạn đã có Google credentials trong `.env.dev.rausach`:**

```dotenv
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Bước 1: Thêm vào Frontend `.env.local`:**

```dotenv
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Bước 2: Cấu hình Redirect URI trong Google Console:**

1. Vào: https://console.cloud.google.com/apis/credentials
2. Chọn OAuth 2.0 Client ID của bạn
3. Thêm Authorized redirect URIs:

```
# Development
http://localhost:12000/oauth-callback/google/callback

# Production
https://rausachtrangia.com/oauth-callback/google/callback
```

#### B. Facebook OAuth

**Bước 1: Tạo Facebook App**

```
1. Vào: https://developers.facebook.com/
2. My Apps → Create App → Consumer
3. Đặt tên app, ví dụ: "RauSach Support Chat"
4. Thêm product: Facebook Login
5. Settings → Basic → Lấy:
   - App ID
   - App Secret
```

**Bước 2: Cấu hình Facebook Login**

```
Facebook Login → Settings:
- Valid OAuth Redirect URIs:
  - http://localhost:12000/oauth-callback/facebook/callback
  - https://rausachtrangia.com/oauth-callback/facebook/callback
```

**Bước 3: Thêm vào .env**

```dotenv
# Backend (.env)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Frontend (.env.local)
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

#### C. Zalo OAuth

**Bước 1: Đăng ký Zalo App**

```
1. Vào: https://developers.zalo.me/
2. Đăng ký/Đăng nhập
3. Tạo ứng dụng mới
4. Lấy:
   - App ID
   - Secret Key
```

**Bước 2: Cấu hình Callback URL**

```
Trong Zalo Developer Console:
- Callback URL:
  - http://localhost:12000/oauth-callback/zalo/callback
  - https://rausachtrangia.com/oauth-callback/zalo/callback
```

**Bước 3: Thêm vào .env**

```dotenv
# Backend (.env)
ZALO_APP_ID=your_zalo_app_id
ZALO_APP_SECRET=your_zalo_secret_key

# Frontend (.env.local)
NEXT_PUBLIC_ZALO_APP_ID=your_zalo_app_id
```

### 2.4. Tích hợp Support Chat Widget

#### Cách 1: Widget đơn giản (chỉ nhập tên)

```tsx
// app/layout.tsx hoặc bất kỳ component nào
import SupportChatWidget from '@/components/support-chat/SupportChatWidget';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SupportChatWidget
          apiUrl="http://localhost:12001"
          websocketUrl="http://localhost:12001/support-chat"
          primaryColor="#2563eb"
          position="bottom-right"
        />
      </body>
    </html>
  );
}
```

#### Cách 2: Widget nâng cao (có social login)

```tsx
import SupportChatWidgetEnhanced from '@/components/support-chat/SupportChatWidgetEnhanced';

<SupportChatWidgetEnhanced
  apiUrl="http://localhost:12001"
  websocketUrl="http://localhost:12001/support-chat"
  primaryColor="#2563eb"
  position="bottom-right"
  enableZaloLogin={true}      // Bật đăng nhập Zalo
  enableFacebookLogin={true}  // Bật đăng nhập Facebook
  enableGoogleLogin={true}    // Bật đăng nhập Google
/>
```

#### Cách 3: Sử dụng SupportChatWidgetWrapper (đã có sẵn)

```tsx
import { SupportChatWidgetWrapper } from '@/components/support-chat/SupportChatWidgetWrapper';

// Widget sẽ tự động lấy config từ environment variables
<SupportChatWidgetWrapper />
```

### 2.5. Tạo OAuth Callback Pages

Tạo các pages để xử lý OAuth callback:

#### Google Callback

**File: `frontend/src/app/oauth-callback/google/callback/page.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { handleOAuthCallback } from '@/lib/social-auth';

export default function GoogleCallback() {
  useEffect(() => {
    handleOAuthCallback('GOOGLE');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  );
}
```

#### Facebook Callback

**File: `frontend/src/app/oauth-callback/facebook/callback/page.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { handleOAuthCallback } from '@/lib/social-auth';

export default function FacebookCallback() {
  useEffect(() => {
    handleOAuthCallback('FACEBOOK');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Đang xử lý đăng nhập Facebook...</p>
      </div>
    </div>
  );
}
```

#### Zalo Callback

**File: `frontend/src/app/oauth-callback/zalo/callback/page.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { handleOAuthCallback } from '@/lib/social-auth';

export default function ZaloCallback() {
  useEffect(() => {
    handleOAuthCallback('ZALO');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Đang xử lý đăng nhập Zalo...</p>
      </div>
    </div>
  );
}
```

### 2.6. WebSocket Events

#### Client → Server Events

| Event | Payload | Mô tả |
|-------|---------|-------|
| `join_conversation` | `{ conversationId, userId? }` | Tham gia conversation |
| `leave_conversation` | `{ conversationId }` | Rời conversation |
| `send_message` | `{ conversationId, content, senderType, senderName, customerAuthType? }` | Gửi tin nhắn |
| `typing_start` | `{ conversationId, userId }` | Bắt đầu gõ |
| `typing_stop` | `{ conversationId, userId }` | Ngừng gõ |
| `mark_as_read` | `{ messageId }` | Đánh dấu đã đọc |
| `update_customer_auth` | `{ conversationId, authType, ... }` | Cập nhật auth info |

#### Server → Client Events

| Event | Payload | Mô tả |
|-------|---------|-------|
| `new_message` | Message object | Tin nhắn mới |
| `ai_suggestion` | `{ conversationId, suggestion, confidence }` | Gợi ý AI cho agent |
| `user_typing` | `{ conversationId, userId }` | User đang gõ |
| `user_stopped_typing` | `{ conversationId, userId }` | User ngừng gõ |
| `agent_assigned` | `{ conversationId, agent }` | Agent được assign |
| `conversation_status_changed` | `{ conversationId, status }` | Status thay đổi |
| `customer_auth_updated` | `{ conversationId, authType, customerName }` | Auth được cập nhật |

### 2.7. Database Schema

#### SupportConversation

```prisma
model SupportConversation {
  id                 String   @id @default(uuid())
  conversationCode   String   @unique
  customerName       String?
  customerEmail      String?
  customerPhone      String?
  status             SupportConversationStatus @default(WAITING)
  platform           IntegrationPlatform @default(WEBSITE)
  
  // Authentication fields
  authType           CustomerAuthType @default(GUEST)
  socialAuthId       String?          // ID từ social platform
  socialAuthToken    String?          // Access token
  socialAuthData     Json?            // Profile data
  customerIdentifier String?          // Unique identifier
  
  // Relations
  messages           SupportMessage[]
  assignedAgent      User?    @relation(fields: [assignedAgentId])
  
  createdAt          DateTime @default(now())
}
```

#### SupportMessage

```prisma
model SupportMessage {
  id               String   @id @default(uuid())
  conversationId   String
  content          String
  senderType       SupportSender
  senderName       String?
  
  // Customer auth tracking
  customerAuthType String?  // GUEST, PHONE, ZALO, FACEBOOK, GOOGLE
  customerAuthIcon String?  // 👤, 📱, 💬, 👥, 🔍
  
  // AI fields
  isAIGenerated    Boolean  @default(false)
  aiConfidence     Float?
  
  isRead           Boolean  @default(false)
  sentAt           DateTime @default(now())
  
  conversation     SupportConversation @relation(fields: [conversationId])
}
```

### 2.8. Test Support Chat

```bash
# 1. Start Backend
cd backend && bun run dev

# 2. Start Frontend
cd frontend && bun run dev

# 3. Mở browser: http://localhost:12000
# 4. Click chat button ở góc phải màn hình
# 5. Test các phương thức:
#    - Tab "Số điện thoại": Nhập tên + SĐT → Bắt đầu chat
#    - Tab "Đăng nhập": Click Google/Facebook/Zalo (nếu đã cấu hình)
```

---

## PHẦN 3: TỔNG HỢP BIẾN MÔI TRƯỜNG

### Backend (.env)

```dotenv
# ==========================================
# ANALYTICS - Google Analytics GA4
# ==========================================
# Property ID từ Google Analytics (chỉ số, không có "G-")
GA4_PROPERTY_ID=123456789

# Chọn 1 trong 2 cách sau:

# Cách 1: File credentials (development)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Cách 2: JSON string (production/docker)
GOOGLE_CREDENTIALS_JSON='{"type":"service_account",...}'

# ==========================================
# SUPPORT CHAT - AI Assistant
# ==========================================
# Google Gemini (khuyến nghị)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# OpenAI (tùy chọn)
OPENAI_API_KEY=sk-your-openai-api-key

# ==========================================
# SUPPORT CHAT - Social OAuth
# ==========================================
# Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Zalo
ZALO_APP_ID=your_zalo_app_id
ZALO_APP_SECRET=your_zalo_secret_key

# Google (dùng chung với Google OAuth login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (.env.local)

```dotenv
# ==========================================
# API URLs
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:12000
NEXT_PUBLIC_API_URL=http://localhost:12001
NEXT_PUBLIC_WS_URL=http://localhost:12001/support-chat
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql

# ==========================================
# SOCIAL AUTH - Client IDs (public)
# ==========================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_ZALO_APP_ID=your_zalo_app_id
```

### Production Environment

```dotenv
# Frontend
NEXT_PUBLIC_APP_URL=https://rausachtrangia.com
NEXT_PUBLIC_API_URL=https://api.rausachtrangia.com
NEXT_PUBLIC_WS_URL=https://api.rausachtrangia.com/support-chat
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.rausachtrangia.com/graphql

# Backend
FRONTEND_URL=https://rausachtrangia.com
```

---

## CHECKLIST TÍCH HỢP

### Analytics Footer

- [ ] Tạo Service Account trên Google Cloud Console
- [ ] Enable Google Analytics Data API
- [ ] Cấp quyền Viewer cho Service Account trong GA Admin
- [ ] Lấy GA4 Property ID (chỉ số, không có "G-")
- [ ] Thêm `GA4_PROPERTY_ID` vào `.env`
- [ ] Thêm credentials (file hoặc JSON string) vào `.env`
- [ ] Bật setting `footer.show_visitor_stats` trong Admin UI
- [ ] Test GraphQL query `visitorStats`
- [ ] Verify hiển thị trên footer

### Support Chat Login

- [ ] **Google OAuth**
  - [ ] Thêm `NEXT_PUBLIC_GOOGLE_CLIENT_ID` vào frontend `.env.local`
  - [ ] Thêm Redirect URI vào Google Console
  - [ ] Tạo `/oauth-callback/google/callback/page.tsx`
  - [ ] Test đăng nhập Google

- [ ] **Facebook OAuth**
  - [ ] Tạo Facebook App tại developers.facebook.com
  - [ ] Thêm Facebook Login product
  - [ ] Thêm credentials vào backend `.env`
  - [ ] Thêm `NEXT_PUBLIC_FACEBOOK_APP_ID` vào frontend `.env.local`
  - [ ] Thêm Redirect URI vào Facebook App Settings
  - [ ] Tạo `/oauth-callback/facebook/callback/page.tsx`
  - [ ] Test đăng nhập Facebook

- [ ] **Zalo OAuth**
  - [ ] Đăng ký Zalo App tại developers.zalo.me
  - [ ] Thêm credentials vào backend `.env`
  - [ ] Thêm `NEXT_PUBLIC_ZALO_APP_ID` vào frontend `.env.local`
  - [ ] Thêm Callback URL vào Zalo Developer Console
  - [ ] Tạo `/oauth-callback/zalo/callback/page.tsx`
  - [ ] Test đăng nhập Zalo

- [ ] **Widget Integration**
  - [ ] Tích hợp `SupportChatWidgetEnhanced` vào layout
  - [ ] Cấu hình props cho widget
  - [ ] Test chat với từng phương thức đăng nhập

---

## TROUBLESHOOTING

### Analytics

#### Lỗi: "GA4_PROPERTY_ID không được cấu hình"

```bash
# Kiểm tra biến môi trường
echo $GA4_PROPERTY_ID

# Verify trong .env
grep GA4_PROPERTY_ID .env
```

#### Lỗi: "Lỗi khởi tạo Google Analytics client"

```bash
# Kiểm tra file credentials tồn tại
ls -la /path/to/credentials.json

# Hoặc kiểm tra JSON string hợp lệ
echo $GOOGLE_CREDENTIALS_JSON | jq .
```

#### Analytics trả về mock data thay vì data thật

1. Kiểm tra Service Account đã được cấp quyền trong GA chưa
2. Verify Property ID đúng (chỉ số, không có "G-")
3. Kiểm tra API đã được enable trong Google Cloud chưa

### Support Chat

#### Lỗi: "Failed to connect to WebSocket"

```bash
# Kiểm tra backend đang chạy
curl http://localhost:12001/health

# Verify WebSocket URL
echo $NEXT_PUBLIC_WS_URL
```

#### Lỗi: "Social login failed"

1. Verify App IDs/Secrets đúng trong environment variables
2. Kiểm tra OAuth Redirect URIs đã được cấu hình đúng
3. Xem console logs để debug chi tiết

#### Lỗi: "Prisma migration failed"

```bash
# Reset database (cẩn thận: xóa toàn bộ data)
cd backend
bun prisma migrate reset

# Sau đó chạy lại migration
bun prisma migrate dev
```

---

## TÀI LIỆU LIÊN QUAN

- [123-QUICK_SETUP_SUPPORT_CHAT.md](./123-QUICK_SETUP_SUPPORT_CHAT.md) - Hướng dẫn setup nhanh
- [124-SUPPORT_CHAT_ENHANCED.md](./124-SUPPORT_CHAT_ENHANCED.md) - Chi tiết tính năng Support Chat
- [85-ANALYTICS_INTEGRATION.md](./85-ANALYTICS_INTEGRATION.md) - Tích hợp Google Analytics & Facebook Pixel
- [86-ANALYTICS_TAB_ADDED.md](./86-ANALYTICS_TAB_ADDED.md) - Tab Analytics trong Admin UI

---

## LIÊN HỆ HỖ TRỢ

Nếu gặp vấn đề trong quá trình tích hợp:

1. Kiểm tra logs: `backend/logs/`
2. Kiểm tra browser console: DevTools → Console
3. Tạo issue trên GitHub repository

---

**Happy Coding! 🚀**
