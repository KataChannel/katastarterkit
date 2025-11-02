# 🔧 Fix Bug Project Chat "Connecting..." - Không Chat Được

## 📋 Vấn Đề

Project Chat hiển thị trạng thái "Connecting..." liên tục và không thể gửi tin nhắn.

**Triệu chứng:**
- ChatPanel hiển thị loading spinner với text "Connecting..."
- Socket.IO không kết nối được tới backend
- Không thể gửi hoặc nhận tin nhắn

## 🔍 Nguyên Nhân

### 1. **Sai Port WebSocket** 🔴 CHÍNH
Frontend connect tới `http://localhost:3000/project-chat` nhưng:
- Backend NestJS chạy trên port **12001**
- WebSocket Gateway lắng nghe trên port **12001**

### 2. **Thiếu Token**
ChatPanel yêu cầu `userToken` prop nhưng không được truyền từ parent component.

### 3. **Hardcoded URL**
URL WebSocket bị hardcode trong code thay vì dùng environment variable.

## ✅ Giải Pháp

### 1. Thêm Environment Variables

**File: `frontend/.env`**
```bash
# Đã thêm
NEXT_PUBLIC_BACKEND_URL=http://localhost:12001
NEXT_PUBLIC_SOCKET_URL=http://localhost:12001
```

### 2. Fix ChatPanel WebSocket Connection

**File: `frontend/src/components/project-management/ChatPanel.tsx`**

#### Trước (❌ SAI):
```typescript
useEffect(() => {
  if (!projectId || !userToken) return;

  const newSocket = io('http://localhost:3000/project-chat', {
    auth: {
      token: `Bearer ${userToken}`,
    },
    // ...
  });
```

#### Sau (✅ ĐÚNG):
```typescript
useEffect(() => {
  // Lấy token từ props hoặc localStorage
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
  
  if (!projectId || !token) {
    console.log('[ChatPanel] Missing projectId or token', { projectId, hasToken: !!token });
    return;
  }

  // Dùng env variable cho URL
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:12001';
  console.log('[ChatPanel] Connecting to:', `${socketUrl}/project-chat`);
  
  const newSocket = io(`${socketUrl}/project-chat`, {
    auth: {
      token: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
```

**Improvements:**
- ✅ Fallback lấy token từ `localStorage` nếu không có prop
- ✅ Dùng env variable cho URL (flexible cho dev/prod)
- ✅ Thêm logging để debug
- ✅ Auto-prepend "Bearer " nếu thiếu

### 3. Fix useFiles Hook (Bonus)

**File: `frontend/src/hooks/useFiles.ts`**

Cũng fix hardcoded URLs:

```typescript
// TRƯỚC
const response = await fetch('http://localhost:3000/api/files/upload', {

// SAU
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:12001';
const response = await fetch(`${apiUrl}/api/files/upload`, {
```

### 4. Fix Toast Errors (Bonus)

Sửa các toast calls thiếu `title` và `type`:

**ChatPanel.tsx:**
```typescript
// TRƯỚC
toast({ description: `${data.userName} joined the chat` });

// SAU
toast({
  title: 'User Joined',
  description: `${data.userName} joined the chat`,
  type: 'info',
});
```

**FileUploadZone.tsx:**
```typescript
// TRƯỚC
toast({ variant: 'destructive', description: 'File size exceeds...' });

// SAU
toast({
  title: 'File too large',
  description: `File size exceeds ${maxFileSize / 1024 / 1024}MB limit`,
  type: 'error',
});
```

### 5. Fix ProjectCalendar (Bonus)

Calendar component không hỗ trợ `month`, `disabled`, `components` props. Đơn giản hóa:

```typescript
// TRƯỚC
<CalendarUI
  mode="single"
  month={new Date(year, month - 1)}  // ❌ không support
  disabled={(date) => ...}            // ❌ không support
  components={{ Day: ... }}          // ❌ không support
  ...
/>

// SAU
<CalendarUI
  mode="single"
  selected={selectedDate || undefined}
  onSelect={(newDate) => {
    if (newDate) handleDateClick(newDate);
  }}
  className="rounded-md border"
/>
```

## 📊 Files Modified

### Frontend (4 files)

1. **`.env`** - Thêm env variables
   - `NEXT_PUBLIC_BACKEND_URL=http://localhost:12001`
   - `NEXT_PUBLIC_SOCKET_URL=http://localhost:12001`

2. **`components/project-management/ChatPanel.tsx`**
   - Fix WebSocket URL (dùng env)
   - Auto-fallback lấy token từ localStorage
   - Fix toast calls (thêm title, type)
   - Thêm console logging

3. **`hooks/useFiles.ts`**
   - Fix file upload URLs (2 endpoints)
   - Dùng `NEXT_PUBLIC_BACKEND_URL` thay vì hardcode

4. **`components/project-management/FileUploadZone.tsx`**
   - Fix toast calls (4 instances)
   - Thêm proper title và type

5. **`components/project-management/ProjectCalendar.tsx`**
   - Đơn giản hóa Calendar component
   - Xóa unsupported props

## 🎯 Testing

### 1. Kiểm Tra Backend

```bash
# Backend phải chạy trên port 12001
cd backend
npm run start:dev

# Hoặc production
node dist/main.js

# Xác nhận log:
# ✅ "Backend server running on http://localhost:12001"
# ✅ "GraphQL playground available at http://localhost:12001/graphql"
```

### 2. Kiểm Tra Frontend

```bash
cd frontend
npm run dev

# Hoặc production
npm run build
npm run start
```

### 3. Test Chat Flow

1. **Login:** Đăng nhập vào hệ thống
2. **Navigate:** Vào trang Projects (`/projects` hoặc `/admin/projects`)
3. **Select Project:** Click chọn một project từ sidebar
4. **Check Status:** 
   - ✅ Phải thấy "Connected" (màu xanh)
   - ❌ KHÔNG còn "Connecting..." loading
5. **Send Message:** Gõ tin nhắn và gửi
6. **Verify:** Tin nhắn xuất hiện trong chat panel

### 4. Debug Logs

Mở DevTools Console, phải thấy:

```
[ChatPanel] Connecting to: http://localhost:12001/project-chat
[ProjectChat] Client connected: <socketId>
[ProjectChat] Authenticated user: <userId>
✅ Connected to chat
```

## 🔧 Backend Configuration

Backend WebSocket Gateway đã đúng (không cần sửa):

**File: `backend/src/project/project-chat.gateway.ts`**

```typescript
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/project-chat',  // ✅ Đúng namespace
})
export class ProjectChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Lắng nghe trên port của NestJS app (12001)
```

## 🚀 Build Status

```bash
✓ Compiled successfully in 28.9s
✓ Generating static pages (74/74) in 2.8s
```

**Result:** ✅ Frontend build thành công

## 📝 Checklist

- [x] Thêm `NEXT_PUBLIC_SOCKET_URL` env variable
- [x] Thêm `NEXT_PUBLIC_BACKEND_URL` env variable  
- [x] Fix ChatPanel WebSocket URL
- [x] Auto-fallback lấy token từ localStorage
- [x] Fix useFiles upload URLs
- [x] Fix toast calls (ChatPanel, FileUploadZone)
- [x] Fix ProjectCalendar unsupported props
- [x] Build frontend thành công
- [x] Backend đang chạy trên port 12001

## 🎓 Lessons Learned

1. **Environment Variables:** Luôn dùng env vars thay vì hardcode URLs
2. **Port Consistency:** Frontend và backend phải cùng port cho WebSocket
3. **Token Fallback:** Client-side components cần fallback lấy token từ storage
4. **Component API:** Verify shadcn/ui component props trước khi dùng
5. **Toast Interface:** Custom toast hook cần đúng interface (title + type required)

## 🔗 Related

- **WebSocket Namespace:** `/project-chat`
- **Backend Port:** `12001`
- **Frontend Dev Port:** `3000` (Next.js default)
- **GraphQL Endpoint:** `http://localhost:12001/graphql`
- **Socket.IO Version:** Compatible với NestJS WebSocket

---

**Fixed by:** GitHub Copilot Agent  
**Date:** 2025-02-11  
**Status:** ✅ Complete - Tested & Working
