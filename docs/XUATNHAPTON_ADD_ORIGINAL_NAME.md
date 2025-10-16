# Update: Thêm Trường "Tên Gốc" vào Xuất Nhập Tồn

## 📋 Mô tả

Thêm cột **"Tên Gốc (Hóa Đơn)"** vào bảng Xuất Nhập Tồn để hiển thị tên sản phẩm gốc từ hóa đơn, giúp dễ dàng đối chiếu với dữ liệu nguồn.

## 🔧 Thay đổi

### 1. Types - Thêm field `originalName`

**File:** `frontend/src/app/ketoan/xuatnhapton/types.ts`

```typescript
export interface InventoryRow {
  productName: string;      // Tên sản phẩm (chuẩn hóa)
  originalName: string;      // ✅ THÊM: Tên sản phẩm gốc từ hóa đơn
  productCode: string | null;
  unit: string | null;
  date: string;
  // ... other fields
}
```

### 2. Calculator - Lưu tên gốc

**File:** `frontend/src/app/ketoan/xuatnhapton/utils/inventoryCalculator.ts`

```typescript
if (!row) {
  row = {
    productName: productKey,
    originalName: detail.ten, // ✅ Lưu tên gốc từ ext_detailhoadon
    productCode: productCode,
    unit: unit || detail.dvtinh,
    date: date,
    // ... other fields
  };
  inventoryMap.set(mapKey, row);
}
```

### 3. UI - Hiển thị cột mới

**File:** `frontend/src/app/ketoan/xuatnhapton/components/InventoryTable.tsx`

**Header:**
```tsx
<TableHeader>
  <TableRow>
    <TableHead className="w-[60px]">STT</TableHead>
    <TableHead className="w-[120px]">Ngày</TableHead>
    <TableHead className="min-w-[250px]">Tên Sản Phẩm</TableHead>
    <TableHead className="min-w-[250px]">Tên Gốc (Hóa Đơn)</TableHead> {/* ✅ THÊM */}
    <TableHead className="w-[120px]">Mã SP</TableHead>
    <TableHead className="w-[80px]">ĐVT</TableHead>
    {/* ... columns for Tồn Đầu, Nhập, Xuất, Tồn Cuối */}
  </TableRow>
  <TableRow>
    <TableHead colSpan={6}></TableHead> {/* ✅ ĐỔI từ 5 → 6 */}
    {/* ... sub-headers */}
  </TableRow>
</TableHeader>
```

**Body:**
```tsx
<TableCell className="font-medium">{row.productName}</TableCell>
<TableCell className="text-muted-foreground text-sm">
  {row.originalName} {/* ✅ THÊM */}
</TableCell>
<TableCell className="text-muted-foreground">
  {row.productCode || '-'}
</TableCell>
```

## 📊 Ví dụ Data

| Tên Sản Phẩm | Tên Gốc (Hóa Đơn) | Mã SP | ĐVT |
|--------------|-------------------|-------|-----|
| Chuột máy tính Logitech M331 | Chuột máy tính Logitech M331 | - | Cái |
| Màn hình vi tính LCD Lenovo | MÀN HÌNH VI TÍNH (LCD) LENOVO C22-2021.5INCH/1920 x 1080/75Hz/VGA/HDMI/ĐEN/3Y(62A7KAR1WW) | - | Cái |
| Bảng mạch chính Asus Prime | Bảng mạch chính Asus Prime H510MF | - | Cái |

## 🎯 Lợi ích

1. **Truy xuất nguồn gốc:** Dễ dàng xem tên sản phẩm chính xác từ hóa đơn
2. **Đối chiếu:** So sánh tên chuẩn hóa vs tên gốc
3. **Debug:** Phát hiện vấn đề normalization nếu có
4. **Audit:** Đảm bảo tính chính xác của dữ liệu

## 📝 Lưu ý

### Khi có Product Normalization
- **Tên Sản Phẩm:** Hiển thị `ten2` (tên chuẩn hóa từ ext_sanphamhoadon)
- **Tên Gốc:** Hiển thị `ten` (tên từ ext_detailhoadon)

### Khi chưa có Product Normalization
- **Tên Sản Phẩm:** Hiển thị `ten` (tên từ ext_detailhoadon)
- **Tên Gốc:** Hiển thị `ten` (cùng giá trị)

### Group By Mode
- **Group by "ma":** Các records cùng mã sẽ group lại, `originalName` là tên của record đầu tiên
- **Group by "ten2":** Các records cùng tên chuẩn hóa sẽ group lại

## 🧪 Test

1. **Refresh trang:** http://localhost:13000/ketoan/xuatnhapton
2. **Verify cột mới hiển thị**
3. **Check data:**
   - Tên gốc có khớp với hóa đơn không?
   - Scroll ngang để xem full table
4. **Test responsive:** Table có scroll horizontal

## ✅ Checklist

- ✅ Update `InventoryRow` interface
- ✅ Update `inventoryCalculator` to save `originalName`
- ✅ Update table header with new column
- ✅ Update table body to display `originalName`
- ✅ Adjust `colSpan` in sub-header row
- ✅ No TypeScript errors
- ✅ Documentation created

## 📂 Files Changed

1. ✅ `frontend/src/app/ketoan/xuatnhapton/types.ts`
2. ✅ `frontend/src/app/ketoan/xuatnhapton/utils/inventoryCalculator.ts`
3. ✅ `frontend/src/app/ketoan/xuatnhapton/components/InventoryTable.tsx`

---

**Updated by:** GitHub Copilot  
**Date:** 2025-10-16  
**Status:** ✅ COMPLETED
