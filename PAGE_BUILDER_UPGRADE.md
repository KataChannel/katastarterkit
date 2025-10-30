# Nâng Cấp Page Builder - Tích Hợp BlockNote Style Editor

## Tổng Quan

Đã nâng cấp Page Builder lên senior level với BlockNote-style rich text editor, mobile-first design, và tích hợp Dynamic GraphQL.

## Các Thành Phần Mới

### 1. BlockNoteEditor (`editors/BlockNoteEditor.tsx`)

**Tính năng:**
- Rich text editor dựa trên Tiptap với UI giống BlockNote
- Mobile-first với touch-friendly toolbar (min 44x44px)
- Sticky toolbar khi scroll
- Support đầy đủ: Bold, Italic, Headings, Lists, Images, Links
- Undo/Redo functionality
- Character count
- Responsive design

**Công nghệ:**
- Tiptap React với StarterKit
- Extensions: Image, Link, Placeholder
- Dynamic import để optimize performance
- Loading skeleton

### 2. RichTextBlock (`blocks/RichTextBlock.tsx`)

**Cải tiến:**
- Tích hợp BlockNoteEditor
- Edit/View mode riêng biệt
- Settings panel với mobile-friendly button
- Customizable styling: background, color, padding, border
- Memo optimization
- Default data export

**Props:**
```typescript
interface RichTextBlockData {
  content: string;
  minHeight?: string;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  borderRadius?: string;
  maxWidth?: string;
}
```

### 3. EnhancedPageBuilder (`EnhancedPageBuilder.tsx`)

**Architecture cải tiến:**

**State Management:**
- Centralized page state
- History với undo/redo (20 states)
- Selected block tracking
- Preview mode

**Performance:**
- React.memo cho các components
- useMemo cho device preview
- useCallback cho handlers
- Debounced history updates (500ms)

**Mobile-First Features:**
- Device preview: Mobile (375px), Tablet (768px), Desktop (100%)
- Touch-optimized DnD với TouchSensor
- Bottom toolbar cho mobile
- Responsive sidebar
- Min touch target 44x44px (Apple HIG)

**Dynamic GraphQL:**
- useCreateOne/useUpdateOne hooks
- Auto-save functionality
- Loading states

### 4. EnhancedSortableBlock (`EnhancedSortableBlock.tsx`)

**Features:**
- DnD với @dnd-kit
- Mobile-optimized drag handle
- Floating action buttons (Delete, Duplicate)
- Visual feedback (border, shadow)
- Touch support
- Accessibility labels

## Quy Tắc Áp Dụng

✅ **Dynamic GraphQL:** Tất cả mutations sử dụng Dynamic GraphQL hooks
✅ **Senior Code:** Clean architecture, TypeScript strict, performance optimization
✅ **Mobile First:** Touch targets ≥44px, responsive breakpoints, PWA-ready
✅ **No Testing:** Bỏ qua test files theo quy tắc
✅ **No Git:** Không commit (theo quy tắc)

## Cách Sử Dụng

### Basic Usage

```tsx
import EnhancedPageBuilder from '@/components/page-builder/EnhancedPageBuilder';

function MyPage() {
  return (
    <EnhancedPageBuilder
      pageId="optional-existing-page-id"
      initialPage={{
        title: "My Page",
        slug: "my-page",
        blocks: [],
      }}
      onSave={(page) => console.log('Saved:', page)}
    />
  );
}
```

### Thêm Block Mới

1. Tạo component block trong `blocks/`
2. Export default data
3. Thêm vào switch case trong EnhancedPageBuilder
4. Thêm button trong sidebar

## Performance Optimizations

1. **Dynamic Imports:** BlockNoteEditor được lazy load
2. **Memoization:** RichTextBlock dùng React.memo
3. **Callback Optimization:** Tất cả handlers dùng useCallback
4. **History Management:** Chỉ giữ 20 states gần nhất
5. **Debounced Updates:** 500ms delay cho history

## Mobile Optimizations

1. **Touch Targets:** Tối thiểu 44x44px
2. **Gestures:** Touch/Pointer sensors cho DnD
3. **Toolbar:** Sticky + horizontal scroll
4. **Bottom Nav:** Mobile-only quick actions
5. **Responsive:** Breakpoints md: (768px)

## PWA Ready

- No SSR cho editor (client-only)
- Offline-capable structure
- Fast loading với code splitting
- Touch-optimized UI

## Tích Hợp Với Hệ Thống

### Dynamic GraphQL Models
```graphql
type Page {
  id: ID!
  title: String!
  slug: String!
  content: JSON  # Lưu blocks array
  settings: JSON # Lưu page settings
  status: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Mutations
- `createPage`: Tạo page mới
- `updatePage`: Cập nhật page existing

## Roadmap Tương Lai

- [ ] Thêm block types: Video, Image Gallery, CTA
- [ ] AI-powered content suggestions
- [ ] Real-time collaboration
- [ ] Template library
- [ ] Export/Import pages
- [ ] SEO preview
- [ ] Analytics integration

## Best Practices

1. **Always memo expensive components**
2. **Use dynamic imports for heavy editors**
3. **Keep touch targets ≥44px**
4. **Test on real mobile devices**
5. **Use semantic HTML**
6. **Add ARIA labels**
7. **Optimize images**
8. **Lazy load non-critical assets**

---

**Tác giả:** AI Assistant (Senior Level Implementation)  
**Ngày:** 31/10/2025  
**Version:** 1.0.0
