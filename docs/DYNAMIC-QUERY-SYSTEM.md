# Dynamic Query System - Hệ Thống Truy Vấn Động Universal

## 📋 Tổng Quan

Hệ thống Dynamic Query cung cấp khả năng thực thi **tất cả các thao tác Prisma** thông qua GraphQL một cách linh hoạt, không cần tạo resolver riêng cho từng model.

### ✨ Tính Năng Chính

- ✅ **Universal CRUD Operations**: Hỗ trợ tất cả 42 Prisma models
- ✅ **Flexible Queries**: findMany, findUnique, findFirst với filters động
- ✅ **Bulk Operations**: createMany, updateMany, deleteMany
- ✅ **Advanced Features**: Aggregation, GroupBy, Count
- ✅ **Full Prisma Support**: select, include, where, orderBy, pagination
- ✅ **Type-Safe**: Validation và type checking hoàn chỉnh
- ✅ **Scalable**: Dễ dàng mở rộng cho models mới

---

## 🚀 Cách Sử Dụng

### 1. Universal Query (Đọc Dữ Liệu)

#### Find Many - Lấy nhiều records

```graphql
query UniversalQueryExample {
  universalQuery(
    input: {
      model: "user"
      operation: "findMany"
      where: { email: { contains: "@gmail.com" } }
      select: { id: true, email: true, name: true }
      orderBy: { createdAt: "desc" }
      skip: 0
      take: 10
    }
  )
}
```

#### Find Unique - Lấy 1 record duy nhất

```graphql
query GetUserById {
  universalQuery(
    input: {
      model: "user"
      operation: "findUnique"
      where: { id: "user-uuid-here" }
      include: { posts: true, tasks: true }
    }
  )
}
```

#### Find First - Lấy record đầu tiên

```graphql
query GetLatestPost {
  universalQuery(
    input: {
      model: "post"
      operation: "findFirst"
      where: { published: true }
      orderBy: { createdAt: "desc" }
    }
  )
}
```

#### Count - Đếm số lượng

```graphql
query CountUsers {
  universalQuery(
    input: {
      model: "user"
      operation: "count"
      where: { isActive: true }
    }
  )
}
```

#### Aggregate - Tính toán tổng hợp

```graphql
query AggregateInvoices {
  universalQuery(
    input: {
      model: "ext_listhoadon"
      operation: "aggregate"
      where: { status: "paid" }
      _sum: { totalAmount: true }
      _avg: { totalAmount: true }
      _max: { totalAmount: true }
      _min: { totalAmount: true }
      _count: true
    }
  )
}
```

#### Group By - Nhóm và tổng hợp

```graphql
query GroupTasksByStatus {
  universalQuery(
    input: {
      model: "task"
      operation: "groupBy"
      by: ["status"]
      _count: { _all: true }
      where: { userId: "user-uuid" }
    }
  )
}
```

---

### 2. Universal Mutation (Ghi Dữ Liệu)

#### Create - Tạo mới

```graphql
mutation CreateUser {
  universalMutation(
    input: {
      model: "user"
      operation: "create"
      data: {
        email: "newuser@example.com"
        name: "New User"
        password: "hashedpassword"
      }
      select: { id: true, email: true, name: true }
    }
  )
}
```

#### Create Many - Tạo nhiều records

```graphql
mutation BulkCreateTasks {
  universalMutation(
    input: {
      model: "task"
      operation: "createMany"
      data: [
        { title: "Task 1", userId: "user-uuid", status: "TODO" }
        { title: "Task 2", userId: "user-uuid", status: "TODO" }
        { title: "Task 3", userId: "user-uuid", status: "IN_PROGRESS" }
      ]
    }
  )
}
```

#### Update - Cập nhật

```graphql
mutation UpdateUser {
  universalMutation(
    input: {
      model: "user"
      operation: "update"
      where: { id: "user-uuid" }
      data: { name: "Updated Name", isActive: true }
      select: { id: true, name: true, isActive: true }
    }
  )
}
```

#### Update Many - Cập nhật nhiều

```graphql
mutation BulkUpdateTasks {
  universalMutation(
    input: {
      model: "task"
      operation: "updateMany"
      where: { status: "TODO", priority: "LOW" }
      data: { priority: "MEDIUM" }
    }
  )
}
```

#### Upsert - Tạo hoặc cập nhật

```graphql
mutation UpsertPost {
  universalMutation(
    input: {
      model: "post"
      operation: "upsert"
      where: { slug: "my-unique-slug" }
      data: {
        title: "New Post"
        content: "Content here"
        published: true
      }
    }
  )
}
```

#### Delete - Xóa

```graphql
mutation DeleteTask {
  universalMutation(
    input: {
      model: "task"
      operation: "delete"
      where: { id: "task-uuid" }
    }
  )
}
```

#### Delete Many - Xóa nhiều

```graphql
mutation BulkDeleteOldPosts {
  universalMutation(
    input: {
      model: "post"
      operation: "deleteMany"
      where: { 
        published: false
        createdAt: { lt: "2024-01-01T00:00:00.000Z" }
      }
    }
  )
}
```

---

### 3. Typed Resolvers (Khuyến Nghị Sử Dụng)

Thay vì dùng `universalQuery` chung, bạn có thể dùng các resolver chuyên biệt:

#### Find Many với Pagination

```graphql
query PaginatedUsers {
  dynamicFindMany(
    input: {
      model: "user"
      where: { isActive: true }
      select: { id: true, email: true, name: true }
      pagination: {
        page: 1
        limit: 20
        sortBy: "createdAt"
        sortOrder: "desc"
      }
    }
  )
}
```

#### Create với Type Safety

```graphql
mutation CreatePost {
  dynamicCreate(
    input: {
      model: "post"
      data: {
        title: "My New Post"
        content: "Post content here"
        userId: "user-uuid"
        published: true
      }
      select: { id: true, title: true, slug: true }
    }
  )
}
```

#### Update với Validation

```graphql
mutation SafeUpdate {
  dynamicUpdate(
    input: {
      model: "task"
      where: { id: "task-uuid" }
      data: {
        status: "COMPLETED"
        completedAt: "2025-10-06T00:00:00.000Z"
      }
      include: { user: true, comments: true }
    }
  )
}
```

---

## 📚 Danh Sách Models Hỗ Trợ

### Core Models
- `user` - Người dùng
- `post` - Bài viết
- `comment` - Bình luận
- `task` - Nhiệm vụ
- `tag` - Thẻ tag
- `category` - Danh mục

### Auth & Security
- `authMethod` - Phương thức xác thực
- `verificationToken` - Token xác minh
- `userSession` - Phiên đăng nhập
- `auditLog` - Log kiểm toán
- `role` - Vai trò
- `permission` - Quyền hạn
- `userRoleAssignment` - Gán vai trò
- `userPermission` - Quyền người dùng

### Affiliate System
- `affUser` - Người tiếp thị liên kết
- `affCampaign` - Chiến dịch affiliate
- `affLink` - Link affiliate
- `affClick` - Click tracking
- `affConversion` - Chuyển đổi
- `affPaymentRequest` - Yêu cầu thanh toán

### Invoice & Accounting
- `ext_listhoadon` - Hóa đơn (Invoice)
- `ext_detailhoadon` - Chi tiết hóa đơn
- `ext_dmhanghoa` - Danh mục hàng hóa
- `ext_dmkhachhang` - Danh mục khách hàng
- `ext_vattukho` - Vật tư kho
- `ext_dmdonvi` - Danh mục đơn vị
- `ext_dmsodo` - Danh mục sơ đồ
- `ext_trungtamcp` - Trung tâm chi phí
- `ext_tieude` - Tiêu đề

### Other Models
- `notification` - Thông báo
- `menu` - Menu hệ thống
- `page` - Trang
- `chatbotModel` - Model chatbot
- `chatConversation` - Cuộc hội thoại
- `chatMessage` - Tin nhắn chat

---

## 🔍 Các Truy Vấn Nâng Cao

### 1. Complex Where Conditions

```graphql
query ComplexSearch {
  dynamicFindMany(
    input: {
      model: "task"
      where: {
        AND: [
          { status: { in: ["TODO", "IN_PROGRESS"] } }
          { priority: { not: "LOW" } }
          { 
            OR: [
              { dueDate: { lt: "2025-12-31" } }
              { assigneeId: { equals: "user-uuid" } }
            ]
          }
        ]
      }
      orderBy: [
        { priority: "asc" }
        { dueDate: "asc" }
      ]
    }
  )
}
```

### 2. Nested Includes

```graphql
query NestedData {
  dynamicFindUnique(
    input: {
      model: "user"
      where: { id: "user-uuid" }
      include: {
        posts: {
          include: {
            comments: {
              include: {
                user: true
              }
            }
            tags: true
          }
        }
        tasks: {
          where: { status: "IN_PROGRESS" }
          orderBy: { priority: "asc" }
        }
      }
    }
  )
}
```

### 3. Aggregation với Grouping

```graphql
query SalesReport {
  dynamicGroupBy(
    input: {
      model: "ext_listhoadon"
      by: ["status", "paymentMethod"]
      where: {
        createdAt: {
          gte: "2025-01-01T00:00:00.000Z"
          lt: "2025-12-31T23:59:59.999Z"
        }
      }
      _sum: { totalAmount: true, taxAmount: true }
      _avg: { totalAmount: true }
      _count: { _all: true }
      orderBy: { _sum: { totalAmount: "desc" } }
    }
  )
}
```

### 4. Pagination với Full Count

```graphql
query PaginatedTasks {
  dynamicFindMany(
    input: {
      model: "task"
      where: { userId: "user-uuid" }
      select: {
        id: true
        title: true
        status: true
        priority: true
        dueDate: true
      }
      pagination: {
        page: 2
        limit: 25
        sortBy: "createdAt"
        sortOrder: "desc"
      }
    }
  )
}

# Response includes:
# - data: Array of tasks
# - count: Number of tasks in current page
# - total: Total tasks matching criteria
# - hasMore: Boolean indicating if there are more pages
```

---

## 🛡️ Authentication & Security

### Yêu Cầu Auth

Mặc định, tất cả các dynamic queries **YÊU CẦU JWT authentication**.

**Header cần thiết:**
```
Authorization: Bearer <your-jwt-token>
```

### Bỏ Auth Guard (Nếu Cần)

Trong `universal-query.resolver.ts`, xóa decorator:
```typescript
// @UseGuards(JwtAuthGuard)  // <- Bỏ dòng này
@Resolver()
export class UniversalQueryResolver {
  // ...
}
```

### Role-Based Access Control

Để thêm RBAC, sử dụng custom guard:

```typescript
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversalQueryResolver {
  
  @Query(() => GraphQLJSONObject)
  @Roles('admin', 'manager')
  async dynamicFindMany(...) {
    // Only admin and manager can access
  }
}
```

---

## 💡 Best Practices

### 1. Sử Dụng Select để Giảm Payload

```graphql
# ❌ BAD - Lấy tất cả fields
dynamicFindMany(input: { model: "user" })

# ✅ GOOD - Chỉ lấy fields cần thiết
dynamicFindMany(
  input: {
    model: "user"
    select: { id: true, email: true, name: true }
  }
)
```

### 2. Dùng Pagination cho Danh Sách Lớn

```graphql
# ✅ GOOD - Pagination ngăn overload
dynamicFindMany(
  input: {
    model: "post"
    pagination: { page: 1, limit: 20 }
  }
)
```

### 3. Index Database Properly

Đảm bảo các fields trong `where` và `orderBy` đều có index:

```prisma
model Task {
  id        String   @id @default(uuid())
  status    String   @db.VarChar(50)
  priority  String   @db.VarChar(20)
  createdAt DateTime @default(now())
  
  @@index([status])
  @@index([priority])
  @@index([createdAt])
  @@index([status, priority])
}
```

### 4. Validate Input Data

```typescript
// Trong resolver, thêm validation
if (!input.model || !input.operation) {
  throw new BadRequestException('Model and operation are required');
}

if (!this.dynamicQueryService.modelExists(input.model)) {
  throw new BadRequestException(`Invalid model: ${input.model}`);
}
```

---

## 🔧 Configuration & Customization

### Thêm Model Mới

**1. Thêm vào `validModels` trong `dynamic-query-generator.service.ts`:**

```typescript
private validModels = [
  'user', 'post', 'task',
  // ... existing models
  'yourNewModel',  // <- Thêm model mới
];
```

**2. Thêm Prisma delegate mapping:**

```typescript
private getModelDelegate(modelName: string): any {
  const modelMap: Record<string, any> = {
    user: this.prisma.user,
    post: this.prisma.post,
    // ... existing mappings
    yournewmodel: this.prisma.yourNewModel,  // <- Map delegate
  };
  
  return modelMap[normalizedModel];
}
```

**3. Thêm vào danh sách trong resolver:**

```typescript
@Query(() => [String])
async listAvailableModels(): Promise<string[]> {
  return [
    'user', 'post', 'task',
    // ... existing
    'yourNewModel',  // <- Thêm vào list
  ];
}
```

### Custom Validation Rules

```typescript
// Trong service, thêm custom validation
async create(modelName: string, data: Record<string, any>, options = {}) {
  this.validateModel(modelName);
  
  // Custom validation cho model cụ thể
  if (modelName === 'user') {
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Invalid email format');
    }
  }
  
  // Continue with create...
}
```

---

## 📊 Performance Optimization

### 1. DataLoader Pattern (Tránh N+1)

```typescript
// Sử dụng DataLoader cho batch loading
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids) => {
  const users = await this.dynamicQueryService.findMany('user', {
    where: { id: { in: ids } }
  });
  return ids.map(id => users.find(u => u.id === id));
});
```

### 2. Caching với Redis

```typescript
// Cache kết quả query
const cacheKey = `query:${modelName}:${JSON.stringify(options)}`;
const cached = await this.redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await delegate.findMany(options);
await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300); // 5 min
return result;
```

### 3. Query Optimization

```graphql
# ✅ Efficient - Sử dụng cursor pagination cho datasets lớn
dynamicFindMany(
  input: {
    model: "post"
    cursor: { id: "last-post-id" }
    take: 10
    orderBy: { createdAt: "desc" }
  }
)
```

---

## 🐛 Troubleshooting

### Lỗi: "Invalid model"

**Nguyên nhân:** Model name không khớp với danh sách models được hỗ trợ.

**Giải pháp:**
```graphql
# 1. Kiểm tra danh sách models
query {
  listAvailableModels
}

# 2. Dùng đúng tên model (lowercase)
universalQuery(input: { model: "user" })  # ✅
universalQuery(input: { model: "User" })  # ❌
```

### Lỗi: "No Prisma delegate found"

**Nguyên nhân:** Model chưa được map trong `getModelDelegate()`.

**Giải pháp:** Thêm mapping trong service:
```typescript
const modelMap: Record<string, any> = {
  // ... existing
  yourmodel: this.prisma.yourModel,
};
```

### Lỗi: "Property 'by' is missing"

**Nguyên nhân:** GroupBy operation thiếu tham số `by`.

**Giải pháp:**
```graphql
# ✅ Correct
universalQuery(
  input: {
    model: "task"
    operation: "groupBy"
    by: ["status"]  # <- Required
    _count: { _all: true }
  }
)
```

---

## 📝 Examples Repository

### Complete CRUD Example

```graphql
# 1. Create user
mutation {
  create: dynamicCreate(input: {
    model: "user"
    data: { email: "test@test.com", name: "Test User" }
    select: { id: true }
  })
}

# 2. Read users
query {
  list: dynamicFindMany(input: {
    model: "user"
    select: { id: true, email: true, name: true }
  })
}

# 3. Update user
mutation {
  update: dynamicUpdate(input: {
    model: "user"
    where: { email: "test@test.com" }
    data: { name: "Updated Name" }
  })
}

# 4. Delete user
mutation {
  delete: dynamicDelete(input: {
    model: "user"
    where: { email: "test@test.com" }
  })
}
```

---

## 🎯 Summary

### Khi Nào Dùng Dynamic Queries?

**✅ Sử dụng khi:**
- Cần flexibility cao trong filtering/sorting
- Xây dựng admin panel, data explorer
- Prototyping nhanh, testing
- Generic CRUD operations
- Analytics và reporting

**❌ Tránh khi:**
- Cần complex business logic
- Yêu cầu strict type safety
- Performance-critical operations với nhiều joins
- Complex data transformations

### Kết Hợp với Typed Resolvers

```typescript
// Dùng typed resolver cho business logic phức tạp
@Query(() => User)
async getUser(@Args('id') id: string) {
  // Custom business logic
  const user = await this.userService.findById(id);
  // Complex transformations
  return this.transformUser(user);
}

// Dùng dynamic query cho generic operations
@Query(() => GraphQLJSONObject)
async dynamicFindMany(@Args('input') input: FindManyInput) {
  return this.dynamicQueryService.findMany(input.model, input);
}
```

---

## 📞 Support & Contributions

Nếu gặp vấn đề hoặc có câu hỏi:
1. Kiểm tra docs này trước
2. Xem logs trong console: `[DynamicQueryGeneratorService]`
3. Test với GraphQL Playground: http://localhost:14000/graphql
4. Liên hệ team development

**Happy Querying! 🚀**
