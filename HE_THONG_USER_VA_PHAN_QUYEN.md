# 🔐 Tổng Quan Hệ Thống User và Phân Quyền

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [User Model & Roles](#user-model--roles)
3. [Hệ Thống RBAC](#hệ-thống-rbac)
4. [Authentication & Authorization](#authentication--authorization)
5. [Frontend Protection](#frontend-protection)
6. [Permission Flow](#permission-flow)
7. [Use Cases](#use-cases)
8. [Best Practices](#best-practices)

---

## 🎯 Tổng Quan

Dự án sử dụng **hệ thống phân quyền đa tầng** kết hợp:
- **Simple Role-Based** (UserRoleType) - Phân quyền cơ bản
- **Advanced RBAC** (Role-Based Access Control) - Phân quyền chi tiết
- **Resource-Level Permissions** - Quyền trên từng tài nguyên cụ thể

### Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────┐
│           USER AUTHENTICATION               │
│  (JWT Token + Email/Phone/Google/Facebook) │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│        AUTHORIZATION LAYERS                 │
├─────────────────────────────────────────────┤
│ Layer 1: UserRoleType (Simple)             │
│   - ADMIN, GIANGVIEN, USER, GUEST           │
├─────────────────────────────────────────────┤
│ Layer 2: RBAC (Advanced)                    │
│   - Roles, Permissions, RolePermissions     │
├─────────────────────────────────────────────┤
│ Layer 3: Resource Access                    │
│   - ResourceAccess (per resource)           │
└─────────────────────────────────────────────┘
```

---

## 👤 User Model & Roles

### 1. User Schema

**File:** `/backend/prisma/schema.prisma`

```prisma
model User {
  id         String       @id @default(uuid())
  email      String?      @unique
  username   String       @unique
  password   String?
  phone      String?      @unique
  firstName  String?
  lastName   String?
  avatar     String?
  roleType   UserRoleType @default(USER)  // ⭐ Simple Role
  isActive   Boolean      @default(true)
  isVerified Boolean      @default(false)

  // Security
  isTwoFactorEnabled  Boolean   @default(false)
  failedLoginAttempts Int       @default(0)
  lockedUntil         DateTime?
  lastLoginAt         DateTime?

  // RBAC Relations
  userRoles        UserRoleAssignment[]  // ⭐ Advanced RBAC
  userPermissions  UserPermission[]      // ⭐ Direct Permissions
  resourceAccesses ResourceAccess[]      // ⭐ Resource-Level Access

  // ... 40+ relations với modules khác
}
```

### 2. UserRoleType Enum (Simple Roles)

```prisma
enum UserRoleType {
  ADMIN       // Quản trị viên hệ thống - Toàn quyền
  GIANGVIEN   // Giảng viên LMS - Toàn quyền LMS ✨ NEW
  USER        // Người dùng thường - Quyền cơ bản
  GUEST       // Khách - Chỉ xem
}
```

**Quyền hạn mặc định:**

| Role | Mô tả | Quyền hạn | Use Case |
|------|-------|-----------|----------|
| **ADMIN** | Super Admin | - Toàn quyền hệ thống<br/>- Quản lý users, roles, permissions<br/>- Truy cập tất cả modules<br/>- Security & audit logs | Quản trị viên công ty |
| **GIANGVIEN** | LMS Instructor | - Toàn quyền LMS<br/>- Tạo/quản lý courses<br/>- Quản lý students<br/>- Analytics LMS<br/>- ❌ Không có quyền admin hệ thống | Giảng viên đào tạo |
| **USER** | Regular User | - Xem/tạo nội dung cá nhân<br/>- Enroll courses<br/>- Comment, like<br/>- Quản lý profile | Nhân viên, học viên |
| **GUEST** | Guest/Visitor | - Chỉ xem nội dung public<br/>- ❌ Không tạo/sửa/xóa | Khách vãng lai |

### 3. Auth Providers

```prisma
enum AuthProvider {
  LOCAL      // Email + Password
  GOOGLE     // Google OAuth
  FACEBOOK   // Facebook OAuth
  PHONE      // Phone OTP
}
```

**Model AuthMethod:**
```prisma
model AuthMethod {
  id         String       @id @default(uuid())
  userId     String
  provider   AuthProvider
  providerId String?      // External provider ID
  isVerified Boolean      @default(false)
  user       User         @relation(...)
}
```

**User có thể có nhiều auth methods** (VD: Email + Google)

---

## 🔒 Hệ Thống RBAC (Advanced)

### 1. RBAC Components

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│     User     │──────│     Role     │──────│  Permission  │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │                     │                      │
       ▼                     ▼                      ▼
┌──────────────┐      ┌──────────────┐      
│ UserRole     │      │ RolePerms    │      
│ Assignment   │      │              │      
└──────────────┘      └──────────────┘      
       │                                           
       ▼                                           
┌──────────────┐                                  
│ UserPerms    │ ◄── Direct assignment            
│              │                                  
└──────────────┘                                  
```

### 2. Role Model

```prisma
model Role {
  id          String  @id @default(uuid())
  name        String  @unique        // super_admin, admin, manager...
  displayName String                 // "Super Administrator"
  description String?
  
  // Hierarchy
  parentId    String?
  parent      Role?   @relation("RoleHierarchy", ...)
  children    Role[]  @relation("RoleHierarchy")
  
  // Properties
  isSystemRole Boolean @default(false)  // Cannot delete
  isActive     Boolean @default(true)
  priority     Int     @default(0)      // Higher = more powerful
  
  // Metadata
  metadata    Json?   // Custom config
  
  // Relations
  permissions RolePermission[]
  userRoles   UserRoleAssignment[]
}
```

**Role Hierarchy Example:**
```
super_admin (priority: 1000)
  ├─ admin (priority: 900)
  │   ├─ manager (priority: 800)
  │   └─ moderator (priority: 700)
  └─ editor (priority: 600)
      └─ contributor (priority: 500)
```

### 3. Permission Model

```prisma
model Permission {
  id          String  @id @default(uuid())
  name        String  @unique        // users:create, tasks:read
  displayName String                 // "Create Users"
  description String?
  
  // Permission Structure
  resource    String  // user, task, project, content...
  action      String  // create, read, update, delete, manage...
  scope       String? // own, team, organization, global
  
  // Properties
  isSystemPerm Boolean @default(false)
  isActive     Boolean @default(true)
  category     String  @default("general")
  
  // Conditions (JSON-based)
  conditions  Json?   // Dynamic permission rules
  metadata    Json?
  
  // Relations
  rolePermissions RolePermission[]
  userPermissions UserPermission[]
  
  @@unique([resource, action, scope])
}
```

**Permission Naming Convention:**
```
{resource}:{action}:{scope}

Examples:
- users:create         → Create any user
- users:update:own     → Update own user
- tasks:read:team      → Read team tasks
- projects:delete:org  → Delete org projects
- system:admin         → System administration
```

**Default Permissions (95+ permissions):**

| Category | Permissions | Example |
|----------|-------------|---------|
| **User Management** | create, read, update, delete | `users:create` |
| **Role Management** | create, read, update, delete | `roles:update` |
| **Permission Management** | create, read, update, delete | `permissions:read` |
| **Task Management** | create, read, update, delete, assign | `tasks:assign` |
| **Project Management** | create, read, update, delete, manage | `projects:manage` |
| **Content Management** | create, read, update, delete, publish | `content:publish` |
| **Security Management** | audit, monitor, manage | `security:audit` |
| **System Admin** | admin, config, backup | `system:admin` |
| **Analytics** | read, export | `analytics:export` |

### 4. RolePermission (Many-to-Many)

```prisma
model RolePermission {
  id           String @id @default(uuid())
  roleId       String
  permissionId String
  
  // Configuration
  effect     String    @default("allow")  // allow, deny
  conditions Json?     // Additional rules
  
  // Metadata
  grantedBy  String?   // Who granted this
  grantedAt  DateTime  @default(now())
  expiresAt  DateTime? // Optional expiration
  
  // Relations
  role       Role       @relation(...)
  permission Permission @relation(...)
  
  @@unique([roleId, permissionId])
}
```

**Effect Types:**
- `allow` - Grant permission
- `deny` - Explicitly deny (overrides allow)

**Conditions Example (JSON):**
```json
{
  "department": "IT",
  "workingHours": "9-17",
  "ipRange": "192.168.1.0/24"
}
```

### 5. UserRoleAssignment

```prisma
model UserRoleAssignment {
  id     String @id @default(uuid())
  userId String
  roleId String
  
  // Assignment Properties
  effect String  @default("allow")
  scope  String? // Scope limitation
  
  // Details
  assignedBy String?   // Admin who assigned
  assignedAt DateTime  @default(now())
  expiresAt  DateTime? // Temporary role
  
  // Conditions
  conditions Json?
  metadata   Json?
  
  // Relations
  user User @relation(...)
  role Role @relation(...)
  
  @@unique([userId, roleId])
}
```

**Example:** Assign "manager" role với scope "IT department"

### 6. UserPermission (Direct Assignment)

```prisma
model UserPermission {
  id           String @id @default(uuid())
  userId       String
  permissionId String
  
  // Direct Permission
  effect String  @default("allow")
  scope  String?
  
  // Details
  assignedBy String?
  assignedAt DateTime  @default(now())
  expiresAt  DateTime?
  reason     String?   // Why direct permission?
  
  // Conditions & Metadata
  conditions Json?
  metadata   Json?
  
  // Relations
  user       User       @relation(...)
  permission Permission @relation(...)
  
  @@unique([userId, permissionId])
}
```

**Use Case:** Grant temporary permission cho user cụ thể

### 7. ResourceAccess (Resource-Level)

```prisma
model ResourceAccess {
  id           String @id @default(uuid())
  userId       String
  resourceType String  // task, project, document...
  resourceId   String  // Specific resource UUID
  
  // Access Details
  accessType  String  // owner, member, viewer, editor...
  permissions Json    // Specific permissions for this resource
  
  // Inheritance
  inheritedFrom String?  // Parent resource ID
  isInherited   Boolean  @default(false)
  isActive      Boolean  @default(true)
  
  // Assignment
  grantedBy String?
  grantedAt DateTime  @default(now())
  expiresAt DateTime?
  
  // Conditions & Metadata
  conditions Json?
  metadata   Json?
  
  // Relations
  user User @relation(...)
  
  @@unique([userId, resourceType, resourceId])
}
```

**Example:**
```json
{
  "userId": "user-123",
  "resourceType": "project",
  "resourceId": "project-456",
  "accessType": "member",
  "permissions": {
    "canEdit": true,
    "canDelete": false,
    "canInvite": true
  }
}
```

---

## 🔑 Authentication & Authorization

### 1. JWT Authentication

**File:** `/backend/src/auth/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Extract JWT token from Authorization header
    const token = this.extractTokenFromHeader(request);
    
    // 2. Verify JWT token
    const payload = this.jwtService.verify(token);
    
    // 3. Load user from database
    const user = await this.userService.findById(payload.sub);
    
    // 4. Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }
    
    // 5. Attach user to request
    request.user = {
      ...user,
      sub: user.id
    };
    
    return true;
  }
}
```

**JWT Payload:**
```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "username": "username",
  "roleType": "ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Lifetimes:**
- Access Token: **24 hours**
- Refresh Token: **7 days**

### 2. Role-Based Authorization

**File:** `/backend/src/common/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. Get required roles from decorator
    const requiredRoles = this.reflector.get<UserRoleType[]>(
      ROLES_KEY, 
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredRoles) return true;  // No role required
    
    // 2. Get user from request
    const user = req.user;
    
    // 3. Check if user has required role
    const hasRole = requiredRoles.some(
      role => user.roleType === role
    );
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Required roles: ${requiredRoles.join(', ')}`
      );
    }
    
    return true;
  }
}
```

**Usage Example:**
```typescript
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserResolver {
  
  @Query()
  @Roles(UserRoleType.ADMIN, UserRoleType.GIANGVIEN)
  async getAllUsers() {
    // Only ADMIN and GIANGVIEN can access
  }
  
  @Mutation()
  @Roles(UserRoleType.ADMIN)
  async deleteUser() {
    // Only ADMIN can delete
  }
}
```

### 3. RBAC Service

**File:** `/backend/src/security/services/rbac.service.ts`

**Core Methods:**

```typescript
// Check if user has permission
async checkPermission(dto: CheckPermissionDto): Promise<boolean> {
  const { userId, resource, action, scope, resourceId } = dto;
  
  // 1. Check direct user permissions (highest priority)
  const directPerm = await this.getUserPermission(
    userId, resource, action, scope
  );
  if (directPerm?.effect === 'deny') return false;
  if (directPerm?.effect === 'allow') return true;
  
  // 2. Check role-based permissions
  const rolePerms = await this.getUserRolePermissions(userId);
  for (const perm of rolePerms) {
    if (this.matchesPermission(perm, resource, action, scope)) {
      if (perm.effect === 'deny') return false;
      if (perm.effect === 'allow') return true;
    }
  }
  
  // 3. Check resource-level access (if resourceId provided)
  if (resourceId) {
    const resourceAccess = await this.getResourceAccess(
      userId, resourceType, resourceId
    );
    if (resourceAccess) {
      return this.checkResourcePermission(resourceAccess, action);
    }
  }
  
  // 4. Default deny
  return false;
}

// Get all user permissions (merged)
async getUserPermissions(userId: string): Promise<Permission[]> {
  // Get from roles
  const rolePerms = await this.getUserRolePermissions(userId);
  
  // Get direct permissions
  const directPerms = await this.getUserDirectPermissions(userId);
  
  // Merge and deduplicate
  return this.mergePermissions(rolePerms, directPerms);
}
```

### 4. Auth Service

**File:** `/backend/src/auth/auth.service.ts`

**Key Methods:**

```typescript
// Login with email/username + password
async validateUser(emailOrUsername: string, password: string) {
  const user = await this.findByEmailOrUsername(emailOrUsername);
  
  if (!user) throw new UnauthorizedException();
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new UnauthorizedException();
  
  if (!user.isActive) {
    throw new UnauthorizedException('Account locked');
  }
  
  return user;
}

// Generate JWT tokens
async generateTokens(user: User) {
  const payload = { 
    sub: user.id, 
    email: user.email,
    username: user.username,
    roleType: user.roleType 
  };

  return {
    accessToken: this.jwtService.sign(payload, { expiresIn: '24h' }),
    refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' })
  };
}

// Google OAuth
async loginWithGoogle(input: SocialLoginInput) {
  // 1. Verify Google ID token
  const googleUser = await this.verifyGoogleToken(input.token);
  
  // 2. Find or create user
  let user = await this.findByEmail(googleUser.email);
  
  if (!user) {
    user = await this.createUserFromGoogle(googleUser);
  }
  
  // 3. Create/update auth method
  await this.createOrUpdateAuthMethod(user.id, 'GOOGLE', googleUser.id);
  
  // 4. Generate tokens
  return this.generateTokens(user);
}

// Facebook OAuth (tương tự Google)
async loginWithFacebook(input: SocialLoginInput) { ... }
```

---

## 🛡️ Frontend Protection

### 1. ProtectedRoute Component

**File:** `/frontend/src/components/auth/ProtectedRoute.tsx`

```tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER' | 'GIANGVIEN';
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // 1. Check authentication
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    // 2. Check role if required
    if (requiredRole) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.roleType !== requiredRole) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [router, requiredRole]);

  return <>{children}</>;
}
```

**Usage:**
```tsx
// Layout với role protection
export default function InstructorLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <InstructorSidebar />
      {children}
    </ProtectedRoute>
  );
}
```

### 2. Role Check trong Components

```tsx
const MyComponent = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
  }, []);
  
  return (
    <>
      {user?.roleType === 'ADMIN' && (
        <AdminPanel />
      )}
      
      {(user?.roleType === 'ADMIN' || user?.roleType === 'GIANGVIEN') && (
        <InstructorFeatures />
      )}
    </>
  );
};
```

---

## 🔄 Permission Flow

### Complete Permission Check Flow

```
┌─────────────────────────────────────────────────────┐
│  1. REQUEST với JWT Token                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  2. JwtAuthGuard: Verify token & load user         │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  3. RolesGuard: Check UserRoleType (simple)        │
│     - ADMIN ✓                                       │
│     - GIANGVIEN ✓ (if LMS)                         │
│     - USER ✗                                        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  4. RBAC Check (if needed):                        │
│     a) Direct UserPermissions (highest priority)    │
│     b) Role-based Permissions                       │
│     c) Resource-level Access                        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  5. ALLOW or DENY                                   │
└─────────────────────────────────────────────────────┘
```

### Permission Priority (Descending)

1. **Direct DENY** - UserPermission với effect="deny"
2. **Direct ALLOW** - UserPermission với effect="allow"
3. **Role DENY** - RolePermission với effect="deny"
4. **Role ALLOW** - RolePermission với effect="allow"
5. **Resource Access** - ResourceAccess permissions
6. **DEFAULT DENY** - Nếu không match gì

---

## 💼 Use Cases

### Use Case 1: Simple Role Check (Thường dùng)

**Scenario:** Chỉ ADMIN và GIANGVIEN được access instructor dashboard

**Backend:**
```typescript
@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseResolver {
  
  @Mutation()
  @Roles(UserRoleType.ADMIN, UserRoleType.GIANGVIEN)
  async createCourse(@CurrentUser() user: User, @Args() input) {
    // Only ADMIN and GIANGVIEN can create courses
    return this.courseService.create(input, user.id);
  }
}
```

**Frontend:**
```tsx
<ProtectedRoute requiredRole="ADMIN">
  <InstructorDashboard />
</ProtectedRoute>
```

### Use Case 2: RBAC với Custom Permissions

**Scenario:** User cần permission "courses:publish" để publish course

**Backend:**
```typescript
async publishCourse(courseId: string, userId: string) {
  // Check permission
  const canPublish = await this.rbacService.checkPermission({
    userId,
    resource: 'course',
    action: 'publish',
    scope: 'own'
  });
  
  if (!canPublish) {
    throw new ForbiddenException('No permission to publish');
  }
  
  return this.prisma.course.update({
    where: { id: courseId },
    data: { status: 'PUBLISHED' }
  });
}
```

### Use Case 3: Resource-Level Access

**Scenario:** User chỉ edit được project mà họ là member

**Backend:**
```typescript
async updateProject(projectId: string, userId: string, data) {
  // Check resource access
  const access = await this.prisma.resourceAccess.findUnique({
    where: {
      userId_resourceType_resourceId: {
        userId,
        resourceType: 'project',
        resourceId: projectId
      }
    }
  });
  
  if (!access || !access.permissions.canEdit) {
    throw new ForbiddenException('No edit permission');
  }
  
  return this.prisma.project.update({
    where: { id: projectId },
    data
  });
}
```

### Use Case 4: Temporary Role Assignment

**Scenario:** Grant "reviewer" role cho user trong 7 ngày

```typescript
await this.rbacService.assignRoleToUser({
  userId: 'user-123',
  roleId: 'reviewer-role-id',
  assignedBy: 'admin-id',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  scope: 'department:IT',
  metadata: {
    reason: 'Temporary reviewer for Q4 review'
  }
});
```

### Use Case 5: Hierarchical Permissions

**Scenario:** Manager inherit permissions từ Employee role

```typescript
// Create role hierarchy
const employeeRole = await rbacService.createRole({
  name: 'employee',
  displayName: 'Employee',
  priority: 500
});

const managerRole = await rbacService.createRole({
  name: 'manager',
  displayName: 'Manager',
  parentId: employeeRole.id,  // ⭐ Inherit from employee
  priority: 800
});

// Manager tự động có permissions của Employee + thêm permissions riêng
```

---

## ✅ Best Practices

### 1. Security Best Practices

**✅ DO:**
- Always use `@UseGuards(JwtAuthGuard)` cho protected routes
- Combine với `RolesGuard` khi cần check role
- Check permissions ở cả backend VÀ frontend
- Use HTTPS trong production
- Rotate JWT secrets định kỳ
- Implement rate limiting
- Log security events

**❌ DON'T:**
- Trust frontend validation alone
- Store passwords plain text
- Hardcode roles/permissions trong code
- Allow unlimited login attempts
- Expose sensitive data trong JWT
- Use weak JWT secrets

### 2. Permission Design

**Granular vs Coarse:**
```typescript
// ❌ Too coarse - không linh hoạt
'admin:full_access'

// ✅ Granular - flexible
'users:create'
'users:update:own'
'users:delete:team'
```

**Resource Naming:**
```typescript
// ✅ Consistent naming
'users', 'tasks', 'projects', 'courses'

// ❌ Inconsistent
'user', 'Task', 'project_resource'
```

### 3. Role Hierarchy

```typescript
// ✅ Clear hierarchy
super_admin (1000)
  ├─ admin (900)
  │   ├─ manager (800)
  │   └─ moderator (700)
  └─ user (500)

// ❌ Flat structure - hard to manage
admin, manager, moderator, user (all same priority)
```

### 4. Scope Usage

```typescript
// ✅ Use scope for access control
'tasks:read:own'        // Chỉ tasks của mình
'tasks:read:team'       // Tasks của team
'tasks:read:org'        // Tasks của org
'tasks:read'            // All tasks (admin)

// Implement trong service:
const scope = user.roleType === 'ADMIN' ? undefined : 'own';
const tasks = await this.taskService.findAll({ userId, scope });
```

### 5. Frontend Protection

```tsx
// ✅ Multi-layer protection
<ProtectedRoute requiredRole="ADMIN">
  <AdminLayout>
    {user?.roleType === 'ADMIN' && (
      <AdminOnlyFeature />
    )}
  </AdminLayout>
</ProtectedRoute>

// ❌ Frontend only - insecure
{isAdmin && <AdminPanel />}  // Backend không check!
```

### 6. Error Handling

```typescript
// ✅ Specific error messages
if (!hasPermission) {
  throw new ForbiddenException(
    `Missing permission: ${resource}:${action}`
  );
}

// ❌ Generic error
throw new ForbiddenException('Access denied');
```

### 7. Audit Logging

```typescript
// ✅ Log security events
await this.auditLog.create({
  userId,
  action: 'PERMISSION_CHECK',
  resource: 'course',
  resourceId: courseId,
  result: 'DENIED',
  reason: 'Missing course:publish permission'
});
```

---

## 📊 Thống Kê Hệ Thống

| Component | Số lượng | Mô tả |
|-----------|----------|-------|
| **User Roles** | 4 | ADMIN, GIANGVIEN, USER, GUEST |
| **Auth Providers** | 4 | LOCAL, GOOGLE, FACEBOOK, PHONE |
| **RBAC Roles** | 10+ | super_admin, admin, manager, editor... |
| **Permissions** | 95+ | users:*, tasks:*, projects:*, etc. |
| **Guards** | 2 | JwtAuthGuard, RolesGuard |
| **Protected Routes** | 50+ | Various modules |

---

## 🔗 Files Reference

### Backend
- `/backend/prisma/schema.prisma` - Database schema
- `/backend/src/auth/jwt-auth.guard.ts` - JWT authentication
- `/backend/src/auth/auth.service.ts` - Auth logic
- `/backend/src/common/guards/roles.guard.ts` - Role checking
- `/backend/src/common/decorators/roles.decorator.ts` - @Roles decorator
- `/backend/src/security/services/rbac.service.ts` - RBAC logic
- `/backend/src/security/services/rbac-seeder.service.ts` - Seed default roles

### Frontend
- `/frontend/src/components/auth/ProtectedRoute.tsx` - Route protection
- `/frontend/src/app/lms/instructor/layout.tsx` - LMS protection example

### Scripts
- `/backend/scripts/list-users-roles.ts` - List users by role
- `/backend/scripts/add-giangvien-role.ts` - Add GIANGVIEN role

---

## 📞 Commands

```bash
# List all users and their roles
cd backend
bun run scripts/list-users-roles.ts

# Add GIANGVIEN role to user
bun run scripts/add-giangvien-role.ts <email>

# Seed default RBAC roles and permissions
# (Uncomment onModuleInit in rbac-seeder.service.ts)
bun run start:dev
```

---

**Tạo:** 3/11/2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
