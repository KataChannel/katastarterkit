# Fix: Model Name Casing Error - websiteSetting vs WebsiteSetting

## ❌ Lỗi

```
GraphQL Error in QUERY FindMany.findMany
{
  "errorMessage": "Failed to find websiteSetting records: Model websiteSetting not found",
  "modelName": "websiteSetting"
}
```

**Root Cause**: Model name sai case - dùng `websiteSetting` (camelCase) thay vì `WebsiteSetting` (PascalCase).

## 🔍 Nguyên nhân

### Prisma Schema
```prisma
// backend/prisma/schema.prisma
model WebsiteSetting {  // ← PascalCase (ĐÚNG)
  id          String   @id @default(uuid())
  key         String   @unique
  value       String?
  // ...
  @@map("website_settings")  // ← Table name in DB (snake_case)
}
```

### Frontend Code (SAI)
```typescript
// ❌ TRƯỚC ĐÂY - dùng camelCase
useFindMany<WebsiteSetting>('websiteSetting', { ... })
useUpdateOne('websiteSetting')
```

**Vấn đề**:
- Prisma model name: `WebsiteSetting` (PascalCase)
- Database table name: `website_settings` (snake_case) - từ `@@map()`
- Frontend code dùng: `websiteSetting` (camelCase) ← **SAI!**

Dynamic GraphQL tìm Prisma model theo **model name**, không phải table name.

## ✅ Giải pháp

Đổi tất cả `'websiteSetting'` → `'WebsiteSetting'` (PascalCase)

### Files Fixed

#### 1. `frontend/src/hooks/useWebsiteSettings.ts`
**5 hooks đã fix**:

```typescript
// ✅ AFTER - PascalCase
export function useWebsiteSettings(category?: string) {
  return useFindMany<WebsiteSetting>('WebsiteSetting', { ... })
}

export function useHeaderSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', { ... })
}

export function useFooterSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', { ... })
}

export function useContactSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', { ... })
}

export function useSocialSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', { ... })
}
```

**Changed lines**: 88, 98, 112, 126, 140

#### 2. `frontend/src/app/admin/settings/website/page.tsx`
**2 chỗ đã fix**:

```typescript
// ✅ AFTER
const { data: settings = [], loading, error, refetch } = 
  useFindMany<WebsiteSetting>('WebsiteSetting', {
    orderBy: { order: 'asc' },
  });

const [updateOne, { loading: updating }] = useUpdateOne('WebsiteSetting');
```

**Changed lines**: 45, 49

## 📊 Summary

| Aspect | Before | After |
|--------|--------|-------|
| Model Name in Schema | `WebsiteSetting` | `WebsiteSetting` ✅ |
| Table Name in DB | `website_settings` | `website_settings` ✅ |
| Frontend Hook Calls | `'websiteSetting'` ❌ | `'WebsiteSetting'` ✅ |
| GraphQL Query Variable | `websiteSetting` ❌ | `WebsiteSetting` ✅ |

## 🎯 Convention

**Prisma Naming Convention**:
```prisma
model WebsiteSetting {      // PascalCase (model name)
  @@map("website_settings") // snake_case (table name)
}
```

**Frontend Usage**:
```typescript
// Model name phải match CHÍNH XÁC với Prisma schema
useFindMany<WebsiteSetting>('WebsiteSetting', { ... })
//                           ^^^^^^^^^^^^^^
//                           PascalCase - match model name
```

**Quy tắc**:
- ✅ Prisma model name: **PascalCase** (`WebsiteSetting`)
- ✅ Database table: **snake_case** (`website_settings`)
- ✅ GraphQL type: **PascalCase** (`WebsiteSetting`)
- ✅ Frontend model param: **PascalCase** (`'WebsiteSetting'`)
- ❌ KHÔNG dùng camelCase cho model name (`websiteSetting`)

## 🧪 Testing

### Before Fix
```bash
❌ GraphQL Error: Model websiteSetting not found
❌ UnifiedDynamicResolver.findMany throws error
❌ Frontend shows empty settings
```

### After Fix
```bash
✅ GraphQL Query: FindMany WebsiteSetting
✅ Returns 36 settings successfully
✅ Admin UI loads settings
✅ Header/Footer render dynamic content
```

## 🔗 Related

- Previous fix: [FIX_GRAPHQL_ORDERBY_ARRAY_ERROR.md](./FIX_GRAPHQL_ORDERBY_ARRAY_ERROR.md)
- Model definition: `backend/prisma/schema.prisma:4042`
- Dynamic resolver: `backend/src/graphql/resolvers/unified-dynamic.resolver.ts`

## 📝 Lesson Learned

**Critical**: Khi dùng Dynamic GraphQL với Prisma:
1. Model name parameter phải **CHÍNH XÁC** match với Prisma schema
2. PascalCase for model names (Prisma convention)
3. Không nhầm lẫn với database table name (snake_case từ `@@map()`)
4. TypeScript generic `<WebsiteSetting>` không đủ - string param mới quan trọng!

---

**Fixed**: 2025-10-30 | **Files**: 2 | **Lines**: 7 | **Status**: ✅ Resolved
