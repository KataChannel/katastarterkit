# Auto Scroll Đến Block Mới

## 📅 Ngày: 5 tháng 11, 2025

## 🎯 Mục Tiêu
Tự động scroll đến block mới được tạo hoặc copy để user không cần tìm kiếm.

## ✅ Thay Đổi

### 1. PageActionsContext - handleAddBlock
**File:** `/frontend/src/components/page-builder/contexts/PageActionsContext.tsx`

```typescript
// Scroll to the newly added block (at the bottom)
setTimeout(() => {
  const blockElements = document.querySelectorAll('[data-block-id]');
  if (blockElements.length > 0) {
    const lastBlock = blockElements[blockElements.length - 1];
    lastBlock.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
  }
}, 300); // Wait for DOM update
```

### 2. PageActionsContext - handleBlockCopy
**File:** `/frontend/src/components/page-builder/contexts/PageActionsContext.tsx`

```typescript
// Scroll to the newly copied block
setTimeout(() => {
  const blockElement = document.querySelector(`[data-block-id="${newBlockAtEnd.id}"]`);
  if (blockElement) {
    blockElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
    
    // Add highlight effect (green ring)
    blockElement.classList.add('ring-4', 'ring-green-400');
    setTimeout(() => {
      blockElement.classList.remove('ring-4', 'ring-green-400');
    }, 2000);
  }
}, 300);
```

### 3. SortableBlockWrapper - Data Attribute
**File:** `/frontend/src/components/page-builder/blocks/SortableBlockWrapper.tsx`

```typescript
<div ref={setNodeRef} style={style} {...attributes} data-block-id={block.id}>
```

## 🎨 Features

### Add Block
1. User click "Add Block"
2. Block được tạo ở cuối danh sách
3. Auto scroll smooth đến block mới
4. Block hiển thị ở center viewport

### Copy Block
1. User click "Copy"
2. Block mới chèn ngay sau block gốc
3. Auto scroll smooth đến block copy
4. **Bonus:** Highlight xanh lá 2 giây (ring-4 ring-green-400)
5. User dễ nhận biết block vừa copy

## 🎬 User Experience

### Before
```
User add block → Không thấy gì → Phải scroll xuống tìm
User copy block → Không biết block ở đâu → Phải scroll tìm
```

### After
```
User add block → Auto scroll → Block mới ở center màn hình ✅
User copy block → Auto scroll + highlight green → Dễ nhận biết ✅
```

## 🔧 Technical Details

### scrollIntoView Options
```typescript
{
  behavior: 'smooth',  // Animation mượt
  block: 'center',     // Block ở giữa viewport
  inline: 'nearest'    // Không scroll ngang
}
```

### Timing
- **300ms delay:** Đợi DOM update sau refetch
- **2000ms highlight:** Green ring fade out

### Selector
- Add: `querySelectorAll('[data-block-id]')` → last element
- Copy: `querySelector([data-block-id="${id}"])` → specific block

## 📊 Rules Applied

✅ **Rule 1:** Code Like Senior  
✅ **Rule 2:** Dynamic GraphQL  
✅ **Rule 3:** Bỏ qua testing  
✅ **Rule 4:** Không git  
✅ **Rule 5:** 1 file .md ngắn gọn  
✅ **Rule 6:** Mobile First + Responsive  
✅ **Rule 7:** Giao diện tiếng Việt  

## 📁 Files Changed

| File | Lines | Changes |
|------|-------|---------|
| PageActionsContext.tsx | ~20 | Auto scroll logic |
| SortableBlockWrapper.tsx | 1 | data-block-id attribute |

## ✅ Kết Quả

- ✅ Auto scroll đến block mới (Add)
- ✅ Auto scroll + highlight đến block copy
- ✅ Smooth animation
- ✅ User-friendly
- ✅ Mobile-responsive

---

**Hoàn thành:** Auto scroll đến block mới! 🎉
