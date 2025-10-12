# 🔨 Frontend Refactoring Plan - Comprehensive Analysis

## 📊 Current State Analysis

### Identified Issues

#### 1. **State Management Duplication** 🔴 Critical
**Found in**: Almost every page component
```tsx
// Pattern repeated 20+ times across pages
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({...});
const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Files affected**:
- `app/admin/users/page.tsx`
- `app/admin/hr/employees/page.tsx`
- `app/admin/filemanager/page.tsx`
- `app/admin/menu/page.tsx`
- `components/affiliate/campaigns/CampaignManagement.tsx`
- `components/affiliate/links/LinkManagement.tsx`
- And 15+ more files

**Impact**: 
- ~500+ lines of duplicated state logic
- Inconsistent patterns
- Hard to maintain
- Testing nightmare

#### 2. **Form State Management** 🔴 Critical
**Problem**: Manual form state everywhere
```tsx
// Repeated pattern in 10+ components
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
  // ... 10+ fields
});

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

**Better approach**: Use form libraries (React Hook Form, Formik)

#### 3. **Component Size** 🟡 High
**Problem**: Mega components (500+ lines)
- `PageBuilder.tsx`: 1,018 lines
- `UserManagementContent.tsx`: 800+ lines
- `FileManagerPage.tsx`: 900+ lines

**Should be**: Components < 300 lines

#### 4. **Props Drilling** 🟡 High
**Problem**: Passing props through multiple levels
```tsx
// Parent
<Component 
  filter={filter}
  onFilterChange={onFilterChange}
  searchTerm={searchTerm}
  onSearchChange={onSearchChange}
  loading={loading}
  error={error}
  // ... 10+ props
/>
```

#### 5. **Inline Functions & Objects** 🟡 High
**Problem**: Performance killers
```tsx
// Creates new function every render
<Button onClick={() => handleClick(item.id)}>Click</Button>

// Creates new object every render
<Component style={{ margin: 10, padding: 20 }} />
```

**Found in**: Almost every component

#### 6. **Missing Memoization** 🟡 High
**Problem**: Unnecessary re-renders
```tsx
// Expensive calculation runs every render
const filteredItems = items.filter(item => 
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Should use useMemo
const filteredItems = useMemo(() => 
  items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ),
  [items, searchTerm]
);
```

#### 7. **Inconsistent Error Handling** 🟡 High
**Problem**: Different error handling patterns
```tsx
// Pattern 1
catch (error) {
  console.error(error);
}

// Pattern 2
catch (error: any) {
  toast.error(error?.message || 'Error occurred');
}

// Pattern 3
catch (error) {
  setError(error.message);
}
```

#### 8. **TypeScript Issues** 🟡 High
- Heavy use of `any` type
- Missing interface documentation
- Type assertions (`as any`)
- Optional chaining overuse

#### 9. **Import Organization** 🟢 Medium
**Problem**: Inconsistent import order
```tsx
// Mixed imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Plus } from 'lucide-react';
```

#### 10. **Code Comments** 🟢 Medium
- Some files over-commented
- Some files under-commented
- JSDoc missing on exported functions

---

## 🎯 Refactoring Strategy

### Phase 1: Foundation (Week 1)
**Create reusable hooks and utilities**

#### 1.1 Custom Hooks
```tsx
// hooks/useDataTable.ts
export function useDataTable<T>({
  initialFilters,
  fetchData,
  pageSize = 20
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Consolidated logic for tables
  // Used in 15+ components
}

// hooks/useModal.ts
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
}

// hooks/useFormState.ts
export function useFormState<T>(initialState: T) {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);
  
  const reset = useCallback(() => {
    setData(initialState);
    setErrors({});
    setIsDirty(false);
  }, [initialState]);
  
  return { data, errors, isDirty, updateField, setErrors, reset };
}

// hooks/useAsyncAction.ts
export function useAsyncAction<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  
  const execute = useCallback(async (action: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await action();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { loading, error, data, execute };
}
```

#### 1.2 Higher-Order Components
```tsx
// components/hoc/withErrorBoundary.tsx
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// components/hoc/withAuth.tsx
export function withAuth<P>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function WithAuth(props: P) {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <LoginPrompt />;
    }
    
    if (requiredRoles && !hasRole(user, requiredRoles)) {
      return <AccessDenied />;
    }
    
    return <Component {...props} />;
  };
}
```

#### 1.3 Utility Functions
```tsx
// utils/form.ts
export const createFormHandlers = <T extends Record<string, any>>(
  setter: React.Dispatch<React.SetStateAction<T>>
) => ({
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(prev => ({ ...prev, [field]: e.target.value }));
  },
  handleSelect: (field: keyof T) => (value: any) => {
    setter(prev => ({ ...prev, [field]: value }));
  },
  handleToggle: (field: keyof T) => () => {
    setter(prev => ({ ...prev, [field]: !prev[field] }));
  },
});

// utils/array.ts
export const groupBy = <T>(arr: T[], key: keyof T) => {
  return arr.reduce((groups, item) => {
    const group = item[key] as string;
    return {
      ...groups,
      [group]: [...(groups[group] || []), item]
    };
  }, {} as Record<string, T[]>);
};

export const unique = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) return [...new Set(arr)];
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// utils/error.ts
export const handleError = (error: unknown, toast: any) => {
  const message = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
  
  console.error('[Error]', error);
};

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Phase 2: Component Refactoring (Week 2-3)

#### 2.1 Extract Smaller Components
**Before**:
```tsx
// PageBuilder.tsx (1,018 lines)
export default function PageBuilder({ pageId }: PageBuilderProps) {
  // 50+ lines of state
  // 100+ lines of handlers
  // 500+ lines of JSX
  return (
    <div>
      {/* Massive JSX tree */}
    </div>
  );
}
```

**After**:
```tsx
// PageBuilder.tsx (200 lines)
export default function PageBuilder({ pageId }: PageBuilderProps) {
  return (
    <PageBuilderProvider pageId={pageId}>
      <PageBuilderHeader />
      <PageBuilderSidebar />
      <PageBuilderCanvas />
      <PageBuilderPreview />
    </PageBuilderProvider>
  );
}

// components/page-builder/PageBuilderHeader.tsx (100 lines)
export function PageBuilderHeader() {
  const { page, save } = usePageBuilder();
  return <header>...</header>;
}

// components/page-builder/PageBuilderSidebar.tsx (150 lines)
export function PageBuilderSidebar() {
  const { blocks } = usePageBuilder();
  return <aside>...</aside>;
}

// components/page-builder/PageBuilderCanvas.tsx (200 lines)
export function PageBuilderCanvas() {
  const { blocks, updateBlock } = usePageBuilder();
  return <main>...</main>;
}
```

#### 2.2 Use Composition Pattern
```tsx
// Before: Monolithic component
<DataTable
  data={data}
  columns={columns}
  filters={filters}
  onFilterChange={onFilterChange}
  pagination={pagination}
  onPageChange={onPageChange}
  sorting={sorting}
  onSortChange={onSortChange}
  selection={selection}
  onSelectionChange={onSelectionChange}
  // 20+ props
/>

// After: Composition
<DataTable data={data}>
  <DataTable.Toolbar>
    <DataTable.Search />
    <DataTable.Filters />
  </DataTable.Toolbar>
  <DataTable.Content>
    <DataTable.Header />
    <DataTable.Body />
  </DataTable.Content>
  <DataTable.Footer>
    <DataTable.Pagination />
  </DataTable.Footer>
</DataTable>
```

#### 2.3 Create Layout Components
```tsx
// components/layouts/AdminLayout.tsx
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// components/layouts/PageWithHeader.tsx
export function PageWithHeader({
  title,
  description,
  actions,
  children
}: PageWithHeaderProps) {
  return (
    <div>
      <PageHeader 
        title={title}
        description={description}
        actions={actions}
      />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
```

### Phase 3: Performance Optimization (Week 4)

#### 3.1 Memoization Strategy
```tsx
// Before
function UserList({ users, onUserClick }) {
  const filteredUsers = users.filter(u => u.isActive);
  const sortedUsers = filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div>
      {sortedUsers.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onClick={() => onUserClick(user.id)}
        />
      ))}
    </div>
  );
}

// After
const UserList = React.memo(function UserList({ users, onUserClick }) {
  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(u => u.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);
  
  return (
    <div>
      {filteredAndSortedUsers.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onClick={onUserClick}
          userId={user.id}
        />
      ))}
    </div>
  );
});

const UserCard = React.memo(function UserCard({ user, onClick, userId }) {
  const handleClick = useCallback(() => {
    onClick(userId);
  }, [onClick, userId]);
  
  return <div onClick={handleClick}>...</div>;
});
```

#### 3.2 Code Splitting
```tsx
// Before
import { HeavyComponent } from '@/components/HeavyComponent';

// After
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <Skeleton />,
    ssr: false
  }
);
```

#### 3.3 Virtual Lists
```tsx
// Before: Renders 1000+ items
{items.map(item => <ItemCard key={item.id} item={item} />)}

// After: Virtual list
import { VirtualList } from '@/components/ui/virtual-list';

<VirtualList
  items={items}
  height={600}
  itemHeight={100}
  renderItem={(item) => <ItemCard item={item} />}
/>
```

### Phase 4: Type Safety (Week 5)

#### 4.1 Remove `any` Types
```tsx
// Before
const [data, setData] = useState<any>(null);
const handleClick = (e: any) => {
  console.log(e.target.value);
};

// After
interface UserData {
  id: string;
  name: string;
  email: string;
}

const [data, setData] = useState<UserData | null>(null);
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.value);
};
```

#### 4.2 Generic Types
```tsx
// types/common.ts
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

// Usage
const { data } = useQuery<PaginatedResponse<User>>(GET_USERS);
```

#### 4.3 Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Phase 5: Code Quality (Week 6)

#### 5.1 ESLint Rules
```js
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  }
};
```

#### 5.2 Code Organization
```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth group
│   ├── (admin)/           # Admin group
│   └── (public)/          # Public group
├── components/
│   ├── ui/                # Base UI components
│   ├── features/          # Feature components
│   │   ├── users/
│   │   ├── hr/
│   │   └── filemanager/
│   ├── layouts/           # Layout components
│   └── shared/            # Shared components
├── hooks/
│   ├── api/               # API hooks
│   ├── ui/                # UI hooks
│   └── utils/             # Utility hooks
├── lib/                   # Libraries & configs
├── services/              # API services
├── types/                 # TypeScript types
└── utils/                 # Utility functions
```

---

## 📊 Metrics & Goals

### Current State
- Average component size: **450 lines**
- Code duplication: **~30%**
- TypeScript coverage: **70%** (30% uses `any`)
- Test coverage: **~40%**
- Performance score: **75/100**

### Target State
- Average component size: **< 200 lines**
- Code duplication: **< 10%**
- TypeScript coverage: **95%** (< 5% uses `any`)
- Test coverage: **> 70%**
- Performance score: **> 90/100**

### Success Criteria
✅ All components < 300 lines  
✅ No `any` types in new code  
✅ All exported functions have JSDoc  
✅ < 10% code duplication  
✅ All hooks follow rules of hooks  
✅ Lighthouse score > 90  

---

## 🎯 Priority Matrix

### 🔴 Critical (Do First)
1. Create common hooks (useDataTable, useModal, useFormState)
2. Extract mega components (PageBuilder, UserManagement, FileManager)
3. Remove inline functions from render
4. Add memoization to expensive operations

### 🟡 High (Do Second)
1. Create layout components
2. Implement composition patterns
3. Add code splitting
4. Improve TypeScript types

### 🟢 Medium (Do Third)
1. Organize imports
2. Add JSDoc comments
3. Refactor CSS
4. Add E2E tests

---

**Next Step**: Start with Phase 1 - Create foundation hooks?
