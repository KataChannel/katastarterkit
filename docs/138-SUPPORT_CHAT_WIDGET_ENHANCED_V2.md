# Support Chat Widget Enhanced V2

## 📋 Tổng Quan

Đã cập nhật `SupportChatWidgetEnhanced` với các tính năng nâng cao:
- ✅ **Session Persistence** - Lưu phiên chat vào localStorage
- ✅ **Quick Replies** - Trả lời nhanh với các câu hỏi phổ biến  
- ✅ **Mobile-first Design** - Full screen trên mobile, floating trên desktop
- ✅ **Sound Notifications** - Âm thanh khi có tin nhắn mới
- ✅ **Desktop Notifications** - Thông báo desktop khi có tin nhắn
- ✅ **File Upload UI** - Giao diện đính kèm file
- ✅ **Social Login** - Đăng nhập qua Zalo, Facebook, Google
- ✅ **Online Status** - Hiển thị trạng thái online/offline
- ✅ **Settings Controls** - Bật/tắt âm thanh và thông báo

## 🚀 Cách Sử Dụng

### 1. Tích hợp vào Layout (Tự động)

Widget đã được tích hợp sẵn vào `layout.tsx` thông qua `SupportChatWidgetWrapper`:

```tsx
// frontend/src/app/layout.tsx
import SupportChatWidgetWrapper from '@/components/support-chat/SupportChatWidgetWrapper';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SupportChatWidgetWrapper />
      </body>
    </html>
  );
}
```

### 2. Sử dụng Trực tiếp (Custom)

```tsx
import SupportChatWidgetEnhanced from '@/components/support-chat/SupportChatWidgetEnhanced';

<SupportChatWidgetEnhanced
  apiUrl="http://localhost:12001"
  websocketUrl="http://localhost:12001/support-chat"
  primaryColor="#16a34a"
  position="bottom-right"
  enableZaloLogin={true}
  enableFacebookLogin={true}
  enableGoogleLogin={true}
  enableSoundNotification={true}
  enableDesktopNotification={true}
  enableFileUpload={true}
  enableEmojis={true}
  quickReplies={[
    { icon: '💰', text: 'Giá sản phẩm' },
    { icon: '📦', text: 'Theo dõi đơn hàng' },
    { icon: '🚚', text: 'Vận chuyển' },
    { icon: '🔄', text: 'Đổi trả hàng' },
    { icon: '💳', text: 'Thanh toán' },
  ]}
  welcomeMessage="Xin chào! Tôi có thể giúp gì cho bạn?"
  offlineMessage="Xin lỗi, hiện không có nhân viên trực."
/>
```

## 🎨 Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `apiUrl` | string | `http://localhost:12001` | URL của backend API |
| `websocketUrl` | string | `http://localhost:12001/support-chat` | URL WebSocket |
| `primaryColor` | string | `#2563eb` | Màu chủ đạo của widget |
| `position` | string | `bottom-right` | Vị trí: `bottom-right` hoặc `bottom-left` |
| `enableZaloLogin` | boolean | `true` | Bật đăng nhập Zalo |
| `enableFacebookLogin` | boolean | `true` | Bật đăng nhập Facebook |
| `enableGoogleLogin` | boolean | `true` | Bật đăng nhập Google |
| `enableSoundNotification` | boolean | `true` | Bật âm thanh thông báo |
| `enableDesktopNotification` | boolean | `true` | Bật thông báo desktop |
| `enableFileUpload` | boolean | `true` | Bật đính kèm file |
| `enableEmojis` | boolean | `true` | Bật emoji |
| `quickReplies` | array | default replies | Danh sách câu trả lời nhanh |
| `welcomeMessage` | string | `Xin chào!...` | Tin nhắn chào mừng |
| `offlineMessage` | string | `Xin lỗi...` | Tin nhắn khi offline |

## 📱 Responsive Design

### Mobile (< 640px)
- **Full screen** chat window
- Touch-friendly buttons
- Safe area padding cho notch

### Desktop (≥ 640px)  
- **Floating window** 420px width
- Max height 650px
- Rounded corners

## ✨ Tính Năng Chi Tiết

### 1. Session Persistence

```typescript
// Lưu vào localStorage với key 'support_chat_enhanced_session'
const session = {
  customerName,
  customerPhone,
  conversationId,
  authType,
  messages: messages.slice(-50), // Lưu 50 tin nhắn gần nhất
  soundEnabled,
  notificationEnabled,
  savedAt: new Date().toISOString(),
};
```

### 2. Quick Replies

Hiển thị khi conversation có ≤ 2 tin nhắn:
```tsx
quickReplies={[
  { icon: '💰', text: 'Giá sản phẩm' },
  { icon: '📦', text: 'Theo dõi đơn hàng' },
  { icon: '🚚', text: 'Vận chuyển' },
]}
```

### 3. Sound & Desktop Notifications

- **Sound**: Play file `/sounds/notification.mp3` khi có tin nhắn mới
- **Desktop**: Hiển thị browser notification (cần permission)
- Toggle on/off từ header widget

### 4. Social Login

Hỗ trợ OAuth flow cho:
- 💬 **Zalo** - Sử dụng Zalo OAuth SDK
- 👥 **Facebook** - Sử dụng Facebook Login SDK  
- 🔍 **Google** - Sử dụng Google Identity Services

### 5. Online Status

- 🟢 Xanh: Online (WebSocket connected)
- ⚫ Xám: Offline (WebSocket disconnected)

## 🔧 Cấu Hình Database

Settings được load từ database category `SUPPORT_CHAT`:

```typescript
interface SupportChatSettings {
  enabled: boolean;
  widget_position: 'bottom-right' | 'bottom-left';
  primary_color: string;
  welcome_message: string;
  offline_message: string;
  enable_zalo_login: boolean;
  enable_facebook_login: boolean;
  enable_google_login: boolean;
}
```

### Seed Settings

```sql
INSERT INTO website_settings (key, value, type, category) VALUES
('support_chat.enabled', 'true', 'BOOLEAN', 'SUPPORT_CHAT'),
('support_chat.primary_color', '#16a34a', 'COLOR', 'SUPPORT_CHAT'),
('support_chat.widget_position', 'bottom-right', 'TEXT', 'SUPPORT_CHAT'),
('support_chat.enable_zalo_login', 'true', 'BOOLEAN', 'SUPPORT_CHAT'),
('support_chat.enable_facebook_login', 'true', 'BOOLEAN', 'SUPPORT_CHAT'),
('support_chat.enable_google_login', 'true', 'BOOLEAN', 'SUPPORT_CHAT');
```

## 📂 File Structure

```
frontend/src/components/support-chat/
├── SupportChatWidgetEnhanced.tsx   # Widget nâng cao (V2)
├── SupportChatWidgetSimple.tsx     # Widget đơn giản
├── SupportChatWidgetWrapper.tsx    # Wrapper load settings
├── AdminChatDashboard.tsx          # Dashboard admin
└── CustomerAuthBadge.tsx           # Badge xác thực

frontend/src/lib/
└── social-auth.ts                  # OAuth helpers

frontend/public/sounds/
└── notification.mp3                # Âm thanh thông báo
```

## 🧪 Testing

### Test Widget

1. Mở website: `http://localhost:12000`
2. Click button chat góc phải dưới
3. Nhập tên + số điện thoại
4. Gửi tin nhắn test
5. Đóng và mở lại → Session được khôi phục

### Test Settings

1. Vào Admin: `/admin/settings/website`
2. Tab "Support Chat"
3. Thay đổi màu sắc, vị trí
4. Refresh trang → Widget cập nhật

### Test Social Login

1. Mở widget
2. Chọn tab "Đăng nhập"
3. Click Zalo/Facebook/Google
4. Hoàn thành OAuth flow
5. Verify conversation được tạo với authType tương ứng

## 🔄 WebSocket Events

```typescript
// Client → Server
socket.emit('join_conversation', { conversationId })
socket.emit('send_message', { conversationId, content, ... })
socket.emit('typing_start', { conversationId, userId })
socket.emit('typing_stop', { conversationId, userId })

// Server → Client
socket.on('connect', () => {})
socket.on('disconnect', () => {})
socket.on('new_message', (message) => {})
socket.on('user_typing', () => {})
socket.on('user_stopped_typing', () => {})
socket.on('agent_assigned', (data) => {})
```

## 🚀 Quick Setup

### Automatic Setup (Recommended)

Run the setup script to install all required components:

```bash
./scripts/setup-support-chat-v2.sh
```

This script will:
1. ✅ Download notification sound file
2. ✅ Seed database settings
3. ✅ Verify OAuth callback pages
4. ✅ Check environment configuration
5. ✅ Display setup summary

### Manual Setup

If you prefer manual installation:

1. **Download notification sound**:
```bash
mkdir -p frontend/public/sounds
curl -L -o frontend/public/sounds/notification.mp3 "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
```

2. **Seed database settings**:
```bash
cd backend
bun run seed:settings
```

3. **Configure environment variables** (see below)

4. **Start services**:
```bash
# Terminal 1: Backend
cd backend && bun run dev

# Terminal 2: Frontend  
cd frontend && bun run dev
```

## 🔧 Environment Variables

Create `frontend/.env.local` with these variables:

```env
# API Endpoints (Required)
NEXT_PUBLIC_API_URL=http://localhost:12001
NEXT_PUBLIC_WS_URL=http://localhost:12001/support-chat
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql

# Social Auth (Optional - features will be disabled if not set)
NEXT_PUBLIC_ZALO_APP_ID=your_zalo_app_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

See `env/.env.support-chat.example` for complete configuration guide.

## 📱 OAuth Setup

### Zalo
1. Register app at: https://developers.zalo.me/
2. Add callback URL: `http://localhost:12000/oauth-callback/zalo/callback`
3. Copy App ID to `NEXT_PUBLIC_ZALO_APP_ID`

### Facebook
1. Register app at: https://developers.facebook.com/
2. Add callback URL: `http://localhost:12000/oauth-callback/facebook/callback`
3. Copy App ID to `NEXT_PUBLIC_FACEBOOK_APP_ID`

### Google
1. Create project at: https://console.cloud.google.com/
2. Add callback URL: `http://localhost:12000/oauth-callback/google/callback`
3. Copy Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## 🚀 Deployment

### Production Environment

Update URLs in production `.env`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com/support-chat
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.yourdomain.com/graphql
```

### OAuth Callback URLs (Production)

Update callback URLs in social app dashboards:
- Zalo: `https://yourdomain.com/oauth-callback/zalo/callback`
- Facebook: `https://yourdomain.com/oauth-callback/facebook/callback`
- Google: `https://yourdomain.com/oauth-callback/google/callback`

Widget sẽ tự động sử dụng URL từ env hoặc fallback về default.

## 📝 Changelog

### V2.0.0 (December 1, 2025)

**✨ New Features**
- ✅ Session persistence với localStorage (lưu 50 tin nhắn gần nhất)
- ✅ Quick replies với custom messages (hiển thị khi ≤2 tin nhắn)
- ✅ Sound notifications (notification.mp3)
- ✅ Desktop notifications (browser notifications)
- ✅ File upload UI (images, PDF, DOC, XLS)
- ✅ Online/Offline status indicator với WebSocket
- ✅ Settings controls trong header (sound, notification, new conversation)
- ✅ Mobile-first responsive design (full screen mobile, floating desktop)
- ✅ Social login với custom Zalo icon SVG

**🔧 Technical Improvements**
- ✅ Wrapper component tự động load settings từ database
- ✅ OAuth callback pages cho Zalo, Facebook, Google
- ✅ Social auth utilities trong `lib/social-auth.ts`
- ✅ Database seed với 18+ support chat settings
- ✅ Environment variables configuration guide
- ✅ Automated setup script: `scripts/setup-support-chat-v2.sh`
- ✅ Comprehensive testing guide: `docs/139-SUPPORT_CHAT_V2_TESTING_GUIDE.md`

**🐛 Bug Fixes**
- ✅ Fixed session restoration on page refresh
- ✅ Improved WebSocket reconnection logic
- ✅ Better error handling for OAuth flows
- ✅ Mobile safe area padding for notch devices

### V1.0.0
- Initial release với basic chat
- Phone + name authentication
- Real-time messaging
- Social login support

---

## 📚 Related Documentation

- **Testing Guide**: [docs/139-SUPPORT_CHAT_V2_TESTING_GUIDE.md](./139-SUPPORT_CHAT_V2_TESTING_GUIDE.md)
- **Environment Setup**: [env/.env.support-chat.example](../env/.env.support-chat.example)
- **Setup Script**: [scripts/setup-support-chat-v2.sh](../scripts/setup-support-chat-v2.sh)
- **Admin Dashboard**: [docs/123-QUICK_SETUP_SUPPORT_CHAT.md](./123-QUICK_SETUP_SUPPORT_CHAT.md)

---

**Cập nhật**: December 1, 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
