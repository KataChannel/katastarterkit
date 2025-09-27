# Cập Nhật File Logging Cho autoFetchAndSaveDetails

## Tóm Tắt
Đã cập nhật code để method `autoFetchAndSaveDetails` và các methods liên quan lưu logs chi tiết vào file với đầy đủ thông tin theo dõi.

## Các Cập Nhật Thực Hiện

### 1. **Method autoFetchAndSaveDetails**
**Trước**: Logging cơ bản với một số thông tin
**Sau**: Logging chi tiết cho từng bước:

```typescript
// Thêm tracking thời gian
const startTime = Date.now();
const invoiceRef = invoice.shdon || invoice.idServer || 'unknown';

// Log bắt đầu operation
this.fileLogger.logWithData('log', 'Starting auto-fetch and save details', {
  invoiceRef,
  hasToken: !!bearerToken,
  tokenSource: bearerToken ? 'frontend' : 'environment',
  timestamp: new Date().toISOString()
}, 'InvoiceService');

// Log khi extract parameters thất bại
this.fileLogger.logInvoiceError('extract-params', invoiceRef, {
  error: 'Missing required parameters',
  invoice: { nbmst, khhdon, shdon, khmshdon }
});

// Log khi extract parameters thành công
this.fileLogger.logWithData('log', 'Parameters extracted successfully', {
  invoiceRef,
  params: detailParams
}, 'InvoiceService');

// Log khi không tìm thấy details
this.fileLogger.logWithData('warn', 'No details found from external API', {
  invoiceRef,
  params: detailParams,
  duration: Date.now() - startTime
}, 'InvoiceService');

// Log thành công hoàn tất
this.fileLogger.logInvoiceOperation('auto-fetch-details', invoiceRef, {
  detailsSaved: savedCount,
  detailsFetched: details.length,
  tokenSource: bearerToken ? 'frontend' : 'environment',
  duration: totalDuration,
  success: true
});

// Log lỗi chi tiết
this.fileLogger.logInvoiceError('auto-fetch-details', invoiceRef, {
  error: error.message,
  stack: error.stack,
  duration: totalDuration,
  tokenSource: bearerToken ? 'frontend' : 'environment',
  step: 'auto-fetch-and-save'
});
```

### 2. **Method fetchInvoiceDetails**
**Cải thiện**: Thêm timing chính xác và logging chi tiết hơn

```typescript
// Thêm timing tracking
const startTime = Date.now();

// Log cảnh báo khi không có token
this.fileLogger.logWithData('warn', 'No Bearer Token available', {
  tokenSource: bearerToken ? 'frontend' : 'environment',
  params
}, 'InvoiceService');

// Log thời gian response chính xác
const responseTime = Date.now() - startTime;

// Log API call thành công với timing
this.fileLogger.logApiCall('GET', url, response.status, responseTime, 'InvoiceService');

// Log chi tiết kết quả
this.fileLogger.logWithData('log', 'Invoice details fetched successfully', {
  count: response.data.hdhhdvu.length,
  params,
  responseTime,
  status: response.status,
  tokenSource
}, 'InvoiceService');
```

### 3. **Method saveInvoiceDetails**
**Cải thiện**: Tracking chi tiết các lỗi và thống kê lưu trữ

```typescript
// Thêm timing và error tracking
const startTime = Date.now();
const errors = [];

// Log bắt đầu save process
this.fileLogger.logWithData('log', 'Starting to save invoice details', {
  invoiceId: invoiceIdServer,
  detailsCount: details.length,
  timestamp: new Date().toISOString()
}, 'InvoiceService');

// Log từng lỗi detail cụ thể
this.fileLogger.logWithData('error', 'Failed to save detail item', {
  error: detailError.message,
  detail: detail.stt || 'unknown',
  detailId: detail.id,
  invoiceId: invoiceIdServer
}, 'InvoiceService');

// Log kết quả tổng thể với thống kê đầy đủ
const saveResult = {
  saved: savedDetails.length,
  total: details.length,
  errors: errors.length,
  invoiceId: invoiceIdServer,
  duration: Date.now() - startTime,
  success: savedDetails.length > 0
};

// Log khác nhau tùy theo có lỗi hay không
if (errors.length > 0) {
  this.fileLogger.logWithData('warn', 'Invoice details saved with some errors', {
    ...saveResult,
    errorList: errors
  }, 'InvoiceService');
} else {
  this.fileLogger.logWithData('log', 'Invoice details saved successfully', saveResult, 'InvoiceService');
}
```

## Thông Tin Log Được Capture

### 1. **Timing Information**
- Thời gian bắt đầu và kết thúc mỗi operation
- Response time của API calls
- Duration của database operations

### 2. **Context Information**
- Invoice reference (shdon/idServer)
- Token source (frontend vs environment)
- Parameters được sử dụng
- Số lượng details được xử lý

### 3. **Success Metrics**
- Số details được fetch thành công
- Số details được save thành công
- Success rate và error count

### 4. **Error Details**
- Error messages và stack traces
- Specific error context
- Failed parameters và data
- Operation step where error occurred

## Lợi Ích

### 1. **Debugging**
- Có thể trace từng bước của auto-fetch process
- Identify chính xác bước nào bị lỗi
- Timing information để optimize performance

### 2. **Monitoring**
- Track success/failure rates
- Monitor API response times
- Database performance metrics

### 3. **Troubleshooting**
- Chi tiết về token authentication issues
- Parameter validation problems
- Network và SSL certificate issues

### 4. **Analytics**
- Thống kê usage patterns
- Performance trends
- Error frequency analysis

## File Logs Generated

Các log sẽ được lưu vào:
- `logs/all-YYYY-MM-DD.log` - Tất cả logs
- `logs/error-YYYY-MM-DD.log` - Chỉ error logs
- `logs/warn-YYYY-MM-DD.log` - Warning logs
- `logs/log-YYYY-MM-DD.log` - Info logs

## Accessing Logs

1. **Web Interface**: `http://localhost:14000/logs/logs.html`
2. **API Endpoints**: `http://localhost:14000/api/logs/*`
3. **File System**: Direct access to `backend/logs/` directory

## Verification

Để test logging mới:

```bash
# Test autoFetchAndSaveDetails through bulk invoice creation
curl -X POST "http://localhost:14000/api/invoices/bulk" \
  -H "Content-Type: application/json" \
  -d '{"invoices": [{"nbmst": "0123456789", "khmshdon": "1", "shdon": "001"}], "bearerToken": "your-token"}'

# Check logs
curl "http://localhost:14000/api/logs/recent?lines=20"

# View in web interface
open http://localhost:14000/logs/logs.html
```

## Status
✅ **HOÀN THÀNH** - autoFetchAndSaveDetails hiện đã có file logging đầy đủ cho tất cả các operations.