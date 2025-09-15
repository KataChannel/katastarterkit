# Dynamic GraphQL Implementation Guide

## Tổng quan

Hệ thống Dynamic GraphQL này cho phép tạo và sử dụng CRUD operations cho tất cả các model một cách tự động và tối ưu với các tính năng:

- **CREATE**: Tạo single và bulk records
- **READ**: Query với pagination, filtering, và selection
- **UPDATE**: Cập nhật single và bulk records  
- **DELETE**: Xóa single và bulk records
- **Advanced Features**: Upsert, Count, Exists, Caching

## Backend Implementation

### 1. Dynamic CRUD Service

```typescript
// backend/src/services/dynamic-crud.service.ts
import { DynamicCRUDService } from '../services/dynamic-crud.service';

// Sử dụng service
const crudService = new DynamicCRUDService(prismaService);

// CREATE
const user = await crudService.create('user', {
  email: 'user@example.com',
  username: 'newuser'
});

// CREATE BULK
const result = await crudService.createBulk('user', {
  data: [
    { email: 'user1@example.com', username: 'user1' },
    { email: 'user2@example.com', username: 'user2' }
  ],
  skipDuplicates: true
});

// READ with filtering and pagination
const users = await crudService.findMany('user', {
  where: { isActive: true },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10
});

// UPDATE BULK
const updateResult = await crudService.updateBulk('user', {
  where: { role: 'USER' },
  data: { isActive: true }
});
```

### 2. Dynamic GraphQL Resolvers

```typescript
// backend/src/graphql/resolvers/dynamic.resolver.ts
import { createDynamicResolver } from '../resolvers/dynamic.resolver';
import { User } from '../models/user.model';

// Tạo resolver cho User model
const UserResolver = createDynamicResolver('User', User, {
  enableAuth: true,
  enableBulkOps: true,
  enablePagination: true
});

// Universal resolver cho mọi model
// Sử dụng UniversalDynamicResolver
```

### 3. Input Types

```typescript
// backend/src/graphql/inputs/dynamic.inputs.ts
import { DynamicInputTypesManager } from '../inputs/dynamic.inputs';

// Đăng ký input types cho model
DynamicInputTypesManager.registerInputTypes('CustomModel', [
  { name: 'title', type: 'string', required: true },
  { name: 'description', type: 'string', required: false }
]);
```

## Frontend Implementation

### 1. Using Pre-generated Queries

```typescript
// frontend/src/components/UserList.tsx
import { useGetAll, useCreateBulk } from '../lib/graphql/dynamic-hooks';

function UserList() {
  // GET ALL users
  const { data: users, loading, error } = useGetAll('User', {
    variables: {
      filter: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  // CREATE BULK users
  const [createUsers] = useCreateBulk('User');

  const handleBulkCreate = async () => {
    const result = await createUsers({
      variables: {
        input: {
          data: [
            { email: 'user1@test.com', username: 'user1' },
            { email: 'user2@test.com', username: 'user2' }
          ],
          skipDuplicates: true
        }
      }
    });
    
    console.log('Bulk create result:', result.data);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleBulkCreate}>Create Users</button>
      {users?.map(user => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}
```

### 2. Using Universal Hooks

```typescript
// frontend/src/components/DynamicCRUD.tsx
import { useUniversalQuery, useUniversalMutation } from '../lib/graphql/dynamic-hooks';

function DynamicCRUD({ modelName }: { modelName: string }) {
  // Universal query
  const { data, loading } = useUniversalQuery('FIND_MANY', {
    modelName,
    variables: {
      filter: { take: 10 }
    }
  });

  // Universal mutations
  const [create] = useUniversalMutation('CREATE', { modelName });
  const [createBulk] = useUniversalMutation('CREATE_BULK', { modelName });
  const [updateBulk] = useUniversalMutation('UPDATE_BULK', { modelName });

  const handleCreate = async (data: any) => {
    await create({ data });
  };

  const handleBulkCreate = async (items: any[]) => {
    await createBulk({
      input: { data: items, skipDuplicates: true }
    });
  };

  const handleBulkUpdate = async () => {
    await updateBulk({
      input: {
        where: { status: 'DRAFT' },
        data: { status: 'PUBLISHED' }
      }
    });
  };

  return (
    <div>
      <h2>{modelName} CRUD</h2>
      {/* Render data and controls */}
    </div>
  );
}
```

### 3. Using Complete CRUD Hook

```typescript
// frontend/src/components/CompleteCRUD.tsx
import { useCRUD } from '../lib/graphql/dynamic-hooks';

function TaskManager() {
  const {
    getAll,
    getPaginated,
    create,
    createBulk,
    update,
    updateBulk,
    delete: deleteTask,
    deleteBulk,
    upsert
  } = useCRUD<Task>('Task');

  const { data: tasks, loading } = getAll({
    variables: {
      filter: {
        where: { userId: currentUser.id },
        orderBy: { dueDate: 'asc' }
      }
    }
  });

  const handleBulkOperations = async () => {
    // Bulk create
    await createBulk({
      variables: {
        input: {
          data: [
            { title: 'Task 1', priority: 'HIGH' },
            { title: 'Task 2', priority: 'MEDIUM' }
          ]
        }
      }
    });

    // Bulk update completed tasks
    await updateBulk({
      variables: {
        input: {
          where: { status: 'IN_PROGRESS' },
          data: { status: 'COMPLETED' }
        }
      }
    });

    // Bulk delete old tasks
    await deleteBulk({
      variables: {
        input: {
          where: {
            createdAt: { lt: new Date('2024-01-01') }
          }
        }
      }
    });
  };

  return (
    <div>
      <button onClick={handleBulkOperations}>Run Bulk Operations</button>
      {tasks?.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## Advanced Usage Examples

### 1. Pagination with Meta

```typescript
function PaginatedList() {
  const { data, loading } = useGetPaginated('Post', {
    variables: {
      filter: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        skip: 0,
        take: 10
      }
    }
  });

  const { data: posts, meta } = data || {};

  return (
    <div>
      {posts?.map(post => <div key={post.id}>{post.title}</div>)}
      <div>
        Page {meta?.page} of {meta?.totalPages}
        ({meta?.total} total items)
      </div>
    </div>
  );
}
```

### 2. Complex Filtering

```typescript
function FilteredResults() {
  const [filters, setFilters] = useState({});
  
  const { data: results } = useGetAll('Task', {
    variables: {
      filter: {
        where: {
          AND: [
            { status: { in: ['TODO', 'IN_PROGRESS'] } },
            { priority: { not: 'LOW' } },
            { dueDate: { gte: new Date() } },
            { title: { contains: filters.search } }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' }
        ],
        include: {
          user: true,
          comments: { take: 5 }
        }
      }
    },
    skip: !filters.search // Skip query if no search term
  });

  return (
    <div>
      <input 
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Search tasks..."
      />
      {results?.map(task => (
        <div key={task.id}>
          {task.title} - {task.user.username}
          ({task.comments?.length} comments)
        </div>
      ))}
    </div>
  );
}
```

### 3. Error Handling

```typescript
import { isDynamicGraphQLError, formatDynamicGraphQLError } from '../lib/graphql/dynamic-hooks';

function ErrorHandlingExample() {
  const [create, { loading, error }] = useCreate('User');

  const handleSubmit = async (userData: any) => {
    try {
      const result = await create({
        variables: { data: userData }
      });
      console.log('Created:', result.data);
    } catch (err) {
      if (isDynamicGraphQLError(err)) {
        alert(formatDynamicGraphQLError(err));
      } else {
        alert('Unknown error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error">
          {formatDynamicGraphQLError(error)}
        </div>
      )}
      <button disabled={loading} type="submit">
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

## Performance Optimization

### 1. Caching Strategy

```typescript
// Backend caching được tự động handle trong DynamicCRUDService
// Frontend caching với Apollo Client
const { data } = useGetAll('User', {
  fetchPolicy: 'cache-first', // Use cache if available
  nextFetchPolicy: 'cache-and-network' // Refresh in background
});
```

### 2. Field Selection

```typescript
// Only select needed fields for better performance
const { data } = useGetAll('Post', {
  variables: {
    filter: {
      select: {
        id: true,
        title: true,
        excerpt: true,
        publishedAt: true
      }
    }
  }
});
```

### 3. Bulk Operations

```typescript
// Efficient bulk operations
const handleBulkUpdate = async (taskIds: string[], updates: any) => {
  await updateBulk({
    variables: {
      input: {
        where: { id: { in: taskIds } },
        data: updates
      }
    }
  });
};
```

## Integration với Existing Code

### 1. Module Setup

```typescript
// backend/src/app.module.ts
import { DynamicGraphQLModule } from './graphql/dynamic-graphql.module';
import { User } from './graphql/models/user.model';
import { Post } from './graphql/models/post.model';
import { Task } from './graphql/models/task.model';

@Module({
  imports: [
    // Other modules...
    DynamicGraphQLModule.forModels([
      { 
        name: 'User', 
        modelClass: User,
        options: { enableAuth: true, enableBulkOps: true }
      },
      { 
        name: 'Post', 
        modelClass: Post,
        options: { enableAuth: true }
      },
      { 
        name: 'Task', 
        modelClass: Task 
      }
    ])
  ]
})
export class AppModule {}
```

### 2. GraphQL Module Integration

```typescript
// backend/src/graphql/graphql.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicGraphQLModule } from './dynamic-graphql.module';
import { UniversalDynamicResolver } from './resolvers/dynamic.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => ({
        message: error.message,
        path: error.path,
        timestamp: new Date().toISOString(),
      })
    }),
    DynamicGraphQLModule
  ],
  providers: [UniversalDynamicResolver]
})
export class GraphQLAppModule {}
```

## Best Practices

1. **Security**: Luôn enable authentication cho sensitive operations
2. **Validation**: Sử dụng class-validator decorators trong input types
3. **Error Handling**: Implement proper error handling cho bulk operations
4. **Performance**: Sử dụng field selection và pagination cho large datasets
5. **Caching**: Leverage built-in caching để improve performance
6. **Testing**: Viết tests cho dynamic resolvers và hooks

Hệ thống này cung cấp một giải pháp hoàn chỉnh và tối ưu cho việc quản lý CRUD operations trong ứng dụng GraphQL fullstack.
