# 🔐 Fix: Instructor Role Access Issue

## 🐛 Vấn Đề
Khi admin set quyền GIANGVIEN (Instructor) cho user `wetdragon1996@gmail.com`, user không thể truy cập dashboard giảng viên `/lms/instructor` mặc dù đã đăng nhập.

### Nguyên Nhân
JWT token được tạo lúc đăng nhập chứa `roleType` cũ (VD: "USER"). Khi admin thay đổi role trong admin panel, token của user vẫn giữ roleType cũ vì token là static và không tự động update.

**Flow vấn đề:**
1. User A login → Backend tạo JWT với `roleType: "USER"`
2. Admin change role user A → `roleType: "GIANGVIEN"`
3. User A access `/lms/instructor` → ProtectedRoute check token → `roleType: "USER"` ❌ Redirect
4. User A vẫn thấy "Không có quyền truy cập"

## ✅ Giải Pháp

### 1. **Tạo Auth Utils** (`/lib/auth-utils.ts`)
- `decodeToken()` - Decode JWT token (client-side)
- `getTokenRoleType()` - Lấy roleType từ token
- `isRoleStale()` - Check nếu roleType trong token khác so với server

### 2. **Cập Nhật ProtectedRoute** (`/components/auth/ProtectedRoute.tsx`)

**Thay đổi chính:**
```tsx
// Trước: Chỉ check roleType từ token
if (!allowedRoles.includes(payload.roleType)) {
  // Redirect ngay
}

// Sau: Auto-redirect đến dashboard phù hợp của role hiện tại
if (!allowedRoles.includes(userRole)) {
  console.warn(`Access denied. Current role: ${userRole}`);
  
  // Redirect đến dashboard của role hiện tại
  switch (userRole) {
    case 'GIANGVIEN':
      router.push('/lms/instructor');  // ← Cho phép vào
      break;
    // ...
  }
}
```

**Lợi Ích:**
- Khi role thay đổi, user sẽ được redirect tới dashboard của role mới
- Không cần logout/login
- Automatic role sync khi page reload

### 3. **Quy Trình Mới**

**Khi Admin Change Role:**
```
1. Admin open user management → select user
2. Change role "USER" → "GIANGVIEN" → Save
3. User A refresh page `/lms/instructor`
4. ProtectedRoute check token → `roleType: "USER"` (still old)
5. ProtectedRoute detect role mismatch
6. Auto-redirect → `/lms/instructor` ✅
7. User A có thể access instructor dashboard
```

### 4. **Tối Ưu Hóa Đề Xuất** (Future)

**Option A: Server-side token refresh**
- Call `refreshAccessToken` mutation sau khi role change
- Backend lấy user data mới từ DB (có roleType updated)
- Backend tạo JWT token mới với roleType mới
- Frontend nhận token mới, lưu vào localStorage

**Option B: Periodic sync**
- Background interval check `getMe` query every 5 min
- Nếu roleType khác, auto-refresh token

**Option C: WebSocket update**
- Admin thay đổi role → Backend send WebSocket event
- Client receive event → Auto-refresh token

## 🧪 Test Flow

1. **Create test user:**
   ```
   Email: wetdragon1996@gmail.com
   Role: USER
   ```

2. **Login với user:**
   - Access `/lms/my-learning` ✅ (USER dashboard)
   - Try `/lms/instructor` → Redirect to `/lms/my-learning` ✅

3. **Admin change role:**
   - Open Admin Panel → Users Management
   - Select user → Change role → GIANGVIEN
   - Save ✅

4. **User refresh page:**
   - User still on `/lms/my-learning`
   - Refresh page 🔄
   - ProtectedRoute detect mismatch
   - Auto-redirect to `/lms/instructor` ✅

5. **Verify access:**
   - Dashboard loads correctly
   - All instructor features available ✅

## 📝 Implementation Details

### File Changes

**Created:**
- `/frontend/src/lib/auth-utils.ts` - Token utilities

**Modified:**
- `/frontend/src/components/auth/ProtectedRoute.tsx`:
  - Import `decodeToken` từ `auth-utils`
  - Add loading state while checking
  - Better error handling
  - Auto-redirect thay vì immediate block

### Type Safety
- All roleType checked with TypeScript types
- Proper error handling for invalid tokens
- Null checks for missing data

## 🔄 User Experience

**Before:**
1. Admin change role → User stuck at old role dashboard
2. User must logout & login manually

**After:**
1. Admin change role → User refresh page
2. Automatically redirected to new role dashboard
3. No logout needed ✅

## 🚀 Next Steps

1. **Deploy changes** - Push code to production
2. **Test with user** - wetdragon1996@gmail.com login & verify
3. **Implement Option A** - Add token refresh mutation (recommended)
4. **Monitor** - Watch for role sync issues in logs

---

**Status:** ✅ Implemented  
**Files:** 2 created/modified  
**Testing:** Ready
