# Testing Guide - Invoice Sync Progress Display

## 🧪 Hướng dẫn Test chức năng

### Chuẩn bị

1. **Khởi động Backend**
```bash
cd backend
bun dev
```

2. **Khởi động Frontend**
```bash
cd frontend
bun dev
```

3. **Kiểm tra services đang chạy**
- Backend: http://localhost:14000
- Frontend: http://localhost:13000
- GraphQL: http://localhost:14000/graphql

---

## 📋 Test Cases

### Test Case 1: Sync thành công với ít hóa đơn (10-20 hóa đơn)

**Mục đích**: Kiểm tra hiển thị progress cơ bản

**Các bước**:
1. Mở trang: http://localhost:13000/ketoan/listhoadon
2. Chọn tháng/năm có ít hóa đơn (VD: tháng trước)
3. Click nút "Đồng bộ từ API"
4. Quan sát tiến trình

**Kết quả mong đợi**:
- ✅ Progress bar hiển thị và cập nhật
- ✅ Status chuyển từ "fetching" → "syncing" → "completed"
- ✅ Hiển thị số lượng hóa đơn đã lưu
- ✅ Hiển thị số chi tiết đã fetch
- ✅ Thời gian sync được hiển thị
- ✅ Success rate = 100% (nếu không có lỗi)
- ✅ Completion summary xuất hiện
- ✅ Nút close (✕) hoạt động

**Console logs mong đợi (Backend)**:
```
================================================================================
BULK INVOICE SYNC OPERATION STARTED
================================================================================
Total Invoices: 15
...

📦 BATCH 1/3 | Progress: 0.0% | Invoices: 1-5/15
  ✅ Created: Invoice ...
  📄 Fetched X details (token: frontend)
...

================================================================================
SYNC OPERATION COMPLETED
================================================================================
```

---

### Test Case 2: Sync với hóa đơn đã tồn tại (Skip scenario)

**Mục đích**: Kiểm tra xử lý skip

**Các bước**:
1. Chạy sync lần đầu với tháng hiện tại
2. Chờ hoàn thành
3. Chạy sync lại cùng tháng đó
4. Quan sát

**Kết quả mong đợi**:
- ✅ Hiển thị số hóa đơn "Đã bỏ qua"
- ✅ Card "Skipped" với số lượng > 0
- ✅ Toast thông báo về việc skip
- ✅ Sync nhanh hơn (vì chỉ skip)

**Console logs mong đợi**:
```
⏭️ Skipped (exists): Invoice HD001
⏭️ Skipped (exists): Invoice HD002
...
```

---

### Test Case 3: Sync với nhiều hóa đơn (50+ hóa đơn)

**Mục đích**: Kiểm tra batch processing và performance

**Các bước**:
1. Chọn tháng có nhiều hóa đơn (tháng hiện tại)
2. Click "Đồng bộ từ API"
3. Quan sát tiến trình qua nhiều batches

**Kết quả mong đợi**:
- ✅ Multiple batches được xử lý
- ✅ Progress percentage tăng dần
- ✅ Batch completion summaries xuất hiện
- ✅ Waiting indicators giữa các batches
- ✅ Final completion summary chính xác
- ✅ Duration > 1 minute

**Console logs mong đợi**:
```
📦 BATCH 1/10 | Progress: 0.0% | Invoices: 1-5/50
...
✓ Batch 1 completed in 8.23s | Success rate: 80.0%
⏳ Waiting 2000ms before next batch...

📦 BATCH 2/10 | Progress: 10.0% | Invoices: 6-10/50
...
```

---

### Test Case 4: Sync với lỗi network (Simulate error)

**Mục đích**: Kiểm tra error handling

**Các bước**:
1. Tắt backend hoặc API bên ngoài
2. Click "Đồng bộ từ API"
3. Quan sát error display

**Kết quả mong đợi**:
- ✅ Status chuyển sang "error"
- ✅ Error card hiển thị (màu đỏ)
- ✅ Error messages rõ ràng
- ✅ Toast error notification

**Frontend display mong đợi**:
```
❌ Tiến trình đồng bộ hóa đơn
   Lỗi đồng bộ

❌ Lỗi (1)
• Không thể đồng bộ dữ liệu: Network error
```

---

### Test Case 5: Sync với retry thành công

**Mục đích**: Kiểm tra retry logic

**Các bước**:
1. Network không ổn định (có thể dùng throttling)
2. Click "Đồng bộ từ API"
3. Quan sát retry attempts

**Kết quả mong đợi**:
- ✅ Retry indicators hiển thị
- ✅ Số lần retry được hiển thị
- ✅ Delay giữa retries tăng dần (exponential backoff)
- ✅ Cuối cùng thành công

**Console logs mong đợi**:
```
🔄 Retry 1/3 for HD004 (delay: 1000ms)
Retrying detail fetch for invoice HD004 (attempt 2/4) after 1000ms delay
📄 Fetched 5 details (token: frontend)
```

---

### Test Case 6: Bearer token từ frontend vs environment

**Mục đích**: Kiểm tra token source tracking

**Các bước**:
1. Test với token trong ConfigService (frontend)
2. Xóa token trong ConfigService
3. Test với token từ .env (backend)
4. So sánh console logs

**Kết quả mong đợi**:
- ✅ Frontend token: `(token: frontend)`
- ✅ Environment token: `(token: environment)`
- ✅ Cả 2 đều work

**Console logs**:
```
Bearer Token: Provided from frontend
📄 Fetched 3 details (token: frontend)

vs

Bearer Token: Using environment variable
📄 Fetched 3 details (token: environment)
```

---

### Test Case 7: Close và reopen progress display

**Mục đích**: Kiểm tra UI interaction

**Các bước**:
1. Chạy sync hoàn tất
2. Click nút close (✕)
3. Chạy sync mới
4. Kiểm tra component xuất hiện lại

**Kết quả mong đợi**:
- ✅ Component đóng khi click ✕
- ✅ Component mở lại khi sync mới
- ✅ Progress reset về 0
- ✅ Không có data cũ

---

### Test Case 8: Responsive display

**Mục đích**: Kiểm tra responsive design

**Các bước**:
1. Resize browser window
2. Test trên mobile viewport
3. Test trên tablet viewport

**Kết quả mong đợi**:
- ✅ Grid layout thích ứng (2 cols → 1 col)
- ✅ Text không bị cắt
- ✅ Cards hiển thị đúng
- ✅ Progress bar responsive

---

## 🔍 Debugging Tips

### Kiểm tra Backend Logs
```bash
# Terminal running backend
# Watch for emoji indicators and progress
```

### Kiểm tra Frontend Console
```javascript
// Browser console
// Should show:
console.log('Syncing invoice data to database:', {...})
console.log('Database sync result:', {...})
```

### Kiểm tra Network Tab
```
POST /api/invoices/sync
Request:
  - invoiceData: Array
  - detailsData: Array
  - bearerToken: String (optional)

Response:
  - success: Boolean
  - invoicesSaved: Number
  - detailsSaved: Number
  - errors: Array
  - message: String
  - metadata: Object
```

---

## ✅ Checklist kiểm tra

### Visual Elements
- [ ] Progress bar hiển thị và animated
- [ ] Icons (emojis) hiển thị đúng
- [ ] Colors thay đổi theo status
- [ ] Cards layout đẹp
- [ ] Typography dễ đọc

### Data Accuracy
- [ ] Total invoices đúng
- [ ] Processed count cập nhật real-time
- [ ] Saved count đúng
- [ ] Skipped count đúng (nếu có)
- [ ] Failed count đúng (nếu có)
- [ ] Details count đúng
- [ ] Success rate tính đúng
- [ ] Duration tính đúng

### Functionality
- [ ] Progress updates trong khi sync
- [ ] Status transitions work
- [ ] Error display works
- [ ] Close button works
- [ ] Metadata displays correctly
- [ ] Toast notifications work

### Performance
- [ ] No lag during updates
- [ ] Smooth animations
- [ ] Fast component rendering
- [ ] No memory leaks

### Error Handling
- [ ] Network errors handled
- [ ] API errors handled
- [ ] Validation errors handled
- [ ] Error messages clear

---

## 📊 Success Metrics

### Good Performance
- ✅ Sync speed: 2-4 seconds per invoice
- ✅ Success rate: > 95%
- ✅ Error rate: < 5%
- ✅ UI response: < 100ms
- ✅ Component render: < 50ms

### Acceptable Performance
- ⚠️ Sync speed: 4-6 seconds per invoice
- ⚠️ Success rate: 90-95%
- ⚠️ Error rate: 5-10%
- ⚠️ UI response: 100-200ms

### Needs Improvement
- ❌ Sync speed: > 6 seconds per invoice
- ❌ Success rate: < 90%
- ❌ Error rate: > 10%
- ❌ UI response: > 200ms

---

## 🐛 Common Issues & Solutions

### Issue 1: Progress không cập nhật
**Symptom**: Progress bar stuck at 0%
**Solution**: Kiểm tra onProgress callback và state updates

### Issue 2: Metadata undefined
**Symptom**: Completion summary trống
**Solution**: Kiểm tra backend trả về metadata

### Issue 3: Component không hiển thị
**Symptom**: Không thấy progress display
**Solution**: Kiểm tra điều kiện `totalInvoices > 0`

### Issue 4: Errors không hiển thị
**Symptom**: Error list trống nhưng có lỗi
**Solution**: Kiểm tra errors array được populate từ result

### Issue 5: Close button không work
**Symptom**: Click ✕ nhưng component không đóng
**Solution**: Kiểm tra onClose handler và state reset

---

## 📝 Test Report Template

```markdown
## Test Report - [Date]

### Environment
- Backend: Running ✅/❌
- Frontend: Running ✅/❌
- API: Connected ✅/❌

### Test Results
| Test Case | Status | Notes |
|-----------|--------|-------|
| TC1: Basic Sync | ✅ | |
| TC2: Skip Scenario | ✅ | |
| TC3: Large Dataset | ✅ | |
| TC4: Error Handling | ✅ | |
| TC5: Retry Logic | ✅ | |
| TC6: Token Source | ✅ | |
| TC7: UI Interaction | ✅ | |
| TC8: Responsive | ✅ | |

### Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Expected vs Actual

### Performance Metrics
- Average sync time: X seconds per invoice
- Success rate: X%
- Error rate: X%
- UI response time: X ms

### Recommendations
- [Recommendation 1]
- [Recommendation 2]

### Conclusion
✅ Pass / ❌ Fail
```

---

**Tested by**: [Your Name]  
**Date**: [Test Date]  
**Version**: 1.0.0  
**Status**: Ready for Testing
