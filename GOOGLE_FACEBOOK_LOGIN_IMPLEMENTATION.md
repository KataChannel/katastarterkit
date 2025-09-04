# Hệ thống Authentication - Google và Facebook Login

## Tổng quan

Hệ thống authentication đã được cập nhật để hỗ trợ đăng nhập bằng Google, Facebook và số điện thoại với OTP. Hệ thống thực hiện logic:

1. **Kiểm tra email hoặc phone với hệ thống**
2. **Nếu tồn tại thì cập nhật liên kết Google ID hoặc Facebook ID**
3. **Nếu chưa tồn tại thì tạo mới thông tin người dùng**

## Cấu trúc Database

### AuthMethod Model
```prisma
model AuthMethod {
  id         String       @id @default(uuid())
  userId     String
  provider   AuthProvider // LOCAL, GOOGLE, FACEBOOK, PHONE
  providerId String?      // External provider ID
  isVerified Boolean      @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, provider])
  @@map("auth_methods")
}
```

### User Model
```prisma
model User {
  id          String   @id @default(uuid())
  email       String?  @unique
  username    String   @unique
  password    String?
  phone       String?  @unique
  firstName   String?
  lastName    String?
  avatar      String?
  role        UserRole @default(USER)
  isActive    Boolean  @default(true)
  isVerified  Boolean  @default(false)
  
  // Security settings
  isTwoFactorEnabled Boolean @default(false)
  failedLoginAttempts Int @default(0)
  lockedUntil         DateTime?
  lastLoginAt         DateTime?
  
  // Relations
  authMethods        AuthMethod[]
  // ... other relations
}
```

## Backend Implementation

### AuthService Methods

#### 1. Google Login
```typescript
async loginWithGoogle(googleId: string, email?: string, profile?: any)
```

#### 2. Facebook Login
```typescript
async loginWithFacebook(facebookId: string, email?: string, profile?: any)
```

#### 3. Phone Login
```typescript
async loginWithPhone(phone: string, profile?: any)
```

### GraphQL Mutations

#### 1. Google Login
```graphql
mutation LoginWithGoogle($input: SocialLoginInput!) {
  loginWithGoogle(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      username
      firstName
      lastName
      avatar
    }
  }
}
```

#### 2. Facebook Login
```graphql
mutation LoginWithFacebook($input: SocialLoginInput!) {
  loginWithFacebook(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      username
      firstName
      lastName
      avatar
    }
  }
}
```

#### 3. Phone Login
```graphql
mutation LoginWithPhone($input: PhoneLoginInput!) {
  loginWithPhone(input: $input) {
    accessToken
    refreshToken
    user {
      id
      phone
      username
      firstName
      lastName
    }
  }
}
```

#### 4. Request OTP
```graphql
mutation RequestPhoneVerification($input: RequestPhoneVerificationInput!) {
  requestPhoneVerification(input: $input) {
    success
    message
  }
}
```

## Frontend Implementation

### useAuth Hook

Hook cung cấp các method:
- `handleGoogleLogin()`
- `handleFacebookLogin()`
- `handlePhoneLogin()`
- `handleRequestOtp()`

### Example Usage

```typescript
import { useAuth } from '../hooks/useAuth';

const { handleGoogleLogin, handleFacebookLogin, handlePhoneLogin } = useAuth();

// Google Login
const loginWithGoogle = async () => {
  const result = await handleGoogleLogin({
    token: 'google_access_token',
    provider: 'GOOGLE',
    email: 'user@gmail.com',
    providerId: 'google_user_id',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'avatar_url',
  });
  
  if (result.success) {
    console.log('Login successful:', result.user);
  }
};

// Facebook Login
const loginWithFacebook = async () => {
  const result = await handleFacebookLogin({
    token: 'facebook_access_token',
    provider: 'FACEBOOK',
    email: 'user@facebook.com',
    providerId: 'facebook_user_id',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'avatar_url',
  });
  
  if (result.success) {
    console.log('Login successful:', result.user);
  }
};

// Phone Login
const loginWithPhone = async () => {
  // First request OTP
  await handleRequestOtp({ phone: '+84123456789' });
  
  // Then login with OTP
  const result = await handlePhoneLogin({
    phone: '+84123456789',
    otp: '123456',
  });
  
  if (result.success) {
    console.log('Login successful:', result.user);
  }
};
```

## Logic Flow

### Google/Facebook Login Flow

1. **Frontend** gọi Google/Facebook SDK để lấy token và thông tin profile
2. **Frontend** gửi thông tin đến backend qua GraphQL mutation
3. **Backend** kiểm tra:
   - Tìm `AuthMethod` với `provider` và `providerId`
   - Nếu tồn tại: Login user
   - Nếu không tồn tại nhưng có email:
     - Tìm User theo email
     - Nếu có: Tạo `AuthMethod` mới và liên kết
     - Nếu không: Tạo User mới với `AuthMethod`
4. **Backend** trả về tokens và user info

### Phone Login Flow

1. **Frontend** gửi yêu cầu OTP với số điện thoại
2. **Backend** tạo OTP và lưu vào `VerificationToken`
3. **Backend** gửi SMS (TODO: implement SMS service)
4. **Frontend** nhập OTP và gửi kèm số điện thoại
5. **Backend** verify OTP:
   - Kiểm tra OTP hợp lệ và chưa hết hạn
   - Tìm/tạo User với số điện thoại
   - Tạo/cập nhật `AuthMethod` với provider PHONE
6. **Backend** trả về tokens và user info

## Security Features

- **OTP Expiration**: OTP hết hạn sau 5 phút
- **OTP Single Use**: Mỗi OTP chỉ sử dụng được 1 lần
- **Account Lockout**: Hỗ trợ khóa tài khoản sau nhiều lần đăng nhập sai
- **Audit Logging**: Ghi log tất cả hoạt động authentication

## TODO

- [ ] Implement SMS service cho gửi OTP
- [ ] Implement Google OAuth verification
- [ ] Implement Facebook OAuth verification
- [ ] Add rate limiting cho OTP requests
- [ ] Add phone number format validation
- [ ] Implement remember me functionality
- [ ] Add two-factor authentication support
