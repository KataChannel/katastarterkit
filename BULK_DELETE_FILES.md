# Tính Năng Xóa File Hàng Loạt

## Mục Tiêu
Thêm tính năng xóa nhiều file cùng lúc trong File Manager, tuân thủ rules từ `rulepromt.txt`.

## Thay Đổi

### File: `frontend/src/components/file-manager/FileManager.tsx`

#### 1. State Management
```typescript
// Thêm states cho delete dialog
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
```

#### 2. Delete Logic
**Trước (dùng browser confirm ❌)**:
```typescript
const handleBulkDelete = async () => {
  if (confirm(`Delete ${selectedFiles.size} selected file(s)?`)) {
    // delete logic
  }
};
```

**Sau (dùng Dialog chuẩn Shadcn UI ✅)**:
```typescript
const openDeleteDialog = () => {
  if (selectedFiles.size === 0) return;
  setDeleteDialogOpen(true);
};

const confirmBulkDelete = async () => {
  setIsDeleting(true);
  try {
    await bulkDeleteFiles({ fileIds: Array.from(selectedFiles) });
    toast({
      type: 'success',
      title: 'Xóa thành công',
      description: `Đã xóa ${selectedFiles.size} file`,
    });
    setSelectedFiles(new Set());
    setDeleteDialogOpen(false);
    refetch();
  } catch (error: any) {
    toast({
      type: 'error',
      title: 'Lỗi xóa file',
      description: error.message || 'Không thể xóa file',
      variant: 'destructive',
    });
  } finally {
    setIsDeleting(false);
  }
};
```

#### 3. UI Components

**Button "Xóa"** (chỉ hiện khi có file được chọn):
```tsx
{selectedFiles.size > 0 && (
  <Button
    variant="destructive"
    size="sm"
    onClick={openDeleteDialog}
  >
    <Trash2 className="w-4 h-4 mr-2" />
    Xóa ({selectedFiles.size})
  </Button>
)}
```

**Delete Confirmation Dialog** (tuân thủ Rule #12):
- ✅ **Header**: Tiêu đề + icon cảnh báo
- ✅ **Content Scrollable**: Danh sách file sẽ xóa (max 5 hiển thị)
- ✅ **Footer**: Nút Hủy + Xóa
- ✅ **Tiếng Việt**: Tất cả text
- ✅ **Warning Box**: Cảnh báo màu amber về hành động không thể hoàn tác
- ✅ **Loading State**: Spinner khi đang xóa

```tsx
<Card className="relative z-50 w-full max-w-md mx-4">
  {/* Header */}
  <CardHeader className="border-b">
    <CardTitle>Xác nhận xóa file</CardTitle>
    <p>Hành động này không thể hoàn tác</p>
  </CardHeader>

  {/* Content - Scrollable */}
  <CardContent className="max-h-[60vh] overflow-y-auto">
    {/* Warning box */}
    <div className="bg-amber-50 border-amber-200">
      Bạn đang xóa {selectedFiles.size} file...
    </div>
    
    {/* File list */}
    <ul>
      {files to delete...}
    </ul>
  </CardContent>

  {/* Footer - Fixed */}
  <div className="border-t p-4">
    <Button onClick={cancelDelete}>Hủy</Button>
    <Button onClick={confirmDelete} disabled={isDeleting}>
      {isDeleting ? "Đang xóa..." : "Xóa"}
    </Button>
  </div>
</Card>
```

## Tuân Thủ Rules

### ✅ Rule #10: Mobile First + Responsive
- Dialog responsive với `max-w-md mx-4`
- Content scrollable với `max-h-[60vh] overflow-y-auto`
- Touch-friendly buttons

### ✅ Rule #11: Giao diện tiếng Việt
- "Xác nhận xóa file"
- "Hành động này không thể hoàn tác"
- "Cảnh báo"
- "Đang xóa..."
- "Xóa thành công"

### ✅ Rule #12: Dialog Layout Chuẩn
- Header với border-b
- Content scrollable
- Footer fixed với actions

## Tính Năng

### 1. Multi-Select
- Click vào file để chọn (ring-2 ring-blue-500)
- Checkbox mode (nếu allowMultiple = true)
- Hiển thị số file đã chọn trên nút Xóa

### 2. Bulk Delete
- Xóa nhiều file cùng lúc
- Confirmation dialog với danh sách file
- Loading state khi đang xóa
- Toast notification thành công/thất bại

### 3. Safety Features
- Warning box màu amber
- Liệt kê tên file (max 5, sau đó "... và X file khác")
- Disable actions khi đang xóa
- Click backdrop để đóng (chỉ khi không đang xóa)

## API Backend

Hook `useBulkDeleteFiles()` gọi GraphQL mutation:

```graphql
mutation BulkDeleteFiles($input: BulkDeleteFilesInput!) {
  bulkDeleteFiles(input: $input)
}
```

Input:
```typescript
{
  fileIds: string[] // Array of file IDs to delete
}
```

Return: `number` (số file đã xóa)

## Testing

### User Flow
1. Vào `/admin/filemanager`
2. Click vào 1 hoặc nhiều file để chọn
3. Nút "Xóa (X)" xuất hiện
4. Click nút → Dialog hiện lên
5. Xem danh sách file sẽ xóa
6. Click "Xóa" → Loading spinner
7. Toast "Xóa thành công"
8. File biến mất khỏi list

### Edge Cases
- ✅ Không có file được chọn → Nút Xóa không hiện
- ✅ Đang xóa → Disable tất cả actions
- ✅ Lỗi xóa → Toast error message
- ✅ Chọn > 5 file → "... và X file khác"

## Dependencies

Tất cả đã có sẵn:
- `useBulkDeleteFiles()` hook
- Shadcn UI components (Card, Button, Dialog)
- Toast notifications
- Lucide icons
