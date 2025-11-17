# Fix Bug GraphQL: Unknown argument "userId" on createSourceDocument

## Lỗi
```
Unknown argument "userId" on field "Mutation.createSourceDocument"
```

## Nguyên Nhân
Frontend truyền `userId` vào GraphQL mutation nhưng backend không định nghĩa argument này. Backend lấy userId tự động từ JWT token qua `@CurrentUser()` decorator.

## Giải Pháp

### 1. GraphQL Mutation (Frontend)
**File:** `frontend/src/graphql/lms/source-documents.ts`

```typescript
// ❌ TRƯỚC (SAI)
mutation CreateSourceDocument($input: CreateSourceDocumentInput!, $userId: ID!) {
  createSourceDocument(input: $input, userId: $userId) { ... }
}

// ✅ SAU (ĐÚNG)
mutation CreateSourceDocument($input: CreateSourceDocumentInput!) {
  createSourceDocument(input: $input) { ... }
}
```

### 2. Admin Page
**File:** `frontend/src/app/lms/admin/source-documents/new/page.tsx`

```typescript
// ❌ TRƯỚC
const userId = 'temp-user-id';
createDocument({ variables: { input, userId } });

// ✅ SAU
createDocument({ variables: { input } });
```

### 3. Instructor Page  
**File:** `frontend/src/app/lms/instructor/source-documents/new/page.tsx`

```typescript
// ❌ TRƯỚC
const userId = 'temp-user-id';
createDocument({ variables: { input, userId } });

// ✅ SAU
createDocument({ variables: { input } });
```

## Lý Do
Backend resolver đã có `@CurrentUser()` decorator để lấy userId từ JWT token:

```typescript
@Mutation(() => SourceDocument)
@UseGuards(JwtAuthGuard)
async createSourceDocument(
  @CurrentUser() user: any,  // ✅ Tự động lấy từ JWT
  @Args('input') input: CreateSourceDocumentInput,
) {
  return this.sourceDocumentService.create(user.id, input);
}
```

## Kết Quả
✅ Mutation hoạt động đúng với JWT authentication  
✅ Không cần truyền userId từ frontend  
✅ Bảo mật hơn - userId không thể bị giả mạo từ client
