# Menu Management System - User Guide

## 🎯 Features Implemented

### 1. **Hierarchical Menu Structure**
- ✅ Create parent menus (root level)
- ✅ Create child menus (submenu)
- ✅ Support unlimited nesting levels
- ✅ Visual tree structure with expand/collapse

### 2. **Drag & Drop Reordering**
- ✅ Drag any menu item to change display order
- ✅ Visual feedback during drag (ghost overlay)
- ✅ Auto-save new order to database
- ✅ Works for both parent and child menus

### 3. **Drag & Drop Level Change**
- ✅ Drag child menu to root level (remove parent)
- ✅ Drag root menu under another menu (add parent)
- ✅ Drag between different parent menus
- ✅ Automatic level recalculation

## 📋 How to Use

### Creating a New Menu

1. **Click "Create Menu" button**
2. **Fill in the form:**
   - **Title**: Display name (e.g., "Dashboard")
   - **Slug**: URL-friendly identifier (e.g., "dashboard")
   - **Description**: Optional description
   - **Type**: SIDEBAR, HEADER, FOOTER, MOBILE, or CUSTOM
   - **Parent Menu**: Select parent for submenu, or "None" for root level
   - **Order**: Display position (lower numbers appear first)
   - **Internal Route**: Next.js route (e.g., "/admin/dashboard")
   - **External URL**: Full URL for external links
   - **Icon**: Lucide icon name (e.g., "LayoutDashboard")
   - **Toggles**: Active, Visible, Public

3. **Click "Create Menu"**

### Editing a Menu

1. **Click the Pencil icon** on any menu row
2. **Update fields** (including changing parent)
3. **Click "Update Menu"**

### Reordering Menus (Drag & Drop)

#### Method 1: Change Display Order
1. **Click and hold** the grip icon (⋮⋮) on any menu
2. **Drag up or down** to desired position
3. **Release** - order saves automatically

#### Method 2: Change Menu Level
1. **Drag a child menu** to the top section
2. **Release** - it becomes a root menu

OR

1. **Drag a root menu** onto another menu
2. **Release** - it becomes a child of that menu

### Expanding/Collapsing Tree

- Click **chevron icon** (▶ or ▼) to expand/collapse children
- Expanded state persists during session

### Quick Actions

- **Power Icon**: Toggle Active/Inactive
- **Eye Icon**: Toggle Visible/Hidden
- **Pencil Icon**: Edit menu
- **Trash Icon**: Delete menu (only if not protected)

## 🔑 Key Concepts

### Menu Hierarchy

```
Root Menu 1 (parentId: null)
├── Child Menu 1.1 (parentId: Root1.id)
│   └── Grandchild 1.1.1 (parentId: Child1.1.id)
└── Child Menu 1.2 (parentId: Root1.id)

Root Menu 2 (parentId: null)
```

### Order Field

- **Lower number** = appears first
- Example: order=0 displays before order=1
- Drag & drop automatically updates order values

### Menu Types

- **SIDEBAR**: Left/right navigation panel
- **HEADER**: Top navigation bar
- **FOOTER**: Bottom links
- **MOBILE**: Mobile-specific menu
- **CUSTOM**: Special use cases

### Parent Menu Selection

- **None (Root Level)**: Top-level menu
- **Select Parent**: Creates submenu under selected parent
- **Cannot select self as parent** (prevented in edit mode)

## 🎨 Visual Indicators

| Icon | Meaning |
|------|---------|
| ⋮⋮ | Drag handle (grab to reorder) |
| ▶ | Collapsed (click to expand) |
| ▼ | Expanded (click to collapse) |
| 🔗 | Has external URL |
| 🔒 | Protected (cannot delete) |

## 💡 Best Practices

### 1. Logical Hierarchy
```
✅ Good:
Admin
├── Users
├── Settings
└── Reports

❌ Avoid:
Users
├── Dashboard  (unrelated)
```

### 2. Order Numbers
- Use increments of 10 (0, 10, 20...) to leave room for insertions
- Drag & drop will auto-adjust

### 3. Icon Naming
- Use exact Lucide icon names
- Examples: `LayoutDashboard`, `Users`, `Settings`, `FileText`
- See: https://lucide.dev/icons

### 4. Route vs URL
- **route**: Internal Next.js path (`/admin/users`)
- **url**: External link (`https://example.com`)
- Don't use both - pick one

## 🚀 Advanced Usage

### Creating Multi-Level Navigation

1. **Create root menus** first (Parent: None)
2. **Create children** selecting parent
3. **Create grandchildren** selecting child as parent
4. **Drag to reorganize** structure

### Bulk Reordering

1. **Expand all** relevant sections
2. **Drag items** to desired positions
3. Changes save automatically
4. Refresh to see updated tree

### Moving Between Parents

**Scenario**: Move "Reports" from "Analytics" to "Admin"

1. **Expand both** "Analytics" and "Admin"
2. **Drag "Reports"** from Analytics section
3. **Drop onto** "Admin" row
4. OR use **Edit dialog** to change parent

## 🔧 Troubleshooting

### Menu Not Appearing in Sidebar

**Check:**
- ✅ `isActive = true`
- ✅ `isVisible = true`
- ✅ `type = SIDEBAR`
- ✅ User has required role/permission
- ✅ `href` or `route` is set

### Drag Not Working

**Solutions:**
- Click precisely on grip icon (⋮⋮)
- Don't click on text or other buttons
- Ensure menu list is not loading
- Try refresh if state is stale

### Parent Menu Not Showing

**Reasons:**
- Not expanded - click chevron to expand
- Filtered out - check search/type filters
- No children - parent needs at least one child

### Order Changes Not Saving

**Debug:**
- Check console for errors
- Verify database connection
- Ensure user has permission to update
- Try manual edit instead of drag

## 📊 Database Schema

```prisma
model Menu {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  parentId    String?  // NULL = root, UUID = child
  parent      Menu?    @relation("MenuHierarchy", fields: [parentId])
  children    Menu[]   @relation("MenuHierarchy")
  order       Int      @default(0)
  type        String   // SIDEBAR, HEADER, etc.
  route       String?
  url         String?
  icon        String?
  isActive    Boolean  @default(true)
  isVisible   Boolean  @default(true)
  isPublic    Boolean  @default(false)
  isProtected Boolean  @default(false)
}
```

## 🎓 Example Workflows

### Workflow 1: Create Admin Sidebar

1. Create "Dashboard" (root, order=0)
2. Create "Users" (root, order=10)
3. Create "User List" (parent=Users, order=0)
4. Create "Add User" (parent=Users, order=10)
5. Create "Settings" (root, order=20)

Result:
```
Dashboard
Users
├── User List
└── Add User
Settings
```

### Workflow 2: Reorganize Existing

Drag "User Permissions" from "Settings" to "Users":
1. Expand both "Settings" and "Users"
2. Drag "User Permissions" row
3. Drop onto "Users" row
4. Verify parentId updated in database

### Workflow 3: Change Display Order

Make "Settings" appear before "Users":
1. Drag "Settings" row upward
2. Drop above "Users" row
3. Order auto-updates (Settings=0, Users=10)

## 🎉 Summary

You now have a fully functional hierarchical menu management system with:

- ✅ **Visual tree structure** with expand/collapse
- ✅ **Drag & drop reordering** with visual feedback
- ✅ **Drag & drop level changes** (parent ↔ child)
- ✅ **Parent menu selection** in create/edit forms
- ✅ **Automatic order management**
- ✅ **Real-time database sync**

Enjoy managing your menus! 🚀
