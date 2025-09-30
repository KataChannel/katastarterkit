# Auto-Sync Invoice Details Implementation

## 📋 Overview

Đã cập nhật hệ thống sync hóa đơn để **tự động fetch chi tiết hóa đơn** sau khi sync thành công. Hệ thống sẽ tự động gọi API endpoint chi tiết và lưu vào bảng `ext_detailhoadon`.

## 🔄 Changes Made

### 1. InvoiceDatabaseService Updates

#### Enhanced `syncInvoices` Method
```typescript
// Trước đây: includeDetails = false (mặc định)
static async syncInvoices(apiInvoices: InvoiceData[], includeDetails: boolean = false)

// Bây giờ: includeDetails = true (mặc định) 
static async syncInvoices(apiInvoices: InvoiceData[], includeDetails: boolean = true)
```

#### New Methods Added
```typescript
// Tự động fetch chi tiết cho một hóa đơn
static async fetchAndSaveInvoiceDetails(invoiceId: string, apiInvoice: InvoiceData)

// Wrapper methods cho dễ sử dụng
static async syncInvoicesWithDetails(apiInvoices: InvoiceData[])  // Luôn fetch details
static async syncInvoicesOnly(apiInvoices: InvoiceData[])        // Không fetch details
```

### 2. InvoiceSyncService Updates

#### Default Options Changed
```typescript
const {
  includeDetails = true, // Trước đây: false, Bây giờ: true
  batchSize = 10,
  maxRetries = 3,
  skipExisting = true
} = options;
```

#### Interface Documentation
```typescript
export interface SyncOptions {
  includeDetails?: boolean; // Default: true - Automatically fetch details after syncing invoices
  batchSize?: number;       // Default: 10 - Number of invoices to process per batch
  maxRetries?: number;      // Default: 3 - Number of retry attempts for failed operations
  skipExisting?: boolean;   // Default: true - Skip invoices that already exist in database
}
```

### 3. Hooks and Components Updates

#### useSyncInvoices Hook
```typescript
// Cập nhật default value
const syncSpecificInvoices = useCallback(async (
  invoiceIdentifiers: Array<{ nbmst: string; khmshdon: string; shdon: string }>,
  includeDetails: boolean = true // Trước đây: false, Bây giờ: true
) => {
```

## 🎯 How It Works

### Automatic Detail Fetching Flow

1. **Sync Invoice** → Save to `ext_listhoadon` table
2. **Extract Parameters** → Get `nbmst`, `khhdon`, `shdon`, `khmshdon` from invoice
3. **Validate Parameters** → Ensure all required fields exist
4. **Call Detail API** → `https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail`
5. **Save Details** → Store response in `ext_detailhoadon` table
6. **Update Results** → Include detail count in sync results

### API Call Details
```typescript
// Endpoint được gọi tự động
const endpoint = 'https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail';

// Parameters tự động extract từ invoice data
const params = {
  nbmst: invoice.nbmst || invoice.msttcgp,     // Mã số thuế người bán
  khhdon: invoice.khhdon || invoice.khmshdon,  // Ký hiệu hóa đơn
  shdon: invoice.shdon,                        // Số hóa đơn
  khmshdon: invoice.khmshdon                   // Ký hiệu mẫu số hóa đơn
};
```

## 📊 Database Schema

### ext_detailhoadon Table Structure
```sql
- id (UUID, Primary Key)
- idhdon (UUID, Foreign Key to ext_listhoadon.id)
- dgia (DECIMAL) - Đơn giá
- dvtinh (VARCHAR) - Đơn vị tính
- sluong (DECIMAL) - Số lượng
- stt (INT) - Số thứ tự
- ten (VARCHAR) - Tên hàng hóa/dịch vụ
- thtien (DECIMAL) - Thành tiền
- tsuat (DECIMAL) - Thuế suất
- tthue (DECIMAL) - Tiền thuế
- ... (22 fields total)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## 🚀 Usage Examples

### 1. Basic Sync (Automatic Detail Fetching)
```typescript
import InvoiceDatabaseService from '@/services/invoiceDatabaseService';

// Tự động fetch details sau khi sync
const result = await InvoiceDatabaseService.syncInvoices(invoices);
console.log(`Synced ${result.invoicesSaved} invoices and ${result.detailsSaved} details`);
```

### 2. Explicit Detail Fetching
```typescript
// Chắc chắn fetch details
const result = await InvoiceDatabaseService.syncInvoicesWithDetails(invoices);
```

### 3. Skip Detail Fetching
```typescript
// Chỉ sync invoices, không fetch details
const result = await InvoiceDatabaseService.syncInvoicesOnly(invoices);
```

### 4. Using React Hook
```typescript
import useSyncInvoices from '@/hooks/useSyncInvoices';

function MyComponent() {
  const { startSync } = useSyncInvoices();
  
  const handleSync = async () => {
    // Mặc định includeDetails = true
    await startSync(filter, invoiceType);
  };
  
  const handleSyncWithoutDetails = async () => {
    // Tường minh không fetch details
    await startSync(filter, invoiceType, { includeDetails: false });
  };
}
```

## 🔍 Error Handling

System handles các lỗi sau một cách graceful:

- **Missing Parameters**: Nếu không extract được parameters từ invoice
- **API Errors**: Nếu external API trả về lỗi (401, 403, 404, 500)
- **Validation Errors**: Nếu parameters không hợp lệ
- **Database Errors**: Nếu không lưu được vào database
- **Network Errors**: Nếu mất kết nối mạng

## 📈 Expected Results

### Sync Results Structure
```typescript
interface DatabaseSyncResult {
  success: boolean;
  invoicesSaved: number;    // Số hóa đơn đã lưu
  detailsSaved: number;     // Số chi tiết đã lưu (MỚI)
  errors: string[];         // Danh sách lỗi
  message: string;          // Thông báo tổng quan
}
```

### Example Success Result
```typescript
{
  success: true,
  invoicesSaved: 10,
  detailsSaved: 125,        // Tổng số chi tiết từ 10 hóa đơn
  errors: [],
  message: "Successfully synced 10 invoices with 125 details"
}
```

## 🧪 Testing

Chạy test script để kiểm tra chức năng:

```bash
# Test automatic detail fetching
node test-auto-sync-details.js

# Test với backend API
npm run dev  # Chạy backend trước
node test-auto-sync-details.js
```

## 🔄 Backward Compatibility

Tất cả existing code vẫn hoạt động bình thường:
- Components hiện tại sẽ tự động có detail fetching
- Có thể tắt detail fetching bằng cách set `includeDetails: false`
- API interfaces không thay đổi, chỉ default values

## 🎯 Benefits

1. **Automatic**: Không cần gọi thêm API calls riêng biệt
2. **Efficient**: Batch processing với error handling
3. **Flexible**: Có thể enable/disable theo nhu cầu
4. **Consistent**: Unified approach across the application
5. **Maintainable**: Clean separation of concerns

## 📝 Notes

- Detail fetching chạy **sau khi** invoice sync thành công
- Nếu detail fetching thất bại, invoice vẫn được lưu
- Errors được track riêng biệt cho invoice và details
- System tự động retry theo `maxRetries` setting
- Logs chi tiết cho debugging và monitoring