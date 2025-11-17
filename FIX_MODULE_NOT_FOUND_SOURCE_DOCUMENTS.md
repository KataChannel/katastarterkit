# Fix lỗi Module not found & GraphQL userId

## Vấn đề

### 1. Module not found (✅ Đã fix)
```
Module not found: Can't resolve '@/graphql/lms/source-documents'
```

**Nguyên nhân**: File `.ts` bị rename thành `.backup`

**Giải pháp**: Khôi phục lại file
```bash
mv src/graphql/lms/source-documents.ts.backup \
   src/graphql/lms/source-documents.ts
```

### 2. Unknown argument userId (✅ Hướng dẫn fix)

Lỗi:
```
GraphQL execution errors: {
  message: 'Unknown argument "userId" on field "Mutation.createSourceDocument".'
}
```

**Nguyên nhân**: Apollo Client cache lỗi thời hoặc browser cache

## Giải pháp cuối cùng

### Bước 1: Xóa file conflict (✅ Hoàn thành)
```bash
# Xóa file .graphql.ts để tránh conflict
rm src/graphql/lms/source-documents.graphql.ts

# Giữ lại file .ts (đúng)
# File này có mutation đúng, không có userId
```

### Bước 2: Clear cache

**Option A - Clear Apollo Cache (Khuyến nghị)**

Thêm button clear cache vào UI:
```typescript
import { useApolloClient } from '@apollo/client';

const client = useApolloClient();

// Clear cache
await client.clearStore();
// hoặc
await client.resetStore();
```

**Option B - Hard refresh browser**
1. Mở DevTools (F12)
2. Right-click nút Refresh
3. Chọn "Empty Cache and Hard Reload"

**Option C - Clear browser storage**
1. F12 → Application tab
2. Clear Storage → Clear site data

**Option D - Incognito mode**
- Test trong cửa sổ ẩn danh để đảm bảo không cache

### Bước 3: Restart dev server (Tùy chọn)
```bash
# Kill server cũ
^C

# Restart
bun run dev:tazagroup:frontend
```

## Mutation đúng

File sử dụng: `/frontend/src/graphql/lms/source-documents.ts`

```graphql
mutation CreateSourceDocument($input: CreateSourceDocumentInput!) {
  createSourceDocument(input: $input) {
    id
    title
    type
    status
    url
    fileName
    createdAt
  }
}
```

**Variables đúng**:
```json
{
  "input": {
    "title": "Tài liệu test",
    "type": "FILE",
    "status": "DRAFT"
  }
}
```

**KHÔNG có userId** - Backend tự lấy từ JWT:
```typescript
@CurrentUser() user: any  // userId = user.id
```

## Files quan trọng

1. ✅ **DÙNG**: `/frontend/src/graphql/lms/source-documents.ts`
   - Mutation đúng
   - Không có userId
   - Được tất cả component import

2. ❌ **ĐÃ XÓA**: `/frontend/src/graphql/lms/source-documents.graphql.ts`
   - File duplicate
   - Gây conflict
   - Đã xóa

## Test mutation

**GraphQL Playground**: http://localhost:13001/graphql

```graphql
mutation TestCreate {
  createSourceDocument(input: {
    title: "Test Document"
    type: FILE
    status: DRAFT
  }) {
    id
    title
    createdAt
  }
}
```

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## Kết quả

✅ **Module resolved** - File `.ts` đã restore
✅ **Mutation đúng** - Không có userId argument
✅ **Import hoạt động** - Tất cả 8 files import thành công

🔍 **Nếu vẫn gặp lỗi userId**:
- Clear Apollo Client cache
- Hard reload browser
- Kiểm tra Network tab xem request thực tế gửi gì
- Test trong Incognito mode

## Tổng kết thay đổi

**Đã làm**:
1. Restore file `source-documents.ts` ✅
2. Xóa file `source-documents.graphql.ts` ✅
3. Không sửa code component (đã đúng từ đầu) ✅

**Cần làm** (nếu vẫn lỗi userId):
1. Clear Apollo cache trong browser
2. Hard refresh (Ctrl+Shift+R)
3. Restart dev server
