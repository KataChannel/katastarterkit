# 🔐 ADMIN USER SETUP

## Thông Tin Admin Mặc Định

- **Email**: `katachanneloffical@gmail.com`
- **Password**: `Kata@@2024`
- **Role Type**: `ADMIN`
- **Username**: `admin_kataofficial`
- **Phone**: `0977272967`

## Cách Thiết Lập

### 1. Sử dụng Seeder (Khuyên Dùng)

Chạy seed sẽ tự động tạo/cập nhật admin user:

```bash
# Backend
cd backend
bun run prisma:seed

# Hoặc Frontend (nếu sử dụng fullstack Next.js)
cd frontend
bun run prisma:seed
```

**Output mong đợi**:
```
🌱 Starting seed...
✅ Seed completed successfully!
👤 Admin user: katachanneloffical@gmail.com / Kata@@2024
👤 Test user: user@rausachcore.dev / user123
📝 Created 3 posts
🏷️ Created 4 tags
```

### 2. Sử dụng Script Riêng

Nếu chỉ muốn set admin mà không seed dữ liệu khác:

```bash
# Backend
cd backend
bun run set-kata-admin.ts

# Frontend
cd frontend
bun run scripts/set-kata-admin.ts
```

**Output mong đợi**:
```
🔧 Setting katachanneloffical@gmail.com as ADMIN...

✅ User updated successfully:
   📧 Email: katachanneloffical@gmail.com
   👤 Username: admin_kataofficial
   🔐 Role Type: ADMIN
   📱 Phone: 0977272967
   ✅ Active: true
   ✅ Verified: true

🔍 Checking super_admin role assignment...
   ✅ super_admin role assigned successfully!

🎉 Done! User is now ADMIN
📧 Email: katachanneloffical@gmail.com
🔑 Password: Kata@@2024
```

### 3. Kiểm Tra Admin User

Để kiểm tra thông tin admin user hiện tại:

```bash
cd backend
bun run check-admin-user.ts
```

**Output**:
```
🔍 Checking admin user details...

✅ Admin user found:
   📧 Email: katachanneloffical@gmail.com
   📱 Phone: 0977272967
   👤 Username: admin_kataofficial
   🆔 First Name: Phạm
   🆔 Last Name: Chí Kiệt
   ✅ Active: true
   ✅ Verified: true
   🔐 Role Type: ADMIN
   📅 Created: ...

🔐 Assigned Roles:
   ✅ super_admin (Super Administrator)
      📝 Full system access with all permissions
      🛡️  Permissions: 50+
         • user.create - Create User
         • user.read - View User
         • user.update - Update User
         • user.delete - Delete User
         ... and more permissions

🔥 Has Super Admin Role: ✅ YES
```

## Đăng Nhập

### Frontend (Next.js)

1. Truy cập: `http://localhost:3000/login`
2. Nhập:
   - Email: `katachanneloffical@gmail.com`
   - Password: `Kata@@2024`
3. Click "Login"

### Backend (GraphQL Playground/Apollo Studio)

```graphql
mutation LoginAdmin {
  login(input: {
    email: "katachanneloffical@gmail.com"
    password: "Kata@@2024"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      username
      roleType
    }
  }
}
```

## Thay Đổi Thông Tin

### Đổi Password

```bash
cd backend
# Edit file: update-admin-user.ts
# Thêm field password vào data:
data: {
  password: await bcrypt.hash('NewPassword123', 10)
}

bun run update-admin-user.ts
```

### Cập Nhật Thông Tin Khác

Sửa file `backend/update-admin-user.ts`:

```typescript
const updatedUser = await prisma.user.update({
  where: {
    email: 'katachanneloffical@gmail.com'
  },
  data: {
    phone: '0123456789',          // Phone mới
    firstName: 'Tên',             // Tên mới
    lastName: 'Họ',               // Họ mới
    // ... các field khác
  }
});
```

Rồi chạy:
```bash
bun run update-admin-user.ts
```

## Gán Role & Permissions

### 1. Chạy RBAC Seeder

Để tạo roles và permissions mặc định:

```bash
cd backend
bun run seed:rbac
```

### 2. Gán Super Admin Role

Script `set-kata-admin.ts` đã tự động gán `super_admin` role nếu chưa có.

Hoặc gán thủ công qua GraphQL:

```graphql
mutation AssignSuperAdmin {
  assignUserRoles(input: {
    userId: "user-id-here"
    assignments: [
      {
        roleId: "super-admin-role-id"
        effect: ALLOW
      }
    ]
  })
}
```

## Troubleshooting

### User không tồn tại

```bash
cd backend
bun run set-kata-admin.ts
```

### Không có quyền admin

Kiểm tra roleType:
```bash
bun run check-admin-user.ts
```

Nếu `roleType` không phải `ADMIN`, chạy:
```bash
bun run set-kata-admin.ts
```

### Không có super_admin role

```bash
# 1. Tạo roles & permissions
bun run seed:rbac

# 2. Gán role
bun run set-kata-admin.ts
```

### Quên password

```bash
cd backend
# Chỉnh sửa set-kata-admin.ts để đổi password
# Hoặc dùng update-admin-user.ts
bun run set-kata-admin.ts
```

## Files Liên Quan

- `backend/prisma/seed.ts` - Main seeder
- `backend/set-kata-admin.ts` - Set admin script
- `backend/check-admin-user.ts` - Check admin info
- `backend/update-admin-user.ts` - Update admin details
- `frontend/prisma/seed.ts` - Frontend seeder
- `frontend/scripts/set-kata-admin.ts` - Frontend set admin script

## Notes

- ⚠️ **Bảo mật**: Đổi password sau khi deploy production
- ✅ **Default**: User được tạo với `isActive: true` và `isVerified: true`
- 🔐 **Roles**: Có thể có cả `roleType: ADMIN` và `super_admin` role assignment
- 📱 **Phone**: Định dạng VN: `0977272967`
- 🆔 **Username**: `admin_kataofficial` (unique, không thay đổi)
