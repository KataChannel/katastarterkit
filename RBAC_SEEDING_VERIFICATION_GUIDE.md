# RBAC Seeding Verification & Testing Guide

## 🧪 Pre-Deployment Testing

### 1. Compilation Check
```bash
# In backend directory
cd backend

# Check for TypeScript errors
npm run build
# Expected: ✅ Compilation successful (0 errors)

# Or specific file check
npx tsc --noEmit src/security/services/rbac-seeder.service.ts
# Expected: No errors
```

### 2. Database Preparation
```bash
# Apply all migrations
npx prisma migrate deploy

# (Optional) Reset database for clean test
npx prisma migrate reset --force
```

### 3. Application Startup Test
```bash
# Start in development mode
npm run start:dev

# Watch for these log messages:
# ✓ "Seeding default roles and permissions..."
# ✓ "Created role: super_admin with 37 permissions"
# ✓ "✅ Default admin user created successfully:"
# ✓ "Permissions: All (37 permissions assigned via role)"
```

---

## 📊 Database Verification Queries

### Query 1: Verify Admin User Exists
```sql
SELECT 
  id, 
  email, 
  phone, 
  firstName, 
  lastName, 
  roleType, 
  isVerified, 
  isActive 
FROM "User" 
WHERE email = 'katachanneloffical@gmail.com';

-- Expected Result:
-- ┌─────┬──────────────────────────┬──────────────┬──────────┬────────┬──────────┬────────────┬──────────┐
-- │ id  │ email                    │ phone        │ firstName│ lastName│ roleType │ isVerified │ isActive │
-- ├─────┼──────────────────────────┼──────────────┼──────────┼────────┼──────────┼────────────┼──────────┤
-- │ ... │ katachanneloffical@...   │ 0977272967   │ Phạm Chí │ Kiệt   │ ADMIN    │ true       │ true     │
-- └─────┴──────────────────────────┴──────────────┴──────────┴────────┴──────────┴────────────┴──────────┘
```

### Query 2: Count Admin's Permissions
```sql
SELECT 
  COUNT(rp.id) as permission_count,
  r.name,
  r.displayName
FROM "Role" r
LEFT JOIN "RolePermission" rp ON r.id = rp."roleId"
WHERE r.name = 'super_admin'
GROUP BY r.id, r.name, r.displayName;

-- Expected Result:
-- ┌──────────────────┬──────────────┬──────────────────────────┐
-- │ permission_count │ name         │ displayName              │
-- ├──────────────────┼──────────────┼──────────────────────────┤
-- │ 37               │ super_admin  │ Super Administrator      │
-- └──────────────────┴──────────────┴──────────────────────────┘
```

### Query 3: List All Admin Permissions
```sql
SELECT 
  p.id,
  p.name,
  p.displayName,
  p.resource,
  p.action,
  p.category
FROM "Permission" p
INNER JOIN "RolePermission" rp ON p.id = rp."permissionId"
WHERE rp."roleId" = (SELECT id FROM "Role" WHERE name = 'super_admin')
ORDER BY p.category, p.name;

-- Expected Result: 37 rows with all categories:
-- ┌──────┬────────────────┬──────────────────────┬──────────┬────────┬─────────────────────┐
-- │ id   │ name           │ displayName          │ resource │ action │ category            │
-- ├──────┼────────────────┼──────────────────────┼──────────┼────────┼─────────────────────┤
-- │ ...  │ system:admin   │ System Admin...      │ system   │ admin  │ system_admin        │
-- │ ...  │ users:create   │ Create Users         │ user     │ create │ user_management     │
-- │ ...  │ roles:create   │ Create Roles         │ role     │ create │ role_management     │
-- │ ... (37 total rows) ...                                                                    │
-- └──────┴────────────────┴──────────────────────┴──────────┴────────┴─────────────────────┘
```

### Query 4: Verify Admin Role Assignment
```sql
SELECT 
  u.email,
  r.name as role_name,
  r.displayName as role_display,
  ura."createdAt" as assigned_at
FROM "UserRoleAssignment" ura
INNER JOIN "User" u ON ura."userId" = u.id
INNER JOIN "Role" r ON ura."roleId" = r.id
WHERE u.email = 'katachanneloffical@gmail.com';

-- Expected Result: 1 row
-- ┌──────────────────────────┬──────────────┬──────────────────────┬──────────────┐
-- │ email                    │ role_name    │ role_display         │ assigned_at  │
-- ├──────────────────────────┼──────────────┼──────────────────────┼──────────────┤
-- │ katachanneloffical@...   │ super_admin  │ Super Administrator  │ (timestamp)  │
-- └──────────────────────────┴──────────────┴──────────────────────┴──────────────┘
```

### Query 5: Permission Coverage by Category
```sql
SELECT 
  p.category,
  COUNT(p.id) as permission_count,
  STRING_AGG(p.name, ', ' ORDER BY p.name) as permission_names
FROM "Permission" p
INNER JOIN "RolePermission" rp ON p.id = rp."permissionId"
WHERE rp."roleId" = (SELECT id FROM "Role" WHERE name = 'super_admin')
GROUP BY p.category
ORDER BY p.category;

-- Expected Result: 9 categories
-- ┌────────────────────┬──────────────────┬───────────────────────────────┐
-- │ category           │ permission_count │ permission_names              │
-- ├────────────────────┼──────────────────┼───────────────────────────────┤
-- │ analytics          │ 2                │ analytics:export, analytics:re│
-- │ content_management │ 5                │ content:create, content:delete│
-- │ permission_mgmt    │ 4                │ permissions:create, ...       │
-- │ project_management │ 5                │ projects:create, ...          │
-- │ role_management    │ 4                │ roles:create, ...             │
-- │ security_management│ 3                │ security:audit, ...           │
-- │ system_admin       │ 3                │ system:admin, system:backup...│
-- │ task_management    │ 5                │ tasks:assign, tasks:create... │
-- │ user_management    │ 4                │ users:create, users:delete... │
-- └────────────────────┴──────────────────┴───────────────────────────────┘
```

---

## 🧑‍💻 Frontend Testing

### Test 1: Admin Login
```
1. Navigate to login page: http://localhost:3000/login
2. Enter credentials:
   - Email: katachanneloffical@gmail.com
   - Password: Admin@123456
3. Expected: Successfully logged in
4. Verify: Redirect to admin panel
```

### Test 2: Admin Access
```
1. After login, navigate to: http://localhost:3000/admin
2. Expected: Full admin panel displays
3. Verify: No redirect to request-access page
4. Verify: All sidebar menu items visible (if public or has permissions)
```

### Test 3: Menu Visibility
```
1. In admin panel, check sidebar
2. Expected menu items (based on permissions):
   - Dashboard (public)
   - Users Management (has users:read permission)
   - Roles Management (has roles:read permission)
   - Permission Management (has permissions:read permission)
   - Security Audit (has security:audit permission)
   - Tasks (has tasks:read permission)
   - Projects (has projects:read permission)
   - Content (has content:read permission)
   - Analytics (has analytics:read permission)
```

### Test 4: Feature Access
```
1. Try each admin feature:
   - Create new user ✓ (users:create)
   - Edit user ✓ (users:update)
   - Delete user ✓ (users:delete)
   - Create role ✓ (roles:create)
   - Manage permissions ✓ (permissions:*)
   - View audit logs ✓ (security:audit)
   - Create task ✓ (tasks:create)
   - Create project ✓ (projects:create)
   - Create content ✓ (content:create)
   - View analytics ✓ (analytics:read)

2. Expected: All features accessible
```

---

## 🔒 Security Verification

### Test 1: USER Role Cannot Access Admin
```
1. Create test user with roleType: 'USER'
2. Login as test user
3. Try accessing: http://localhost:3000/admin
4. Expected: Redirected to /admin/request-access
5. Verify: User sees request form with contact info
```

### Test 2: Password Hashing
```sql
-- Verify password is hashed, not stored plaintext
SELECT 
  email, 
  password,
  CASE 
    WHEN password LIKE 'Admin@123456' THEN 'UNHASHED ❌'
    ELSE 'HASHED ✓'
  END as password_status
FROM "User" 
WHERE email = 'katachanneloffical@gmail.com';

-- Expected: Password should start with $2b$ (bcrypt hash)
-- ✓ HASHED (looks like: $2b$12$......)
```

### Test 3: Role-Based Access
```
1. Create user with 'viewer' role
2. Login and verify:
   - Can view content (content:read) ✓
   - Cannot create content ❌
   - Cannot edit users ❌
3. Behavior correct ✓
```

---

## 📝 Checklist for Deployment

### Pre-Deployment
- [ ] All code compiles: `npm run build` passes
- [ ] No TypeScript errors
- [ ] Database migrations applied: `npx prisma migrate deploy`
- [ ] Environment variables set

### Testing
- [ ] Admin user created in database
- [ ] Super_admin role has 37 permissions
- [ ] Admin login works
- [ ] Admin panel accessible
- [ ] All menu items visible
- [ ] USER role redirected to request-access
- [ ] Password properly hashed

### Deployment
- [ ] Code pushed to repository
- [ ] CI/CD pipeline passes
- [ ] Application started successfully
- [ ] Logs show seeding success
- [ ] Database verified with queries above

### Post-Deployment
- [ ] Admin can login with credentials
- [ ] Change default password immediately
- [ ] Test all admin features work
- [ ] Monitor logs for errors
- [ ] Verify user role redirects work

---

## 🐛 Troubleshooting

### Issue: Admin user not created
**Solution:**
```bash
# Check logs for error
npm run start:dev 2>&1 | grep -i "admin\|error"

# Verify database exists
npx prisma db push

# Check User table exists
npm run prisma:studio
```

### Issue: Permissions not assigned
**Solution:**
```sql
-- Verify super_admin role exists
SELECT * FROM "Role" WHERE name = 'super_admin';

-- Verify RolePermission entries
SELECT COUNT(*) FROM "RolePermission" 
WHERE "roleId" = (SELECT id FROM "Role" WHERE name = 'super_admin');
-- Should be 37
```

### Issue: Admin cannot access certain features
**Solution:**
```sql
-- Check user's role
SELECT ur."roleId" FROM "UserRoleAssignment" ur
INNER JOIN "User" u ON ur."userId" = u.id
WHERE u.email = 'katachanneloffical@gmail.com';

-- Check role's permissions
SELECT rp."permissionId" FROM "RolePermission" rp
WHERE rp."roleId" = (SELECT id FROM "Role" WHERE name = 'super_admin')
LIMIT 5;
```

### Issue: Password not hashing correctly
**Solution:**
```bash
# Verify bcryptjs is installed
npm list bcryptjs

# Check bcrypt rounds
grep -n "bcrypt.hash" backend/src/security/services/rbac-seeder.service.ts
# Should see: bcrypt.hash(defaultPassword, 12)
```

---

## 📊 Expected Output in Logs

```
[Nest] 2024-01-15 10:30:45   [NestFactory] Starting Nest application...

[RbacSeederService] Seeding default roles and permissions...
[RbacSeederService] Created permission: system:admin
[RbacSeederService] Created permission: system:config
...
[RbacSeederService] Created role: super_admin with 37 permissions
[RbacSeederService] Created role: admin with 20 permissions
...
[RbacSeederService] Created admin user: katachanneloffical@gmail.com
[RbacSeederService] Assigned super_admin role to user: katachanneloffical@gmail.com
[RbacSeederService] ✅ Default admin user created successfully:
   Email: katachanneloffical@gmail.com
   Phone: 0977272967
   Name: Phạm Chí Kiệt
   Default Password: Admin@123456
   Role: super_admin
   Permissions: All (37 permissions assigned via role)
   🔒 Please change the default password after first login!
[RbacSeederService] RBAC seeding completed successfully
```

---

## ✅ Sign-Off Checklist

After all testing passes:

```
- [ ] Compilation: 0 errors ✓
- [ ] Database queries: All return expected results ✓
- [ ] Frontend: All features accessible ✓
- [ ] Security: Roles enforced correctly ✓
- [ ] Logs: Seeding shows success messages ✓
- [ ] Password: Properly hashed ✓
- [ ] Ready for production deployment ✓
```

---

**Test Guide Version:** 1.0  
**Status:** Complete  
**Last Updated:** Current Session
