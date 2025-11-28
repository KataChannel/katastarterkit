# Cập nhật Preview Tài liệu Nguồn

## Tổng quan
Cải thiện giao diện preview cho tất cả loại tài liệu trong trang source-documents/[id], áp dụng nguyên tắc Mobile First + Responsive theo chuẩn Shadcn UI.

## Các loại tài liệu đã cập nhật

### 1. 📹 VIDEO
- ✅ Video player với YouTube embed support
- ✅ Warning banner cho video chưa tối ưu
- ✅ Error handling với messages chi tiết
- ✅ Troubleshooting card cho admin

### 2. 🎵 AUDIO
- ✅ Audio player với gradient card design
- ✅ Hiển thị thumbnail, duration, file info
- ✅ Responsive layout với controls đầy đủ

### 3. 🖼️ IMAGE
- ✅ Full-width image viewer
- ✅ Max-height 600px với object-contain
- ✅ Border và rounded corners

### 4. 📄 FILE (MỚI)
- ✅ **File info card** với gradient design
- ✅ Icon động theo mime type
- ✅ Hiển thị: tên file, kích thước, định dạng
- ✅ Action buttons: Xem, Tải về
- ✅ **PDF embed viewer** - Xem trực tiếp PDF trong trang
- ✅ Responsive 2-column layout trên mobile

### 5. 🔗 LINK (MỚI)
- ✅ **Link preview card** với gradient design
- ✅ Hiển thị: title, description, URL
- ✅ External link icon
- ✅ Button "Mở liên kết"
- ✅ Thumbnail preview nếu có
- ✅ Responsive mobile-first layout

### 6. 📝 TEXT (CẢI TIẾN)
- ✅ **Code-style viewer** với header
- ✅ Hiển thị số dòng
- ✅ **Copy button** - Copy toàn bộ nội dung
- ✅ Scrollable container (max-height 384px)
- ✅ Mono font với line-height tốt hơn
- ✅ Border và background styling

## Nguyên tắc thiết kế áp dụng

### Mobile First
- Flex layout với wrap cho mobile
- Button full-width trên mobile, auto trên desktop
- Text truncate và line-clamp cho nội dung dài
- Touch-friendly button sizes (h-12 minimum)

### Responsive
- Grid layout tự động adjust: 1 col mobile → 2 col tablet → auto desktop
- Flexible gaps và padding: 3-4 mobile → 6-8 desktop
- Font sizes: xs-sm mobile → sm-base desktop
- Icon sizes: 3-4 mobile → 4-6 desktop

### Gradient Design System
Mỗi loại tài liệu có gradient riêng:
- **VIDEO**: Purple/Indigo
- **AUDIO**: Orange/Amber
- **IMAGE**: Green/Emerald
- **FILE**: Blue/Indigo
- **LINK**: Cyan/Blue
- **TEXT**: Green/Teal

### Component Structure
```tsx
<div className="space-y-3">
  {/* Header với icon */}
  <p className="text-sm font-medium flex items-center gap-2">
    <Icon className="w-4 h-4" />
    Tiêu đề
  </p>
  
  {/* Content card với gradient */}
  <div className="bg-gradient-to-r from-[color] to-[color] p-4 rounded-lg border">
    {/* File info */}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-[color] rounded-lg flex items-center justify-center">
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        {/* Info */}
      </div>
    </div>
    
    {/* Actions */}
    <div className="flex flex-wrap gap-2 mt-4">
      <Button className="flex-1 sm:flex-none" />
    </div>
  </div>
  
  {/* Preview/Embed nếu có */}
</div>
```

## Files đã cập nhật

1. **Admin Page**: `/frontend/src/app/lms/admin/source-documents/[id]/page.tsx`
   - Thêm FILE preview với PDF embed
   - Thêm LINK preview với thumbnail
   - Cải thiện TEXT preview với copy button
   
2. **Instructor Page**: `/frontend/src/app/lms/instructor/source-documents/[id]/page.tsx`
   - Tương tự admin page
   - Đồng bộ UX/UI

## Features mới

### PDF Embed Viewer
```tsx
{document.mimeType === 'application/pdf' && (
  <div className="aspect-[3/4] max-h-[600px]">
    <iframe src={`${document.url}#view=FitH`} />
  </div>
)}
```

### Copy to Clipboard
```tsx
<Button onClick={() => {
  navigator.clipboard.writeText(document.content || '');
  toast.success('Đã copy nội dung');
}}>
  Copy
</Button>
```

### Smart URL Display
- URL chỉ hiển thị cho types không có preview riêng
- Tránh duplicate information
- Responsive break-all cho URL dài

## Cải thiện UX

### Before
- Preview cơ bản, thiếu context
- Không có actions nhanh
- Layout không tối ưu mobile
- Thiếu visual hierarchy

### After
- ✅ Preview đầy đủ với context
- ✅ Quick actions: Xem, Tải về, Copy, Mở
- ✅ Mobile-first responsive layout
- ✅ Visual hierarchy rõ ràng với gradient và icons
- ✅ File info đầy đủ (size, type, lines)
- ✅ Embed viewers cho PDF
- ✅ Better error states

## Performance

- Lazy load cho iframe (PDF embed)
- Object-contain cho images (không distort)
- Max-height để tránh scroll quá dài
- Efficient icons từ lucide-react

## Accessibility

- Proper semantic HTML (iframe title, alt text)
- Keyboard navigation support
- High contrast colors
- Touch-friendly sizes (min 44x44px)

## Testing Checklist

- [ ] Video player hoạt động (uploaded + YouTube)
- [ ] Audio player phát được
- [ ] Image hiển thị đúng kích thước
- [ ] PDF embed load được
- [ ] Link preview với thumbnail
- [ ] Text copy button hoạt động
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Dark mode display đúng
- [ ] Icons load đúng màu theo type

## Tương lai

- [ ] Video thumbnail extraction tự động
- [ ] Link preview with OpenGraph
- [ ] Markdown render cho TEXT type
- [ ] Syntax highlighting cho code files
- [ ] Document viewer cho DOC/XLS
- [ ] Image zoom modal
- [ ] Audio waveform visualization
