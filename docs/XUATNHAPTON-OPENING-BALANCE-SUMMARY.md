# 📋 Tồn Đầu - Quick Summary

## 🎯 Câu Trả Lời Nhanh

**Q: Tồn đầu được lấy từ đâu?**  
**A:** Tồn đầu = Tồn cuối của ngày trước đó

**Q: Tồn đầu ngày đầu tiên = bao nhiêu?**  
**A:** Luôn = **0** (không có tồn đầu kỳ)

**Q: Tồn đầu được tính như thế nào?**  
**A:** Tính **lũy tiến** (running balance) theo thời gian

## 🔑 Core Logic (3 dòng code)

```typescript
// 1. Khởi tạo
let runningQuantity = 0, runningAmount = 0;

// 2. Với mỗi ngày (đã sort)
rows.forEach(row => {
  row.openingQuantity = runningQuantity;  // ← Tồn đầu = Running
  row.openingAmount = runningAmount;
  
  // ... tính toán closing ...
  
  runningQuantity = row.closingQuantity;  // ← Update cho ngày sau
  runningAmount = row.closingAmount;
});
```

## 📊 Ví Dụ Đơn Giản

```
Ngày 1: Tồn đầu = 0    → Nhập 100 → Tồn cuối = 100
           ↓ (becomes opening of Day 2)
Ngày 2: Tồn đầu = 100  → Xuất 30  → Tồn cuối = 70
           ↓ (becomes opening of Day 3)
Ngày 3: Tồn đầu = 70   → Nhập 50  → Tồn cuối = 120
```

## 💡 Key Points

1. **Không có tồn đầu kỳ**: Ngày đầu luôn = 0
2. **Sort theo ngày**: Phải sort ascending
3. **Per product**: Mỗi sản phẩm có running riêng
4. **WAVG cost**: Giá vốn = (Tồn đầu TT + Nhập TT) / (Tồn đầu SL + Nhập SL)

## 📚 Chi Tiết

- **Full doc**: [XUATNHAPTON-OPENING-BALANCE-LOGIC.md](./XUATNHAPTON-OPENING-BALANCE-LOGIC.md)
- **Visual guide**: [XUATNHAPTON-OPENING-BALANCE-VISUAL.md](./XUATNHAPTON-OPENING-BALANCE-VISUAL.md)
- **Code**: `utils/inventoryCalculator.ts` (lines ~200-220)

---
**Quick Ref** | v1.0 | 2025-10-19
