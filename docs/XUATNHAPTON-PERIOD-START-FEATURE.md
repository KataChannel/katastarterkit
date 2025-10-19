# 🔵 Tính Năng Ngày Chốt Đầu Kỳ - Opening Balance Feature

## 🎯 Tổng Quan

Đã thêm tính năng **Ngày Chốt Đầu Kỳ** cho phép tính toán tồn đầu kỳ chính xác từ các giao dịch lịch sử (5 năm trước).

## ✨ Tính Năng Mới

### 1. Chọn Ngày Chốt Đầu Kỳ
- Input mới trong FilterToolbar: **"Ngày Chốt Đầu Kỳ"** (optional)
- Khi chọn ngày chốt, hệ thống sẽ:
  - Tính tồn cuối tại ngày chốt từ giao dịch 5 năm trước
  - Sử dụng tồn cuối đó làm tồn đầu cho kỳ báo cáo

### 2. Tính Toán Tự Động
- **Look-back period**: 5 năm
- **Formula**: Tồn đầu kỳ = Tồn cuối (ngày trước ngày chốt)
- **Per-product**: Mỗi sản phẩm có tồn đầu riêng

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              USER INPUT: Period Start Date                   │
│              Example: 01/01/2025                             │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         STEP 1: Calculate Look-back Period                   │
├─────────────────────────────────────────────────────────────┤
│  From: 01/01/2020 (5 years before)                         │
│  To:   31/12/2024 (day before period start)                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│       STEP 2: Calculate Historical Inventory                 │
├─────────────────────────────────────────────────────────────┤
│  Run calculateInventory() for 01/01/2020 → 31/12/2024      │
│  Get closing balance for each product                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│       STEP 3: Extract Opening Balances                       │
├─────────────────────────────────────────────────────────────┤
│  Product A: Closing Qty = 100, Amt = 2,000,000             │
│  Product B: Closing Qty = 50, Amt = 1,500,000              │
│  Product C: Closing Qty = 200, Amt = 4,000,000             │
│                                                              │
│  Map<productName, { quantity, amount }>                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│      STEP 4: Calculate Current Period Inventory              │
├─────────────────────────────────────────────────────────────┤
│  From: 01/01/2025 (period start)                           │
│  To:   31/12/2025 (report end date)                        │
│                                                              │
│  Initialize with opening balances:                          │
│    Product A: Opening = 100, 2,000,000 ← from Step 3       │
│    Product B: Opening = 50, 1,500,000 ← from Step 3        │
│    Product C: Opening = 200, 4,000,000 ← from Step 3       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT: Inventory Rows                     │
│              with Accurate Opening Balances                  │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Ví Dụ Cụ Thể

### Scenario: Báo cáo từ 01/01/2025

#### Without Period Start Date (Old Behavior)
```
Ngày 01/01/2025:
  Tồn đầu: 0 ← Always 0
  Nhập: 50
  Xuất: 0
  Tồn cuối: 50
```
**❌ Problem**: Tồn đầu = 0 không chính xác nếu có tồn từ năm trước

#### With Period Start Date = 01/01/2025 (New Feature)
```
Historical Calculation (01/01/2020 → 31/12/2024):
  2020: Import 100, Export 20 → Closing = 80
  2021: Import 50, Export 30 → Closing = 100
  2022: Import 60, Export 40 → Closing = 120
  2023: Import 40, Export 50 → Closing = 110
  2024: Import 30, Export 40 → Closing = 100

Opening Balance at 01/01/2025:
  Quantity: 100 ← from historical closing
  Amount: 2,000,000

Current Period (01/01/2025):
  Tồn đầu: 100 ✅ Accurate!
  Nhập: 50
  Xuất: 0
  Tồn cuối: 150
```

## 🔧 Implementation Details

### 1. New Types

```typescript
// types.ts
export interface DateRange {
  startDate: string;
  endDate: string;
  periodStartDate?: string; // ← NEW
}

export interface OpeningBalance {
  productName: string;
  quantity: number;
  amount: number;
}
```

### 2. New Function: calculateOpeningBalance()

```typescript
// inventoryCalculator.ts
export const calculateOpeningBalance = (
  invoices: InvoiceHeader[],
  details: InvoiceDetail[],
  products: ProductMapping[],
  userMST: string,
  groupBy: GroupBy,
  periodStartDate: string
): Map<string, OpeningBalance> => {
  // Calculate 5 years before
  const fiveYearsAgo = new Date(periodStartDate);
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
  // Get closing balance from historical period
  const dayBefore = new Date(periodStartDate);
  dayBefore.setDate(dayBefore.getDate() - 1);
  
  const historical = calculateInventory(
    invoices, details, products, userMST, groupBy,
    fiveYearsAgo.toISOString().split('T')[0],
    dayBefore.toISOString().split('T')[0]
  );
  
  // Extract closing as opening
  const map = new Map<string, OpeningBalance>();
  historical.forEach(row => {
    const existing = map.get(row.productName);
    if (existing) {
      existing.quantity += row.closingQuantity;
      existing.amount += row.closingAmount;
    } else {
      map.set(row.productName, {
        productName: row.productName,
        quantity: row.closingQuantity,
        amount: row.closingAmount
      });
    }
  });
  
  return map;
};
```

### 3. Updated calculateInventory()

```typescript
// Now accepts optional openingBalances
export const calculateInventory = (
  // ... existing params
  openingBalances?: Map<string, OpeningBalance>
): InventoryRow[] => {
  // ...
  
  productGroups.forEach(rows => {
    rows.sort((a, b) => a.date.localeCompare(b.date));
    
    // Initialize with opening balance if available
    const productName = rows[0].productName;
    const openingBalance = openingBalances?.get(productName);
    
    let runningQuantity = openingBalance?.quantity || 0; // ← NEW
    let runningAmount = openingBalance?.amount || 0;     // ← NEW
    
    // ... rest of calculation
  });
};
```

### 4. UI Components

#### FilterToolbar.tsx
```tsx
<div className="space-y-2">
  <Label htmlFor="periodStartDate">
    Ngày Chốt Đầu Kỳ
    <span className="text-xs text-muted-foreground">(optional)</span>
  </Label>
  <Input
    id="periodStartDate"
    type="date"
    value={localDateRange.periodStartDate || ''}
    onChange={(e) => setLocalDateRange({ 
      ...localDateRange, 
      periodStartDate: e.target.value || undefined 
    })}
  />
  <p className="text-xs text-muted-foreground">
    Tính tồn đầu từ giao dịch 5 năm trước
  </p>
</div>
```

#### Info Banner
```tsx
{localDateRange.periodStartDate && (
  <div className="bg-green-50 border border-green-200 px-4 py-2">
    🔵 <strong>Ngày chốt đầu kỳ:</strong> {date}
    <span>(Tồn đầu tính từ 5 năm trước)</span>
  </div>
)}
```

## 🎯 User Guide

### Cách Sử Dụng

1. **Mở trang Xuất Nhập Tồn**
   - Vào: `/ketoan/xuatnhapton`

2. **Chọn Ngày Chốt Đầu Kỳ** (Optional)
   - Ví dụ: `01/01/2025`
   - Hệ thống sẽ tính tồn đầu từ 5 năm trước (01/01/2020)

3. **Chọn Kỳ Báo Cáo**
   - Từ Ngày: `01/01/2025`
   - Đến Ngày: `31/12/2025`

4. **Click "Tìm kiếm"**
   - Hệ thống sẽ:
     - Tính tồn đầu từ giao dịch 5 năm trước
     - Hiển thị báo cáo với tồn đầu chính xác

### Khi Nào Nên Dùng?

✅ **Nên dùng khi:**
- Có tồn kho từ các kỳ trước
- Cần số liệu tồn đầu chính xác
- Báo cáo đầu năm/quý/tháng mới

❌ **Không cần dùng khi:**
- Kinh doanh mới, chưa có tồn
- Chỉ xem giao dịch trong khoảng thời gian
- Test với data mới

## 📊 Comparison: Before vs After

### Before (Without Period Start Date)

```
Tình huống: Báo cáo Q1/2025
Thực tế: Tồn cuối 2024 = 1000 sản phẩm

Report:
┌──────────┬──────────┬─────────┬────────┬───────────┐
│   Date   │ Opening  │ Import  │ Export │  Closing  │
├──────────┼──────────┼─────────┼────────┼───────────┤
│ 01/01/25 │    0 ❌  │   100   │   50   │    50     │
│ 15/01/25 │   50     │   200   │  100   │   150     │
│ 31/01/25 │  150     │   150   │   80   │   220     │
└──────────┴──────────┴─────────┴────────┴───────────┘

❌ Tồn đầu 01/01 = 0 (WRONG! Thực tế = 1000)
```

### After (With Period Start Date = 01/01/2025)

```
Tình huống: Báo cáo Q1/2025
Period Start Date: 01/01/2025
Hệ thống tính: 01/01/2020 → 31/12/2024 = 1000

Report:
┌──────────┬──────────┬─────────┬────────┬───────────┐
│   Date   │ Opening  │ Import  │ Export │  Closing  │
├──────────┼──────────┼─────────┼────────┼───────────┤
│ 01/01/25 │ 1000 ✅  │   100   │   50   │  1,050    │
│ 15/01/25 │ 1050     │   200   │  100   │  1,150    │
│ 31/01/25 │ 1150     │   150   │   80   │  1,220    │
└──────────┴──────────┴─────────┴────────┴───────────┘

✅ Tồn đầu 01/01 = 1000 (CORRECT!)
```

## 🧪 Testing

### Test Case 1: No Period Start Date
```typescript
Input:
  periodStartDate: undefined
  startDate: '2025-01-01'
  endDate: '2025-12-31'

Expected:
  Opening balance = 0 (old behavior)
```

### Test Case 2: With Period Start Date
```typescript
Input:
  periodStartDate: '2025-01-01'
  startDate: '2025-01-01'
  endDate: '2025-12-31'
  Historical data: 2020-2024 with closing = 100

Expected:
  Opening balance at 2025-01-01 = 100
```

### Test Case 3: Multiple Products
```typescript
Input:
  periodStartDate: '2025-01-01'
  Historical closing:
    Product A: 100 units, 2M
    Product B: 50 units, 1M
    Product C: 200 units, 4M

Expected:
  Product A opening: 100, 2M
  Product B opening: 50, 1M
  Product C opening: 200, 4M
```

### Test Case 4: No Historical Data
```typescript
Input:
  periodStartDate: '2025-01-01'
  Historical data: None (new business)

Expected:
  Opening balance = 0 (no historical data)
```

## 🎨 UI Changes

### FilterToolbar Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 🔵 Ngày chốt đầu kỳ: 01/01/2025 (Tồn đầu tính từ 5 năm    │
│    trước)                                                    │
├─────────────────────────────────────────────────────────────┤
│ 📊 Tổng số: 1,250 bản ghi                                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Ngày Chốt ĐK │   Từ Ngày    │   Đến Ngày   │   Search     │
│ 01/01/2025   │  01/01/2025  │  31/12/2025  │ [Tìm kiếm]  │
│ (optional)   │              │              │              │
│ Tính tồn đầu │              │              │              │
│ từ 5 năm     │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

## 🔑 Key Points

### 1. Look-back Period: 5 Years
```typescript
const fiveYearsAgo = new Date(periodStartDate);
fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
```
**Why 5 years?**
- Covers most business cycles
- Enough for inventory history
- Balance between accuracy and performance

### 2. Day Before Period Start
```typescript
const dayBefore = new Date(periodStartDate);
dayBefore.setDate(dayBefore.getDate() - 1);
```
**Why day before?**
- Closing of day N-1 = Opening of day N
- Clean separation between periods

### 3. Optional Feature
```
periodStartDate?: string // Optional in DateRange
```
**Why optional?**
- Backward compatible
- Users can choose when to use
- No impact if not set

### 4. Per-Product Balance
```typescript
Map<productName, OpeningBalance>
```
**Why per-product?**
- Each product has its own history
- Independent calculations
- More accurate

## 📚 Related Files

```
Modified:
├── types.ts                          # Added periodStartDate, OpeningBalance
├── utils/inventoryCalculator.ts     # Added calculateOpeningBalance()
├── components/FilterToolbar.tsx     # Added period start input
├── page.tsx                         # Integrated opening balance
└── utils/index.ts                   # Export new function

Documentation:
└── docs/
    ├── XUATNHAPTON-OPENING-BALANCE-LOGIC.md        # Original doc (updated)
    ├── XUATNHAPTON-PERIOD-START-FEATURE.md         # This file
    └── XUATNHAPTON-OPENING-BALANCE-VISUAL.md       # Visual guide
```

## ⚠️ Important Notes

### Performance Consideration
- **Look-back query**: Queries 5 years of data
- **Cache consideration**: May need caching for large datasets
- **First load**: May take longer if period start is set

### Data Accuracy
- **Depends on historical data**: If historical data is incomplete, opening balance will be inaccurate
- **MST matching**: Must have correct MST for all periods
- **Product mapping**: Product names must match across periods

### User Experience
- **Optional by default**: Users choose when to use
- **Clear indication**: Green banner shows period start is active
- **Help text**: Explains the feature

## 🚀 Future Enhancements

### 1. Configurable Look-back Period
```typescript
interface DateRange {
  periodStartDate?: string;
  lookbackYears?: number; // Default: 5
}
```

### 2. Manual Opening Balance Input
```typescript
interface ManualOpeningBalance {
  productName: string;
  quantity: number;
  amount: number;
  effectiveDate: string;
}
```

### 3. Opening Balance Report
- Generate report showing opening balances used
- Compare with manual entry
- Export opening balance

### 4. Performance Optimization
- Cache historical calculations
- Incremental updates
- Background processing

## ✅ Summary

### What Changed?
✅ Added optional "Ngày Chốt Đầu Kỳ" input  
✅ Calculate opening balance from 5 years historical data  
✅ Use historical closing as current opening  
✅ Visual indicators for period start  
✅ Backward compatible (optional feature)  

### Benefits
- 🎯 **Accurate opening balance** from historical data
- 📊 **Better reporting** for period-based analysis
- 🔄 **Automatic calculation** no manual input needed
- ✅ **Optional** backward compatible

### Usage
```
1. Chọn "Ngày Chốt Đầu Kỳ" (optional)
2. Hệ thống tự động tính tồn đầu từ 5 năm trước
3. Báo cáo có tồn đầu chính xác
```

---
**Created**: 2025-10-19  
**Version**: 1.0  
**Feature**: Period Start Date with 5-year Look-back  
**Status**: ✅ Implemented
