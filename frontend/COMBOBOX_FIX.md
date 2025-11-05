# 🔧 Combobox Bug Fix

## 🐛 Bugs đã fix:

### 1. **Không chọn được item** ❌ → ✅
**Nguyên nhân:**
```typescript
// SAI - Logic toggle sai
onSelect={(currentValue: string) => {
  onChange?.(currentValue === value ? "" : currentValue)
  setOpen(false)
}}
```
- `currentValue` từ CommandItem là giá trị đã lowercase và normalized
- So sánh với `value` gốc sẽ luôn khác nhau
- Dẫn đến không bao giờ deselect được

**Giải pháp:**
```typescript
// ĐÚNG - Trực tiếp set value
onSelect={() => {
  onChange?.(option.value)
  setOpen(false)
}}
```

### 2. **Menu cha không tìm theo title được** ❌ → ✅
**Nguyên nhân:**
```typescript
// SAI - CommandItem value là ID
<CommandItem
  key={option.value}
  value={option.value}  // "uuid-123-456"
>
  {option.label}  // "Sản Phẩm"
</CommandItem>
```
- CommandItem search dựa trên `value` prop
- `value={option.value}` là UUID → không match khi user gõ title
- VD: User gõ "Sản Phẩm" nhưng search trong "uuid-123-456"

**Giải pháp:**
```typescript
// ĐÚNG - CommandItem value là label để search
<CommandItem
  key={option.value}
  value={option.label}  // "Sản Phẩm" 
  keywords={[option.value, option.label]}  // Search cả value và label
  onSelect={() => {
    onChange?.(option.value)  // Nhưng vẫn return value gốc
    setOpen(false)
  }}
>
  {option.label}
</CommandItem>
```

### 3. **Popover width không match trigger** 🎨
**Before:**
```typescript
<PopoverContent className="w-full p-0" align="start">
```
- `w-full` sẽ full screen thay vì match width của trigger

**After:**
```typescript
<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
```
- Sử dụng CSS variable từ Radix UI để match exact width

---

## ✅ Changes Summary:

| Issue | Before | After |
|-------|--------|-------|
| **Select Logic** | Toggle với comparison sai | Direct set value |
| **Search** | Search theo UUID | Search theo label |
| **Keywords** | Không có | Hỗ trợ search cả value + label |
| **Popover Width** | `w-full` (full screen) | `w-[var(--radix-popover-trigger-width)]` |

---

## 🧪 Test Cases:

### ✅ Test 1: Chọn item
```typescript
<Combobox
  value={type}
  onChange={setType}
  options={[
    { value: 'HEADER', label: 'Header' },
    { value: 'FOOTER', label: 'Footer' },
  ]}
/>
```
- [x] Click "Header" → value = "HEADER" ✅
- [x] Click "Footer" → value = "FOOTER" ✅
- [x] Popover close sau khi chọn ✅

### ✅ Test 2: Search theo title (Menu Cha)
```typescript
<Combobox
  value={parentId}
  onChange={setParentId}
  options={[
    { value: 'uuid-123', label: 'Sản Phẩm Nổi Bật' },
    { value: 'uuid-456', label: 'Tin Tức' },
  ]}
/>
```
- [x] Gõ "Sản Phẩm" → Hiện "Sản Phẩm Nổi Bật" ✅
- [x] Gõ "Tin" → Hiện "Tin Tức" ✅
- [x] Gõ "uuid-123" → Cũng hiện "Sản Phẩm Nổi Bật" ✅ (keywords)

### ✅ Test 3: Empty state
```typescript
<Combobox
  value={value}
  onChange={setValue}
  options={[]}
  emptyMessage="Không tìm thấy."
/>
```
- [x] Hiện "Không tìm thấy." ✅

### ✅ Test 4: Disabled state
```typescript
<Combobox
  value={value}
  onChange={setValue}
  options={options}
  disabled={true}
/>
```
- [x] Button disabled ✅
- [x] Không mở được popover ✅

---

## 📝 Code Changes:

```diff
<CommandItem
  key={option.value}
- value={option.value}
+ value={option.label}
+ keywords={[option.value, option.label]}
- onSelect={(currentValue: string) => {
-   onChange?.(currentValue === value ? "" : currentValue)
+ onSelect={() => {
+   onChange?.(option.value)
    setOpen(false)
  }}
>

<PopoverContent 
- className="w-full p-0" 
+ className="w-[var(--radix-popover-trigger-width)] p-0" 
  align="start"
>
```

---

## 🎯 Impact:

✅ **Tất cả 9 Combobox trong admin/menu đều hoạt động:**
- `/admin/menu` - Filter theo loại (1)
- `/admin/menu/create` - 4 comboboxes
- `/admin/menu/[id]/edit` - 4 comboboxes

✅ **Search hoạt động cho:**
- Menu Type (HEADER, FOOTER, etc.)
- Menu Cha (theo title, không phải UUID)
- Link Type (PRODUCT_LIST, BLOG_LIST, etc.)
- Target (SELF, BLANK, MODAL)

✅ **UX cải thiện:**
- Click chọn ngay, không cần click 2 lần
- Search theo tên hiển thị, không phải ID
- Popover width vừa vặn với button
