# ⚡ Zalo ZNS Rate Limiting - Quick Reference

## 🎯 Cấu hình nhanh theo use case

### 🐌 An toàn tối đa (0% lỗi 429)
```javascript
{
    batchSize: 20,
    delayBetweenRequests: 500,
    delayBetweenBatches: 5000,
    concurrentRequests: 1,
    maxRetries: 5
}
```
- ✅ Tốc độ: ~100 tin/10 phút
- ✅ Độ tin cậy: 99.9%
- ❌ Chậm

---

### ⚖️ Cân bằng (Khuyến nghị)
```javascript
{
    batchSize: 50,
    delayBetweenRequests: 250,
    delayBetweenBatches: 2000,
    concurrentRequests: 3,
    maxRetries: 3
}
```
- ✅ Tốc độ: ~500 tin/10 phút
- ✅ Độ tin cậy: 98%
- ✅ Tốt nhất cho production

---

### 🚀 Tốc độ cao (Risk: Medium)
```javascript
{
    batchSize: 100,
    delayBetweenRequests: 150,
    delayBetweenBatches: 1000,
    concurrentRequests: 5,
    maxRetries: 2
}
```
- ✅ Tốc độ: ~1000 tin/10 phút
- ⚠️ Độ tin cậy: 90%
- ⚠️ Có thể gặp 429

---

### ⚡ Tối đa (Risk: High - NOT Recommended)
```javascript
{
    batchSize: 100,
    delayBetweenRequests: 100,
    delayBetweenBatches: 500,
    concurrentRequests: 10,
    maxRetries: 1
}
```
- ✅ Tốc độ: ~1500 tin/10 phút
- ❌ Độ tin cậy: 70%
- ❌ Nhiều lỗi 429

---

## 📊 Bảng tính thời gian

| Số tin | An toàn | Cân bằng | Nhanh | Tối đa |
|--------|---------|----------|-------|--------|
| 100    | 5m      | 2m       | 1m    | 40s    |
| 500    | 25m     | 10m      | 5m    | 3m     |
| 1000   | 50m     | 20m      | 10m   | 7m     |
| 5000   | 4h      | 1.5h     | 50m   | 35m    |

---

## 🔧 Điều chỉnh khi có vấn đề

### ❌ Vẫn gặp lỗi 429?
1. ⬇️ Giảm `concurrentRequests` (3 → 1)
2. ⬆️ Tăng `delayBetweenRequests` (+100ms)
3. ⬇️ Giảm `batchSize` (-20)
4. ⬆️ Tăng `delayBetweenBatches` (+1000ms)
5. ⬆️ Tăng `maxRetries` (+1)

### 🐌 Quá chậm?
1. ⬆️ Tăng `concurrentRequests` (+1)
2. ⬇️ Giảm `delayBetweenRequests` (-50ms)
3. ⬆️ Tăng `batchSize` (+20)
4. ⬇️ Giảm `delayBetweenBatches` (-500ms)

⚠️ **Lưu ý**: Thay đổi từ từ, test sau mỗi thay đổi!

---

## 💡 Error Codes Quick Reference

| Code  | Nghĩa                        | Retry? | Action                        |
|-------|------------------------------|--------|-------------------------------|
| 0     | Success ✅                   | No     | -                             |
| -108  | SĐT không hợp lệ             | No     | Fix số điện thoại             |
| -118  | Account không tồn tại        | No     | Bỏ qua user này              |
| -124  | Token hết hạn                | No     | Lấy token mới                |
| -131  | Template chưa duyệt          | No     | Duyệt template trước         |
| -132  | Template không tồn tại       | No     | Check template ID            |
| -201  | Thiếu tham số                | No     | Check data structure         |
| -216  | Quota hết                    | No     | Nâng cấp gói hoặc đợi reset |
| -217  | Template data sai            | No     | Fix template data            |
| -218  | Thiếu param template         | No     | Thêm param còn thiếu         |
| -429  | Rate limit 🔥                | YES    | Auto retry với backoff       |

---

## 🎯 Decision Tree

```
Số lượng < 100?
├─ YES → Dùng "Cân bằng" config
└─ NO → Số lượng < 1000?
    ├─ YES → Dùng "An toàn" config
    └─ NO → Số lượng < 5000?
        ├─ YES → Dùng "An toàn" + tăng batch size lên 100
        └─ NO → Chia nhiều lần gửi, mỗi lần 1000 tin
```

---

## 🚦 Traffic Light System

### 🟢 GREEN (Safe Zone)
- Success Rate > 95%
- 429 Errors < 5%
- Response Time < 500ms average
**→ Có thể tăng tốc nhẹ**

### 🟡 YELLOW (Warning Zone)
- Success Rate 85-95%
- 429 Errors 5-15%
- Response Time 500-1000ms
**→ Giữ nguyên config**

### 🔴 RED (Danger Zone)
- Success Rate < 85%
- 429 Errors > 15%
- Response Time > 1000ms
**→ Giảm tốc ngay!**

---

## 📱 Excel Format

### Cột bắt buộc:
```
phone          | customer_name    | customer_id
84987654321    | Nguyễn Văn A    | CUST001
84987654322    | Trần Thị B      | CUST002
```

### Validation Rules:
- ✅ `phone`: Bắt đầu bằng "84", 10-12 số
- ✅ `customer_name`: Không rỗng, < 100 ký tự
- ✅ `customer_id`: Không rỗng, unique

---

## ⚡ Performance Tips

1. **Gửi lúc thấp điểm** (2-5 AM)
   - Ít traffic từ users khác
   - API ít load hơn
   - Success rate cao hơn

2. **Validate trước khi gửi**
   - Check phone format
   - Verify access token
   - Test với 1-2 tin trước

3. **Monitor real-time**
   - Xem progress bar
   - Check error rate
   - Adjust config if needed

4. **Backup data**
   - Export results ngay sau khi xong
   - Lưu failed records để gửi lại
   - Keep audit trail

---

## 🔄 Retry Strategy

```
Request Failed (429)
↓
Wait 1 second
↓
Retry #1
↓ (Failed)
Wait 2 seconds (Exponential)
↓
Retry #2
↓ (Failed)
Wait 4 seconds
↓
Retry #3
↓ (Failed)
Mark as FAILED
```

**Exponential Backoff Formula**: `delay = baseDelay × (2 ^ retryCount)`

---

## 📈 Scaling Guide

### < 100 tin/ngày
→ Dùng Single Send (Manual)

### 100-1000 tin/ngày
→ Dùng Bulk Send với "Cân bằng" config

### 1000-5000 tin/ngày
→ Dùng Bulk Send với "An toàn" config
→ Chia thành nhiều batch trong ngày

### > 5000 tin/ngày
→ Cần upgrade:
- Dedicated server
- Multiple access tokens
- Load balancing
- Database queue system

---

## 🛠️ Command Line Quick Start

```bash
# 1. Start server
cd external
node zalo.js

# 2. Open browser
# File: zalo-improved.html

# 3. Upload Excel
# Click "Chọn file Excel"

# 4. Configure (tab Bulk)
# Click "Hiện cấu hình"
# Adjust settings

# 5. Send
# Click "Gửi hàng loạt"

# 6. Export results
# Click "Excel" button
```

---

## 📞 Emergency Actions

### Server crashed?
```bash
# Check if port in use
lsof -i :3999

# Kill process if needed
kill -9 <PID>

# Restart
node zalo.js
```

### Too many 429 errors?
1. **STOP** sending immediately
2. Wait 5 minutes
3. Change to "An toàn" config
4. Resume with smaller batch

### Token expired mid-send?
1. Process will auto-fail remaining
2. Get new token
3. Export failed records
4. Re-send only failed ones

---

**Pro Tip**: Luôn test với 5-10 tin trước khi gửi hàng loạt!

**Remember**: Chậm mà chắc > Nhanh mà lỗi 🎯
