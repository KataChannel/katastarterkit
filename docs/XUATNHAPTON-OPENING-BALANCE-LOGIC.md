# 📊 Cách Tính Tồn Đầu trong Xuất Nhập Tồn

## 🎯 Tổng Quan

Module **Xuất Nhập Tồn** tính toán tồn đầu (opening inventory) dựa trên **phương pháp tính lũy tiến** (running balance method) theo thời gian.

## 🔍 Phương Pháp Tính

### Công Thức Cơ Bản

```
Tồn Đầu (Ngày N) = Tồn Cuối (Ngày N-1)
```

### Logic Chi Tiết

```typescript
// Khởi tạo
let runningQuantity = 0;  // Tồn đầu ban đầu = 0
let runningAmount = 0;

// Với mỗi ngày (đã sắp xếp theo thứ tự thời gian)
rows.forEach(row => {
  // 1. Tồn đầu = Tồn cuối ngày trước
  row.openingQuantity = runningQuantity;
  row.openingAmount = runningAmount;
  
  // 2. Tính giá vốn bình quân gia quyền
  const totalQuantity = row.openingQuantity + row.importQuantity;
  const totalAmount = row.openingAmount + row.importAmount;
  const weightedAvgCost = totalQuantity > 0 ? totalAmount / totalQuantity : 0;
  
  row.exportCostPrice = weightedAvgCost;
  row.exportAmount = weightedAvgCost * row.exportQuantity;
  
  // 3. Tính tồn cuối
  row.closingQuantity = row.openingQuantity + row.importQuantity - row.exportQuantity;
  row.closingAmount = row.openingAmount + row.importAmount - row.exportAmount;
  
  // 4. Cập nhật cho ngày tiếp theo
  runningQuantity = row.closingQuantity;
  runningAmount = row.closingAmount;
});
```

## 📋 Quy Trình Tính Toán

### Bước 1: Phân Loại Hóa Đơn
```typescript
// Xác định hóa đơn bán/mua dựa vào MST
const invoiceType = classifyInvoice(invoice, userMST);

// Nếu nbmst = userMST → Bán hàng → Xuất kho
// Nếu nmmst = userMST → Mua hàng → Nhập kho
```

### Bước 2: Tạo Inventory Records
```typescript
// Với mỗi detail của mỗi invoice
if (invoiceType === 'purchase') {
  row.importQuantity += quantity;  // Nhập
  row.importAmount += amount;
} 
else if (invoiceType === 'sale') {
  row.exportQuantity += quantity;  // Xuất
  row.exportSaleAmount += unitPrice * quantity;
}
```

### Bước 3: Nhóm Theo Sản Phẩm
```typescript
// Group by productName
const productGroups = new Map<string, InventoryRow[]>();
inventoryRows.forEach(row => {
  const key = row.productName;
  if (!productGroups.has(key)) {
    productGroups.set(key, []);
  }
  productGroups.get(key)!.push(row);
});
```

### Bước 4: Sắp Xếp Theo Thời Gian
```typescript
// Sort by date (ascending)
rows.sort((a, b) => a.date.localeCompare(b.date));
```

### Bước 5: Tính Lũy Tiến
```typescript
// Khởi tạo tồn đầu = 0
let runningQuantity = 0;
let runningAmount = 0;

// Với mỗi ngày
rows.forEach(row => {
  // Tồn đầu ngày này = Tồn cuối ngày trước
  row.openingQuantity = runningQuantity;
  row.openingAmount = runningAmount;
  
  // ... tính toán ...
  
  // Cập nhật cho ngày sau
  runningQuantity = row.closingQuantity;
  runningAmount = row.closingAmount;
});
```

## 🧮 Ví Dụ Cụ Thể

### Scenario: Sản phẩm "Gạo ST25"

#### Dữ liệu đầu vào:
```
Ngày 01/10: Nhập 100 kg, đơn giá 20,000đ/kg
Ngày 05/10: Xuất 30 kg
Ngày 10/10: Nhập 50 kg, đơn giá 22,000đ/kg
Ngày 15/10: Xuất 40 kg
```

#### Tính toán:

##### **Ngày 01/10**
```
Tồn đầu SL: 0 kg
Tồn đầu TT: 0đ

Nhập SL: 100 kg
Nhập TT: 2,000,000đ

Xuất SL: 0 kg
Xuất TT: 0đ

Tồn cuối SL: 0 + 100 - 0 = 100 kg
Tồn cuối TT: 0 + 2,000,000 - 0 = 2,000,000đ
```

##### **Ngày 05/10**
```
Tồn đầu SL: 100 kg (= Tồn cuối 01/10)
Tồn đầu TT: 2,000,000đ

Nhập SL: 0 kg
Nhập TT: 0đ

Giá vốn BQ: (2,000,000 + 0) / (100 + 0) = 20,000đ/kg

Xuất SL: 30 kg
Xuất TT (giá vốn): 30 × 20,000 = 600,000đ

Tồn cuối SL: 100 + 0 - 30 = 70 kg
Tồn cuối TT: 2,000,000 + 0 - 600,000 = 1,400,000đ
```

##### **Ngày 10/10**
```
Tồn đầu SL: 70 kg (= Tồn cuối 05/10)
Tồn đầu TT: 1,400,000đ

Nhập SL: 50 kg
Nhập TT: 1,100,000đ (50 × 22,000)

Xuất SL: 0 kg

Tồn cuối SL: 70 + 50 - 0 = 120 kg
Tồn cuối TT: 1,400,000 + 1,100,000 - 0 = 2,500,000đ
```

##### **Ngày 15/10**
```
Tồn đầu SL: 120 kg (= Tồn cuối 10/10)
Tồn đầu TT: 2,500,000đ

Nhập SL: 0 kg
Nhập TT: 0đ

Giá vốn BQ: (2,500,000 + 0) / (120 + 0) = 20,833đ/kg

Xuất SL: 40 kg
Xuất TT (giá vốn): 40 × 20,833 = 833,320đ

Tồn cuối SL: 120 + 0 - 40 = 80 kg
Tồn cuối TT: 2,500,000 + 0 - 833,320 = 1,666,680đ
```

## 📊 Bảng Tổng Hợp

| Ngày | Tồn Đầu SL | Tồn Đầu TT | Nhập SL | Nhập TT | Xuất SL | Giá Vốn | Xuất TT | Tồn Cuối SL | Tồn Cuối TT |
|------|------------|------------|---------|---------|---------|---------|---------|-------------|-------------|
| 01/10 | 0 | 0 | 100 | 2,000,000 | 0 | - | 0 | 100 | 2,000,000 |
| 05/10 | 100 | 2,000,000 | 0 | 0 | 30 | 20,000 | 600,000 | 70 | 1,400,000 |
| 10/10 | 70 | 1,400,000 | 50 | 1,100,000 | 0 | - | 0 | 120 | 2,500,000 |
| 15/10 | 120 | 2,500,000 | 0 | 0 | 40 | 20,833 | 833,320 | 80 | 1,666,680 |

## 🔑 Điểm Quan Trọng

### 1. Tồn Đầu Ban Đầu
```typescript
// Luôn bắt đầu từ 0
let runningQuantity = 0;
let runningAmount = 0;
```

**⚠️ Lưu ý**: Hiện tại hệ thống **KHÔNG** có tồn đầu kỳ. Tồn đầu của ngày đầu tiên trong khoảng thời gian luôn = 0.

### 2. Giá Vốn Bình Quân Gia Quyền (WAVG)
```typescript
// Công thức
Giá vốn BQ = (Tồn đầu TT + Nhập TT) / (Tồn đầu SL + Nhập SL)

// Code
const totalQuantity = row.openingQuantity + row.importQuantity;
const totalAmount = row.openingAmount + row.importAmount;
const weightedAvgCost = totalQuantity > 0 ? totalAmount / totalQuantity : 0;
```

### 3. Tồn Cuối = Tồn Đầu Ngày Sau
```typescript
// Cập nhật cho vòng lặp tiếp theo
runningQuantity = row.closingQuantity;
runningAmount = row.closingAmount;

// Vòng lặp tiếp theo
row.openingQuantity = runningQuantity; // ← Tồn cuối của ngày trước
```

### 4. Phân Biệt Giá Bán vs Giá Vốn
```typescript
// Giá bán (từ hóa đơn)
row.exportSalePrice = detail.dgia;        // Đơn giá bán
row.exportSaleAmount = price × quantity;   // Thành tiền bán

// Giá vốn (tính toán)
row.exportCostPrice = weightedAvgCost;    // Giá vốn bình quân
row.exportAmount = weightedAvgCost × quantity; // Thành tiền vốn
```

## 🚨 Hạn Chế Hiện Tại

### 1. Không Có Tồn Đầu Kỳ
```
❌ Tồn đầu kỳ từ kế toán trước không được tính
✅ Chỉ tính từ các giao dịch trong khoảng thời gian filter
```

**Impact**: Nếu filter từ 01/10 nhưng có tồn từ 30/09, số liệu sẽ không chính xác.

### 2. Không Có Kho Riêng Biệt
```
❌ Tất cả sản phẩm tính chung 1 kho
✅ Không phân biệt kho A, kho B, etc.
```

### 3. Group By Date
```
✅ Mỗi sản phẩm có nhiều rows (theo ngày)
✅ Mỗi row = 1 ngày có giao dịch
```

## 🔧 Code Location

### Main Calculation
```
File: utils/inventoryCalculator.ts
Function: calculateInventory()
Lines: ~200-220 (phần tính tồn đầu/cuối)
```

### Key Variables
```typescript
interface InventoryRow {
  openingQuantity: number;  // ← Tồn đầu SL
  openingAmount: number;    // ← Tồn đầu TT
  
  importQuantity: number;   // Nhập SL
  importAmount: number;     // Nhập TT
  
  exportQuantity: number;   // Xuất SL
  exportAmount: number;     // Xuất TT (giá vốn)
  exportCostPrice: number;  // Giá vốn đơn vị
  
  closingQuantity: number;  // ← Tồn cuối SL
  closingAmount: number;    // ← Tồn cuối TT
}
```

## 💡 Cải Tiến Đề Xuất

### 1. Thêm Tồn Đầu Kỳ
```typescript
// Option 1: Input manual
const openingBalance = {
  productName: "Gạo ST25",
  quantity: 100,
  amount: 2000000
};

// Option 2: Tính từ giao dịch trước startDate
const beforeStartDate = calculateInventoryBeforeDate(startDate);
```

### 2. Multi-Warehouse Support
```typescript
interface InventoryRow {
  // ... existing fields
  warehouseCode: string;  // Mã kho
  warehouseName: string;  // Tên kho
}
```

### 3. Inventory Adjustment Records
```typescript
// Cho phép điều chỉnh tồn kho
interface InventoryAdjustment {
  date: string;
  productName: string;
  adjustmentQuantity: number;  // +/-
  adjustmentAmount: number;
  reason: string;
}
```

### 4. Period Opening Balance
```typescript
// Tự động lấy tồn cuối của kỳ trước làm tồn đầu kỳ này
const previousPeriodEnd = calculatePeriodEnd(previousStartDate, previousEndDate);
currentPeriodStart.openingQuantity = previousPeriodEnd.closingQuantity;
currentPeriodStart.openingAmount = previousPeriodEnd.closingAmount;
```

## 🧪 Testing

### Test Case 1: Empty Inventory
```typescript
Input: No transactions before startDate
Expected: openingQuantity = 0, openingAmount = 0
```

### Test Case 2: Single Product Multiple Days
```typescript
Input: 
  - Day 1: Import 100
  - Day 2: Export 30
  - Day 3: Import 50

Expected:
  - Day 1: opening = 0, closing = 100
  - Day 2: opening = 100, closing = 70
  - Day 3: opening = 70, closing = 120
```

### Test Case 3: Weighted Average Cost
```typescript
Input:
  - Import 100 @ 20,000 = 2,000,000
  - Import 50 @ 22,000 = 1,100,000
  - Export 40

Expected:
  - Total: 150 units, 3,100,000đ
  - WAVG: 3,100,000 / 150 = 20,667đ
  - Export amount: 40 × 20,667 = 826,680đ
```

## 📚 Related Files

```
frontend/src/app/ketoan/xuatnhapton/
├── utils/
│   ├── inventoryCalculator.ts   ← Main calculation logic
│   ├── invoiceClassifier.ts     ← Classify buy/sell
│   └── formatters.ts            ← Display formatting
├── types.ts                     ← Type definitions
├── page.tsx                     ← Main page component
└── hooks/
    └── useInventoryData.ts      ← Data fetching
```

## 🎯 Summary

### Cách Tính Tồn Đầu:
1. ✅ **Khởi tạo = 0** (không có tồn đầu kỳ)
2. ✅ **Sắp xếp theo ngày** (ascending)
3. ✅ **Tính lũy tiến**: Tồn đầu = Tồn cuối ngày trước
4. ✅ **Giá vốn WAVG**: (Tồn đầu TT + Nhập TT) / (Tồn đầu SL + Nhập SL)
5. ✅ **Tồn cuối**: Tồn đầu + Nhập - Xuất

### Key Formula:
```
Ngày N:
  Tồn Đầu = Tồn Cuối (Ngày N-1)
  Giá Vốn = (Tồn Đầu TT + Nhập TT) / (Tồn Đầu SL + Nhập SL)
  Tồn Cuối = Tồn Đầu + Nhập - Xuất
```

---
**Created**: 2025-10-19  
**Version**: 1.0  
**Status**: ✅ Documented
