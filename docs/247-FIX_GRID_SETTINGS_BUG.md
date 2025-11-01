# Fix Bug Grid Settings - Grid Block Layout

## 📋 Vấn Đề

**Mô tả bug:**
Khi user thêm 2 hero sections vào Grid Block và chọn số columns trong Grid Settings, các hero sections hiển thị về một phía (thường là trái), phía còn lại để trống thay vì phân bổ đều theo grid columns.

**Triệu chứng:**
```
Grid với 2 columns:
[Hero 1] [Trống]
[Hero 2] [Trống]

Thay vì:
[Hero 1] [Hero 2]
```

**Nguyên nhân gốc rễ:**
1. **Wrapper div với `col-span-full`**: Children được wrap trong `<div className="nested-children-wrapper col-span-full">` - làm tất cả children chiếm full width thay vì chia theo grid cells
2. **Dynamic Tailwind classes không hoạt động**: Code cũ dùng `grid-cols-${variable}` nhưng Tailwind không thể generate dynamic classes tại runtime
3. **Responsive CSS conflict**: Có 2 nơi định nghĩa gridTemplateColumns (inline styles + jsx styles) gây conflict

## 🔍 Root Cause Analysis

### Code Cũ (Có Bug)

**File:** `frontend/src/components/page-builder/blocks/GridBlock.tsx`

```tsx
// ❌ BUG 1: Wrapper div với col-span-full
{children ? (
  <div className="nested-children-wrapper w-full h-full col-span-full">
    {children}  // Tất cả children bị nhồi vào 1 cell!
  </div>
) : ( ... )}

// ❌ BUG 2: Dynamic Tailwind classes
const getGridColumnsClass = () => {
  const cols = content.columns || 3;
  const smCols = `grid-cols-${responsive.sm || 1}`;  // Không hoạt động!
  const mdCols = `md:grid-cols-${responsive.md || 2}`;
  return `grid ${smCols} ${mdCols} ...`;
};

// ❌ BUG 3: Conflict gridTemplateColumns
const gridStyles = {
  gridTemplateColumns: content.columnTemplate || `repeat(${cols}, 1fr)`,
};
// Nhưng lại bị override bởi:
<style jsx>{`
  .page-grid {
    grid-template-columns: repeat(${content.responsive?.lg}, 1fr) !important;
  }
`}</style>
```

### Vấn Đề Tailwind CSS

Tailwind **KHÔNG** hỗ trợ dynamic class generation:
```tsx
// ❌ KHÔNG HOẠT ĐỘNG
const cols = 3;
className={`grid-cols-${cols}`}  // Class này không tồn tại

// ✅ CHỈ HOẠT ĐỘNG với hardcoded
className="grid-cols-3"  // OK - class được generate sẵn
```

## ✅ Giải Pháp

### Thay Đổi 1: Loại Bỏ Wrapper Div

**Trước:**
```tsx
{children ? (
  <div className="nested-children-wrapper w-full h-full col-span-full">
    {children}
  </div>
) : ( ... )}
```

**Sau:**
```tsx
{children ? (
  <>
    {children}  {/* Mỗi child là một grid item riêng biệt */}
  </>
) : ( ... )}
```

**Lý do:** Loại bỏ wrapper div để mỗi child block trở thành grid item độc lập, có thể chiếm đúng grid cell của nó.

### Thay Đổi 2: Sử dụng Inline Styles + JSX Styles

**Trước:**
```tsx
// Dynamic Tailwind (không hoạt động)
const gridClassName = `grid grid-cols-${cols} ...`;

const gridStyles = {
  gap: `${content.gap}px`,
  // gridTemplateColumns conflict với responsive
};
```

**Sau:**
```tsx
// Desktop: Inline styles
const gridStyles: React.CSSProperties = {
  display: 'grid',
  gap: `${content.gap || 16}px`,
  gridTemplateRows: content.rowTemplate || 'auto',
  gridTemplateColumns: content.columnTemplate || `repeat(${cols}, 1fr)`,
  width: '100%',
  position: 'relative',
  minHeight: children ? 'auto' : '200px',
  border: isEditable ? '2px dashed #cbd5e0' : 'none',
  borderRadius: '8px',
  padding: isEditable ? '16px' : '0',
};

// Mobile/Tablet: JSX styles với unique ID
const gridId = `grid-block-${block.id.replace(/[^a-zA-Z0-9]/g, '')}`;

<style jsx>{`
  @media (max-width: 640px) {
    .${gridId} {
      grid-template-columns: repeat(${responsive.sm || 1}, 1fr) !important;
    }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .${gridId} {
      grid-template-columns: repeat(${responsive.md || 2}, 1fr) !important;
    }
  }
`}</style>
```

**Lý do:**
- Inline styles cho desktop: Linh hoạt, hỗ trợ custom template
- JSX styles cho responsive: Media queries với giá trị dynamic
- Unique ID: Tránh conflict giữa nhiều grid blocks trên cùng page

### Thay Đổi 3: Wrap Component trong Fragment

**Code:**
```tsx
if (!isEditable) {
  return (
    <>
      <div style={gridStyles} className={gridId}>
        {children}
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .${gridId} {
            grid-template-columns: repeat(${responsive.sm || 1}, 1fr) !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .${gridId} {
            grid-template-columns: repeat(${responsive.md || 2}, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}

return (
  <>
    <div style={gridStyles} className={`group ${gridId}`}>
      {/* Control Bar, Settings Panel, Children */}
    </div>
    
    <style jsx>{`
      @media (max-width: 640px) {
        .${gridId} {
          grid-template-columns: repeat(${responsive.sm || 1}, 1fr) !important;
        }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        .${gridId} {
          grid-template-columns: repeat(${responsive.md || 2}, 1fr) !important;
          }
        }
      `}</style>
  </>
);
```

## 📝 Code Changes

### File Modified: `GridBlock.tsx`

**Location:** `/frontend/src/components/page-builder/blocks/GridBlock.tsx`

**Changes:**

1. **Lines 51-73:** Thay đổi logic từ dynamic Tailwind sang inline styles + JSX styles
   ```tsx
   // Calculate responsive columns
   const cols = content.columns || 3;
   const responsive = content.responsive || { sm: 1, md: 2, lg: cols };

   // Grid inline styles (desktop default)
   const gridStyles: React.CSSProperties = {
     display: 'grid',
     gap: `${content.gap || 16}px`,
     gridTemplateRows: content.rowTemplate || 'auto',
     gridTemplateColumns: content.columnTemplate || `repeat(${cols}, 1fr)`,
     width: '100%',
     position: 'relative',
     minHeight: children ? 'auto' : '200px',
     border: isEditable ? '2px dashed #cbd5e0' : 'none',
     borderRadius: '8px',
     padding: isEditable ? '16px' : '0',
   };

   // Unique ID for responsive styles
   const gridId = `grid-block-${block.id.replace(/[^a-zA-Z0-9]/g, '')}`;
   ```

2. **Lines 75-92:** Non-editable mode với responsive styles
   ```tsx
   if (!isEditable) {
     return (
       <>
         <div style={gridStyles} className={gridId}>
           {children}
         </div>
         <style jsx>{`
           @media (max-width: 640px) {
             .${gridId} {
               grid-template-columns: repeat(${responsive.sm || 1}, 1fr) !important;
             }
           }
           @media (min-width: 641px) and (max-width: 1024px) {
             .${gridId} {
               grid-template-columns: repeat(${responsive.md || 2}, 1fr) !important;
             }
           }
         `}</style>
       </>
     );
   }
   ```

3. **Lines 266-288:** Loại bỏ wrapper div, thêm responsive styles
   ```tsx
   {/* Children Blocks - Each child is a grid item */}
   {children ? (
     <>
       {children}
     </>
   ) : (
     <div className="col-span-full ...">
       {/* Empty state */}
     </div>
   )}
 </div>

 {/* Responsive CSS */}
 <style jsx>{`
   @media (max-width: 640px) {
     .${gridId} {
       grid-template-columns: repeat(${responsive.sm || 1}, 1fr) !important;
     }
   }
   @media (min-width: 641px) and (max-width: 1024px) {
     .${gridId} {
       grid-template-columns: repeat(${responsive.md || 2}, 1fr) !important;
     }
   }
 `}</style>
</>`
   ```

## 🎯 Kết Quả

### Trước Khi Fix
```
Grid 2 columns với 2 Hero Sections:
┌────────────────────────────────────┐
│ [Hero 1]                           │
│ [Hero 2]                           │
│                                    │
│ (Tất cả bị nhồi về trái)          │
└────────────────────────────────────┘
```

### Sau Khi Fix
```
Grid 2 columns với 2 Hero Sections:
┌──────────────────┬─────────────────┐
│                  │                 │
│    [Hero 1]      │    [Hero 2]     │
│                  │                 │
└──────────────────┴─────────────────┘

Grid 3 columns với 3 Hero Sections:
┌───────────┬───────────┬───────────┐
│           │           │           │
│ [Hero 1]  │ [Hero 2]  │ [Hero 3]  │
│           │           │           │
└───────────┴───────────┴───────────┘
```

### Responsive Behavior
```
Desktop (lg): 3 columns
┌───────────┬───────────┬───────────┐
│ [Hero 1]  │ [Hero 2]  │ [Hero 3]  │
└───────────┴───────────┴───────────┘

Tablet (md): 2 columns
┌─────────────────┬─────────────────┐
│    [Hero 1]     │    [Hero 2]     │
├─────────────────┴─────────────────┤
│           [Hero 3]                │
└───────────────────────────────────┘

Mobile (sm): 1 column
┌─────────────────────────────────┐
│          [Hero 1]               │
├─────────────────────────────────┤
│          [Hero 2]               │
├─────────────────────────────────┤
│          [Hero 3]               │
└─────────────────────────────────┘
```

## 🧪 Testing

### Test Cases

1. **Grid với 2 columns + 2 Hero Sections**
   ```
   1. Vào PageBuilder: http://localhost:12000/admin/pagebuilder
   2. Thêm Grid Block
   3. Click "Add Block" trong Grid
   4. Thêm 2 Hero Sections
   5. Click Settings của Grid
   6. Đổi Columns thành 2
   7. Click Save
   
   ✅ Expected: 2 Hero hiển thị cạnh nhau (1 row, 2 cols)
   ```

2. **Grid với 3 columns + 3 Hero Sections**
   ```
   1. Thêm Grid Block
   2. Thêm 3 Hero Sections vào Grid
   3. Settings > Columns = 3
   
   ✅ Expected: 3 Hero hiển thị cạnh nhau (1 row, 3 cols)
   ```

3. **Responsive Columns**
   ```
   1. Thêm Grid với 6 blocks
   2. Settings:
      - Columns (Desktop): 3
      - Large (lg): 3
      - Medium (md): 2  
      - Small (sm): 1
   
   ✅ Desktop: 2 rows x 3 cols
   ✅ Tablet: 3 rows x 2 cols
   ✅ Mobile: 6 rows x 1 col
   ```

4. **Custom Column Template**
   ```
   1. Thêm Grid với 3 blocks
   2. Settings > Custom Column Template: "2fr 1fr 1fr"
   
   ✅ Expected: 
      - Block 1 chiếm 50% width
      - Block 2 chiếm 25% width
      - Block 3 chiếm 25% width
   ```

5. **Empty Grid**
   ```
   1. Thêm Grid Block (không có children)
   2. Hiển thị empty state với message
   
   ✅ Expected: "Drop blocks here or click Add Block"
   ```

## 🎓 Bài Học

### 1. Tailwind Limitations
**Lesson:** Tailwind CSS không hỗ trợ dynamic class generation tại runtime

```tsx
// ❌ Không hoạt động
const cols = getUserInput();  // 3
className={`grid-cols-${cols}`}  // "grid-cols-3" không tồn tại

// ✅ Giải pháp: Inline styles hoặc CSS-in-JS
style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
```

### 2. Grid Children Structure
**Lesson:** Avoid wrapper divs với `col-span-full` khi muốn distribute children theo grid cells

```tsx
// ❌ Wrapper làm mất grid layout
<div className="grid grid-cols-3">
  <div className="col-span-full">
    {children}  // Tất cả nhồi vào 1 cell
  </div>
</div>

// ✅ Direct children là grid items
<div className="grid grid-cols-3">
  {children}  // Mỗi child là 1 grid item
</div>
```

### 3. Responsive Grid với JSX Styles
**Lesson:** Sử dụng styled-jsx cho responsive với dynamic values

```tsx
const gridId = `grid-${uniqueId}`;

<div className={gridId} style={baseStyles}>
  {children}
</div>

<style jsx>{`
  @media (max-width: 640px) {
    .${gridId} {
      grid-template-columns: repeat(${mobileColumns}, 1fr) !important;
    }
  }
`}</style>
```

### 4. Unique CSS Classes
**Lesson:** Tạo unique class names để tránh conflict giữa nhiều instances

```tsx
// ❌ Conflict khi có nhiều grids
<div className="page-grid">

// ✅ Unique per instance
const gridId = `grid-block-${block.id.replace(/[^a-zA-Z0-9]/g, '')}`;
<div className={gridId}>
```

## 📚 Technical Details

### CSS Grid Layout

**Grid Template Columns Syntax:**
```css
/* Fixed columns */
grid-template-columns: 200px 200px 200px;

/* Fraction units (equal width) */
grid-template-columns: 1fr 1fr 1fr;

/* repeat() function */
grid-template-columns: repeat(3, 1fr);

/* Mixed units */
grid-template-columns: 2fr 1fr 1fr;  /* 50% 25% 25% */

/* Auto columns */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

**Responsive Grid:**
```css
/* Desktop default */
.grid {
  grid-template-columns: repeat(3, 1fr);
}

/* Tablet */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
```

### Styled JSX

Next.js hỗ trợ styled-jsx built-in:

```tsx
<style jsx>{`
  .${dynamicClassName} {
    color: ${dynamicColor};
  }
`}</style>
```

**Features:**
- ✅ Scoped CSS (không leak ra ngoài component)
- ✅ Dynamic values trong template literals
- ✅ Media queries hỗ trợ đầy đủ
- ✅ Pseudo-classes và pseudo-elements

## ✅ Checklist

- [x] Loại bỏ wrapper div với `col-span-full`
- [x] Thay đổi từ dynamic Tailwind sang inline styles
- [x] Thêm responsive styles với styled-jsx
- [x] Tạo unique grid ID cho mỗi instance
- [x] Test với 2 columns + 2 heroes
- [x] Test với 3 columns + 3 heroes
- [x] Test responsive behavior
- [x] Test custom column template
- [x] Verify không có TypeScript errors
- [x] Tạo file tổng kết

## 🚀 Deployment

**File đã sửa:**
- ✅ `frontend/src/components/page-builder/blocks/GridBlock.tsx`

**Breaking Changes:** Không có

**Migration Required:** Không cần

**Status:** ✅ Ready for production

---

**Ngày hoàn thành:** 1/11/2025  
**Người thực hiện:** GitHub Copilot  
**Review:** Recommended  
**Priority:** High (Critical UX Bug)
