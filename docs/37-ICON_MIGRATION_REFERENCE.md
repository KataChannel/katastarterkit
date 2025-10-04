# Icon Migration Reference - Heroicons to Lucide React

## Complete Icon Mapping

This document provides the complete mapping from Heroicons to Lucide React icons for the migration.

### Common Icons

| Heroicons (`@heroicons/react/24/outline`) | Lucide React (`lucide-react`) |
|-------------------------------------------|-------------------------------|
| `XMarkIcon` | `X` |
| `PlusIcon` | `Plus` |
| `PencilIcon` | `Pencil` |
| `TrashIcon` | `Trash2` |
| `EyeIcon` | `Eye` |
| `EyeSlashIcon` | `EyeOff` |
| `MagnifyingGlassIcon` | `Search` |
| `UserIcon` | `User` |
| `UsersIcon` | `Users` |
| `ShieldCheckIcon` | `ShieldCheck` |
| `KeyIcon` | `Key` |
| `DocumentDuplicateIcon` | `Copy` |
| `PlayIcon` | `Play` |
| `ShareIcon` | `Share` |
| `FolderIcon` | `Folder` |
| `HeartIcon` (outline) | `Heart` |

### Solid Icons

| Heroicons (`@heroicons/react/24/solid`) | Lucide React (`lucide-react`) |
|-----------------------------------------|-------------------------------|
| `HeartIcon` (solid) | `Heart` with `fill="currentColor"` |

## Files to Update (18 total)

### 1. RBAC Components (15 files)

#### `RbacManagement.tsx`
```diff
- import { UsersIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';
+ import { Users, ShieldCheck, Key } from 'lucide-react';
```

#### `UserRolePermissionModal.tsx`
```diff
- import { XMarkIcon, UserIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';
+ import { X, User, ShieldCheck, Key } from 'lucide-react';
```

#### `RoleManagement.tsx`
```diff
- import { PlusIcon, PencilIcon, TrashIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
+ import { Plus, Pencil, Trash2, Users, ShieldCheck } from 'lucide-react';
```

#### `CreateRoleModal.tsx`
```diff
- import { XMarkIcon } from '@heroicons/react/24/outline';
+ import { X } from 'lucide-react';
```

#### `EditRoleModal.tsx`
```diff
- import { XMarkIcon } from '@heroicons/react/24/outline';
+ import { X } from 'lucide-react';
```

#### `AssignRolePermissionsModal.tsx`
```diff
- import { XMarkIcon } from '@heroicons/react/24/outline';
+ import { X } from 'lucide-react';
```

#### `PermissionManagement.tsx`
```diff
- import { PlusIcon, PencilIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
+ import { Plus, Pencil, Trash2, Key } from 'lucide-react';
```

#### `CreatePermissionModal.tsx`
```diff
- import { XMarkIcon } from '@heroicons/react/24/outline';
+ import { X } from 'lucide-react';
```

#### `EditPermissionModal.tsx`
```diff
- import { XMarkIcon } from '@heroicons/react/24/outline';
+ import { X } from 'lucide-react';
```

#### `UserRoleAssignment.tsx`
```diff
- import { MagnifyingGlassIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
+ import { Search, User, ShieldCheck } from 'lucide-react';
```

### 2. Auth Pages (2 files)

#### `login/page.tsx`
```diff
- import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
+ import { Eye, EyeOff } from "lucide-react";
```

#### `register/page.tsx`
```diff
- import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
+ import { Eye, EyeOff } from 'lucide-react';
```

### 3. Todo Components (2 files)

#### `TaskFilters.tsx`
```diff
- import { XMarkIcon } from '@heroicons/react/24/outline';
+ import { X } from 'lucide-react';
```

#### `DynamicTaskDemo.tsx`
```diff
- import { PlusIcon, DocumentDuplicateIcon, PlayIcon } from '@heroicons/react/24/outline';
+ import { Plus, Copy, Play } from 'lucide-react';
```

### 4. Admin Pages (1 file)

#### `admin/todos/page.tsx`
```diff
- import { PlusIcon, ShareIcon, FolderIcon } from '@heroicons/react/24/outline';
+ import { Plus, Share, Folder } from 'lucide-react';
```

### 5. Posts Component (1 file)

#### `post-list.tsx`
```diff
- import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
+ import { Heart } from 'lucide-react';

// Update usage:
- <HeartSolidIcon className="h-5 w-5" />
+ <Heart fill="currentColor" className="h-5 w-5" />
```

## Component Name Changes

### Size Props
Heroicons use className for sizing, Lucide icons have same pattern:
```tsx
// Both work the same
<Icon className="h-5 w-5" />
```

### Filled Icons
```tsx
// Heroicons solid
import { HeartIcon } from '@heroicons/react/24/solid';
<HeartIcon className="h-5 w-5" />

// Lucide
import { Heart } from 'lucide-react';
<Heart fill="currentColor" className="h-5 w-5" />
```

## Installation

Lucide React is already installed in package.json:
```json
"lucide-react": "^0.544.0"
```

## Testing Checklist

After migration, test:
- [ ] All RBAC pages load correctly
- [ ] Login/Register forms show eye icons
- [ ] Todo filters work
- [ ] Admin pages render correctly
- [ ] Post likes show filled heart icon
- [ ] All icon sizes match original
- [ ] Icon colors inherit correctly

## Benefits of Lucide React

1. **Consistent Design**: All icons from same family
2. **Tree-shakeable**: Only imports used icons
3. **Customizable**: Easy to adjust stroke-width, size, color
4. **TypeScript**: Full TypeScript support
5. **Accessibility**: Better ARIA support
6. **Modern**: Actively maintained, shadcn/ui standard

## Notes

- Lucide React is the recommended icon library for shadcn/ui
- All icons are now imported from a single package
- Icon names are more semantic (e.g., `EyeOff` vs `EyeSlashIcon`)
- Lucide has 1000+ icons vs Heroicons' 200+
- Better performance due to tree-shaking

---

**Created:** October 3, 2025  
**Status:** Reference for migration
