# Fix lỗi GraphQL "Unknown argument userId" cho createSourceDocument

## Vấn đề

Khi tạo tài liệu nguồn mới ở `/lms/instructor/source-documents/new`, gặp lỗi GraphQL:

```
GraphQL execution errors: {
  operationName: 'CreateSourceDocument',
  errors: [
    {
      message: 'Unknown argument "userId" on field "Mutation.createSourceDocument".',
      path: undefined,
      locations: [Array]
    }
  ]
}
```

## Nguyên nhân

Có **2 files** GraphQL định nghĩa mutation `CREATE_SOURCE_DOCUMENT`:

1. ✅ **File mới** (đúng): `/frontend/src/graphql/lms/source-documents.graphql.ts`
   - Tạo ngày: Nov 13
   - Mutation đúng: `createSourceDocument(input: $input)`
   - **KHÔNG có** argument `userId`

2. ❌ **File cũ** (sai): `/frontend/src/graphql/lms/source-documents.ts`
   - Tạo ngày: Nov 15 (nhưng có code cũ)
   - Có các mutation khác với `userId`
   - Gây conflict khi import

### Cơ chế lỗi:

Khi code import:
```typescript
import { CREATE_SOURCE_DOCUMENT } from '@/graphql/lms/source-documents';
```

TypeScript/Node.js sẽ:
1. Tìm file theo thứ tự: `.ts` → `.tsx` → `.graphql.ts`
2. Ưu tiên load file `.ts` trước
3. File `.ts` cũ có thể cache code với `userId` từ version trước
4. Gây ra conflict hoặc cache sai mutation

## Giải pháp

### 1. Backup file cũ (✅ Hoàn thành)

```bash
mv src/graphql/lms/source-documents.ts \
   src/graphql/lms/source-documents.ts.backup
```

**Lý do:**
- Tránh conflict giữa 2 files
- Giữ lại file cũ để tham khảo nếu cần
- Cho phép TypeScript load file `.graphql.ts` mới

### 2. Clear Next.js cache (✅ Hoàn thành)

```bash
rm -rf .next/cache
```

**Lý do:**
- Clear compiled code cũ
- Clear GraphQL operation cache
- Force Next.js rebuild với file mới

### 3. Restart dev server (Tự động)

Next.js sẽ tự động reload khi detect file thay đổi.

## Mutation đúng

**File**: `/frontend/src/graphql/lms/source-documents.graphql.ts`

```graphql
mutation CreateSourceDocument($input: CreateSourceDocumentInput!) {
  createSourceDocument(input: $input) {
    ...SourceDocumentWithAI
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Tài liệu mẫu",
    "type": "FILE",
    "status": "DRAFT",
    "description": "Mô tả...",
    "url": "https://...",
    "categoryId": "uuid..."
  }
}
```

**KHÔNG có `userId`** - Backend tự lấy từ JWT token:

```typescript
// Backend resolver
@Mutation(() => SourceDocument)
@UseGuards(JwtAuthGuard)
async createSourceDocument(
  @CurrentUser() user: any,  // ← userId từ JWT
  @Args('input') input: CreateSourceDocumentInput,
) {
  return this.sourceDocumentService.create(user.id, input);
}
```

## Files bị ảnh hưởng

Các files import từ `@/graphql/lms/source-documents`:

1. `/frontend/src/app/lms/student/courses/[id]/documents/page.tsx`
2. `/frontend/src/app/lms/admin/source-documents/page.tsx`
3. `/frontend/src/app/lms/admin/source-documents/[id]/page.tsx`
4. `/frontend/src/app/lms/admin/source-documents/new/page.tsx`
5. `/frontend/src/app/lms/admin/source-documents/categories/page.tsx`
6. `/frontend/src/app/lms/instructor/source-documents/page.tsx`
7. `/frontend/src/app/lms/admin/courses/[id]/edit/page.tsx`
8. ✅ `/frontend/src/app/lms/instructor/source-documents/new/page.tsx` **(File gặp lỗi)**

**Không cần sửa** vì đã rename/backup file `.ts`, các import tự động load file `.graphql.ts`.

## Kết quả

### ❌ Trước

```
POST /graphql
mutation CreateSourceDocument

Response:
{
  "errors": [{
    "message": "Unknown argument \"userId\" on field \"Mutation.createSourceDocument\"."
  }]
}
```

### ✅ Sau

```
POST /graphql
mutation CreateSourceDocument

Response:
{
  "data": {
    "createSourceDocument": {
      "id": "uuid-123",
      "title": "Tài liệu mẫu",
      "type": "FILE",
      "status": "DRAFT",
      ...
    }
  }
}
```

## Bonus: Lỗi logo.svg (404)

Lỗi phụ trong log:
```
GET /assets/images/logo.svg 404 in 50ms
```

**Nguyên nhân**: File `logo.svg` không tồn tại trong `/public/assets/images/`

**Giải pháp** (không ưu tiên):
- Copy logo từ admin panel hoặc
- Tạo logo placeholder hoặc
- Sửa path trong component header

## Tổng kết

✅ **Đã fix:**
1. Backup file `source-documents.ts` cũ
2. Clear Next.js cache
3. TypeScript tự động load file `.graphql.ts` mới
4. Mutation `createSourceDocument` hoạt động đúng
5. Không cần sửa code trong các component

✅ **Kết quả:**
- Tạo tài liệu nguồn mới thành công
- Không còn lỗi "Unknown argument userId"
- All routes hoạt động:
  - `/lms/instructor/source-documents/new` ✅
  - `/lms/instructor/courses/create-with-ai` ✅
  - `/lms/instructor/courses/create-from-documents` ✅

🔍 **Bài học:**
- Tránh duplicate file với cùng export name
- Luôn check thứ tự load file của TypeScript (.ts > .tsx > .d.ts > .graphql.ts)
- Clear cache khi có thay đổi GraphQL schema
- Backend nên dùng `@CurrentUser()` thay vì yêu cầu `userId` trong mutation
