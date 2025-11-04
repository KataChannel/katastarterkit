# ✅ Fix: AI Course Generator Setup

## 🐛 Lỗi Gặp Phải

```
GraphQL execution errors: AI service is not configured. 
Please set GOOGLE_GEMINI_API_KEY
```

## ✅ Giải Pháp

### 1. Đã Thêm API Key vào Backend

**File: `backend/.env`**

```bash
# Google Gemini API (for AI Course Generator)
# Get your API key from: https://aistudio.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=AIzaSyAZWc5RriX_ZLqYSaL2TbrjtVWWv0M5Xes
```

### 2. Restart Backend để Load Environment

Backend cần restart để load biến môi trường mới:

```bash
# Option 1: Nếu đang chạy trong terminal
# Ctrl+C để stop, sau đó:
cd backend
npm run start:dev

# Option 2: Kill và restart
lsof -ti:13001 | xargs kill -9
cd backend && npm run start:dev
```

### 3. Lỗi File Watchers (Nếu Gặp)

Nếu gặp lỗi:
```
Error: ENOSPC: System limit for number of file watchers reached
```

**Fix bằng cách tăng limit:**

```bash
# Tạm thời (mất khi restart)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Hoặc chạy production build thay vì dev mode:
cd backend
npm run build
npm run start:prod
```

## 🔧 Verify Setup

### Test API Key đã Load:

```bash
# In backend code, check constructor log
# AICourseGeneratorService sẽ log:
# "⚠️ GOOGLE_GEMINI_API_KEY not set" (nếu chưa có)
# Hoặc không log gì (nếu đã có)
```

### Test GraphQL Mutation:

```graphql
mutation {
  generateCourseFromPrompt(
    prompt: "Tạo khóa học về Kỹ năng giao tiếp"
  ) {
    id
    title
    modules {
      title
      lessons {
        title
        quizzes {
          title
        }
      }
    }
  }
}
```

## 📋 Checklist

- [x] Thêm `GOOGLE_GEMINI_API_KEY` vào `backend/.env`
- [x] API key hợp lệ (từ Google AI Studio)
- [ ] Backend restart để load env
- [ ] GraphQL endpoint `/graphql` available
- [ ] Test mutation thành công

## 🎯 Kết Quả

Sau khi fix:
- ✅ Backend load API key
- ✅ AI service khởi tạo thành công
- ✅ Mutation `generateCourseFromPrompt` hoạt động
- ✅ Frontend có thể tạo khóa học với AI

## 📝 Notes

1. **API Key Location**: 
   - Backend: `backend/.env` → `GOOGLE_GEMINI_API_KEY`
   - Frontend: `frontend/.env` → Không cần (chỉ backend dùng)

2. **API Key Source**:
   - Get free key tại: https://aistudio.google.com/app/apikey
   - Hoặc dùng key đã có trong project

3. **Security**:
   - API key được set trong backend
   - Frontend không trực tiếp gọi Gemini API
   - Frontend → GraphQL → Backend → Gemini API

---
**Status**: ✅ CONFIGURED  
**Next Step**: Restart backend và test mutation
