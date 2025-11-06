# ✅ Checklist Kiểm Tra Trang Chi Tiết Sản Phẩm

## 📋 Pre-Deployment Checklist

### 1. **GraphQL Query** ✅
- [x] GET_PRODUCT_BY_SLUG có đầy đủ fields từ database
- [x] Bao gồm: thumbnail, images, variants, attributes
- [x] Bao gồm: price, originalPrice, discountPercentage, profitMargin
- [x] Bao gồm: sku, origin, unit, weight, stock
- [x] Bao gồm: viewCount, soldCount
- [x] Bao gồm: isFeatured, isNewArrival, isBestSeller, isOnSale
- [x] Category với image field (không phải thumbnail)

### 2. **Component Implementation** ✅
- [x] Hiển thị thumbnail và image gallery
- [x] Sắp xếp images theo order field
- [x] Placeholder cho trường hợp không có ảnh
- [x] Hiển thị giá: price, originalPrice, tiết kiệm
- [x] Hiển thị profit margin (nếu có)
- [x] Badges: Giảm giá %, Bán chạy, Sản phẩm mới
- [x] Info pills: SKU, Xuất xứ, Đơn vị, Trọng lượng
- [x] Short description với styling
- [x] Attributes JSON hiển thị động
- [x] Variants với SKU, giá, tồn kho
- [x] Thống kê: Lượt xem, Đã bán
- [x] Tab Specifications hiển thị đầy đủ
- [x] Tab Reviews với statistics
- [x] Links đúng: /san-pham (không phải /products)
- [x] Breadcrumb đúng route

### 3. **Code Quality** ✅
- [x] Không có TypeScript errors
- [x] Không sử dụng deprecated fields
- [x] Không có fields không tồn tại trong schema
- [x] Routes đúng (/san-pham)
- [x] Xử lý edge cases (no image, no variants, out of stock)

---

## 🧪 Manual Testing Checklist

### **A. Hiển thị Cơ Bản**
- [ ] Trang load thành công với slug hợp lệ
- [ ] Hiển thị 404 với slug không tồn tại
- [ ] Thumbnail hiển thị đúng
- [ ] Gallery images hiển thị và có thể chọn
- [ ] Tên sản phẩm hiển thị
- [ ] Breadcrumb đầy đủ và links hoạt động

### **B. Giá & Giảm Giá**
- [ ] Giá bán (price) hiển thị đúng
- [ ] Giá gốc (originalPrice) hiển thị với line-through
- [ ] Số tiền tiết kiệm tính đúng
- [ ] % giảm giá hiển thị (badge đỏ)
- [ ] Profit margin hiển thị (nếu có)

### **C. Badges**
- [ ] Badge giảm giá hiển thị khi có discount
- [ ] Badge "Bán chạy" khi isBestSeller = true
- [ ] Badge "Mới" khi isNewArrival = true
- [ ] Vị trí badges đúng (góc ảnh)

### **D. Thông Tin Sản Phẩm**
- [ ] SKU hiển thị (nếu có)
- [ ] Xuất xứ hiển thị (nếu có)
- [ ] Đơn vị tính hiển thị
- [ ] Trọng lượng hiển thị (nếu có)
- [ ] Lượt xem hiển thị
- [ ] Đã bán hiển thị
- [ ] Tồn kho hiển thị

### **E. Mô Tả**
- [ ] Short description hiển thị với blue border
- [ ] Description HTML render đúng
- [ ] Không có lỗi hiển thị

### **F. Attributes (Đặc điểm nổi bật)**
- [ ] Hiển thị khi có attributes JSON
- [ ] Tất cả key/value hiển thị đúng
- [ ] Icon ✓ màu xanh hiển thị
- [ ] Grid responsive (2 cột)

### **G. Variants (Phân loại)**
- [ ] Hiển thị khi có variants
- [ ] Tên variant hiển thị
- [ ] SKU của variant hiển thị (nhỏ, màu xám)
- [ ] Giá variant hiển thị (nếu khác giá gốc)
- [ ] Chọn variant hoạt động
- [ ] Variant hết hàng bị disabled
- [ ] Variant inactive bị disabled
- [ ] Giá và stock thay đổi khi chọn variant

### **H. Quantity Selector**
- [ ] Tăng/giảm số lượng hoạt động
- [ ] Không thể giảm dưới 1
- [ ] Không thể tăng quá tồn kho
- [ ] Input số lượng hoạt động
- [ ] Hiển thị số sản phẩm có sẵn

### **I. Add to Cart**
- [ ] Button "Thêm vào giỏ" hoạt động
- [ ] Disabled khi hết hàng
- [ ] Toast notification hiển thị
- [ ] Cart count tăng sau khi thêm
- [ ] Loading state khi đang thêm

### **J. Tab Navigation**
- [ ] Tab "Mô tả" hoạt động
- [ ] Tab "Thông số kỹ thuật" hoạt động
- [ ] Tab "Đánh giá" hoạt động
- [ ] Active tab highlight đúng

### **K. Tab Specifications**
- [ ] SKU hiển thị
- [ ] Barcode hiển thị (nếu có)
- [ ] Xuất xứ hiển thị
- [ ] Đơn vị tính hiển thị
- [ ] Trọng lượng hiển thị (với đơn vị gram)
- [ ] Tồn kho hiển thị (với đơn vị)
- [ ] Tồn kho tối thiểu hiển thị (nếu có)
- [ ] Attributes JSON hiển thị đầy đủ

### **L. Tab Reviews**
- [ ] Thông báo "Đang phát triển" hiển thị
- [ ] Thống kê hiển thị (lượt xem, đã bán, còn lại)

### **M. Features Section**
- [ ] Icon "Giao hàng nhanh" hiển thị
- [ ] Icon "Bảo hành" hiển thị
- [ ] Icon "Đổi trả" hiển thị

### **N. Related Products**
- [ ] Placeholder hiển thị
- [ ] Tên category hiển thị

### **O. Responsive**
- [ ] Mobile: Layout 1 cột
- [ ] Tablet: Layout responsive
- [ ] Desktop: Layout 2 cột (image + info)
- [ ] Gallery thumbnails scroll trên mobile

### **P. Links & Navigation**
- [ ] Breadcrumb "Trang chủ" → /
- [ ] Breadcrumb "Sản phẩm" → /san-pham
- [ ] Breadcrumb "Category" → /san-pham?category=slug
- [ ] "Quay lại" button → /san-pham
- [ ] Category link hoạt động

---

## 🐛 Edge Cases Testing

- [ ] Sản phẩm không có ảnh → Placeholder hiển thị
- [ ] Sản phẩm không có variants → Section ẩn
- [ ] Sản phẩm không có attributes → Section ẩn
- [ ] Sản phẩm hết hàng → Button disabled, badge hiển thị
- [ ] Sản phẩm không giảm giá → Không hiển thị giá gốc
- [ ] Sản phẩm không có short description → Section ẩn
- [ ] Sản phẩm không có description → Hiển thị "Chưa có mô tả"
- [ ] Variant hết hàng → Disabled với text "(Hết hàng)"
- [ ] Variant inactive → Disabled
- [ ] Số lượng > tồn kho → Validation error

---

## 🚀 Performance Testing

- [ ] Page load < 3s
- [ ] Images lazy load
- [ ] GraphQL query chỉ gọi 1 lần
- [ ] No console errors
- [ ] No console warnings
- [ ] No GraphQL errors

---

## 📱 Cross-Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (Mac/iOS)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## 🔒 Security Testing

- [ ] XSS: HTML description render an toàn
- [ ] SQL Injection: Slug validation
- [ ] Invalid slug → 404
- [ ] Invalid quantity → Validation
- [ ] Invalid variant ID → Error handling

---

## ✅ Acceptance Criteria

### **Must Have:**
- [x] Hiển thị đúng tất cả fields từ database
- [x] Giá, SKU, xuất xứ, đơn vị, tồn kho hiển thị
- [x] Attributes JSON render động
- [x] Variants chi tiết
- [x] Add to cart hoạt động
- [x] Responsive design
- [x] No TypeScript errors
- [x] Correct routes (/san-pham)

### **Should Have:**
- [ ] Related products query (hiện tại: placeholder)
- [ ] Review system (hiện tại: "Đang phát triển")
- [ ] Rating system
- [ ] Product image zoom
- [ ] Share button functionality
- [ ] Wishlist button functionality

### **Could Have:**
- [ ] Product comparison
- [ ] Quick buy
- [ ] Stock notification
- [ ] Recently viewed products
- [ ] Price history chart

---

## 📝 Notes

- Related Products: Cần implement query riêng
- Reviews: Cần implement review model & resolver
- Rating: Cần aggregate từ reviews
- Image zoom: Có thể thêm library (react-image-zoom)
- Share: Có thể dùng Web Share API

---

## 🎯 Success Metrics

- [ ] 0 TypeScript errors
- [ ] 0 GraphQL errors
- [ ] 0 Console errors
- [ ] Page load < 3s
- [ ] Mobile score > 90 (Lighthouse)
- [ ] Desktop score > 95 (Lighthouse)
- [ ] SEO score > 90
- [ ] Accessibility score > 90

---

## ✅ Sign Off

**Tested by:** _____________  
**Date:** _____________  
**Status:** [ ] PASS [ ] FAIL  
**Notes:** _____________________________________________

---

**Ready for Production:** [ ] YES [ ] NO

