# Hướng Dẫn Sử Dụng Tính Năng Import/Export Dữ Liệu và Upload Hình Ảnh

## Tổng Quan

Dự án đã được bổ sung 2 tính năng chính:
1. **Import/Export Dữ Liệu**: Copy dữ liệu từ Excel, Text, JSON → Edit → Mapping → Lưu vào Database
2. **Upload & Edit Hình Ảnh**: Copy hình ảnh → Edit → Upload MinIO → Mapping → Lưu vào Database

Cả 2 tính năng đều sử dụng **Dynamic GraphQL Engine** để tự động làm việc với bất kỳ model nào trong database.

---

## 🎯 Backend Services

### 1. Data Import/Export Service
📁 `backend/src/services/data-import.service.ts`

**Chức năng:**
- ✅ Parse dữ liệu từ Excel (XLSX)
- ✅ Parse dữ liệu từ JSON
- ✅ Parse dữ liệu từ Text/CSV/TSV
- ✅ Auto mapping và transformation fields
- ✅ Import vào bất kỳ model nào qua Dynamic GraphQL
- ✅ Bulk import với transaction
- ✅ Export dữ liệu ra Excel
- ✅ Validate dữ liệu trước khi import

**Methods chính:**
```typescript
parseExcel(buffer: Buffer): any[]
parseJSON(jsonString: string): any[]
parseText(text: string, delimiter: string): any[]
mapData(sourceData: any[], config: MappingConfig): any[]
importToDatabase(modelName: string, data: any[], config?: MappingConfig): Promise<ImportDataResult>
bulkImportToDatabase(modelName: string, data: any[], config?: MappingConfig): Promise<ImportDataResult>
exportToExcel(modelName: string, where?: any, select?: any): Promise<Buffer>
validateData(data: any[], requiredFields: string[]): { valid: boolean; errors: string[] }
```

### 2. Image Upload Service
📁 `backend/src/services/image-upload.service.ts`

**Chức năng:**
- ✅ Upload hình ảnh lên MinIO
- ✅ Edit hình ảnh với Sharp: resize, crop, rotate, flip, flop, blur, sharpen, greyscale
- ✅ Convert format: JPEG, PNG, WebP, AVIF
- ✅ Mapping tự động vào database record
- ✅ Upload multiple images
- ✅ Copy image từ URL
- ✅ Batch upload và map
- ✅ Generate thumbnail
- ✅ Validate image

**Methods chính:**
```typescript
uploadImage(buffer: Buffer, filename: string, bucket: string, editOptions?: ImageEditOptions): Promise<ImageUploadResult>
uploadAndMapImage(buffer: Buffer, filename: string, mappingConfig: ImageMappingConfig, editOptions?: ImageEditOptions): Promise<{ uploadResult, mappingResult }>
uploadMultipleImages(images: Array<{buffer, filename}>, bucket: string, editOptions?: ImageEditOptions): Promise<ImageUploadResult[]>
copyImageFromUrl(imageUrl: string, filename: string, bucket: string, editOptions?: ImageEditOptions): Promise<ImageUploadResult>
batchUploadAndMap(items: Array<{buffer, filename, mappingConfig, editOptions}>): Promise<Array<{uploadResult, mappingResult, error?}>>
generateThumbnail(buffer: Buffer, width: number, height: number): Promise<Buffer>
validateImage(buffer: Buffer): Promise<{ valid: boolean; error?: string; metadata?: any }>
```

### 3. GraphQL Resolvers
📁 `backend/src/graphql/resolvers/data-import-export.resolver.ts`

**Mutations:**
```graphql
# Import Excel
importExcelData(file: Upload!, modelName: String!, mappingConfig: JSON): ImportDataResult

# Import JSON
importJSONData(jsonString: String!, modelName: String!, mappingConfig: JSON): ImportDataResult

# Import Text/CSV
importTextData(text: String!, modelName: String!, delimiter: String, mappingConfig: JSON): ImportDataResult

# Bulk Import
bulkImportData(data: JSON!, modelName: String!, mappingConfig: JSON): ImportDataResult

# Export to Excel
exportDataToExcel(modelName: String!, where: JSON, select: JSON): String

# Upload Image
uploadImage(file: Upload!, bucket: String, editOptions: JSON): ImageUploadResult

# Upload and Map Image
uploadAndMapImage(file: Upload!, mappingConfig: JSON!, editOptions: JSON): UploadAndMapResult

# Upload Multiple Images
uploadMultipleImages(files: [Upload!]!, bucket: String, editOptions: JSON): [ImageUploadResult]

# Copy Image from URL
copyImageFromUrl(imageUrl: String!, filename: String!, bucket: String, editOptions: JSON): ImageUploadResult

# Batch Upload and Map
batchUploadAndMap(items: JSON!): [BatchUploadResult]
```

**Queries:**
```graphql
# Validate Import Data
validateImportData(data: JSON!, requiredFields: [String!]!): ValidationResult
```

---

## 🎨 Frontend Components

### 1. DataImportComponent
📁 `frontend/src/components/DataImport.tsx`

**Features:**
- ✅ Tabs cho Excel, Text/CSV, JSON
- ✅ Copy/Paste dữ liệu trực tiếp
- ✅ Upload file Excel, CSV, JSON
- ✅ Preview dữ liệu trước khi import
- ✅ Field mapping UI với source → target
- ✅ Auto-detect headers và generate mappings
- ✅ Chọn model/table đích
- ✅ Import progress và result display
- ✅ Error handling và validation

**Props:**
```typescript
interface DataImportProps {
  modelName?: string;
  onImportComplete?: (result: any) => void;
}
```

**Usage:**
```tsx
<DataImportComponent
  modelName="product"
  onImportComplete={(result) => console.log(result)}
/>
```

### 2. ImageUploadComponent
📁 `frontend/src/components/ImageUpload.tsx`

**Features:**
- ✅ Upload file hình ảnh
- ✅ Paste hình ảnh từ clipboard (Ctrl+V)
- ✅ Copy hình ảnh từ URL
- ✅ Preview hình ảnh real-time
- ✅ Edit tools: Resize, Rotate, Flip, Flop, Quality, Format
- ✅ Canvas-based image editing
- ✅ Auto mapping configuration
- ✅ Upload progress và result display

**Props:**
```typescript
interface ImageUploadProps {
  modelName?: string;
  recordId?: string;
  imageField?: string;
  onUploadComplete?: (result: any) => void;
}
```

**Usage:**
```tsx
<ImageUploadComponent
  modelName="product"
  recordId="123"
  imageField="imageUrl"
  onUploadComplete={(result) => console.log(result)}
/>
```

---

## 🔧 Frontend Services

### 1. DataImportExportService
📁 `frontend/src/services/dataImportExport.ts`

**Methods:**
```typescript
importExcelData(file: File, modelName: string, mappingConfig?: MappingConfig): Promise<ImportDataResult>
importJSONData(jsonString: string, modelName: string, mappingConfig?: MappingConfig): Promise<ImportDataResult>
importTextData(text: string, modelName: string, delimiter: string, mappingConfig?: MappingConfig): Promise<ImportDataResult>
bulkImportData(data: any[], modelName: string, mappingConfig?: MappingConfig): Promise<ImportDataResult>
validateImportData(data: any[], requiredFields: string[]): Promise<{valid: boolean; errors: string[]}>
exportDataToExcel(modelName: string, where?: any, select?: any): Promise<string>
downloadExcelFile(base64Data: string, filename: string): void
```

### 2. ImageUploadService
📁 `frontend/src/services/imageUpload.ts`

**Methods:**
```typescript
uploadImage(file: File, bucket: string, editOptions?: ImageEditOptions): Promise<ImageUploadResult>
uploadAndMapImage(file: File, mappingConfig: ImageMappingConfig, editOptions?: ImageEditOptions): Promise<{uploadResult, mappingResult}>
uploadMultipleImages(files: File[], bucket: string, editOptions?: ImageEditOptions): Promise<ImageUploadResult[]>
copyImageFromUrl(imageUrl: string, filename: string, bucket: string, editOptions?: ImageEditOptions): Promise<ImageUploadResult>
batchUploadAndMap(items: Array<{file, mappingConfig, editOptions}>): Promise<Array<{uploadResult, mappingResult, error?}>>
validateImageFile(file: File): {valid: boolean; error?: string}
createImagePreview(file: File): Promise<string>
resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File>
downloadImageAsFile(url: string, filename: string): Promise<File>
```

---

## 📱 Demo Page

📁 `frontend/src/app/admin/data-management/page.tsx`

**URL:** `/admin/data-management`

**Features:**
- 2 tabs chính: Data Import/Export và Image Upload
- Tích hợp đầy đủ cả 2 components
- Hướng dẫn sử dụng chi tiết
- Responsive design (Mobile First)
- UI/UX theo chuẩn shadcn/ui

---

## 🚀 Hướng Dẫn Sử Dụng

### A. Import Dữ Liệu

#### 1. Từ Excel
```
1. Mở Excel, copy dữ liệu (bao gồm cả header)
2. Vào page /admin/data-management
3. Tab "Data Import/Export" → Tab "Excel"
4. Chọn Model (ví dụ: product)
5. Paste vào ô textarea (Ctrl+V)
6. Click "Preview Dữ Liệu"
7. Kiểm tra Field Mapping
8. Click "Import vào product"
```

#### 2. Từ JSON
```
1. Copy JSON data (array hoặc object)
2. Tab "JSON"
3. Paste JSON vào textarea
4. Click "Preview Dữ Liệu"
5. Điều chỉnh mapping nếu cần
6. Click "Import"
```

#### 3. Từ Text/CSV
```
1. Copy text data (tab hoặc comma separated)
2. Tab "Text/CSV"
3. Paste vào textarea
4. Click "Preview Dữ Liệu"
5. Mapping và Import
```

### B. Upload Hình Ảnh

#### 1. Upload từ File
```
1. Tab "Image Upload"
2. Click vào ô upload hoặc kéo thả file
3. Chọn file hình ảnh
4. Preview và edit nếu cần
5. Click "Upload lên MinIO"
```

#### 2. Paste từ Clipboard
```
1. Copy hình ảnh (Ctrl+C)
2. Click vào ô upload
3. Paste (Ctrl+V)
4. Preview và edit
5. Upload
```

#### 3. Copy từ URL
```
1. Tab "Copy từ URL"
2. Nhập URL hình ảnh
3. Click "Copy"
4. Preview và edit
5. Upload
```

#### 4. Edit Hình Ảnh
```
Resize: Nhập width/height
Rotate: Kéo slider để xoay (0-360°)
Quality: Điều chỉnh chất lượng (1-100%)
Format: Chọn JPEG/PNG/WebP
Flip/Flop: Click button để lật ảnh
```

---

## 🔌 Tích Hợp với Dynamic GraphQL

### Mapping Configuration

```typescript
// Data Import Mapping
const mappingConfig = {
  modelName: 'product',
  fieldMappings: {
    'Tên SP': 'name',
    'Giá': 'price',
    'Mô tả': 'description'
  },
  transformations: {
    price: (value) => parseFloat(value),
    name: (value) => value.trim()
  }
};

// Image Mapping
const imageMappingConfig = {
  modelName: 'product',
  idField: 'id',
  imageField: 'imageUrl',
  recordId: '123'
};
```

### Code Example

```typescript
// Import data
import DataImportService from '@/services/dataImportExport';

const result = await DataImportService.importExcelData(
  file,
  'product',
  mappingConfig
);

// Upload image
import ImageUploadService from '@/services/imageUpload';

const result = await ImageUploadService.uploadAndMapImage(
  file,
  imageMappingConfig,
  {
    resize: { width: 800, height: 600 },
    quality: 85,
    format: 'webp'
  }
);
```

---

## 📦 Dependencies

Backend cần install thêm:
```bash
cd backend
bun add xlsx sharp
```

Frontend đã có đủ dependencies trong project.

---

## ✨ Ưu Điểm

1. **Dynamic & Flexible**: Hoạt động với bất kỳ model nào nhờ Dynamic GraphQL Engine
2. **User-Friendly**: UI/UX trực quan, dễ sử dụng
3. **Powerful Editing**: Edit hình ảnh ngay trên browser với Sharp
4. **Auto Mapping**: Tự động mapping fields, giảm thiểu công sức
5. **Validation**: Validate dữ liệu trước khi import
6. **Error Handling**: Xử lý lỗi chi tiết, báo cáo từng dòng
7. **Batch Processing**: Hỗ trợ import/upload hàng loạt
8. **Mobile First**: Responsive hoàn toàn, PWA ready

---

## 🎓 Technical Stack

- **Backend**: NestJS + GraphQL + Prisma + MinIO + Sharp + XLSX
- **Frontend**: Next.js 14 + TypeScript + Apollo Client + shadcn/ui + Tailwind CSS
- **Architecture**: Dynamic GraphQL Engine + Senior-level code patterns
- **Storage**: MinIO Object Storage
- **Database**: PostgreSQL (via Prisma)

---

## 📝 Notes

- Tất cả code đã follow rule từ `rulepromt.txt`:
  ✅ Sử dụng Dynamic GraphQL
  ✅ Code Like Senior
  ✅ Frontend chuẩn shadcn UI + Mobile First + Responsive + PWA
  ✅ Bỏ qua testing
  ✅ Không git (do rule yêu cầu)
  ✅ Tài liệu ngắn gọn bằng tiếng Việt

- Services đã được tích hợp vào GraphQL module
- Components đã sẵn sàng sử dụng
- Demo page đã có đầy đủ tính năng

---

## 🔗 Files Đã Tạo

**Backend:**
1. `backend/src/services/data-import.service.ts`
2. `backend/src/services/image-upload.service.ts`
3. `backend/src/graphql/resolvers/data-import-export.resolver.ts`
4. `backend/src/graphql/graphql.module.ts` (updated)

**Frontend:**
1. `frontend/src/components/DataImport.tsx`
2. `frontend/src/components/ImageUpload.tsx`
3. `frontend/src/services/dataImportExport.ts`
4. `frontend/src/services/imageUpload.ts`
5. `frontend/src/app/admin/data-management/page.tsx`

**Documentation:**
1. `docs/DATA_IMPORT_EXPORT_GUIDE.md` (file này)

---

Chúc bạn sử dụng tốt! 🚀
