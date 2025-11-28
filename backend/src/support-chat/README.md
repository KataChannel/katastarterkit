# Support Chat Module - README

## 📁 File Structure

```
backend/src/support-chat/
├── dto/
│   └── create-conversation-auth.input.ts   # GraphQL input types
├── gateways/
│   └── support-chat.gateway.ts             # WebSocket gateway
├── services/
│   ├── support-conversation.service.ts     # Conversation logic
│   ├── support-message.service.ts          # Message handling
│   └── social-auth.service.ts              # OAuth verification
├── resolvers/
│   └── support-conversation.resolver.ts    # GraphQL resolvers
└── support-chat.module.ts                  # Module definition

frontend/src/
├── components/support-chat/
│   ├── SupportChatWidgetEnhanced.tsx       # Main widget component
│   ├── CustomerAuthBadge.tsx               # Auth type badge
│   └── AdminChatDashboard.tsx              # Admin interface (existing)
├── lib/
│   └── social-auth.ts                      # OAuth helpers
├── graphql/support-chat/
│   └── support-chat.graphql.ts             # GraphQL queries/mutations
└── app/
    ├── demo/support-chat-enhanced/
    │   └── page.tsx                        # Demo page
    └── auth/
        ├── zalo/callback/page.tsx          # Zalo callback
        ├── facebook/callback/page.tsx      # Facebook callback
        └── google/callback/page.tsx        # Google callback
```

## 🔑 Key Features

### 1. Multi-Auth Support
- **Guest**: Tên + Số điện thoại
- **Zalo**: OAuth login
- **Facebook**: OAuth login
- **Google**: OAuth login
- **User Account**: Existing user login

### 2. Customer Tracking
- Unique `customerIdentifier` for each customer
- Track auth method used at message time
- Visual indicators (icons) in messages
- Customer history across sessions

### 3. Real-time Communication
- WebSocket-based messaging
- Typing indicators
- Read receipts
- Agent assignment notifications
- Auth status updates

### 4. AI Integration
- Auto-suggestions for agents
- Context-aware responses
- Multi-provider support (ChatGPT, Grok, Gemini)

## 🎨 UI Components

### SupportChatWidgetEnhanced
Main customer-facing chat widget với:
- Tabbed auth interface
- Social login buttons
- Real-time messaging
- Mobile responsive
- Customizable colors & position

### CustomerAuthBadge
Reusable component để hiển thị auth type:
```tsx
<CustomerAuthBadge 
  authType="ZALO" 
  customerName="John Doe"
  showLabel={true}
  size="md"
/>
```

### Icons by Auth Type
- 👤 Guest
- 📱 Phone
- 💬 Zalo
- 👥 Facebook
- 🔍 Google
- 🔐 User Account

## 🔌 API Reference

### GraphQL Mutations

#### Create Conversation with Auth
```graphql
mutation CreateSupportConversationWithAuth($input: CreateConversationWithAuthInput!) {
  createSupportConversationWithAuth(input: $input) {
    id
    conversationCode
    customerName
    authType
  }
}
```

#### Send Message
```graphql
mutation SendSupportMessage($input: CreateSupportMessageInput!) {
  sendSupportMessage(input: $input) {
    id
    content
    customerAuthType
    customerAuthIcon
  }
}
```

### WebSocket Events

#### Client → Server
- `join_conversation`: Join a conversation room
- `leave_conversation`: Leave a conversation room
- `send_message`: Send a message
- `typing_start`: Start typing
- `typing_stop`: Stop typing
- `update_customer_auth`: Update auth info

#### Server → Client
- `new_message`: New message received
- `user_typing`: User is typing
- `user_stopped_typing`: User stopped typing
- `ai_suggestion`: AI suggestion for agent
- `agent_assigned`: Agent assigned to conversation
- `customer_auth_updated`: Customer auth updated

## 🔐 Security

### OAuth Token Validation
- Tokens are verified with social platforms
- Backend validates before creating conversation
- Tokens stored encrypted in database
- Access tokens have limited lifetime

### Data Protection
- Customer data encrypted at rest
- Sensitive info not exposed in logs
- CORS properly configured
- Rate limiting on API endpoints

## 📊 Database Schema

### SupportConversation (Updated)
```prisma
model SupportConversation {
  // ... existing fields
  authType           CustomerAuthType @default(GUEST)
  socialAuthId       String?
  socialAuthToken    String?
  socialAuthData     Json?
  customerIdentifier String?
}
```

### SupportMessage (Updated)
```prisma
model SupportMessage {
  // ... existing fields
  customerAuthType CustomerAuthType?
  customerAuthIcon String?
}
```

## 🧪 Testing

### Manual Testing
1. Start backend & frontend
2. Open demo page: `/demo/support-chat-enhanced`
3. Test each auth method
4. Verify messages show correct icons
5. Check database for stored data

### Integration Testing
```bash
# Backend
cd backend
bun test support-chat

# Frontend
cd frontend
bun test src/components/support-chat
```

## 🚀 Deployment

### Environment Setup
1. Copy `.env.support-chat.example` → `.env`
2. Fill in OAuth credentials
3. Update redirect URIs for production
4. Enable HTTPS

### Production Checklist
- [ ] OAuth apps configured for production domain
- [ ] Environment variables set
- [ ] Database migrated
- [ ] WebSocket SSL/TLS enabled
- [ ] CORS whitelist updated
- [ ] Rate limiting configured
- [ ] Monitoring & logging enabled

## 📈 Analytics

Track by auth type:
- Conversion rate
- Average response time
- Customer satisfaction
- Popular platforms
- Return customer rate

## 🛠️ Customization

### Colors
```tsx
<SupportChatWidgetEnhanced
  primaryColor="#10b981"  // Green
/>
```

### Position
```tsx
<SupportChatWidgetEnhanced
  position="bottom-left"  // or "bottom-right"
/>
```

### Enable/Disable Auth Methods
```tsx
<SupportChatWidgetEnhanced
  enableZaloLogin={false}     // Hide Zalo
  enableFacebookLogin={true}  // Show Facebook
  enableGoogleLogin={true}    // Show Google
/>
```

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket connection failed**
   - Check backend is running
   - Verify WS_URL in env
   - Check CORS settings

2. **OAuth redirect not working**
   - Verify redirect URIs match exactly
   - Check OAuth app settings
   - Ensure HTTPS in production

3. **Messages not showing icons**
   - Check customerAuthType is sent
   - Verify database has icons stored
   - Check frontend rendering logic

## 📚 Additional Resources

- [SUPPORT_CHAT_ENHANCED.md](./SUPPORT_CHAT_ENHANCED.md) - Full documentation
- [QUICK_SETUP_SUPPORT_CHAT.md](./QUICK_SETUP_SUPPORT_CHAT.md) - Setup guide
- [.env.support-chat.example](./.env.support-chat.example) - Environment variables

## 🤝 Contributing

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Test with all auth methods
5. Verify mobile responsive

## 📝 License

MIT License - See LICENSE file

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: rausachcore Team
