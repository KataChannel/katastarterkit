# Google Sheets-Style Column Filter - Visual Guide

## UI Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Advanced Table                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Global Search: [________________]  [+ Add Filter]      │ │
│ │  Active Filters: [Status: Active, Pending] [×]          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌────────┬────────────┬────────────┬─────────────────────┐ │
│ │   ID ▼ │  Name ▼ 🔍¹│ Status ▼ 🔍│  Role ▼ 🔍²        │ │ ← Column Headers
│ ├────────┼────────────┼────────────┼─────────────────────┤ │
│ │   1    │  John Doe  │  Active    │  Admin              │ │
│ │   2    │  Jane      │  Pending   │  User               │ │
│ │   3    │  Bob       │  Active    │  Manager            │ │
│ └────────┴────────────┴────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

¹ 🔍 = Filter icon (appears on hover)
² 🔍² = Filter icon blue with badge "2" (active filters)
```

## Filter Popover States

### 1. Inactive State (Hover)
```
┌──────────────┐
│  Name ▼ 🔍   │  ← Filter icon appears on hover
└──────────────┘
     ↓
   [Hover]
     ↓
┌──────────────┐
│  Name ▼ 🔍   │  ← Icon visible, gray color
└──────────────┘
```

### 2. Active State (Filters Applied)
```
┌──────────────────┐
│  Status ▼ 🔍 ②  │  ← Blue icon with badge "2"
└──────────────────┘
                    (Always visible, not just on hover)
```

### 3. Filter Popover (Open)
```
┌──────────────────┐
│  Status ▼ 🔍 ②  │  ← Column Header
└─────────┬────────┘
          │
          ▼
┌────────────────────────────────────┐
│  Search values                     │
│  [________________] 🔍             │
│                                    │
│  Sort: [A→Z] [Z→A]                │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ ☑ Select All  ☐ Deselect All│ │
│  ├──────────────────────────────┤ │
│  │ ☑ Active         (125)       │ │ ← Checked
│  │ ☑ Pending        (43)        │ │ ← Checked
│  │ ☐ Inactive       (12)        │ │ ← Unchecked
│  │ ☐ Suspended      (5)         │ │
│  └──────────────────────────────┘ │
│                                    │
│  Selected: 2 | Visible: 4 | Total: 4│
│                                    │
│  [Apply] [Clear] [Cancel]         │
└────────────────────────────────────┘
```

## User Interaction Flow

```
Start
  │
  ▼
Hover over Column Header
  │
  ▼
Filter Icon Appears 🔍
  │
  ▼
Click Filter Icon
  │
  ▼
┌─────────────────────────────────────┐
│      Popover Opens                  │
│  - Shows all unique values          │
│  - Loads current selections         │
│  - Shows search box                 │
└─────────────────────────────────────┘
  │
  ├─→ Search Values ────→ Values filtered in real-time
  │
  ├─→ Check/Uncheck ────→ selectedValues updates
  │
  ├─→ Select All ───────→ All values checked
  │
  ├─→ Deselect All ─────→ All values unchecked
  │
  ├─→ Sort A→Z/Z→A ─────→ Column sorts, popover stays open
  │
  ▼
User Actions:
  │
  ├─→ Click Apply ──────→ Filter activates
  │                       │
  │                       ├→ Popover closes
  │                       ├→ Icon turns blue
  │                       ├→ Badge shows count
  │                       ├→ Table re-filters
  │                       └→ onFilter callback fires
  │
  ├─→ Click Clear ──────→ All filters for column removed
  │                       │
  │                       ├→ Popover closes
  │                       ├→ Icon returns to gray
  │                       ├→ Badge disappears
  │                       └→ Table updates
  │
  └─→ Click Cancel ─────→ Popover closes, no changes
      (or click outside)
```

## Filter Logic Flow

```
User Selection         →    Filter Creation    →    Data Filtering
─────────────────────────────────────────────────────────────────

Single Value:
☑ Active              →    { field: 'status',  →    data.filter(row =>
                            operator: 'equals',      row.status === 'Active'
                            value: 'Active' }       )

Multiple Values:
☑ Active              →    { field: 'status',  →    data.filter(row =>
☑ Pending                  operator: 'in',          ['Active', 'Pending']
                            value: ['Active',         .includes(row.status)
                                   'Pending'] }      )
```

## Component Architecture

```
AdvancedTable (Parent)
│
├─ State Management
│  ├─ filters: FilterCondition[]
│  ├─ handleAddFilter()
│  ├─ handleRemoveFilter()
│  └─ handleClearColumnFilters()
│
├─ FilterBar (Global Filters)
│  └─ Add Filter Popover
│
└─ renderColumnGroup()
   │
   └─ For each column:
      │
      └─ ColumnHeader
         │
         ├─ Props Received:
         │  ├─ data (all rows)
         │  ├─ activeFilters
         │  ├─ onAddFilter
         │  ├─ onRemoveFilter
         │  └─ onClearColumnFilters
         │
         └─ ColumnFilterPopover
            │
            ├─ Extract unique values from data
            ├─ Show checkboxes
            ├─ Handle user selection
            └─ Call callbacks on Apply/Clear
```

## Filter State Example

```typescript
// Before any filters
filters = []

// After selecting "Active" and "Pending" in Status column
filters = [
  {
    field: 'status',
    operator: 'in',
    value: ['Active', 'Pending']
  }
]

// After also selecting "Admin" in Role column
filters = [
  {
    field: 'status',
    operator: 'in',
    value: ['Active', 'Pending']
  },
  {
    field: 'role',
    operator: 'equals',
    value: 'Admin'
  }
]

// After also adding text filter from FilterBar
filters = [
  {
    field: 'status',
    operator: 'in',
    value: ['Active', 'Pending']
  },
  {
    field: 'role',
    operator: 'equals',
    value: 'Admin'
  },
  {
    field: 'name',
    operator: 'contains',
    value: 'john'
  }
]
```

## Visual States Reference

### Filter Icon States
```
1. Default (Hidden)
   ┌──────────┐
   │  Name ▼  │  No icon visible
   └──────────┘

2. Hover (Inactive)
   ┌──────────────┐
   │  Name ▼ 🔍   │  Gray icon, opacity animated
   └──────────────┘

3. Active (Filters Applied)
   ┌────────────────┐
   │  Name ▼ 🔍 ③  │  Blue icon, badge shows count
   └────────────────┘

4. Active + Hover
   ┌────────────────┐
   │  Name ▼ 🔍 ③  │  Blue icon brightens, badge visible
   └────────────────┘
```

### Badge Display
```
┌─────┐
│  2  │  Active filter count
└─────┘
  ↑
Blue background
White text
Absolute positioned (top-right of icon)
Size: 16x16px
Font: 9px
```

## Responsive Behavior

```
Desktop (> 768px):
┌────────────────────────────────────┐
│ Popover width: 300px               │
│ Max height: 400px                  │
│ Scroll: Vertical only              │
└────────────────────────────────────┘

Tablet (480px - 768px):
┌──────────────────────────────┐
│ Popover width: 280px         │
│ Max height: 350px            │
└──────────────────────────────┘

Mobile (< 480px):
┌────────────────────────┐
│ Popover width: 260px   │
│ Max height: 300px      │
│ Touch-optimized        │
└────────────────────────┘
```

## Color Scheme

```css
/* Inactive State */
Filter Icon: text-gray-500
Hover: opacity-100 from opacity-0
Background: transparent

/* Active State */
Filter Icon: text-blue-600
Background: transparent
Badge Background: bg-blue-600
Badge Text: text-white

/* Popover */
Background: bg-white
Border: border-gray-200
Text: text-gray-900
Hover (checkbox): bg-gray-50

/* Buttons */
Apply: bg-blue-600 text-white
Clear: text-gray-600
Cancel: text-gray-600
```

## Performance Characteristics

```
Operation                Time Complexity    Notes
─────────────────────────────────────────────────────
Extract unique values    O(n)              n = number of rows
Search filter values     O(m)              m = unique values
Check/uncheck            O(1)              Set operations
Apply filter            O(n)              Filter all rows
Clear filter            O(1)              State update only

Memory Usage:
- uniqueValues: O(m)    where m = unique values per column
- selectedValues: O(k)  where k = selected values
- Total: < 1MB for typical datasets
```

---

**Visual Design**: Google Sheets inspired
**Interaction**: Single-click to filter
**Feedback**: Immediate visual response
**Accessibility**: Keyboard navigable, screen reader friendly
