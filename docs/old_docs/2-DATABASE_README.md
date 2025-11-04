# Database Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Core Entities](#core-entities)
4. [Schema & Migrations](#schema--migrations)
5. [RBAC Schema](#rbac-schema)
6. [Page Builder Schema](#page-builder-schema)
7. [E-Commerce Schema](#e-commerce-schema)
8. [LMS Schema](#lms-schema)
9. [Affiliate Schema](#affiliate-schema)
10. [Backup & Recovery](#backup--recovery)
11. [Performance Tuning](#performance-tuning)
12. [Troubleshooting](#troubleshooting)

## Overview

The database uses PostgreSQL with Prisma ORM. The schema is organized around key domains: authentication, RBAC, content management, e-commerce, LMS, and affiliate tracking.

### Key Characteristics
- ✅ PostgreSQL database
- ✅ Prisma ORM for migrations and queries
- ✅ Full relationship support
- ✅ Audit logging on key tables
- ✅ UUID primary keys
- ✅ Timestamp tracking (createdAt, updatedAt)
- ✅ Soft deletes where appropriate
- ✅ Indexed for performance

## Database Architecture

### Connection Details
```
Host: localhost (or Docker service name 'postgres')
Port: 5432
Database: shoprausach
Username: postgres
Password: Check .env or docker-compose.yml
```

### Docker Setup
```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: shoprausach
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Prisma Configuration
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## Core Entities

### User Entity
```prisma
model User {
  id                    String      @id @default(uuid())
  email                 String      @unique
  username              String      @unique
  password              String      // Bcrypt hashed
  firstName             String?
  lastName              String?
  avatar                String?     // URL or path
  phone                 String?
  
  roleType              String?     // Legacy: ADMIN, USER, GUEST
  isActive              Boolean     @default(true)
  isVerified            Boolean     @default(false)
  isTwoFactorEnabled    Boolean     @default(false)
  
  failedLoginAttempts   Int         @default(0)
  lockedUntil           DateTime?
  lastLoginAt           DateTime?
  
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relations
  posts                 Post[]
  comments              Comment[]
  tasks                 Task[]
  userRoles             UserRoleAssignment[]
  userPermissions       UserPermission[]
  affiliateProfile      AffiliateProfile?
  enrollments           Enrollment[]
  auditLogs             AuditLog[]
  
  @@index([email])
  @@index([username])
}
```

### Authentication Flow
1. User registration: Email + password → Stored hashed
2. Login: Email + password → Compare with stored hash → Generate JWT
3. Token validation: JWT verified on each request
4. Token refresh: Old token can be refreshed for new token

## RBAC Schema

### Role Model
```prisma
model Role {
  id                  String      @id @default(uuid())
  name                String      @unique  // super_admin, admin, editor, viewer
  displayName         String      // "Super Administrator"
  description         String?
  
  isActive            Boolean     @default(true)
  isSystemRole        Boolean     @default(false)  // Cannot be deleted
  priority            Int?        // For hierarchies
  metadata            Json?
  
  parentId            String?     // Parent role
  parent              Role?       @relation("RoleHierarchy", fields: [parentId], references: [id])
  children            Role[]      @relation("RoleHierarchy")
  
  permissions         RolePermission[]
  userAssignments     UserRoleAssignment[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  @@index([name])
  @@index([isSystemRole])
}
```

### Permission Model
```prisma
model Permission {
  id                  String      @id @default(uuid())
  name                String      @unique  // Format: resource:action
  displayName         String
  description         String?
  resource            String?     // e.g., "users", "pages", "products"
  action              String?     // e.g., "create", "read", "update", "delete"
  scope               String?     // e.g., "global", "user", "organization"
  
  isActive            Boolean     @default(true)
  
  roles               RolePermission[]
  users               UserPermission[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  @@unique([resource, action])
  @@index([resource])
  @@index([action])
}
```

### Role-Permission Assignment
```prisma
model RolePermission {
  id                  String      @id @default(uuid())
  roleId              String
  permissionId        String
  effect              RoleEffect  @default(ALLOW)  // ALLOW, DENY
  
  role                Role        @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission          Permission  @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  createdAt           DateTime    @default(now())
  
  @@unique([roleId, permissionId])
  @@index([roleId])
}

enum RoleEffect {
  ALLOW
  DENY
}
```

### User-Role Assignment
```prisma
model UserRoleAssignment {
  id                  String      @id @default(uuid())
  userId              String
  roleId              String
  effect              RoleEffect  @default(ALLOW)
  scope               String?     // Optional: scope of role (global, organizational, etc.)
  
  expiresAt           DateTime?   // Optional: role expiration
  conditions          Json?       // Optional: additional conditions
  metadata            Json?       // Optional: additional metadata
  
  assignedBy          String      // User ID who assigned this role
  
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  role                Role        @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
}
```

### User-Permission Assignment
```prisma
model UserPermission {
  id                  String      @id @default(uuid())
  userId              String
  permissionId        String
  effect              RoleEffect  @default(ALLOW)
  
  conditions          Json?
  metadata            Json?
  expiresAt           DateTime?
  
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission          Permission  @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  createdAt           DateTime    @default(now())
  
  @@unique([userId, permissionId])
  @@index([userId])
}
```

### Default Roles
```
System Roles:
1. super_admin    - All permissions (system role)
2. admin          - Administrative permissions
3. editor         - Content editing permissions
4. viewer         - Read-only permissions
5. user           - Standard user permissions
6. guest          - Limited guest permissions
7. affiliate      - Affiliate system permissions
```

### Default Permissions (50+ total)
```
User Management:
- users:create, users:read, users:update, users:delete
- users:list, users:export

Page Management:
- pages:create, pages:read, pages:update, pages:delete
- pages:publish, pages:unpublish

Product Management:
- products:create, products:read, products:update, products:delete
- products:bulk_import

Invoice Management:
- invoices:create, invoices:read, invoices:sync
- invoices:import

Role & Permission Management:
- roles:create, roles:read, roles:update, roles:delete
- permissions:assign

Admin Functions:
- admin:access, admin:audit_log, admin:settings
```

## Page Builder Schema

### Page Model
```prisma
model Page {
  id                  String      @id @default(uuid())
  title               String
  slug                String      @unique
  description         String?
  content             String?     // JSON serialized
  
  isPublished         Boolean     @default(false)
  isFeatured          Boolean     @default(false)
  
  authorId            String
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  publishedAt         DateTime?
  
  blocks              Block[]
  templateId          String?     // If created from template
  template            CustomTemplate?  @relation(fields: [templateId], references: [id])
  
  @@index([slug])
  @@index([isPublished])
}
```

### Block Model (Nested Structure)
```prisma
model Block {
  id                  String      @id @default(uuid())
  pageId              String
  page                Page        @relation(fields: [pageId], references: [id], onDelete: Cascade)
  
  type                String      // text, button, image, grid, etc.
  order               Int         // Order in page
  
  properties          Json        // Block-specific properties
  styles              Json?       // CSS styles
  
  // Nesting support
  parentId            String?     // Parent block (for nested blocks)
  parent              Block?      @relation("BlockHierarchy", fields: [parentId], references: [id])
  children            Block[]     @relation("BlockHierarchy")
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  @@index([pageId])
  @@index([parentId])
  @@index([type])
}
```

### Template Model
```prisma
model CustomTemplate {
  id                  String      @id @default(uuid())
  name                String
  description         String?
  category            String?     // hero, product, contact, etc.
  
  content             Json        // Serialized block structure
  thumbnail           String?     // Template preview image
  
  isPublic            Boolean     @default(false)
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  pages               Page[]
}
```

## E-Commerce Schema

### Product Model
```prisma
model Product {
  id                  String      @id @default(uuid())
  sku                 String      @unique
  name                String
  ten2                String?     // Secondary name
  slug                String      @unique
  description         String?
  
  price               Decimal     @db.Decimal(12, 2)
  cost                Decimal?    @db.Decimal(12, 2)
  stock               Int         @default(0)
  
  categoryId          String?
  category            Category?   @relation(fields: [categoryId], references: [id])
  
  image               String?
  isActive            Boolean     @default(true)
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  invoiceItems        InvoiceItem[]
  
  @@index([sku])
  @@index([slug])
  @@index([categoryId])
}
```

### Invoice Model
```prisma
model Invoice {
  id                  String      @id @default(uuid())
  invoiceNo           String      @unique
  
  supplierId          String?
  totalAmount         Decimal     @db.Decimal(12, 2)
  taxAmount           Decimal     @db.Decimal(12, 2)
  
  status              InvoiceStatus  @default(PENDING)
  issueDate           DateTime?
  dueDate             DateTime?
  paidDate            DateTime?
  
  items               InvoiceItem[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  @@index([invoiceNo])
  @@index([status])
}

model InvoiceItem {
  id                  String      @id @default(uuid())
  invoiceId           String
  invoice             Invoice     @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  productId           String?
  product             Product?    @relation(fields: [productId], references: [id])
  
  quantity            Int
  unitPrice           Decimal     @db.Decimal(12, 2)
  totalPrice          Decimal     @db.Decimal(12, 2)
}

enum InvoiceStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## LMS Schema

### Course Model
```prisma
model Course {
  id                  String      @id @default(uuid())
  title               String
  description         String?
  
  instructor          String?     // Instructor name or ID
  
  modules             CourseModule[]
  enrollments         Enrollment[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}

model CourseModule {
  id                  String      @id @default(uuid())
  courseId            String
  course              Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  title               String
  order               Int
  
  lessons             Lesson[]
  
  @@index([courseId])
}

model Lesson {
  id                  String      @id @default(uuid())
  moduleId            String
  module              CourseModule  @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  title               String
  content             String      // Lesson content (HTML)
  order               Int
  
  progress            LessonProgress[]
  quizzes             Quiz[]
  
  @@index([moduleId])
}

model Enrollment {
  id                  String      @id @default(uuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  courseId            String
  course              Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  enrolledAt          DateTime    @default(now())
  completedAt         DateTime?
  progress            LessonProgress[]
}

model LessonProgress {
  id                  String      @id @default(uuid())
  enrollmentId        String
  lessonId            String
  
  status              ProgressStatus  @default(NOT_STARTED)
  completedAt         DateTime?
  
  @@unique([enrollmentId, lessonId])
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}
```

## Affiliate Schema

### Affiliate Model
```prisma
model AffiliateProfile {
  id                  String      @id @default(uuid())
  userId              String      @unique
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  affiliateCode       String      @unique
  commission          Decimal     @db.Decimal(5, 2)  // Percentage
  
  totalEarnings       Decimal     @default(0)  @db.Decimal(12, 2)
  totalClicks         Int         @default(0)
  totalConversions    Int         @default(0)
  
  isActive            Boolean     @default(true)
  
  links               AffiliateLink[]
  earnings            AffiliateEarning[]
  
  createdAt           DateTime    @default(now())
}

model AffiliateLink {
  id                  String      @id @default(uuid())
  affiliateId         String
  affiliate           AffiliateProfile  @relation(fields: [affiliateId], references: [id], onDelete: Cascade)
  
  code                String      @unique
  productId           String?
  campaignId          String?
  
  clickCount          Int         @default(0)
  conversionCount     Int         @default(0)
  earnings            Decimal     @db.Decimal(12, 2)
  
  isActive            Boolean     @default(true)
  
  createdAt           DateTime    @default(now())
  clicks              AffiliateClick[]
}

model AffiliateClick {
  id                  String      @id @default(uuid())
  linkId              String
  link                AffiliateLink  @relation(fields: [linkId], references: [id], onDelete: Cascade)
  
  ipAddress           String?
  userAgent           String?
  referrer            String?
  
  convertedAt         DateTime?
  
  createdAt           DateTime    @default(now())
}

model AffiliateEarning {
  id                  String      @id @default(uuid())
  affiliateId         String
  affiliate           AffiliateProfile  @relation(fields: [affiliateId], references: [id], onDelete: Cascade)
  
  amount              Decimal     @db.Decimal(12, 2)
  status              EarningStatus  @default(PENDING)
  
  createdAt           DateTime    @default(now())
}

enum EarningStatus {
  PENDING
  APPROVED
  PAID
  FAILED
}
```

## Backup & Recovery

### Backup Strategy
```bash
# Manual backup
docker exec postgres pg_dump -U postgres shoprausach > backup.sql

# Restore from backup
docker exec -i postgres psql -U postgres shoprausach < backup.sql

# Backup schedule (recommended)
# - Daily at 2 AM UTC
# - Weekly full backup
# - Monthly archival backup
```

### Automated Backup
```bash
#!/bin/bash
BACKUP_DIR="/backups/database"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

docker exec postgres pg_dump -U postgres shoprausach > \
  "${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# Keep only last 30 days
find "${BACKUP_DIR}" -type f -mtime +30 -delete
```

## Performance Tuning

### Indexes
```sql
-- Frequently queried fields
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_username ON "User"(username);
CREATE INDEX idx_page_slug ON "Page"(slug);
CREATE INDEX idx_page_ispublished ON "Page"("isPublished");
CREATE INDEX idx_product_sku ON "Product"(sku);
CREATE INDEX idx_invoice_status ON "Invoice"(status);

-- Foreign keys
CREATE INDEX idx_block_pageid ON "Block"("pageId");
CREATE INDEX idx_userrole_userid ON "UserRoleAssignment"("userId");
CREATE INDEX idx_affiliate_userid ON "AffiliateProfile"("userId");
```

### Query Optimization
```typescript
// ❌ Bad: N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const roles = await prisma.userRoleAssignment.findMany({
    where: { userId: user.id }
  });
}

// ✅ Good: Use include/select to load relations
const users = await prisma.user.findMany({
  include: {
    userRoles: true,
    userPermissions: true
  }
});
```

### Connection Pooling
```env
# Database URL with connection pool
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=20"
```

## Troubleshooting

### Common Issues

**1. Migration Conflicts**
```bash
# Reset migrations (dev only!)
bun run prisma:migrate reset --force

# Create new migration after schema change
bun run prisma:migrate dev --name describe_change
```

**2. UUID Mismatch Errors**
```
Error: "invalid input syntax for type uuid"
Solution:
- Ensure UUID format is correct: 8-4-4-4-12 hex format
- Use CAST in SQL: CAST(id AS UUID)
- Use Prisma UUID validation
```

**3. Deadlock Errors**
```
Error: "40P01: deadlock detected"
Solution:
- Review transaction isolation levels
- Optimize query ordering
- Increase statement timeouts
```

**4. Disk Space Issues**
```bash
# Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables WHERE schemaname != 'pg_catalog'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Vacuum and analyze
VACUUM ANALYZE;
```

## Database Maintenance

### Regular Tasks
```bash
# Weekly: Analyze query plans
ANALYZE;

# Monthly: Vacuum
VACUUM FULL ANALYZE;

# Quarterly: Reindex
REINDEX DATABASE shoprausach;

# As needed: Update statistics
ANALYZE;
```

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Database Design Patterns](https://www.postgresql.org/docs/current/ddl.html)

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainers**: Development Team
