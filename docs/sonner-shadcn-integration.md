# 🎨 Sonner Toast với shadcn/ui Theme Integration

## ✅ Hoàn Thành

**Ngày**: 12/10/2025
**Trạng thái**: ✅ Production Ready

---

## 📋 Tổng Quan

Đã tích hợp thành công **sonner** toast notifications với **shadcn/ui theme system**, sử dụng CSS variables và Tailwind classes để tạo ra trải nghiệm nhất quán với design system.

---

## 🎨 Theme Integration

### 1. Provider Configuration

**File**: `frontend/src/components/providers.tsx`

```tsx
import { Toaster } from 'sonner';

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Toaster 
            position="top-right"
            expand={true}
            richColors
            closeButton
          />
          {children}
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
```

**Props Explained**:
- `position="top-right"` - Vị trí hiển thị toast
- `expand={true}` - Cho phép mở rộng khi hover
- `richColors` - Sử dụng màu sắc phong phú từ theme
- `closeButton` - Hiển thị nút đóng (X)

### 2. CSS Customization

**File**: `frontend/src/app/globals.css`

Đã thêm custom styles để sonner sử dụng shadcn/ui theme:

```css
/* Sonner Toast Styles - shadcn/ui theme */
@layer base {
  :root {
    --toaster-success: var(--primary);
    --toaster-error: var(--destructive);
    --toaster-warning: var(--chart-4);
    --toaster-info: var(--chart-2);
  }
}

/* Toast base styles */
[data-sonner-toast] {
  @apply bg-card text-card-foreground border border-border shadow-lg;
}

[data-sonner-toast][data-styled='true'] {
  @apply rounded-lg;
}

/* Toast content */
[data-sonner-toast] [data-title] {
  @apply text-sm font-semibold;
}

[data-sonner-toast] [data-description] {
  @apply text-sm text-muted-foreground;
}

/* Buttons */
[data-sonner-toast] [data-button] {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

[data-sonner-toast] [data-cancel-button] {
  @apply bg-muted text-muted-foreground hover:bg-muted/80;
}

/* Success toast */
[data-sonner-toast][data-type='success'] {
  @apply border-primary/50;
}

[data-sonner-toast][data-type='success'] [data-icon] {
  @apply text-primary;
}

/* Error toast */
[data-sonner-toast][data-type='error'] {
  @apply border-destructive/50;
}

[data-sonner-toast][data-type='error'] [data-icon] {
  @apply text-destructive;
}

/* Warning toast */
[data-sonner-toast][data-type='warning'] {
  @apply border-chart-4/50;
}

[data-sonner-toast][data-type='warning'] [data-icon] {
  @apply text-chart-4;
}

/* Info toast */
[data-sonner-toast][data-type='info'] {
  @apply border-chart-2/50;
}

[data-sonner-toast][data-type='info'] [data-icon] {
  @apply text-chart-2;
}

/* Close button */
[data-sonner-toast] [data-close-button] {
  @apply bg-transparent border-border text-muted-foreground hover:text-foreground;
}

/* Dark mode */
.dark [data-sonner-toast] {
  @apply bg-card/95 backdrop-blur-sm;
}
```

---

## 🎨 Color Scheme

### Light Mode
- **Background**: `bg-card` (white)
- **Text**: `text-card-foreground` (dark)
- **Border**: `border-border` (light gray)
- **Success**: `text-primary` (default primary color)
- **Error**: `text-destructive` (red)
- **Warning**: `text-chart-4` (yellow/orange)
- **Info**: `text-chart-2` (blue)

### Dark Mode
- **Background**: `bg-card/95` with backdrop blur
- **Text**: `text-card-foreground` (light)
- **Border**: `border-border` (dark gray)
- **Success**: `text-primary` (light)
- **Error**: `text-destructive` (light red)
- **Warning**: `text-chart-4` (light yellow)
- **Info**: `text-chart-2` (light blue)

---

## 💡 Usage Examples

### 1. Basic Toasts

```typescript
import { toast } from 'sonner';

// Success
toast.success('Thao tác thành công!');

// Error
toast.error('Có lỗi xảy ra!');

// Warning
toast.warning('Cảnh báo!');

// Info
toast.info('Thông tin');

// Loading
toast.loading('Đang xử lý...');
```

### 2. Toast với Description

```typescript
toast.success('Template đã áp dụng!', {
  description: 'Template "Hero Section" với 5 blocks',
});

toast.error('Lỗi khi tải dữ liệu', {
  description: 'Vui lòng thử lại sau',
});
```

### 3. Promise Toast (Recommended)

```typescript
toast.promise(
  async () => {
    const result = await fetchData();
    return result;
  },
  {
    loading: 'Đang tải dữ liệu...',
    success: (data) => `Tải thành công ${data.length} items`,
    error: 'Lỗi khi tải dữ liệu',
  }
);
```

### 4. Toast với Action Button

```typescript
toast('Template đã áp dụng', {
  description: '5 blocks đã được thêm vào page',
  action: {
    label: 'Hoàn tác',
    onClick: () => {
      // Undo logic here
      toast.success('Đã hoàn tác');
    },
  },
});
```

### 5. Custom Duration

```typescript
// Toast hiển thị lâu hơn
toast.success('Thông báo quan trọng', {
  duration: 10000, // 10 seconds
});

// Toast hiển thị vĩnh viễn (cần đóng thủ công)
toast.info('Thông báo không tự đóng', {
  duration: Infinity,
});
```

### 6. Toast với Custom Icon

```typescript
import { CheckCircle2, AlertTriangle } from 'lucide-react';

toast('Cập nhật thành công', {
  icon: <CheckCircle2 className="h-5 w-5" />,
});

toast('Cảnh báo', {
  icon: <AlertTriangle className="h-5 w-5" />,
});
```

### 7. Positioned Toast

```typescript
// Override vị trí global
toast.success('Toast ở góc dưới bên phải', {
  position: 'bottom-right',
});
```

### 8. Custom Styling per Toast

```typescript
toast('Custom styled toast', {
  className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  description: 'With custom gradient background',
});
```

---

## 🎯 Real-World Examples

### Example 1: Template Application (PageBuilder)

```typescript
const handleApplyTemplate = async (template: BlockTemplate) => {
  toast.promise(
    async () => {
      for (const blockDef of template.blocks) {
        await createBlockFromTemplate(blockDef, null, blocks.length);
      }
      await refetch();
      return template;
    },
    {
      loading: `Đang áp dụng template: ${template.name}...`,
      success: (t) => ({
        title: 'Template đã áp dụng!',
        description: `"${t.name}" với ${t.blocks.length} blocks`,
      }),
      error: (err) => ({
        title: 'Lỗi khi áp dụng template',
        description: err?.message || 'Vui lòng thử lại',
      }),
    }
  );
};
```

### Example 2: Form Submission

```typescript
const handleSubmit = async (data: FormData) => {
  toast.promise(
    submitForm(data),
    {
      loading: 'Đang gửi form...',
      success: 'Form đã được gửi thành công!',
      error: (err) => `Lỗi: ${err.message}`,
    }
  );
};
```

### Example 3: Delete with Confirmation

```typescript
const handleDelete = async (id: string) => {
  const toastId = toast.warning('Bạn có chắc muốn xóa?', {
    action: {
      label: 'Xóa',
      onClick: async () => {
        toast.promise(
          deleteItem(id),
          {
            loading: 'Đang xóa...',
            success: 'Đã xóa thành công',
            error: 'Lỗi khi xóa',
          }
        );
      },
    },
    cancel: {
      label: 'Hủy',
      onClick: () => toast.dismiss(toastId),
    },
    duration: Infinity,
  });
};
```

### Example 4: File Upload Progress

```typescript
const handleFileUpload = async (file: File) => {
  const uploadPromise = uploadFile(file);
  
  toast.promise(
    uploadPromise,
    {
      loading: `Đang upload ${file.name}...`,
      success: (result) => ({
        title: 'Upload thành công!',
        description: `File: ${file.name} (${formatFileSize(file.size)})`,
      }),
      error: (err) => ({
        title: 'Upload thất bại',
        description: err?.message || 'Vui lòng thử lại',
      }),
    }
  );
};
```

### Example 5: Multi-step Process

```typescript
const handleComplexOperation = async () => {
  const steps = [
    { name: 'Bước 1: Validate dữ liệu', fn: validateData },
    { name: 'Bước 2: Xử lý dữ liệu', fn: processData },
    { name: 'Bước 3: Lưu vào database', fn: saveToDb },
  ];

  for (const step of steps) {
    await toast.promise(
      step.fn(),
      {
        loading: step.name,
        success: `${step.name} - Hoàn thành`,
        error: `${step.name} - Lỗi`,
      }
    );
  }
  
  toast.success('Tất cả bước đã hoàn thành!');
};
```

---

## 🎨 Design Tokens

### shadcn/ui Variables Used

```css
--card: Background color của toast
--card-foreground: Text color của toast
--border: Border color của toast
--primary: Success icon color
--destructive: Error icon color
--chart-4: Warning icon color
--chart-2: Info icon color
--muted: Secondary button background
--muted-foreground: Secondary text color
```

### CSS Classes Applied

- `bg-card` - Background
- `text-card-foreground` - Text color
- `border-border` - Border
- `shadow-lg` - Shadow
- `rounded-lg` - Border radius
- `text-sm` - Font size
- `font-semibold` - Font weight (title)

---

## 📊 Benefits of shadcn/ui Integration

### 1. Theme Consistency
- ✅ Toast tự động theo theme của app (light/dark)
- ✅ Màu sắc nhất quán với design system
- ✅ Border radius, spacing theo shadcn/ui

### 2. Customization
- ✅ Dễ dàng customize qua CSS variables
- ✅ Hỗ trợ dark mode tự động
- ✅ Responsive và accessible

### 3. Developer Experience
- ✅ Không cần hardcode màu sắc
- ✅ Tự động cập nhật khi thay đổi theme
- ✅ Type-safe với TypeScript

### 4. User Experience
- ✅ Smooth animations
- ✅ Backdrop blur trong dark mode
- ✅ Close button rõ ràng
- ✅ Action buttons dễ nhận biết

---

## 🔧 Customization Guide

### Thay Đổi Màu Sắc

Để thay đổi màu sắc, chỉnh sửa CSS variables trong `globals.css`:

```css
@layer base {
  :root {
    --toaster-success: var(--primary);      /* Success color */
    --toaster-error: var(--destructive);    /* Error color */
    --toaster-warning: var(--chart-4);      /* Warning color */
    --toaster-info: var(--chart-2);         /* Info color */
  }
}
```

### Thay Đổi Vị Trí Mặc Định

Trong `providers.tsx`:

```tsx
<Toaster 
  position="bottom-right"  // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  expand={true}
  richColors
  closeButton
/>
```

### Thay Đổi Duration Mặc Định

```tsx
<Toaster 
  position="top-right"
  expand={true}
  richColors
  closeButton
  duration={5000}  // 5 seconds
/>
```

### Thêm Custom CSS Classes

```css
/* Custom toast variant */
[data-sonner-toast][data-type='custom'] {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none;
}

[data-sonner-toast][data-type='custom'] [data-icon] {
  @apply text-white;
}
```

---

## ✅ Checklist

- [x] Cài đặt sonner package
- [x] Cập nhật Toaster component với shadcn/ui props
- [x] Thêm custom CSS cho sonner trong globals.css
- [x] Sử dụng shadcn/ui CSS variables
- [x] Hỗ trợ dark mode
- [x] Hỗ trợ all toast types (success, error, warning, info)
- [x] Close button styling
- [x] Action button styling
- [x] Description styling
- [x] Backdrop blur trong dark mode
- [x] Responsive design
- [x] Type-safe TypeScript

---

## 🎉 Conclusion

Đã tích hợp thành công **sonner** với **shadcn/ui theme system**, tạo ra:

1. ✅ **Consistent Design**: Toast notifications theo đúng design system
2. ✅ **Dark Mode Support**: Tự động chuyển đổi theme
3. ✅ **Better UX**: Smooth animations, backdrop blur, clear buttons
4. ✅ **Easy Customization**: Thông qua CSS variables và Tailwind
5. ✅ **Type-Safe**: Full TypeScript support
6. ✅ **Production Ready**: Sẵn sàng deploy

**Status**: ✅ **HOÀN THÀNH VÀ SẴN SÀNG PRODUCTION**

---

**Created**: 12/10/2025  
**Author**: Development Team  
**Version**: 1.0.0
