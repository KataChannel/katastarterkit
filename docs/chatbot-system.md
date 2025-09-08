# Hệ Thống Chatbot với AI Training

## Tổng quan

Hệ thống chatbot này cho phép người dùng:
1. Tạo và quản lý chatbots cá nhân
2. Upload và train AI với dữ liệu nội bộ cá nhân
3. Chat với AI đã được train với dữ liệu riêng
4. Quản lý conversations và lịch sử chat

## Kiến trúc Database

### Models chính:

#### ChatbotModel
- Quản lý thông tin chatbot (tên, prompt, cấu hình)
- Liên kết với User và TrainingData

#### TrainingData  
- Lưu trữ dữ liệu training (documents, text, conversations, FAQ)
- Hỗ trợ các loại: DOCUMENT, TEXT, FAQ, CONVERSATION, KNOWLEDGE_BASE
- Tự động xử lý và generate embeddings

#### ChatConversation & ChatMessage
- Quản lý conversations và messages
- Phân biệt vai trò: 'user' và 'assistant'

## API Endpoints

### Chatbot Management

#### Tạo Chatbot Mới
```bash
POST /chatbot
Authorization: Bearer <jwt_token>

{
  "name": "My AI Assistant",
  "description": "Personal assistant trained on my documents",
  "systemPrompt": "You are a helpful assistant...",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

#### Lấy danh sách Chatbots
```bash
GET /chatbot
Authorization: Bearer <jwt_token>
```

#### Lấy thông tin Chatbot
```bash
GET /chatbot/:id
Authorization: Bearer <jwt_token>
```

#### Cập nhật Chatbot
```bash
PUT /chatbot/:id
Authorization: Bearer <jwt_token>

{
  "name": "Updated name",
  "systemPrompt": "Updated prompt..."
}
```

#### Xóa Chatbot
```bash
DELETE /chatbot/:id
Authorization: Bearer <jwt_token>
```

### Training Data Management

#### Upload Training Data
```bash
POST /ai-training/:chatbotId
Authorization: Bearer <jwt_token>

{
  "title": "Company Documentation",
  "type": "DOCUMENT",
  "content": "Your document content here...",
  "filePath": "/path/to/file.txt" // optional
}
```

**Các loại Training Data:**
- `DOCUMENT`: Tài liệu văn bản
- `TEXT`: Văn bản thuần túy
- `FAQ`: Câu hỏi và trả lời
- `CONVERSATION`: Cuộc hội thoại mẫu
- `KNOWLEDGE_BASE`: Cơ sở tri thức

#### Lấy Training Data
```bash
GET /ai-training
Authorization: Bearer <jwt_token>
```

#### Xóa Training Data
```bash
DELETE /ai-training/:id
Authorization: Bearer <jwt_token>
```

### Chat với AI

#### Gửi tin nhắn
```bash
POST /chatbot/:id/message
Authorization: Bearer <jwt_token>

{
  "message": "Hello, can you help me with...",
  "conversationId": "optional-existing-conversation-id"
}
```

#### Lấy conversations
```bash
GET /chatbot/:id/conversations
Authorization: Bearer <jwt_token>
```

#### Lấy chi tiết conversation
```bash
GET /chatbot/conversation/:id
Authorization: Bearer <jwt_token>
```

## Quy trình sử dụng

### 1. Tạo Chatbot
```bash
# Tạo chatbot mới
curl -X POST http://localhost:14000/chatbot \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal Assistant",
    "description": "My personal AI assistant",
    "systemPrompt": "You are a helpful personal assistant trained on my documents. Always be polite and helpful.",
    "temperature": 0.7,
    "maxTokens": 2048
  }'
```

### 2. Upload Training Data
```bash
# Upload document training data
curl -X POST http://localhost:14000/ai-training/CHATBOT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Company Handbook",
    "type": "DOCUMENT",
    "content": "Company policies and procedures..."
  }'
```

### 3. Chat với AI
```bash
# Gửi tin nhắn đầu tiên
curl -X POST http://localhost:14000/chatbot/CHATBOT_ID/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the company vacation policies?"
  }'
```

### 4. Tiếp tục conversation
```bash
# Gửi tin nhắn tiếp theo trong cùng conversation
curl -X POST http://localhost:14000/chatbot/CHATBOT_ID/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How many vacation days do I get?",
    "conversationId": "CONVERSATION_ID_FROM_PREVIOUS_RESPONSE"
  }'
```

## Tính năng AI Training

### Xử lý Training Data tự động
- **Document Processing**: Tự động làm sạch và format documents
- **Text Processing**: Xử lý văn bản thuần túy  
- **FAQ Processing**: Format câu hỏi và trả lời
- **Conversation Processing**: Xử lý cuộc hội thoại mẫu
- **Embedding Generation**: Tự động tạo embeddings cho vector search

### Trạng thái Processing
- `PENDING`: Đang chờ xử lý
- `PROCESSING`: Đang xử lý
- `COMPLETED`: Hoàn thành
- `FAILED`: Thất bại

### Context-Aware Responses
AI sẽ sử dụng:
- Training data đã upload
- Lịch sử conversation (5 tin nhắn gần nhất)
- System prompt đã cấu hình
- Grok AI service cho generation

## Bảo mật

- Tất cả endpoints đều yêu cầu JWT authentication
- User chỉ có thể truy cập chatbots và data của mình
- Training data được encrypt và bảo mật

## Cấu hình

### Environment Variables cần thiết:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Grok AI (optional)
GROK_API_KEY="your-grok-api-key"
```

## Error Handling

### Common Error Responses:
- `401 Unauthorized`: Token không hợp lệ
- `404 Not Found`: Resource không tồn tại
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `403 Forbidden`: Không có quyền truy cập

### Example Error Response:
```json
{
  "statusCode": 404,
  "message": "Chatbot not found",
  "error": "Not Found"
}
```

## Development Notes

- Server chạy trên http://localhost:14000
- GraphQL playground: http://localhost:14000/graphql
- Health check: http://localhost:14000/health
- Build: `npm run build`
- Dev mode: `npm run dev`
- Database migrate: `npm run db:migrate`

## Tính năng sắp tới

1. **File Upload Integration**: Upload files trực tiếp thay vì text
2. **Advanced Embeddings**: Sử dụng OpenAI/HuggingFace embeddings
3. **Vector Search**: Tìm kiếm semantic trong training data
4. **Batch Training**: Upload nhiều files cùng lúc
5. **Export/Import**: Backup và restore chatbots
6. **Analytics**: Thống kê usage và performance
7. **Web Interface**: Frontend React component để quản lý

## Support

Liên hệ: [Your contact info]
Documentation: [Link to full docs]
