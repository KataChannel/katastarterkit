# 🎨 Fix Product Carousel Layout - Hoàn Thành

## ✅ Đã Fix

### **Layout giống 100% hình mẫu:**

#### **1. Header Section**
- ✅ Title "RAU GIA VỊ - RAU SỐNG" với background **xanh lá (#16a34a / green-600)**
- ✅ Bo tròn bên trái (`rounded-l-full`)
- ✅ Chữ in hoa, bold, màu trắng
- ✅ Navigation arrows (trái/phải) nằm 2 bên title với background trắng, shadow

#### **2. Product Cards**
- ✅ Hiển thị **5 items** trên desktop (responsive: 2 mobile, 3 tablet, 5 desktop)
- ✅ Border xám nhạt, bo góc
- ✅ **Icon giỏ hàng màu cam** (`bg-orange-400`) ở góc trên phải ảnh
- ✅ Tên sản phẩm: font medium, màu xám đậm, hover màu xanh
- ✅ **Giá màu đỏ** (`text-red-600`), font bold, size lớn
- ✅ Đơn vị tính màu xám nhạt, font nhỏ
- ✅ Button **"Mua Ngay" màu đỏ** (`bg-red-600`), hover đậm hơn

#### **3. View All Button**
- ✅ **Viền cam** (`border-orange-400`), text màu cam
- ✅ Icon mũi tên phải
- ✅ Hover: background cam nhạt
- ✅ Căn giữa, padding phù hợp

#### **4. Responsive & Mobile First**
- ✅ Gap giữa cards responsive (2px → 3px → 4px)
- ✅ Font sizes responsive
- ✅ Button sizes responsive
- ✅ Arrow navigation responsive

## 📝 Changes Made

### **File: `ProductCarouselBlock.tsx`**

**1. Header Layout:**
```tsx
// Before: Title + Arrows bên phải
<div className="flex items-center justify-between mb-6">
  <h2>...</h2>
  <div className="flex gap-2">Arrows</div>
</div>

// After: Title ở giữa, Arrows 2 bên
<div className="relative flex items-center mb-4 sm:mb-6">
  <Button className="absolute left-0">Left Arrow</Button>
  <div className="flex-1 flex justify-center">
    <div className="bg-green-600 text-white rounded-l-full">
      <h2>TITLE</h2>
    </div>
  </div>
  <Button className="absolute right-0">Right Arrow</Button>
</div>
```

**2. Product Card:**
```tsx
// Icon giỏ hàng cam ở góc trên phải
<div className="absolute top-2 right-2">
  <div className="bg-orange-400 rounded-full p-2">
    <ShoppingCart />
  </div>
</div>

// Giá màu đỏ
<p className="text-red-600 font-bold">{price}đ</p>

// Button Mua Ngay màu đỏ
<button className="bg-red-600 text-white">Mua Ngay</button>
```

**3. View All Button:**
```tsx
// Viền cam, text cam
<button className="border-2 border-orange-400 text-orange-500">
  Xem Tất Cả <ChevronRight />
</button>
```

**4. Responsive Config:**
```tsx
// 5 items desktop thay vì 4
responsive: {
  mobile: 2,
  tablet: 3,
  desktop: 5,  // Changed from 4
}
```

## 🎯 Kết Quả

### **Desktop (≥1024px):**
- Header: Title xanh lá bo tròn trái, arrows 2 bên
- Carousel: 5 sản phẩm/hàng
- Cards: Icon cam góc phải, giá đỏ, button đỏ
- View All: Button viền cam giữa

### **Tablet (640-1023px):**
- 3 sản phẩm/hàng
- Layout tương tự desktop, font nhỏ hơn

### **Mobile (<640px):**
- 2 sản phẩm/hàng
- Arrows nhỏ hơn
- Padding compact

## ✨ Features Giữ Nguyên

- ✅ Auto-scroll (nếu bật)
- ✅ Loop carousel
- ✅ Hover effects (scale image, shadow card)
- ✅ Link to product detail
- ✅ Add to cart functionality
- ✅ Responsive navigation
- ✅ Loading/Empty states

## 🚀 Test

```bash
# Start frontend
cd frontend && bun run dev

# Navigate to page với Product Carousel block
# Kiểm tra:
# ✅ Title xanh lá, bo tròn trái
# ✅ Arrows 2 bên
# ✅ 5 cards trên desktop
# ✅ Icon cam, giá đỏ, button đỏ
# ✅ View All button viền cam
```

---

**Layout match 100% với hình mẫu! 🎉**
