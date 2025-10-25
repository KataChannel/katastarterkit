# Chatbot Frontend Implementation

## Tổng quan
Đã hoàn thành việc triển khai frontend cho hệ thống chatbot với khả năng huấn luyện AI từ dữ liệu nội bộ cá nhân.

## Các tính năng đã triển khai

### 🤖 Quản lý Chatbot
- **Danh sách chatbot**: Hiển thị tất cả chatbots với thông tin trạng thái
- **Tạo chatbot mới**: Form tạo chatbot với cài đặt temperature, max tokens, system prompt
- **Chỉnh sửa chatbot**: Khả năng cập nhật thông tin chatbot
- **Xóa chatbot**: Xóa chatbot không cần thiết

### 💬 Giao diện Chat
- **Chat interface**: Giao diện chat thân thiện với hiển thị tin nhắn theo thời gian thực
- **Quản lý cuộc hội thoại**: Lưu trữ và tái tạo các cuộc hội thoại cũ
- **Tạo cuộc hội thoại mới**: Bắt đầu cuộc hội thoại mới với chatbot
- **Hiển thị trạng thái**: Loading states, typing indicators

### 📚 Quản lý dữ liệu huấn luyện
- **Upload file**: Drag & drop upload cho các file TEXT, PDF, CSV, JSON
- **Danh sách training data**: Hiển thị tất cả dữ liệu huấn luyện với trạng thái
- **Xóa training data**: Loại bỏ dữ liệu không cần thiết
- **Xử lý file**: Đọc nội dung file và tạo training data

### 🎨 UI/UX
- **Responsive design**: Tương thích với tất cả kích thước màn hình
- **Modern interface**: Sử dụng TailwindCSS v4 với design hiện đại
- **Icons**: Sử dụng Lucide React icons
- **Loading states**: Các trạng thái loading và error handling

## Cấu trúc Code

### Types (/types/chatbot.ts)
```typescript
- CreateChatbotDto
- ChatbotResponse  
- TrainingDataResponse
- ChatConversationResponse
- ChatMessageResponse
- Các enums: ChatbotStatus, TrainingDataType, TrainingStatus
```

### API Client (/lib/chatbot-api.ts)
```typescript
- ChatbotApiClient class
- Tất cả API calls: getChatbots, createChatbot, sendMessage, etc.
- Error handling và response formatting
```

### Hooks (/hooks/useChatbot.ts)
```typescript
- useChatbots(): Quản lý danh sách chatbots
- useChatbot(): Quản lý single chatbot
- useTrainingData(): Quản lý training data
- useChat(): Quản lý chat functionality
```

### Components (/components/chatbot/)
```typescript
- ChatbotList.tsx: Danh sách và quản lý chatbots
- ChatInterface.tsx: Giao diện chat chính
- TrainingDataManager.tsx: Quản lý dữ liệu huấn luyện
- ChatbotForm.tsx: Form tạo/chỉnh sửa chatbot
```

### Pages
```typescript
- /app/page.tsx: Trang chủ với giới thiệu
- /app/chatbot/page.tsx: Trang chính quản lý chatbot
- Navigation component với menu
```

## API Endpoints được sử dụng

### Chatbot Management
- `GET /chatbot` - Lấy danh sách chatbots
- `POST /chatbot` - Tạo chatbot mới
- `GET /chatbot/:id` - Lấy thông tin chatbot
- `PUT /chatbot/:id` - Cập nhật chatbot
- `DELETE /chatbot/:id` - Xóa chatbot

### Chat Functionality  
- `POST /chatbot/:id/message` - Gửi tin nhắn
- `GET /chatbot/:id/conversations` - Lấy danh sách cuộc hội thoại
- `GET /chatbot/conversation/:id` - Lấy chi tiết cuộc hội thoại

### Training Data
- `GET /ai-training` - Lấy danh sách training data
- `POST /ai-training/:chatbotId` - Tạo training data mới
- `DELETE /ai-training/:id` - Xóa training data

## Cách sử dụng

### 1. Truy cập ứng dụng
- Frontend: http://localhost:13000
- Backend API: http://localhost:14000
- GraphQL Playground: http://localhost:14000/graphql

### 2. Tạo chatbot mới
1. Nhấn "New Chatbot" trên trang chính
2. Điền thông tin: tên, mô tả, system prompt
3. Cài đặt temperature (0-2) và max tokens (1-4000)
4. Nhấn "Create Chatbot"

### 3. Upload training data
1. Chọn chatbot và nhấn "Training"
2. Kéo thả file hoặc click để chọn file
3. Hỗ trợ các format: TXT, PDF, CSV, JSON
4. Dữ liệu sẽ được xử lý tự động

### 4. Chat với chatbot
1. Chọn chatbot và nhấn "Chat"
2. Bắt đầu cuộc hội thoại mới hoặc tiếp tục cuộc hội thoại cũ
3. Nhập tin nhắn và nhấn Enter hoặc nút Send
4. Chatbot sẽ phản hồi dựa trên training data

## Trạng thái triển khai

### ✅ Đã hoàn thành
- [x] Backend API hoàn chỉnh với tất cả endpoints
- [x] Database schema với Prisma migrations
- [x] Frontend types và API client
- [x] React hooks cho state management  
- [x] UI components cho tất cả chức năng
- [x] Chat interface với real-time messaging
- [x] Training data management
- [x] Responsive design
- [x] Error handling và loading states
- [x] Navigation và routing

### 🔄 Có thể mở rộng thêm
- [ ] Authentication/Authorization
- [ ] File upload to cloud storage
- [ ] Advanced chat features (message editing, search)
- [ ] Analytics và reporting
- [ ] Bulk training data upload
- [ ] Chatbot performance metrics
- [ ] Export/Import chatbot configurations

## Công nghệ sử dụng

### Frontend
- **Next.js 15** - React framework với App Router
- **React 19** - UI library với hooks
- **TypeScript** - Type safety
- **TailwindCSS v4** - Styling framework
- **Lucide React** - Icon library
- **Bun** - Package manager và runtime

### Backend  
- **NestJS** - Node.js framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **GraphQL** - API layer (ngoài REST)
- **X.ai Grok API** - AI service integration

## Hướng dẫn phát triển

### Chạy ứng dụng
```bash
# Chạy tất cả services
cd /chikiet/kataoffical/fullstack/rausachcore
bun run dev

# Hoặc chạy riêng từng service
cd backend && bun run dev  # Port 14000
cd frontend && bun run dev # Port 13000
```

### Database
```bash
# Chạy migrations
cd backend && bun run prisma:migrate:dev

# Xem dữ liệu trong Prisma Studio  
cd backend && bun run prisma:studio
```

Hệ thống chatbot đã sẵn sàng để sử dụng và có thể mở rộng thêm nhiều tính năng khác!
