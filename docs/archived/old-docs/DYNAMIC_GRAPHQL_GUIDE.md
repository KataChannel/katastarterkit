# 🚀 Universal Dynamic GraphQL System - Enterprise Level

## Overview

Hệ thống Dynamic GraphQL hoàn chỉnh cho phép bạn **CODE 1 LẦN, SỬ DỤNG CHO TẤT CẢ CÁC MODEL** với Prisma-like syntax.

### ✨ Key Features

- ✅ **Universal Operations**: FindMany, FindUnique, Create, Update, Delete, Upsert cho TẤT CẢ models
- ✅ **Type-Safe**: Full TypeScript support với generics
- ✅ **Prisma-like Syntax**: Giống y hệt Prisma Client
- ✅ **Auto-generated**: Tự động từ Prisma schema
- ✅ **Built-in Caching**: Performance optimization
- ✅ **Bulk Operations**: CreateMany, UpdateMany, DeleteMany
- ✅ **Pagination**: Built-in pagination support
- ✅ **Aggregation**: Count, Sum, Avg, Min, Max, GroupBy
- ✅ **Relations**: Include và select nested data
- ✅ **Authentication**: JWT-based auth
- ✅ **Error Handling**: Comprehensive error handling

---

## 📦 Installation & Setup

### Backend Setup

1. **Import Module trong `app.module.ts`**:

```typescript
import { DynamicGraphQLModule } from './graphql/dynamic-graphql.module.v2';

@Module({
  imports: [
    // ... other modules
    DynamicGraphQLModule, // Add this
  ],
})
export class AppModule {}
```

2. **That's it!** Backend đã sẵn sàng! 🎉

### Frontend Setup

**Không cần setup gì thêm!** Chỉ cần import hooks và sử dụng.

---

## 🎯 Usage Examples

### Backend (GraphQL Playground)

#### 1. Query Examples

```graphql
# Find all active tasks
query {
  findMany(
    model: "task"
    where: { status: "ACTIVE" }
    orderBy: { createdAt: "desc" }
    take: 10
  )
}

# Find user by ID with relations
query {
  findUnique(
    model: "user"
    where: { id: "123" }
    include: { 
      tasks: true
      posts: { where: { published: true } }
    }
  )
}

# Paginated tasks
query {
  findManyPaginated(
    model: "task"
    page: 1
    limit: 20
    where: { userId: "123" }
    orderBy: { priority: "desc" }
  )
}

# Count active users
query {
  count(
    model: "user"
    where: { isActive: true }
  )
}

# Group tasks by status
query {
  groupBy(
    model: "task"
    options: {
      by: ["status"]
      _count: { _all: true }
    }
  )
}

# Aggregate invoice amounts
query {
  aggregate(
    model: "invoice"
    options: {
      _sum: { amount: true }
      _avg: { amount: true }
      _count: true
      where: { status: "PAID" }
    }
  )
}
```

#### 2. Mutation Examples

```graphql
# Create a task
mutation {
  createOne(
    model: "task"
    data: {
      title: "New Task"
      description: "Task description"
      status: "TODO"
      priority: "HIGH"
      userId: "123"
    }
    include: { user: true }
  )
}

# Create multiple tasks (bulk)
mutation {
  createMany(
    model: "task"
    data: [
      { title: "Task 1", userId: "123", status: "TODO" }
      { title: "Task 2", userId: "123", status: "TODO" }
      { title: "Task 3", userId: "123", status: "TODO" }
    ]
    skipDuplicates: true
  )
}

# Update a task
mutation {
  updateOne(
    model: "task"
    where: { id: "456" }
    data: { 
      status: "COMPLETED"
      completedAt: "2025-10-29T00:00:00Z"
    }
  )
}

# Update all pending tasks to in-progress
mutation {
  updateMany(
    model: "task"
    where: { status: "TODO" }
    data: { status: "IN_PROGRESS" }
  )
}

# Delete a task
mutation {
  deleteOne(
    model: "task"
    where: { id: "456" }
  )
}

# Delete all completed tasks
mutation {
  deleteMany(
    model: "task"
    where: { status: "COMPLETED" }
  )
}

# Upsert user
mutation {
  upsert(
    model: "user"
    where: { email: "user@example.com" }
    create: {
      email: "user@example.com"
      firstName: "John"
      lastName: "Doe"
    }
    update: {
      firstName: "John Updated"
    }
  )
}
```

---

### Frontend (React/Next.js)

#### 1. Basic Queries

```typescript
import { useFindMany, useFindUnique, useCount } from '@/hooks/useDynamicGraphQL';

// Component Example
function TaskList() {
  // Find all active tasks
  const { data: tasks, loading, error, refetch } = useFindMany<Task>('task', {
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {tasks?.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.user.email}</p>
        </div>
      ))}
    </div>
  );
}

// Find user by ID
function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useFindUnique<User>('user', 
    { id: userId },
    { include: { tasks: true, posts: true } }
  );

  return <div>{user?.email}</div>;
}

// Count active tasks
function TaskCounter() {
  const { count } = useCount('task', { status: 'ACTIVE' });
  return <span>{count} active tasks</span>;
}
```

#### 2. Pagination

```typescript
import { useFindManyPaginated } from '@/hooks/useDynamicGraphQL';

function PaginatedTaskList() {
  const {
    data,
    meta,
    loading,
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit
  } = useFindManyPaginated<Task>('task', {
    page: 1,
    limit: 10,
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      {/* Task list */}
      {data?.map(task => <TaskCard key={task.id} task={task} />)}

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={prevPage} disabled={!meta?.hasPrevPage}>
          Previous
        </button>
        <span>Page {meta?.page} of {meta?.totalPages}</span>
        <button onClick={nextPage} disabled={!meta?.hasNextPage}>
          Next
        </button>
      </div>

      {/* Items per page */}
      <select value={limit} onChange={(e) => changeLimit(Number(e.target.value))}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}
```

#### 3. Mutations

```typescript
import { useCreateOne, useUpdateOne, useDeleteOne } from '@/hooks/useDynamicGraphQL';

function TaskManager() {
  const [createTask, { loading: creating }] = useCreateOne<Task>('task');
  const [updateTask, { loading: updating }] = useUpdateOne<Task>('task');
  const [deleteTask, { loading: deleting }] = useDeleteOne('task');

  const handleCreate = async () => {
    const task = await createTask({
      data: {
        title: 'New Task',
        status: 'TODO',
        priority: 'MEDIUM',
        userId: currentUserId
      },
      include: { user: true }
    });
    console.log('Created:', task);
  };

  const handleUpdate = async (taskId: string) => {
    const task = await updateTask({
      where: { id: taskId },
      data: { status: 'COMPLETED' }
    });
    console.log('Updated:', task);
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask({
      where: { id: taskId }
    });
    console.log('Deleted');
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={creating}>
        Create Task
      </button>
    </div>
  );
}
```

#### 4. Bulk Operations

```typescript
import { useCreateMany, useUpdateMany, useDeleteMany } from '@/hooks/useDynamicGraphQL';

function BulkOperations() {
  const [createMany] = useCreateMany('task');
  const [updateMany] = useUpdateMany('task');
  const [deleteMany] = useDeleteMany('task');

  const bulkCreate = async () => {
    const result = await createMany({
      data: [
        { title: 'Task 1', userId: '123', status: 'TODO' },
        { title: 'Task 2', userId: '123', status: 'TODO' },
        { title: 'Task 3', userId: '123', status: 'TODO' },
      ]
    });
    console.log(`Created ${result.count} tasks`);
  };

  const bulkUpdate = async () => {
    const result = await updateMany({
      where: { status: 'TODO' },
      data: { priority: 'HIGH' }
    });
    console.log(`Updated ${result.count} tasks`);
  };

  const bulkDelete = async () => {
    const result = await deleteMany({ status: 'COMPLETED' });
    console.log(`Deleted ${result.count} tasks`);
  };

  return <div>...</div>;
}
```

#### 5. All-in-One CRUD Hook

```typescript
import { useCRUD } from '@/hooks/useDynamicGraphQL';

function TaskCRUD() {
  const crud = useCRUD<Task>('task');

  const handleOperations = async () => {
    // Find many
    const tasks = await crud.findMany({ 
      where: { status: 'ACTIVE' } 
    });

    // Find one
    const task = await crud.findUnique({ id: '123' });

    // Count
    const count = await crud.count({ status: 'ACTIVE' });

    // Create
    const newTask = await crud.createOne({
      data: { title: 'New', userId: '123', status: 'TODO' }
    });

    // Update
    const updated = await crud.updateOne({
      where: { id: newTask.id },
      data: { status: 'COMPLETED' }
    });

    // Delete
    await crud.deleteOne({
      where: { id: newTask.id }
    });
  };

  return (
    <div>
      <button onClick={handleOperations} disabled={crud.loading}>
        Run Operations
      </button>
    </div>
  );
}
```

#### 6. Advanced: Aggregation & GroupBy

```typescript
import { useAggregate, useGroupBy } from '@/hooks/useDynamicGraphQL';

function Analytics() {
  // Aggregate invoice totals
  const { data: invoiceStats } = useAggregate('invoice', {
    _sum: { amount: true },
    _avg: { amount: true },
    _count: true,
    where: { status: 'PAID' }
  });

  // Group tasks by status
  const { data: taskGroups } = useGroupBy('task', {
    by: ['status'],
    _count: { _all: true },
    orderBy: { status: 'asc' }
  });

  return (
    <div>
      <h3>Invoice Stats</h3>
      <p>Total: ${invoiceStats?._sum?.amount}</p>
      <p>Average: ${invoiceStats?._avg?.amount}</p>
      <p>Count: {invoiceStats?._count}</p>

      <h3>Tasks by Status</h3>
      {taskGroups?.map(group => (
        <div key={group.status}>
          {group.status}: {group._count._all} tasks
        </div>
      ))}
    </div>
  );
}
```

---

## 🔥 Real-World Examples

### Example 1: E-Commerce Product Management

```typescript
// List products with categories and variants
function ProductList() {
  const { data: products } = useFindMany<Product>('product', {
    where: { 
      isActive: true,
      stock: { gt: 0 }
    },
    include: {
      category: true,
      variants: true,
      images: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return <div>{/* Render products */}</div>;
}
```

### Example 2: Blog with Comments

```typescript
// Get post with all comments and authors
function BlogPost({ postId }: { postId: string }) {
  const { data: post } = useFindUnique<Post>('post', 
    { id: postId },
    {
      include: {
        author: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        },
        _count: { comments: true, likes: true }
      }
    }
  );

  return <div>{/* Render post */}</div>;
}
```

### Example 3: User Dashboard

```typescript
function UserDashboard({ userId }: { userId: string }) {
  // Get user with all relations
  const { data: user } = useFindUnique<User>('user', 
    { id: userId },
    {
      include: {
        tasks: { where: { status: 'ACTIVE' } },
        posts: { where: { published: true } },
        _count: { tasks: true, posts: true, comments: true }
      }
    }
  );

  // Count completed tasks
  const { count: completedTasks } = useCount('task', {
    userId,
    status: 'COMPLETED'
  });

  // Task stats by priority
  const { data: taskStats } = useGroupBy('task', {
    by: ['priority'],
    _count: { _all: true },
    where: { userId }
  });

  return <div>{/* Render dashboard */}</div>;
}
```

---

## 🎨 Available Models

Bạn có thể sử dụng cho **TẤT CẢ** các models trong Prisma schema của bạn:

- `user`
- `task`
- `post`
- `comment`
- `page`
- `pageBlock`
- `product`
- `category`
- `invoice`
- `order`
- `notification`
- `auditLog`
- `role`
- `permission`
- ... và tất cả models khác!

---

## 🚀 Performance Tips

1. **Use Pagination**: Cho large datasets
2. **Select Specific Fields**: Chỉ lấy fields cần thiết
3. **Use Include Wisely**: Tránh deep nesting
4. **Bulk Operations**: Cho nhiều records cùng lúc
5. **Cache Strategy**: Sử dụng `fetchPolicy` hợp lý

---

## 🔒 Security

- ✅ JWT Authentication required
- ✅ Built-in validation
- ✅ SQL injection prevention (Prisma)
- ✅ Input sanitization
- ✅ Rate limiting ready

---

## 📊 Benefits

### Traditional Approach (Old Way):
```typescript
// Phải tạo resolver cho TỪNG model
UserResolver, TaskResolver, PostResolver, CommentResolver...
// Phải tạo GraphQL queries cho TỪNG operation
GET_USERS, GET_USER_BY_ID, CREATE_USER, UPDATE_USER...
// Phải tạo hooks cho TỪNG model
useUsers(), useUser(), useCreateUser()...
```

### Dynamic Approach (New Way):
```typescript
// CHỈ 1 RESOLVER cho TẤT CẢ
UniversalDynamicResolver

// CHỈ 1 SET HOOKS cho TẤT CẢ
useFindMany<AnyModel>('anyModel')
useCreateOne<AnyModel>('anyModel')

// Code 1 lần, dùng mãi mãi! 🚀
```

---

## 🎯 Summary

**Code 1 lần** → **Sử dụng cho TẤT CẢ models** → **Tiết kiệm hàng nghìn dòng code!** 

Đây là giải pháp **senior-level, production-ready** cho mọi dự án enterprise! 💪

---

## 📝 License

MIT License - Use freely in your projects!

**Made with ❤️ by Senior Full-Stack Engineers**
