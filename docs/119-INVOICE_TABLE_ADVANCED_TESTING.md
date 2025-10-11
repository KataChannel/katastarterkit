# InvoiceTableAdvanced - Testing Guide

## 🧪 Test Scenarios

### 1. Basic Display Tests

#### Test 1.1: Table Renders with Data
**Steps:**
1. Navigate to `/ketoan/listhoadon`
2. Sync data from API or load existing data
3. Verify table displays

**Expected:**
- ✅ Table hiển thị với 20 cột
- ✅ Dữ liệu hiển thị đầy đủ
- ✅ Scroll ngang hoạt động
- ✅ Loading state hiển thị khi đang load

#### Test 1.2: Empty State
**Steps:**
1. Clear all data (hoặc chọn tháng không có data)
2. Verify empty state

**Expected:**
- ✅ Table hiển thị message "No data"
- ✅ Toolbar vẫn visible
- ✅ Không có lỗi console

#### Test 1.3: Loading State
**Steps:**
1. Trigger sync/load action
2. Observe loading state

**Expected:**
- ✅ Loading spinner hiển thị
- ✅ Table content bị disable
- ✅ Smooth transition khi load xong

### 2. Sorting Tests

#### Test 2.1: Single Column Sort
**Steps:**
1. Click vào header "MST Người bán"
2. Click lần 2
3. Click lần 3

**Expected:**
- ✅ Lần 1: Sort ASC (↑)
- ✅ Lần 2: Sort DESC (↓)
- ✅ Lần 3: Clear sort (↕)
- ✅ Icon thay đổi đúng

#### Test 2.2: Multi-Column Sort
**Steps:**
1. Click "Số HĐ" (sort primary)
2. Shift + Click "Tiền chưa thuế" (sort secondary)
3. Verify multi-sort

**Expected:**
- ✅ Sort by Số HĐ first
- ✅ Then by Tiền chưa thuế
- ✅ Priority indicators hiển thị (1, 2)

#### Test 2.3: Number Field Sort
**Steps:**
1. Sort by "Tiền chưa thuế"
2. Verify ascending order
3. Sort descending

**Expected:**
- ✅ Số nhỏ nhất ở trên (ASC)
- ✅ Số lớn nhất ở trên (DESC)
- ✅ Null values ở cuối

### 3. Filtering Tests

#### Test 3.1: Column Filter - Text
**Steps:**
1. Open filter for "Ký hiệu mẫu"
2. Enter "C22T"
3. Apply filter

**Expected:**
- ✅ Only rows with "C22T" hiển thị
- ✅ Filter badge hiển thị
- ✅ Clear filter hoạt động

#### Test 3.2: Column Filter - Number
**Steps:**
1. Open filter for "Tiền chưa thuế"
2. Select "Greater than"
3. Enter "1000000"

**Expected:**
- ✅ Only rows > 1,000,000 hiển thị
- ✅ Filter applied correctly

#### Test 3.3: Global Search
**Steps:**
1. Click search icon in toolbar
2. Type "Công ty TNHH"
3. Verify results

**Expected:**
- ✅ Search across all columns
- ✅ Highlight matched text (if implemented)
- ✅ Clear search hoạt động

#### Test 3.4: Multiple Filters
**Steps:**
1. Filter "Trạng thái" = "Hợp lệ"
2. Filter "Tiền thuế" > 100000
3. Global search "2024"

**Expected:**
- ✅ All filters combined (AND logic)
- ✅ Correct rows displayed
- ✅ Filter badges show count

### 4. Column Management Tests

#### Test 4.1: Column Resize
**Steps:**
1. Hover on column border
2. Drag to resize
3. Verify width changes

**Expected:**
- ✅ Cursor changes to resize (↔)
- ✅ Width updates smoothly
- ✅ Min/max width respected

#### Test 4.2: Auto-Size Column
**Steps:**
1. Double-click column border
2. Verify auto-size

**Expected:**
- ✅ Column fits content
- ✅ Header + data considered
- ✅ Reasonable width (100-300px)

#### Test 4.3: Auto-Size All
**Steps:**
1. Click "Auto Size All" button
2. Verify all columns resize

**Expected:**
- ✅ All columns fit content
- ✅ Smooth animation
- ✅ Scroll position maintained

#### Test 4.4: Column Hide/Show
**Steps:**
1. Click "Columns" button
2. Uncheck "Địa chỉ NB"
3. Verify column hidden
4. Re-check and verify shown

**Expected:**
- ✅ Column disappears
- ✅ Other columns adjust
- ✅ Re-appear smoothly

#### Test 4.5: Column Pinning
**Steps:**
1. Right-click on "Tổng TT (số)" header
2. Select "Pin Right"
3. Scroll table

**Expected:**
- ✅ Column stays visible while scrolling
- ✅ Pin icon appears
- ✅ Unpin works

### 5. Row Interaction Tests

#### Test 5.1: Row Click
**Steps:**
1. Click on any invoice row
2. Verify modal opens

**Expected:**
- ✅ InvoiceDetailModal opens
- ✅ Correct invoice data passed
- ✅ Modal closes properly

#### Test 5.2: Row Hover
**Steps:**
1. Hover over rows
2. Verify hover state

**Expected:**
- ✅ Background color changes
- ✅ Cursor shows pointer
- ✅ Smooth transition

#### Test 5.3: Row Selection (Checkbox)
**Steps:**
1. Click checkbox on row
2. Verify selection
3. Select multiple rows

**Expected:**
- ✅ Checkbox checked
- ✅ Row highlighted
- ✅ Selection count badge shows

### 6. Export Tests

#### Test 6.1: Export All Data
**Steps:**
1. Load data (e.g., 50 rows)
2. Click "Export" button
3. Verify CSV download

**Expected:**
- ✅ File downloads as "export.csv"
- ✅ All visible columns included
- ✅ Data formatted correctly

#### Test 6.2: Export Filtered Data
**Steps:**
1. Apply filter (e.g., Status = "Hợp lệ")
2. Click Export
3. Open CSV file

**Expected:**
- ✅ Only filtered rows exported
- ✅ Column headers included
- ✅ Vietnamese characters correct (UTF-8)

#### Test 6.3: Export Hidden Columns
**Steps:**
1. Hide some columns
2. Export data
3. Verify CSV

**Expected:**
- ✅ Hidden columns NOT included
- ✅ Only visible columns exported

### 7. Performance Tests

#### Test 7.1: Large Dataset (1000+ rows)
**Steps:**
1. Load 1000 rows
2. Scroll through table
3. Apply sort/filter

**Expected:**
- ✅ Smooth 60 FPS scroll
- ✅ Sort completes < 500ms
- ✅ Filter completes < 500ms
- ✅ No memory leaks

#### Test 7.2: Virtual Scrolling
**Steps:**
1. Load 500+ rows
2. Scroll rapidly
3. Monitor DOM elements

**Expected:**
- ✅ Only visible rows in DOM
- ✅ Rows render/unmount smoothly
- ✅ No flickering

#### Test 7.3: Resize Performance
**Steps:**
1. Resize column rapidly
2. Resize window
3. Verify smooth updates

**Expected:**
- ✅ No lag during resize
- ✅ Updates debounced
- ✅ Responsive layout

### 8. UI/UX Tests

#### Test 8.1: Currency Formatting
**Steps:**
1. Check "Tiền chưa thuế" values
2. Check "Tiền thuế" values
3. Check "Tổng TT (số)" values

**Expected:**
- ✅ Format: "1.234.567 ₫"
- ✅ Right-aligned
- ✅ Bold for total
- ✅ Blue color for total

#### Test 8.2: Status Colors
**Steps:**
1. Find invoice with status "1" or "active"
2. Find invoice with status "0" or "cancelled"
3. Find invoice with other status

**Expected:**
- ✅ "Hợp lệ" = Green badge
- ✅ "Đã hủy" = Red badge
- ✅ Other = Yellow badge

#### Test 8.3: Text Truncation
**Steps:**
1. Check long addresses (nbdchi, nmdchi)
2. Hover over truncated text
3. Verify tooltip

**Expected:**
- ✅ Text truncated at 200px
- ✅ Ellipsis (...) shown
- ✅ Full text in tooltip

#### Test 8.4: Responsive Layout
**Steps:**
1. Resize window to tablet size
2. Resize to mobile size
3. Verify horizontal scroll

**Expected:**
- ✅ Horizontal scroll appears
- ✅ All columns accessible
- ✅ Toolbar remains functional

### 9. Integration Tests

#### Test 9.1: Sync and Display
**Steps:**
1. Click "Đồng bộ từ API"
2. Wait for sync complete
3. Verify table updates

**Expected:**
- ✅ Progress bar shows
- ✅ Table updates with new data
- ✅ No duplicate rows

#### Test 9.2: Search and Display
**Steps:**
1. Click "Tìm trong Database"
2. Wait for results
3. Verify table updates

**Expected:**
- ✅ Loading state shows
- ✅ Results display correctly
- ✅ Pagination info correct

#### Test 9.3: Month/Year Filter
**Steps:**
1. Change month dropdown
2. Click "Tìm trong Database"
3. Verify date range

**Expected:**
- ✅ Correct month data loads
- ✅ Date range displayed
- ✅ Table filters by date

### 10. Edge Cases

#### Test 10.1: Null/Undefined Values
**Steps:**
1. Find row with missing data
2. Verify display

**Expected:**
- ✅ Shows "N/A"
- ✅ No console errors
- ✅ No broken layout

#### Test 10.2: Very Long Text
**Steps:**
1. Find row with very long address
2. Verify truncation

**Expected:**
- ✅ Text truncates properly
- ✅ No overflow
- ✅ Tooltip shows full text

#### Test 10.3: Special Characters
**Steps:**
1. Find data with Vietnamese characters
2. Find data with symbols (&, <, >)

**Expected:**
- ✅ Vietnamese chars display correctly
- ✅ Special chars escaped
- ✅ No XSS vulnerabilities

#### Test 10.4: Zero Values
**Steps:**
1. Find row with tgtcthue = 0
2. Verify display

**Expected:**
- ✅ Shows "0 ₫"
- ✅ Not "N/A"
- ✅ Correct formatting

## 📊 Test Coverage Matrix

| Feature | Test Count | Priority | Status |
|---------|-----------|----------|--------|
| Display | 3 | High | ⏳ |
| Sorting | 3 | High | ⏳ |
| Filtering | 4 | High | ⏳ |
| Column Mgmt | 5 | Medium | ⏳ |
| Row Interaction | 3 | High | ⏳ |
| Export | 3 | Medium | ⏳ |
| Performance | 3 | Medium | ⏳ |
| UI/UX | 4 | Medium | ⏳ |
| Integration | 3 | High | ⏳ |
| Edge Cases | 4 | Low | ⏳ |
| **Total** | **35** | - | - |

## ✅ Acceptance Criteria

### Must Have (P0):
- ✅ All 20 columns display correctly
- ✅ Sort works for sortable columns
- ✅ Filter works for filterable columns
- ✅ Export CSV works
- ✅ Row click opens detail modal
- ✅ No TypeScript errors
- ✅ No console errors

### Should Have (P1):
- ✅ Column resize works
- ✅ Column hide/show works
- ✅ Virtual scroll smooth
- ✅ Currency format correct
- ✅ Status colors correct
- ✅ Responsive layout

### Nice to Have (P2):
- ✅ Multi-column sort
- ✅ Column pinning
- ✅ Auto-size columns
- ✅ Loading animations
- ✅ Tooltips

## 🐛 Bug Report Template

```markdown
**Bug Title:** [Short description]

**Severity:** Critical | High | Medium | Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**


**Actual Result:**


**Screenshots:**
[Attach if applicable]

**Environment:**
- Browser: 
- OS: 
- Screen size: 

**Additional Notes:**

```

## 📝 Test Results Log

```markdown
# Test Session: [Date]
Tester: [Name]
Build: [Version/Commit]

## Results Summary
- Total Tests: 35
- Passed: ___
- Failed: ___
- Skipped: ___
- Pass Rate: ___%

## Failed Tests
1. [Test ID]: [Description] - [Reason]

## Notes
- 
```

---

**Testing Tips:**
1. Test on multiple browsers (Chrome, Firefox, Safari, Edge)
2. Test on different screen sizes (Desktop, Tablet, Mobile)
3. Test with different data volumes (10, 100, 1000 rows)
4. Clear cache between tests
5. Check console for errors
6. Monitor network requests
7. Check memory usage in DevTools
