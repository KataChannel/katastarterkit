# Support Chat - Hướng dẫn tùy chỉnh màu sắc

## Cách thay đổi màu Support Chat

### 1. Trong Admin Settings (Khuyến nghị)

Truy cập: `/admin/settings/website` → Tab "Support Chat"

Cấu hình:
- **Primary Color**: Màu chủ đạo (mặc định: `#16a34a` - xanh lá)
- **Position**: Vị trí hiển thị
- **Enabled**: Bật/tắt widget

### 2. Code trực tiếp (Testing)

#### File: `frontend/src/components/support-chat/SupportChatWidgetWrapper.tsx`

```tsx
<SupportChatWidget
  apiUrl={apiUrl}
  websocketUrl={websocketUrl}
  primaryColor="#16a34a"  // ← Thay đổi màu ở đây
  position="bottom-right"
/>
```

### 3. Ví dụ màu sắc phổ biến

#### E-commerce
```tsx
primaryColor="#16a34a"  // Xanh lá (Green-600) - tin cậy
primaryColor="#2563eb"  // Xanh dương (Blue-600) - chuyên nghiệp
primaryColor="#dc2626"  // Đỏ (Red-600) - khuyến mãi
```

#### Brand Colors
```tsx
primaryColor="#ea580c"  // Cam (Orange-600) - năng động
primaryColor="#7c3aed"  // Tím (Violet-600) - sáng tạo
primaryColor="#0891b2"  // Xanh ngọc (Cyan-600) - công nghệ
```

#### Neutral
```tsx
primaryColor="#0f172a"  // Đen (Slate-900) - sang trọng
primaryColor="#6b7280"  // Xám (Gray-500) - trung tính
```

### 4. Kiểm tra màu hoạt động

Màu sẽ được áp dụng cho:
- ✅ Nút chat tròn (chat button)
- ✅ Header gradient background
- ✅ Nút "Bắt đầu chat"
- ✅ Nút gửi tin nhắn (send button)
- ✅ Message bubbles từ khách hàng

### 5. Troubleshooting

**Vấn đề**: Màu không thay đổi?

**Giải pháp**:
1. Clear browser cache (Ctrl + Shift + R)
2. Kiểm tra DevTools → Elements → Button có class `bg-[var(--chat-primary)]`
3. Kiểm tra inline style có `--chat-primary: #màu`
4. Restart dev server

**Technical Details**:
```tsx
// Sử dụng CSS Variables để override Shadcn Button
style={{ '--chat-primary': primaryColor } as React.CSSProperties}
className="bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)]"
```

### 6. Advanced: Gradient Colors

Nếu muốn gradient, tạo custom class:

```tsx
// tailwind.config.ts
theme: {
  extend: {
    backgroundImage: {
      'chat-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  }
}

// Component
className="bg-chat-gradient"
```

### 7. Accessibility

**Lưu ý khi chọn màu**:
- Đảm bảo contrast ratio ≥ 4.5:1 với text trắng
- Test với colorblind users
- Tránh màu quá sáng (khó đọc)

**Tool kiểm tra**: https://webaim.org/resources/contrastchecker/

---

## Demo Code

```tsx
// Test nhiều màu
const colors = [
  '#16a34a', // Green
  '#2563eb', // Blue
  '#dc2626', // Red
  '#ea580c', // Orange
  '#7c3aed', // Purple
];

// Chọn random
const randomColor = colors[Math.floor(Math.random() * colors.length)];

<SupportChatWidget
  primaryColor={randomColor}
  position="bottom-right"
/>
```
