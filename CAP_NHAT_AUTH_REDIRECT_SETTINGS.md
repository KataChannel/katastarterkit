# 🔐 CẬP NHẬT WEBSITE SETTINGS - REDIRECT SAU KHI LOGIN

**Ngày thực hiện**: 03/11/2025  
**Mục tiêu**: Tùy chỉnh redirect URL sau khi login/logout/register dựa trên cấu hình

---

## 📊 TỔNG QUAN

### Tính năng mới
✅ **7 settings mới cho Auth Redirect**:
1. `auth_login_redirect` - Redirect sau login (mặc định: /dashboard)
2. `auth_logout_redirect` - Redirect sau logout (mặc định: /)
3. `auth_register_redirect` - Redirect sau đăng ký (mặc định: /welcome)
4. `auth_role_based_redirect` - Bật/tắt redirect theo role (mặc định: true)
5. `auth_redirect_admin` - Redirect cho ADMIN (mặc định: /admin)
6. `auth_redirect_user` - Redirect cho USER (mặc định: /dashboard)
7. `auth_redirect_guest` - Redirect cho GUEST (mặc định: /courses)

### Cách hoạt động
- **Mặc định**: Redirect theo role user (ADMIN → /admin, USER → /dashboard, GUEST → /courses)
- **Có thể tắt**: Set `auth_role_based_redirect = false` để dùng `auth_login_redirect` cho tất cả
- **Admin tùy chỉnh**: Cập nhật settings qua GraphQL hoặc Admin UI

---

## 🔧 THAY ĐỔI KỸ THUẬT

### 1. Database Schema

**File**: `backend/prisma/schema.prisma`

**Thêm enum AUTH**:
```prisma
enum SettingCategory {
  GENERAL
  HEADER
  FOOTER
  SEO
  SOCIAL
  CONTACT
  APPEARANCE
  ANALYTICS
  PAYMENT
  SHIPPING
  SUPPORT_CHAT
  AUTH          // ← MỚI
}
```

**Migration**: `20251103012830_add_auth_category_to_settings`

---

### 2. Backend API

#### A. Utils Functions

**File**: `backend/src/utils/auth-redirect.utils.ts` (MỚI)

**Functions**:
```typescript
// Lấy redirect URL theo role
getLoginRedirectUrl(userRole: string): Promise<string>

// Redirect sau logout
getLogoutRedirectUrl(): Promise<string>

// Redirect sau register
getRegisterRedirectUrl(): Promise<string>

// Lấy setting cụ thể
getAuthSetting(key: string): Promise<string | null>

// Cập nhật setting
updateAuthRedirectSetting(key: string, value: string, userId?: string): Promise<void>
```

**Logic Role-based Redirect**:
```typescript
if (roleBasedRedirect === true) {
  switch (userRole) {
    case 'ADMIN': return '/admin'
    case 'USER': return '/dashboard'
    case 'GUEST': return '/courses'
  }
} else {
  return auth_login_redirect // Dùng URL chung
}
```

#### B. GraphQL Response

**File**: `backend/src/graphql/models/auth.model.ts`

**Thêm field redirectUrl**:
```typescript
@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;

  @Field({ nullable: true })
  redirectUrl?: string;  // ← MỚI
}
```

#### C. Resolvers Updated

**File**: `backend/src/graphql/resolvers/user.resolver.ts`

**Mutations cập nhật**:
- ✅ `registerUser` - Trả về `redirectUrl` từ `auth_register_redirect`
- ✅ `loginUser` - Trả về `redirectUrl` dựa trên role
- ✅ `loginWithGoogle` - Trả về `redirectUrl` dựa trên role
- ✅ `loginWithFacebook` - Trả về `redirectUrl` dựa trên role
- ✅ `loginWithPhone` - Trả về `redirectUrl` dựa trên role

**Ví dụ**:
```typescript
@Mutation(() => AuthResponse, { name: 'loginUser' })
async loginUser(@Args('input') input: LoginUserInput): Promise<AuthResponse> {
  const user = await this.authService.validateUser(input.emailOrUsername, input.password);
  const tokens = await this.authService.generateTokens(user);
  const redirectUrl = await getLoginRedirectUrl(user.roleType);
  
  return {
    ...tokens,
    user,
    redirectUrl,  // ← Trả về URL redirect
  };
}
```

---

### 3. Seeding Script

**File**: `backend/scripts/seed-auth-redirect-settings.ts` (MỚI)

**Chạy script**:
```bash
cd backend
bun run scripts/seed-auth-redirect-settings.ts
```

**Kết quả**:
```
✅ Created: 7 auth redirect settings
```

---

## 📋 DANH SÁCH SETTINGS

| Key | Label | Default Value | Description |
|-----|-------|---------------|-------------|
| `auth_login_redirect` | Redirect sau khi đăng nhập | `/dashboard` | URL chuyển hướng sau login |
| `auth_logout_redirect` | Redirect sau khi đăng xuất | `/` | URL chuyển hướng sau logout |
| `auth_register_redirect` | Redirect sau khi đăng ký | `/welcome` | URL chuyển hướng sau register |
| `auth_role_based_redirect` | Bật redirect theo role | `true` | Cho phép redirect khác nhau theo role |
| `auth_redirect_admin` | Redirect cho ADMIN | `/admin` | URL cho ADMIN role |
| `auth_redirect_user` | Redirect cho USER | `/dashboard` | URL cho USER role |
| `auth_redirect_guest` | Redirect cho GUEST | `/courses` | URL cho GUEST role |

---

## 💡 CÁCH SỬ DỤNG

### 1. Frontend - Login Flow

```typescript
// GraphQL Mutation
mutation LoginUser($input: LoginUserInput!) {
  loginUser(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      roleType
    }
    redirectUrl  // ← Nhận URL redirect
  }
}

// Frontend code
const { data } = await loginUser({ variables: { input } });
if (data?.loginUser) {
  // Lưu token
  setToken(data.loginUser.accessToken);
  
  // Redirect theo URL từ server
  router.push(data.loginUser.redirectUrl || '/dashboard');
}
```

### 2. Admin - Tùy chỉnh Settings

**Query lấy settings**:
```graphql
query GetAuthSettings {
  websiteSettingsByCategory(category: AUTH) {
    key
    label
    value
    type
    description
  }
}
```

**Mutation cập nhật**:
```graphql
mutation UpdateAuthSetting($key: String!, $value: String!) {
  updateWebsiteSetting(key: $key, value: $value) {
    key
    value
  }
}
```

**Ví dụ**: Đổi redirect ADMIN từ `/admin` → `/dashboard-admin`
```graphql
mutation {
  updateWebsiteSetting(
    key: "auth_redirect_admin"
    value: "/dashboard-admin"
  ) {
    key
    value
  }
}
```

### 3. Tắt Role-based Redirect

**Set `auth_role_based_redirect = false`**:
```graphql
mutation {
  updateWebsiteSetting(
    key: "auth_role_based_redirect"
    value: "false"
  ) {
    key
    value
  }
}
```

→ Tất cả users sẽ redirect đến URL chung từ `auth_login_redirect`

---

## 🎯 KỊCH BẢN SỬ DỤNG

### Kịch bản 1: Shop bán hàng
- **ADMIN** → `/admin` (Quản lý shop)
- **USER** → `/my-orders` (Xem đơn hàng)
- **GUEST** → `/products` (Xem sản phẩm)

**Cấu hình**:
```
auth_role_based_redirect = true
auth_redirect_admin = /admin
auth_redirect_user = /my-orders
auth_redirect_guest = /products
```

### Kịch bản 2: LMS (Learning Management System)
- **ADMIN** → `/admin/courses` (Quản lý khóa học)
- **USER** → `/my-learning` (Khóa học của tôi)
- **GUEST** → `/courses` (Danh sách khóa học)

**Cấu hình**:
```
auth_role_based_redirect = true
auth_redirect_admin = /admin/courses
auth_redirect_user = /my-learning
auth_redirect_guest = /courses
```

### Kịch bản 3: Tất cả về Dashboard
- **Tất cả roles** → `/dashboard`

**Cấu hình**:
```
auth_role_based_redirect = false
auth_login_redirect = /dashboard
```

---

## 🔍 TESTING

### Test 1: Login ADMIN
```bash
# Login
mutation {
  loginUser(input: {
    emailOrUsername: "admin@example.com"
    password: "password123"
  }) {
    user { roleType }
    redirectUrl
  }
}

# Expected: redirectUrl = "/admin"
```

### Test 2: Login USER
```bash
mutation {
  loginUser(input: {
    emailOrUsername: "user@example.com"
    password: "password123"
  }) {
    user { roleType }
    redirectUrl
  }
}

# Expected: redirectUrl = "/dashboard"
```

### Test 3: Register
```bash
mutation {
  registerUser(input: {
    email: "newuser@example.com"
    username: "newuser"
    password: "password123"
  }) {
    redirectUrl
  }
}

# Expected: redirectUrl = "/welcome"
```

### Test 4: Tắt Role-based
```bash
# 1. Tắt role-based redirect
mutation {
  updateWebsiteSetting(
    key: "auth_role_based_redirect"
    value: "false"
  ) { key value }
}

# 2. Login với bất kỳ role nào
mutation {
  loginUser(input: {...}) {
    redirectUrl
  }
}

# Expected: redirectUrl = "/dashboard" (từ auth_login_redirect)
```

---

## 📦 FILES CREATED/MODIFIED

### Created
1. ✅ `backend/scripts/seed-auth-redirect-settings.ts` - Seed script
2. ✅ `backend/src/utils/auth-redirect.utils.ts` - Utility functions

### Modified
1. ✅ `backend/prisma/schema.prisma` - Thêm AUTH enum
2. ✅ `backend/src/graphql/models/auth.model.ts` - Thêm redirectUrl field
3. ✅ `backend/src/graphql/resolvers/user.resolver.ts` - Cập nhật 5 mutations
4. ✅ `backend/restore-website-settings.ts` - Thêm 7 auth settings

### Migration
✅ `20251103012830_add_auth_category_to_settings` - Add AUTH to SettingCategory enum

---

## 🚀 DEPLOYMENT

### Bước 1: Apply Migration
```bash
cd backend
bun prisma migrate deploy
```

### Bước 2: Seed Settings
```bash
bun run scripts/seed-auth-redirect-settings.ts
```

### Bước 3: Restart Server
```bash
# Development
bun run dev

# Production
pm2 restart backend
```

### Bước 4: Update Frontend
Cập nhật GraphQL queries để nhận `redirectUrl` field

---

## 📝 GHI CHÚ

### Ưu điểm
✅ Linh hoạt - Admin có thể tùy chỉnh không cần code  
✅ Role-based - Redirect khác nhau cho từng role  
✅ Đơn giản - Chỉ cần query 1 lần khi login  
✅ Backward compatible - Default values an toàn

### Best Practices
1. **Luôn validate URL** - Đảm bảo redirect URL là internal path
2. **Cache settings** - Cache trong Redis để giảm database queries
3. **Fallback URLs** - Luôn có default value khi setting bị lỗi
4. **Audit log** - Log mọi thay đổi settings

### Security Notes
⚠️ **Validate redirect URLs** - Không cho phép external URLs  
⚠️ **Permission check** - Chỉ ADMIN mới được sửa settings  
⚠️ **XSS protection** - Sanitize URLs trước khi redirect

---

## 🎉 KẾT QUẢ

✅ **7 auth redirect settings** đã được thêm vào database  
✅ **GraphQL API** trả về `redirectUrl` trong AuthResponse  
✅ **Role-based redirect** hoạt động với 3 roles (ADMIN, USER, GUEST)  
✅ **Admin có thể tùy chỉnh** qua GraphQL mutations  
✅ **Backward compatible** - Default values an toàn

---

**Version**: 1.0.1  
**Ngày cập nhật**: 03/11/2025  
**Status**: ✅ Hoàn thành & Fixed Bugs

---

## 🐛 BUG FIXES (03/11/2025)

### Vấn đề
- ❌ AUTH category không hiển thị trong admin panel `/admin/settings/website`
- ❌ GraphQL DTO thiếu AUTH enum
- ❌ Frontend types thiếu SUPPORT_CHAT và AUTH categories

### Đã sửa
1. ✅ **Backend GraphQL DTO** (`backend/src/graphql/dto/website-setting.input.ts`)
   - Thêm AUTH vào SettingCategory enum
   - Thêm URL vào SettingType enum
   - Sync với Prisma schema (12 categories, 10 types)

2. ✅ **Frontend Types** (`frontend/src/hooks/useWebsiteSettings.ts`)
   - Thêm SUPPORT_CHAT và AUTH vào category type
   - Sync với backend enum

3. ✅ **Frontend UI** (`frontend/src/app/admin/settings/website/page.tsx`)
   - Thêm AUTH tab với icon Shield
   - Import Shield icon từ lucide-react
   - Hiển thị 8 tabs (GENERAL, HEADER, FOOTER, CONTACT, SOCIAL, SEO, SUPPORT_CHAT, AUTH)

4. ✅ **Gộp APPEARANCE vào GENERAL**
   - Xóa APPEARANCE tab khỏi frontend
   - Update 3 settings (primary_color, secondary_color, accent_color) từ APPEARANCE → GENERAL
   - Settings hiển thị trong group "colors" của tab GENERAL

5. ✅ **Testing & Verification**
   - Verified 7 AUTH settings trong database
   - Tested GraphQL queries hoạt động bình thường
   - Prisma Client regenerated

### Kết quả
✅ Tab AUTH hiển thị đầy đủ 7 settings  
✅ GraphQL queries trả về đúng dữ liệu  
✅ Frontend UI sync với backend enum  
✅ APPEARANCE settings gộp vào GENERAL  
✅ Tất cả components hoạt động bình thường
