# Fix: GraphQL schema - Thêm address fields cho User

## 🐛 Lỗi
```
Cannot query field "address" on type "User".
Cannot query field "city" on type "User".
Cannot query field "district" on type "User".
Cannot query field "ward" on type "User".
```

## ✅ Giải pháp

### File: `/backend/src/graphql/models/user.model.ts`

Thêm 4 fields vào GraphQL User ObjectType:

```ts
@ObjectType()
export class User {
  // ... existing fields
  
  // ✅ Thêm Shipping/Address information
  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  district?: string;

  @Field({ nullable: true })
  ward?: string;
  
  // ... rest of fields
}
```

## 📊 Stack hoàn chỉnh

✅ **Prisma schema** (`schema.prisma`): Đã có address fields
✅ **GraphQL User model** (`user.model.ts`): Đã thêm @Field decorators
✅ **Frontend query** (`queries.ts`): Đã request address fields
✅ **Frontend User type** (`AuthContext.tsx`): Đã có address types
✅ **Auto-fill logic** (`thanh-toan/page.tsx`): Đã có useEffect

## 🚀 Kết quả

- ✅ GraphQL schema có đầy đủ address fields
- ✅ Frontend có thể query address từ getMe
- ✅ Auto-fill thông tin user khi checkout
- ✅ Type-safe end-to-end

**Note**: Database migration sẽ auto-generate khi có thời gian. Hiện tại fields đã có sẵn từ production DB.

---
**Ngày fix**: 9/11/2025
**Trạng thái**: ✅ Hoàn thành
