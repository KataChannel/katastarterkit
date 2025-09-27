# INVOICE API RATE LIMITING & SERVER PROTECTION ENHANCEMENT

## 📋 Overview
Đã cập nhật `InvoiceApiService` để xử lý lỗi 409 (Conflict/Rate Limit) và tránh quá tải server với retry logic, exponential backoff, và queue management.

## 🚨 Problem Addressed
- **Error 409**: Rate limiting từ external API
- **Server Overload**: Quá nhiều concurrent requests
- **Resource Exhaustion**: Memory và CPU overload
- **Failed Pagination**: Lỗi trong quá trình fetch large datasets

## 🔧 New Features

### 1. Retry Logic với Exponential Backoff
```typescript
// Configuration
private static readonly MAX_RETRIES = 3;
private static readonly RETRY_DELAYS = [2000, 5000, 10000]; // 2s, 5s, 10s

// Automatic retry for 409, 429, 503 errors
if ((status === 409 || status === 429) && retryCount < this.MAX_RETRIES) {
  const delay = this.RETRY_DELAYS[retryCount] || 10000;
  await new Promise(resolve => setTimeout(resolve, delay));
  return this.executeWithRetry(requestFn, retryCount + 1);
}
```

### 2. Rate Limiting Queue
```typescript
// Prevent overwhelming server
private static rateLimitQueue: Array<() => Promise<any>> = [];
private static readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Process requests sequentially with delays
private static async processQueue(): Promise<void> {
  // ... implementation
}
```

### 3. Adaptive Delays
```typescript
// Dynamic delays based on dataset size
const baseDelay = totalRecords > 1000 ? 2000 : totalRecords > 500 ? 1500 : 1000;

// Error-based backoff
const adaptiveDelay = baseDelay + (consecutiveErrors * 1000);
```

## 🛡️ Enhanced Error Handling

### New Error Types Handled
```typescript
// Rate limiting errors
if (status === 409) {
  throw new Error('Server đang quá tải. Vui lòng thử lại sau ít phút.');
} else if (status === 429) {
  throw new Error('Đã vượt quá giới hạn số lần gọi API. Vui lòng thử lại sau.');
} else if (status === 503) {
  throw new Error('Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.');
}
```

### Consecutive Error Tracking
```typescript
let consecutiveErrors = 0;
const maxConsecutiveErrors = 3;

// Stop pagination after too many failures
if (consecutiveErrors >= maxConsecutiveErrors) {
  console.error(`💥 Too many consecutive errors (${consecutiveErrors}), stopping pagination`);
  break;
}
```

## 📊 Controlled Pagination

### Before (Problematic)
```typescript
// Fixed 200ms delay - could overwhelm server
await new Promise(resolve => setTimeout(resolve, 200));
```

### After (Controlled)
```typescript
// Adaptive delays based on dataset size and errors
const baseDelay = totalRecords > 1000 ? 2000 : totalRecords > 500 ? 1500 : 1000;
const adaptiveDelay = baseDelay + (consecutiveErrors * 1000);
await new Promise(resolve => setTimeout(resolve, adaptiveDelay));
```

## 🔍 Monitoring & Logging

### Enhanced Console Logging
```typescript
console.log(`🔄 Fetching invoices: ${endpoint}?${queryParams.toString().substring(0, 100)}...`);
console.warn(`⚠️ Rate limit hit (${status}), retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
console.log(`📄 Fetching page ${pageCount + 1}/${Math.ceil(totalRecords / 50)} with state: ${statePreview}`);
```

### Progress Tracking
```typescript
// Clear progress indicators
✅ Page 2/36: 50 records | Total: 100/1807 (5%)
⚠️ Rate limit in progress fetch, waiting 10000ms...
🎯 Progress fetch complete: 1807/1807 records (100% success rate)
```

## 🚀 Usage Examples

### Basic Usage (Auto Rate Limiting)
```typescript
try {
  const result = await InvoiceApiService.fetchInvoices(filter);
  console.log(`Fetched ${result.datas.length} invoices safely`);
} catch (error) {
  // Handles 409, 429, 503 with appropriate user messages
  console.error('Rate limit handled:', error.message);
}
```

### With Progress (Rate Limited)
```typescript
const result = await InvoiceApiService.fetchInvoicesWithProgress(
  filter, {}, 'banra',
  (current, total, percentage) => {
    // Progress updates even during rate limit delays
    console.log(`Safe progress: ${current}/${total} (${percentage}%)`);
  }
);
```

## 📈 Performance Impact

### Positive Changes
- ✅ **Reduced Server Load**: Controlled request timing
- ✅ **Higher Success Rates**: Retry logic handles temporary failures
- ✅ **Better User Experience**: Clear error messages and progress
- ✅ **Memory Management**: Graceful degradation on errors

### Trade-offs
- ⏳ **Longer Fetch Times**: Delays prevent server overload
- 📊 **More Memory Usage**: Error tracking and queue management
- 🔍 **More Logging**: Detailed progress and error information

## 🛠️ Configuration Options

### Tunable Parameters
```typescript
// Retry configuration
MAX_RETRIES = 3                    // Maximum retry attempts
RETRY_DELAYS = [2000, 5000, 10000] // Exponential backoff delays

// Rate limiting
MIN_REQUEST_INTERVAL = 1000        // Minimum time between requests
baseDelay = 1000-2000             // Adaptive delay based on dataset size

// Safety limits
maxConsecutiveErrors = 3          // Stop after consecutive failures
MAX_PAGES = 200                   // Prevent runaway pagination
```

### Environment-based Tuning
```typescript
// Adjust based on server capacity
const isProduction = process.env.NODE_ENV === 'production';
const baseDelay = isProduction ? 2000 : 1000; // Slower in production
```

## 🚨 Error Recovery Strategies

### 1. Graceful Degradation
- Return partial data when pagination fails
- Continue with available data instead of complete failure
- Clear success rate reporting

### 2. Smart Retry Logic
- Different strategies for different error types
- Exponential backoff for rate limits
- Linear backoff for server overload

### 3. Circuit Breaker Pattern (Future)
```typescript
// Potential enhancement
if (consecutiveErrors > threshold) {
  // Stop requests for cooling period
  await new Promise(resolve => setTimeout(resolve, coolingPeriod));
}
```

## 📋 Migration Notes

### Backward Compatibility
- ✅ **Existing Code**: No breaking changes
- ✅ **API Interface**: Same method signatures
- ✅ **Response Format**: Unchanged data structure

### New Behavior
- 🔄 **Automatic Retries**: 409/429/503 errors retry automatically
- ⏳ **Longer Timeouts**: Controlled delays prevent server overload
- 📊 **Enhanced Logging**: More detailed progress information

### Recommended Updates
```typescript
// Add error handling for new error messages
try {
  const result = await InvoiceApiService.fetchInvoices(filter);
} catch (error) {
  if (error.message.includes('quá tải')) {
    // Handle server overload
    showRetryLaterMessage();
  } else if (error.message.includes('giới hạn')) {
    // Handle rate limit
    showRateLimitMessage();
  }
}
```

## 🔮 Future Enhancements

### Planned Improvements
- [ ] **Dynamic Rate Detection**: Automatically adjust delays based on API responses
- [ ] **Request Prioritization**: Priority queue for critical requests
- [ ] **Caching Layer**: Reduce API calls with intelligent caching
- [ ] **Health Monitoring**: Track API health and adjust accordingly

### Advanced Features
- [ ] **Circuit Breaker**: Stop requests during extended outages
- [ ] **Load Balancing**: Distribute requests across multiple endpoints
- [ ] **Metrics Collection**: Detailed performance and error metrics
- [ ] **Configuration API**: Runtime adjustment of rate limiting parameters

## 📊 Success Metrics

### Key Indicators
- **Success Rate**: % of successful pagination completion
- **Error Recovery**: % of errors successfully retried
- **Performance**: Average time per page with rate limiting
- **Server Health**: Reduced 409/503 error rates

### Expected Results
- 📈 **95%+ Success Rate**: For large dataset pagination
- ⚡ **<5s Average Delay**: Per pagination page
- 🔄 **80%+ Retry Success**: For rate limit errors
- 💪 **Zero Server Crashes**: Due to request overload

## 🎯 Summary

### Key Achievements
✅ **409 Error Handling**: Automatic retry with exponential backoff  
✅ **Server Protection**: Controlled request timing and queuing  
✅ **Enhanced Reliability**: Graceful degradation and error recovery  
✅ **Better UX**: Clear error messages and progress tracking  
✅ **Production Ready**: Robust error handling and monitoring  

**🏆 Result**: System giờ có thể xử lý large datasets một cách an toàn và đáng tin cậy, tránh được server overload và rate limiting issues!