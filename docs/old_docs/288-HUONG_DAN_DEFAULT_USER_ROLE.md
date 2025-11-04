# 🚀 HƯỚNG DẪN SỬ DỤNG: DEFAULT USER ROLE

## 📋 Tổng Quan

Hệ thống đã được cập nhật để **tự động gán role `user`** cho tất cả user mới đăng ký.

## 🎯 Các Bước Triển Khai

### Bước 1: Chạy RBAC Seeder (Bắt Buộc)

**Mục đích**: Tạo 7 default roles và 39 permissions

```bash
cd backend
bun run seed:rbac
```

**Output mong đợi**:
```
============================================================
🌱 RBAC SEEDER - Default Roles & Permissions
============================================================

Starting RBAC seeding...
Created permission: users:create
Created permission: users:read
...
Created role: super_admin with 39 permissions
Created role: admin with 30 permissions
Created role: manager with 22 permissions
Created role: team_lead with 17 permissions
Created role: user with 7 permissions  ← DEFAULT ROLE
Created role: viewer with 8 permissions
Created role: guest with 1 permission
Created default admin user: katachanneloffical@gmail.com

✅ RBAC seeding completed successfully!
```

### Bước 2: Migrate Existing Users (Nếu Cần)

**Khi nào cần**: Nếu đã có users trong database mà chưa có role

```bash
cd backend
bun run migrate:assign-roles
```

**Output mong đợi**:
```
============================================================
🔄 DEFAULT ROLE MIGRATION FOR EXISTING USERS
============================================================

🔍 Checking for users without roles...

📊 Found 5 users without roles:

1. user1@example.com (user1)
2. user2@example.com (user2)
3. user3@example.com (user3)
4. user4@example.com (user4)
5. user5@example.com (user5)

🎯 Assigning role: "Regular User" (user)

✅ Assigned role to: user1@example.com
✅ Assigned role to: user2@example.com
✅ Assigned role to: user3@example.com
✅ Assigned role to: user4@example.com
✅ Assigned role to: user5@example.com

============================================================
📊 MIGRATION SUMMARY
============================================================
✅ Success: 5 users
❌ Failed:  0 users
📦 Total:   5 users
============================================================

🔍 Verification: Checking users without roles...

✅ SUCCESS: All users now have roles assigned!

✅ Migration completed successfully!
```

### Bước 3: Test Đăng Ký User Mới

**GraphQL Mutation**:

```graphql
mutation RegisterNewUser {
  registerUser(input: {
    email: "newuser@example.com"
    username: "newuser"
    password: "SecurePassword123!"
    firstName: "New"
    lastName: "User"
  }) {
    user {
      id
      email
      username
      firstName
      lastName
      userRoles {
        role {
          name
          displayName
          priority
          permissions {
            permission {
              name
              displayName
              resource
              action
            }
          }
        }
      }
    }
    token
  }
}
```

**Response mong đợi**:

```json
{
  "data": {
    "registerUser": {
      "user": {
        "id": "cm3y5x8z10001abc123",
        "email": "newuser@example.com",
        "username": "newuser",
        "firstName": "New",
        "lastName": "User",
        "userRoles": [
          {
            "role": {
              "name": "user",
              "displayName": "Regular User",
              "priority": 600,
              "permissions": [
                {
                  "permission": {
                    "name": "tasks:create",
                    "displayName": "Create Tasks",
                    "resource": "task",
                    "action": "create"
                  }
                },
                {
                  "permission": {
                    "name": "tasks:read",
                    "displayName": "Read Tasks",
                    "resource": "task",
                    "action": "read"
                  }
                },
                {
                  "permission": {
                    "name": "tasks:update",
                    "displayName": "Update Tasks",
                    "resource": "task",
                    "action": "update"
                  }
                },
                {
                  "permission": {
                    "name": "projects:read",
                    "displayName": "Read Projects",
                    "resource": "project",
                    "action": "read"
                  }
                },
                {
                  "permission": {
                    "name": "content:create",
                    "displayName": "Create Content",
                    "resource": "content",
                    "action": "create"
                  }
                },
                {
                  "permission": {
                    "name": "content:read",
                    "displayName": "Read Content",
                    "resource": "content",
                    "action": "read"
                  }
                },
                {
                  "permission": {
                    "name": "content:update",
                    "displayName": "Update Content",
                    "resource": "content",
                    "action": "update"
                  }
                }
              ]
            }
          }
        ]
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Bước 4: Verify Permissions

**Query để check permissions của user hiện tại**:

```graphql
query GetMyPermissions {
  getMe {
    id
    email
    username
    userRoles {
      role {
        name
        displayName
        permissions {
          permission {
            name
            displayName
          }
        }
      }
    }
  }
}
```

## 🔍 Troubleshooting

### Lỗi: "Default user role not found"

**Nguyên nhân**: RBAC seeder chưa chạy hoặc role `user` bị xóa

**Giải pháp**:
```bash
cd backend
bun run seed:rbac
```

### Lỗi: "Email already exists"

**Nguyên nhân**: Email đã được đăng ký trước đó

**Giải pháp**: Sử dụng email khác hoặc xóa user cũ từ database

### User không có quyền sau khi đăng ký

**Nguyên nhân**: Query không include `userRoles` và `permissions`

**Giải pháp**: Cập nhật GraphQL query để include:
```graphql
userRoles {
  role {
    permissions {
      permission {
        name
      }
    }
  }
}
```

## 📊 Kiểm Tra Database

### Query Prisma Studio

```bash
cd backend
bun run db:studio
```

Mở Prisma Studio → Kiểm tra:
1. **User** table: User mới đã được tạo chưa
2. **UserRole** table: User có role `user` chưa
3. **Role** table: Role `user` có 7 permissions chưa

### Query SQL Trực Tiếp

```sql
-- Check users without roles
SELECT u.id, u.email, u.username 
FROM "User" u
LEFT JOIN "UserRole" ur ON u.id = ur."userId"
WHERE ur."userId" IS NULL;

-- Check role 'user' permissions count
SELECT r.name, COUNT(rp."permissionId") as permission_count
FROM "Role" r
LEFT JOIN "RolePermission" rp ON r.id = rp."roleId"
WHERE r.name = 'user'
GROUP BY r.id, r.name;

-- Should return: user | 7
```

## 🎯 Checklist Deployment

### Development
- [x] Chạy RBAC seeder
- [x] Test đăng ký user mới
- [x] Verify permissions trong response
- [x] Test user có thể tạo task
- [x] Test user có thể tạo content
- [ ] Migrate existing users (nếu có)

### Staging
- [ ] Deploy code mới
- [ ] Chạy RBAC seeder
- [ ] Migrate existing users
- [ ] Test đăng ký user mới
- [ ] Verify permissions
- [ ] Load testing

### Production
- [ ] Backup database trước khi deploy
- [ ] Deploy code mới
- [ ] Chạy RBAC seeder
- [ ] Migrate existing users (off-peak hours)
- [ ] Monitor logs
- [ ] Test đăng ký user mới
- [ ] Send notification về thay đổi

## 📝 Script Commands Reference

| Command | Mô Tả | Khi Nào Dùng |
|---------|-------|--------------|
| `bun run seed:rbac` | Tạo default roles & permissions | Lần đầu setup hoặc khi thêm role/permission mới |
| `bun run migrate:assign-roles` | Gán role cho users hiện có | Khi có users mà chưa có role |
| `bun run db:studio` | Mở Prisma Studio | Kiểm tra database visually |
| `bun run db:migrate` | Chạy Prisma migrations | Sau khi thay đổi schema |

## 🔐 Security Notes

### 1. **Principle of Least Privilege**

Role `user` chỉ có 7 quyền cơ bản:
- ✅ Có thể tạo/đọc/sửa tasks của mình
- ✅ Có thể xem projects
- ✅ Có thể tạo/đọc/sửa content của mình
- ❌ Không thể xóa tasks
- ❌ Không thể xóa content
- ❌ Không thể quản lý users
- ❌ Không thể quản lý roles/permissions

### 2. **Audit Trail**

Mọi role assignment đều có audit trail:
- User mới đăng ký: `assignedBy: 'system'`
- Migration: `assignedBy: 'system-migration'`
- Admin gán thủ công: `assignedBy: '<admin-user-id>'`

### 3. **Role Escalation**

Admin có thể nâng cấp role:
```graphql
mutation UpgradeUserRole {
  assignRoleToUser(
    userId: "user-id"
    roleId: "team-lead-role-id"
  ) {
    id
    userRoles {
      role {
        name
        displayName
      }
    }
  }
}
```

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Logs: `backend/logs/`
2. Database: Prisma Studio
3. Documentation: `DEFAULT_USER_ROLE_UPDATE.md`
4. Contact: katachanneloffical@gmail.com

---

**Version**: 1.0.0  
**Last Updated**: 03/11/2025  
**Author**: AI Assistant
