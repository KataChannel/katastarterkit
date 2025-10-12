# Frontend Refactoring - Quick Reference Guide

**Quick reference for using the new hooks, HOCs, and utilities**

---

## 🎣 Hooks Quick Reference

### Data Table Management
```typescript
import { useDataTable } from '@/hooks';

const table = useDataTable<User>({
  initialFilters: { role: 'admin' },
  pageSize: 20,
});

// API
table.filters                // Current filters
table.updateFilter(key, val) // Update filter
table.searchTerm             // Search input
table.debouncedSearchTerm    // Debounced search (300ms)
table.toggleSort(field)      // Toggle sort
table.pagination             // { page, pageSize, total }
table.selectedItems          // Selected IDs
table.toggleItem(id)         // Toggle selection
```

### Modal Management
```typescript
import { useModal, useModalWithData } from '@/hooks';

// Basic modal
const modal = useModal();
modal.open() / modal.close() / modal.toggle()

// Modal with data
const editModal = useModalWithData<User>();
editModal.openWith(user)
editModal.closeAndClear()
```

### Form State
```typescript
import { useFormState, useFormHandlers } from '@/hooks';

const form = useFormState({ name: '', email: '' });
const handlers = useFormHandlers(form);

// Usage
<input name="email" onChange={handlers.handleChange} />
<Select onValueChange={handlers.handleSelect('role')} />
```

### Async Actions
```typescript
import { useAsyncAction, useMutation } from '@/hooks';

// Hook style
const saveUser = useAsyncAction(async (user) => api.save(user));
await saveUser.execute(userData);

// Mutation style
const [create, { loading, error }] = useMutation(api.create);
await create(data);
```

### Debouncing
```typescript
import { useDebounce, useDebouncedCallback } from '@/hooks';

const debouncedSearch = useDebounce(searchTerm, 500);
const handleSearch = useDebouncedCallback((q) => fetch(q), 500);
```

### SSR Safety
```typescript
import { useMounted, useWindowSize, useMediaQuery } from '@/hooks';

const isMounted = useMounted();
const { width } = useWindowSize();
const isMobile = useMediaQuery('(max-width: 768px)');

if (!isMounted) return null; // Prevent hydration errors
```

---

## 🔄 HOCs Quick Reference

### Error Boundary
```typescript
import { withErrorBoundary } from '@/components/hoc';

export default withErrorBoundary(MyComponent, {
  fallback: (error, info, reset) => <CustomError />,
  onError: (error) => Sentry.captureException(error),
});
```

### Authentication
```typescript
import { withAuth } from '@/components/hoc';

export default withAuth(ProtectedPage, {
  redirectTo: '/login',
  requireRoles: ['admin', 'editor'],
  LoadingComponent: () => <Spinner />,
});
```

### Loading States
```typescript
import { withLoading } from '@/components/hoc';

const UserList = withLoading(UserListComponent, {
  LoadingComponent: () => <Spinner />,
  ErrorComponent: ({ error, retry }) => <Error />,
  EmptyComponent: () => <Empty />,
  checkEmpty: (props) => !props.users?.length,
});

<UserList users={users} isLoading={loading} error={error} />
```

---

## 🛠️ Utilities Quick Reference

### Form Utilities
```typescript
import { 
  createFormHandler, 
  validateForm, 
  createSubmitHandler 
} from '@/utils/form';

const handleChange = createFormHandler(setFormData);
const errors = validateForm(data, schema);
const handleSubmit = createSubmitHandler({
  onSubmit: async (data) => api.save(data),
  validate: (data) => validateForm(data, schema),
});
```

### Array Utilities
```typescript
import { 
  groupBy, 
  unique, 
  sortBy, 
  sum, 
  average 
} from '@/utils/array';

const byRole = groupBy(users, 'role');
const uniqueEmails = unique(users, 'email');
const sorted = sortBy(users, ['role', 'name']);
const total = sum(products, p => p.price * p.qty);
```

### Error Handling
```typescript
import { 
  handleAsync, 
  retry, 
  AppError,
  ValidationError 
} from '@/utils/error';

const [data, error] = await handleAsync(api.fetch());
const data = await retry(() => api.fetch(), { maxAttempts: 3 });
throw new ValidationError('Invalid data', { email: 'Required' });
```

### Validation
```typescript
import { 
  isValidEmail, 
  isStrongPassword,
  isValidImage,
  hasValidLength 
} from '@/utils/validation';

if (!isValidEmail(email)) setError('Invalid email');
if (!isStrongPassword(pw)) setError('Weak password');
if (!isValidImage(file, 5)) setError('Invalid image');
```

---

## 📋 Common Patterns

### Pattern 1: Data Table Page
```typescript
import { useDataTable, useAsyncAction } from '@/hooks';
import { withLoading, withErrorBoundary } from '@/components/hoc';

function UsersPage() {
  const table = useDataTable<User>({ pageSize: 20 });
  
  const fetchUsers = useAsyncAction(async () => {
    return api.getUsers({
      filters: table.filters,
      search: table.debouncedSearchTerm,
      page: table.pagination.page,
    });
  });

  useEffect(() => {
    fetchUsers.execute();
  }, [table.filters, table.debouncedSearchTerm, table.pagination.page]);

  return (
    <DataTable
      data={fetchUsers.data}
      onSort={table.toggleSort}
      onPageChange={table.setPage}
      selectedItems={table.selectedItems}
      onSelect={table.toggleItem}
    />
  );
}

export default withErrorBoundary(
  withLoading(UsersPage, {
    checkEmpty: (props) => !props.data?.length,
  })
);
```

### Pattern 2: Form with Validation
```typescript
import { useFormState, useFormHandlers } from '@/hooks';
import { useMutation } from '@/hooks';
import { validateForm } from '@/utils/form';
import { isValidEmail } from '@/utils/validation';

function UserForm() {
  const form = useFormState({ name: '', email: '', role: '' });
  const handlers = useFormHandlers(form);
  
  const [createUser, { loading }] = useMutation(
    async (data) => api.createUser(data),
    {
      onSuccess: () => toast.success('User created'),
      onError: (error) => toast.error(error.message),
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(form.data, {
      name: [{ rule: 'required', message: 'Name required' }],
      email: [
        { rule: 'required', message: 'Email required' },
        { rule: 'email', message: 'Invalid email' },
      ],
    });

    if (Object.keys(errors).length > 0) {
      form.setErrors(errors);
      return;
    }

    await createUser(form.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handlers.handleChange} />
      {form.errors.name && <span>{form.errors.name}</span>}
      
      <input name="email" onChange={handlers.handleChange} />
      {form.errors.email && <span>{form.errors.email}</span>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Pattern 3: Modal with Data
```typescript
import { useModalWithData } from '@/hooks';

function UserList() {
  const editModal = useModalWithData<User>();
  const deleteModal = useModalWithData<User>();

  return (
    <>
      <table>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <button onClick={() => editModal.openWith(user)}>Edit</button>
              <button onClick={() => deleteModal.openWith(user)}>Delete</button>
            </td>
          </tr>
        ))}
      </table>

      <Dialog open={editModal.isOpen} onOpenChange={editModal.close}>
        {editModal.data && <UserEditForm user={editModal.data} />}
      </Dialog>

      <AlertDialog open={deleteModal.isOpen} onOpenChange={deleteModal.close}>
        <p>Delete {deleteModal.data?.name}?</p>
        <button onClick={() => handleDelete(deleteModal.data!.id)}>
          Confirm
        </button>
      </AlertDialog>
    </>
  );
}
```

### Pattern 4: Protected Route
```typescript
import { withAuth, withErrorBoundary } from '@/components/hoc';

function AdminDashboard() {
  return <div>Admin Content</div>;
}

export default withErrorBoundary(
  withAuth(AdminDashboard, {
    redirectTo: '/login',
    requireRoles: ['admin'],
  })
);
```

---

## ⚡ Performance Tips

1. **Always memoize callbacks**
   ```typescript
   const handleClick = useCallback(() => {
     // handler
   }, [dependencies]);
   ```

2. **Use debouncing for search**
   ```typescript
   const table = useDataTable();
   // table.debouncedSearchTerm is auto-debounced (300ms)
   ```

3. **Memoize expensive computations**
   ```typescript
   const filtered = useMemo(() => 
     data.filter(item => item.active),
     [data]
   );
   ```

4. **Use React.memo for pure components**
   ```typescript
   export default React.memo(UserCard);
   ```

---

## 🚫 Common Mistakes

### ❌ Don't do this
```typescript
// Manual state when hook exists
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Manual debouncing
useEffect(() => {
  const timer = setTimeout(() => setDebounced(value), 300);
  return () => clearTimeout(timer);
}, [value]);

// Inline functions in render
<button onClick={() => handleDelete(item.id)}>Delete</button>
```

### ✅ Do this
```typescript
// Use async action hook
const deleteItem = useAsyncAction(api.deleteItem);

// Use debounce hook
const debouncedValue = useDebounce(value, 300);

// Memoize callbacks
const handleDelete = useCallback((id) => {
  deleteItem.execute(id);
}, []);
```

---

## 📦 Import Cheatsheet

```typescript
// Hooks
import { 
  useDataTable, 
  useModal, 
  useModalWithData,
  useFormState,
  useFormHandlers,
  useAsyncAction,
  useMutation,
  useDebounce,
  useMounted,
} from '@/hooks';

// HOCs
import { 
  withAuth, 
  withLoading, 
  withErrorBoundary 
} from '@/components/hoc';

// Utilities
import { 
  groupBy, 
  unique, 
  sum 
} from '@/utils/array';

import { 
  validateForm, 
  createFormHandler 
} from '@/utils/form';

import { 
  handleAsync, 
  retry 
} from '@/utils/error';

import { 
  isValidEmail, 
  isStrongPassword 
} from '@/utils/validation';
```

---

## 🔗 Related Files

- `REFACTORING_PHASE_1-3_COMPLETE.md` - Full implementation details
- `FRONTEND_REFACTORING_PLAN.md` - Complete refactoring plan
- `hooks/index.ts` - All hook exports
- `components/hoc/index.ts` - All HOC exports
- `utils/index.ts` - All utility exports
