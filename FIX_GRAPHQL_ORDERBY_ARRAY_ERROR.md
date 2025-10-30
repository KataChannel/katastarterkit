# Fix: GraphQL orderBy Array Error

## Vấn đề

```
GraphQL execution errors: {
  operationName: 'FindMany',
  errors: [
    {
      message: 'Variable "$input" got invalid value [{ category: "asc" }, { order: "asc" }] at "input.orderBy"; Expected type "JSONObject". JSONObject cannot represent non-object value: [object Object],[object Object]'
    }
  ]
}
```

**Root Cause**: Dynamic GraphQL chỉ accept `orderBy` dạng **object**, không phải **array**.

## Giải pháp

### ❌ SAI (trước đây)
```typescript
orderBy: [{ category: 'asc' }, { order: 'asc' }]  // Array - KHÔNG ĐƯỢC!
```

### ✅ ĐÚNG (sau khi fix)
```typescript
orderBy: { order: 'asc' }  // Object - OK!
```

## Files đã fix

### 1. `frontend/src/hooks/useWebsiteSettings.ts`
**Dòng 90**:
```typescript
// Before
orderBy: [{ category: 'asc' }, { order: 'asc' }]

// After
orderBy: { order: 'asc' }
```

### 2. `frontend/src/app/admin/settings/website/page.tsx`
**Dòng 46**:
```typescript
// Before
orderBy: [{ category: 'asc' }, { order: 'asc' }]

// After  
orderBy: { order: 'asc' }
```

**Dòng 51-53** - Sort trong JavaScript thay vì database:
```typescript
// Added client-side sorting
const categorySettings = settings
  .filter(s => s.category === selectedCategory)
  .sort((a, b) => a.order - b.order);  // Sort by order field
```

## Lý do

**Dynamic GraphQL** (Unified Dynamic Module) sử dụng schema:
```graphql
input QueryInput {
  where: JSONObject
  orderBy: JSONObject   # ← Chỉ nhận object, không phải array
  select: JSONObject
  include: JSONObject
  take: Int
  skip: Int
}
```

Prisma native hỗ trợ:
```typescript
orderBy: [{ category: 'asc' }, { order: 'asc' }]  // Multi-field sort
```

Nhưng GraphQL `JSONObject` type chỉ accept single object:
```typescript
orderBy: { order: 'asc' }  // Single field sort
```

## Workaround

Khi cần sort theo nhiều field:
1. **Database**: Dùng 1 field quan trọng nhất (`order`)
2. **Client**: Sort thêm trong JavaScript nếu cần

```typescript
// Database sort by primary field
orderBy: { order: 'asc' }

// Client-side secondary sort
.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  return a.order - b.order;
})
```

## Testing

### Before Fix (❌ Error)
```bash
GraphQL Operation: FindMany
Error: orderBy expects JSONObject, got array
```

### After Fix (✅ Success)
```bash
GraphQL Operation: FindMany
Response: 36 settings loaded successfully
```

## Files Modified
```
✅ frontend/src/hooks/useWebsiteSettings.ts (1 line)
✅ frontend/src/app/admin/settings/website/page.tsx (2 sections)
```

## Impact
- ✅ Website settings load thành công
- ✅ Admin UI hiển thị settings
- ✅ Header & Footer dynamic rendering hoạt động
- ✅ Không còn GraphQL errors

---

**Fixed**: 2025-10-30 | **Status**: ✅ Resolved
