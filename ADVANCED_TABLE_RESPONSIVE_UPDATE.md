# AdvancedTable Responsive & Column Settings Updates

## 📅 Ngày cập nhật: 2025-10-10

## 🎯 Tổng quan

Đã cập nhật AdvancedTable với 2 tính năng mới:
1. **Column Settings**: Thêm nút "Show All" / "Hide All"
2. **Responsive Design**: Tối ưu cho mobile, tablet, desktop

## ✨ Feature 1: Column Settings - Select All/Deselect All

### Trước khi cập nhật:
```
Column Settings Dialog:
- ☑️ Column 1
- ☑️ Column 2
- ☑️ Column 3
[Reset] [Done]
```

### Sau khi cập nhật:
```
Column Settings Dialog:
[👁️ Show All] [👁️‍🗨️ Hide All]  ← NEW!
────────────────────────
- ☑️ Column 1
- ☑️ Column 2
- ☑️ Column 3
[Reset] [Done]
```

### Implementation Details:

#### Buttons Added:
```typescript
// Show All Columns
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    setColumns(prev => prev.map(col => ({ ...col, hide: false })));
  }}
>
  <Eye className="w-4 h-4 mr-1" />
  Show All
</Button>

// Hide All Columns
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    setColumns(prev => prev.map(col => ({ ...col, hide: true })));
  }}
>
  <EyeOff className="w-4 h-4 mr-1" />
  Hide All
</Button>
```

#### Features:
- ✅ **Show All**: Un-hide tất cả các cột cùng lúc
- ✅ **Hide All**: Ẩn tất cả các cột cùng lúc
- ✅ **Quick Toggle**: Nhanh chóng reset visibility
- ✅ **Visual Icons**: Eye/EyeOff icons rõ ràng
- ✅ **Positioned Top**: Ở đầu dialog, dễ truy cập

#### Use Cases:
1. **Debug Mode**: Show All để xem tất cả dữ liệu
2. **Clean View**: Hide All rồi chỉ show cột cần thiết
3. **Quick Reset**: Thay vì click từng checkbox

## 🎨 Feature 2: Responsive Design

### Responsive Breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm-md)
- **Desktop**: > 1024px (lg+)

### 2.1 Toolbar - Responsive

#### Desktop (> 640px):
```
[Selected: 5] [Delete]    [Export] [Auto Size All] [Columns]
```

#### Mobile (< 640px):
```
[Selected: 5] [Del]
[CSV] [Columns]
```

#### Changes:
```typescript
// Before
<div className="flex items-center justify-between p-4">
  <Button>Delete</Button>
  <Button>Export</Button>
  <Button>Auto Size All</Button>
  <Button>Columns</Button>
</div>

// After - Responsive
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4">
  <Button className="text-xs sm:text-sm">
    <span className="hidden sm:inline">Delete</span>
    <span className="sm:hidden">Del</span>
  </Button>
  <Button className="hidden md:flex">Auto Size All</Button>
  <Button className="flex-1 sm:flex-none">Columns</Button>
</div>
```

#### Improvements:
- ✅ Stack vertically on mobile (`flex-col` → `sm:flex-row`)
- ✅ Smaller padding on mobile (`p-3` → `sm:p-4`)
- ✅ Smaller icons on mobile (`w-3 h-3` → `sm:w-4 sm:h-4`)
- ✅ Shorter text labels on mobile
- ✅ Hide "Auto Size All" on tablets/mobile
- ✅ Full-width buttons on mobile (`flex-1` → `sm:flex-none`)
- ✅ Wrap buttons when needed (`flex-wrap`)

### 2.2 Filter Bar - Responsive

#### Desktop:
```
[Global Search...........] [Add Filter]
Filters: [Column = Value ×] [Column2 > 100 ×] [Clear All]
```

#### Mobile:
```
[Global Search......]
[Add Filter]
Filters: 
[Col = Val ×] [Col2 ×]
[Clear]
```

#### Changes:
```typescript
// Global Search
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
  <Input className="flex-1 sm:max-w-md text-sm" />
  <Button className="w-full sm:w-auto text-xs sm:text-sm" />
</div>

// Active Filters
<Badge className="text-[10px] sm:text-xs">
  <span className="opacity-75 hidden sm:inline">Operator</span>
  <span className="truncate max-w-[80px] sm:max-w-none">Value</span>
</Badge>
```

#### Improvements:
- ✅ Stack search & button vertically on mobile
- ✅ Full-width input/button on mobile
- ✅ Smaller text sizes (`text-xs` → `sm:text-sm`)
- ✅ Hide operator text on mobile
- ✅ Truncate long values on mobile
- ✅ Smaller icons and spacing

### 2.3 Column Settings Dialog - Responsive

#### Desktop (> 640px):
```
┌─────────────────────────────────┐
│ Column Settings                 │
├─────────────────────────────────┤
│ [Show All] [Hide All]           │
├─────────────────────────────────┤
│ ☑️ MST Người bán        [Left]  │
│ ☑️ Ký hiệu mẫu          [Left]  │
│ ☑️ Số HĐ                        │
├─────────────────────────────────┤
│          [Reset]     [Done]     │
└─────────────────────────────────┘
```

#### Mobile (< 640px):
```
┌─────────────────────────┐
│ Column Settings         │
├─────────────────────────┤
│ [All]   [None]          │
├─────────────────────────┤
│ ☑️ MST NB      [L]      │
│ ☑️ Ký hiệu     [L]      │
│ ☑️ Số HĐ                │
├─────────────────────────┤
│ [Reset]                 │
│ [Done]                  │
└─────────────────────────┘
```

#### Changes:
```typescript
<DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh]">
  <DialogTitle className="text-base sm:text-lg">
    Column Settings
  </DialogTitle>
  
  {/* Buttons */}
  <Button className="text-xs sm:text-sm flex-1 sm:flex-none">
    <span className="hidden sm:inline">Show All</span>
    <span className="sm:hidden">All</span>
  </Button>
  
  {/* Column List */}
  <div className="space-y-2 overflow-auto flex-1 pr-2">
    <span className="text-xs sm:text-sm truncate">
      {column.headerName}
    </span>
    <Badge className="text-[10px] sm:text-xs">Left</Badge>
  </div>
  
  {/* Footer */}
  <DialogFooter className="flex-col sm:flex-row gap-2">
    <Button className="w-full sm:w-auto">Reset</Button>
    <Button className="w-full sm:w-auto">Done</Button>
  </DialogFooter>
</DialogContent>
```

#### Improvements:
- ✅ Dialog width: `95vw` on mobile → `full` on desktop
- ✅ Max height: `90vh` to prevent overflow
- ✅ Vertical footer buttons on mobile
- ✅ Full-width buttons on mobile
- ✅ Shorter button labels on mobile
- ✅ Smaller text and badges
- ✅ Scrollable content area with padding

### 2.4 Table Container - Responsive

#### Desktop:
```
┌────────────────────────────────────────┐
│ [Table with all columns visible]      │
│ Horizontal scroll for 20+ columns     │
└────────────────────────────────────────┘
```

#### Mobile:
```
┌──────────────────┐
│ [Pinned] [Scroll] │ ← Horizontal scroll
│ Cols     More...  │
└──────────────────┘
```

#### Changes:
```typescript
<div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
  <div className="flex min-w-full">
    {/* Table content */}
  </div>
</div>
```

#### Improvements:
- ✅ Smooth horizontal scroll
- ✅ Custom scrollbar (thin, styled)
- ✅ `min-w-full` ensures scroll works
- ✅ Pinned columns stay visible
- ✅ Touch-friendly scroll on mobile

## 📱 Responsive Classes Reference

### Breakpoint Classes:
```css
/* Mobile First */
.text-xs          /* 12px - mobile */
.sm:text-sm       /* 14px - tablet+ */
.sm:text-base     /* 16px - desktop */

/* Layout */
.flex-col         /* Stack on mobile */
.sm:flex-row      /* Row on tablet+ */

/* Spacing */
.p-3              /* 12px - mobile */
.sm:p-4           /* 16px - tablet+ */

/* Width */
.w-full           /* 100% - mobile */
.sm:w-auto        /* auto - tablet+ */
.flex-1           /* Grow - mobile */
.sm:flex-none     /* No grow - tablet+ */

/* Visibility */
.hidden           /* Hide */
.sm:inline        /* Show on tablet+ */
.sm:hidden        /* Hide on tablet+ */
.md:flex          /* Show on desktop */

/* Sizes */
.w-3 h-3          /* 12px - mobile */
.sm:w-4 sm:h-4    /* 16px - tablet+ */

/* Text */
.text-[10px]      /* 10px - extra small */
.text-xs          /* 12px - small */
.sm:text-sm       /* 14px - medium */
.text-base        /* 16px - default */
.sm:text-lg       /* 18px - large */
```

### Common Patterns:
```typescript
// Responsive Button
<Button className="w-full sm:w-auto text-xs sm:text-sm">
  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
  <span className="hidden sm:inline">Full Text</span>
  <span className="sm:hidden">Short</span>
</Button>

// Responsive Container
<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 sm:p-4">
  {/* Content */}
</div>

// Responsive Input
<Input className="flex-1 sm:max-w-md text-sm" />

// Responsive Badge
<Badge className="text-[10px] sm:text-xs">
  <span className="truncate max-w-[80px] sm:max-w-none">
    {text}
  </span>
</Badge>
```

## 📊 Visual Comparison

### Toolbar (Before vs After)

**Before (Desktop only):**
```
┌──────────────────────────────────────────────────┐
│ [5 selected] [Delete]  [Export] [Auto] [Columns] │
└──────────────────────────────────────────────────┘
```

**After (Responsive):**
```
Desktop:
┌──────────────────────────────────────────────────┐
│ [5 selected] [Delete]  [Export] [Auto] [Columns] │
└──────────────────────────────────────────────────┘

Mobile:
┌────────────────┐
│ [5 sel] [Del]  │
│ [CSV] [Columns]│
└────────────────┘
```

### Column Settings (Before vs After)

**Before (Fixed width):**
```
┌────────────────────────┐
│ Column Settings        │
│ ☑️ Column 1            │
│ ☑️ Column 2            │
│       [Reset] [Done]   │
└────────────────────────┘
(Overflow on mobile)
```

**After (Responsive):**
```
┌────────────────────────┐
│ Column Settings        │
│ [Show All] [Hide All]  │ ← NEW
│ ☑️ Col 1               │
│ ☑️ Col 2               │
│ [Reset]                │
│ [Done]                 │
└────────────────────────┘
(Fits perfectly)
```

## ✅ Testing Checklist

### Desktop (> 1024px):
- [ ] Toolbar shows all buttons with full text
- [ ] Auto Size All button visible
- [ ] Column Settings dialog 400px wide
- [ ] All text at normal size (14-16px)
- [ ] Footer buttons horizontal

### Tablet (640-1024px):
- [ ] Toolbar wraps buttons if needed
- [ ] Auto Size All hidden
- [ ] Column Settings dialog fits screen
- [ ] Text slightly smaller
- [ ] Footer buttons horizontal

### Mobile (< 640px):
- [ ] Toolbar stacks vertically
- [ ] Buttons full-width
- [ ] Short text labels ("Del", "CSV", "All")
- [ ] Column Settings uses 95% viewport width
- [ ] Footer buttons stack vertically
- [ ] Dialog max-height prevents overflow
- [ ] Horizontal scroll works for table
- [ ] Touch gestures work

### Column Settings Specific:
- [ ] "Show All" un-hides all columns
- [ ] "Hide All" hides all columns
- [ ] Buttons positioned at top
- [ ] Icons visible and clear
- [ ] Works on all screen sizes

### Responsive Elements:
- [ ] Text scales appropriately
- [ ] Icons scale appropriately
- [ ] Spacing adjusts for screen size
- [ ] No horizontal overflow
- [ ] Touch targets >= 44px on mobile
- [ ] Scrollable areas work smoothly

## 🎯 Benefits

### User Experience:
1. ✅ **Mobile-Friendly**: Table usable on phones
2. ✅ **Quick Actions**: Show/Hide All saves time
3. ✅ **Better Layout**: No overflow or cut-off content
4. ✅ **Touch-Optimized**: Larger touch targets
5. ✅ **Readable**: Appropriate text sizes

### Developer Experience:
1. ✅ **Maintainable**: Tailwind responsive classes
2. ✅ **Consistent**: Same patterns throughout
3. ✅ **Flexible**: Easy to adjust breakpoints
4. ✅ **Clean Code**: No media queries in JS

### Performance:
1. ✅ **No Extra JS**: Pure CSS responsive
2. ✅ **Fast Rendering**: Tailwind JIT
3. ✅ **Small Bundle**: No responsive libraries

## 🔄 Migration Notes

### No Breaking Changes:
- All existing props work the same
- All existing functionality preserved
- Only UI improvements

### Automatic Updates:
- Responsive works out of the box
- No code changes needed in parent components
- Column Settings buttons appear automatically

## 📝 Usage Examples

### Using Show/Hide All:

```typescript
// User workflow:
1. Click "Columns" button in toolbar
2. Click "Show All" to see everything
3. Click "Hide All" to start fresh
4. Check only needed columns
5. Click "Done"

// Programmatic (if needed):
setColumns(prev => prev.map(col => ({ 
  ...col, 
  hide: false  // Show all
})));
```

### Responsive in Action:

```typescript
// On mobile device:
- Toolbar stacks: buttons use full width
- Text shortcuts: "Delete" → "Del"
- Icons smaller: 12px instead of 16px
- Dialog full-width: 95vw
- Footer buttons vertical

// On desktop:
- Toolbar horizontal: all buttons in row
- Full text labels: "Delete", "Export"
- Icons normal: 16px
- Dialog fixed: 400px max-width
- Footer buttons horizontal
```

## 🐛 Known Issues & Solutions

### Issue 1: Dialog too wide on small phones
**Solution:** Use `w-[95vw]` instead of fixed width

### Issue 2: Text too small on mobile
**Solution:** Use `text-xs sm:text-sm` pattern

### Issue 3: Buttons too close together
**Solution:** Use `gap-2 sm:gap-4` for spacing

### Issue 4: Hidden columns lost on Reset
**Solution:** Reset uses `initialColumns` state

## 📚 Related Files

### Modified:
- `/frontend/src/components/ui/advanced-table/AdvancedTable.tsx`
- `/frontend/src/components/ui/advanced-table/FilterBar.tsx`

### Unchanged:
- `/frontend/src/components/ui/advanced-table/types.ts`
- `/frontend/src/components/ui/advanced-table/utils.ts`
- `/frontend/src/components/InvoiceTableAdvanced.tsx`

## 🎨 CSS Classes Added

```css
/* Responsive Width */
.w-[95vw]          /* 95% viewport width */
.max-h-[90vh]      /* Max 90% viewport height */

/* Scrollbar Styling */
.scrollbar-thin
.scrollbar-thumb-gray-300
.scrollbar-track-gray-100

/* Text Sizes */
.text-[10px]       /* Extra small (10px) */

/* Flex Patterns */
.flex-col sm:flex-row       /* Stack → Row */
.items-start sm:items-center /* Align top → center */
.flex-1 sm:flex-none        /* Grow → No grow */
```

## 🚀 Future Enhancements

1. **Column Templates**: Save/load column visibility presets
2. **Drag & Drop**: Reorder columns in settings
3. **Keyboard Shortcuts**: Ctrl+A to show all, Ctrl+N to hide all
4. **Mobile Column Priorities**: Auto-hide less important columns
5. **Landscape Mode**: Different layout for mobile landscape

---

**Updated by:** GitHub Copilot  
**Date:** 2025-10-10  
**Version:** 2.0.0
