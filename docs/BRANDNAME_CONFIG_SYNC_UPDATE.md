# Brandname Configuration Sync Update

## 📋 Overview

Updated the invoice synchronization system to support `config.brandname` parameter when syncing invoices from external API to database. This allows users to set a default brandname in the configuration that will be applied to all synced invoices.

## 🎯 Implementation Date
**Date**: January 3, 2025

## 📝 Changes Made

### 1. Frontend Service Layer (`invoiceDatabaseServiceNew.ts`)

#### Updated Function Signature
```typescript
async syncInvoiceData(
  invoiceData: any[],
  detailsData?: any[],
  bearerToken?: string,
  brandname?: string,  // ✅ NEW: Added brandname parameter
  onProgress?: (progress: { processed: number; total: number; current: string }) => void
): Promise<DatabaseSyncResult>
```

#### Updated Request Body
```typescript
const response = await fetch(`${this.baseUrl}/api/invoices/sync`, {
  method: 'POST',
  headers: this.getAuthHeaders(),
  body: JSON.stringify({
    invoiceData,
    detailsData: detailsData || [],
    bearerToken: bearerToken || undefined,
    brandname: brandname || undefined,  // ✅ NEW: Include brandname in request
  }),
});
```

#### Updated Hook (`useInvoiceDatabase`)
```typescript
const syncData:any = async (
  invoiceData: any[], 
  detailsData?: any[], 
  bearerToken?: string,
  brandname?: string,  // ✅ NEW: Added brandname parameter
  onProgress?: (progress: { processed: number; total: number; current: string }) => void
) => {
  // ...
  const result = await invoiceDatabaseService.syncInvoiceData(
    invoiceData, 
    detailsData, 
    bearerToken,
    brandname,  // ✅ NEW: Pass brandname to service
    onProgress
  );
  // ...
}
```

### 2. Frontend Page Component (`page.tsx`)

#### Updated Sync Function
```typescript
// Get bearer token and brandname from config
const bearerToken = currentConfig.bearerToken || undefined;
const brandname = currentConfig.brandname || undefined;  // ✅ NEW: Extract brandname from config

// Sync to database with progress callback
const syncResult = await syncData(
  response.datas, 
  [],
  bearerToken,
  brandname,  // ✅ NEW: Pass brandname to sync function
  (progress: { processed: number; total: number; current: string }) => {
    setSyncProgress(prev => ({
      ...prev,
      processedInvoices: progress.processed,
      currentStep: progress.current,
    }));
  }
);
```

### 3. Backend Controller (`invoice.controller.ts`)

#### Updated Endpoint Signature
```typescript
@Post('sync')
@Roles($Enums.UserRoleType.ADMIN, $Enums.UserRoleType.USER)
async syncInvoices(@Body() body: { 
  invoiceData: any[], 
  detailsData: any[], 
  bearerToken?: string, 
  brandname?: string  // ✅ NEW: Accept brandname parameter
}) {
  // ...
  const { invoiceData, detailsData, bearerToken, brandname } = body;
  // ...
}
```

#### Updated Logging
```typescript
this.logger.log('REST: Starting invoice sync from external API');
this.logger.log(`Total invoices to sync: ${body.invoiceData?.length || 0}`);
if (body.brandname) {
  this.logger.log(`Using brandname filter: ${body.brandname}`);  // ✅ NEW: Log brandname usage
}
```

#### Updated Invoice Mapping
```typescript
const convertedInvoices: CreateInvoiceInput[] = invoiceData.map(invoice => ({
  // ... other fields ...
  brandname: brandname || invoice.brandname,  // ✅ UPDATED: Use config brandname or fall back to API data
  // ...
}));
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ User Interface (page.tsx)                                           │
│                                                                      │
│  1. User clicks "Đồng bộ từ API"                                   │
│  2. Get config: bearerToken + brandname                            │
│  3. Fetch invoices from external API                               │
│  4. Call syncData(invoices, [], bearerToken, brandname, callback) │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Frontend Service (invoiceDatabaseServiceNew.ts)                     │
│                                                                      │
│  5. syncData hook receives: invoices, bearerToken, brandname       │
│  6. Calls invoiceDatabaseService.syncInvoiceData()                 │
│  7. Sends POST /api/invoices/sync with body:                      │
│     {                                                               │
│       invoiceData: [...],                                          │
│       detailsData: [],                                             │
│       bearerToken: "...",                                          │
│       brandname: "..." ← NEW                                       │
│     }                                                               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Backend Controller (invoice.controller.ts)                          │
│                                                                      │
│  8. Receives request body with brandname                           │
│  9. Logs: "Using brandname filter: ..." (if provided)             │
│ 10. Maps each invoice:                                             │
│     {                                                               │
│       ...invoice,                                                   │
│       brandname: brandname || invoice.brandname ← Uses config first │
│     }                                                               │
│ 11. Calls invoiceService.bulkCreateInvoices()                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Database (PostgreSQL)                                               │
│                                                                      │
│ 12. Invoices saved with brandname from config or API              │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 Priority Logic

The system uses the following priority for brandname:

1. **Config Brandname** (Highest Priority): If `config.brandname` is set, it will be used for ALL invoices
2. **API Brandname** (Fallback): If config.brandname is not set, use `invoice.brandname` from the API response

```typescript
brandname: brandname || invoice.brandname
```

This ensures:
- ✅ Users can override brandname globally via config
- ✅ Preserves original API data if no config override
- ✅ Consistent brandname across all synced invoices (when config is set)

## 📊 Usage Examples

### Example 1: Sync with Config Brandname

```typescript
// User sets brandname in config
ConfigService.setBrandname('MY_COMPANY_BRAND');

// User clicks "Đồng bộ từ API"
// All synced invoices will have brandname = 'MY_COMPANY_BRAND'
// Regardless of what the API returns
```

### Example 2: Sync without Config Brandname

```typescript
// User leaves brandname empty in config
ConfigService.setBrandname('');

// User clicks "Đồng bộ từ API"
// Each invoice will preserve its original brandname from the API
// Invoice 1: brandname = 'API_BRAND_A'
// Invoice 2: brandname = 'API_BRAND_B'
```

### Example 3: Mixed Scenario

```typescript
// Config brandname = 'OVERRIDE_BRAND'

// API returns:
// Invoice 1: { ..., brandname: 'ORIGINAL_1' }
// Invoice 2: { ..., brandname: 'ORIGINAL_2' }
// Invoice 3: { ..., brandname: null }

// Database saves:
// Invoice 1: { ..., brandname: 'OVERRIDE_BRAND' } ← Config wins
// Invoice 2: { ..., brandname: 'OVERRIDE_BRAND' } ← Config wins
// Invoice 3: { ..., brandname: 'OVERRIDE_BRAND' } ← Config wins
```

## 🔍 Testing Checklist

### Frontend Testing
- [ ] Open `http://localhost:13000/ketoan/listhoadon`
- [ ] Click Settings → Set brandname to "TEST_BRAND"
- [ ] Click "Đồng bộ từ API"
- [ ] Check browser console for request payload
- [ ] Verify `brandname: "TEST_BRAND"` in request body

### Backend Testing
- [ ] Check backend logs for: `Using brandname filter: TEST_BRAND`
- [ ] Verify invoices saved with correct brandname
- [ ] Query database: `SELECT brandname FROM invoices LIMIT 10;`
- [ ] Confirm all have "TEST_BRAND"

### Edge Cases
- [ ] Empty config brandname → Should preserve API brandname
- [ ] Null API brandname + config brandname → Should use config
- [ ] Both null → Should save as null
- [ ] Special characters in brandname → Should handle properly

## 📁 Files Modified

### Frontend
1. **`frontend/src/services/invoiceDatabaseServiceNew.ts`**
   - Added `brandname?: string` parameter to `syncInvoiceData()` method
   - Added `brandname?: string` parameter to `syncData()` hook
   - Included `brandname` in request body

2. **`frontend/src/app/ketoan/listhoadon/page.tsx`**
   - Extract `brandname` from `currentConfig`
   - Pass `brandname` to `syncData()` function call

### Backend
3. **`backend/src/controllers/invoice.controller.ts`**
   - Added `brandname?: string` to request body type
   - Added brandname logging
   - Updated invoice mapping: `brandname: brandname || invoice.brandname`

## 🎯 Benefits

### 1. Centralized Brandname Management
- Users can set brandname once in config
- No need to modify each invoice individually
- Consistent branding across all invoices

### 2. Flexibility
- Config override available when needed
- Fallback to API data when config is empty
- Supports both scenarios seamlessly

### 3. Backward Compatibility
- Optional parameter (won't break existing code)
- Graceful degradation if not provided
- Preserves original behavior when config is empty

### 4. Better Logging
- Backend logs when brandname config is used
- Easier debugging and monitoring
- Clear audit trail

## 🚀 Deployment Steps

### Development
```bash
# Terminal 1: Backend
cd backend
bun run dev

# Terminal 2: Frontend
cd frontend
bun run dev
```

### Production
```bash
# Build frontend
cd frontend
bun run build

# Build backend
cd backend
bun run build

# Run production
docker-compose up -d
```

## 📈 Performance Impact

- **No performance impact**: Parameter passing is lightweight
- **No additional API calls**: Uses existing sync endpoint
- **No database schema changes**: Uses existing brandname column
- **Minimal code changes**: Only 3 files modified

## 🔒 Security Considerations

- **Input validation**: Brandname should be validated on backend
- **SQL injection**: Prisma ORM prevents SQL injection
- **XSS protection**: Brandname should be sanitized before display
- **Authorization**: Only authorized users can sync invoices (enforced by `@Roles()` decorator)

## 🐛 Troubleshooting

### Issue: Brandname not applied
**Solution**: Check that config.brandname is not empty string

```typescript
// ❌ Wrong
ConfigService.setBrandname('');

// ✅ Correct
ConfigService.setBrandname('MY_BRAND');
```

### Issue: TypeScript errors
**Solution**: Ensure all function signatures are updated

```bash
# Check for errors
cd frontend
bun run type-check

cd ../backend
bun run build
```

### Issue: Backend not receiving brandname
**Solution**: Check request payload in browser DevTools

```javascript
// Network tab → Request payload should show:
{
  "invoiceData": [...],
  "detailsData": [],
  "bearerToken": "...",
  "brandname": "MY_BRAND"  // ← Should be present
}
```

## 📚 Related Documentation

- [BRANDNAME_BUG_FIX.md](./BRANDNAME_BUG_FIX.md) - Previous brandname bug fix
- [INVOICE_SYNC_429_FIXES.md](./INVOICE_SYNC_429_FIXES.md) - Rate limiting fixes
- [FRONTEND_BATCH_SIZE_UPDATE.md](./FRONTEND_BATCH_SIZE_UPDATE.md) - Batch size optimization

## ✅ Completion Summary

### Files Modified: 3
- ✅ `frontend/src/services/invoiceDatabaseServiceNew.ts` (2 functions updated)
- ✅ `frontend/src/app/ketoan/listhoadon/page.tsx` (1 function updated)
- ✅ `backend/src/controllers/invoice.controller.ts` (1 endpoint updated)

### TypeScript Errors: 0
- ✅ All files compile without errors
- ✅ Type safety maintained throughout

### Testing Status: Ready for QA
- ✅ Code complete and error-free
- ✅ Ready for development testing
- ⏳ Awaiting QA validation

### Impact: Low Risk, High Value
- ✅ Backward compatible (optional parameter)
- ✅ No breaking changes
- ✅ Clear user benefit (centralized brandname management)
- ✅ Minimal code footprint

---

**Status**: ✅ **IMPLEMENTATION COMPLETE**  
**Version**: 1.0.0  
**Last Updated**: January 3, 2025
