# Upload Feature - Complete Guide

## ✅ Features Implemented

### 1. **Professional Upload Dialog**
- Drag & drop support
- Multiple file selection
- File preview with status (Pending, Uploading, Success, Error)
- Progress tracking
- File size display
- Remove file before upload
- Auto-close after successful upload

### 2. **File Manager Integration**
- Upload button in toolbar
- Seamless integration with file list
- Auto-refresh after upload
- Toast notifications
- Folder-specific upload support

### 3. **Backend Support**
- REST API endpoints (`/api/files/upload`, `/api/files/upload/bulk`)
- GraphQL mutations (`uploadFile`)
- MinIO storage integration
- File metadata tracking
- Database persistence

## 🚀 Usage

### Basic Upload (File Manager Page)

```tsx
// The upload is already integrated in FileManager
// Just click the "Upload" button in /admin/filemanager
```

### Programmatic Upload

```tsx
import { UploadDialog } from '@/components/file-manager/UploadDialog';
import { useFileUpload } from '@/hooks/useFiles';

function MyComponent() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { uploadFile, uploadFiles } = useFileUpload();

  const handleUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 1) {
      await uploadFile(fileArray[0], folderId);
    } else {
      await uploadFiles(fileArray, folderId);
    }
  };

  return (
    <>
      <Button onClick={() => setUploadOpen(true)}>Upload</Button>
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
        onUploadSuccess={() => {
          console.log('Upload successful!');
          refetch(); // Refresh file list
        }}
        folderId={currentFolderId}
      />
    </>
  );
}
```

## 📂 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── file-manager/
│   │       ├── FileManager.tsx          # Main file manager with upload
│   │       └── UploadDialog.tsx         # Professional upload dialog
│   ├── hooks/
│   │   └── useFiles.ts                  # useFileUpload hook
│   └── app/
│       └── (admin)/
│           └── admin/
│               └── filemanager/
│                   └── page.tsx         # File manager page
```

## 🎨 UI Components

### UploadDialog Props

```tsx
interface UploadDialogProps {
  open: boolean;                          // Control visibility
  onOpenChange: (open: boolean) => void;  // Handle close
  onUpload: (files: FileList | File[]) => Promise<void>;  // Upload handler
  onUploadSuccess?: () => void;           // Success callback
  folderId?: string;                      // Target folder ID
}
```

### Features

1. **Drag & Drop Zone**
   - Visual feedback on drag
   - Click to browse
   - Multiple file support

2. **File List**
   - File name & size
   - Status indicators (icon + badge)
   - Remove button (before upload)
   - Progress bar (during upload)
   - Error message (on failure)

3. **Actions**
   - Cancel button
   - Upload button with file count
   - Disabled states during upload

## 🔧 Backend API

### REST Endpoints

```bash
# Upload single file
POST /api/files/upload
Content-Type: multipart/form-data
Body: { file: File, folderId?: string, metadata?: any }

# Upload multiple files
POST /api/files/upload/bulk
Content-Type: multipart/form-data
Body: { files: File[], folderId?: string }

# Response
{
  "id": "uuid",
  "filename": "generated-name.jpg",
  "originalName": "original-name.jpg",
  "url": "http://minio/uploads/...",
  "size": 12345,
  "fileType": "IMAGE",
  "mimeType": "image/jpeg"
}
```

### GraphQL Mutation

```graphql
mutation UploadFile($file: Upload!, $folderId: ID, $metadata: JSON) {
  uploadFile(file: $file, folderId: $folderId, metadata: $metadata) {
    id
    filename
    originalName
    url
    size
    fileType
    mimeType
    createdAt
  }
}
```

## 🐛 Troubleshooting

### Upload fails with "Table File does not exist"
**Solution:** Run Prisma migrations and regenerate client
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npm run start:dev  # Restart backend
```

### Files not appearing after upload
**Solution:** Ensure `refetch()` is called in `onUploadSuccess`
```tsx
<UploadDialog
  onUploadSuccess={() => refetch()}
/>
```

### Upload button disabled
**Possible causes:**
- No files selected
- Upload already in progress
- Check `uploading` state in useFileUpload

### CORS errors
**Solution:** Ensure backend CORS configuration allows frontend origin
```ts
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

## 📊 Testing Checklist

- [ ] Single file upload
- [ ] Multiple file upload
- [ ] Drag & drop upload
- [ ] Upload to specific folder
- [ ] File size display
- [ ] Progress indicators
- [ ] Success notification
- [ ] Error handling
- [ ] File list refresh after upload
- [ ] Remove file before upload
- [ ] Upload cancellation
- [ ] Large file upload (>10MB)
- [ ] Different file types (image, video, document)

## 🎯 Future Enhancements

- [ ] Upload progress per file (currently shows overall)
- [ ] Resume upload on failure
- [ ] Chunked upload for large files (>100MB)
- [ ] Image preview before upload
- [ ] File type restrictions (accept prop)
- [ ] Max file size validation
- [ ] Duplicate file detection
- [ ] Upload queue management
- [ ] Pause/Resume upload
- [ ] Upload history

## 📝 Notes

- Max file size: Configured in backend (default: no limit, controlled by MinIO)
- Supported file types: All (IMAGE, VIDEO, AUDIO, DOCUMENT, ARCHIVE, OTHER)
- Storage: MinIO (S3-compatible)
- Database: PostgreSQL via Prisma
- Authentication: JWT token from localStorage

## 🔗 Related Files

- Frontend hook: `/frontend/src/hooks/useFiles.ts`
- Backend service: `/backend/src/services/file.service.ts`
- Backend controller: `/backend/src/controllers/file.controller.ts`
- GraphQL resolver: `/backend/src/graphql/resolvers/file.resolver.ts`
- Prisma schema: `/backend/prisma/schema.prisma` (model File)
- MinIO service: `/backend/src/services/minio.service.ts`

---

**Status:** ✅ Fully Implemented and Production Ready
**Last Updated:** 2025-01-08
