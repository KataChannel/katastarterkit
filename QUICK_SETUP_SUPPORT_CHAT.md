# Quick Setup Guide - Support Chat Enhanced

## Bước 1: Database Migration

```bash
cd backend
bun prisma migrate dev --name add_customer_auth_tracking
bun prisma generate
```

## Bước 2: Cấu Hình Environment Variables

### Backend (.env)
```bash
# Copy và điền thông tin
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
ZALO_APP_ID=your_zalo_app_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (.env.local)
```bash
# Copy và điền thông tin
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001/support-chat
NEXT_PUBLIC_ZALO_APP_ID=your_zalo_app_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Bước 3: Start Services

### Terminal 1 - Backend
```bash
cd backend
bun run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
bun run dev
```

## Bước 4: Test Chat Widget

1. Mở browser: `http://localhost:12000/demo/support-chat-enhanced`
2. Click vào chat button
3. Test các phương thức đăng nhập:
   - Nhập tên + số điện thoại
   - Đăng nhập Zalo (nếu đã config)
   - Đăng nhập Facebook (nếu đã config)
   - Đăng nhập Google (nếu đã config)

## Bước 5: Verify

### Kiểm tra Database
```bash
cd backend
bun prisma studio
```

Xem tables:
- `support_conversations`: Check fields `authType`, `socialAuthId`, `customerIdentifier`
- `support_messages`: Check fields `customerAuthType`, `customerAuthIcon`

### Kiểm tra WebSocket
```bash
# Backend logs sẽ hiển thị:
Client connected: xxx
Client joined conversation: xxx
```

### Kiểm tra GraphQL
Mở: `http://localhost:3001/graphql`

Test mutation:
```graphql
mutation {
  createSupportConversationWithAuth(input: {
    customerName: "Test User"
    customerPhone: "0123456789"
    authType: PHONE
    platform: WEBSITE
  }) {
    id
    conversationCode
    customerName
    authType
  }
}
```

## Troubleshooting

### Lỗi: "Failed to connect to WebSocket"
- Kiểm tra backend đang chạy
- Verify `NEXT_PUBLIC_WS_URL` trong frontend .env.local
- Check CORS config trong backend

### Lỗi: "Social login failed"
- Verify App IDs trong environment variables
- Check OAuth redirect URIs đã được config trong app settings
- Xem console logs để debug

### Lỗi: "Prisma migration failed"
- Kiểm tra DATABASE_URL
- Chạy: `bun prisma migrate reset` (cẩn thận: xóa data)
- Sau đó: `bun prisma migrate dev`

## Next Steps

1. **Production Deployment**
   - Update OAuth redirect URIs với production domain
   - Enable HTTPS
   - Update CORS whitelist

2. **Customize Widget**
   - Thay đổi colors
   - Custom position
   - Thêm quick replies

3. **Analytics**
   - Track conversion by auth type
   - Monitor customer engagement
   - Analyze response times

4. **Advanced Features**
   - File upload
   - Video chat
   - Screen sharing
   - Chatbot integration

## Support

Nếu gặp vấn đề, check:
- `SUPPORT_CHAT_ENHANCED.md` - Full documentation
- Backend logs: `backend/logs/`
- Frontend console: Browser DevTools

---

Happy Coding! 🚀
