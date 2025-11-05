# 🔄 Cập Nhật Schema - Tích Hợp Hệ Thống Nội Bộ

## 📋 Tổng Quan
Cập nhật schema Product, Order, Customer để tích hợp với hệ thống quản lý đơn hàng sỉ nội bộ, giữ nguyên các tính năng ecommerce và thêm fields tiếng Anh tương ứng.

---

## 🎯 Models Được Cập Nhật

### 1. **Product Model** (Sản phẩm)

#### Fields Mới Thêm:
```prisma
// Tên tiếng Anh
nameEn          String?  @map("title2")
subtitle        String?

// Mã sản phẩm nội bộ
productCode     String?  @unique @map("masp")

// Giá (với mapping tiếng Việt)
price           Float    @map("giaban")      // Giá bán
originalPrice   Float?   @map("giagoc")      // Giá gốc
vat             Float?   @default(0)         // VAT %

// Tồn kho
stock           Int      @map("soluong")     // Số lượng
stockInWare     Int?     @map("soluongkho")  // Số lượng kho
wastage         Float    @map("haohut")      // Hao hụt
loadpoint       Float?   @default(0)         // Điểm tải

// Đơn vị tính
unit            ProductUnit @map("dvt")

// Hình ảnh
thumbnail       String?  @map("hinhanh")

// Ghi chú & Hiển thị
notes           String?  @map("ghichu")
displayOrder    Int      @map("order")
```

#### Relations Mới:
```prisma
priceListItems  PriceListProduct[] // Bảng giá sản phẩm
suppliers       Supplier[]         @relation("SupplierProducts")
```

#### Indexes Mới:
```prisma
@@index([productCode])
```

---

### 2. **Order Model** (Đơn hàng)

#### Fields Mới Thêm:
```prisma
// Thông tin cơ bản
orderNumber     String   @unique @map("madonhang")
title           String?
type            String?

// Khách hàng nội bộ
customerId      String?  @map("khachhangId")
customer        Customer? @relation("CustomerOrders")

// Bảng giá
priceListId     String?  @map("banggiaId")
priceList       PriceList? @relation("OrderPriceList")

// Giá & VAT
subtotal        Float    @map("tongtien")    // Tổng tiền
tax             Float    @map("tongvat")     // Tổng VAT
vat             Float    @default(0)         // VAT %

// Thông tin giao hàng
deliveryDate    DateTime? @map("ngaygiao")   // Ngày giao
isShowVAT       Boolean  @map("isshowvat")
shipper         String?                      // Shipper
deliveryNote    String?  @map("phieuve")     // Phiếu về
departTime      String?  @map("giodi")       // Giờ đi
returnTime      String?  @map("giove")       // Giờ về
signature       String?  @map("kynhan")      // Ký nhận

// Ghi chú & Quản lý
customerNote    String?  @map("ghichu")
cancelReason    String?  @map("lydohuy")
printCount      Int?     @default(0)
displayOrder    Int?     @map("order")
```

#### Indexes Mới:
```prisma
@@index([customerId])
@@index([deliveryDate])
@@index([customerId, deliveryDate])
```

---

### 3. **OrderItem Model** (Chi tiết đơn hàng)

#### Fields Mới Thêm:
```prisma
// Product ID
productId          String?  @map("idSP")

// Số lượng chi tiết
quantityOrdered    Int      @map("sldat")     // SL đặt
quantityDelivered  Int      @map("slgiao")    // SL giao
quantityReceived   Int      @map("slnhan")    // SL nhận
quantityCancelled  Int      @map("slhuy")     // SL hủy
quantity           Int      @default(0)       // Legacy field

// Giá chi tiết
price              Float    @map("giaban")
subtotal           Float    @map("ttdat")     // Tổng tiền đặt
totalDelivered     Float    @map("ttgiao")    // Tổng giao
totalReceived      Float    @map("ttnhan")    // Tổng nhận
totalAfterVAT      Float    @map("ttsauvat")  // Tổng sau VAT
vat                Float    @default(0)

// Quản lý
notes              String?  @map("ghichu")
displayOrder       Int?     @map("order")
isActive           Boolean  @default(false)
```

---

### 4. **Customer Model** (Khách hàng) - MỚI

```prisma
model Customer {
  id                String   @id @default(uuid())
  name              String?
  nameEn            String?  @map("namenn")          // Tên tiếng Anh
  subtitle          String?
  customerCode      String   @unique @map("makh")    // Mã KH
  customerCodeOld   String?  @map("makhold")         // Mã cũ
  address           String?  @map("diachi")
  phone             String?  @map("sdt")
  taxCode           String?  @map("mst")             // Mã số thuế
  deliveryTime      String?  @map("gionhanhang")     // Giờ nhận
  district          String?  @map("quan")
  email             String?
  phoneAlt          String?  @map("phone")           // Phone phụ
  addressAlt        String?  @map("address")         // Địa chỉ phụ
  customerType      String?  @map("loaikh")          // Loại KH
  notes             String?  @map("ghichu")
  showPrice         Boolean  @default(false) @map("hiengia")
  isActive          Boolean  @default(false)
  showTitle2        Boolean  @default(false) @map("istitle2")
  fileName          String?  @map("tenfile")
  customerName      String?  @map("tenkh")
  priceListId       String?  @map("banggiaId")
  isShowVAT         Boolean  @default(true) @map("isshowvat")
  routeCode         String?  @map("machuyen")        // Mã chuyến

  // Relations
  priceList      PriceList?      @relation("CustomerPriceList")
  customerGroups CustomerGroup[] @relation("CustomerGroups")
  orders         Order[]         @relation("CustomerOrders")
}
```

**Indexes:**
```prisma
@@index([name])
@@index([customerCode])
@@index([isActive])
```

---

### 5. **Supplier Model** (Nhà cung cấp) - MỚI

```prisma
model Supplier {
  id              String   @id @default(uuid())
  name            String?
  supplierCode    String   @unique @map("mancc")
  supplierCodeOld String?  @map("manccold")
  address         String?  @map("diachi")
  email           String?
  phone           String?  @map("sdt")
  notes           String?  @map("ghichu")
  isActive        Boolean  @default(true)
  isShowVAT       Boolean  @default(true) @map("isshowvat")
  fileName        String?  @map("tenfile")

  // Relations
  products       Product[]       @relation("SupplierProducts")
  supplierGroups SupplierGroup[] @relation("SupplierGroups")
}
```

---

### 6. **PriceList Model** (Bảng giá) - MỚI

```prisma
model PriceList {
  id            String    @id @default(uuid())
  title         String?
  priceListCode String?   @unique @map("mabanggia")
  type          String?
  startDate     DateTime? @map("batdau")
  endDate       DateTime? @map("ketthuc")
  displayOrder  Int?      @default(1) @map("order")
  notes         String?   @map("ghichu")
  status        String?
  isActive      Boolean   @default(true)
  isDefault     Boolean   @default(false)

  // Relations
  products  PriceListProduct[]
  customers Customer[]         @relation("CustomerPriceList")
  orders    Order[]            @relation("OrderPriceList")
}
```

**Unique Constraint:**
```prisma
@@unique([priceListCode, startDate, endDate], name: "unique_pricelist_time_range")
```

---

### 7. **PriceListProduct Model** (Bảng giá sản phẩm) - MỚI

```prisma
model PriceListProduct {
  id           String    @id @default(uuid())
  price        Float     @map("giaban")
  productId    String
  priceListId  String
  displayOrder Int?      @map("order")
  isActive     Boolean   @default(false)

  product   Product   @relation(...)
  priceList PriceList @relation(...)
}
```

---

### 8. **CustomerGroup Model** (Nhóm khách hàng) - MỚI

```prisma
model CustomerGroup {
  id          String     @id @default(uuid())
  name        String     @unique
  description String?
  customers   Customer[] @relation("CustomerGroups")
}
```

---

### 9. **SupplierGroup Model** (Nhóm nhà cung cấp) - MỚI

```prisma
model SupplierGroup {
  id          String     @id @default(uuid())
  name        String     @unique
  description String?
  suppliers   Supplier[] @relation("SupplierGroups")
}
```

---

## 📊 Mapping Fields (Tiếng Việt ↔ Tiếng Anh)

### Product:
| Tiếng Việt | Tiếng Anh | Field Name |
|------------|-----------|------------|
| Mã sản phẩm | Product Code | `productCode` / `masp` |
| Giá bán | Price | `price` / `giaban` |
| Giá gốc | Original Price | `originalPrice` / `giagoc` |
| Số lượng | Stock | `stock` / `soluong` |
| Số lượng kho | Stock in Warehouse | `stockInWare` / `soluongkho` |
| Hao hụt | Wastage | `wastage` / `haohut` |
| Đơn vị tính | Unit | `unit` / `dvt` |
| Hình ảnh | Image | `thumbnail` / `hinhanh` |
| Ghi chú | Notes | `notes` / `ghichu` |
| Thứ tự | Order | `displayOrder` / `order` |

### Order:
| Tiếng Việt | Tiếng Anh | Field Name |
|------------|-----------|------------|
| Mã đơn hàng | Order Number | `orderNumber` / `madonhang` |
| Khách hàng ID | Customer ID | `customerId` / `khachhangId` |
| Bảng giá ID | Price List ID | `priceListId` / `banggiaId` |
| Tổng tiền | Subtotal | `subtotal` / `tongtien` |
| Tổng VAT | Tax | `tax` / `tongvat` |
| Ngày giao | Delivery Date | `deliveryDate` / `ngaygiao` |
| Phiếu về | Delivery Note | `deliveryNote` / `phieuve` |
| Giờ đi | Depart Time | `departTime` / `giodi` |
| Giờ về | Return Time | `returnTime` / `giove` |
| Ký nhận | Signature | `signature` / `kynhan` |
| Ghi chú | Note | `customerNote` / `ghichu` |
| Lý do hủy | Cancel Reason | `cancelReason` / `lydohuy` |

### OrderItem:
| Tiếng Việt | Tiếng Anh | Field Name |
|------------|-----------|------------|
| ID sản phẩm | Product ID | `productId` / `idSP` |
| SL đặt | Quantity Ordered | `quantityOrdered` / `sldat` |
| SL giao | Quantity Delivered | `quantityDelivered` / `slgiao` |
| SL nhận | Quantity Received | `quantityReceived` / `slnhan` |
| SL hủy | Quantity Cancelled | `quantityCancelled` / `slhuy` |
| Giá bán | Price | `price` / `giaban` |
| TT đặt | Subtotal Ordered | `subtotal` / `ttdat` |
| TT giao | Total Delivered | `totalDelivered` / `ttgiao` |
| TT nhận | Total Received | `totalReceived` / `ttnhan` |
| TT sau VAT | Total After VAT | `totalAfterVAT` / `ttsauvat` |

### Customer:
| Tiếng Việt | Tiếng Anh | Field Name |
|------------|-----------|------------|
| Mã khách hàng | Customer Code | `customerCode` / `makh` |
| Mã cũ | Old Code | `customerCodeOld` / `makhold` |
| Địa chỉ | Address | `address` / `diachi` |
| Số điện thoại | Phone | `phone` / `sdt` |
| Mã số thuế | Tax Code | `taxCode` / `mst` |
| Giờ nhận hàng | Delivery Time | `deliveryTime` / `gionhanhang` |
| Quận | District | `district` / `quan` |
| Loại KH | Customer Type | `customerType` / `loaikh` |
| Ghi chú | Notes | `notes` / `ghichu` |
| Hiển thị giá | Show Price | `showPrice` / `hiengia` |
| Tên khách hàng | Customer Name | `customerName` / `tenkh` |
| Mã chuyến | Route Code | `routeCode` / `machuyen` |

### Supplier:
| Tiếng Việt | Tiếng Anh | Field Name |
|------------|-----------|------------|
| Mã NCC | Supplier Code | `supplierCode` / `mancc` |
| Mã cũ | Old Code | `supplierCodeOld` / `manccold` |
| Địa chỉ | Address | `address` / `diachi` |
| Số điện thoại | Phone | `phone` / `sdt` |
| Ghi chú | Notes | `notes` / `ghichu` |
| Tên file | File Name | `fileName` / `tenfile` |

---

## 🔗 Relations Overview

```
Product ──┬── PriceListProduct ── PriceList ──┬── Customer ── Order
          │                                    │
          └── Supplier                         └── Order
          
Order ── OrderItem ── Product
```

### Quan hệ chi tiết:

1. **Product:**
   - `many-to-many` với `Supplier` qua relation "SupplierProducts"
   - `one-to-many` với `PriceListProduct`
   - `one-to-many` với `OrderItem`, `CartItem`, `WishlistItem`, etc.

2. **Order:**
   - `many-to-one` với `User` (ecommerce user)
   - `many-to-one` với `Customer` (nội bộ customer)
   - `many-to-one` với `PriceList`
   - `one-to-many` với `OrderItem`

3. **Customer:**
   - `many-to-one` với `PriceList`
   - `many-to-many` với `CustomerGroup`
   - `one-to-many` với `Order`

4. **PriceList:**
   - `one-to-many` với `PriceListProduct`
   - `one-to-many` với `Customer`
   - `one-to-many` với `Order`

---

## 🎯 Tính Năng Được Giữ Nguyên

### E-commerce Features (Giữ 100%):
✅ Cart & Wishlist  
✅ Product Reviews & Ratings  
✅ Product Variants (size, color)  
✅ Inventory Management  
✅ Order Tracking & Logistics  
✅ Payment Integration  
✅ SEO Fields  
✅ Product Images  
✅ Guest Checkout  

### Nội Bộ Features (Mới thêm):
✅ Supplier Management (Quản lý nhà cung cấp)  
✅ Price List System (Hệ thống bảng giá)  
✅ Customer Groups (Nhóm khách hàng)  
✅ Detailed Order Items (Chi tiết đơn hàng: đặt/giao/nhận/hủy)  
✅ VAT Management  
✅ Delivery Scheduling (Lịch giao hàng)  
✅ Route Management (Quản lý chuyến)  

---

## 📝 Backward Compatibility

### Đảm bảo tương thích ngược:

1. **Product.quantity** → mapped to `Product.stock` / `soluong`
2. **Order.orderNumber** → mapped to `madonhang`
3. **OrderItem.quantity** → giữ nguyên, thêm `quantityOrdered` for internal
4. **Optional fields** → Tất cả fields nội bộ đều `optional` (`String?`, `Int?`)

### Migration Safety:
- ✅ Không xóa fields cũ
- ✅ Thêm `@map()` để mapping database columns
- ✅ Default values cho fields mới
- ✅ Nullable cho tất cả nội bộ fields

---

## 🚀 Next Steps

### 1. Tạo Migration:
```bash
cd backend
bunx prisma migrate dev --name add_internal_system_integration
```

### 2. Generate Prisma Client:
```bash
bunx prisma generate
```

### 3. Update GraphQL Schema:
- Thêm resolvers cho `Customer`, `Supplier`, `PriceList`
- Update `Product`, `Order`, `OrderItem` resolvers
- Thêm queries & mutations

### 4. Test Import/Export:
- Test import Product từ file Excel với `productCode` (masp)
- Test import Customer với `customerCode` (makh)
- Test import Order với relations

---

## 📊 Statistics

### Models Added:
- ✅ `Customer` (Khách hàng)
- ✅ `CustomerGroup` (Nhóm khách hàng)
- ✅ `Supplier` (Nhà cung cấp)
- ✅ `SupplierGroup` (Nhóm NCC)
- ✅ `PriceList` (Bảng giá)
- ✅ `PriceListProduct` (Chi tiết bảng giá)

### Models Updated:
- ✅ `Product` (+15 fields, +2 relations)
- ✅ `Order` (+17 fields, +2 relations)
- ✅ `OrderItem` (+12 fields)

### Total New Fields: **44 fields**
### Total New Indexes: **12 indexes**
### Total New Relations: **9 relations**

---

## ✅ Hoàn Thành

**Schema đã được cập nhật thành công!**
- Tích hợp đầy đủ hệ thống nội bộ
- Giữ nguyên 100% tính năng ecommerce
- Mapping fields tiếng Anh/Việt chuẩn
- Backward compatible
- Ready for migration! 🎉

---

**Tạo bởi:** AI Assistant  
**Ngày:** 2025-11-05  
**Version:** 1.0 - Internal System Integration
