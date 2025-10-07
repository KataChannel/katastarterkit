# Hướng Dẫn Sửa Lỗi SearchUsers GraphQL

## 📋 Tổng Quan

**Ngày tạo:** 2024-01-20  
**Phiên bản:** 1.0  
**Tác giả:** GitHub Copilot  
**Trạng thái:** ✅ Đã phân tích và cung cấp giải pháp

---

## 🔴 Mô Tả Lỗi

### Lỗi GraphQL Execution
```
GraphQL execution errors:
1. Unknown type 'UserSearchInput'
   Did you mean 'RoleSearchInput', 'UserSearchResult', 'OramaSearchInput', 'UpsertInput', or 'AffLinkSearchInput'?

2. Cannot query field 'users' on type 'OramaSearchResult'
3. Cannot query field 'total' on type 'OramaSearchResult'  
4. Cannot query field 'page' on type 'OramaSearchResult'
5. Cannot query field 'size' on type 'OramaSearchResult'
6. Cannot query field 'totalPages' on type 'OramaSearchResult'
```

### Vị Trí Lỗi
- **File Frontend:** `/frontend/src/lib/graphql/user-queries.ts` (dòng 27-28)
- **File Hook:** `/frontend/src/lib/hooks/useUserManagement.ts` (dòng 15, 69)
- **File Sử Dụng:** 
  - `/frontend/src/app/admin/users/page.tsx`
  - `/frontend/src/components/admin/rbac/UserRoleAssignment.tsx`

---

## 🔍 Phân Tích Nguyên Nhân

### 1. Xung Đột Schema GraphQL

Backend có **HAI resolver khác nhau** cho `searchUsers`:

#### Resolver 1: User Resolver (Đúng)
```typescript
// File: /backend/src/graphql/resolvers/user.resolver.ts (dòng 149-153)
@Query(() => UserSearchResult, { name: 'searchUsers' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles($Enums.UserRoleType.ADMIN)
async searchUsers(@Args('input') input: UserSearchInput): Promise<UserSearchResult> {
  return this.userService.searchUsers(input);
}
```

**Input Type:** `UserSearchInput` ✅  
**Return Type:** `UserSearchResult` ✅  
**Schema Definition:** KHÔNG có trong schema.gql ❌

#### Resolver 2: Orama Search Resolver (Ghi đè)
```typescript
// File: /backend/src/graphql/resolvers/orama-search.resolver.ts (dòng 53-57)
@Query(() => OramaSearchResult, { name: 'searchUsers' })
async searchUsers(
  @Args('input') input: OramaSearchInput,
): Promise<OramaSearchResult> {
  return this.oramaService.searchUsers(input);
}
```

**Input Type:** `OramaSearchInput` ❌  
**Return Type:** `OramaSearchResult` ❌  
**Schema Definition:** CÓ trong schema.gql (dòng 1300) ✅

### 2. Schema.gql Hiện Tại (Auto-generated)

```graphql
# Dòng 1300 - Query được tự động generate
type Query {
  searchUsers(input: OramaSearchInput!): OramaSearchResult!
  # ... các query khác
}

# Dòng 1901 - Type UserSearchResult tồn tại nhưng KHÔNG được sử dụng
type UserSearchResult {
  page: Float!
  size: Float!
  total: Float!
  totalPages: Float!
  users: [User!]!
}
```

**Vấn đề:**
- GraphQL Schema được auto-generate từ decorators
- Orama Search Resolver được load SAU User Resolver → GHI ĐÈ query `searchUsers`
- Schema.gql chỉ có `searchUsers(input: OramaSearchInput!)` từ Orama Resolver
- Type `UserSearchInput` KHÔNG được export vào schema.gql (mặc dù đã định nghĩa trong user.input.ts)

### 3. Frontend Query (Sai)

```typescript
// File: /frontend/src/lib/graphql/user-queries.ts (dòng 27-38)
export const SEARCH_USERS = gql`
  query SearchUsers($input: UserSearchInput!) {
    searchUsers(input: $input) {
      users {
        ...UserFragment
      }
      total
      page
      size
      totalPages
    }
  }
  ${USER_FRAGMENT}
`;
```

**Vấn đề:**
- Frontend expect: `UserSearchInput` → KHÔNG tồn tại trong schema.gql
- Frontend expect return: `UserSearchResult` với fields (users, total, page, size, totalPages)
- Backend schema: `OramaSearchInput` → `OramaSearchResult` (structure khác hoàn toàn)

### 4. Cấu Trúc OramaSearchResult vs UserSearchResult

```typescript
// OramaSearchResult (từ Orama Service)
type OramaSearchResult {
  count: Float!          // ≠ total
  elapsed: Float!        // Không có trong UserSearchResult
  hits: [JSONObject!]!   // ≠ users (type khác)
}

// UserSearchResult (từ User Service)  
type UserSearchResult {
  users: [User!]!        // Typed array
  total: Float!
  page: Float!
  size: Float!
  totalPages: Float!
}
```

---

## ✅ Giải Pháp

### Có 3 Cách Xử Lý:

---

## 🎯 GIẢI PHÁP 1: SỬA LẠI FRONTEND (KHUYẾN NGHỊ)

**Ưu điểm:**
- ✅ Nhanh nhất, ít thay đổi nhất
- ✅ Tận dụng Orama full-text search đã có
- ✅ Không cần rebuild schema backend

**Nhược điểm:**
- ⚠️ Phải cập nhật logic frontend để xử lý structure mới

### Bước 1: Cập Nhật Query GraphQL

**File:** `/frontend/src/lib/graphql/user-queries.ts`

```typescript
// TRƯỚC (SAI)
export const SEARCH_USERS = gql`
  query SearchUsers($input: UserSearchInput!) {
    searchUsers(input: $input) {
      users {
        ...UserFragment
      }
      total
      page
      size
      totalPages
    }
  }
  ${USER_FRAGMENT}
`;

// SAU (ĐÚNG)
export const SEARCH_USERS = gql`
  query SearchUsers($input: OramaSearchInput!) {
    searchUsers(input: $input) {
      count
      elapsed
      hits {
        id
        document
        score
      }
    }
  }
`;
```

### Bước 2: Cập Nhật Hook Interface

**File:** `/frontend/src/lib/hooks/useUserManagement.ts`

```typescript
// TRƯỚC (SAI)
export interface UserSearchInput {
  search?: string;
  roleType?: string;
  isActive?: boolean;
  isVerified?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// SAU (ĐÚNG)
export interface OramaSearchInput {
  term?: string;        // Thay vì "search"
  mode?: string;        // 'fulltext' | 'vector' | 'hybrid'
  limit?: number;       // Thay vì "size"
  offset?: number;      // Calculate từ page * size
  threshold?: number;   // Optional: điểm số tối thiểu
  boost?: Record<string, number>; // Optional: boost fields
  where?: Record<string, any>;    // Filters (roleType, isActive, etc.)
}

// Response type
export interface OramaSearchResult {
  count: number;
  elapsed: number;
  hits: Array<{
    id: string;
    score: number;
    document: any; // Chứa User data
  }>;
}
```

### Bước 3: Cập Nhật Hook Implementation

**File:** `/frontend/src/lib/hooks/useUserManagement.ts`

```typescript
// TRƯỚC (SAI)
export function useSearchUsers(input: UserSearchInput) {
  const { data, loading, error, refetch } = useQuery(SEARCH_USERS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });

  return {
    users: data?.searchUsers?.users ?? [],
    total: data?.searchUsers?.total ?? 0,
    page: data?.searchUsers?.page ?? 0,
    size: data?.searchUsers?.size ?? 20,
    totalPages: data?.searchUsers?.totalPages ?? 0,
    loading,
    error,
    refetch,
  };
}

// SAU (ĐÚNG)
export function useSearchUsers(searchInput: {
  search?: string;
  roleType?: string;
  isActive?: boolean;
  isVerified?: boolean;
  page?: number;
  size?: number;
}) {
  // Convert sang OramaSearchInput format
  const oramaInput: OramaSearchInput = {
    term: searchInput.search || '',
    mode: 'fulltext',
    limit: searchInput.size || 20,
    offset: (searchInput.page || 0) * (searchInput.size || 20),
    where: {
      ...(searchInput.roleType && { roleType: searchInput.roleType }),
      ...(searchInput.isActive !== undefined && { isActive: searchInput.isActive }),
      ...(searchInput.isVerified !== undefined && { isVerified: searchInput.isVerified }),
    },
  };

  const { data, loading, error, refetch } = useQuery(SEARCH_USERS, {
    variables: { input: oramaInput },
    fetchPolicy: 'cache-and-network',
  });

  // Transform Orama result về format cũ để giữ compatibility
  const oramaResult: OramaSearchResult | undefined = data?.searchUsers;
  const users = oramaResult?.hits.map(hit => hit.document) ?? [];
  const total = oramaResult?.count ?? 0;
  const size = searchInput.size || 20;
  const page = searchInput.page || 0;
  const totalPages = Math.ceil(total / size);

  return {
    users,
    total,
    page,
    size,
    totalPages,
    elapsed: oramaResult?.elapsed ?? 0, // Bonus: thời gian search
    loading,
    error,
    refetch: (newInput?: typeof searchInput) => {
      if (newInput) {
        const newOramaInput = {
          term: newInput.search || '',
          mode: 'fulltext',
          limit: newInput.size || 20,
          offset: (newInput.page || 0) * (newInput.size || 20),
          where: {
            ...(newInput.roleType && { roleType: newInput.roleType }),
            ...(newInput.isActive !== undefined && { isActive: newInput.isActive }),
            ...(newInput.isVerified !== undefined && { isVerified: newInput.isVerified }),
          },
        };
        return refetch({ input: newOramaInput });
      }
      return refetch();
    },
  };
}
```

### Bước 4: KHÔNG CẦN Cập Nhật Component

Nhờ transformation layer trong hook, các component **KHÔNG CẦN THAY ĐỔI**:

```typescript
// File: /frontend/src/app/admin/users/page.tsx
// Code này VẪN HOẠT ĐỘNG bình thường
const { 
  users,        // ✅ Vẫn có
  total,        // ✅ Vẫn có
  page,         // ✅ Vẫn có
  size,         // ✅ Vẫn có
  totalPages,   // ✅ Vẫn có
  loading,
  error,
  refetch 
} = useSearchUsers({
  search: searchTerm,
  roleType: selectedRole,
  isActive: activeFilter,
  page: currentPage,
  size: 20,
});

// Tất cả code phía dưới KHÔNG CẦN SỬA
```

---

## 🔧 GIẢI PHÁP 2: SỬA LẠI BACKEND (KHÓ HƠN)

**Ưu điểm:**
- ✅ Frontend không cần thay đổi
- ✅ Giữ nguyên UserSearchInput type

**Nhược điểm:**
- ⚠️ Phải xử lý conflict giữa 2 resolvers
- ⚠️ Mất tính năng Orama full-text search
- ⚠️ Phức tạp hơn

### Bước 1: Đổi Tên Orama SearchUsers Resolver

**File:** `/backend/src/graphql/resolvers/orama-search.resolver.ts`

```typescript
// TRƯỚC
@Query(() => OramaSearchResult, { name: 'searchUsers' })
async searchUsers(
  @Args('input') input: OramaSearchInput,
): Promise<OramaSearchResult> {
  return this.oramaService.searchUsers(input);
}

// SAU (đổi tên để tránh conflict)
@Query(() => OramaSearchResult, { name: 'searchUsersFulltext' })
async searchUsersFulltext(
  @Args('input') input: OramaSearchInput,
): Promise<OramaSearchResult> {
  return this.oramaService.searchUsers(input);
}
```

### Bước 2: Export UserSearchInput vào Schema

**File:** `/backend/src/graphql/inputs/user.input.ts`

Đảm bảo class đã có `@InputType()` decorator:

```typescript
@InputType()  // ✅ Đã có, không cần sửa
export class UserSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => $Enums.UserRoleType, { nullable: true })
  @IsOptional()
  @IsEnum($Enums.UserRoleType)
  roleType?: $Enums.UserRoleType;

  // ... các field khác
}
```

### Bước 3: Rebuild Schema

```bash
cd /mnt/chikiet/kataoffical/fullstack/katacore/backend
npm run build

# Hoặc restart backend để GraphQL regenerate schema
```

### Bước 4: Kiểm Tra Schema.gql

**File:** `/backend/src/schema.gql` (sau khi rebuild)

```graphql
# Phải có input này
input UserSearchInput {
  search: String
  roleType: UserRoleType
  isActive: Boolean
  isVerified: Boolean
  page: Int
  size: Int
  sortBy: String
  sortOrder: String
}

# Query phải dùng UserSearchInput
type Query {
  searchUsers(input: UserSearchInput!): UserSearchResult!
  searchUsersFulltext(input: OramaSearchInput!): OramaSearchResult!
}
```

---

## 🚀 GIẢI PHÁP 3: SỬ DỤNG DYNAMIC QUERY SYSTEM (TỐI ƯU)

**Ưu điểm:**
- ✅ ✅ ✅ Tận dụng Universal Dynamic Query System đã implement
- ✅ Linh hoạt nhất, có thể query bất kỳ field nào
- ✅ Không phụ thuộc vào resolvers cố định
- ✅ Hỗ trợ filtering, sorting, pagination mạnh mẽ

**Nhược điểm:**
- ⚠️ Phải refactor frontend để dùng Dynamic Query

### Bước 1: Sử Dụng Universal Dynamic Hook

**File:** `/frontend/src/lib/hooks/useUserManagement.ts`

```typescript
import { useUniversalQuery } from '@/lib/graphql/universal-dynamic-hooks';

export function useSearchUsers(searchInput: {
  search?: string;
  roleType?: string;
  isActive?: boolean;
  isVerified?: boolean;
  page?: number;
  size?: number;
}) {
  // Build where condition
  const where: any = {};
  
  if (searchInput.search) {
    where.OR = [
      { email: { contains: searchInput.search, mode: 'insensitive' } },
      { username: { contains: searchInput.search, mode: 'insensitive' } },
      { firstName: { contains: searchInput.search, mode: 'insensitive' } },
      { lastName: { contains: searchInput.search, mode: 'insensitive' } },
    ];
  }
  
  if (searchInput.roleType) {
    where.roleType = { equals: searchInput.roleType };
  }
  
  if (searchInput.isActive !== undefined) {
    where.isActive = { equals: searchInput.isActive };
  }
  
  if (searchInput.isVerified !== undefined) {
    where.isVerified = { equals: searchInput.isVerified };
  }

  const { data, loading, error, refetch } = useUniversalQuery({
    model: 'user',
    operation: 'findMany',
    args: {
      where,
      skip: (searchInput.page || 0) * (searchInput.size || 20),
      take: searchInput.size || 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        roleType: true,
        isActive: true,
        isVerified: true,
        isTwoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  });

  // Get total count
  const { data: countData } = useUniversalQuery({
    model: 'user',
    operation: 'count',
    args: { where },
  });

  const users = data?.universalQuery?.data || [];
  const total = countData?.universalQuery?.data || 0;
  const size = searchInput.size || 20;
  const page = searchInput.page || 0;
  const totalPages = Math.ceil(total / size);

  return {
    users,
    total,
    page,
    size,
    totalPages,
    loading,
    error,
    refetch,
  };
}
```

### Bước 2: KHÔNG CẦN Sửa Component

Component vẫn hoạt động bình thường như cũ!

---

## 📊 So Sánh 3 Giải Pháp

| Tiêu Chí | Giải Pháp 1<br/>(Sửa Frontend) | Giải Pháp 2<br/>(Sửa Backend) | Giải Pháp 3<br/>(Dynamic Query) |
|----------|-------------------------------|------------------------------|-------------------------------|
| **Độ khó** | ⭐⭐ Trung bình | ⭐⭐⭐ Khó | ⭐⭐⭐⭐ Khó nhất |
| **Thời gian** | 15-30 phút | 30-60 phút | 45-90 phút |
| **Files thay đổi** | 2 files | 2 files | 1 file |
| **Rủi ro** | Thấp | Trung bình | Thấp |
| **Tính năng search** | Full-text search mạnh | Basic search | Advanced search |
| **Performance** | Tốt nhất | Trung bình | Tốt |
| **Maintainability** | Trung bình | Kém | Tốt nhất |
| **Khuyến nghị** | ✅ **CHO MỚI NGƯỜI** | ⚠️ Nếu bắt buộc | 🚀 **CHO ADVANCED** |

---

## 🎯 Khuyến Nghị Cuối Cùng

### Cho Người Mới / Cần Fix Nhanh
👉 **GIẢI PHÁP 1** - Sửa Frontend

**Lý do:**
- Nhanh nhất (15-30 phút)
- Ít rủi ro nhất
- Tận dụng Orama full-text search đã có
- Không cần rebuild backend

### Cho Người Muốn Giữ Nguyên Frontend
👉 **GIẢI PHÁP 2** - Sửa Backend

**Lý do:**
- Frontend không thay đổi
- Nhưng mất tính năng Orama search
- Cần rebuild schema

### Cho Người Muốn Giải Pháp Dài Hạn
👉 **GIẢI PHÁP 3** - Dynamic Query System

**Lý do:**
- Linh hoạt nhất
- Tận dụng hệ thống Universal Query đã có
- Dễ maintain và mở rộng
- Nhưng cần refactor nhiều hơn

---

## ✅ Checklist Thực Hiện

### Trước Khi Bắt Đầu
- [ ] Backup code hiện tại
- [ ] Đảm bảo backend đang chạy
- [ ] Có quyền admin để test (katachanneloffical@gmail.com / Admin@2024)

### Nếu Chọn Giải Pháp 1 (Sửa Frontend)
- [ ] Cập nhật `/frontend/src/lib/graphql/user-queries.ts`
- [ ] Cập nhật `/frontend/src/lib/hooks/useUserManagement.ts`
- [ ] Test query trên GraphQL Playground: `http://localhost:14000/graphql`
- [ ] Test UI tại: `http://localhost:3000/admin/users`
- [ ] Verify search, filter, pagination hoạt động

### Nếu Chọn Giải Pháp 2 (Sửa Backend)
- [ ] Đổi tên resolver trong `orama-search.resolver.ts`
- [ ] Rebuild backend: `npm run build`
- [ ] Kiểm tra `schema.gql` có `UserSearchInput`
- [ ] Restart backend server
- [ ] Test query trên GraphQL Playground
- [ ] Test UI

### Nếu Chọn Giải Pháp 3 (Dynamic Query)
- [ ] Refactor `useUserManagement.ts` dùng `useUniversalQuery`
- [ ] Test query với Universal Query
- [ ] Verify UI hoạt động
- [ ] Document cho team về cách dùng

---

## 🧪 Test Cases

### Test 1: Basic Search
```graphql
query TestSearchUsers {
  searchUsers(input: { term: "admin", mode: "fulltext", limit: 10 }) {
    count
    elapsed
    hits {
      id
      document
      score
    }
  }
}
```

**Expected:** Trả về users có "admin" trong email/username

### Test 2: Filter By Role
```graphql
query TestFilterByRole {
  searchUsers(input: { 
    term: "", 
    mode: "fulltext",
    limit: 20,
    where: { roleType: "ADMIN" }
  }) {
    count
    hits {
      id
      document
    }
  }
}
```

**Expected:** Chỉ trả về users có role ADMIN

### Test 3: Pagination
```graphql
query TestPagination {
  searchUsers(input: { 
    term: "",
    mode: "fulltext", 
    limit: 10,
    offset: 0
  }) {
    count
    hits {
      id
      document
    }
  }
}
```

**Expected:** Trả về 10 users đầu tiên

---

## 🐛 Troubleshooting

### Lỗi: "Unknown type OramaSearchInput"
**Nguyên nhân:** Schema chưa có type này  
**Giải pháp:** Restart backend để regenerate schema

### Lỗi: "Cannot read property 'document' of undefined"
**Nguyên nhân:** Orama result format khác  
**Giải pháp:** Check transformation logic trong hook

### Lỗi: "Where clause invalid"
**Nguyên nhân:** Where condition không đúng format Prisma  
**Giải pháp:** Xem docs Prisma filtering

### UI không hiển thị users
**Nguyên nhân:** Transformation không đúng  
**Giải pháp:** Console.log data để debug structure

---

## 📚 Tài Liệu Tham Khảo

1. **GraphQL Schema:** `/backend/src/schema.gql`
2. **User Resolver:** `/backend/src/graphql/resolvers/user.resolver.ts`
3. **Orama Resolver:** `/backend/src/graphql/resolvers/orama-search.resolver.ts`
4. **User Input:** `/backend/src/graphql/inputs/user.input.ts`
5. **Dynamic Query Docs:** `/docs/DYNAMIC-QUERY-SYSTEM.md`
6. **Frontend Integration:** `/docs/FRONTEND-DYNAMIC-QUERY-GUIDE.md`

---

## 🔄 Next Steps

Sau khi fix bug này:

1. **Áp dụng pattern tương tự** cho các queries khác bị lỗi
2. **Tạo convention** về naming resolvers để tránh conflict
3. **Document** rõ khi nào dùng Orama, khi nào dùng direct query
4. **Cân nhắc migrate** toàn bộ sang Dynamic Query System
5. **Setup CI/CD** để auto-check schema conflicts

---

## ✍️ Ghi Chú

- Lỗi này xảy ra do có 2 resolvers cùng tên `searchUsers`
- NestJS GraphQL auto-generate schema từ decorators
- Resolver được load sau sẽ ghi đè resolver trước
- Frontend query phải match CHÍNH XÁC với schema.gql
- Orama search mạnh hơn basic Prisma where filtering

---

**Chúc bạn sửa bug thành công! 🚀**

Nếu có vấn đề gì, hãy check:
1. Schema.gql có đúng types không
2. GraphQL Playground test query trước
3. Console.log data để xem structure
4. Backend logs để xem error details
