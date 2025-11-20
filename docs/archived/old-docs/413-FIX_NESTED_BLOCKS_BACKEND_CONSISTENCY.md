# Fix Nested Blocks Backend Consistency

## 🎯 Overview
Fixed backend `page.service.ts` to return consistent nested children structure across all Page CRUD methods, ensuring GraphQL queries return proper nested block hierarchy for editor and frontend rendering.

## 🐛 Problem
**Root Cause:** GraphQL query inconsistency between different page fetching methods
- `getPageById` returned nested block structure (children within children)
- `getHomepage` returned flat blocks array (no nested children)
- `createPage` returned flat blocks array after creation
- `updatePage` returned flat blocks array after update

**Impact:**
- Editor couldn't properly display nested blocks in homepage
- Frontend homepage rendering failed to show Grid within Grid
- Inconsistent data structure between edit and view modes
- Breaking block hierarchy after create/update operations

## ✅ Solution

### Backend Service Layer
**File:** `backend/src/services/page.service.ts`

#### 1. Fixed `findHomepage()` Method
**Changed from:**
```typescript
include: {
  blocks: {
    orderBy: { order: 'asc' }
  }
}
```

**Changed to:**
```typescript
include: {
  blocks: {
    where: { parentId: null }, // Only get root-level blocks
    orderBy: { order: 'asc' },
    include: {
      children: {
        orderBy: { order: 'asc' },
        include: {
          children: {
            orderBy: { order: 'asc' },
            include: {
              children: true // Support up to 4 levels of nesting
            }
          }
        }
      }
    }
  }
}
```

#### 2. Fixed `create()` Method
**Changed from:**
```typescript
include: {
  blocks: {
    orderBy: { order: 'asc' }
  }
}
```

**Changed to:**
```typescript
include: {
  blocks: {
    where: { parentId: null }, // Only get root-level blocks
    orderBy: { order: 'asc' },
    include: {
      children: {
        orderBy: { order: 'asc' },
        include: {
          children: {
            orderBy: { order: 'asc' },
            include: {
              children: true // Support up to 4 levels of nesting
            }
          }
        }
      }
    }
  }
}
```

#### 3. Fixed `update()` Method
**Changed from:**
```typescript
include: {
  blocks: {
    orderBy: { order: 'asc' }
  }
}
```

**Changed to:**
```typescript
include: {
  blocks: {
    where: { parentId: null }, // Only get root-level blocks
    orderBy: { order: 'asc' },
    include: {
      children: {
        orderBy: { order: 'asc' },
        include: {
          children: {
            orderBy: { order: 'asc' },
            include: {
              children: true // Support up to 4 levels of nesting
            }
          }
        }
      }
    }
  }
}
```

## 📋 Method Consistency Matrix

### ✅ Methods Returning Nested Children (4 levels)
| Method | Status | Use Case |
|--------|--------|----------|
| `findById()` | ✅ Already correct | Editor, single page fetch |
| `findBySlug()` | ✅ Already correct | Public page rendering |
| `findHomepage()` | ✅ **FIXED** | Homepage rendering |
| `findBySlugPattern()` | ✅ Already correct | Dynamic pages |
| `create()` | ✅ **FIXED** | After page creation |
| `update()` | ✅ **FIXED** | After page update |
| `duplicate()` | ✅ Inherits from `create()` | Page duplication |

### 📊 Methods Returning Flat Blocks (Performance)
| Method | Status | Reason |
|--------|--------|--------|
| `findMany()` | ✅ Correct | List pagination, preview only |

### 🔧 Block-specific Methods (Return PageBlock)
| Method | Return Type | Notes |
|--------|-------------|-------|
| `addBlock()` | `PageBlock` | Single block creation |
| `updateBlock()` | `PageBlock` | Single block update |
| `deleteBlock()` | `PageBlock` | Single block deletion |
| `updateBlockOrder()` | `PageBlock[]` | Bulk order update |

## 🎯 Key Principles

### 1. Nested Children Structure
```typescript
blocks: {
  where: { parentId: null }, // Only root blocks
  orderBy: { order: 'asc' },
  include: {
    children: { // Level 1
      orderBy: { order: 'asc' },
      include: {
        children: { // Level 2
          orderBy: { order: 'asc' },
          include: {
            children: true // Level 3 (max 4 levels total)
          }
        }
      }
    }
  }
}
```

**Why `parentId: null`?**
- Only fetch root-level blocks initially
- Children loaded via nested `include`
- Prevents duplicate blocks in response
- Maintains proper hierarchy

### 2. Nesting Depth: 4 Levels
```
Page
└── Root Block (parentId: null)
    └── Child Block (Level 1)
        └── Grandchild Block (Level 2)
            └── Great-grandchild Block (Level 3)
```

**Example Use Cases:**
- Grid → Section → Container → Image (4 levels)
- Section → Grid → Column → Text (4 levels)
- Container → Grid → Grid → Button (4 levels)

### 3. Performance Considerations

**List Views (findMany):**
```typescript
include: { blocks: { orderBy: { order: 'asc' } } } // Flat only
```
- Used for page lists, dashboards
- No nested children needed
- Faster query, smaller payload

**Single Page Views (findById, findBySlug, etc):**
```typescript
include: { blocks: { where: { parentId: null }, include: { children: ... } } }
```
- Full nested structure required
- Editor needs complete hierarchy
- Frontend rendering needs nested blocks

## 🧪 Testing

### Test Nested Grid Rendering
1. Create page with nested Grid structure
2. Save and reload in editor
3. Verify all nested blocks display correctly
4. Check homepage renders nested Grid properly

### Test Homepage Query
```graphql
query GetHomepage {
  getHomepage {
    id
    title
    blocks {
      id
      type
      children {
        id
        type
        children {
          id
          type
        }
      }
    }
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "getHomepage": {
      "blocks": [
        {
          "id": "block1",
          "type": "GRID",
          "children": [
            {
              "id": "block2",
              "type": "GRID",
              "children": [
                {
                  "id": "block3",
                  "type": "IMAGE"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

### Test Create/Update Pages
1. Create new page with nested blocks
2. Verify response includes nested children
3. Update page metadata
4. Verify response still includes nested children

## 📚 Related Files

### Frontend
- `frontend/src/graphql/queries/pages.ts` - GraphQL query definitions
- `frontend/src/app/(website)/page.tsx` - Homepage component
- `frontend/src/app/(website)/[slug]/page.tsx` - Dynamic page component
- `frontend/src/components/admin/BlockRenderer.tsx` - Recursive block renderer

### Backend
- `backend/src/services/page.service.ts` - **THIS FILE** - Page CRUD logic
- `backend/src/resolvers/page.resolver.ts` - GraphQL resolvers
- `backend/prisma/schema.prisma` - Database schema with self-relations

## 🔍 Troubleshooting

### Issue: Nested blocks not displaying in editor
**Check:**
1. GraphQL query includes `children { children { children } }`
2. Backend method returns nested structure (not flat)
3. Frontend BlockRenderer has `onUpdateChild`/`onDeleteChild` callbacks

### Issue: Homepage missing nested blocks
**Check:**
1. `findHomepage()` method includes nested children
2. GraphQL `getHomepage` query uses proper fragment
3. Frontend homepage component uses correct query

### Issue: Grid children not rendering
**Check:**
1. GridBlock returns single `<div>` (no Fragment `<>`)
2. No wrapper divs around grid children
3. `isGridChild` prop properly passed to BlockRenderer

## 🎉 Results

### Before Fix
- ❌ Homepage returned flat blocks array
- ❌ Editor couldn't display nested Grid properly
- ❌ Create/Update returned flat structure
- ❌ Inconsistent data between methods

### After Fix
- ✅ All Page methods return nested children (4 levels)
- ✅ Homepage displays nested Grid correctly
- ✅ Editor fully supports nested block hierarchy
- ✅ Consistent data structure across all operations
- ✅ Create/Update preserve nested structure in response

## 📌 Maintenance Notes

### When Adding New Page Methods
**Always use this pattern for methods returning `Page`:**
```typescript
include: {
  blocks: {
    where: { parentId: null },
    orderBy: { order: 'asc' },
    include: {
      children: {
        orderBy: { order: 'asc' },
        include: {
          children: {
            orderBy: { order: 'asc' },
            include: {
              children: true
            }
          }
        }
      }
    }
  }
}
```

### Exception: List Methods
For pagination/list views where full hierarchy not needed:
```typescript
include: { blocks: { orderBy: { order: 'asc' } } } // Flat only
```

---

**Fixed by:** Backend Consistency Update  
**Date:** 2024  
**Related Docs:**
- [FIX_HARDCODED_ADMIN_REDIRECT.md](./FIX_HARDCODED_ADMIN_REDIRECT.md)
- [DRAG_DROP_MAPPING_UPDATE.md](./DRAG_DROP_MAPPING_UPDATE.md)
- Frontend Grid fixes (BlockRenderer, GridBlock)
