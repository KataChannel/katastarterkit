# API Error Handling & Bug Fix Report

## 📋 Tóm tắt
Đã thêm thông báo lỗi API chi tiết và fix bug khi slug page không tìm thấy.

## ❌ Lỗi Ban Đầu
```
GraphQL Error in QUERY GetPageBySlug.getPageBySlug 
Message: "Page with slug \"/website\" not found"
```

**Nguyên nhân**: Khi truy cập `/website/baiviet`, route dynamic `[slug]/page.tsx` catch route này với `slug="website"`, sau đó gọi `GetPageBySlug` với slug `/website` nhưng không tìm thấy page nào.

## ✅ Giải pháp Được Thực Hiện

### 1. **Thêm Error Notification Service** (`useErrorNotification.ts`)
- Tạo hook để hiển thị thông báo lỗi chi tiết
- Thêm hàm `parseGraphQLError()` để extract lỗi từ GraphQL response
- Support cho error listeners toàn cầu

**File**: `frontend/src/hooks/useErrorNotification.ts`

```typescript
export const useErrorNotification = () => {
  const notify = useCallback((error: ErrorNotification) => {
    console.error('[API Error]', {
      message: error.message,
      type: error.type,
      details: error.details,
      timestamp: error.timestamp,
    });
    // Trigger listeners
    errorListeners.forEach(listener => listener(notification));
  }, []);
  
  const subscribe = useCallback((listener) => {
    errorListeners.push(listener);
    return () => { errorListeners = errorListeners.filter(l => l !== listener); };
  }, []);

  return { notify, subscribe };
};
```

### 2. **Cập nhật BlogListPage Error Handling** 
- Thêm UI component để hiển thị lỗi chi tiết
- Hiển thị message lỗi + chi tiết (collapsible)
- Thêm nút "Thử lại"
- Import `useErrorNotification` hook

**File**: `frontend/src/components/blog/BlogListPage.tsx`

**Thay đổi**:
- Thêm error state tracking
- Hiển thị error banner với icon AlertCircle
- Chi tiết lỗi trong `<details>` collapsible
- Xử lý cả lỗi blogs và categories

**UI Error Display**:
```
┌─────────────────────────────────────┐
│ 🔴 Lỗi tải bài viết                 │
├─────────────────────────────────────┤
│ > Chi tiết lỗi                      │
│ Page with slug "/website" not found │
│                                     │
│ Vui lòng thử lại. Nếu vẫn lỗi,      │
│ hãy liên hệ với bộ phận hỗ trợ.     │
│                                     │
│ [Thử lại]                           │
└─────────────────────────────────────┘
```

### 3. **Fix Bug Reserved Routes** 
- Thêm check để loại bỏ reserved routes: `baiviet`, `sanpham`, `website`
- Ngăn chặn việc gọi `GetPageBySlug` cho các route không phải dynamic pages

**File**: `frontend/src/app/(website)/[slug]/page.tsx`

```typescript
// Exclude reserved routes that have explicit handlers
const reservedRoutes = ['baiviet', 'sanpham', 'website'];
if (reservedRoutes.includes(resolvedParams.slug)) {
  console.warn(`Route "${resolvedParams.slug}" is reserved and should use specific handler`);
  setRouteError(`Route "/${resolvedParams.slug}" không được xử lý bởi dynamic page handler`);
  setSlug('');
  return;
}
```

### 4. **Enhanced Apollo Client Error Logging**
- Thêm chi tiết logging cho lỗi "not found"
- Log operation name + variables khi xảy ra lỗi
- Giúp debugging dễ hơn

**File**: `frontend/src/lib/apollo-client.ts`

```typescript
// Handle resource not found errors
if (message.includes('not found')) {
  logError('warn', '🔍 Resource not found - check if resource exists', { 
    message, 
    path,
    operation: operation.operationName,
    variables: operation.variables
  });
}
```

## 📁 Files Tạo/Cập Nhật

| File | Thay đổi | Lý do |
|------|---------|-------|
| `frontend/src/hooks/useErrorNotification.ts` | NEW | Error notification service |
| `frontend/src/hooks/index.ts` | EDIT | Export useErrorNotification |
| `frontend/src/components/blog/BlogListPage.tsx` | EDIT | Enhanced error display |
| `frontend/src/app/(website)/[slug]/page.tsx` | EDIT | Fix reserved routes bug |
| `frontend/src/lib/apollo-client.ts` | EDIT | Better error logging |

## 🧪 Testing

### Test Case 1: Reserved Route (Should not call GetPageBySlug)
```
URL: /website/baiviet
Expected: Render BlogListPage (from baiviet/page.tsx)
Not: Try to fetch dynamic page with slug "baiviet"
```

### Test Case 2: Valid Dynamic Page
```
URL: /website/about-us
Expected: Fetch page with slug "website/about-us"
Result: Show page content or notFound if not exists
```

### Test Case 3: Non-existent Page
```
URL: /website/non-existent-page
Expected: Show error banner with:
  - Message: "Page with slug "website/non-existent-page" not found"
  - Details: (collapsible)
  - Retry button
```

### Test Case 4: API Error
```
BlogListPage loads with error
Expected: Show error banner with:
  - "Lỗi tải bài viết"
  - Collapsible details showing GraphQL error
  - Retry button to refresh
```

## 🔍 Debugging Console Output

Khi xảy ra lỗi, bạn sẽ thấy trong console:

```
[API Error] {
  message: "Page with slug \"/website\" not found",
  type: "error",
  details: "{\"path\":[\"getPageBySlug\"],\"extensions\":{...}}",
  timestamp: "2025-10-25T21:20:30.123Z"
}

[apolloClient] ⚠️ 🔍 Resource not found - check if resource exists {
  message: "Page with slug \"/website\" not found",
  path: ["getPageBySlug"],
  operation: "GetPageBySlug",
  variables: {"slug":"/website"}
}
```

## 🚀 Benefits

✅ **User Experience**: Users thấy lỗi chi tiết và có thể retry  
✅ **Debugging**: Console log giúp developer tìm root cause nhanh  
✅ **Route Safety**: Reserved routes không còn được catch bởi [slug]  
✅ **Error Transparency**: Hiển thị GraphQL error message rõ ràng  
✅ **Recovery**: Nút Retry giúp user recover mà không reload page  

## 🔗 Related Issues
- Blog listing page lỗi khi truy cập
- Dynamic page handler catch reserved routes
- No error feedback to users when API fails
