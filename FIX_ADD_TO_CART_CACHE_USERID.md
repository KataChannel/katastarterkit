# Fix Lỗi Cache Apollo - Missing field 'userId'

## 🐛 Vấn đề
- **Lỗi**: `Missing field 'userId' while writing result {}`
- **Vị trí**: `src/components/ecommerce/AddToCartButton.tsx` dòng 62
- **Nguyên nhân**: Apollo Client cache.writeQuery() cố gắng ghi dữ liệu không đầy đủ vào cache

## 🔍 Phân tích
1. **Query GET_CART** yêu cầu field `userId` trong cart object
2. **Mutation ADD_TO_CART** trả về cart object nhưng có thể thiếu field `userId`
3. **cache.writeQuery()** validate schema và báo lỗi khi thiếu field bắt buộc
4. **Variables không đồng bộ**: getQueryVariables() tạo variables khác nhau dựa vào auth state

## ✅ Giải pháp
### 1. Loại bỏ cache.writeQuery() thủ công
```tsx
// ❌ XÓA CODE CŨ - gây lỗi
update(cache, { data }) {
  if (data?.addToCart?.success && data?.addToCart?.cart) {
    const variables = getQueryVariables();
    cache.writeQuery({
      query: GET_CART,
      variables,
      data: { getCart: data.addToCart.cart },
    });
  }
}
```

### 2. Sử dụng refetchQueries với sessionId cố định
```tsx
// ✅ CODE MỚI - an toàn và đơn giản
const [addToCart] = useMutation(ADD_TO_CART, {
  refetchQueries: [{ 
    query: GET_CART,
    variables: { sessionId },
  }],
  awaitRefetchQueries: true,
  // ... rest of the code
});
```

### 3. Đơn giản hóa variables
```tsx
// ❌ Loại bỏ function phức tạp
const getQueryVariables = () => {
  if (isAuthenticated && user?.id) {
    return { userId: user.id };
  } else if (sessionId) {
    return { sessionId };
  }
  return undefined;
};

// ✅ Sử dụng trực tiếp sessionId
const { sessionId } = useCartSession();
```

## 💡 Lợi ích
1. **Không còn lỗi cache**: refetchQueries luôn lấy dữ liệu đầy đủ từ server
2. **Code đơn giản hơn**: Loại bỏ logic phức tạp không cần thiết
3. **Đồng bộ 100%**: Cart luôn được cập nhật từ server, không bị lệch dữ liệu
4. **Backend xử lý auth**: sessionId luôn được gửi, backend tự quyết định ưu tiên userId

## 🎯 Nguyên tắc áp dụng
- **Clean Architecture**: Tách biệt logic auth ra backend
- **Performance**: Dùng refetchQueries với awaitRefetchQueries cho UX tốt
- **Developer Experience**: Code đơn giản, dễ maintain
- **User Experience**: Không còn lỗi cache, cart luôn chính xác

## 📝 File thay đổi
- `frontend/src/components/ecommerce/AddToCartButton.tsx`: Fix cache write logic

## ✨ Kết quả
- ✅ Không còn lỗi "Missing field 'userId'"
- ✅ Add to cart hoạt động mượt mà
- ✅ Cart được sync chính xác sau mỗi thao tác
- ✅ Code sạch và dễ hiểu hơn
