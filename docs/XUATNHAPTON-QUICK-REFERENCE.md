# 🚀 Xuất Nhập Tồn - Quick Reference

## 🎯 Key Features

### Performance Optimization
- **Display Limit**: 100 records max on UI
- **Full Export**: Excel exports ALL data
- **Smart Info**: Shows total vs displayed count

### User Experience
- **Info Banner**: Shows record counts at top
- **Warning Banner**: Appears when data is limited
- **Enhanced Toast**: Shows exact counts on search
- **Excel Feedback**: Confirms number of exported records

## 📊 Data Flow

```
Raw Data → Filter → Split
                      ├─→ Display (100 max) → UI
                      └─→ Full Data → Excel Export
```

## 🎨 UI Elements

### 1. Info Banner (FilterToolbar)
```
📊 Tổng số: 1,250 bản ghi • Hiển thị: 100 bản ghi
   (Xuất Excel để xem đầy đủ)
```

### 2. Warning Banner (Table Header)
```
⚠️ Hiển thị 100 / 1,250 bản ghi để tối ưu hiệu suất.
   Sử dụng "Xuất Excel" để xem toàn bộ dữ liệu.
```

### 3. Pagination Info
```
Hiển thị 1 đến 50 trong tổng số 100 kết quả
(1,250 tổng - giới hạn hiển thị)
```

### 4. Search Toast
```
ℹ️ Tìm thấy 1,250 bản ghi, hiển thị 100 đầu tiên
```

### 5. Export Toast
```
✅ Đã xuất 1,250 bản ghi ra Excel
```

## 🔧 Configuration

### Change Display Limit
Edit `page.tsx`:
```typescript
const DISPLAY_LIMIT = 200; // Change from 100 to 200
```

### Adjust Items Per Page
```typescript
const [itemsPerPage] = useState(100); // Change from 50 to 100
```

## 📋 Testing Checklist

### Quick Test
- [ ] Load page with 150+ records
- [ ] Verify info banner shows counts
- [ ] Verify warning banner appears
- [ ] Verify table shows only 100 rows
- [ ] Export Excel
- [ ] Verify Excel has all 150+ rows

### Performance Test
- [ ] Load 1000+ records
- [ ] Page loads fast (< 1s)
- [ ] Table scrolls smoothly
- [ ] No UI lag

### Edge Cases
- [ ] Test with < 100 records (no warnings)
- [ ] Test with exactly 100 records
- [ ] Test with 0 records
- [ ] Test search button
- [ ] Test export with 0 records

## 💡 User Instructions

### Viewing Large Datasets
1. **UI Display**: See first 100 records for fast performance
2. **Full Data**: Click "Xuất Excel" to export ALL records
3. **Info**: Check banner for total record count

### When to Export
- Need complete dataset
- Want to share data
- Need to analyze all records in Excel

### Performance Tips
- Use search to narrow results
- Filter by date range first
- Export for detailed analysis

## 🐛 Troubleshooting

### Issue: Warning banner doesn't show
**Check**: Are there > 100 records filtered?
**Solution**: Filter to get more records

### Issue: Excel exports only 100 rows
**Check**: Is `filteredRows` used in handleExport?
**Solution**: Verify export uses `filteredRows` not `displayRows`

### Issue: UI still lags
**Check**: DISPLAY_LIMIT value
**Solution**: Reduce to 50 or check for other issues

### Issue: Wrong record count
**Check**: Summary calculation
**Solution**: Verify `displayRows` vs `filteredRows` usage

## 📦 Component Props Reference

### FilterToolbar
```typescript
totalRecords?: number;       // Total filtered records
displayedRecords?: number;   // Records shown (≤ 100)
```

### InventoryTable
```typescript
rows: InventoryRow[];        // Limited rows to display
totalRecords?: number;       // Total records count
isLimited?: boolean;         // Is data limited?
```

### Pagination
```typescript
totalItems: number;          // Display rows count
totalRecords?: number;       // Total filtered count
isLimited?: boolean;         // Show limit indicator?
```

## 🎯 Quick Facts

| Metric | Value |
|--------|-------|
| Display Limit | 100 records |
| Items Per Page | 50 records |
| Max Pages Shown | 2 pages |
| Export Limit | Unlimited |
| Performance Gain | ~90% |

## 📚 Related Docs

- **Full Documentation**: `XUATNHAPTON-PERFORMANCE-OPTIMIZATION.md`
- **Search Feature**: `XUATNHAPTON-SEARCH-OPTIMIZATION.md`
- **Test Script**: `test-xuatnhapton-performance.sh`

## 🚀 Quick Commands

```bash
# Start frontend
cd frontend && bun dev

# Run test script
./test-xuatnhapton-performance.sh

# Check TypeScript errors
cd frontend && npx tsc --noEmit

# View page
open http://localhost:13000/ketoan/xuatnhapton
```

---
**Last Updated**: 2025-10-19  
**Version**: 2.0  
**Quick Ref**: v1.0
