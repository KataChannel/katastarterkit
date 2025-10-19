# 📊 Chi Tiết Trạng Thái Import Hóa Đơn

## Tổng Quan

Đã cập nhật tính năng import hóa đơn để hiển thị thông tin chi tiết về trạng thái `ext_listhoadon` và `ext_detailhoadon` sau khi import dữ liệu.

## 🎯 Mục Tiêu

Cung cấp thông tin chi tiết và rõ ràng về:
- Số lượng hóa đơn (`ext_listhoadon`) đã tạo thành công
- Số lượng chi tiết hóa đơn (`ext_detailhoadon`) đã tạo
- Các hóa đơn trùng lặp (bị bỏ qua)
- Các lỗi validation
- Danh sách chi tiết từng hóa đơn đã xử lý

## 📋 Cấu Trúc Dữ Liệu Mới

### Backend Interface

```typescript
export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    error: string;
    data?: any;
  }>;
  invoiceIds: string[];
  message: string;
  
  // ✨ MỚI: Chi tiết thống kê
  statistics: {
    totalInvoices: number;        // Tổng số hóa đơn trong file
    totalDetails: number;          // Tổng số chi tiết trong file
    invoicesCreated: number;       // Số hóa đơn đã tạo thành công
    detailsCreated: number;        // Số chi tiết đã tạo thành công
    duplicatesSkipped: number;     // Số hóa đơn trùng lặp (bỏ qua)
    validationErrors: number;      // Số lỗi validation
  };
  
  // ✨ MỚI: Danh sách hóa đơn đã xử lý
  invoicesCreated: Array<{
    id: string;
    shdon: string;                 // Số hóa đơn
    khhdon: string;                // Ký hiệu hóa đơn
    nbten: string;                 // Tên người bán
    nmten: string;                 // Tên người mua
    tgtttbso: number;              // Tổng tiền
    detailsCount: number;          // Số dòng chi tiết
    status: 'created' | 'duplicate' | 'error';
  }>;
}
```

### GraphQL Types

```typescript
@ObjectType()
export class ImportStatistics {
  @Field(() => Int)
  totalInvoices: number;

  @Field(() => Int)
  totalDetails: number;

  @Field(() => Int)
  invoicesCreated: number;

  @Field(() => Int)
  detailsCreated: number;

  @Field(() => Int)
  duplicatesSkipped: number;

  @Field(() => Int)
  validationErrors: number;
}

@ObjectType()
export class InvoiceCreated {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  shdon: string;

  @Field(() => String)
  khhdon: string;

  @Field(() => String)
  nbten: string;

  @Field(() => String)
  nmten: string;

  @Field(() => Float)
  tgtttbso: number;

  @Field(() => Int)
  detailsCount: number;

  @Field(() => String)
  status: string; // 'created' | 'duplicate' | 'error'
}
```

## 🔧 Thay Đổi Backend

### File: `/backend/src/services/invoice-import.service.ts`

#### 1. Khởi tạo statistics khi bắt đầu import

```typescript
const result: ImportResult = {
  success: true,
  totalRows: data.length,
  successCount: 0,
  errorCount: 0,
  errors: [],
  invoiceIds: [],
  message: '',
  statistics: {
    totalInvoices: data.length,
    totalDetails: data.reduce((sum, inv) => sum + (inv.details?.length || 0), 0),
    invoicesCreated: 0,
    detailsCreated: 0,
    duplicatesSkipped: 0,
    validationErrors: 0,
  },
  invoicesCreated: []
};
```

#### 2. Cập nhật statistics khi tạo hóa đơn thành công

```typescript
// Tạo hóa đơn
const invoice = await this.prisma.ext_listhoadon.create({ ... });
result.statistics.invoicesCreated++;

// Tạo chi tiết
let detailsCreated = 0;
if (invoiceData.details && invoiceData.details.length > 0) {
  for (const detail of invoiceData.details) {
    await this.prisma.ext_detailhoadon.create({ ... });
    detailsCreated++;
    result.statistics.detailsCreated++;
  }
}

// Thêm vào danh sách
result.invoicesCreated.push({
  id: invoice.id,
  shdon: invoiceData.shdon || '',
  khhdon: invoiceData.khhdon || '',
  nbten: invoiceData.nbten || '',
  nmten: invoiceData.nmten || '',
  tgtttbso: invoiceData.tgtttbso || 0,
  detailsCount: detailsCreated,
  status: 'created',
});
```

#### 3. Xử lý trường hợp trùng lặp

```typescript
if (existing) {
  result.statistics.duplicatesSkipped++;
  result.invoicesCreated.push({
    id: existing.id,
    shdon: invoiceData.shdon || '',
    khhdon: invoiceData.khhdon || '',
    nbten: invoiceData.nbten || '',
    nmten: invoiceData.nmten || '',
    tgtttbso: invoiceData.tgtttbso || 0,
    detailsCount: 0,
    status: 'duplicate',
  });
  // ...
}
```

#### 4. Xử lý lỗi validation

```typescript
if (!invoiceData.shdon || !invoiceData.khhdon || !invoiceData.khmshdon) {
  result.statistics.validationErrors++;
  throw new Error('Thiếu thông tin bắt buộc...');
}
```

#### 5. Tạo message chi tiết

```typescript
const messages: string[] = [];
messages.push(`✅ ${result.statistics.invoicesCreated} hóa đơn đã tạo thành công`);
if (result.statistics.detailsCreated > 0) {
  messages.push(`📋 ${result.statistics.detailsCreated} chi tiết hóa đơn đã tạo`);
}
if (result.statistics.duplicatesSkipped > 0) {
  messages.push(`⚠️ ${result.statistics.duplicatesSkipped} hóa đơn trùng lặp (bỏ qua)`);
}
if (result.statistics.validationErrors > 0) {
  messages.push(`❌ ${result.statistics.validationErrors} lỗi xác thực dữ liệu`);
}
result.message = messages.join(' | ');
```

## 🎨 Thay Đổi Frontend

### File: `/frontend/src/components/InvoiceImportModal.tsx`

#### 1. Hiển thị statistics chi tiết

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  <div className="bg-white p-3 rounded-md border border-gray-200">
    <div className="text-xs text-gray-500 mb-1">📊 Tổng hóa đơn</div>
    <div className="text-xl font-bold text-gray-900">
      {result.statistics.totalInvoices}
    </div>
  </div>
  
  <div className="bg-white p-3 rounded-md border border-green-200">
    <div className="text-xs text-green-600 mb-1">✅ ext_listhoadon đã tạo</div>
    <div className="text-xl font-bold text-green-700">
      {result.statistics.invoicesCreated}
    </div>
  </div>
  
  <div className="bg-white p-3 rounded-md border border-blue-200">
    <div className="text-xs text-blue-600 mb-1">📋 ext_detailhoadon đã tạo</div>
    <div className="text-xl font-bold text-blue-700">
      {result.statistics.detailsCreated}
    </div>
  </div>
  
  {result.statistics.duplicatesSkipped > 0 && (
    <div className="bg-white p-3 rounded-md border border-yellow-200">
      <div className="text-xs text-yellow-600 mb-1">⚠️ Trùng lặp (bỏ qua)</div>
      <div className="text-xl font-bold text-yellow-700">
        {result.statistics.duplicatesSkipped}
      </div>
    </div>
  )}
</div>
```

#### 2. Bảng danh sách hóa đơn đã xử lý

```tsx
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50 sticky top-0">
    <tr>
      <th>Trạng thái</th>
      <th>Số HĐ</th>
      <th>Ký hiệu</th>
      <th>Người bán</th>
      <th>Người mua</th>
      <th>Tổng tiền</th>
      <th>Chi tiết</th>
    </tr>
  </thead>
  <tbody>
    {result.invoicesCreated.map((invoice, idx) => (
      <tr key={idx} className={`
        ${invoice.status === 'created' ? 'bg-green-50' : ''}
        ${invoice.status === 'duplicate' ? 'bg-yellow-50' : ''}
        ${invoice.status === 'error' ? 'bg-red-50' : ''}
      `}>
        <td>
          {invoice.status === 'created' && (
            <span className="badge badge-success">✅ Đã tạo</span>
          )}
          {invoice.status === 'duplicate' && (
            <span className="badge badge-warning">⚠️ Trùng</span>
          )}
          {invoice.status === 'error' && (
            <span className="badge badge-error">❌ Lỗi</span>
          )}
        </td>
        <td>{invoice.shdon}</td>
        <td>{invoice.khhdon}</td>
        <td>{invoice.nbten}</td>
        <td>{invoice.nmten}</td>
        <td>{invoice.tgtttbso?.toLocaleString('vi-VN')}</td>
        <td>
          {invoice.detailsCount > 0 && (
            <span className="badge">{invoice.detailsCount} dòng</span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## 📊 Ví Dụ Response

```json
{
  "success": true,
  "totalRows": 10,
  "successCount": 8,
  "errorCount": 2,
  "errors": [
    {
      "row": 3,
      "error": "Hóa đơn đã tồn tại: 00001"
    },
    {
      "row": 7,
      "error": "Thiếu thông tin bắt buộc: Số hóa đơn"
    }
  ],
  "invoiceIds": ["uuid-1", "uuid-2", "uuid-3", "uuid-4", "uuid-5", "uuid-6", "uuid-7", "uuid-8"],
  "message": "✅ 8 hóa đơn đã tạo thành công | 📋 24 chi tiết hóa đơn đã tạo | ⚠️ 1 hóa đơn trùng lặp (bỏ qua) | ❌ 1 lỗi xác thực dữ liệu",
  "statistics": {
    "totalInvoices": 10,
    "totalDetails": 30,
    "invoicesCreated": 8,
    "detailsCreated": 24,
    "duplicatesSkipped": 1,
    "validationErrors": 1
  },
  "invoicesCreated": [
    {
      "id": "uuid-1",
      "shdon": "00001",
      "khhdon": "AA/2023",
      "nbten": "Công ty A",
      "nmten": "Công ty B",
      "tgtttbso": 10000000,
      "detailsCount": 3,
      "status": "created"
    },
    {
      "id": "uuid-2",
      "shdon": "00002",
      "khhdon": "AA/2023",
      "nbten": "Công ty A",
      "nmten": "Công ty C",
      "tgtttbso": 5000000,
      "detailsCount": 2,
      "status": "created"
    },
    {
      "id": "existing-uuid",
      "shdon": "00003",
      "khhdon": "AA/2023",
      "nbten": "Công ty A",
      "nmten": "Công ty D",
      "tgtttbso": 8000000,
      "detailsCount": 0,
      "status": "duplicate"
    },
    {
      "id": "",
      "shdon": "",
      "khhdon": "",
      "nbten": "",
      "nmten": "",
      "tgtttbso": 0,
      "detailsCount": 0,
      "status": "error"
    }
  ]
}
```

## 🧪 Testing

### Chạy script test:

```bash
./test-detailed-import-status.sh
```

Script sẽ:
1. ✅ Login và lấy access token
2. 📥 Tải file mẫu Excel
3. 📤 Upload và import file
4. 📊 Hiển thị thống kê chi tiết:
   - Tổng số dòng
   - Số hóa đơn đã tạo
   - Số chi tiết đã tạo
   - Số trùng lặp
   - Số lỗi validation
   - Tỷ lệ thành công
   - Trung bình chi tiết/hóa đơn
5. 📋 Hiển thị danh sách hóa đơn đã xử lý
6. ❌ Hiển thị chi tiết lỗi (nếu có)

### Kết quả mong đợi:

```
╔════════════════════════════════════════════════════╗
║         THỐNG KÊ CHI TIẾT IMPORT                   ║
╠════════════════════════════════════════════════════╣
║ ✅ Trạng thái: THÀNH CÔNG                          ║
╠════════════════════════════════════════════════════╣
║ 📊 Tổng số dòng: 10                                ║
║ ✅ Thành công: 8                                   ║
║ ❌ Lỗi: 2                                          ║
╠════════════════════════════════════════════════════╣
║ 📋 ext_listhoadon (Tổng): 10                      ║
║ ✅ ext_listhoadon (Đã tạo): 8                     ║
║ 📝 ext_detailhoadon (Tổng): 30                    ║
║ ✅ ext_detailhoadon (Đã tạo): 24                  ║
╠════════════════════════════════════════════════════╣
║ ⚠️  Hóa đơn trùng lặp: 1                          ║
║ ❌ Lỗi validation: 1                              ║
╠════════════════════════════════════════════════════╣
║ 📈 Tỷ lệ thành công: 80.00%                       ║
║ 📊 TB chi tiết/hóa đơn: 3.00                      ║
╚════════════════════════════════════════════════════╝
```

## 📝 Files Đã Thay Đổi

### Backend
- ✅ `/backend/src/services/invoice-import.service.ts`
  - Thêm `ImportResult.statistics`
  - Thêm `ImportResult.invoicesCreated`
  - Cập nhật logic đếm và tracking
  - Tạo message chi tiết

- ✅ `/backend/src/graphql/models/invoice.model.ts`
  - Thêm `ImportStatistics` ObjectType
  - Thêm `InvoiceCreated` ObjectType
  - Cập nhật `ImportResult` ObjectType

### Frontend
- ✅ `/frontend/src/components/InvoiceImportModal.tsx`
  - Thêm interfaces mới
  - Hiển thị statistics grid
  - Hiển thị bảng chi tiết hóa đơn
  - Color-coded status badges
  - Tính toán metrics (tỷ lệ, trung bình)

### Scripts
- ✅ `/test-detailed-import-status.sh`
  - Test script tự động
  - Hiển thị thống kê đẹp mắt
  - Kiểm tra tính năng mới

## 🎯 Benefits

1. **Tính minh bạch cao**: User biết chính xác bao nhiêu hóa đơn và chi tiết đã được tạo
2. **Dễ debug**: Có danh sách đầy đủ các hóa đơn với status rõ ràng
3. **Metrics hữu ích**: Tỷ lệ thành công, trung bình chi tiết/hóa đơn
4. **UI/UX tốt hơn**: Color-coded, icons, badges giúp dễ nhận biết
5. **Tracking đầy đủ**: Biết được cả trường hợp duplicate và validation error

## ✅ Checklist

- [x] Backend: Cập nhật ImportResult interface
- [x] Backend: Tracking statistics trong import process
- [x] Backend: Tracking danh sách hóa đơn đã tạo
- [x] Backend: Tạo message chi tiết với emojis
- [x] Backend: Cập nhật GraphQL models
- [x] Frontend: Cập nhật interfaces
- [x] Frontend: Hiển thị statistics grid
- [x] Frontend: Hiển thị bảng chi tiết hóa đơn
- [x] Frontend: Color-coded status
- [x] Testing: Tạo script test tự động
- [x] Documentation: Tạo tài liệu chi tiết

## 🚀 Deployment

Không cần migration database. Chỉ cần:

1. Restart backend service:
   ```bash
   cd backend
   bun dev
   ```

2. Hard refresh frontend (Ctrl + Shift + R)

3. Test import functionality

---

**Ngày cập nhật**: 18/10/2025  
**Version**: 2.0  
**Tác giả**: GitHub Copilot
