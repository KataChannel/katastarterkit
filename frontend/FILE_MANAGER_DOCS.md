# File Manager - Senior Level Implementation

## 📁 Tổng quan

File Manager đã được nâng cấp lên phiên bản chuyên nghiệp với giao diện hiện đại và các tính năng quản lý file toàn diện.

## 🎯 Tính năng chính

### 1. **Dashboard Overview**
- **Storage Usage**: Hiển thị dung lượng đã sử dụng với thanh progress bar động
- **Storage Health Indicators**: 
  - 🟢 Good (< 50%): Healthy
  - 🟡 Warning (50-80%): Warning  
  - 🔴 Critical (> 80%): Critical
- **File Statistics**: Tổng số file, images, videos theo real-time
- **File Type Distribution**: Phân bố file theo loại với progress bars

### 2. **Advanced Toolbar**
- **Search**: Tìm kiếm files và folders real-time
- **Filter**: Lọc theo loại file (All, Images, Videos, Documents)
- **Sort Options**:
  - Name (A-Z, Z-A)
  - Date (Newest/Oldest First)
  - Size (Largest/Smallest First)
- **View Modes**: Grid view và List view
- **Quick Actions**: Upload, Refresh, Settings

### 3. **Tab Navigation**
- **All Files**: Tất cả files
- **Recent**: Files gần đây
- **Images**: Chỉ images
- **Videos**: Chỉ videos
- **Trash**: Thùng rác

### 4. **File Operations**
- ✅ Upload multiple files
- ✅ Drag & drop support
- ✅ Bulk selection và deletion
- ✅ Individual file actions (View, Download, Delete)
- ✅ File preview
- ✅ Context menu với dropdown

## 🏗️ Cấu trúc Code

### File Structure
```
frontend/
├── src/
│   ├── app/
│   │   └── (admin)/
│   │       └── admin/
│   │           ├── files/
│   │           │   └── page.tsx          # Redirect page
│   │           └── filemanager/
│   │               └── page.tsx          # Main file manager
│   └── components/
│       ├── file-manager/
│       │   └── FileManager.tsx           # Enhanced component
│       └── ui/
│           ├── badge.tsx                 # Added warning variant
│           ├── progress.tsx              # Added indicatorClassName
│           ├── tabs.tsx
│           ├── select.tsx
│           └── ...
```

### URL Structure
- **Old**: `/admin/files` → Auto redirect
- **New**: `/admin/filemanager` → Professional UI

## 🎨 Design Patterns

### 1. **Controlled vs Uncontrolled Components**
FileManager component hỗ trợ cả 2 modes:

**Uncontrolled (Standalone)**:
```tsx
<FileManager />
```

**Controlled (From Parent)**:
```tsx
<FileManager 
  viewMode="grid"
  sortBy={{ field: 'date', order: 'desc' }}
  searchQuery={searchQuery}
  filter={{ type: 'IMAGE' }}
/>
```

### 2. **Conditional Rendering**
Toolbar chỉ hiển thị khi component không được control từ parent:
```tsx
{externalViewMode === undefined && externalSearchQuery === undefined && (
  <Card>
    {/* Toolbar content */}
  </Card>
)}
```

### 3. **Progressive Enhancement**
- Loading states
- Error handling
- Skeleton screens
- Optimistic updates
- Toast notifications

## 📊 Props Interface

```typescript
interface FileManagerProps {
  // Core props
  onSelect?: (file: File) => void;
  allowMultiple?: boolean;
  folderId?: string;
  fileTypes?: FileType[];
  
  // Enhanced props
  viewMode?: 'grid' | 'list';
  sortBy?: {
    field: 'name' | 'date' | 'size' | 'type';
    order: 'asc' | 'desc';
  };
  searchQuery?: string;
  filter?: {
    type?: FileType;
  };
  limit?: number;
}
```

## 🎯 Best Practices Implemented

### 1. **Performance Optimization**
- ✅ useCallback for event handlers
- ✅ useMemo for computed values
- ✅ Conditional rendering
- ✅ Lazy loading
- ✅ Pagination

### 2. **User Experience**
- ✅ Loading indicators
- ✅ Error messages
- ✅ Success confirmations
- ✅ Keyboard shortcuts
- ✅ Responsive design

### 3. **Code Quality**
- ✅ TypeScript strict mode
- ✅ Proper type definitions
- ✅ Clean component structure
- ✅ Separation of concerns
- ✅ Reusable components

### 4. **Accessibility**
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support

## 🚀 Usage Examples

### Basic Usage
```tsx
import FileManager from '@/app/(admin)/admin/filemanager/page';

// Navigate to /admin/filemanager
```

### Advanced Usage with Custom Settings
```tsx
<FileManager 
  viewMode="list"
  sortBy={{ field: 'name', order: 'asc' }}
  searchQuery=""
  filter={{ type: FileType.IMAGE }}
  limit={50}
/>
```

### Integration with Other Components
```tsx
const [selectedFile, setSelectedFile] = useState<File | null>(null);

<FileManager 
  onSelect={(file) => setSelectedFile(file)}
  allowMultiple={false}
  fileTypes={[FileType.IMAGE]}
/>
```

## 📈 Statistics Dashboard

### Storage Metrics
- **Total Storage**: Current usage / Total limit
- **Usage Percentage**: Visual progress bar
- **Free Space**: Remaining storage
- **Health Status**: Color-coded indicators

### File Metrics
- **Total Files**: Count across all folders
- **By Type**: Images, Videos, Documents
- **Size Distribution**: Per file type
- **Percentage Breakdown**: Visual charts

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_MAX_FILE_SIZE=10485760 # 10MB
NEXT_PUBLIC_STORAGE_LIMIT=10737418240 # 10GB
```

### Custom Themes
Sử dụng Tailwind CSS variables:
```css
--primary: your-primary-color;
--secondary: your-secondary-color;
--accent: your-accent-color;
```

## 🐛 Troubleshooting

### Common Issues

1. **Upload Failed**
   - Check file size limits
   - Verify file type restrictions
   - Check network connection

2. **Slow Loading**
   - Reduce limit parameter
   - Implement pagination
   - Use lazy loading

3. **Search Not Working**
   - Check search query format
   - Verify backend API
   - Clear cache

## 📝 Changelog

### Version 2.0 (Current)
- ✅ Professional dashboard with statistics
- ✅ Advanced filtering and sorting
- ✅ Tab-based navigation
- ✅ Health indicators
- ✅ Responsive design improvements
- ✅ Enhanced UX with loading states

### Version 1.0 (Legacy)
- Basic file listing
- Simple upload/delete
- Grid/List view
- Search functionality

## 🎓 Learning Resources

### Key Concepts
1. **React Hooks**: useState, useCallback, useMemo
2. **Component Composition**: Controlled vs Uncontrolled
3. **TypeScript**: Proper typing and interfaces
4. **UI/UX**: Progressive enhancement
5. **Performance**: Optimization techniques

### Recommended Reading
- React Documentation
- TypeScript Handbook
- Tailwind CSS Guide
- shadcn/ui Components
- Next.js Best Practices

## 👨‍💻 Developer Notes

### Code Style
- Use functional components
- Prefer hooks over classes
- Extract reusable logic
- Follow naming conventions
- Add proper comments

### Testing Strategy
```typescript
// Unit tests
describe('FileManager', () => {
  it('should render correctly', () => {});
  it('should handle file upload', () => {});
  it('should handle file deletion', () => {});
});
```

## 🤝 Contributing

### Guidelines
1. Follow existing code style
2. Add TypeScript types
3. Write tests
4. Update documentation
5. Create PR with description

### Code Review Checklist
- [ ] TypeScript types added
- [ ] Components reusable
- [ ] Performance optimized
- [ ] Accessibility implemented
- [ ] Documentation updated

---

**Developed with ❤️ by KataCore Team**

*Last updated: October 8, 2025*
