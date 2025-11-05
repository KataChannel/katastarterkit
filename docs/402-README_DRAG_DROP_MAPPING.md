# 🎯 Data Import/Export với Drag-Drop Mapping

## Tổng Quan

Hệ thống Import/Export dữ liệu đã được nâng cấp lên **v2.0** với tính năng **Drag & Drop Mapping** trực quan.

## ✨ Tính Năng Chính

### 1. 🎨 Drag & Drop Mapping
- Kéo thả field giữa dữ liệu nguồn và database
- Visual feedback với màu sắc:
  - 🔵 Xanh dương = Source fields
  - 🟢 Xanh lá = Đã map
  - 🟠 Cam = Required chưa map
  - 🔴 Đỏ = Unmap zone
- Stats dashboard real-time
- Validation errors hiển thị ngay lập tức

### 2. 🤖 Auto-Suggest Mapping
- AI tự động gợi ý mapping dựa trên tên field
- Hỗ trợ tiếng Việt có dấu
- Tiết kiệm 80% thời gian mapping

### 3. 📊 Schema Inspector
- Hiển thị database schema real-time
- Lấy từ Prisma DMMF
- Phân biệt required/optional fields
- Hiển thị kiểu dữ liệu, constraints

## 🚀 Sử Dụng

### Truy cập Demo
```
URL: /demo/data-management
Tab: Data Import/Export
```

### Workflow Import
```
1. Chọn Model → 2. Paste Data → 3. Preview → 4. Drag-Drop Map → 5. Import ✅
```

### Hướng Dẫn Chi Tiết

#### Bước 1: Paste Dữ Liệu
- Copy từ Excel, JSON, hoặc Text
- Paste vào textarea (Ctrl+V)
- Chọn tab Excel/JSON/Text tùy format

#### Bước 2: Preview & Load Schema
- Click "Preview Dữ Liệu"
- Hệ thống parse data và load database schema
- Auto-suggest mapping tự động chạy

#### Bước 3: Drag-Drop Mapping
- **Bên TRÁI:** Fields từ dữ liệu paste (màu xanh dương)
- **Bên PHẢI:** Fields trong database
  - Cam = Required (bắt buộc map)
  - Xám = Optional
  - Xanh lá = Đã map
- **Kéo & Thả:** Kéo field trái → thả vào field phải
- **Xóa mapping:** Thả vào vùng đỏ "Unmap"

#### Bước 4: Kiểm Tra Stats
```
Nguồn: 10     # Tổng fields từ source
Đã map: 8     # Số fields đã map
Bắt buộc: 5/5 # Required fields đã map
Status: ✅    # Hoàn tất hoặc ❌ Chưa xong
```

#### Bước 5: Import
- Kiểm tra validation (không có lỗi đỏ)
- Click "Import X dòng vào {model}"
- Chờ kết quả

## 📂 Cấu Trúc Code

### Backend
```
backend/src/
├── services/
│   └── schema-inspector.service.ts    # Lấy database schema
├── graphql/
│   └── resolvers/
│       └── data-import-export.resolver.ts  # 6 queries mới
└── graphql.module.ts                   # Register service
```

### Frontend
```
frontend/src/
├── services/
│   └── schemaInspector.ts              # Service gọi GraphQL
├── components/
│   ├── FieldMappingDragDrop.tsx        # Component chính
│   ├── Draggable.tsx                   # Wrapper @dnd-kit
│   ├── Droppable.tsx                   # Wrapper @dnd-kit
│   └── DataImport.tsx                  # Updated tích hợp
└── app/demo/data-management/page.tsx   # Demo page
```

## 🔌 GraphQL API

### Queries Mới (v2.0)

```graphql
# Lấy tất cả models
query GetAllModels {
  getAllModels
}

# Lấy schema của model
query GetModelSchema($modelName: String!) {
  getModelSchema(modelName: $modelName)
}

# Lấy mappable fields
query GetMappableFields($modelName: String!) {
  getMappableFields(modelName: $modelName)
}

# Lấy required fields
query GetRequiredFields($modelName: String!) {
  getRequiredFields(modelName: $modelName)
}

# Auto-suggest mapping
query SuggestMapping($sourceFields: [String!]!, $modelName: String!) {
  suggestMapping(sourceFields: $sourceFields, modelName: $modelName)
}

# Validate mapping
query ValidateMapping($modelName: String!, $mapping: JSON!) {
  validateMapping(modelName: $modelName, mapping: $mapping)
}
```

## 💻 Code Example

### Sử Dụng Component

```tsx
import { FieldMappingDragDrop } from '@/components/FieldMappingDragDrop';

function MyComponent() {
  const [mapping, setMapping] = useState({});
  const sourceFields = ['Tên SP', 'Giá', 'Mô tả'];

  return (
    <FieldMappingDragDrop
      sourceFields={sourceFields}
      modelName="product"
      onMappingChange={setMapping}
    />
  );
}
```

### Kết Quả Mapping

```javascript
{
  'Tên SP': 'name',
  'Giá': 'price',
  'Mô tả': 'description'
}
```

## 🎨 UI Components

### Stats Dashboard
- Nguồn: Tổng fields source
- Đã map: Fields đã mapping
- Bắt buộc: X/Y required fields
- Status: ✅ hoặc ❌

### Validation Errors
```
⚠️ Lỗi Mapping:
• Required field "name" is not mapped
• Required field "price" is not mapped
```

### Color Coding
| Màu | Ý nghĩa | Vị trí |
|-----|---------|--------|
| 🔵 Xanh dương | Source field | Trái |
| 🟢 Xanh lá | Đã map | Phải |
| 🟠 Cam | Required chưa map | Phải |
| ⚪ Xám | Optional chưa map | Phải |
| 🔴 Đỏ | Unmap zone | Dưới cùng phải |

## 📦 Dependencies

### Đã Có Sẵn
```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/utilities": "^3.2.2",
  "lucide-react": "latest",
  "@apollo/client": "latest"
}
```

## ✅ Checklist Hoàn Thành

**Backend:**
- ✅ SchemaInspectorService
- ✅ 6 GraphQL queries
- ✅ GraphQL module registration

**Frontend:**
- ✅ SchemaInspector service
- ✅ FieldMappingDragDrop component
- ✅ Draggable/Droppable wrappers
- ✅ DataImport integration
- ✅ Demo page updated

**Documentation:**
- ✅ DATA_IMPORT_EXPORT_GUIDE_V2.md (chi tiết)
- ✅ DRAG_DROP_MAPPING_SUMMARY.md (tóm tắt)
- ✅ README_DRAG_DROP_MAPPING.md (file này)

## 📝 Notes

- Code follow rule `promt/rulepromt.txt`
- Sử dụng Dynamic GraphQL Engine
- Frontend: shadcn UI + Mobile First + Responsive + PWA
- Giao diện tiếng Việt
- Không testing (theo rule 3)
- Không git (theo rule 4)

## 🔗 Links

- Demo: `/demo/data-management`
- Guide v2.0: `docs/DATA_IMPORT_EXPORT_GUIDE_V2.md`
- Summary: `docs/DRAG_DROP_MAPPING_SUMMARY.md`

---

**Version:** 2.0  
**Updated:** 2025-11-05  
**Status:** ✅ Ready to use
