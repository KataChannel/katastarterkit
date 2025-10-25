# Auth API Update - Tiếng Việt + Profile & Password Management

## 📋 Tóm tắt cập nhật

Cập nhật hệ thống xác thực với:
- ✅ Tất cả thông báo lỗi sang tiếng Việt
- ✅ Quản lý hồ sơ người dùng (cập nhật thông tin)
- ✅ Quản lý mật khẩu (thay đổi + tạo mật khẩu)
- ✅ Hỗ trợ Social Login (Google, Facebook) + mật khẩu

---

## 🎯 Tính năng mới

### 1. Cập nhật Hồ sơ Người dùng (`updateProfile`)

**Endpoint GraphQL:**
```graphql
mutation {
  updateProfile(input: {
    firstName: "Nguyễn"
    lastName: "Văn A"
    avatar: "https://..."
    phone: "+84912345678"
  }) {
    id
    firstName
    lastName
    avatar
    phone
  }
}
```

**Chức năng:**
- ✅ Cập nhật họ, tên
- ✅ Cập nhật ảnh đại diện
- ✅ Cập nhật số điện thoại
- ✅ Kiểm tra số điện thoại không trùng
- ✅ Audit logging tự động

**Quyền:** Người dùng đã đăng nhập

### 2. Thay đổi Mật khẩu (`changePassword`)

**Endpoint GraphQL:**
```graphql
mutation {
  changePassword(input: {
    currentPassword: "oldpass123"
    newPassword: "newpass123"
  })
}
```

**Chức năng:**
- ✅ Xác thực mật khẩu hiện tại
- ✅ Kiểm tra mật khẩu mới khác mật khẩu cũ
- ✅ Mã hóa mật khẩu mới
- ✅ Audit logging

**Quyền:** Người dùng đã đăng nhập

**Lỗi có thể:**
- `"Người dùng không tồn tại"` - User ID không tìm thấy
- `"Tài khoản này không có mật khẩu. Vui lòng tạo mật khẩu trước."` - Login qua social
- `"Mật khẩu hiện tại không chính xác"` - Current password sai
- `"Mật khẩu mới phải khác mật khẩu cũ"` - Same as old

### 3. Tạo Mật khẩu (`setPassword`)

**Endpoint GraphQL:**
```graphql
mutation {
  setPassword(input: {
    password: "newpass123"
    confirmPassword: "newpass123"
  })
}
```

**Chức năng:**
- ✅ Tạo mật khẩu cho tài khoản chưa có (từ Social Login)
- ✅ Kiểm tra xác nhận mật khẩu khớp
- ✅ Mã hóa mật khẩu
- ✅ Audit logging

**Quyền:** Người dùng đã đăng nhập

**Lỗi có thể:**
- `"Tài khoản này đã có mật khẩu. Vui lòng sử dụng chức năng thay đổi mật khẩu."` - Already has password
- `"Mật khẩu xác nhận không khớp"` - Confirm password mismatch

### 4. Kiểm tra Có Mật khẩu (`hasPassword`)

**Endpoint GraphQL:**
```graphql
query {
  hasPassword
}
```

**Response:**
```graphql
true  # Có mật khẩu
false # Chưa có mật khẩu (từ social login)
```

**Chức năng:**
- ✅ Kiểm tra user có mật khẩu không
- ✅ Dùng để xác định UI hiển thị

**Quyền:** Người dùng đã đăng nhập

---

## 🔒 Quy trình Xác thực

### Đăng ký / Đăng nhập

```
1. Người dùng đăng ký/đăng nhập
   ↓
2. Hệ thống tạo tài khoản
   ↓
3. Hệ thống tạo JWT tokens
   ↓
4. Trả về accessToken + refreshToken
```

### Cập nhật Hồ sơ

```
1. Người dùng gửi updateProfile
   ↓
2. Hệ thống verify JWT
   ↓
3. Kiểm tra trùng số điện thoại
   ↓
4. Cập nhật database
   ↓
5. Tạo audit log
   ↓
6. Trả về user object
```

### Thay đổi Mật khẩu

```
1. Người dùng gửi changePassword
   ↓
2. Hệ thống verify JWT
   ↓
3. Xác thực mật khẩu hiện tại
   ↓
4. Kiểm tra mật khẩu mới khác cũ
   ↓
5. Mã hóa mật khẩu mới
   ↓
6. Cập nhật database
   ↓
7. Tạo audit log
   ↓
8. Trả về success: true
```

### Tạo Mật khẩu (Social Login)

```
1. Người dùng login via Google/Facebook
   ↓
2. Hệ thống tạo tài khoản (không có password)
   ↓
3. Người dùng vào Settings
   ↓
4. Frontend gọi hasPassword
   ↓
5. Nếu false, hiển thị "Tạo mật khẩu"
   ↓
6. Người dùng gửi setPassword
   ↓
7. Hệ thống tạo mật khẩu
   ↓
8. Sau này có thể thay đổi bằng changePassword
```

---

## 🌍 Tiếng Việt - Thông báo lỗi

### Auth Errors

| Tình huống | Thông báo |
|-----------|----------|
| Email/username không hợp lệ | "Email hoặc tên người dùng không hợp lệ" |
| Mật khẩu sai | "Email hoặc mật khẩu không hợp lệ" |
| Tài khoản bị khóa | "Tài khoản đã bị khóa" |
| Token refresh hết hạn | "Token làm mới không hợp lệ" |
| User không tồn tại | "Người dùng không tồn tại" |

### Profile Errors

| Tình huống | Thông báo |
|-----------|----------|
| Số điện thoại trùng | "Số điện thoại đã được sử dụng" |
| Invalid phone format | "Số điện thoại không hợp lệ" |

### Password Errors

| Tình huống | Thông báo |
|-----------|----------|
| Chưa có mật khẩu | "Tài khoản này không có mật khẩu. Vui lòng tạo mật khẩu trước." |
| Current password sai | "Mật khẩu hiện tại không chính xác" |
| Mật khẩu mới = cũ | "Mật khẩu mới phải khác mật khẩu cũ" |
| Confirm không khớp | "Mật khẩu xác nhận không khớp" |
| Đã có mật khẩu | "Tài khoản này đã có mật khẩu. Vui lòng sử dụng chức năng thay đổi mật khẩu." |

---

## 📝 Ví dụ Chi tiết

### Ví dụ 1: Cập nhật Profile

**Request:**
```graphql
mutation UpdateMyProfile {
  updateProfile(input: {
    firstName: "Nguyễn"
    lastName: "Văn A"
    phone: "+84912345678"
    avatar: "https://cdn.example.com/avatar.jpg"
  }) {
    id
    firstName
    lastName
    phone
    avatar
    email
  }
}
```

**Response:**
```json
{
  "data": {
    "updateProfile": {
      "id": "user-123",
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "phone": "+84912345678",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "email": "user@example.com"
    }
  }
}
```

### Ví dụ 2: Thay đổi Mật khẩu

**Request:**
```graphql
mutation ChangePass {
  changePassword(input: {
    currentPassword: "oldpass123"
    newPassword: "newpass123"
  })
}
```

**Response:**
```json
{
  "data": {
    "changePassword": true
  }
}
```

**Error Response:**
```json
{
  "errors": [
    {
      "message": "Mật khẩu hiện tại không chính xác"
    }
  ]
}
```

### Ví dụ 3: Tạo Mật khẩu (Social Login)

**Frontend flow:**
```typescript
// 1. Check nếu user có mật khẩu
const hasPassword = await checkHasPassword();

if (!hasPassword) {
  // 2. Show form tạo mật khẩu
  showSetPasswordForm();
  
  // 3. Người dùng submit
  const result = await setPassword({
    password: "newpass123",
    confirmPassword: "newpass123"
  });
  
  if (result) {
    toast.success("Mật khẩu đã được tạo thành công");
  }
}
```

**GraphQL:**
```graphql
query {
  hasPassword
}

mutation {
  setPassword(input: {
    password: "newpass123"
    confirmPassword: "newpass123"
  })
}
```

---

## 🔐 Security Features

### Password Security
- ✅ Mã hóa bcrypt 10 rounds
- ✅ Kiểm tra mật khẩu hiện tại trước khi thay đổi
- ✅ Kiểm tra mật khẩu mới khác mật khẩu cũ
- ✅ Xác nhận mật khẩu khớp

### Data Validation
- ✅ Email format validation
- ✅ Phone number format validation (Vietnam)
- ✅ Min length 6 cho passwords
- ✅ String length validations

### Audit Logging
- ✅ Tất cả thay đổi được log
- ✅ Action: UPDATE_PROFILE, CHANGE_PASSWORD, SET_PASSWORD
- ✅ Lưu fields được thay đổi
- ✅ Timestamp tự động

---

## 🛠️ Implementation

### Files Changed

| File | Change | Type |
|------|--------|------|
| `backend/src/auth/auth.service.ts` | Add 4 methods + Vietnamese errors | ✨ CORE |
| `backend/src/graphql/inputs/user.input.ts` | Add 2 input types | 📝 INPUT |
| `backend/src/graphql/resolvers/user.resolver.ts` | Add 4 mutations + 1 query | 🔧 RESOLVER |

### Methods Added

**auth.service.ts:**
- `updateProfile()` - Update user profile
- `changePassword()` - Change password
- `setPassword()` - Create password for social users
- `hasPassword()` - Check if user has password

**user.resolver.ts:**
- `updateProfile()` - Mutation
- `changePassword()` - Mutation
- `setPassword()` - Mutation
- `hasPassword()` - Query

---

## 📊 Database Schema

User table (existing):
```
User {
  id: String (PK)
  email: String (unique)
  username: String (unique)
  password: String (nullable - for social login)
  firstName: String
  lastName: String
  phone: String (unique, nullable)
  avatar: String
  roleType: UserRoleType
  isActive: Boolean
  isVerified: Boolean
  createdAt: DateTime
  updatedAt: DateTime
  lastLoginAt: DateTime
}

AuditLog {
  id: String (PK)
  userId: String (FK)
  action: String (UPDATE_PROFILE, CHANGE_PASSWORD, SET_PASSWORD)
  resourceType: String
  resourceId: String
  details: JSON
  createdAt: DateTime
}
```

---

## 🧪 Testing

### Test Cases

```typescript
// Test 1: Update profile successfully
test('updateProfile should update user data', async () => {
  const result = await updateProfile(userId, {
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    phone: '+84912345678'
  });
  expect(result.firstName).toBe('Nguyễn');
});

// Test 2: Change password successfully
test('changePassword should update password', async () => {
  const result = await changePassword(
    userId,
    'oldpass123',
    'newpass123'
  );
  expect(result.success).toBe(true);
});

// Test 3: Cannot set password if already has password
test('setPassword should fail if already has password', async () => {
  await expect(
    setPassword(userId, 'newpass123')
  ).rejects.toThrow('Tài khoản này đã có mật khẩu');
});

// Test 4: Check hasPassword
test('hasPassword should return true', async () => {
  const result = await hasPassword(userId);
  expect(result).toBe(true);
});
```

---

## 🚀 Deployment

### Build & Deploy

```bash
# Pull code
git pull

# Build backend
docker compose build --no-cache backend

# Deploy
bash scripts/3deploy.sh
```

### Verify

```bash
# Check logs
docker compose logs backend -f | grep -i auth

# Test API
curl -X POST http://localhost:12001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ hasPassword }"
  }'
```

---

## 📱 Frontend Integration

### React Hook Usage

```typescript
// Profile update
const updateProfileMutation = useMutation(UPDATE_PROFILE);

const handleUpdateProfile = async (data) => {
  try {
    const result = await updateProfileMutation({
      variables: { input: data }
    });
    toast.success('Cập nhật hồ sơ thành công');
  } catch (error) {
    toast.error(error.message);
  }
};

// Change password
const changePasswordMutation = useMutation(CHANGE_PASSWORD);

const handleChangePassword = async (currentPass, newPass) => {
  try {
    await changePasswordMutation({
      variables: {
        input: {
          currentPassword: currentPass,
          newPassword: newPass
        }
      }
    });
    toast.success('Mật khẩu đã được thay đổi');
  } catch (error) {
    toast.error(error.message);
  }
};

// Check & Set password
const { data: hasPasswordData } = useQuery(HAS_PASSWORD);

if (!hasPasswordData?.hasPassword) {
  return <SetPasswordForm onSet={handleSetPassword} />;
}
```

---

## 💡 Best Practices

### For Users
1. **Profile Updates**
   - Cập nhật thông tin đầy đủ sau khi đăng ký
   - Lưu ảnh đại diện chuyên nghiệp

2. **Password Management**
   - Nếu login qua Google/Facebook, hãy tạo mật khẩu
   - Thay đổi mật khẩu định kỳ
   - Dùng mật khẩu mạnh (>8 ký tự, mix uppercase/lowercase/numbers)

### For Developers
1. **Error Handling**
   - Catch error messages từ backend
   - Display trong Vietnamese

2. **Validation**
   - Validate input trước submit
   - Show real-time validation errors

3. **Security**
   - Không store passwords ở browser
   - HTTPS only
   - Validate phone/email format

---

## ✅ Status

**Implementation:** ✅ COMPLETE

**Files modified:** 3
- auth.service.ts (✅)
- user.input.ts (✅)
- user.resolver.ts (✅)

**Testing:** Ready for testing

**Deployment:** Ready for production

---

## 📞 Support

Cho bất kỳ câu hỏi về auth API, xem:
- Errors messages ở phần "Tiếng Việt - Thông báo lỗi"
- Examples ở phần "Ví dụ Chi tiết"
- GraphQL queries trong docs
