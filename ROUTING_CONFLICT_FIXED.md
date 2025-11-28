# ✅ FIXED: Routing Conflict Resolution

## Issue Detected
Có xung đột giữa:
- `app/(auth)/` - Route group cho authentication pages
- `app/auth/` - OAuth callback pages

## Problem
Trong Next.js App Router:
- `(auth)` là route group → không tạo URL segment
- `auth` là normal folder → tạo URL segment `/auth/`

Nếu cả hai cùng tồn tại có thể gây confusion và potential conflicts.

## Solution Applied ✓

### 1. Renamed Directory
```bash
app/auth/ → app/oauth-callback/
```

### 2. Updated Files

#### OAuth Helper (`frontend/src/lib/social-auth.ts`)
```typescript
// Before:
redirectUri: `${window.location.origin}/auth/zalo/callback`

// After:
redirectUri: `${window.location.origin}/oauth-callback/zalo/callback`
```

#### Documentation
- `SUPPORT_CHAT_ENHANCED.md` - Updated redirect URIs
- `.env.support-chat.example` - Updated example URIs
- Added routing structure note

### 3. New Structure
```
app/
├── (auth)/                    # Route group - no URL segment
│   ├── login/                → /login
│   ├── register/             → /register
│   ├── forgot-password/      → /forgot-password
│   └── phone/                → /phone
│
└── oauth-callback/           # Normal folder - has URL segment
    ├── zalo/callback/        → /oauth-callback/zalo/callback
    ├── facebook/callback/    → /oauth-callback/facebook/callback
    └── google/callback/      → /oauth-callback/google/callback
```

## Benefits

1. **Clear Separation**: Authentication pages vs OAuth callbacks
2. **No Conflicts**: Different URL paths
3. **Better Organization**: Explicit naming
4. **Future-proof**: Room for more OAuth providers

## Action Required

Khi register OAuth apps, sử dụng redirect URIs mới:

### Development
```
http://localhost:12000/oauth-callback/zalo/callback
http://localhost:12000/oauth-callback/facebook/callback
http://localhost:12000/oauth-callback/google/callback
```

### Production
```
https://yourdomain.com/oauth-callback/zalo/callback
https://yourdomain.com/oauth-callback/facebook/callback
https://yourdomain.com/oauth-callback/google/callback
```

## Files Changed
- ✓ `frontend/src/app/auth/` → `frontend/src/app/oauth-callback/`
- ✓ `frontend/src/lib/social-auth.ts`
- ✓ `SUPPORT_CHAT_ENHANCED.md`
- ✓ `.env.support-chat.example`

## Status: ✅ RESOLVED

Không còn conflict. Cấu trúc routing đã được tối ưu và rõ ràng.
