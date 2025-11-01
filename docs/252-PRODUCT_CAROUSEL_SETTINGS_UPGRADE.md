# Cập Nhật Product Carousel Settings Dialog

## Thay Đổi

### 1. Tạo Component Dialog Mới (Senior Level)

**File mới**: `ProductCarouselSettingsDialog.tsx`

- Dialog chuyên nghiệp với 5 tabs:
  - **Content**: Title, số lượng sản phẩm, nút "Xem tất cả"
  - **Filter**: Bộ lọc (all/featured/bestseller/category/custom)
  - **Layout**: Responsive breakpoints (mobile/tablet/desktop)
  - **Behavior**: Autoplay, loop, timing
  - **Controls**: Navigation arrows, touch support
  
- UI/UX cải tiến:
  - Icon cho mỗi tab (Package, Filter, Layout, Play, MousePointer)
  - Range slider với giá trị hiển thị real-time
  - Preview cards cho controls
  - Info boxes với màu sắc phân biệt (blue/green/purple)
  - Mobile-first responsive

### 2. Refactor ProductCarouselBlock.tsx

**Thay đổi**:
- ✅ Loại bỏ inline settings panel (200+ dòng code)
- ✅ Thay bằng dialog component tái sử dụng
- ✅ Giảm imports không cần thiết (Input, Label, Select, Switch)
- ✅ Code cleaner và dễ bảo trì hơn

**Trước**:
```tsx
// 200+ dòng settings inline với Input, Label, Select, Switch...
{isEditing && (
  <div className="absolute...">
    {/* 200+ dòng settings form */}
  </div>
)}
```

**Sau**:
```tsx
// Chỉ 6 dòng gọi dialog component
<ProductCarouselSettingsDialog
  open={isEditing}
  onOpenChange={setIsEditing}
  settings={editContent}
  onSave={(newSettings) => {
    setEditContent(newSettings);
    onUpdate(newSettings);
  }}
/>
```

### 3. Tuân Thủ Rule Prompt

✅ **Dynamic GraphQL**: Sử dụng `useDynamicQuery` cho table `ext_sanphamhoadon`  
✅ **Code Like Senior**: Dialog pattern, separation of concerns, reusable components  
✅ **Shadcn UI**: Tabs, Dialog, Input range sliders, Switch với labels  
✅ **Mobile First + Responsive**: Breakpoints mobile/tablet/desktop, icon responsive tabs  
✅ **Không Testing**: Bỏ qua test files  
✅ **Không Git**: Không commit  
✅ **1 File .md**: Chỉ tài liệu này bằng tiếng Việt  

## Features Dialog

### Content Tab
- Carousel title input
- Range slider cho số lượng sản phẩm (3-20)
- Toggle + URL input cho nút "View All"

### Filter Tab  
- 5 loại filter: All, Featured, Best Sellers, Category, Custom Query
- Input category slug với visual feedback (blue card)
- Textarea cho custom GraphQL query (purple card)
- Info card về data source (green card)

### Layout Tab
- 3 range sliders responsive:
  - 🖥️ Desktop: 2-6 items (default 4)
  - 📱 Tablet: 2-4 items (default 3)
  - 📱 Mobile: 1-3 items (default 2)
- Live value display bên cạnh label
- Info card về responsive design

### Behavior Tab
- Toggle autoplay với range slider delay (2-10s)
- Toggle loop carousel
- Live preview timing value

### Controls Tab
- Toggle navigation arrows
- Preview card hiển thị controls layout
- Info card về touch/swipe support tự động

## Lợi Ích

1. **UX Tốt Hơn**: Tabs tổ chức logic, không overwhelming
2. **Code Sạch**: Separation of concerns, 200+ dòng thành 6 dòng
3. **Tái Sử Dụng**: Dialog có thể dùng cho nhiều carousel types
4. **Maintainability**: Dễ thêm features mới vào từng tab
5. **Type Safety**: Full TypeScript với ProductCarouselBlockContent interface
6. **Accessibility**: Shadcn UI components có ARIA labels built-in

## Cấu Trúc Files

```
frontend/src/components/page-builder/blocks/
├── ProductCarouselBlock.tsx           (giảm 200 dòng, cleaner)
└── ProductCarouselSettingsDialog.tsx  (mới, 400+ dòng chuyên nghiệp)
```

## Testing

1. Mở PageBuilder admin: http://localhost:12000/admin/pagebuilder
2. Add ProductCarousel block
3. Click nút "Settings" → Dialog mở ra
4. Test từng tab:
   - Content: Đổi title, số items
   - Filter: Thử các filter types
   - Layout: Điều chỉnh responsive breakpoints
   - Behavior: Toggle autoplay, thay đổi delay
   - Controls: Toggle navigation
5. Click "Save Settings" → Dialog đóng, preview cập nhật

## Tech Stack

- **React 19** + **Next.js 16** (Turbopack)
- **Shadcn UI**: Dialog, Tabs, Input, Switch, Button, Label
- **Lucide React**: Icons (Package, Filter, Layout, Play, MousePointer)
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling, responsive classes

---

**Ngày cập nhật**: 01/11/2025  
**Status**: ✅ Hoàn Thành  
**Senior Level**: Dialog pattern với tabs, range sliders, live preview
