# Tổng Hợp: Sort Trong Blog Carousel Block

## 1. Tính Năng Mới

Thêm khả năng sắp xếp bài viết trong BlogCarousel block theo:
- ✅ **Ngày mới nhất** (newest)
- ✅ **Ngày cũ nhất** (oldest)
- ✅ **Tác giả A-Z** (author_asc)
- ✅ **Tác giả Z-A** (author_desc)
- ✅ **Tiêu đề A-Z** (title_asc)
- ✅ **Tiêu đề Z-A** (title_desc)

## 2. Files Đã Cập Nhật

### 2.1. Type Definition
**File**: `frontend/src/types/page-builder.ts`

**Thay đổi**:
```typescript
export interface BlogCarouselBlockContent {
  title?: string;
  categoryId?: string;
  filterType?: 'all' | 'featured' | 'category' | 'recent' | 'custom';
  itemsToShow?: number;
  sortBy?: 'newest' | 'oldest' | 'author_asc' | 'author_desc' | 'title_asc' | 'title_desc'; // 🆕 Thuộc tính mới
  // ... các thuộc tính khác
}
```

### 2.2. BlogCarousel Block Component
**File**: `frontend/src/components/page-builder/blocks/BlogCarouselBlock.tsx`

**Thay đổi 1**: Default value cho sortBy
```typescript
const [editContent, setEditContent] = useState<BlogCarouselBlockContent>(content || {
  title: 'Tin tức nổi bật',
  filterType: 'all',
  itemsToShow: 6,
  sortBy: 'newest', // 🆕 Mặc định sắp xếp theo mới nhất
  // ... các giá trị khác
});
```

**Thay đổi 2**: Hàm mapping sort parameter
```typescript
// Map sortBy to GraphQL sort format
const getSortParameter = () => {
  switch (editContent.sortBy) {
    case 'newest':
      return 'newest';
    case 'oldest':
      return 'oldest';
    case 'author_asc':
      return 'author_asc';
    case 'author_desc':
      return 'author_desc';
    case 'title_asc':
      return 'title_asc';
    case 'title_desc':
      return 'title_desc';
    default:
      return 'newest';
  }
};
```

**Thay đổi 3**: Apply sort vào GraphQL queries
```typescript
// Query 1: All Blogs
const { data: allBlogsData, loading: allBlogsLoading } = useQuery(GET_BLOGS, {
  variables: {
    limit: editContent.itemsToShow || 6,
    page: 1,
    sort: getSortParameter(), // 🆕 Sử dụng sort parameter
  },
  skip: !shouldFetchAll,
  fetchPolicy: 'cache-first',
});

// Query 2: Category Blogs
const { data: categoryBlogsData, loading: categoryBlogsLoading } = useQuery(GET_BLOGS_BY_CATEGORY, {
  variables: {
    categoryId: editContent.categoryId,
    limit: editContent.itemsToShow || 6,
    page: 1,
    sort: getSortParameter(), // 🆕 Sử dụng sort parameter
  },
  skip: !shouldFetchByCategory,
  fetchPolicy: 'cache-first',
});
```

### 2.3. Settings Dialog
**File**: `frontend/src/components/page-builder/blocks/BlogCarouselSettingsDialog.tsx`

**Thay đổi 1**: Thêm sort options array
```typescript
const sortOptions = [
  { value: 'newest', label: 'Mới nhất (theo ngày)' },
  { value: 'oldest', label: 'Cũ nhất (theo ngày)' },
  { value: 'author_asc', label: 'Tác giả (A-Z)' },
  { value: 'author_desc', label: 'Tác giả (Z-A)' },
  { value: 'title_asc', label: 'Tiêu đề (A-Z)' },
  { value: 'title_desc', label: 'Tiêu đề (Z-A)' },
];
```

**Thay đổi 2**: Thêm Sort UI (sau "Số bài viết hiển thị")
```tsx
{/* Sort By */}
<div className="space-y-2">
  <Label htmlFor="sortBy">Sắp xếp theo</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between"
      >
        {sortOptions.find((s) => s.value === localSettings.sortBy)?.label || 'Mới nhất'}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-full p-0">
      <Command>
        <CommandInput placeholder="Tìm kiếm..." />
        <CommandEmpty>Không tìm thấy.</CommandEmpty>
        <CommandGroup>
          {sortOptions.map((sort) => (
            <CommandItem
              key={sort.value}
              onSelect={() => {
                updateSettings({ sortBy: sort.value as any });
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  localSettings.sortBy === sort.value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {sort.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
</div>
```

## 3. Cách Sử Dụng

### 3.1. Trong Page Builder Editor

1. Click vào BlogCarousel block
2. Click nút "Settings"
3. Tìm field "Sắp xếp theo"
4. Chọn một trong các tùy chọn:
   - Mới nhất (theo ngày)
   - Cũ nhất (theo ngày)
   - Tác giả (A-Z)
   - Tác giả (Z-A)
   - Tiêu đề (A-Z)
   - Tiêu đề (Z-A)
5. Click "Lưu"
6. Xem kết quả preview

### 3.2. Ví Dụ Use Cases

**Use Case 1**: Tin tức mới nhất
```typescript
{
  filterType: 'all',
  sortBy: 'newest',
  itemsToShow: 6
}
// → Hiển thị 6 bài viết mới nhất
```

**Use Case 2**: Sắp xếp theo tác giả
```typescript
{
  filterType: 'all',
  sortBy: 'author_asc',
  itemsToShow: 10
}
// → Hiển thị 10 bài viết, sắp xếp theo tên tác giả A-Z
```

**Use Case 3**: Danh mục cụ thể + Sort
```typescript
{
  filterType: 'category',
  categoryId: 'abc-123',
  sortBy: 'title_desc',
  itemsToShow: 8
}
// → Hiển thị 8 bài viết trong danh mục, sắp xếp theo tiêu đề Z-A
```

## 4. Luồng Hoạt Động

```
User chọn sort option trong Settings Dialog
         ↓
updateSettings({ sortBy: value })
         ↓
localSettings.sortBy được cập nhật
         ↓
handleSave() → onSave(localSettings)
         ↓
BlogCarouselBlock nhận editContent mới
         ↓
getSortParameter() map sortBy → GraphQL format
         ↓
useQuery với sort parameter mới
         ↓
GraphQL query fetch blogs đã sorted
         ↓
UI render blogs theo thứ tự mới
```

## 5. Tuân Thủ Rules (rulepromt.txt)

✅ **Rule 1-2**: Clean Architecture - Tách logic sort vào hàm riêng  
✅ **Rule 3**: Performance - Cache-first fetchPolicy  
✅ **Rule 4**: DX - Clear naming, type-safe  
✅ **Rule 5**: UX - Combobox với search, labels tiếng Việt  
✅ **Rule 6**: Code Quality - TypeScript strict, no errors  
✅ **Rule 8**: Maintainable - Easy to add more sort options  
✅ **Rule 10**: Shadcn UI + Mobile First (Combobox responsive)  
✅ **Rule 11**: Giao diện tiếng Việt  

## 6. Sort Options Chi Tiết

### 6.1. Sort theo Ngày
- **newest**: Mới nhất → Cũ nhất (publishedAt DESC)
- **oldest**: Cũ nhất → Mới nhất (publishedAt ASC)

### 6.2. Sort theo Tác Giả
- **author_asc**: A → Z (author.firstName + lastName ASC)
- **author_desc**: Z → A (author.firstName + lastName DESC)

### 6.3. Sort theo Tiêu Đề
- **title_asc**: A → Z (blog.title ASC)
- **title_desc**: Z → A (blog.title DESC)

## 7. GraphQL Integration

### Backend phải hỗ trợ các sort values:
```graphql
query GetBlogs($limit: Int, $page: Int, $sort: String) {
  blogs(limit: $limit, page: $page, sort: $sort) {
    items {
      id
      title
      author {
        firstName
        lastName
      }
      publishedAt
      # ... other fields
    }
  }
}
```

### Sort parameter values:
- `newest` → Sort by publishedAt DESC
- `oldest` → Sort by publishedAt ASC
- `author_asc` → Sort by author name ASC
- `author_desc` → Sort by author name DESC
- `title_asc` → Sort by title ASC
- `title_desc` → Sort by title DESC

## 8. Testing

### Test Cases:

**8.1. Default Sort**
- Tạo mới BlogCarousel block
- Verify sortBy = 'newest'
- Verify blogs hiển thị mới nhất trước

**8.2. Change Sort**
- Click Settings
- Chọn "Tác giả (A-Z)"
- Save
- Verify blogs sorted theo tên tác giả A-Z

**8.3. Sort + Filter**
- Set filterType = 'category'
- Chọn category
- Set sortBy = 'oldest'
- Verify: Blogs trong category, sorted oldest first

**8.4. Persistence**
- Set sortBy = 'title_desc'
- Save page
- Reload page
- Verify: Sort setting được giữ nguyên

## 9. Responsive Design

Combobox tự động responsive:
- **Mobile**: Full width, touch-friendly
- **Tablet**: Comfortable spacing
- **Desktop**: Optimal size, hover states

## 10. Future Enhancements

Có thể thêm các sort options khác:
- `views_desc`: Nhiều lượt xem nhất
- `comments_desc`: Nhiều bình luận nhất
- `likes_desc`: Nhiều likes nhất
- `random`: Random order

Chỉ cần:
1. Thêm vào `sortOptions` array
2. Thêm case vào `getSortParameter()`
3. Backend hỗ trợ sort parameter đó

## 11. Kết Quả

### Trước:
- ❌ Không có control về thứ tự bài viết
- ❌ Chỉ có thể dùng filterType = 'recent'
- ❌ Không sort theo tác giả hoặc tiêu đề

### Sau:
- ✅ 6 tùy chọn sort khác nhau
- ✅ Kết hợp được với mọi filterType
- ✅ UI settings rõ ràng, dễ dùng
- ✅ Type-safe với TypeScript
- ✅ No errors, production-ready!
