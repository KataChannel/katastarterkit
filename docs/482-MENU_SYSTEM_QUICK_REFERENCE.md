# Dynamic Header Menu - Quick Reference

## What Was Fixed
✅ Backend now returns hierarchical menu data from database  
✅ Frontend can render multi-level dropdown menus  
✅ GraphQL schema updated with MenuHierarchicalDto  

## Files Changed

### Backend (5 files)
```
backend/src/menu/
  ├── dto/
  │   ├── menu-hierarchical.dto.ts .............. NEW ✅
  │   └── index.ts ............................ UPDATED ✅
  ├── repositories/
  │   └── menu.repository.ts .................. UPDATED ✅
  ├── menu.service.ts ......................... UPDATED ✅
  └── menu.resolver.ts ........................ UPDATED ✅
```

### Frontend (0 files)
- Already ready to use! ✅

## Key Methods Added

### Repository
```typescript
findRootsHierarchical(type?: MenuType, depth: number = 3)
  // Loads menu hierarchy recursively
```

### Service
```typescript
getMenusByTypeHierarchical(type: MenuType)
  // Returns MenuHierarchicalDto[] with children
```

### Resolver
```typescript
@Query(() => [MenuHierarchicalDto], { name: 'headerMenus' })
async getHeaderMenus()
```

## GraphQL Query

```graphql
query GetHeaderMenus {
  headerMenus {
    id
    title
    slug
    order
    level
    isActive
    isVisible
    children {
      id
      title
      children { 
        # Level 3 menus
      }
    }
  }
}
```

## Menu Hierarchy Levels

```
Level 1 (Root)
├── Level 2 (Dropdown children)
│   └── Level 3 (Sub-dropdown children)
```

Example:
```
🏠 Trang Chủ
📦 Sản Phẩm (has children)
  ├── Thực phẩm tươi (has children)
  │   ├── Rau xanh
  │   ├── Thịt
  │   └── Cá
  └── Đồ khô
🛒 Giỏ hàng
```

## Frontend Usage

```typescript
// In website-header.tsx
const { data: menuData } = useQuery(GET_HEADER_MENUS);
const headerMenus = menuData?.headerMenus || [];

// Renders automatically:
// - Items with children → Dropdown
// - Items without children → Simple link
```

## Database Menu Structure

```
id          | title          | parentId | level | type   | order
------------|----------------|----------|-------|--------|-------
uuid1       | Sản Phẩm        | NULL     | 1     | HEADER | 0
uuid2       | Thực phẩm tươi  | uuid1    | 2     | HEADER | 0
uuid3       | Rau xanh        | uuid2    | 3     | HEADER | 0
uuid4       | Giỏ hàng        | NULL     | 1     | HEADER | 1
```

## Testing

```bash
# Quick verification
bash test-menu-system.sh

# Full integration test
bash test-menu-integration.sh
```

## Deployment

1. ✅ No database migration needed
2. Deploy backend → GraphQL schema updates
3. Deploy frontend → Uses new query
4. Test header menu in browser

## Troubleshoot

| Problem | Solution |
|---------|----------|
| Query error about `children` | Restart backend server |
| Menu items not showing | Check DB has `isActive=true` and `isVisible=true` |
| Dropdowns don't work | Verify child menus have `parentId` set |
| Performance slow | Reduce depth from 3 to 2 |

## Supported Menus

- ✅ headerMenus - Header navigation
- ✅ footerMenus - Footer navigation  
- ✅ mobileMenus - Mobile navigation
- ✅ sidebarMenus - Sidebar (flat list)

## Important Details

| Item | Value |
|------|-------|
| Max Nesting Depth | 3 levels |
| Root Menu Requirement | `parentId = NULL` |
| Filter by | `isActive = true` AND `isVisible = true` |
| Sort by | `order` field |
| Supported Types | HEADER, FOOTER, MOBILE, SIDEBAR, CUSTOM |

## New DTO Type

```typescript
class MenuHierarchicalDto {
  id: string
  title: string
  slug: string
  order: number
  level: number
  url?: string
  route?: string
  externalUrl?: string
  target: string
  icon?: string
  badge?: string
  isActive: boolean
  isVisible: boolean
  children?: MenuHierarchicalDto[] // ← NEW!
}
```

## Database Migration (Optional)

If menus don't have parent relationships yet:

```sql
-- Add parent-child relationships
UPDATE menus SET parentId = '<parent-uuid>' WHERE id = '<child-uuid>';

-- Update hierarchy levels
UPDATE menus SET level = 1 WHERE parentId IS NULL;
UPDATE menus m1 SET level = 2 
  WHERE parentId IN (SELECT id FROM menus WHERE level = 1);
```

## Files to Review

1. `DYNAMIC_MENU_SYSTEM_COMPLETE.md` - Full details
2. `DYNAMIC_HEADER_MENU_FIX.md` - Technical breakdown
3. `backend/src/menu/dto/menu-hierarchical.dto.ts` - DTO implementation
4. `backend/src/menu/repositories/menu.repository.ts` - Recursive loading
5. `frontend/src/graphql/menu.queries.ts` - GraphQL queries

## Status

✅ **Implementation Complete**  
✅ **All Files Compiled Successfully**  
✅ **Ready for Testing**

---

For detailed information, see: `DYNAMIC_MENU_SYSTEM_COMPLETE.md`
