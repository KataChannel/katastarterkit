# RAG Chatbot - Authentication, Authorization & Persistent Storage

## Tổng quan cập nhật

Cập nhật này bổ sung các tính năng production-ready cho RAG Chatbot:

1. **Authentication/Authorization** - Phân quyền truy cập
2. **Persistent Storage** - Lưu trữ lịch sử chat vào database
3. **Rate Limiting** - Giới hạn số request
4. **Admin Configuration** - Cấu hình hệ thống

## 1. Prisma Models mới

### RAGChatHistory
Lưu trữ lịch sử hội thoại:

```prisma
model RAGChatHistory {
  id             String   @id @default(uuid())
  conversationId String   @default(uuid())
  userId         String?
  role           String   // 'user' | 'assistant' | 'system'
  message        String   @db.Text
  answer         String?  @db.Text
  intent         RAGIntentType @default(GENERAL)
  contextTypes   String[]
  contextUsed    Json?
  sources        Json?
  confidence     Float?
  tokensUsed     Int?
  responseTime   Int?
  suggestedQueries String[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### RAGConfig
Cấu hình admin:

```prisma
model RAGConfig {
  id          String  @id @default(uuid())
  key         String  @unique
  value       String  @db.Text
  valueType   String  @default("string")
  description String?
  category    String?
  isActive    Boolean @default(true)
  isSystem    Boolean @default(false)
}
```

### RAGAnalytics
Thống kê sử dụng:

```prisma
model RAGAnalytics {
  id                String   @id @default(uuid())
  date              DateTime @db.Date
  hour              Int?
  totalQueries      Int      @default(0)
  successfulQueries Int      @default(0)
  failedQueries     Int      @default(0)
  avgResponseTime   Float?
  avgTokensUsed     Int?
  avgConfidence     Float?
  intentBreakdown   Json?
  topQueries        Json?
}
```

## 2. Phân quyền Endpoints

### Public Endpoints (Không cần đăng nhập)
| Endpoint | Description |
|----------|-------------|
| `ragChat` | Chat với AI |
| `ragSearchProducts` | Tìm kiếm sản phẩm |
| `ragQuickStats` | Thống kê nhanh |
| `ragStatus` | Kiểm tra trạng thái |

### Authenticated Endpoints (Yêu cầu đăng nhập)
| Endpoint | Description |
|----------|-------------|
| `ragConversationHistory` | Xem lịch sử chat |
| `ragUserConversations` | Danh sách conversations |
| `ragClearHistory` | Xóa lịch sử của mình |

### Admin Endpoints (Chỉ Admin)
| Endpoint | Description |
|----------|-------------|
| `ragMetrics` | Xem metrics hệ thống |
| `ragUsageStats` | Thống kê sử dụng |
| `ragConfigs` | Xem cấu hình |
| `ragUpdateConfig` | Cập nhật cấu hình |
| `ragClearCache` | Xóa cache |
| `ragAdminClearHistory` | Xóa tất cả lịch sử |
| `ragResetConfig` | Reset cấu hình |
| `ragSeedConfigs` | Seed cấu hình mặc định |

## 3. Cấu hình mặc định

```typescript
{
  // Model settings
  modelName: 'gemini-2.0-flash',
  temperature: 0.7,
  maxTokens: 2000,
  
  // Rate limiting
  rateLimitPerMinute: 30,
  rateLimitPerHour: 500,
  
  // Feature flags
  enableCache: true,
  cacheTTLMinutes: 5,
  enableTokenOptimization: true,
  
  // Context settings
  maxContextItems: 50,
  defaultContextTypes: ['sanpham', 'donhang', 'khachhang'],
  
  // System prompts
  systemPrompt: 'Bạn là trợ lý AI chuyên về quản lý rau sạch...',
  welcomeMessage: 'Xin chào! Tôi là trợ lý AI của Rausach...',
  
  // Security
  requireAuth: false,
  adminOnlyEndpoints: ['clearCache', 'adminClearHistory', 'updateConfig'],
}
```

## 4. REST API Endpoints

### Public
```
POST /api/rag/chat         - Chat với AI
GET  /api/rag/search       - Tìm kiếm sản phẩm
GET  /api/rag/stats        - Thống kê nhanh
GET  /api/rag/status       - Kiểm tra trạng thái
```

### Authenticated
```
GET    /api/rag/history         - Lịch sử chat
GET    /api/rag/conversations   - Danh sách conversations
DELETE /api/rag/history         - Xóa lịch sử
```

### Admin Only
```
GET    /api/rag/metrics              - Metrics hệ thống
GET    /api/rag/admin/usage-stats    - Thống kê sử dụng
GET    /api/rag/admin/configs        - Xem cấu hình
PATCH  /api/rag/admin/configs        - Cập nhật cấu hình
POST   /api/rag/admin/configs/reset  - Reset cấu hình
POST   /api/rag/admin/configs/seed   - Seed cấu hình
DELETE /api/rag/admin/cache          - Xóa cache
DELETE /api/rag/admin/history        - Xóa tất cả lịch sử
```

## 5. Sử dụng Guards

### Decorators
```typescript
// Public endpoint - không cần auth
@RagPublic()
@Query(() => RAGResponseOutput, { name: 'ragChat' })
async ragChat() { ... }

// Admin only - yêu cầu role ADMIN
@RagAdminOnly()
@Query(() => RAGMetricsOutput, { name: 'ragMetrics' })
async ragMetrics() { ... }

// Default - yêu cầu đăng nhập (có token JWT)
@Query(() => [ConversationMessageOutput], { name: 'ragConversationHistory' })
async ragConversationHistory() { ... }
```

### Guards đã implement
1. **RagAuthGuard** - Kiểm tra JWT token và role
2. **RagRateLimitGuard** - Giới hạn request per minute/hour

## 6. Migration Database

```bash
# Generate Prisma Client
cd backend && npx prisma generate

# Push schema to database (development)
npx prisma db push

# Hoặc tạo migration (production)
npx prisma migrate dev --name add_rag_models
```

## 7. Seed Cấu hình mặc định

```graphql
mutation {
  ragSeedConfigs {
    success
    message
  }
}
```

Hoặc REST:
```bash
curl -X POST http://localhost:4000/api/rag/admin/configs/seed \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## 8. Files đã tạo/cập nhật

### Mới tạo:
- `services/rag-history.service.ts` - Persistent storage service
- `services/rag-config.service.ts` - Configuration service
- `guards/rag-auth.guard.ts` - Authentication guard
- `guards/rag-rate-limit.guard.ts` - Rate limiting guard
- `guards/index.ts` - Export guards

### Đã cập nhật:
- `prisma/schema.prisma` - Thêm RAGChatHistory, RAGConfig, RAGAnalytics models
- `rag-chatbot.module.ts` - Register new services và guards
- `rag-chatbot.resolver.ts` - Thêm guards và admin endpoints
- `rag-chatbot.controller.ts` - Thêm guards và admin endpoints
- `services/rag-chatbot.service.ts` - Integrate với RagHistoryService
- `dto/rag-chatbot.dto.ts` - Thêm DTOs cho admin features

## 9. Testing

### Test Public Endpoint
```graphql
query {
  ragChat(input: { message: "Có bao nhiêu sản phẩm?" }) {
    answer
    confidence
    sources { type entity }
  }
}
```

### Test Admin Endpoint (cần JWT Admin token)
```graphql
# Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }

query {
  ragMetrics {
    totalQueries
    avgResponseTime
    successRate
  }
}
```

### Test Rate Limiting
Gửi > 30 requests trong 1 phút sẽ nhận lỗi 429:
```json
{
  "statusCode": 429,
  "message": "Quá nhiều yêu cầu. Vui lòng đợi 1 phút.",
  "retryAfter": 45
}
```

## 10. Security Notes

1. **JWT Secret**: Đảm bảo `JWT_SECRET` trong `.env` được set properly
2. **Admin Role**: Chỉ users với `roleType: ADMIN` mới truy cập admin endpoints
3. **Rate Limiting**: Mặc định 30 req/min, 500 req/hour
4. **Persistent Storage**: History được lưu database, không mất khi restart
5. **Token Tracking**: Mỗi request được track số tokens để monitor cost

## 11. Monitoring

### Xem Usage Stats
```graphql
query {
  ragUsageStats {
    totalMessages
    totalConversations
    avgResponseTime
    avgConfidence
    intentBreakdown
  }
}
```

### Xem Configs hiện tại
```graphql
query {
  ragConfigs {
    key
    value
    valueType
    category
    isSystem
  }
}
```
