# Invoice Pagination Enhancement

## 📋 Overview
Đã cập nhật `fetchInvoices` để xử lý pagination tự động khi `total > 50` records bằng cách sử dụng `state` token từ API response.

## 🚀 New Features

### 1. Automatic Pagination
- Khi API trả về `total > 50`, system sẽ tự động fetch all pages
- Sử dụng `state` token để maintain pagination state
- Combine tất cả data thành một response duy nhất

### 2. Progress Tracking
- Method `fetchInvoicesWithProgress()` với callback để track progress
- Real-time updates cho UI progress bar
- Detailed logging cho debugging

### 3. Enhanced Error Handling
- Graceful degradation khi pagination fails
- Safety limits để prevent infinite loops
- Comprehensive error logging

## 🔧 API Changes

### Updated Interfaces

```typescript
// Updated InvoiceApiResponse
export interface InvoiceApiResponse {
  datas: InvoiceData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  // NEW: Pagination fields
  total?: number;    // Total records available
  state?: string;    // State token for pagination
}

// Updated InvoiceApiParams
export interface InvoiceApiParams {
  sort?: string;
  size?: number;
  page?: number;
  search?: string;
  state?: string;   // NEW: State token for pagination
}
```

### New Methods

```typescript
// Original method - now with auto-pagination
InvoiceApiService.fetchInvoices(filter, params, invoiceType)

// New method with progress callback
InvoiceApiService.fetchInvoicesWithProgress(filter, params, invoiceType, onProgress)
```

## 📚 Usage Examples

### Basic Usage (Auto-pagination)
```typescript
const filter = {
  fromDate: '01/09/2025',
  toDate: '30/09/2025'
};

// Automatically handles pagination when total > 50
const result = await InvoiceApiService.fetchInvoices(filter);
console.log(`Fetched ${result.datas.length} invoices`);
```

### With Progress Tracking
```typescript
const result = await InvoiceApiService.fetchInvoicesWithProgress(
  filter,
  {},
  'banra',
  (current, total, percentage) => {
    console.log(`Progress: ${current}/${total} (${percentage}%)`);
    // Update UI progress bar
    setProgress(percentage);
  }
);
```

### Manual Pagination
```typescript
let allInvoices = [];
let currentState = undefined;

do {
  const response = await InvoiceApiService.fetchInvoices(
    filter,
    { state: currentState }
  );
  
  allInvoices.push(...response.datas);
  currentState = response.state;
} while (currentState);
```

### React Hook
```typescript
function MyComponent() {
  const { loading, progress, invoices, error, fetchInvoices } = useInvoicePagination();
  
  const handleFetch = async () => {
    await fetchInvoices({
      fromDate: '01/09/2025',
      toDate: '30/09/2025'
    }, 'banra');
  };
  
  return (
    <div>
      {loading && (
        <div>
          Loading: {progress.percentage}% ({progress.current}/{progress.total})
        </div>
      )}
      {error && <div>Error: {error}</div>}
      <div>Found {invoices.length} invoices</div>
    </div>
  );
}
```

## 🔍 Data Flow

### Example API Response Structure
```json
{
  "datas": [
    {
      "id": "...",
      "shdon": "0000001",
      "tdlap": "2025-09-27T00:00:00.000Z",
      // ... other invoice fields
    }
  ],
  "totalElements": 50,
  "total": 1807,
  "state": "0051001044416f5277364b6a30774a6b4451564756417a3844577949314f5441774e4449344f544130496977694d534973496b4d794e56524955434973496a59304f44456958513d3d00f07ffffff0f07ffffff0008e4873a2a8ffe7d26198d849d095edfe0042"
}
```

### Pagination Logic
1. **Initial Request**: Call API without state
2. **Check Total**: If `total > 50` and `state` exists, start pagination
3. **Loop**: Use `state` token for subsequent requests
4. **Combine**: Merge all `datas` arrays
5. **Return**: Single response with all data

## 🛡️ Safety Features

### Rate Limiting
- 200ms delay between pagination requests
- Prevents API overwhelming

### Loop Protection
- Maximum 100 pages limit
- Total count validation
- State token validation

### Error Recovery
- Partial data return on pagination failure
- Detailed error logging
- Graceful degradation

## 📊 Performance Considerations

### Memory Usage
- Large datasets (1000+ records) will consume more memory
- Consider implementing virtual scrolling for UI

### Network Usage
- Multiple API calls for large datasets
- Progress tracking helps user experience
- Automatic retry could be added for failed requests

### Caching
- Consider caching state tokens for resume capability
- Local storage for partial results

## 🚨 Migration Notes

### Backward Compatibility
- ✅ Existing code continues to work
- ✅ No breaking changes to API interface
- ✅ Optional features only activate when needed

### New Behavior
- Large datasets (total > 50) now fetch automatically
- Longer loading times for large datasets
- More detailed console logging

### Recommendations
- Use progress callback for better UX
- Implement loading states in UI
- Consider pagination UI for very large datasets
- Monitor API usage and costs

## 🐛 Troubleshooting

### Common Issues
1. **Infinite Loop**: Check state token handling
2. **Memory Issues**: Large datasets may need chunking
3. **API Limits**: Monitor rate limiting responses
4. **Network Timeout**: Increase axios timeout for large fetches

### Debug Information
- Console logs show pagination progress
- State tokens are logged (truncated for security)
- Success rates and timing information provided

### Error Messages
- Clear error messages for different failure scenarios
- Partial data availability information
- Retry suggestions where applicable

## 📈 Future Enhancements

### Potential Improvements
- [ ] Configurable page size
- [ ] Parallel fetching (if API supports)
- [ ] Resume capability from failed state
- [ ] Caching mechanism
- [ ] Virtual scrolling integration
- [ ] Export to Excel for large datasets

### API Suggestions
- Server-side filtering for better performance
- Compressed responses for large datasets
- WebSocket streaming for real-time updates