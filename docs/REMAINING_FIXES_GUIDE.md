# 🔧 Hướng Dẫn Fix Các Lỗi Còn Lại

## 📊 Tình Trạng Hiện Tại

✅ **ĐÃ HOÀN THÀNH:**
- ✅ Simplified database schema (107 → 20 core models)
- ✅ Xóa 18 backend modules đã bị cleanup
- ✅ Xóa 11 frontend features đã bị cleanup
- ✅ Update app.module.ts - chỉ import core modules
- ✅ Regenerate Prisma Client với schema mới
- ✅ Push lên GitHub thành công

⚠️ **CÒN LẠI:** ~50 compile errors cần fix

---

## 🎯 Các Lỗi Cần Fix

### 1️⃣ **auth/auth.service.ts** (Quan trọng nhất - 19 lỗi)

#### **Vấn đề:**
- Field `isVerified` không còn trong AuthMethod
- Field `resourceType` → đổi thành `resource` trong AuditLog
- `AuthProvider.PHONE` không tồn tại
- Field `isUsed` → đổi thành `usedAt` trong VerificationToken

#### **Cách fix:**

```bash
cd /chikiet/Innerbright/innerv2/backend/src/auth
```

**Fix 1: Xóa tất cả `isVerified` từ AuthMethod**

Tìm:
```typescript
isVerified: true,
```

Xóa hoàn toàn dòng đó (AuthMethod không có field này nữa).

**Fix 2: Đổi `resourceType` thành `resource`**

Tìm tất cả:
```typescript
resourceType: 'users',
resourceType: 'auth',
```

Đổi thành:
```typescript
resource: 'users',
resource: 'auth',
```

**Fix 3: Xóa `AuthProvider.PHONE`**

Tìm:
```typescript
if (provider === AuthProvider.PHONE)
AuthProvider.PHONE
```

Xóa hoặc comment out toàn bộ logic liên quan đến PHONE provider (chỉ còn LOCAL, GOOGLE, FACEBOOK).

**Fix 4: Đổi `isUsed` thành `usedAt`**

Tìm:
```typescript
where: {
  isUsed: false,
  // ...
}
```

Đổi thành:
```typescript
where: {
  usedAt: null,  // null = chưa sử dụng
  // ...
}
```

Và khi mark token là đã dùng:
```typescript
// CŨ
update: {
  isUsed: true,
}

// MỚI
update: {
  usedAt: new Date(),
}
```

---

### 2️⃣ **graphql/graphql.module.ts** (6 lỗi import)

#### **Vấn đề:**
Import các controller/module đã bị xóa

#### **Cách fix:**

```typescript
// File: backend/src/graphql/graphql.module.ts

// XÓA các dòng import này:
import { InvoiceController } from '../controllers/invoice.controller';
import { InvoiceImportController } from '../controllers/invoice-import.controller';
import { CategoryImportExportController } from '../controllers/category-import-export.controller';
import { ProductImportExportController } from '../controllers/product-import-export.controller';
import { AffiliateController } from '../controllers/affiliate.controller';
import { TrackingController } from '../controllers/tracking.controller';
import { GrokModule } from '../grok/grok.module';
import { SearchModule } from '../search/search.module';
```

Xóa các controller này khỏi `@Module({ controllers: [...] })` nếu có.

---

### 3️⃣ **common/data-loaders/data-loader.module.ts** (1 lỗi)

#### **Vấn đề:**
Import `task-data-loader.service` đã bị xóa

#### **Cách fix:**

```typescript
// File: backend/src/common/data-loaders/data-loader.module.ts

// XÓA dòng:
import { TaskDataLoaderService } from './task-data-loader.service';

// Và xóa khỏi providers array
```

---

### 4️⃣ **common/providers/health-check.provider.ts** (1 lỗi)

#### **Vấn đề:**
Sử dụng `prisma.task` (model đã bị xóa)

#### **Cách fix:**

Tìm dòng:
```typescript
const taskCount = await this.prisma.task.count();
```

Đổi thành check một model khác hoặc xóa:
```typescript
const userCount = await this.prisma.user.count();
const postCount = await this.prisma.post.count();
```

---

### 5️⃣ **graphql/inputs/affiliate.input.ts** (20+ lỗi)

#### **Vấn đề:**
Affiliate models đã bị xóa khỏi schema

#### **Cách fix (Nhanh nhất):**

```bash
# XÓA TOÀN BỘ các file liên quan đến Affiliate
cd /chikiet/Innerbright/innerv2/backend/src/graphql

rm -f inputs/affiliate.input.ts
rm -f models/affiliate.model.ts
rm -f resolvers/affiliate.resolver.ts  # nếu có
```

Nếu có module hoặc resolver import các file này, xóa imports đó.

---

### 6️⃣ **Xóa các GraphQL inputs/models khác đã bị cleanup**

```bash
cd /chikiet/Innerbright/innerv2/backend/src/graphql

# Xóa Task-related files
rm -f inputs/task.input.ts
rm -f inputs/task-comment.input.ts
rm -f inputs/task-media.input.ts
rm -f inputs/task-share.input.ts
rm -f models/task.model.ts
rm -f models/task-comment.model.ts
rm -f models/task-media.model.ts
rm -f models/task-share.model.ts

# Xóa File-related
rm -f inputs/file.input.ts
rm -f models/file.model.ts

# Xóa Product-related
rm -f inputs/product.input.ts
rm -f models/product.model.ts

# Xóa Custom Template
rm -f inputs/custom-template.input.ts
rm -f models/custom-template.model.ts

# Xóa HR
rm -rf inputs/hr/
rm -rf models/hr/
```

---

## 🔄 Quy Trình Fix Từng Bước

### **Bước 1: Fix auth.service.ts**

```bash
cd /chikiet/Innerbright/innerv2/backend/src/auth
code auth.service.ts  # Hoặc vim/nano

# Fix theo hướng dẫn section 1
```

### **Bước 2: Xóa GraphQL files không cần thiết**

```bash
cd /chikiet/Innerbright/innerv2/backend/src/graphql
# Chạy các lệnh rm ở section 5 và 6
```

### **Bước 3: Fix các module imports**

```bash
# Fix graphql.module.ts
code src/graphql/graphql.module.ts

# Fix data-loader.module.ts
code src/common/data-loaders/data-loader.module.ts

# Fix health-check.provider.ts
code src/common/providers/health-check.provider.ts
```

### **Bước 4: Test build**

```bash
cd /chikiet/Innerbright/innerv2/backend
bun run build
```

Nếu vẫn còn lỗi, đọc error message và fix theo pattern tương tự.

### **Bước 5: Commit changes**

```bash
cd /chikiet/Innerbright/innerv2
git add -A
git commit -m "fix: resolve compilation errors after schema simplification

- Fix auth.service.ts schema compatibility
- Remove deleted GraphQL inputs/models
- Update module imports
- Fix health check to use existing models"

git push origin innerv2_dev1
```

---

## 🧪 Testing

### **Test Backend Build:**

```bash
cd backend
bun run build        # Phải build thành công
bun run dev          # Test chạy development server
```

### **Test Frontend Build:**

```bash
cd frontend
bun run build        # Kiểm tra frontend có lỗi không
bun run dev          # Test UI
```

---

## 📚 Models Còn Lại (20 Core Models)

### **Authentication & User (4)**
- User
- AuthMethod
- VerificationToken
- UserSession

### **RBAC (5)**
- Role
- Permission
- UserRoleAssignment
- RolePermission
- UserPermission

### **Menu (2)**
- Menu
- MenuItem

### **Page Builder (2)**
- Page
- Block

### **Blog (5)**
- Category
- Tag
- Post
- Comment
- Like

### **System (2)**
- AuditLog
- WebsiteSetting

---

## 🆘 Nếu Gặp Khó Khăn

### **Option 1: Tạm thời comment out problematic code**

```typescript
// TEMPORARY FIX - TODO: Update to new schema
// const result = await this.prisma.task.findMany();
```

### **Option 2: Rollback về commit trước nếu cần**

```bash
git log --oneline -5
git reset --hard <commit-id>
```

### **Option 3: Chỉ deploy frontend trước**

Frontend đã clean (đã xóa unused features), có thể deploy riêng:

```bash
cd frontend
bun run build
# Deploy frontend only
```

---

## ✅ Checklist

- [ ] Fix auth.service.ts (xóa isVerified, đổi resourceType, xóa PHONE, đổi isUsed)
- [ ] Xóa affiliate GraphQL files
- [ ] Xóa task GraphQL files
- [ ] Xóa product/file/template GraphQL files
- [ ] Fix graphql.module.ts imports
- [ ] Fix data-loader.module.ts import
- [ ] Fix health-check.provider.ts
- [ ] `bun run build` thành công
- [ ] `bun run dev` chạy được
- [ ] Commit và push lên GitHub
- [ ] Test frontend build

---

## 🎯 Mục Tiêu Cuối Cùng

**Backend có 0 compile errors và chạy được với 20 core models.**

Estimated time: **30-60 phút** nếu làm theo hướng dẫn.

Good luck! 🚀
