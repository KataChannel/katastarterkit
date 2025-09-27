# Hướng dẫn sử dụng Invoice Sync System

## Tổng quan

Hệ thống đồng bộ hóa đơn được cập nhật để lấy dữ liệu từ external server và đồng bộ vào database với các tính năng:

1. **Lấy danh sách hóa đơn từ external API**
2. **Lấy chi tiết hóa đơn tương ứng**
3. **Đồng bộ vào database với batch processing**
4. **Retry logic và error handling**
5. **Progress tracking và statistics**

## Cấu trúc Files

```
frontend/src/services/
├── invoiceDatabaseService.ts     # Service tương tác với database
├── invoiceSyncService.ts         # Service quản lý quá trình sync
└── invoiceDetailApi.ts           # Service lấy chi tiết từ external API

frontend/src/hooks/
└── useSyncInvoices.ts            # React hook để sử dụng trong UI

frontend/src/components/
└── InvoiceSyncComponent.tsx      # UI component để hiển thị sync
```

## Cách sử dụng

### 1. Sử dụng Service trực tiếp

```typescript
import InvoiceSyncService from '@/services/invoiceSyncService';
import { InvoiceFilter } from '@/types/invoice';

// Sync hóa đơn từ external API
const filter: InvoiceFilter = {
  nbmst: '0123456789',
  fromDate: '2024-01-01',
  toDate: '2024-01-31'
};

const result = await InvoiceSyncService.syncFromExternalApi(
  filter,
  'banra', // hoặc 'muavao'
  {
    includeDetails: true,
    batchSize: 10,
    maxRetries: 3,
    skipExisting: true
  }
);

console.log('Sync result:', result);
```

### 2. Sử dụng React Hook

```typescript
import React from 'react';
import { useSyncInvoices } from '@/hooks/useSyncInvoices';

function MyComponent() {
  const {
    isLoading,
    progress,
    result,
    error,
    startSync,
    validateConfiguration
  } = useSyncInvoices();

  const handleSync = async () => {
    const filter = {
      nbmst: '0123456789',
      fromDate: '2024-01-01',
      toDate: '2024-01-31'
    };

    await startSync(filter, 'banra', {
      includeDetails: true,
      batchSize: 10
    });
  };

  return (
    <div>
      <button onClick={handleSync} disabled={isLoading}>
        {isLoading ? 'Đang đồng bộ...' : 'Bắt đầu đồng bộ'}
      </button>
      
      {progress && (
        <div>
          Tiến độ: {progress.processedInvoices}/{progress.totalInvoices}
        </div>
      )}
      
      {result && (
        <div>
          Kết quả: {result.invoicesSaved} hóa đơn, {result.detailsSaved} chi tiết
        </div>
      )}
      
      {error && <div>Lỗi: {error}</div>}
    </div>
  );
}
```

### 3. Sử dụng UI Component

```typescript
import React from 'react';
import InvoiceSyncComponent from '@/components/InvoiceSyncComponent';

function SyncPage() {
  const filter = {
    nbmst: '0123456789',
    fromDate: '2024-01-01',
    toDate: '2024-01-31'
  };

  const handleSyncComplete = (result: any) => {
    console.log('Sync completed:', result);
    // Xử lý khi sync hoàn thành
  };

  return (
    <InvoiceSyncComponent
      filter={filter}
      invoiceType="banra"
      defaultIncludeDetails={true}
      onSyncComplete={handleSyncComplete}
    />
  );
}
```

## Tính năng chính

### 1. Batch Processing
- Xử lý hóa đơn theo batch để tránh overload
- Configurable batch size (default: 10)
- Delay giữa các batch để tránh rate limiting

### 2. Detail Fetching
- Tự động lấy chi tiết hóa đơn từ external API
- Validate parameters trước khi fetch
- Map dữ liệu đúng format database

### 3. Error Handling
- Retry logic với exponential backoff
- Detailed error messages
- Continue processing on individual failures

### 4. Progress Tracking
- Real-time progress updates
- Batch progress tracking
- Statistics về số lượng processed/saved

### 5. Database Integration
- Check duplicate trước khi save
- Atomic transactions cho invoice + details
- Statistics và search functionality

## Cấu hình

Đảm bảo các environment variables được set:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Và cấu hình bearer token trong ConfigService:

```typescript
import ConfigService from '@/services/configService';

// Set bearer token
ConfigService.setBearerToken('your-bearer-token');
```

## API Endpoints sử dụng

### External API:
- `https://hoadondientu.gdt.gov.vn:30000/query/invoices/banra` - Lấy hóa đơn bán ra
- `https://hoadondientu.gdt.gov.vn:30000/query/invoices/muavao` - Lấy hóa đơn mua vào
- `https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail` - Lấy chi tiết hóa đơn

### Internal API:
- `POST /api/invoices` - Tạo hóa đơn mới
- `POST /api/invoices/:id/details` - Tạo chi tiết hóa đơn
- `GET /api/invoices/exists` - Kiểm tra hóa đơn tồn tại
- `GET /api/invoices/stats` - Thống kê database

## Error Cases & Handling

1. **Network errors**: Retry với exponential backoff
2. **Authentication errors**: Clear error message để user update token
3. **Validation errors**: Skip invalid records, continue processing
4. **Database errors**: Rollback transaction, detailed error logging
5. **Rate limiting**: Delay between batches, respectful API usage

## Performance Considerations

- Batch size: 10-50 records per batch (configurable)
- Concurrent limit: 1 sync process at a time
- Memory usage: Process in chunks to avoid memory issues
- API rate limiting: Built-in delays between requests

## Monitoring & Logging

- Console logs cho development
- Progress callbacks cho UI updates
- Error collection cho debugging
- Statistics tracking cho performance monitoring