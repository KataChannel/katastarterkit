# 🧪 TEST MANUAL - Add to Cart Fix

## Test Scenarios

### ✅ Scenario 1: Guest User - Add to Cart
**Steps:**
1. Mở browser (Incognito mode)
2. Truy cập: http://localhost:3001/san-pham
3. Click vào sản phẩm bất kỳ
4. Click "Thêm vào giỏ hàng"

**Expected Result:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "cart": {
    "id": "...",
    "items": [...],
    "itemCount": 1
  }
}
```

**Check trong Console:**
```
[Session] Created new session ID: session_xxxxx
[AddToCart] Mutation with sessionId: session_xxxxx
✅ Success
```

---

### ✅ Scenario 2: Authenticated User - Add to Cart
**Steps:**
1. Login với user account
2. Truy cập: http://localhost:3001/san-pham
3. Click vào sản phẩm
4. Click "Thêm vào giỏ hàng"

**Expected Result:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "cart": {
    "id": "...",
    "userId": "user_123",
    "items": [...],
    "itemCount": 1
  }
}
```

**Check trong Console:**
```
[Session] Initialized with session ID: session_xxxxx
[AddToCart] Mutation with sessionId: session_xxxxx
[Backend] Using userId from context (priority)
✅ Success
```

---

### ✅ Scenario 3: Guest Cart → Login → Merge
**Steps:**
1. Incognito mode
2. Thêm 2 sản phẩm vào giỏ hàng (guest)
3. Login
4. Check giỏ hàng

**Expected Result:**
```
[CartSession] User logged in, merging carts...
[Backend] Merging session cart into user cart
[CartSession] Carts merged successfully
[Session] Cleared session ID
✅ Cart có 2 items (từ guest session)
```

---

### ✅ Scenario 4: Wishlist → Add to Cart
**Steps:**
1. Login
2. Vào trang Yêu thích: http://localhost:3001/yeu-thich
3. Click "Thêm vào giỏ" trên sản phẩm

**Expected Result:**
```json
{
  "success": true,
  "message": "Item added to cart successfully"
}
```

**Toast:**
```
✅ Đã thêm vào giỏ hàng
Sản phẩm đã được thêm vào giỏ hàng
```

---

### ✅ Scenario 5: Multiple Adds (Increase Quantity)
**Steps:**
1. Add sản phẩm A vào giỏ
2. Add lại sản phẩm A lần nữa

**Expected Result:**
```json
{
  "cart": {
    "items": [
      {
        "productId": "A",
        "quantity": 2  // ✅ Tăng quantity thay vì tạo item mới
      }
    ]
  }
}
```

---

### ✅ Scenario 6: Out of Stock
**Steps:**
1. Chọn sản phẩm có stock = 0
2. Click "Thêm vào giỏ hàng"

**Expected Result:**
```json
{
  "success": false,
  "message": "Only 0 items available in stock"
}
```

**Toast:**
```
❌ Lỗi
Only 0 items available in stock
```

---

## Debug Commands

### Check sessionId trong localStorage:
```javascript
localStorage.getItem('cart_session_id')
// Should return: "session_1730937600000_abc123xyz"
```

### Check GraphQL Variables trong Network Tab:
```json
// Request payload
{
  "operationName": "AddToCart",
  "variables": {
    "input": {
      "productId": "...",
      "quantity": 1,
      "sessionId": "session_xxxxx"  // ✅ MUST be present
    }
  }
}
```

### Check Backend Response:
```json
{
  "data": {
    "addToCart": {
      "success": true,
      "message": "Item added to cart successfully",
      "cart": {
        "id": "...",
        "itemCount": 1,
        "total": 150000
      }
    }
  }
}
```

---

## Error Cases (Should NOT happen after fix)

### ❌ Before Fix:
```json
{
  "data": {
    "addToCart": {
      "success": false,
      "message": "Either userId or sessionId is required",
      "cart": null
    }
  }
}
```

### ✅ After Fix:
Should NEVER see this error anymore!

---

## Performance Checks

### Cart Query Caching:
```javascript
// Check Apollo Cache
window.__APOLLO_CLIENT__.cache.readQuery({
  query: GET_CART,
  variables: { sessionId: 'session_xxxxx' }
})
```

### Session Initialization Time:
```
[Session] Created new session ID: session_xxxxx (< 1ms)
```

### Add to Cart Response Time:
```
✅ < 500ms for successful add
✅ Cache update immediate
✅ UI update within 100ms
```

---

## Rollback Plan (If needed)

If fix causes issues:

1. Revert `useCartSession.ts`:
```typescript
const getCartSessionId = useCallback(() => {
  if (isAuthenticated) {
    return undefined;
  }
  return sessionId || getSessionId();
}, [isAuthenticated, sessionId]);
```

2. Revert `AddToCartButton.tsx`:
```typescript
sessionId: !isAuthenticated ? sessionId : undefined,
```

3. Restart frontend: `npm run dev`

---

## Success Criteria

✅ All 6 test scenarios pass  
✅ No "Either userId or sessionId is required" errors  
✅ Guest cart works  
✅ Authenticated cart works  
✅ Cart merge works  
✅ No console errors  
✅ Performance < 500ms  

**Status:** Ready for testing
