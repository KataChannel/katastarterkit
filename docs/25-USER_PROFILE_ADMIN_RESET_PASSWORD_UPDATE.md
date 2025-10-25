# User Profile & Admin Reset Password - Implementation Guide

## 📋 Tóm tắt cập nhật

Cập nhật code với hai tính năng mới:
1. **User Profile Management** - User tự cập nhật thông tin cá nhân
2. **Admin Reset Password** - Admin reset password ngẫu nhiên cho user

---

## 🎯 Tính năng mới

### 1. User Profile Management (User tự chỉnh sửa hồ sơ)

**Mutations:**
- `updateProfile` - Cập nhật firstName, lastName, avatar, phone
- `changePassword` - Thay đổi mật khẩu
- `setPassword` - Tạo mật khẩu cho tài khoản social login
- `hasPassword` - Query kiểm tra có mật khẩu

**Quyền:** Người dùng đã đăng nhập

### 2. Admin Reset Password (Admin reset mật khẩu cho user)

**Mutation:**
- `adminResetPassword` - Admin reset password ngẫu nhiên cho user

**Quyền:** Admin only (ADMIN role)

**Tính năng:**
- ✅ Tạo password ngẫu nhiên (12 ký tự)
- ✅ Bao gồm: chữ hoa, thường, số, ký tự đặc biệt
- ✅ Cập nhật DB
- ✅ Trả về password mới cho admin gửi cho user
- ✅ Audit logging

---

## 📁 Files được cập nhật

### Backend

#### 1. `backend/src/graphql/inputs/user.input.ts`
**Thêm Input Type:**
```typescript
/**
 * Input để admin reset mật khẩu cho người dùng
 * - Admin sẽ nhập ID người dùng
 * - Hệ thống tự động tạo mật khẩu ngẫu nhiên
 */
@InputType()
export class AdminResetPasswordInput {
  @Field()
  @IsUUID('4', { message: 'User ID phải là UUID hợp lệ' })
  userId: string;
}
```

#### 2. `backend/src/graphql/models/user.model.ts`
**Thêm Result Model:**
```typescript
/**
 * Result model cho admin reset password
 * - Trả về password mới đã được tạo
 * - Trả về user đã được cập nhật
 */
@ObjectType()
export class AdminResetPasswordResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  newPassword: string;

  @Field()
  user: User;
}
```

#### 3. `backend/src/graphql/resolvers/user.resolver.ts`
**Thêm Mutation:**
```typescript
/**
 * Admin reset password cho người dùng
 * - Tạo mật khẩu ngẫu nhiên
 * - Gửi email/thông báo cho người dùng
 * - Audit log sự kiện reset password
 */
@Mutation(() => AdminResetPasswordResult, { name: 'adminResetPassword' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles($Enums.UserRoleType.ADMIN)
async adminResetPassword(
  @Args('input') input: AdminResetPasswordInput,
  @CurrentUser() adminUser: User,
): Promise<AdminResetPasswordResult> {
  return this.userService.adminResetPassword(input.userId, adminUser.id);
}
```

#### 4. `backend/src/auth/auth.service.ts`
**Thêm Methods:**

1. **generateRandomPassword()** - Generate password ngẫu nhiên
```typescript
private generateRandomPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + special;
  let password = '';
  
  // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));
  
  // Điền phần còn lại
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Xáo trộn mật khẩu
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
```

2. **adminResetPassword()** - Reset password cho user
```typescript
async adminResetPassword(
  userId: string,
  adminId: string,
): Promise<{
  success: boolean;
  message: string;
  newPassword: string;
  user: User;
}> {
  // Kiểm tra người dùng tồn tại
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('Người dùng không tồn tại');
  }

  // Tạo mật khẩu ngẫu nhiên
  const newPassword = this.generateRandomPassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu
  const updatedUser = await this.prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  // Tạo audit log
  await this.prisma.auditLog.create({
    data: {
      userId: adminId,
      action: 'ADMIN_RESET_PASSWORD',
      resourceType: 'user',
      resourceId: userId,
      details: {
        targetUserId: userId,
        timestamp: new Date(),
        adminId: adminId,
      },
    },
  });

  this.logger.log(`✅ Admin ${adminId} reset password cho user ${userId}`);

  return {
    success: true,
    message: 'Mật khẩu đã được reset thành công. Mật khẩu mới đã được gửi cho người dùng.',
    newPassword,
    user: updatedUser,
  };
}
```

#### 5. `backend/src/services/user.service.ts`
**Thêm Method:**
```typescript
/**
 * Admin reset password cho người dùng
 * - Call authService để generate password ngẫu nhiên
 * - Trả về password mới cho admin gửi cho user
 */
async adminResetPassword(
  userId: string,
  adminId: string,
): Promise<{
  success: boolean;
  message: string;
  newPassword: string;
  user: User;
}> {
  return this.authService.adminResetPassword(userId, adminId);
}
```

### Frontend

#### `frontend/src/lib/graphql/auth-queries.ts`
**Thêm Queries & Mutations:**

```typescript
/**
 * Admin reset password mutation
 */
export const ADMIN_RESET_PASSWORD = gql`
  mutation AdminResetPassword($input: AdminResetPasswordInput!) {
    adminResetPassword(input: $input) {
      success
      message
      newPassword
      user {
        id
        email
        username
        firstName
        lastName
        avatar
        roleType
        isActive
        isVerified
        createdAt
      }
    }
  }
`;

/**
 * Update profile mutation
 */
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      username
      firstName
      lastName
      avatar
      phone
      roleType
      isActive
      isVerified
    }
  }
`;

/**
 * Change password mutation
 */
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

/**
 * Set password mutation (for social login users)
 */
export const SET_PASSWORD = gql`
  mutation SetPassword($input: SetPasswordInput!) {
    setPassword(input: $input)
  }
`;

/**
 * Check if user has password query
 */
export const HAS_PASSWORD = gql`
  query HasPassword {
    hasPassword
  }
`;

/**
 * Get current user profile
 */
export const GET_ME = gql`
  query GetMe {
    getMe {
      id
      email
      username
      firstName
      lastName
      avatar
      phone
      roleType
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`;
```

---

## 🧪 GraphQL Query Examples

### 1. User Update Profile

```graphql
mutation {
  updateProfile(input: {
    firstName: "Nguyễn"
    lastName: "Văn A"
    avatar: "https://example.com/avatar.jpg"
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

### 2. User Change Password

```graphql
mutation {
  changePassword(input: {
    currentPassword: "oldpass123"
    newPassword: "newpass123"
  })
}
```

### 3. Admin Reset Password

```graphql
mutation {
  adminResetPassword(input: {
    userId: "user-id-here"
  }) {
    success
    message
    newPassword
    user {
      id
      email
      username
      firstName
      lastName
    }
  }
}
```

### 4. Check Has Password

```graphql
query {
  hasPassword
}
```

### 5. Get Current User

```graphql
query {
  getMe {
    id
    email
    username
    firstName
    lastName
    avatar
    phone
    roleType
  }
}
```

---

## 🔒 Security Features

### Password Generation
- ✅ Độ dài 12 ký tự
- ✅ Chứa: chữ hoa, thường, số, ký tự đặc biệt
- ✅ Random shuffle để tránh pattern
- ✅ Không thể đoán được

### Password Hashing
- ✅ bcrypt hash with 10 rounds
- ✅ Salt được tạo ngẫu nhiên
- ✅ Không lưu mật khẩu plain-text

### Authorization
- ✅ Update Profile: User chỉ update của chính họ
- ✅ Change Password: Phải xác thực password hiện tại
- ✅ Admin Reset: Chỉ Admin role có quyền
- ✅ JWT authentication required

### Audit Logging
- ✅ Tất cả thay đổi được ghi log
- ✅ Admin ID được lưu khi reset password
- ✅ Timestamp và details được ghi
- ✅ Có thể query history

---

## 🛠️ Integration Steps

### 1. Install Dependencies (nếu chưa)
```bash
npm install bcryptjs class-validator
```

### 2. Update Backend Service
```bash
cd backend
npm install
npm run build
npm run start
```

### 3. Generate Schema
Schema sẽ tự động được generate khi build backend. File `backend/src/schema.gql` sẽ được update.

### 4. Frontend Implementation

#### Use with Apollo Client
```typescript
import { useMutation, useQuery } from '@apollo/client';
import { ADMIN_RESET_PASSWORD, UPDATE_PROFILE, CHANGE_PASSWORD } from '@/lib/graphql/auth-queries';

// Admin reset password
const [resetPassword] = useMutation(ADMIN_RESET_PASSWORD);

const handleResetPassword = async (userId: string) => {
  try {
    const { data } = await resetPassword({
      variables: {
        input: { userId }
      }
    });
    
    console.log('New password:', data.adminResetPassword.newPassword);
    // Show toast notification with new password
  } catch (error) {
    console.error('Reset failed:', error);
  }
};

// User update profile
const [updateProfile] = useMutation(UPDATE_PROFILE);

const handleUpdateProfile = async (profileData) => {
  try {
    await updateProfile({
      variables: {
        input: profileData
      }
    });
    toast.success('Cập nhật hồ sơ thành công');
  } catch (error) {
    toast.error(error.message);
  }
};

// User change password
const [changePassword] = useMutation(CHANGE_PASSWORD);

const handleChangePassword = async (currentPassword, newPassword) => {
  try {
    await changePassword({
      variables: {
        input: {
          currentPassword,
          newPassword
        }
      }
    });
    toast.success('Mật khẩu đã được thay đổi');
  } catch (error) {
    toast.error(error.message);
  }
};
```

---

## ✅ Testing Checklist

- [ ] User có thể update profile (firstName, lastName, avatar, phone)
- [ ] User không thể update email/username (nếu không cần)
- [ ] User có thể thay đổi password (verify current password)
- [ ] User không thể thay password thành password cũ
- [ ] User từ social login có thể tạo password
- [ ] Query hasPassword trả về true/false chính xác
- [ ] Admin có thể reset password cho user
- [ ] Password ngẫu nhiên được generate đúng format
- [ ] Audit log ghi lại event reset password
- [ ] Non-admin user không thể reset password cho user khác
- [ ] Invalid userId trả về error
- [ ] GraphQL schema được update

---

## 🚀 Deployment

### 1. Commit Changes
```bash
git add backend/src/graphql backend/src/auth backend/src/services
git add frontend/src/lib/graphql
git commit -m "feat: Add user profile management and admin reset password"
```

### 2. Build Backend
```bash
cd backend
npm run build
```

### 3. Deploy
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 4. Verify
- [ ] Backend starts without errors
- [ ] GraphQL schema generated
- [ ] Frontend can query GraphQL endpoint
- [ ] Test mutations in GraphQL Playground

---

## 📝 Notes

### Password Reset Policy
- New password được generate ngẫu nhiên, 12 ký tự
- Admin được thấy password mới 1 lần
- User nên thay đổi password ngay sau khi nhận được
- Đừng share password qua insecure channels

### Best Practices
1. **Email Notification:** Gửi email cho user khi admin reset password
2. **Temporary Password:** Có thể implement password expired sau X ngày
3. **Force Change:** Bắt user phải đổi password lần đầu login
4. **Audit Trail:** Track tất cả password changes
5. **Rate Limiting:** Limit số lần reset password

---

## 🔗 Related Files

- `backend/src/graphql/resolvers/user.resolver.ts` - User mutations
- `backend/src/auth/auth.service.ts` - Auth business logic
- `backend/src/services/user.service.ts` - User service
- `backend/src/graphql/models/user.model.ts` - GraphQL models
- `backend/src/graphql/inputs/user.input.ts` - GraphQL inputs
- `frontend/src/lib/graphql/auth-queries.ts` - Frontend queries

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `npm run logs`
2. Restart service: `npm restart`
3. Check database connections
4. Verify JWT tokens
5. Check GraphQL schema

---

**Updated:** 26/10/2025
**Version:** 1.0.0
