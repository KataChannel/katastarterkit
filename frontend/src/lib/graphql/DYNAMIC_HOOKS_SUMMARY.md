# Unified Dynamic GraphQL Hooks - Implementation Summary

## Overview
Đã cập nhật hệ thống dynamic GraphQL hooks để sử dụng một bộ unified system duy nhất cho tất cả models và nested models với các operations: CREATE, UPDATE, DELETE, CREATE_BULK, UPDATE_BULK, DELETE_BULK, GET_ALL, GET_PAGINATED, GET_BY_ID.

## Key Changes

### 1. Simplified Architecture
- **Before**: Multiple systems (DynamicGraphQLGenerator, UniversalQueries, AllModelQueries)
- **After**: Single unified system using only `DynamicGraphQLGenerator`

### 2. Core Hook Functions

#### `useDynamicQuery<TData>(operationType, modelName, options)`
- **Operations**: 'GET_ALL' | 'GET_PAGINATED' | 'GET_BY_ID'
- **Features**: 
  - Supports custom fields selection
  - Supports nested fields for relationships
  - Auto-generates GraphQL queries
  - TypeScript support

#### `useDynamicMutation<TData, TVariables>(operationType, modelName, options)`
- **Operations**: 'CREATE' | 'UPDATE' | 'DELETE' | 'CREATE_BULK' | 'UPDATE_BULK' | 'DELETE_BULK'
- **Features**:
  - Supports custom fields selection
  - Supports nested fields for relationships
  - Bulk operations support
  - TypeScript support

### 3. Enhanced Options Interface
```typescript
interface DynamicQueryOptions {
  fields?: string[];                    // Select specific fields
  nestedFields?: Record<string, string[]>; // Select nested model fields
  // ... other Apollo Query options
}

interface DynamicMutationOptions {
  fields?: string[];                    // Select specific fields for response
  nestedFields?: Record<string, string[]>; // Select nested model fields for response
  // ... other Apollo Mutation options
}
```

### 4. Convenience Hooks
- `useGetAll<TData>(modelName, options)` - Get all records
- `useGetPaginated<TData>(modelName, options)` - Get paginated records
- `useGetById<TData>(modelName, options)` - Get record by ID
- `useCreate<TData>(modelName, options)` - Create single record
- `useUpdate<TData>(modelName, options)` - Update single record
- `useDelete<TData>(modelName, options)` - Delete single record
- `useCreateBulk<TData>(modelName, options)` - Create multiple records
- `useUpdateBulk<TData>(modelName, options)` - Update multiple records
- `useDeleteBulk<TData>(modelName, options)` - Delete multiple records

### 5. High-Level Model Hook
```typescript
const useModel<TData>(modelName, options) => {
  // Returns object with all hooks for the model
  useGetAll, useGetPaginated, useGetById,
  useCreate, useUpdate, useDelete,
  useCreateBulk, useUpdateBulk, useDeleteBulk
}
```

### 6. CRUD Utility Hook  
```typescript
const useCRUD<TData>(modelName) => {
  // Returns object with all CRUD operations
  getAll, getPaginated, getById,
  create, update, delete, createBulk, updateBulk, deleteBulk
}
```

## Usage Examples

### Basic Usage
```typescript
// Simple query
const { data: tasks } = useDynamicQuery('GET_ALL', 'Task');

// Simple mutation
const [createTask] = useDynamicMutation('CREATE', 'Task');
```

### With Custom Fields
```typescript
const { data: tasks } = useDynamicQuery('GET_ALL', 'Task', {
  fields: ['id', 'title', 'status', 'description'],
  nestedFields: {
    author: ['id', 'email', 'name'],
    comments: ['id', 'content', 'createdAt']
  }
});
```

### Using Model Hook
```typescript
const taskModel = useModel('Task', {
  fields: ['id', 'title', 'status'],
  nestedFields: { author: ['id', 'email'] }
});

function TaskComponent() {
  const { data: tasks } = taskModel.useGetAll();
  const [createTask] = taskModel.useCreate();
  const [updateTask] = taskModel.useUpdate();
  
  // ... component logic
}
```

### Using CRUD Hook
```typescript
function TaskManagement() {
  const {
    getAll,
    create,
    update,
    delete: deleteTask,
    createBulk,
    updateBulk,
    deleteBulk
  } = useCRUD('Task');
  
  // ... component logic
}
```

## Benefits

1. **Unified System**: Single approach for all models
2. **Type Safety**: Full TypeScript support
3. **Flexibility**: Custom fields and nested fields support
4. **Consistency**: Same API across all models
5. **Performance**: Only fetch needed fields
6. **Bulk Operations**: Built-in bulk operation support
7. **Ease of Use**: Multiple convenience hooks for different use cases
8. **Maintainability**: Single source of truth for GraphQL operations

## Supported Operations

### Queries
- ✅ GET_ALL - Get all records with optional filtering
- ✅ GET_PAGINATED - Get paginated records
- ✅ GET_BY_ID - Get single record by ID

### Mutations
- ✅ CREATE - Create single record
- ✅ UPDATE - Update single record  
- ✅ DELETE - Delete single record
- ✅ CREATE_BULK - Create multiple records
- ✅ UPDATE_BULK - Update multiple records
- ✅ DELETE_BULK - Delete multiple records

### Not Included (Can be added if needed)
- COUNT - Count records
- EXISTS - Check if record exists
- UPSERT - Create or update record

## Implementation Details

- All hooks use Apollo Client's `useQuery` and `useMutation`
- GraphQL queries are generated dynamically using `DynamicGraphQLGenerator`
- Nested fields are properly formatted in GraphQL query strings
- Error handling utilities provided
- Full TypeScript generics support for data types
- Memoized query generation for performance