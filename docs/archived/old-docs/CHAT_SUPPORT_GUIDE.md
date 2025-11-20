# Hệ Thống Chat Hỗ Trợ Khách Hàng - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Hệ thống chat hỗ trợ khách hàng toàn diện với các tính năng:

- ✅ **Chat real-time** với WebSocket
- 🤖 **AI Assistant** tự động trả lời và gợi ý
- 📱 **Tích hợp đa nền tảng**: Website, Zalo OA, Facebook Messenger
- 👥 **Quản lý khách hàng** và phân công agent
- 📊 **Thống kê và báo cáo** hiệu suất
- 🎯 **Chốt đơn hàng** trực tiếp từ chat
- 📱 **Mobile-first design** với PWA support

## 🚀 Cài Đặt

### 1. Cài đặt dependencies

```bash
# Backend
cd backend
bun install socket.io @nestjs/websockets @nestjs/platform-socket.io

# Frontend
cd frontend
bun install socket.io-client framer-motion lucide-react
```

### 2. Cập nhật Prisma Database

```bash
cd backend
bun prisma generate
bun prisma migrate dev --name add-support-chat-system
```

### 3. Thêm biến môi trường

Thêm vào file `.env`:

```env
# AI Assistant
OPENAI_API_KEY=sk-your-openai-api-key

# Zalo OA
ZALO_APP_ID=your-zalo-app-id
ZALO_APP_SECRET=your-zalo-app-secret
ZALO_WEBHOOK_SECRET=your-webhook-secret

# Facebook Messenger
FACEBOOK_PAGE_ID=your-facebook-page-id
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-page-access-token
FACEBOOK_WEBHOOK_SECRET=your-webhook-verify-token
```

### 4. Import module vào AppModule

Thêm vào `backend/src/app.module.ts`:

```typescript
import { SupportChatModule } from './support-chat/support-chat.module';

@Module({
  imports: [
    // ... existing imports
    SupportChatModule,
  ],
})
export class AppModule {}
```

### 5. Thêm Chat Widget vào Layout

Thêm vào `frontend/src/app/layout.tsx`:

```typescript
import SupportChatWidget from '@/components/support-chat/SupportChatWidget';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        {children}
        <SupportChatWidget 
          apiUrl="http://localhost:3001"
          websocketUrl="http://localhost:3001/support-chat"
          primaryColor="#2563eb"
          position="bottom-right"
        />
      </body>
    </html>
  );
}
```

## 📱 Tích Hợp Zalo OA

### 1. Tạo Zalo OA

1. Truy cập: https://oa.zalo.me/
2. Tạo Official Account mới
3. Lấy App ID và Secret Key

### 2. Cấu hình Webhook

1. Vào **Cài đặt** → **Webhook**
2. URL webhook: `https://your-domain.com/webhooks/zalo`
3. Secret Key: Dùng key đã tạo trong .env
4. Subscribe events: `user_send_text`, `user_send_image`, `follow`

### 3. Lấy Access Token

```bash
# Gọi API để lấy access token
curl -X POST https://oauth.zaloapp.com/v4/oa/access_token \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "YOUR_APP_ID",
    "code": "CODE_FROM_OAUTH",
    "grant_type": "authorization_code"
  }'
```

### 4. Lưu cấu hình

Sử dụng GraphQL mutation hoặc Admin UI để lưu integration:

```graphql
mutation {
  createChatIntegration(input: {
    platform: ZALO
    isEnabled: true
    appId: "your-app-id"
    appSecret: "your-app-secret"
    accessToken: "your-access-token"
    webhookSecret: "your-webhook-secret"
  }) {
    id
    platform
    isEnabled
  }
}
```

## 📘 Tích Hợp Facebook Messenger

### 1. Tạo Facebook App

1. Truy cập: https://developers.facebook.com/
2. Tạo app mới → Chọn "Business"
3. Thêm sản phẩm **Messenger**

### 2. Cấu hình Page

1. Chọn Facebook Page để kết nối
2. Generate Page Access Token
3. Subscribe Page đến App

### 3. Setup Webhook

1. URL webhook: `https://your-domain.com/webhooks/facebook`
2. Verify Token: Giá trị trong `FACEBOOK_WEBHOOK_SECRET`
3. Subscribe fields: `messages`, `messaging_postbacks`

### 4. Lưu cấu hình

```graphql
mutation {
  createChatIntegration(input: {
    platform: FACEBOOK
    isEnabled: true
    appId: "your-app-id"
    appSecret: "your-app-secret"
    accessToken: "your-page-access-token"
    webhookSecret: "your-verify-token"
  }) {
    id
    platform
    isEnabled
  }
}
```

## 🎯 Sử Dụng

### Khách Hàng (Website)

1. Click vào nút chat floating góc màn hình
2. Nhập tên để bắt đầu hội thoại
3. Chat trực tiếp với agent hoặc AI assistant
4. Sử dụng quick replies để trả lời nhanh

### Admin/Agent

1. Truy cập: `/admin/support-chat`
2. Xem danh sách hội thoại đang chờ
3. Click vào hội thoại để xem chi tiết
4. Nhận hội thoại (assign to me)
5. Chat với khách hàng
6. Sử dụng AI suggestions khi cần
7. Đánh giá và đóng hội thoại

## 🤖 AI Assistant

### Tính năng

- **Tự động trả lời** câu hỏi thường gặp
- **Gợi ý sản phẩm** dựa trên nhu cầu
- **Phân tích cảm xúc** khách hàng
- **Tự động phân loại** câu hỏi
- **Gợi ý câu trả lời** cho agent

### Cấu hình AI Rules

```graphql
mutation {
  createChatBotRule(input: {
    name: "Chào hỏi"
    keywords: ["xin chào", "hello", "hi"]
    responseType: "text"
    responseContent: "Xin chào! Tôi có thể giúp gì cho bạn?"
    useAI: false
    priority: 10
  }) {
    id
    name
  }
}
```

### Custom AI Prompts

Chỉnh sửa trong `backend/src/support-chat/services/ai-assistant.service.ts`:

```typescript
private buildSystemPrompt(context?: any): string {
  return `
    Bạn là trợ lý ảo chuyên nghiệp...
    
    Nhiệm vụ:
    - [Custom instructions]
    
    Phong cách:
    - [Custom style]
  `;
}
```

## 📊 Analytics & Reports

### Metrics được tracking

- Total conversations
- Active/Waiting/Closed conversations
- Average response time
- First response time
- Customer satisfaction rating
- Agent performance
- Platform breakdown

### Xem thống kê

```graphql
query {
  supportAnalytics(
    startDate: "2024-01-01"
    endDate: "2024-01-31"
  ) {
    date
    totalConversations
    avgResponseTime
    avgRating
  }
}
```

## 🎨 Customization

### Thay đổi màu sắc Widget

```tsx
<SupportChatWidget 
  primaryColor="#6366f1"  // Indigo
  position="bottom-left"
/>
```

### Custom Quick Replies

Thêm trong database:

```typescript
await prisma.chatQuickReply.create({
  data: {
    title: "Giá sản phẩm",
    shortcut: "/price",
    message: "Bạn muốn biết giá của sản phẩm nào?",
    category: "product",
    isActive: true,
  },
});
```

### Custom Bot Rules

```typescript
await prisma.chatBotRule.create({
  data: {
    name: "Hỗ trợ đơn hàng",
    keywords: ["đơn hàng", "order", "kiểm tra"],
    responseType: "order_lookup",
    responseContent: "Vui lòng cung cấp mã đơn hàng của bạn",
    useAI: true,
    aiPrompt: "Hỗ trợ khách hàng tra cứu thông tin đơn hàng...",
  },
});
```

## 🔧 API Reference

### GraphQL Queries

```graphql
# Lấy danh sách conversations
query {
  supportConversations(
    where: { status: ACTIVE }
    take: 20
  ) {
    id
    customerName
    status
    messages {
      content
      sentAt
    }
  }
}

# Lấy chi tiết conversation
query {
  supportConversation(id: "conv-id") {
    id
    messages {
      id
      content
      senderType
      sentAt
    }
  }
}
```

### GraphQL Mutations

```graphql
# Tạo conversation
mutation {
  createSupportConversation(input: {
    customerName: "Nguyễn Văn A"
    customerEmail: "email@example.com"
    platform: WEBSITE
  }) {
    id
    conversationCode
  }
}

# Assign agent
mutation {
  assignConversationToAgent(
    conversationId: "conv-id"
    agentId: "agent-id"
  ) {
    id
    assignedAgent {
      username
    }
  }
}
```

### WebSocket Events

#### Client → Server

```javascript
// Join conversation
socket.emit('join_conversation', {
  conversationId: 'xxx',
  userId: 'user-id'
});

// Send message
socket.emit('send_message', {
  conversationId: 'xxx',
  content: 'Hello',
  senderType: 'CUSTOMER'
});

// Typing indicators
socket.emit('typing_start', { conversationId: 'xxx' });
socket.emit('typing_stop', { conversationId: 'xxx' });
```

#### Server → Client

```javascript
// New message
socket.on('new_message', (message) => {
  console.log(message);
});

// AI suggestion
socket.on('ai_suggestion', (data) => {
  console.log(data.suggestion);
});

// Agent assigned
socket.on('agent_assigned', (data) => {
  console.log(data.agent);
});
```

## 🔒 Security

### Best Practices

1. **Verify webhooks**: Luôn verify signature từ Zalo/Facebook
2. **Rate limiting**: Giới hạn số request
3. **Input sanitization**: Clean user input
4. **Authentication**: Yêu cầu auth cho admin routes
5. **HTTPS only**: Sử dụng SSL trong production

### Webhook Verification

```typescript
// Zalo webhook verification
const crypto = require('crypto');
const signature = req.headers['x-zevent-signature'];
const body = JSON.stringify(req.body);
const hash = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex');

if (hash !== signature) {
  throw new Error('Invalid signature');
}
```

## 📱 Mobile App Support

Widget đã được tối ưu cho mobile:

- Touch-friendly UI
- Responsive design
- PWA support
- Offline detection
- Push notifications ready

## 🐛 Troubleshooting

### WebSocket không kết nối

```javascript
// Check CORS settings
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true,
  },
});
```

### Messages không hiển thị

1. Check database connection
2. Verify GraphQL endpoint
3. Check browser console for errors
4. Verify WebSocket connection in Network tab

### AI không hoạt động

1. Kiểm tra `OPENAI_API_KEY`
2. Check API quota
3. Xem logs trong console
4. Verify AI service configuration

## 🎓 Best Practices

### Cho Agents

1. **Phản hồi nhanh**: < 30 seconds
2. **Cá nhân hóa**: Gọi tên khách hàng
3. **Empathy**: Thể hiện sự quan tâm
4. **Clear & Concise**: Trả lời rõ ràng
5. **Follow-up**: Theo dõi sau khi giải quyết

### Cho Developers

1. **Log everything**: Để troubleshoot
2. **Error handling**: Graceful degradation
3. **Performance**: Monitor response times
4. **Testing**: Test real-time scenarios
5. **Documentation**: Keep docs updated

## 📈 Roadmap

- [ ] Video call support
- [ ] Screen sharing
- [ ] File transfer
- [ ] Chatbot flows builder
- [ ] Multi-language support
- [ ] Voice messages
- [ ] Chat templates
- [ ] Automation rules
- [ ] CRM integration
- [ ] Advanced analytics

## 🤝 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng:

1. Check documentation
2. Search existing issues
3. Create new issue với đầy đủ thông tin
4. Contact support team

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 31/10/2024  
**Tác giả**: Senior Development Team

🎉 **Chúc bạn thành công với hệ thống chat support!**
