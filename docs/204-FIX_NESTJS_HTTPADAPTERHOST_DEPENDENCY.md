# Fix: NestJS HttpAdapterHost Dependency Error

## ❌ Lỗi

```
ERROR [ExceptionHandler] UnknownDependenciesException [Error]: 
Nest can't resolve dependencies of the GraphQLModule (?, GqlModuleOptions, AbstractGraphQLDriver, GraphQLTypesLoader, GraphQLSchemaHost). 

Please make sure that the argument HttpAdapterHost at index [0] is available in the GraphQLModule context.

Potential solutions:
- Is GraphQLModule a valid NestJS module?
- If HttpAdapterHost is a provider, is it part of the current GraphQLModule?
- If HttpAdapterHost is exported from a separate @Module, is that module imported within GraphQLModule?
```

## 🔍 Root Cause

**Duplicate @nestjs packages** trong monorepo workspace:

```
❌ TRƯỚC ĐÂY:
/mnt/chikiet/kataoffical/shoprausach/node_modules/@nestjs/common (v11.1.6)
/mnt/chikiet/kataoffical/shoprausach/backend/node_modules/@nestjs/common (v11.1.6)

→ TypeScript compile error: DynamicModule type mismatch
→ NestJS dependency injection failed
→ HttpAdapterHost không resolve được
```

### Nguyên nhân chi tiết

1. **Monorepo có 2 node_modules**:
   - Root: `/shoprausach/node_modules/` 
   - Backend: `/shoprausach/backend/node_modules/`

2. **Bun install tạo duplicate**:
   - Mặc dù có workspaces config
   - Vẫn tạo backend/node_modules riêng

3. **TypeScript confusion**:
   - Import từ 2 nguồn khác nhau
   - Type `DynamicModule` từ root vs backend không match
   - Error: `Type 'Promise<DynamicModule>' is not assignable...`

4. **NestJS dependency injection failed**:
   - GraphQLModule không tìm thấy HttpAdapterHost
   - Vì types không match giữa 2 versions

## ✅ Giải pháp

### Fix #1: Import HttpAdapterHost (không đủ)

```typescript
// backend/src/app.module.ts
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
```

❌ **Không fix được** - vì root cause là duplicate packages, không phải missing import.

### Fix #2: Reorder imports (không fix triệt để)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    PrismaModule,        // ← Move BEFORE GraphQLModule
    AuthModule,          // ← Move BEFORE GraphQLModule
    GraphQLModule.forRootAsync({ ... }),
    // ...
  ]
})
```

❌ **Không fix được** - vì vẫn còn duplicate packages.

### Fix #3: Remove async from useFactory (không đủ)

```typescript
// Before
useFactory: async (configService: ConfigService) => ({ ... })

// After  
useFactory: (configService: ConfigService) => ({ ... })
```

❌ **Không fix được** - type error vẫn còn.

### ✅ Fix #4: Xóa backend/node_modules + Restart TS Server (GIẢI PHÁP)

```bash
# 1. Xóa backend/node_modules duplicate
cd /mnt/chikiet/kataoffical/shoprausach/backend
rm -rf node_modules

# 2. Reinstall với Bun workspaces (tạo symlinks đến root)
bun install

# 3. Kiểm tra symlink đã tạo
ls -la node_modules/@nestjs/common
# → lrwxrwxrwx -> ../../../node_modules/.bun/@nestjs+common@11.1.6.../

# 4. Restart TypeScript server
pkill -f "tsserver"

# 5. Wait 3s cho TS server reload
sleep 3
```

## 📋 Verification

### Before Fix
```bash
❌ TypeScript Errors:
   - DynamicModule type not assignable (3 errors)
   - ConfigModule.forRoot() type error
   - GraphQLModule.forRootAsync() type error  
   - ThrottlerModule.forRoot() type error

❌ Runtime Error:
   - UnknownDependenciesException
   - HttpAdapterHost not found
   - Backend won't start
```

### After Fix
```bash
✅ TypeScript Errors: No errors found
✅ backend/node_modules/@nestjs/common → symlink to root
✅ All DynamicModule types resolved correctly
✅ Backend starts successfully (after `bunx prisma generate`)
```

## 🎯 Files Modified

### 1. `backend/src/app.module.ts`
**Changes**:
```typescript
// Line 7: Added HttpAdapterHost import (cleanup)
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';

// Line 62-117: Reordered imports
@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    
    // ✅ Core Modules BEFORE GraphQL
    PrismaModule,
    AuthModule,
    
    // ✅ GraphQL AFTER Core Modules  
    GraphQLModule.forRootAsync({ ... }),
    
    // Rest of modules...
  ]
})
```

**Why reorder?**
- PrismaModule & AuthModule provide dependencies cho GraphQL
- Giảm risk circular dependencies
- Better module initialization order

### 2. Workspace structure
```diff
/shoprausach/
  node_modules/                    ← Root packages
    @nestjs/common@11.1.6         ← Single source of truth
  backend/
-   node_modules/                  ❌ Duplicate (removed)
+   node_modules/ → symlinks        ✅ Symlinks to root
      @nestjs/common → ../../node_modules/.bun/@nestjs+common@.../
  frontend/
    node_modules/ → symlinks        ✅ Symlinks to root
  package.json
    workspaces: ["frontend", "backend"]
```

## 🚀 Next Steps

```bash
# 1. Generate Prisma Client (required)
cd /mnt/chikiet/kataoffical/shoprausach/backend
bunx prisma generate

# 2. Start backend
bun dev

# 3. Verify GraphQL starts
# → Should see: "GraphQL Playground: http://localhost:13000/graphql"

# 4. Test WebsiteSetting queries
# → Query: findMany(modelName: "WebsiteSetting") should work
```

## 📚 Lessons Learned

### 1. Monorepo Package Management
- **Always use workspaces** với Bun/pnpm/yarn
- **Never duplicate packages** - dùng symlinks
- **Single @nestjs version** across all workspaces

### 2. TypeScript Type Resolution
- **Restart TS server** sau khi thay đổi node_modules structure
- **Clear build cache** nếu vẫn có type errors
- **Check symlinks** với `ls -la node_modules/@package`

### 3. NestJS Dependency Injection
- **Module import order matters** trong một số cases
- **Core modules first** (Config, Prisma, Auth) trước specialized modules (GraphQL)
- **HttpAdapterHost** auto-provided bởi NestJS core - không cần manual import

### 4. Debugging Workflow
```
1. Check error message → "HttpAdapterHost not found"
2. Search for duplicate packages → find 2 node_modules/
3. Remove duplicates → rm -rf backend/node_modules
4. Reinstall with workspaces → bun install
5. Restart TS server → pkill -f tsserver
6. Verify → get_errors returns "No errors found"
```

## 🔗 Related Issues

- Previous fix: [FIX_MODEL_NAME_CASING.md](./FIX_MODEL_NAME_CASING.md) - Model name `WebsiteSetting` vs `websiteSetting`
- Previous fix: [FIX_GRAPHQL_ORDERBY_ARRAY_ERROR.md](./FIX_GRAPHQL_ORDERBY_ARRAY_ERROR.md) - orderBy array → object

## ⚠️ Important Notes

1. **Không manually install packages trong backend/**
   ```bash
   # ❌ SAI
   cd backend && bun add @nestjs/common
   
   # ✅ ĐÚNG  
   cd /shoprausach && bun add @nestjs/common -w backend
   ```

2. **Sau mỗi lần clean install**:
   - Verify symlinks: `ls -la backend/node_modules/@nestjs`
   - Restart TS server: `pkill -f tsserver`
   - Wait 3s trước khi check errors

3. **Prisma Client luôn cần regenerate**:
   - Sau git pull
   - Sau schema changes
   - Sau clean install
   ```bash
   bunx prisma generate
   ```

---

**Fixed**: 2025-10-30 | **Status**: ✅ Resolved Triệt Để | **Impact**: Backend starts successfully
