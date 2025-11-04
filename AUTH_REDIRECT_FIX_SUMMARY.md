# 🔧 AUTH REDIRECT FIX - SUMMARY

## 📋 Vấn đề đã fix

### 1. **Lỗi Tailwind CSS Dynamic Class** 
- **Vấn đề**: `grid-cols-${CATEGORIES.length}` không hoạt động vì Tailwind cần biết class cụ thể lúc compile time
- **Fix**: Thay bằng `grid-cols-4 lg:grid-cols-8` (responsive và static)
- **File**: `frontend/src/app/admin/settings/website/page.tsx`

### 2. **Group Label không thân thiện**
- **Vấn đề**: Group "redirect" hiển thị raw text
- **Fix**: Thêm function `getGroupLabel()` để map labels thân thiện
- **File**: `frontend/src/app/admin/settings/website/page.tsx`

### 3. **AUTH Redirect không hoạt động**
- **Vấn đề chính**: Frontend không query `redirectUrl` field từ GraphQL response
- **Backend**: Đã có logic đầy đủ trong `getLoginRedirectUrl()` và trả về `redirectUrl` trong `AuthResponse`
- **Frontend**: Thiếu query `redirectUrl` field

## 🔨 Các thay đổi đã thực hiện

### Backend (Không cần thay đổi - đã hoàn chỉnh)
- ✅ `AuthResponse` model có field `redirectUrl`
- ✅ `getLoginRedirectUrl()` function hoạt động đúng theo settings
- ✅ AUTH settings được seed đầy đủ

### Frontend

#### 1. GraphQL Queries
**File**: `frontend/src/lib/graphql/auth-queries.ts`
```typescript
// Thêm redirectUrl vào fragment
export const AUTH_RESPONSE_FRAGMENT = gql`
  fragment AuthResponseFragment on AuthResponse {
    accessToken
    refreshToken
    redirectUrl  // ← THÊM FIELD NÀY
    user { ... }
  }
`;
```

**File**: `frontend/src/lib/graphql/queries.ts`
```typescript
// Thêm redirectUrl vào LOGIN_MUTATION và REGISTER_MUTATION
export const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      user { ... }
      accessToken
      redirectUrl  // ← THÊM FIELD NÀY
    }
  }
`;
```

#### 2. AuthContext
**File**: `frontend/src/contexts/AuthContext.tsx`

```typescript
// Update interface
interface AuthContextType {
  login: (email: string, password: string) => 
    Promise<{ success: boolean; error?: string; redirectUrl?: string }>;
  register: (email: string, password: string, username: string) => 
    Promise<{ success: boolean; error?: string; redirectUrl?: string }>;
  // ...
}

// Update login function
const login = async (email: string, password: string) => {
  const { data } = await loginMutation(...);
  if (data?.loginUser?.accessToken) {
    const redirectUrl = data.loginUser.redirectUrl; // ← EXTRACT redirectUrl
    // ...
    return { success: true, redirectUrl }; // ← RETURN redirectUrl
  }
};

// Tương tự cho register function
```

#### 3. Login Page
**File**: `frontend/src/app/(auth)/login/page.tsx`

```typescript
const onSubmit = async (data: LoginFormData) => {
  const result = await login(data.email, data.password);
  if (result.success) {
    // Sử dụng redirectUrl từ settings hoặc fallback
    const redirectUrl = result.redirectUrl || 
                       searchParams?.get("returnUrl") || 
                       "/admin";
    router.push(redirectUrl);
  }
};
```

#### 4. useAuth Hook
**File**: `frontend/src/hooks/useAuth.ts`

```typescript
// Update tất cả login methods để trả về redirectUrl
const handleLogin = async (input: LoginUserInput) => {
  const { accessToken, refreshToken, user, redirectUrl } = 
    result.data.loginUser;
  return { success: true, user, accessToken, refreshToken, redirectUrl };
};
```

#### 5. Website Settings Page
**File**: `frontend/src/app/admin/settings/website/page.tsx`

```typescript
// Fix 1: Tailwind dynamic class
<TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">

// Fix 2: Friendly group labels
const getGroupLabel = (group: string) => {
  const labels: Record<string, string> = {
    'redirect': 'Chuyển hướng',
    'other': 'Khác',
    // ...
  };
  return labels[group] || group.replace(/_/g, ' ');
};

<CardTitle>{getGroupLabel(group)}</CardTitle>
```

## 🎯 Cách hoạt động

### Flow hoàn chỉnh:

1. **User login** → Frontend gọi GraphQL `loginUser` mutation
2. **Backend xử lý**:
   - Xác thực user
   - Lấy role của user (ADMIN, USER, GUEST, etc.)
   - Gọi `getLoginRedirectUrl(userRole)` 
   - Đọc settings từ database:
     - Nếu `auth_role_based_redirect = true` → redirect theo role
     - Nếu `false` → dùng `auth_login_redirect`
   - Trả về `redirectUrl` trong response
3. **Frontend nhận response**:
   - Extract `redirectUrl` từ response
   - Redirect user đến URL đó
   - Fallback: `returnUrl` query param hoặc `/admin`

### AUTH Settings trong database:

```
┌─────────────────────────────┬──────────────┬─────────────────┐
│ Key                         │ Value        │ Description     │
├─────────────────────────────┼──────────────┼─────────────────┤
│ auth_login_redirect         │ /dashboard   │ Default cho all │
│ auth_role_based_redirect    │ true         │ Bật role-based  │
│ auth_redirect_admin         │ /admin       │ ADMIN role      │
│ auth_redirect_user          │ /dashboard   │ USER role       │
│ auth_redirect_guest         │ /courses     │ GUEST role      │
│ auth_logout_redirect        │ /            │ Sau logout      │
│ auth_register_redirect      │ /welcome     │ Sau register    │
└─────────────────────────────┴──────────────┴─────────────────┘
```

## 🧪 Testing

### Test manual:

```bash
# 1. Chạy test script
./test-auth-redirect.sh

# 2. Test trong browser:
# - Mở http://localhost:3000/login
# - Đăng nhập với ADMIN
# - Kiểm tra redirect đến /admin
# - Vào /admin/settings/website -> tab AUTH
# - Thay đổi settings
# - Lưu và test lại
```

### Các trường hợp test:

1. ✅ **Role-based redirect BẬT**:
   - ADMIN login → redirect đến `/admin`
   - USER login → redirect đến `/dashboard`
   - GUEST login → redirect đến `/courses`

2. ✅ **Role-based redirect TẮT**:
   - Tất cả redirect đến `auth_login_redirect` (/dashboard)

3. ✅ **Custom redirect URL**:
   - Thay đổi settings trong `/admin/settings/website`
   - Lưu và test redirect mới

4. ✅ **ReturnUrl parameter**:
   - `/login?returnUrl=/specific-page`
   - Redirect đến `/specific-page` nếu không có redirectUrl từ settings

## 📁 Files đã thay đổi

```
frontend/
  src/
    app/
      admin/settings/website/page.tsx         ← Fix UI, group labels
      (auth)/login/page.tsx                   ← Use redirectUrl
    contexts/
      AuthContext.tsx                         ← Return redirectUrl
    hooks/
      useAuth.ts                              ← Return redirectUrl
    lib/graphql/
      auth-queries.ts                         ← Query redirectUrl field
      queries.ts                              ← Query redirectUrl field

test-auth-redirect.sh                        ← Test script (NEW)
```

## ✅ Kết quả

- ✅ AUTH redirect hoạt động đúng theo cấu hình
- ✅ Admin có thể thay đổi redirect URL trong settings
- ✅ Hỗ trợ role-based redirect
- ✅ Fallback mechanism hoàn chỉnh
- ✅ UI hiển thị settings thân thiện hơn
- ✅ Tailwind classes hoạt động đúng

## 🔄 Next Steps (Tùy chọn)

1. Thêm validation cho URL trong settings
2. Thêm preview redirect flow trong settings page
3. Log redirect history cho debugging
4. Thêm redirect settings cho thêm roles (GIANGVIEN, etc.)
