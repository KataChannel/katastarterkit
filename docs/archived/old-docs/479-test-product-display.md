# 🧪 TEST PRODUCT PAGE DISPLAY

## Quick Visual Check

Visit: `http://localhost:3000/san-pham`

### ✅ Expected Display:

**Product Card Should Show:**
1. ✅ Product image (thumbnail)
2. ✅ Discount badge (if originalPrice > price)
3. ✅ HOT badge (if isFeatured)
4. ✅ MỚI badge (if isNewArrival)
5. ✅ BÁN CHẠY badge (if isBestSeller)
6. ✅ Product name (2 lines max)
7. ✅ Category name + SKU
8. ✅ Origin (if available)
9. ✅ Unit (KG, BAO, etc.)
10. ✅ Price + Original price (strikethrough)
11. ✅ Price per unit (e.g., "250.000₫/KG")
12. ✅ Stock status with quantity
13. ✅ Attributes badges (organic, pesticide_free, fresh)
14. ✅ Add to cart + Wishlist buttons

### 🔍 Check Database:

```sql
-- Check products with full info
SELECT 
  name,
  price,
  originalPrice,
  sku,
  origin,
  unit,
  stock,
  isFeatured,
  isNewArrival,
  isBestSeller,
  attributes
FROM products
LIMIT 5;
```

### 📊 Test Scenarios:

1. **Product with discount:**
   - originalPrice: 300000
   - price: 250000
   - Expected: "-17%" badge, strikethrough price

2. **Product with attributes:**
   - attributes: {"organic": true, "pesticide_free": true}
   - Expected: "🌱 Hữu cơ" and "🚫 Không thuốc" badges

3. **Product out of stock:**
   - stock: 0
   - Expected: "✗ Hết hàng", disabled add button

4. **Product with origin:**
   - origin: "Đà Lạt, Lâm Đồng"
   - Expected: "📍 Xuất xứ: Đà Lạt, Lâm Đồng"

---

**Last Updated:** November 6, 2025
