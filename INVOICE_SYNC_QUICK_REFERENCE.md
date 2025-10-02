# Quick Reference - Invoice Sync Progress Display

## 🚀 Quick Start

### API Endpoint
```
POST http://localhost:14000/api/invoices/sync
```

### Request Format
```json
{
  "invoiceData": [
    {
      "id": "001",
      "nbmst": "5900428904",
      "khmshdon": "01GTNTKH",
      "shdon": "001",
      // ... other invoice fields
    }
  ],
  "detailsData": [],
  "bearerToken": "eyJhbGc..." // Optional: Bearer token for invoice API
}
```

### Response Format
```json
{
  "success": true,
  "invoicesSaved": 142,
  "detailsSaved": 568,
  "errors": [],
  "message": "Successfully created 142 invoices",
  "metadata": {
    "totalProcessed": 150,
    "durationMs": 313450,
    "durationMinutes": 5.23,
    "successRate": 94.67,
    "startTime": "2025-10-02T21:10:00.000Z",
    "endTime": "2025-10-02T21:15:13.450Z"
  }
}
```

---

## 📊 Visual Indicators Quick Reference

| Icon | Meaning | Example |
|------|---------|---------|
| 📦 | Batch Processing | `📦 BATCH 1/10 \| Progress: 0.0%` |
| ✅ | Invoice Created | `✅ Created: Invoice HD001` |
| ⏭️ | Invoice Skipped | `⏭️ Skipped (exists): Invoice HD002` |
| 📄 | Details Fetched | `📄 Fetched 3 details (token: frontend)` |
| ⚠️ | Warning | `⚠️ No details found or fetch failed` |
| 🔄 | Retry Attempt | `🔄 Retry 1/3 for HD004 (delay: 1000ms)` |
| ❌ | Error | `❌ Failed: Invoice HD005` |
| ⏳ | Waiting | `⏳ Waiting 2000ms before next batch...` |
| ✓ | Completed | `✓ Batch 1 completed in 8.23s` |

---

## 🎯 Console Output Structure

### 1. Startup Banner
```
================================================================================
BULK INVOICE SYNC OPERATION STARTED
================================================================================
Total Invoices: 50
Include Details: Yes
Skip Existing: Yes
Bearer Token: Provided from frontend

Rate Limiting Configuration:
  - Batch Size: 5 invoices per batch
  - Delay Between Batches: 2000ms
  - Delay Between Detail Calls: 500ms
  - Max Retries: 3
================================================================================
```

### 2. Batch Processing
```
--------------------------------------------------------------------------------
📦 BATCH 1/10 | Progress: 0.0% | Invoices: 1-5/50
--------------------------------------------------------------------------------
  ✅ Created: Invoice HD001 (ID: MST_01GTNTKH_HD001)
     📄 Fetched 3 details (token: frontend)
  ⏭️ Skipped (exists): Invoice HD002
  ✅ Created: Invoice HD003 (ID: MST_01GTNTKH_HD003)
     📄 Fetched 2 details (token: frontend)
  ...
--------------------------------------------------------------------------------
✓ Batch 1 completed in 8.23s | Success rate: 80.0%
--------------------------------------------------------------------------------
⏳ Waiting 2000ms before next batch...
```

### 3. Completion Summary
```
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

---

## ⚙️ Configuration

### Environment Variables (.env)
```env
# Rate Limiting Configuration
INVOICE_BATCH_SIZE=5                      # Invoices per batch
INVOICE_DELAY_BETWEEN_BATCHES=2000        # Milliseconds between batches
INVOICE_DELAY_BETWEEN_DETAIL_CALLS=500    # Milliseconds between detail calls
INVOICE_MAX_RETRIES=3                     # Maximum retry attempts

# SSL and API Configuration
INVOICE_SSL_VERIFICATION=false            # Bypass SSL certificate verification
INVOICE_API_TIMEOUT=30000                 # API timeout in milliseconds
INVOICE_API_BASE_URL=https://hoadondientu.gdt.gov.vn:30000

# Bearer Token
INVOICE_BEARER_TOKEN=eyJhbGc...           # Default bearer token for invoice API
```

---

## 📝 Common Scenarios

### Scenario 1: All New Invoices
```
📦 BATCH 1/2 | Progress: 0.0% | Invoices: 1-5/10
  ✅ Created: Invoice 001 (ID: 5900428904_01GTNTKH001)
     📄 Fetched 3 details (token: frontend)
  ✅ Created: Invoice 002 (ID: 5900428904_01GTNTKH002)
     📄 Fetched 2 details (token: frontend)
  ✅ Created: Invoice 003 (ID: 5900428904_01GTNTKH003)
     📄 Fetched 5 details (token: frontend)
```

### Scenario 2: Mix of New and Existing
```
📦 BATCH 1/2 | Progress: 0.0% | Invoices: 1-5/10
  ✅ Created: Invoice 001 (ID: 5900428904_01GTNTKH001)
     📄 Fetched 3 details (token: frontend)
  ⏭️ Skipped (exists): Invoice 002
  ✅ Created: Invoice 003 (ID: 5900428904_01GTNTKH003)
     📄 Fetched 2 details (token: frontend)
```

### Scenario 3: Network Issues with Retries
```
📦 BATCH 1/2 | Progress: 0.0% | Invoices: 1-5/10
  ✅ Created: Invoice 001 (ID: 5900428904_01GTNTKH001)
     🔄 Retry 1/3 for 001 (delay: 1000ms)
     Retrying detail fetch for invoice 001 (attempt 2/4) after 1000ms delay
     📄 Fetched 3 details (token: frontend)
```

### Scenario 4: Errors
```
📦 BATCH 1/2 | Progress: 0.0% | Invoices: 1-5/10
  ❌ Failed: Invoice 001
     Error: Network timeout
  ✅ Created: Invoice 002 (ID: 5900428904_01GTNTKH002)
     📄 Fetched 2 details (token: frontend)
```

### Scenario 5: No Details Found
```
📦 BATCH 1/2 | Progress: 0.0% | Invoices: 1-5/10
  ✅ Created: Invoice 001 (ID: 5900428904_01GTNTKH001)
     ⚠️ No details found or fetch failed
```

---

## 🔍 Monitoring Tips

### Watch Logs in Real-Time
```bash
# Terminal 1: Run backend
cd backend && bun dev

# Terminal 2: Watch log files
tail -f backend/logs/invoice-operations.log
```

### Check Progress During Sync
- Look for batch numbers: `📦 BATCH X/Y`
- Monitor progress percentage
- Watch for error indicators `❌`
- Check success rate after each batch

### Analyze Results
- Check `metadata.successRate` in response
- Review `errors` array for failed invoices
- Compare `invoicesSaved` vs `totalProcessed`
- Check `durationMinutes` for performance

---

## 🐛 Troubleshooting

### Problem: No Progress Displayed
**Check**: Terminal supports Unicode emojis
**Solution**: Use a modern terminal (Windows Terminal, iTerm2, etc.)

### Problem: Slow Sync
**Check**: Rate limiting settings in `.env`
**Solution**: Adjust `INVOICE_BATCH_SIZE` and delays

### Problem: Many Retries
**Check**: Network connectivity and external API status
**Solution**: Increase `INVOICE_API_TIMEOUT` or reduce `INVOICE_BATCH_SIZE`

### Problem: High Error Rate
**Check**: Bearer token validity and expiration
**Solution**: Update `INVOICE_BEARER_TOKEN` in `.env`

### Problem: All Invoices Skipped
**Check**: Database already contains these invoices
**Solution**: This is normal if `skipExisting: true` and invoices exist

---

## 📞 Support Resources

### Documentation
- Main Guide: `INVOICE_SYNC_PROGRESS_DISPLAY.md`
- Visual Examples: `INVOICE_SYNC_VISUAL_EXAMPLES.md`
- Implementation Summary: `INVOICE_SYNC_IMPLEMENTATION_SUMMARY.md`

### Logs
- Console output: Real-time in terminal
- File logs: `backend/logs/invoice-operations.log`
- Error logs: Check `errors` array in response

### Testing
```bash
# Test endpoint with curl
curl -X POST http://localhost:14000/api/invoices/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @test-data.json
```

---

## ⏱️ Performance Expectations

| Invoices | Estimated Time | Batch Count (Size=5) |
|----------|----------------|----------------------|
| 10       | ~18 seconds    | 2 batches            |
| 50       | ~2.5 minutes   | 10 batches           |
| 100      | ~5 minutes     | 20 batches           |
| 200      | ~12 minutes    | 40 batches           |

**Note**: Times vary based on:
- Network latency
- External API response time
- Number of details per invoice
- Server load
- Retry count

---

## ✅ Success Indicators

### Good Sync Operation
- ✅ Success rate > 95%
- ✅ Few or no retries
- ✅ Consistent batch timing
- ✅ Most invoices have details fetched

### Needs Investigation
- ⚠️ Success rate < 90%
- ⚠️ Many retries (>3 per invoice)
- ⚠️ Increasing batch times
- ⚠️ Many invoices without details

### Critical Issues
- ❌ Success rate < 80%
- ❌ All retries failing
- ❌ Very slow batch times (>30s per batch)
- ❌ Bearer token errors

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: October 2, 2025  
**Backend Status**: ✅ Running on port 14000
