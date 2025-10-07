# 🚀 Quick Reference: useSearchUsers Dynamic Query

## TL;DR (Too Long; Didn't Read)

✅ **useSearchUsers đã được upgrade lên Dynamic Query System**  
✅ **Backward compatible 100% - Components không cần sửa**  
✅ **Multi-field search, advanced filters, better performance**

---

## 📦 Import

```typescript
import { useSearchUsers } from '@/lib/hooks/useUserManagement';
```

---

## 🎯 Basic Usage

### Simple Search
```typescript
const { users, total, loading, error } = useSearchUsers({
  search: 'john',
  size: 20,
});
```

### With Filters
```typescript
const { users, total, loading } = useSearchUsers({
  search: 'admin',
  roleType: 'ADMIN',
  isActive: true,
  isVerified: true,
  page: 0,
  size: 20,
});
```

### Backward Compatible
```typescript
const { data, loading, error } = useSearchUsers({ search: 'user' });
const users = data?.searchUsers?.users || [];
const total = data?.searchUsers?.total || 0;
```

---

## 📝 Input Parameters

```typescript
interface UserSearchInput {
  search?: string;           // Search trong email, username, firstName, lastName
  roleType?: 'ADMIN' | 'USER' | 'GUEST';
  isActive?: boolean;        // true = active, false = inactive
  isVerified?: boolean;      // true = verified, false = unverified
  createdAfter?: string;     // ISO date string '2024-01-01'
  createdBefore?: string;    // ISO date string '2024-12-31'
  page?: number;             // Default: 0 (first page)
  size?: number;             // Default: 20
  sortBy?: string;           // Default: 'createdAt'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
}
```

---

## 📤 Return Values

### Shorthand (Recommended)
```typescript
const {
  users,      // User[] - Array of users
  total,      // number - Total count
  page,       // number - Current page
  size,       // number - Page size
  totalPages, // number - Total pages
  loading,    // boolean - Loading state
  error,      // ApolloError | undefined
  refetch,    // () => Promise<void>
} = useSearchUsers(input);
```

### Data Object (Backward Compatible)
```typescript
const { data, loading, error } = useSearchUsers(input);

// Access:
data?.searchUsers?.users      // User[]
data?.searchUsers?.total      // number
data?.searchUsers?.page       // number
data?.searchUsers?.size       // number
data?.searchUsers?.totalPages // number
```

---

## 🔍 Search Features

### Multi-Field Search
Tự động tìm trong 4 fields (case-insensitive):
- ✅ email
- ✅ username
- ✅ firstName
- ✅ lastName

```typescript
// Tìm "john" trong tất cả 4 fields
useSearchUsers({ search: 'john' })

// Matches:
// - john@example.com
// - johnsmith
// - John Doe
// - Smith Johnson
```

### Advanced Filters
```typescript
// Admin users only
useSearchUsers({ roleType: 'ADMIN' })

// Active users only
useSearchUsers({ isActive: true })

// Verified users only
useSearchUsers({ isVerified: true })

// Date range (users created trong 2024)
useSearchUsers({
  createdAfter: '2024-01-01',
  createdBefore: '2024-12-31'
})

// Combined filters
useSearchUsers({
  search: 'admin',
  roleType: 'ADMIN',
  isActive: true,
  isVerified: true,
})
```

---

## 📄 Pagination

```typescript
// Page 1 (first 20 users)
useSearchUsers({ page: 0, size: 20 })

// Page 2 (next 20 users)
useSearchUsers({ page: 1, size: 20 })

// Custom page size
useSearchUsers({ page: 0, size: 50 })

// Access pagination info
const { page, size, total, totalPages } = useSearchUsers(input);
```

---

## 🔄 Sorting

```typescript
// Sort by email (ascending)
useSearchUsers({ sortBy: 'email', sortOrder: 'asc' })

// Sort by created date (newest first)
useSearchUsers({ sortBy: 'createdAt', sortOrder: 'desc' })

// Sort by username
useSearchUsers({ sortBy: 'username', sortOrder: 'asc' })
```

---

## ⚙️ Options

### Skip Query Conditionally
```typescript
const { users } = useSearchUsers(
  { search: 'admin' },
  { skip: !isAuthenticated } // Skip if not authenticated
);
```

### Refetch Data
```typescript
const { refetch } = useSearchUsers({ search: 'user' });

// Later...
await refetch(); // Re-fetch with same params
```

---

## 💡 Common Patterns

### Real-time Search with Debounce
```typescript
const [searchInput, setSearchInput] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
  return () => clearTimeout(timer);
}, [searchInput]);

const { users, loading } = useSearchUsers({
  search: debouncedSearch,
  size: 10,
});
```

### Pagination Component
```typescript
const [currentPage, setCurrentPage] = useState(0);

const { users, totalPages, loading } = useSearchUsers({
  search: searchTerm,
  page: currentPage,
  size: 20,
});

// Pagination controls
<button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>
  Previous
</button>
<span>Page {currentPage + 1} of {totalPages}</span>
<button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages - 1}>
  Next
</button>
```

### Filter Panel
```typescript
const [filters, setFilters] = useState({
  search: '',
  roleType: undefined,
  isActive: undefined,
});

const { users, total } = useSearchUsers(filters);

// Update filter
<input onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} />
<select onChange={(e) => setFilters(f => ({ ...f, roleType: e.target.value || undefined }))}>
  <option value="">All Roles</option>
  <option value="ADMIN">Admin</option>
  <option value="USER">User</option>
</select>
```

---

## 🐛 Troubleshooting

### Users không hiển thị?
```typescript
// Check data structure
console.log('Result:', result);
console.log('Users:', result.users);
console.log('Total:', result.total);

// Or
console.log('Data:', result.data?.searchUsers);
```

### Search không hoạt động?
```typescript
// Ensure search term có giá trị
const { users } = useSearchUsers({ 
  search: searchTerm.trim() // Trim whitespace
});

// Check case-insensitive search is working
// "John" should match "john@email.com", "JOHN", etc.
```

### Pagination sai?
```typescript
// Remember: page starts from 0
page: 0 → First page
page: 1 → Second page

// Calculate correctly
const skip = page * size;
```

---

## 📚 Full Documentation

- **Migration Guide:** `/docs/USERSEARCH-DYNAMIC-QUERY-MIGRATION.md`
- **Bug Fix Guide:** `/docs/SEARCHUSERS-BUG-FIX-GUIDE.md`
- **Complete Report:** `/docs/DYNAMIC-QUERY-MIGRATION-COMPLETE.md`
- **Examples:** `/frontend/src/components/examples/UserSearchExamples.tsx`

---

## ✅ Checklist

- [ ] Import hook từ `@/lib/hooks/useUserManagement`
- [ ] Pass search input object
- [ ] Destructure return values (users, total, loading, etc.)
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Implement pagination if needed
- [ ] Add filters if needed
- [ ] Test search functionality

---

## 🎯 Examples

### Admin Users Page
```typescript
const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  const { users, total, totalPages, loading } = useSearchUsers({
    search: searchTerm,
    roleType: roleFilter as any,
    page,
    size: 20,
  });

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      
      <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value || undefined)}>
        <option value="">All Roles</option>
        <option value="ADMIN">Admin</option>
        <option value="USER">User</option>
      </select>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>Total: {total} users</div>
          <table>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.roleType}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div>Page {page + 1} of {totalPages}</div>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Prev</button>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
        </>
      )}
    </div>
  );
};
```

---

**🚀 Ready to use! Happy coding!**
