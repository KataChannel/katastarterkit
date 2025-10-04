# Visual Examples - Invoice Sync Progress Display

## Example 1: Small Sync Operation (10 Invoices)

### Console Output
```
[Nest] 214677 - 10/02/2025, 9:30:15 PM     LOG [InvoiceController] REST: Starting invoice sync from external API
[Nest] 214677 - 10/02/2025, 9:30:15 PM     LOG [InvoiceController] Total invoices to sync: 10
[Nest] 214677 - 10/02/2025, 9:30:15 PM     LOG [InvoiceController] Starting bulk invoice creation with detailed progress tracking...

[Nest] 214677 - 10/02/2025, 9:30:15 PM     LOG [InvoiceService] 
================================================================================
BULK INVOICE SYNC OPERATION STARTED
================================================================================
Total Invoices: 10
Include Details: Yes
Skip Existing: Yes
Bearer Token: Provided from frontend

Rate Limiting Configuration:
  - Batch Size: 5 invoices per batch
  - Delay Between Batches: 2000ms
  - Delay Between Detail Calls: 500ms
  - Max Retries: 3
================================================================================

--------------------------------------------------------------------------------
📦 BATCH 1/2 | Progress: 0.0% | Invoices: 1-5/10
--------------------------------------------------------------------------------
  ✅ Created: Invoice 001 (ID: 5900428904_01GTNTKH001)
     📄 Fetched 3 details (token: frontend)
  ✅ Created: Invoice 002 (ID: 5900428904_01GTNTKH002)
     📄 Fetched 2 details (token: frontend)
  ⏭️  Skipped (exists): Invoice 003
  ✅ Created: Invoice 004 (ID: 5900428904_01GTNTKH004)
     📄 Fetched 5 details (token: frontend)
  ✅ Created: Invoice 005 (ID: 5900428904_01GTNTKH005)
     ⚠️  No details found or fetch failed
--------------------------------------------------------------------------------
✓ Batch 1 completed in 8.23s | Success rate: 80.0%
--------------------------------------------------------------------------------
⏳ Waiting 2000ms before next batch...

--------------------------------------------------------------------------------
📦 BATCH 2/2 | Progress: 50.0% | Invoices: 6-10/10
--------------------------------------------------------------------------------
  ✅ Created: Invoice 006 (ID: 5900428904_01GTNTKH006)
     📄 Fetched 4 details (token: frontend)
  ✅ Created: Invoice 007 (ID: 5900428904_01GTNTKH007)
     📄 Fetched 3 details (token: frontend)
  ✅ Created: Invoice 008 (ID: 5900428904_01GTNTKH008)
     📄 Fetched 2 details (token: frontend)
  ✅ Created: Invoice 009 (ID: 5900428904_01GTNTKH009)
     📄 Fetched 6 details (token: frontend)
  ✅ Created: Invoice 010 (ID: 5900428904_01GTNTKH010)
     📄 Fetched 1 details (token: frontend)
--------------------------------------------------------------------------------
✓ Batch 2 completed in 7.89s | Success rate: 90.0%
--------------------------------------------------------------------------------

[Nest] 214677 - 10/02/2025, 9:30:33 PM     LOG [InvoiceController] 
================================================================================
SYNC OPERATION COMPLETED
================================================================================
Total Duration: 0.30 minutes (18.12s)
Invoices Processed: 9/10
Details Fetched: 26
Errors: 0
Success Rate: 90.00%
================================================================================
```

### API Response
```json
{
  "success": true,
  "invoicesSaved": 9,
  "detailsSaved": 26,
  "errors": [],
  "message": "Successfully created 9 invoices",
  "metadata": {
    "totalProcessed": 10,
    "durationMs": 18120,
    "durationMinutes": 0.30,
    "successRate": 90.00,
    "startTime": "2025-10-02T21:30:15.123Z",
    "endTime": "2025-10-02T21:30:33.243Z"
  }
}
```

---

## Example 2: Large Sync with Errors (50 Invoices)

### Console Output (Excerpt)
```
[Nest] 214677 - 10/02/2025, 9:45:00 PM     LOG [InvoiceService] 
================================================================================
BULK INVOICE SYNC OPERATION STARTED
================================================================================
Total Invoices: 50
Include Details: Yes
Skip Existing: Yes
Bearer Token: Using environment variable

Rate Limiting Configuration:
  - Batch Size: 5 invoices per batch
  - Delay Between Batches: 2000ms
  - Delay Between Detail Calls: 500ms
  - Max Retries: 3
================================================================================

--------------------------------------------------------------------------------
📦 BATCH 1/10 | Progress: 0.0% | Invoices: 1-5/50
--------------------------------------------------------------------------------
  ✅ Created: Invoice HD001 (ID: MST_01GTNTKH_HD001)
     📄 Fetched 3 details (token: environment)
  ✅ Created: Invoice HD002 (ID: MST_01GTNTKH_HD002)
     📄 Fetched 2 details (token: environment)
  ⏭️  Skipped (exists): Invoice HD003
  ✅ Created: Invoice HD004 (ID: MST_01GTNTKH_HD004)
     🔄 Retry 1/3 for HD004 (delay: 1000ms)
     📄 Fetched 5 details (token: environment)
  ❌ Failed: Invoice HD005
     Error: Network timeout
--------------------------------------------------------------------------------
✓ Batch 1 completed in 11.45s | Success rate: 60.0%
--------------------------------------------------------------------------------
⏳ Waiting 2000ms before next batch...

--------------------------------------------------------------------------------
📦 BATCH 2/10 | Progress: 10.0% | Invoices: 6-10/50
--------------------------------------------------------------------------------
  ✅ Created: Invoice HD006 (ID: MST_01GTNTKH_HD006)
     📄 Fetched 4 details (token: environment)
  ✅ Created: Invoice HD007 (ID: MST_01GTNTKH_HD007)
     📄 Fetched 3 details (token: environment)
  ✅ Created: Invoice HD008 (ID: MST_01GTNTKH_HD008)
     ⚠️  No details found or fetch failed
  ⏭️  Skipped (exists): Invoice HD009
  ✅ Created: Invoice HD010 (ID: MST_01GTNTKH_HD010)
     📄 Fetched 2 details (token: environment)
--------------------------------------------------------------------------------
✓ Batch 2 completed in 10.23s | Success rate: 70.0%
--------------------------------------------------------------------------------
⏳ Waiting 2000ms before next batch...

... [Batches 3-9 omitted for brevity] ...

--------------------------------------------------------------------------------
📦 BATCH 10/10 | Progress: 90.0% | Invoices: 46-50/50
--------------------------------------------------------------------------------
  ✅ Created: Invoice HD046 (ID: MST_01GTNTKH_HD046)
     📄 Fetched 5 details (token: environment)
  ✅ Created: Invoice HD047 (ID: MST_01GTNTKH_HD047)
     📄 Fetched 3 details (token: environment)
  ✅ Created: Invoice HD048 (ID: MST_01GTNTKH_HD048)
     📄 Fetched 4 details (token: environment)
  ✅ Created: Invoice HD049 (ID: MST_01GTNTKH_HD049)
     📄 Fetched 2 details (token: environment)
  ✅ Created: Invoice HD050 (ID: MST_01GTNTKH_HD050)
     📄 Fetched 6 details (token: environment)
--------------------------------------------------------------------------------
✓ Batch 10 completed in 9.87s | Success rate: 92.0%
--------------------------------------------------------------------------------

[Nest] 214677 - 10/02/2025, 9:47:32 PM     LOG [InvoiceController] 
================================================================================
SYNC OPERATION COMPLETED
================================================================================
Total Duration: 2.53 minutes (151.89s)
Invoices Processed: 46/50
Details Fetched: 187
Errors: 4
Success Rate: 92.00%
================================================================================
```

### API Response
```json
{
  "success": false,
  "invoicesSaved": 46,
  "detailsSaved": 187,
  "errors": [
    "Failed to create invoice HD005: Network timeout",
    "Failed to create invoice HD012: Invalid data format",
    "Failed to create invoice HD023: Connection refused",
    "Failed to create invoice HD037: Rate limit exceeded"
  ],
  "message": "Created 46 invoices with 4 errors",
  "metadata": {
    "totalProcessed": 50,
    "durationMs": 151890,
    "durationMinutes": 2.53,
    "successRate": 92.00,
    "startTime": "2025-10-02T21:45:00.000Z",
    "endTime": "2025-10-02T21:47:31.890Z"
  }
}
```

---

## Example 3: Retry Scenarios

### Network Timeout with Retry
```
  ✅ Created: Invoice HD015 (ID: MST_01GTNTKH_HD015)
     🔄 Retry 1/3 for HD015 (delay: 1000ms)
     Retrying detail fetch for invoice HD015 (attempt 2/4) after 1000ms delay
     📄 Fetched 4 details (token: frontend)
```

### Multiple Retries Before Success
```
  ✅ Created: Invoice HD028 (ID: MST_01GTNTKH_HD028)
     🔄 Retry 1/3 for HD028 (delay: 1000ms)
     Retrying detail fetch for invoice HD028 (attempt 2/4) after 1000ms delay
     🔄 Retry 2/3 for HD028 (delay: 2000ms)
     Retrying detail fetch for invoice HD028 (attempt 3/4) after 2000ms delay
     📄 Fetched 3 details (token: frontend)
```

### Failed After All Retries
```
  ✅ Created: Invoice HD042 (ID: MST_01GTNTKH_HD042)
     🔄 Retry 1/3 for HD042 (delay: 1000ms)
     Retrying detail fetch for invoice HD042 (attempt 2/4) after 1000ms delay
     🔄 Retry 2/3 for HD042 (delay: 2000ms)
     Retrying detail fetch for invoice HD042 (attempt 3/4) after 2000ms delay
     🔄 Retry 3/3 for HD042 (delay: 4000ms)
     Retrying detail fetch for invoice HD042 (attempt 4/4) after 4000ms delay
     ❌ Failed to auto-fetch details for invoice HD042 after 4 attempts
```

---

## Example 4: All Skipped (Already Exist)

### Console Output
```
[Nest] 214677 - 10/02/2025, 10:00:00 PM     LOG [InvoiceService] 
================================================================================
BULK INVOICE SYNC OPERATION STARTED
================================================================================
Total Invoices: 20
Include Details: Yes
Skip Existing: Yes
Bearer Token: Provided from frontend

Rate Limiting Configuration:
  - Batch Size: 5 invoices per batch
  - Delay Between Batches: 2000ms
  - Delay Between Detail Calls: 500ms
  - Max Retries: 3
================================================================================

--------------------------------------------------------------------------------
📦 BATCH 1/4 | Progress: 0.0% | Invoices: 1-5/20
--------------------------------------------------------------------------------
  ⏭️  Skipped (exists): Invoice 001
  ⏭️  Skipped (exists): Invoice 002
  ⏭️  Skipped (exists): Invoice 003
  ⏭️  Skipped (exists): Invoice 004
  ⏭️  Skipped (exists): Invoice 005
--------------------------------------------------------------------------------
✓ Batch 1 completed in 2.34s | Success rate: 0.0%
--------------------------------------------------------------------------------
⏳ Waiting 2000ms before next batch...

... [All subsequent batches show similar skip patterns] ...

[Nest] 214677 - 10/02/2025, 10:00:25 PM     LOG [InvoiceController] 
================================================================================
SYNC OPERATION COMPLETED
================================================================================
Total Duration: 0.42 minutes (25.12s)
Invoices Processed: 0/20
Details Fetched: 0
Errors: 0
Success Rate: 0.00%
================================================================================
```

---

## Example 5: Token Source Comparison

### Using Frontend Token
```
  ✅ Created: Invoice HD101 (ID: MST_01GTNTKH_HD101)
     📄 Fetched 5 details (token: frontend)
```

### Using Environment Token
```
  ✅ Created: Invoice HD102 (ID: MST_01GTNTKH_HD102)
     📄 Fetched 5 details (token: environment)
```

### No Token Available
```
  ✅ Created: Invoice HD103 (ID: MST_01GTNTKH_HD103)
     ⚠️  No Bearer Token available
     ⚠️  Invoice detail fetching will likely fail due to authentication
     ⚠️  No details found or fetch failed
```

---

## Legend

### Status Indicators
| Symbol | Meaning | Color (Terminal) |
|--------|---------|------------------|
| 📦 | Batch Header | Blue |
| ✅ | Success | Green |
| ⏭️ | Skipped | Yellow |
| 📄 | Details Fetched | Cyan |
| ⚠️ | Warning | Yellow |
| 🔄 | Retry | Orange |
| ❌ | Error | Red |
| ⏳ | Waiting | Gray |
| ✓ | Completed | Green |

### Progress Format
```
📦 BATCH [current]/[total] | Progress: [percentage]% | Invoices: [start]-[end]/[total]
```

### Timing Format
```
✓ Batch [number] completed in [seconds]s | Success rate: [percentage]%
```

### Duration Format
```
Total Duration: [minutes] minutes ([seconds]s)
```

---

## Performance Metrics

### Small Operation (10 invoices)
- **Total Time**: ~18 seconds
- **Time per Invoice**: ~1.8 seconds
- **Time per Batch**: ~8 seconds
- **Network Overhead**: ~30%

### Medium Operation (50 invoices)
- **Total Time**: ~152 seconds (2.5 minutes)
- **Time per Invoice**: ~3.0 seconds
- **Time per Batch**: ~15 seconds
- **Network Overhead**: ~40%

### Large Operation (200 invoices)
- **Total Time**: ~720 seconds (12 minutes)
- **Time per Invoice**: ~3.6 seconds
- **Time per Batch**: ~18 seconds
- **Network Overhead**: ~45%

---

**Note**: All examples use Unicode emojis. If your terminal doesn't support them, you'll see alternative characters or symbols instead.
