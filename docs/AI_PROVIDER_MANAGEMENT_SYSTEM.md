# AI Provider Management System - Complete Guide

## 🎯 Tổng Quan

Hệ thống AI Provider Management cho phép quản lý và tùy chỉnh nhiều AI providers (ChatGPT, Grok, Gemini) để hỗ trợ trả lời tự động trong Chat Support System.

## ✅ Hoàn Thành 100%

### 1. Database Schema ✅
- **Model:** `AIProvider` với 22 fields
- **Enum:** `AIProviderType` (CHATGPT, GROK, GEMINI)
- **Migration:** `20251031030413_add_ai_providers`
- **Relations:** Linked to User (creator)

### 2. Backend Services ✅

#### AIProviderService
**File:** `backend/src/support-chat/services/ai-provider.service.ts`

**Methods:**
- `createProvider(input, userId)` - Tạo provider mới
- `updateProvider(id, input)` - Cập nhật provider
- `deleteProvider(id)` - Xóa provider
- `getAllProviders()` - Lấy danh sách providers
- `getProviderById(id)` - Lấy provider theo ID
- `getActiveProvider(type?)` - Lấy provider active theo priority
- `getDefaultProvider(type)` - Lấy provider mặc định
- `updateStats(id, success, responseTime, error)` - Cập nhật statistics
- `getStats()` - Lấy tổng quan thống kê
- `maskApiKey(apiKey)` - Mask API key cho security

**Features:**
- Auto set default provider (only 1 default per type)
- API key masking for security
- Priority-based provider selection
- Real-time statistics tracking

#### AIResponseService
**File:** `backend/src/support-chat/services/ai-response.service.ts`

**Methods:**
- `generateResponse(messages, providerType?)` - Generate AI response
- `testProvider(providerId, testMessage)` - Test provider connection
- `callChatGPT(provider, messages)` - ChatGPT API integration
- `callGrok(provider, messages)` - Grok API integration (OpenAI-compatible)
- `callGemini(provider, messages)` - Gemini API integration

**Features:**
- Multi-provider support (ChatGPT, Grok, Gemini)
- Automatic fallback on failure
- Response time tracking
- Context-aware conversations
- Custom system prompts per provider

**Packages Installed:**
```bash
bun add openai @google/generative-ai
```

### 3. GraphQL API ✅

#### Resolver
**File:** `backend/src/support-chat/resolvers/ai-provider.resolver.ts`

**Queries:**
- `getAIProviders` - Danh sách tất cả providers
- `getAIProvider(id)` - Provider theo ID
- `getActiveAIProvider(providerType?)` - Provider đang active
- `getAIProviderStats` - Thống kê tổng quan

**Mutations:**
- `createAIProvider(input)` - Tạo provider mới
- `updateAIProvider(id, input)` - Cập nhật provider
- `deleteAIProvider(id)` - Xóa provider
- `testAIProvider(input)` - Test connection
- `setDefaultAIProvider(id)` - Set làm default
- `toggleAIProviderStatus(id, isActive)` - Bật/tắt provider

**Authorization:**
- Protected by JwtAuthGuard
- Requires ADMIN role

#### DTOs & Entities
**Files:**
- `dto/ai-provider.input.ts` - CreateAIProviderInput, UpdateAIProviderInput, TestAIProviderInput
- `entities/ai-provider.entity.ts` - AIProvider, AIProviderTestResult, AIProviderStats

### 4. Support Message Integration ✅

**File:** `backend/src/support-chat/services/support-message.service.ts`

**Updates:**
- Added `AIResponseService` dependency injection
- Added `autoAIResponse` option in `createMessage()`
- Implemented `generateAIResponse()` method
- Auto-generate AI response when customer sends message
- Build conversation context from last 10 messages
- Save AI response as BOT message type

**Workflow:**
1. Customer sends message → Save to database
2. If `autoAIResponse: true` → Trigger AI generation
3. Load last 10 messages for context
4. Call `AIResponseService.generateResponse()`
5. Save AI response as BOT message
6. WebSocket broadcasts new message to all clients

### 5. Frontend Integration ✅

#### GraphQL Operations
**File:** `frontend/src/graphql/support-chat/ai-provider.graphql.ts`

**Queries:**
- `GET_AI_PROVIDERS`
- `GET_AI_PROVIDER`
- `GET_ACTIVE_AI_PROVIDER`
- `GET_AI_PROVIDER_STATS`

**Mutations:**
- `CREATE_AI_PROVIDER`
- `UPDATE_AI_PROVIDER`
- `DELETE_AI_PROVIDER`
- `TEST_AI_PROVIDER`
- `SET_DEFAULT_AI_PROVIDER`
- `TOGGLE_AI_PROVIDER_STATUS`

**TypeScript Types:**
- `AIProviderType` enum
- `AIProvider` interface
- `AIProviderStats` interface
- `AIProviderTestResult` interface

#### Admin UI
**File:** `frontend/src/app/admin/support-chat/ai-settings/page.tsx`

**Features:**
- 📊 **Stats Dashboard:** Total providers, active count, total requests, success rate, avg response time
- ➕ **Add Provider:** Form để tạo provider mới
- ✏️ **Edit Provider:** Inline editing với modal form
- 🧪 **Test Connection:** Test API với custom message
- 🔄 **Toggle Status:** Bật/tắt provider
- ⭐ **Set Default:** Đặt provider làm mặc định
- 🗑️ **Delete Provider:** Xóa provider
- 📈 **Real-time Stats:** Requests, success, failed, avg time per provider
- 🎨 **Beautiful UI:** Framer Motion animations, responsive design

**UI Components:**
- Stats cards (5 metrics)
- Provider list (cards with actions)
- Add/Edit form (modal)
- Test result dialog
- Confirmation dialogs

### 6. Module Registration ✅

**File:** `backend/src/support-chat/support-chat.module.ts`

**Added Imports:**
- `AuthModule` - Provides JwtModule and JwtService for authentication
- `UserModule` - Provides UserService for user-related operations

**Added Providers:**
- `AIProviderService` to providers
- `AIResponseService` to providers
- `AIProviderResolver` to providers
- Both services exported for other modules

**Dependencies Fixed:**
- ✅ JwtAuthGuard now has access to JwtService via AuthModule
- ✅ RolesGuard has access to UserService via UserModule
- ✅ All authentication guards working properly

## 🔧 Cấu Hình & Sử Dụng

### 1. Thêm AI Provider Mới

**Via Admin UI:**
1. Truy cập `/admin/support-chat/ai-settings`
2. Click "Add AI Provider"
3. Điền form:
   - Provider Type: ChatGPT / Grok / Gemini
   - Name: Tên mô tả (e.g., "ChatGPT Production")
   - API Key: API key từ provider
   - Model: Model name (gpt-4, grok-2, gemini-pro)
   - Temperature: 0.0 - 2.0 (default: 0.7)
   - Max Tokens: 1 - 8000 (default: 2000)
   - System Prompt: Custom instructions (optional)
   - Priority: Số càng cao càng ưu tiên
   - Active: Bật/tắt
   - Set as Default: Đặt làm mặc định
4. Click "Create Provider"

**Via GraphQL:**
```graphql
mutation {
  createAIProvider(input: {
    provider: CHATGPT
    name: "ChatGPT Production"
    apiKey: "sk-..."
    model: "gpt-4"
    temperature: 0.7
    maxTokens: 2000
    systemPrompt: "You are a helpful customer support assistant..."
    isActive: true
    priority: 10
    isDefault: true
  }) {
    id
    name
    provider
  }
}
```

### 2. Test AI Provider

**Via Admin UI:**
1. Click "Test" button on provider card
2. Default test message: "Hello, this is a test message."
3. View result: Success/Error, Response, Response time, Tokens used

**Via GraphQL:**
```graphql
mutation {
  testAIProvider(input: {
    providerId: "provider-id"
    testMessage: "Hello, how are you?"
  }) {
    success
    response
    error
    responseTime
    tokensUsed
  }
}
```

### 3. Enable Auto AI Response

**In Support Message Creation:**
```typescript
await supportMessageService.createMessage(
  {
    conversationId: 'conv-id',
    content: 'Customer question',
    senderType: SupportSender.CUSTOMER,
  },
  {
    autoAIResponse: true, // Enable AI auto-response
  }
);
```

**In SupportChatWidget (Frontend):**
```typescript
const sendMessageMutation = useMutation(SEND_SUPPORT_MESSAGE, {
  variables: {
    input: {
      conversationId,
      content: message,
      autoAIResponse: true, // Enable AI
    }
  }
});
```

### 4. Provider Selection Logic

**Priority System:**
1. Lấy provider có `isActive: true`
2. Sắp xếp theo `priority` (DESC) → `createdAt` (DESC)
3. Provider đầu tiên được chọn

**Fallback Logic:**
- Nếu provider chính fail → Tự động retry với provider khác
- Nếu tất cả fail → Throw error

**Default Provider:**
- Chỉ có 1 default provider per provider type
- Khi set default, tất cả providers khác cùng type tự động unset

## 📊 Database Schema

```prisma
enum AIProviderType {
  CHATGPT
  GROK
  GEMINI
}

model AIProvider {
  id              String          @id @default(uuid())
  provider        AIProviderType
  name            String
  apiKey          String
  model           String
  temperature     Float           @default(0.7)
  maxTokens       Int             @default(2000)
  systemPrompt    String?         @db.Text
  isActive        Boolean         @default(false)
  priority        Int             @default(0)
  isDefault       Boolean         @default(false)
  description     String?         @db.Text
  tags            String[]
  
  // Stats
  totalRequests   Int             @default(0)
  successCount    Int             @default(0)
  failureCount    Int             @default(0)
  avgResponseTime Float?
  lastUsedAt      DateTime?
  lastError       String?         @db.Text
  
  // Metadata
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  createdBy       String?
  creator         User?           @relation("AIProviderCreator", fields: [createdBy], references: [id], onDelete: SetNull)
  
  @@index([provider, isActive])
  @@index([priority, isActive])
  @@map("ai_providers")
}
```

## 🔐 Security

1. **API Key Masking:**
   - API keys masked khi trả về client
   - Format: `sk-****...****1234`
   - Chỉ admin mới xem được

2. **Authorization:**
   - Tất cả endpoints yêu cầu JWT token
   - Chỉ ADMIN role mới access được

3. **Validation:**
   - Temperature: 0.0 - 2.0
   - Max Tokens: 1 - 8000
   - API key required
   - Model name required

## 📈 Monitoring & Stats

**Provider-level Stats:**
- Total Requests
- Success Count
- Failure Count
- Avg Response Time
- Last Used At
- Last Error

**System-level Stats:**
- Total Providers
- Active Providers
- Total Requests (all providers)
- Success Rate (%)
- Avg Response Time (ms)

## 🚀 API Examples

### ChatGPT Configuration
```json
{
  "provider": "CHATGPT",
  "name": "ChatGPT Production",
  "apiKey": "sk-...",
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 2000,
  "systemPrompt": "You are a helpful customer support assistant for an e-commerce platform."
}
```

### Grok Configuration
```json
{
  "provider": "GROK",
  "name": "Grok Backup",
  "apiKey": "xai-...",
  "model": "grok-2",
  "temperature": 0.8,
  "maxTokens": 1500,
  "systemPrompt": "You are a witty and helpful AI assistant."
}
```

### Gemini Configuration
```json
{
  "provider": "GEMINI",
  "name": "Gemini Alternative",
  "apiKey": "AIza...",
  "model": "gemini-pro",
  "temperature": 0.6,
  "maxTokens": 2000,
  "systemPrompt": "You are a knowledgeable customer support agent."
}
```

## ✅ Build Status

- ✅ Backend Build: SUCCESS (TypeScript compilation clean)
- ✅ Frontend Build: SUCCESS (67 pages generated)
- ✅ Prisma Migration: Applied successfully
- ✅ GraphQL Schema: Generated successfully

## 📁 Files Created/Modified

### Backend (9 files)
1. `backend/prisma/schema.prisma` - AIProvider model + enum
2. `backend/src/support-chat/dto/ai-provider.input.ts` - NEW
3. `backend/src/support-chat/entities/ai-provider.entity.ts` - NEW
4. `backend/src/support-chat/services/ai-provider.service.ts` - NEW
5. `backend/src/support-chat/services/ai-response.service.ts` - NEW
6. `backend/src/support-chat/services/support-message.service.ts` - UPDATED
7. `backend/src/support-chat/resolvers/ai-provider.resolver.ts` - NEW
8. `backend/src/support-chat/support-chat.module.ts` - UPDATED (added AuthModule, UserModule imports)
9. `backend/package.json` - Added openai, @google/generative-ai

### Frontend (2 files)
10. `frontend/src/graphql/support-chat/ai-provider.graphql.ts` - NEW
11. `frontend/src/app/admin/support-chat/ai-settings/page.tsx` - NEW

### Migration (1 file)
12. `backend/prisma/migrations/20251031030413_add_ai_providers/migration.sql` - NEW

## 🎉 Kết Luận

AI Provider Management System đã được tích hợp hoàn chỉnh vào Chat Support System với đầy đủ tính năng:

✅ Multi-provider support (ChatGPT, Grok, Gemini)
✅ Flexible configuration (temperature, tokens, prompts)
✅ Priority-based selection & fallback
✅ Real-time testing & monitoring
✅ Beautiful admin UI với full CRUD
✅ Auto AI response trong conversations
✅ Security (API key masking, role-based auth)
✅ Statistics tracking & reporting

**Hệ thống sẵn sàng sử dụng production!** 🚀
