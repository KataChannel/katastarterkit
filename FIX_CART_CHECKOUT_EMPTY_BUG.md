# Fix Bug Giỏ Hàng Trống Khi Chuyển Từ /gio-hang Sang /thanh-toan

## 🐛 Vấn đề
- Trang `/gio-hang` hiển thị sản phẩm bình thường
- Khi chuyển sang `/thanh-toan` báo "Giỏ hàng trống" và redirect về `/san-pham`
- Cart data không được sync giữa 2 trang

## 🔍 Nguyên nhân

### 1. Quản lý sessionId không nhất quán
- `/gio-hang`: Dùng `useState` + `useEffect` để lấy sessionId
- `/thanh-toan`: Dùng `useCartSession` hook
- 2 cách khác nhau gây ra timing issue và sessionId không sync

### 2. Skip query logic sai
```tsx
// ❌ LỖI - Skip khi !sessionId
skip: !isInitialized || !sessionId

// Vấn đề: sessionId có thể là string rỗng '' hoặc chưa init
// Query bị skip vĩnh viễn và không retry
```

### 3. Cache write gây conflict
```tsx
// ❌ GÂY LỖI - Thiếu field 'userId'
update(cache, { data }) {
  cache.writeQuery({
    query: GET_CART,
    variables: getQueryVariables(),
    data: { getCart: data.updateCartItem.cart },
  });
}
```

### 4. Redirect logic quá aggresive
```tsx
// ❌ LỖI - Check cartData !== undefined
if (isInitialized && !cartLoading && cartData !== undefined) {
  // cartData có thể undefined trong lần render đầu
  // Nhưng điều kiện !== undefined vẫn true với null
}
```

## ✅ Giải pháp

### 1. Đồng nhất session management
**Cả 2 trang đều dùng `useCartSession` hook**

```tsx
// ✅ Code mới - đồng nhất
import { useCartSession } from '@/hooks/useCartSession';

const { sessionId, isInitialized } = useCartSession();
```

### 2. Fix skip query logic
```tsx
// ✅ Chỉ skip khi chưa initialized
const { data: cartData, loading: cartLoading, error: cartError } = useQuery(GET_CART, {
  variables: { sessionId },
  skip: !isInitialized, // Không check sessionId
  fetchPolicy: 'network-only',
  notifyOnNetworkStatusChange: true,
});
```

### 3. Loại bỏ cache.writeQuery
```tsx
// ✅ Chỉ dùng refetchQueries
const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
  refetchQueries: [{ 
    query: GET_CART,
    variables: { sessionId },
  }],
  awaitRefetchQueries: true,
});
```

### 4. Cải thiện redirect logic
```tsx
// ✅ Check đủ điều kiện
if (isInitialized && !cartLoading && !cartError && cartData) {
  const hasItems = cart && items && items.length > 0;
  if (!hasItems) {
    // redirect
  }
}
```

### 5. Thêm debug logging
```tsx
// ✅ Log để debug dễ dàng
console.log('[Checkout] Render state:', { 
  isInitialized, 
  cartLoading, 
  cartError, 
  cartData,
  cart,
  itemsCount: items?.length,
  sessionId 
});
```

## 📝 File đã sửa

### 1. `/frontend/src/app/(website)/thanh-toan/page.tsx`
- ✅ Đã dùng `useCartSession` hook
- ✅ Fix skip query logic (chỉ skip khi !isInitialized)
- ✅ Thêm `onCompleted` và `onError` callbacks
- ✅ Cải thiện redirect logic với check đầy đủ
- ✅ Thêm debug logging chi tiết

### 2. `/frontend/src/app/(website)/gio-hang/page.tsx`
- ✅ Chuyển từ `useState` sang `useCartSession` hook
- ✅ Loại bỏ tất cả `cache.writeQuery()` 
- ✅ Chỉ dùng `refetchQueries` cho mutations
- ✅ Đồng nhất logic với trang thanh-toan

### 3. `/frontend/src/components/ecommerce/AddToCartButton.tsx`
- ✅ Đã fix trước đó (loại bỏ cache.writeQuery)

## 🎯 Kết quả

### Trước khi fix:
1. ❌ `/gio-hang` có sản phẩm
2. ❌ Chuyển sang `/thanh-toan` → "Giỏ hàng trống"
3. ❌ Bị redirect về `/san-pham`

### Sau khi fix:
1. ✅ `/gio-hang` hiển thị sản phẩm
2. ✅ Chuyển sang `/thanh-toan` → Hiển thị đúng sản phẩm
3. ✅ Cart data sync hoàn hảo giữa các trang
4. ✅ Session management nhất quán
5. ✅ Không còn lỗi cache Apollo

## 💡 Nguyên tắc đã áp dụng

### 1. Clean Architecture
- Tách biệt session logic vào hook riêng
- Các component chỉ consume hook, không quản lý logic phức tạp

### 2. Performance Optimization
- Dùng `fetchPolicy: 'network-only'` cho checkout để đảm bảo fresh data
- `awaitRefetchQueries` đảm bảo UI update sau mutation
- `notifyOnNetworkStatusChange` để component update khi query state thay đổi

### 3. Developer Experience
- Code đơn giản, dễ đọc
- Debug logging chi tiết
- Logic rõ ràng, không phức tạp

### 4. User Experience
- Loading state rõ ràng
- Error handling đầy đủ
- Toast notification thân thiện
- Redirect hợp lý khi cart trống

## 🔧 Debug Tips

Nếu vẫn gặp lỗi, check console logs:
```
[Checkout] Render state: { isInitialized, cartLoading, ... }
[Checkout] Cart query completed: { data, sessionId, ... }
[CartSession] Initialized with session ID: ...
```

Kiểm tra:
1. `isInitialized` phải `true` trước khi query chạy
2. `sessionId` phải có giá trị (không null/undefined)
3. `cartData` phải có data sau khi loading xong
4. `cart.items` phải có length > 0

## ✨ Tổng kết
- ✅ Bug đã được fix triệt để
- ✅ Code đồng nhất giữa các trang
- ✅ Session management ổn định
- ✅ Apollo cache không còn conflict
- ✅ User experience mượt mà
