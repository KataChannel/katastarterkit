# FIX BUG: Variable "$input" got invalid value {}; Field "id" of required type "ID!" was not provided

## 🐛 Vấn Đề

Lỗi GraphQL xảy ra khi gọi mutation `updateOne` hoặc `deleteOne` với input thiếu field `id` bắt buộc:

```
Variable "$input" got invalid value {}; Field "id" of required type "ID!" was not provided.
```

## 🔍 Nguyên Nhân

### Backend Schema
File `backend/src/graphql/inputs/unified-dynamic.inputs.ts`:

```typescript
@InputType('UnifiedUpdateInput')
export class UnifiedUpdateInput {
  @Field(() => ID, { description: 'Unique identifier' })
  @IsString()
  id: string;  // ← BẮT BUỘC, không nullable!
  
  @Field(() => GraphQLJSONObject)
  data: Record<string, any>;
  
  // ...
}
```

### Frontend Hook (TRƯỚC KHI FIX)
File `frontend/src/hooks/useDynamicGraphQL.ts`:

```typescript
const update = useCallback(
  async (input: { where: any; data: any }) => {
    const result = await mutate({
      variables: {
        modelName: model,
        input: {
          id: typeof input.where === 'string' 
            ? input.where 
            : input.where?.id,  // ← CÓ THỂ UNDEFINED!
          data: input.data,
        },
      },
    });
    return result.data?.updateOne as T;
  },
  [mutate, model]
);
```

**Vấn đề**: 
- Nếu `input.where = {}` (object rỗng) → `input.where?.id = undefined`
- GraphQL nhận `{ id: undefined, data: {...} }`
- Backend validate fail vì `id` là required field

## ✅ Giải Pháp

### 1. Thêm Validation Cho `useUpdateOne`

```typescript
export function useUpdateOne<T = any>(model: string, config?) {
  const [mutate, { data, loading, error }] = useMutation(UPDATE_ONE, {
    refetchQueries: config?.refetchQueries,
  });

  const update = useCallback(
    async (input: {
      where: any;
      data: any;
      select?: any;
      include?: any;
    }) => {
      // Extract ID from where clause
      const id = typeof input.where === 'string' 
        ? input.where 
        : input.where?.id;
      
      // ✅ VALIDATION: Throw error nếu thiếu ID
      if (!id) {
        throw new Error(
          'ID is required for update operation. ' +
          'Please provide where: { id: "..." } or where: "id-string"'
        );
      }

      const result = await mutate({
        variables: {
          modelName: model,
          input: { id, data: input.data, select: input.select, include: input.include },
        },
      });
      return result.data?.updateOne as T;
    },
    [mutate, model]
  );

  return [update, { data: data?.updateOne as T | undefined, loading, error }] as const;
}
```

### 2. Thêm Validation Cho `useDeleteOne`

```typescript
export function useDeleteOne<T = any>(model: string, config?) {
  const [mutate, { data, loading, error }] = useMutation(DELETE_ONE, {
    refetchQueries: config?.refetchQueries,
  });

  const deleteOne = useCallback(
    async (input: { where: any; select?: any }) => {
      // Extract ID from where clause
      const id = typeof input.where === 'string' 
        ? input.where 
        : input.where?.id;
      
      // ✅ VALIDATION: Throw error nếu thiếu ID
      if (!id) {
        throw new Error(
          'ID is required for delete operation. ' +
          'Please provide where: { id: "..." } or where: "id-string"'
        );
      }

      const result = await mutate({
        variables: {
          modelName: model,
          input: { id, select: input.select },
        },
      });
      return result.data?.deleteOne as T;
    },
    [mutate, model]
  );

  return [deleteOne, { data: data?.deleteOne as T | undefined, loading, error }] as const;
}
```

## 📝 Thay Đổi

### File Đã Sửa
**`frontend/src/hooks/useDynamicGraphQL.ts`**

**Thay đổi:**
1. ✅ Thêm validation `if (!id)` trong `useUpdateOne` hook
2. ✅ Thêm validation `if (!id)` trong `useDeleteOne` hook
3. ✅ Throw error rõ ràng với message hướng dẫn sử dụng đúng

## 🎯 Lợi Ích

### Trước Fix
```typescript
// Lỗi khó hiểu từ GraphQL server
await updateCourse({
  where: {},  // ← where rỗng
  data: { title: 'New Title' }
});

// Error: Variable "$input" got invalid value {}; 
// Field "id" of required type "ID!" was not provided.
```

### Sau Fix
```typescript
// Lỗi rõ ràng ngay tại client
await updateCourse({
  where: {},  // ← where rỗng
  data: { title: 'New Title' }
});

// Error: ID is required for update operation. 
// Please provide where: { id: "..." } or where: "id-string"
```

## ✅ Cách Sử Dụng Đúng

### Update One
```typescript
// ✅ Cách 1: Truyền ID trực tiếp
await updateCourse({
  where: courseId,  // string ID
  data: { title: 'New Title' }
});

// ✅ Cách 2: Truyền object có field id
await updateCourse({
  where: { id: courseId },
  data: { title: 'New Title' }
});

// ❌ SAI: Thiếu ID
await updateCourse({
  where: {},  // ← Sẽ throw error!
  data: { title: 'New Title' }
});
```

### Delete One
```typescript
// ✅ Cách 1: Truyền ID trực tiếp
await deleteCourse({
  where: courseId
});

// ✅ Cách 2: Truyền object có field id
await deleteCourse({
  where: { id: courseId }
});

// ❌ SAI: Thiếu ID
await deleteCourse({
  where: {}  // ← Sẽ throw error!
});
```

## 🔒 Bảo Vệ

Với validation này, code sẽ:
- ✅ Fail fast: Lỗi ngay tại client, không cần round-trip đến server
- ✅ Clear error: Message rõ ràng, dễ debug
- ✅ Type-safe: Bắt lỗi ngay trong development
- ✅ Consistent: Tất cả mutations đều có validation như nhau

## 📊 Checklist

- [x] Thêm ID validation trong `useUpdateOne`
- [x] Thêm ID validation trong `useDeleteOne`
- [x] Error message rõ ràng với hướng dẫn
- [x] Maintain backward compatibility (API không thay đổi)
- [x] Comments giải thích logic

---

**Hoàn thành**: Dynamic GraphQL hooks giờ đã an toàn hơn với ID validation! ✨
