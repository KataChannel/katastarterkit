# Cập nhật ListView - Project Management

## Tổng quan
Tối ưu hóa giao diện ListView theo rules:
- **Mobile First + Responsive** 
- **Select → Combobox**
- **Clean Architecture** - Phân tách modules
- **Dialog chuẩn** - Header/Content/Footer

## Cấu trúc mới
```
list-view/
├── index.ts              # Export all
├── types.ts              # Types & constants
├── useListView.ts        # Custom hook (logic)
├── ListView.tsx          # Main component
├── CreateTaskDialog.tsx  # Dialog tạo task
├── ListViewToolbar.tsx   # Toolbar filters
├── TaskTable.tsx         # Table + Mobile cards
└── ListViewStats.tsx     # Stats footer
```

## Thay đổi chính

### 1. Mobile First
- Mobile card list với layout compact
- Desktop table ẩn trên mobile
- Touch-friendly buttons/inputs
- Responsive spacing

### 2. Select → Combobox  
- Priority filter: Combobox với search
- Status filter: Combobox với search
- Create dialog: Priority & Category combobox

### 3. Dialog Layout
- Fixed Header với border-bottom
- Scrollable Content (flex-1 overflow-y-auto)
- Fixed Footer với border-top
- Full-width buttons trên mobile

### 4. Performance
- useCallback cho handlers
- useMemo cho filtered tasks & stats
- Tách GraphQL queries vào hook

## Files tạo mới
1. `list-view/types.ts` - 67 dòng
2. `list-view/useListView.ts` - 260 dòng  
3. `list-view/CreateTaskDialog.tsx` - 200 dòng
4. `list-view/ListViewToolbar.tsx` - 220 dòng
5. `list-view/TaskTable.tsx` - 310 dòng
6. `list-view/ListViewStats.tsx` - 35 dòng
7. `list-view/ListView.tsx` - 125 dòng
8. `list-view/index.ts` - 8 dòng

## Backward Compatible
File `ListView.tsx` gốc re-export từ module mới.
