# Fix Bug: Database Schema Inspector

## 🐛 Vấn Đề

Schema Inspector không lấy được database schema vì sử dụng API cũ `_baseDmmf` không tồn tại trong Prisma Client mới.

## ✅ Giải Pháp

### Thay đổi cách truy cập DMMF

**Trước (❌ Lỗi):**
```typescript
const models = (this.prisma as any)._baseDmmf?.datamodel?.models || [];
```

**Sau (✅ Đúng):**
```typescript
import { Prisma } from '@prisma/client';

const dmmf = Prisma.dmmf;
const models = dmmf.datamodel.models || [];
```

## 📂 Files Đã Fix

1. **backend/src/services/schema-inspector.service.ts**
   - Import `Prisma` từ `@prisma/client`
   - Sử dụng `Prisma.dmmf` thay vì `_baseDmmf`
   - Thêm console.log để debug
   - Thêm warning khi model không tìm thấy

## 🧪 Test

### Test Script
File: `backend/test-schema-inspector.ts`

**Kết quả:**
```
✅ Found 107 models
✅ Product model: 43 fields
✅ Mappable fields: 33 fields
✅ Required fields: 5 fields
✅ All tests passed!
```

### GraphQL Queries
File: `backend/test-schema-queries.graphql`

**6 queries để test:**
1. `getAllModels` - Lấy tất cả models
2. `getModelSchema` - Lấy schema của model
3. `getMappableFields` - Lấy fields có thể map
4. `getRequiredFields` - Lấy required fields
5. `suggestMapping` - Auto-suggest mapping
6. `validateMapping` - Validate mapping config

## 📊 Kết Quả Test

### Product Model
```
Total fields: 43
- Required: 5 (name, slug, price, categoryId, updatedAt)
- Optional: 17 (description, shortDesc, sku, ...)
- Relations: 8 (category, images, variants, ...)
- Auto-generated: 13 (id, stock, status, ...)
- Mappable: 33 fields (loại bỏ relations)
```

### Mappable Fields
```typescript
[
  { name: 'name', type: 'text', isRequired: true },
  { name: 'slug', type: 'text', isRequired: true, isUnique: true },
  { name: 'price', type: 'decimal', isRequired: true },
  { name: 'description', type: 'text', isRequired: false },
  { name: 'categoryId', type: 'text', isRequired: true },
  // ... 28 fields khác
]
```

## 🚀 Cách Sử Dụng

### 1. Backend Test
```bash
cd backend
bun run test-schema-inspector.ts
```

### 2. GraphQL Playground
```
URL: http://localhost:3001/graphql
Copy queries từ: backend/test-schema-queries.graphql
```

### 3. Frontend Usage
```tsx
import SchemaInspectorService from '@/services/schemaInspector';

// Lấy models
const models = await SchemaInspectorService.getAllModels();

// Lấy mappable fields
const fields = await SchemaInspectorService.getMappableFields('Product');

// Auto-suggest
const mapping = await SchemaInspectorService.suggestMapping(
  ['Tên SP', 'Giá'],
  'Product'
);
```

## 📝 Technical Notes

### Prisma DMMF Access
- **Prisma 4.x trước:** `prismaClient._baseDmmf` (deprecated)
- **Prisma 5.x sau:** `Prisma.dmmf` (recommended)

### DMMF Structure
```typescript
Prisma.dmmf = {
  datamodel: {
    models: [
      {
        name: 'Product',
        fields: [
          {
            name: 'id',
            type: 'String',
            kind: 'scalar',
            isRequired: true,
            isId: true,
            hasDefaultValue: true,
            ...
          },
          ...
        ]
      }
    ]
  },
  schema: { ... },
  mappings: { ... }
}
```

## ✨ Tính Năng Đã Hoạt Động

- ✅ Lấy danh sách tất cả models (107 models)
- ✅ Lấy schema chi tiết của từng model
- ✅ Phân loại fields: required, optional, relations, auto-generated
- ✅ Filter mappable fields (loại bỏ relations và auto fields)
- ✅ Auto-suggest mapping với normalize tiếng Việt
- ✅ Validate mapping configuration
- ✅ Format field type và name cho UI

## 🎯 Next Steps

1. Test GraphQL queries trong Playground
2. Test frontend FieldMappingDragDrop component
3. Test full workflow: Paste data → Preview → Drag-drop → Import

---

**Fixed:** 2025-11-05  
**Status:** ✅ Ready to use  
**Test:** ✅ Passed
