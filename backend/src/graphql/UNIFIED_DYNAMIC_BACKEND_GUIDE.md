# Unified Dynamic GraphQL Backend Implementation

## Overview

Đã tạo hệ thống GraphQL Backend thống nhất với cấu trúc và cách thức giống như Prisma, hỗ trợ tất cả các operations: CREATE, UPDATE, DELETE, CREATE_BULK, UPDATE_BULK, DELETE_BULK, GET_ALL, GET_PAGINATED, GET_BY_ID cho mọi model và nested model.

## Core Components

### 1. UnifiedDynamicResolver
- **File**: `src/graphql/resolvers/unified-dynamic.resolver.ts`
- **Purpose**: Single resolver xử lý tất cả CRUD operations cho mọi model
- **Features**:
  - Prisma-like syntax
  - Support cho nested relationships
  - Bulk operations
  - Built-in pagination
  - Type-safe với GraphQL

### 2. DynamicCRUDService (Enhanced)
- **File**: `src/services/dynamic-crud.service.ts`
- **Purpose**: Service layer xử lý database operations
- **Features**:
  - Direct Prisma delegate access
  - Caching mechanism
  - Error handling
  - Support cho complex queries

### 3. Unified Input Types
- **File**: `src/graphql/inputs/unified-dynamic.inputs.ts`
- **Purpose**: GraphQL input types với Prisma-like structure
- **Features**:
  - Type-safe inputs
  - Support cho filters, pagination, selection
  - Validation với class-validator

## Supported Operations

### Queries

#### 1. findMany - Get All Records
```graphql
query GetTasks {
  findMany(
    modelName: "task"
    input: {
      where: { status: "ACTIVE" }
      orderBy: { createdAt: "desc" }
      take: 10
      include: { 
        author: true
        comments: { 
          include: { author: true }
        }
      }
    }
  )
}
```

#### 2. findManyPaginated - Paginated Query
```graphql
query GetTasksPaginated {
  findManyPaginated(
    modelName: "task"
    input: {
      where: { userId: "user-123" }
      page: 1
      limit: 10
      orderBy: { updatedAt: "desc" }
      select: { id: true, title: true, status: true }
    }
  ) {
    data
    meta {
      total
      page
      totalPages
      hasNextPage
      hasPrevPage
    }
  }
}
```

#### 3. findById - Get Single Record
```graphql
query GetTaskById {
  findById(
    modelName: "task"
    input: {
      id: "task-123"
      include: {
        author: { select: { id: true, email: true } }
        comments: true
      }
    }
  )
}
```

#### 4. count - Count Records
```graphql
query CountActiveTasks {
  count(
    modelName: "task"
    where: { status: "ACTIVE" }
  )
}
```

#### 5. exists - Check Existence
```graphql
query TaskExists {
  exists(
    modelName: "task"
    where: { title: "Unique Task Title" }
  )
}
```

### Mutations

#### 1. createOne - Create Single Record
```graphql
mutation CreateTask {
  createOne(
    modelName: "task"
    input: {
      data: {
        title: "New Task"
        description: "Task description"
        status: "ACTIVE"
        userId: "user-123"
      }
      include: {
        author: true
      }
    }
  )
}
```

#### 2. updateOne - Update Single Record
```graphql
mutation UpdateTask {
  updateOne(
    modelName: "task"
    input: {
      id: "task-123"
      data: {
        title: "Updated Task Title"
        status: "COMPLETED"
      }
      select: { id: true, title: true, status: true, updatedAt: true }
    }
  )
}
```

#### 3. deleteOne - Delete Single Record
```graphql
mutation DeleteTask {
  deleteOne(
    modelName: "task"
    input: {
      id: "task-123"
      select: { id: true, title: true }
    }
  )
}
```

#### 4. createMany - Bulk Create
```graphql
mutation CreateManyTasks {
  createMany(
    modelName: "task"
    input: {
      data: [
        {
          title: "Task 1"
          description: "First task"
          status: "ACTIVE"
          userId: "user-123"
        }
        {
          title: "Task 2"
          description: "Second task"
          status: "PENDING"
          userId: "user-123"
        }
      ]
      skipDuplicates: true
    }
  ) {
    success
    count
    data
    errors {
      index
      error
      data
    }
  }
}
```

#### 5. updateMany - Bulk Update
```graphql
mutation UpdateManyTasks {
  updateMany(
    modelName: "task"
    input: {
      where: { status: "PENDING" }
      data: { status: "ACTIVE" }
    }
  ) {
    success
    count
  }
}
```

#### 6. deleteMany - Bulk Delete
```graphql
mutation DeleteManyTasks {
  deleteMany(
    modelName: "task"
    input: {
      where: { status: "COMPLETED" }
    }
  ) {
    success
    count
  }
}
```

#### 7. upsert - Create or Update
```graphql
mutation UpsertTask {
  upsert(
    modelName: "task"
    where: { title: "Unique Task" }
    create: {
      title: "Unique Task"
      description: "New task"
      status: "ACTIVE"
      userId: "user-123"
    }
    update: {
      description: "Updated task"
      updatedAt: "2024-01-01T00:00:00Z"
    }
    include: { author: true }
  )
}
```

## Advanced Features

### 1. Complex Filtering (Prisma-like)
```graphql
query ComplexTaskQuery {
  findMany(
    modelName: "task"
    input: {
      where: {
        AND: [
          { status: { in: ["ACTIVE", "PENDING"] } }
          { createdAt: { gte: "2024-01-01T00:00:00Z" } }
          { 
            OR: [
              { title: { contains: "important" } }
              { priority: { equals: "HIGH" } }
            ]
          }
        ]
      }
      orderBy: [
        { priority: "desc" }
        { createdAt: "desc" }
      ]
    }
  )
}
```

### 2. Nested Relationships
```graphql
query TasksWithNestedData {
  findMany(
    modelName: "task"
    input: {
      include: {
        author: {
          select: { id: true, email: true, profile: true }
        }
        comments: {
          include: {
            author: { select: { id: true, email: true } }
          }
          orderBy: { createdAt: "desc" }
          take: 5
        }
        assignees: true
        tags: true
      }
    }
  )
}
```

## Benefits

### 1. **Unified API**
- Single endpoint cho tất cả models
- Consistent syntax across all operations
- Reduces boilerplate code

### 2. **Prisma-like Experience**
- Familiar syntax cho developers đã sử dụng Prisma
- Support cho complex queries và relationships
- Type-safe operations

### 3. **Performance Optimized**
- Built-in caching mechanism
- Bulk operations for better performance
- Efficient database queries

### 4. **Developer Experience**
- Auto-generated GraphQL schema
- Type-safe với TypeScript
- Comprehensive error handling
- Rich filtering and sorting options

### 5. **Flexibility**
- Support cho mọi model trong database
- Dynamic field selection
- Nested relationship queries
- Custom filtering conditions

## Usage in Frontend

Với hệ thống unified này, frontend có thể sử dụng một API duy nhất cho tất cả operations:

```typescript
// Frontend usage example
const GET_TASKS = gql`
  query GetTasks($where: JSONObject, $include: JSONObject) {
    findMany(
      modelName: "task"
      input: {
        where: $where
        include: $include
        orderBy: { createdAt: "desc" }
      }
    )
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($data: JSONObject!, $include: JSONObject) {
    createOne(
      modelName: "task"
      input: {
        data: $data
        include: $include
      }
    )
  }
`;
```

## Integration

To integrate with the main application, add the `UnifiedDynamicModule` to your main `AppModule`:

```typescript
import { UnifiedDynamicModule } from './graphql/unified-dynamic.module';

@Module({
  imports: [
    // ... other modules
    UnifiedDynamicModule,
  ],
  // ... rest of module config
})
export class AppModule {}
```

## Supported Models

Currently supports all Prisma models:
- user
- task
- post
- comment
- page
- pageBlock
- taskComment
- notification
- auditLog
- role
- permission

The system is extensible và có thể dễ dàng support thêm models mới.