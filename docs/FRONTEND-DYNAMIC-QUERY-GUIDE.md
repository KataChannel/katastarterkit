# Dynamic Query System - Frontend Integration Guide

**Ngày:** 10/06/2025  
**Version:** 1.0.0  
**Stack:** Next.js 15 + React 19 + Apollo Client + TypeScript

---

## 📋 Tổng Quan

Hướng dẫn tích hợp **Universal Dynamic Query System** vào frontend Next.js để thực hiện CRUD operations với tất cả Prisma models thông qua GraphQL.

### ✨ Tính Năng

- ✅ **Type-Safe Hooks** - TypeScript types đầy đủ
- ✅ **React Hooks** - useDynamicFindMany, useDynamicCreate, etc.
- ✅ **Auto Refetch** - Tự động cập nhật cache
- ✅ **Error Handling** - Xử lý lỗi tập trung
- ✅ **Pagination** - Hỗ trợ phân trang
- ✅ **Optimistic Updates** - Cập nhật UI ngay lập tức
- ✅ **Flexible Filters** - Where conditions phức tạp

---

## 🚀 Cài Đặt & Setup

### Files Được Tạo

```
frontend/src/lib/graphql/
├── universal-dynamic-queries.ts   # GraphQL queries/mutations
├── universal-dynamic-types.ts     # TypeScript types
└── universal-dynamic-hooks.ts     # React hooks

frontend/src/components/examples/
└── DynamicQueryExamples.tsx       # Example components
```

### Import Hooks

```typescript
import {
  useDynamicFindMany,
  useDynamicFindUnique,
  useDynamicCreate,
  useDynamicUpdate,
  useDynamicDelete,
  useDynamicCount,
  useDynamicAggregate,
  useDynamicCRUD,
} from '@/lib/graphql/universal-dynamic-hooks';
```

### Import Types

```typescript
import type {
  FindManyInput,
  CreateInput,
  UpdateInput,
  ModelName,
} from '@/lib/graphql/universal-dynamic-types';
```

---

## 📖 Usage Guide

### 1. Find Many - Lấy Danh Sách

#### Basic Usage

```typescript
'use client';

import { useDynamicFindMany } from '@/lib/graphql/universal-dynamic-hooks';

export function UserList() {
  const { data, loading, error } = useDynamicFindMany({
    model: 'user',
    where: { isActive: true },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const users = data?.dynamicFindMany?.data || [];

  return (
    <div>
      {users.map((user: any) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

#### With Pagination

```typescript
const [page, setPage] = useState(1);

const { data, loading } = useDynamicFindMany({
  model: 'task',
  where: { status: 'TODO' },
  pagination: {
    page,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
});
```

#### With Relations (Include)

```typescript
const { data } = useDynamicFindMany({
  model: 'user',
  include: {
    posts: true,
    tasks: {
      where: { status: 'IN_PROGRESS' },
      orderBy: { priority: 'asc' },
    },
  },
});
```

#### Complex Filters

```typescript
const { data } = useDynamicFindMany({
  model: 'task',
  where: {
    AND: [
      { status: { in: ['TODO', 'IN_PROGRESS'] } },
      { priority: { not: 'LOW' } },
      {
        OR: [
          { dueDate: { lt: new Date() } },
          { assigneeId: { equals: userId } },
        ],
      },
    ],
  },
});
```

---

### 2. Find Unique - Lấy Chi Tiết

```typescript
export function UserDetail({ userId }: { userId: string }) {
  const { data, loading } = useDynamicFindUnique({
    model: 'user',
    where: { id: userId },
    include: {
      posts: true,
      tasks: true,
    },
  });

  const user = data?.dynamicFindUnique;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <p>Posts: {user?.posts?.length}</p>
    </div>
  );
}
```

---

### 3. Create - Tạo Mới

```typescript
export function CreateTaskForm() {
  const [createTask, { loading, error }] = useDynamicCreate();

  const handleSubmit = async (formData: any) => {
    try {
      const result = await createTask({
        variables: {
          input: {
            model: 'task',
            data: {
              title: formData.title,
              description: formData.description,
              status: 'TODO',
            },
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      console.log('Created:', result.data?.dynamicCreate);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### With Auto Refetch

```typescript
const [createTask] = useDynamicCreate({
  refetchQueries: ['DynamicFindMany'], // Refetch list sau khi create
  awaitRefetchQueries: true,
  onCompleted: (data) => {
    console.log('Created successfully:', data);
    toast.success('Task created!');
  },
  onError: (error) => {
    toast.error('Failed to create task');
  },
});
```

---

### 4. Update - Cập Nhật

```typescript
export function UpdateUserButton({ userId, newName }: any) {
  const [updateUser, { loading }] = useDynamicUpdate();

  const handleUpdate = async () => {
    await updateUser({
      variables: {
        input: {
          model: 'user',
          where: { id: userId },
          data: { name: newName },
        },
      },
    });
  };

  return (
    <button onClick={handleUpdate} disabled={loading}>
      Update Name
    </button>
  );
}
```

#### Optimistic Update

```typescript
const [updateTask] = useDynamicUpdate({
  optimisticResponse: {
    dynamicUpdate: {
      __typename: 'Task',
      id: taskId,
      status: 'COMPLETED',
    },
  },
  update: (cache, { data }) => {
    // Manually update Apollo cache
    cache.modify({
      id: cache.identify({ __typename: 'Task', id: taskId }),
      fields: {
        status: () => 'COMPLETED',
      },
    });
  },
});
```

---

### 5. Delete - Xóa

```typescript
export function DeleteButton({ taskId }: { taskId: string }) {
  const [deleteTask, { loading }] = useDynamicDelete();

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;

    await deleteTask({
      variables: {
        input: {
          model: 'task',
          where: { id: taskId },
        },
      },
      refetchQueries: ['DynamicFindMany'],
    });
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      Delete
    </button>
  );
}
```

---

### 6. Bulk Operations

#### Create Many

```typescript
const [createMany] = useDynamicCreateMany();

await createMany({
  variables: {
    input: {
      model: 'task',
      data: [
        { title: 'Task 1', status: 'TODO' },
        { title: 'Task 2', status: 'TODO' },
        { title: 'Task 3', status: 'TODO' },
      ],
      skipDuplicates: true,
    },
  },
});
```

#### Update Many

```typescript
const [updateMany] = useDynamicUpdateMany();

await updateMany({
  variables: {
    input: {
      model: 'task',
      where: { status: 'TODO', priority: 'LOW' },
      data: { priority: 'MEDIUM' },
    },
  },
});
```

#### Delete Many

```typescript
const [deleteMany] = useDynamicDeleteMany();

await deleteMany({
  variables: {
    input: {
      model: 'post',
      where: {
        published: false,
        createdAt: { lt: new Date('2024-01-01') },
      },
    },
  },
});
```

---

### 7. Count & Aggregation

#### Count Records

```typescript
const { data } = useDynamicCount({
  model: 'task',
  where: { status: 'COMPLETED' },
});

const count = data?.dynamicCount?._all || 0;
```

#### Aggregate Calculations

```typescript
const { data } = useDynamicAggregate({
  model: 'ext_listhoadon',
  where: { status: 'paid' },
  _sum: { totalAmount: true },
  _avg: { totalAmount: true },
  _min: { totalAmount: true },
  _max: { totalAmount: true },
  _count: true,
});

console.log('Total revenue:', data?.dynamicAggregate?._sum?.totalAmount);
console.log('Average order:', data?.dynamicAggregate?._avg?.totalAmount);
```

#### Group By

```typescript
const { data } = useDynamicGroupBy({
  model: 'task',
  by: ['status', 'priority'],
  _count: { _all: true },
  where: { userId: currentUserId },
  orderBy: { _count: { _all: 'desc' } },
});

// Result: Array of { status, priority, _count: { _all: number } }
```

---

### 8. useDynamicCRUD - All-in-One Hook

```typescript
export function TaskManager() {
  const taskCRUD = useDynamicCRUD('task');

  // Create
  const handleCreate = async () => {
    await taskCRUD.create({
      title: 'New Task',
      status: 'TODO',
    });
  };

  // Update
  const handleUpdate = async (taskId: string) => {
    await taskCRUD.update(
      { id: taskId },
      { status: 'COMPLETED' }
    );
  };

  // Delete
  const handleDelete = async (taskId: string) => {
    await taskCRUD.delete({ id: taskId });
  };

  // Bulk operations
  const handleBulkCreate = async () => {
    await taskCRUD.createMany([
      { title: 'Task 1', status: 'TODO' },
      { title: 'Task 2', status: 'TODO' },
    ]);
  };

  return (
    <div>
      {/* UI components */}
    </div>
  );
}
```

---

## 🎨 Advanced Patterns

### 1. Search Component with Debounce

```typescript
import { useMemo, useState } from 'react';
import { debounce } from 'lodash';

export function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  const { data, loading } = useDynamicFindMany({
    model: 'user',
    where: {
      OR: [
        { email: { contains: debouncedSearch, mode: 'insensitive' } },
        { name: { contains: debouncedSearch, mode: 'insensitive' } },
      ],
    },
  }, {
    skip: !debouncedSearch,
  });

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        debouncedSetSearch(e.target.value);
      }}
      placeholder="Search users..."
    />
  );
}
```

### 2. Infinite Scroll

```typescript
export function InfiniteTaskList() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, loading, fetchMore } = useDynamicFindMany({
    model: 'task',
    pagination: { page, limit },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        input: {
          model: 'task',
          pagination: { page: page + 1, limit },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          dynamicFindMany: {
            ...prev.dynamicFindMany,
            data: [
              ...prev.dynamicFindMany.data,
              ...fetchMoreResult.dynamicFindMany.data,
            ],
          },
        };
      },
    }).then(() => setPage(p => p + 1));
  };

  return (
    <div>
      {/* Task list */}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}
```

### 3. Form with Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskForm() {
  const [createTask] = useDynamicCreate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    await createTask({
      variables: {
        input: {
          model: 'task',
          data: {
            ...data,
            status: 'TODO',
          },
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <textarea {...register('description')} />
      
      <select {...register('priority')}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## 🔧 Best Practices

### 1. Always Use `select` for Performance

```typescript
// ❌ BAD - Fetches all fields
const { data } = useDynamicFindMany({ model: 'user' });

// ✅ GOOD - Only fetch needed fields
const { data } = useDynamicFindMany({
  model: 'user',
  select: { id: true, email: true, name: true },
});
```

### 2. Use Pagination for Large Lists

```typescript
// ✅ Always paginate large datasets
const { data } = useDynamicFindMany({
  model: 'post',
  pagination: { page: 1, limit: 20 },
});
```

### 3. Handle Loading & Error States

```typescript
if (loading) return <Skeleton />;
if (error) return <ErrorBoundary error={error} />;
if (!data) return <EmptyState />;
```

### 4. Use Optimistic Updates

```typescript
const [updateTask] = useDynamicUpdate({
  optimisticResponse: {
    dynamicUpdate: { id: taskId, status: 'COMPLETED' },
  },
});
```

### 5. Refetch After Mutations

```typescript
const [createTask] = useDynamicCreate({
  refetchQueries: ['DynamicFindMany'],
  awaitRefetchQueries: true,
});
```

---

## 🐛 Troubleshooting

### Issue: "Cannot read property 'data' of undefined"

**Solution:** Check data structure
```typescript
// ❌ Wrong
const users = data?.data;

// ✅ Correct
const users = data?.dynamicFindMany?.data || [];
```

### Issue: Query not refetching after mutation

**Solution:** Add refetchQueries
```typescript
const [createTask] = useDynamicCreate({
  refetchQueries: ['DynamicFindMany'], // Name of query to refetch
});
```

### Issue: TypeScript errors with types

**Solution:** Import correct types
```typescript
import type { FindManyInput } from '@/lib/graphql/universal-dynamic-types';

const input: FindManyInput = {
  model: 'user',
  where: { isActive: true },
};
```

---

## 📚 Complete Example App

```typescript
'use client';

import {
  useDynamicFindMany,
  useDynamicCreate,
  useDynamicUpdate,
  useDynamicDelete,
} from '@/lib/graphql/universal-dynamic-hooks';

export function TaskApp() {
  const [page, setPage] = useState(1);
  
  // Fetch tasks
  const { data, loading, refetch } = useDynamicFindMany({
    model: 'task',
    where: { userId: currentUserId },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
    },
    pagination: { page, limit: 10 },
  });

  // Create task
  const [createTask] = useDynamicCreate({
    onCompleted: () => refetch(),
  });

  // Update task
  const [updateTask] = useDynamicUpdate({
    onCompleted: () => refetch(),
  });

  // Delete task
  const [deleteTask] = useDynamicDelete({
    onCompleted: () => refetch(),
  });

  const handleCreate = async (title: string) => {
    await createTask({
      variables: {
        input: {
          model: 'task',
          data: { title, status: 'TODO' },
        },
      },
    });
  };

  const handleToggleComplete = async (taskId: string, currentStatus: string) => {
    await updateTask({
      variables: {
        input: {
          model: 'task',
          where: { id: taskId },
          data: { status: currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED' },
        },
      },
    });
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask({
      variables: {
        input: {
          model: 'task',
          where: { id: taskId },
        },
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  const tasks = data?.dynamicFindMany?.data || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      
      {/* Task list */}
      <div className="space-y-2 mb-4">
        {tasks.map((task: any) => (
          <div key={task.id} className="flex items-center gap-2 p-3 border rounded">
            <input
              type="checkbox"
              checked={task.status === 'COMPLETED'}
              onChange={() => handleToggleComplete(task.id, task.status)}
            />
            <span className={task.status === 'COMPLETED' ? 'line-through' : ''}>
              {task.title}
            </span>
            <button
              onClick={() => handleDelete(task.id)}
              className="ml-auto text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 Summary

### Available Hooks

- `useDynamicFindMany` - List with pagination
- `useDynamicFindUnique` - Single record
- `useDynamicFindFirst` - First matching
- `useDynamicCreate` - Create record
- `useDynamicCreateMany` - Bulk create
- `useDynamicUpdate` - Update record
- `useDynamicUpdateMany` - Bulk update
- `useDynamicUpsert` - Create or update
- `useDynamicDelete` - Delete record
- `useDynamicDeleteMany` - Bulk delete
- `useDynamicCount` - Count records
- `useDynamicAggregate` - Aggregations
- `useDynamicGroupBy` - Group by
- `useDynamicCRUD` - All-in-one

### When to Use

✅ **Use Dynamic Query System when:**
- Prototyping quickly
- Building admin panels
- Generic CRUD operations
- Data exploration tools
- Flexible filtering needed

❌ **Use typed resolvers when:**
- Complex business logic
- Strict type requirements
- Performance critical
- Custom data transformations

---

**Happy Coding! 🚀**
