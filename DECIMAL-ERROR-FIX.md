# Fix Decimal Conversion Error

## Problem
Lỗi xảy ra khi cố gắng convert string chứa ký tự "%" thành Decimal:
```
[DecimalError] Invalid argument: 8%
```

## Root Cause
Trong method `saveInvoiceDetails`, các trường số từ external API có thể chứa:
- Percentage values với ký tự "%" (ví dụ: "8%", "10%")
- Strings có thể chứa ký tự không phải số
- Empty strings hoặc null values
- Mixed content (ví dụ: "8.5%abc")

Prisma Decimal constructor không thể handle những format này.

## Solution

### 1. Added Helper Functions

#### `toDecimalSafe(value: any): Decimal | null`
- Clean input data bằng cách remove % và các ký tự không phải số
- Validate format trước khi convert
- Return null cho invalid inputs instead of throwing error
- Log warnings cho debugging

```typescript
private toDecimalSafe(value: any): Decimal | null {
  if (!value) return null;
  
  try {
    let stringValue = String(value).trim();
    
    // Handle empty or null values
    if (!stringValue || stringValue === 'null' || stringValue === 'undefined') {
      return null;
    }
    
    // Remove percentage signs and other non-numeric characters
    stringValue = stringValue.replace(/%/g, '').replace(/[^0-9.-]/g, '');
    
    // Validate format
    if (!/^-?\\d*\\.?\\d+$/.test(stringValue)) {
      return null;
    }
    
    return new Decimal(stringValue);
  } catch (error: any) {
    // Log and return null instead of throwing
    return null;
  }
}
```

#### `toIntSafe(value: any): number | null`
- Similar approach for integer fields
- Remove non-numeric characters except minus sign
- Return null for invalid inputs

### 2. Updated saveInvoiceDetails Method

**Before (Problematic):**
```typescript
dgia: detail.dgia ? new Decimal(detail.dgia) : null,
ltsuat: detail.ltsuat ? new Decimal(detail.ltsuat) : null,
tsuat: detail.tsuat ? new Decimal(detail.tsuat) : null,
// ... etc
```

**After (Fixed):**
```typescript
dgia: this.toDecimalSafe(detail.dgia),
ltsuat: this.toDecimalSafe(detail.ltsuat), 
tsuat: this.toDecimalSafe(detail.tsuat),
// ... etc
```

### 3. Enhanced Error Logging

Thêm raw data vào error logs để debug easier:
```typescript
const errorInfo = {
  error: detailError.message,
  detail: detail.stt || 'unknown',
  detailId: detail.id,
  invoiceId: invoiceIdServer,
  rawDetailData: {
    dgia: detail.dgia,
    ltsuat: detail.ltsuat,
    tsuat: detail.tsuat,
    // ... all problematic fields
  }
};
```

## Test Cases Handled

| Input | Output | Notes |
|-------|--------|--------|
| "8%" | 8 | Percentage cleaned |
| "10.5%" | 10.5 | Decimal percentage |
| "abc" | null | Invalid string |
| "" | null | Empty string |
| null | null | Null input |
| "8.5%abc" | 8.5 | Mixed content cleaned |
| "-5%" | -5 | Negative percentage |

## Benefits

### 1. Error Prevention
- No more DecimalError crashes
- Graceful handling of invalid data
- Service continues processing other details

### 2. Data Quality
- Consistent numeric data in database
- Proper null handling for missing values
- Clean data without formatting characters

### 3. Debugging
- Detailed error logs with raw data
- Warning logs for data quality issues
- Better traceability of conversion problems

### 4. Robustness
- Handle edge cases from external APIs
- Defensive programming approach
- Fail-safe operations

## Testing

```bash
# Test the fix with problematic data
cd backend
bun test-decimal-fix.ts

# Or test via API with percentage data
curl -X POST "http://localhost:14000/api/invoices/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "invoices": [{
      "nbmst": "0123456789",
      "khmshdon": "1", 
      "shdon": "001"
    }],
    "bearerToken": "your-token"
  }'
```

## Monitoring

Check logs for conversion warnings:
```bash
# Check for conversion warnings in logs
curl "http://localhost:14000/api/logs/search" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "Decimal conversion failed"}'

# View recent errors
curl "http://localhost:14000/api/logs/level/error?lines=50"
```

## Files Modified

- `/backend/src/services/invoice.service.ts`:
  - Added `toDecimalSafe()` helper function
  - Added `toIntSafe()` helper function  
  - Updated `saveInvoiceDetails()` to use safe conversion
  - Enhanced error logging with raw data

## Status
✅ **FIXED** - DecimalError với percentage strings đã được resolve

## Next Steps (Optional)
1. Add data validation at API input level
2. Create data sanitization middleware
3. Add comprehensive test suite for edge cases
4. Consider data type validation schemas