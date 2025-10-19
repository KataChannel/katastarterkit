# 🎯 Task 2 Complete: Conversion Tracking Integration

**Status**: ✅ **DONE**  
**Time**: 3 hours  
**Next**: Task 3 - Join Campaign Flow

---

## 📦 What Was Built

### New Files (3)
1. `/backend/src/services/affiliate-conversion.service.ts` (440 lines) - Complete conversion tracking service
2. `/backend/src/utils/affiliate-helper.ts` (323 lines) - Easy-to-use helper functions
3. `/test-conversion-tracking.sh` - Comprehensive test script

### Modified Files (2)
1. `/backend/src/graphql/resolvers/affiliate.resolver.ts` - Added AffiliateConversionResolver
2. `/backend/src/graphql/graphql.module.ts` - Registered new service and resolver

---

## 🚀 How It Works

### Complete Conversion Flow

```
1. Customer clicks affiliate link
   → Cookie set: aff_ref=TRACKING_CODE (30 days)
   
2. Customer browses website
   → Cookie persists across pages
   
3. Customer completes purchase
   → Your code calls trackAffiliateConversion()
   
4. System automatically:
   → Finds affiliate link by tracking code
   → Validates link and campaign active
   → Checks for duplicate conversions
   → Calculates commission
   → Records conversion (status: PENDING)
   → Updates stats (link, campaign, affiliate)
   
5. Merchant reviews conversion
   → Approves: Commission goes to affiliate
   → Rejects: Stats reverted, no commission
   
6. Affiliate sees earnings
   → Can request payout when minimum reached
```

---

## 💻 Implementation Guide

### Option 1: Integration in Service Layer

```typescript
// In your invoice/order service
import { trackAffiliateConversion } from '../utils/affiliate-helper';

async function completeInvoice(invoiceId: string, req: Request) {
  // 1. Complete your invoice logic
  const invoice = await this.prisma.ext_listhoadon.update({
    where: { id: invoiceId },
    data: { status: 'COMPLETED' }
  });

  // 2. Track affiliate conversion
  const result = await trackAffiliateConversion({
    orderId: invoice.id,
    saleAmount: invoice.tgtttbso, // Total amount
    request: req,
    customerEmail: invoice.nmten, // Customer name/email
    conversionType: 'sale',
    currency: 'VND',
  });

  if (result.success) {
    console.log(`✅ Affiliate conversion tracked`);
    console.log(`Commission: ${result.commission} VND`);
  }

  return invoice;
}
```

### Option 2: Integration in GraphQL Resolver

```typescript
import { trackAffiliateConversionFromContext } from '../utils/affiliate-helper';

@Mutation(() => Invoice)
@UseGuards(JwtAuthGuard)
async completeInvoice(
  @Args('id') id: string,
  @Context() context: any
): Promise<Invoice> {
  // Complete invoice
  const invoice = await this.invoiceService.complete(id);

  // Track conversion
  await trackAffiliateConversionFromContext({
    orderId: invoice.id,
    saleAmount: invoice.total,
    context,
    customerEmail: invoice.customerEmail,
  });

  return invoice;
}
```

### Option 3: Manual Tracking (with tracking code)

```typescript
import { trackAffiliateConversionManual } from '../utils/affiliate-helper';

// When you have the tracking code but no request object
const result = await trackAffiliateConversionManual({
  affiliateRef: 'abc123def456',
  orderId: 'ORDER-12345',
  saleAmount: 1000000, // 1,000,000 VND
  customerEmail: 'customer@example.com',
  conversionType: 'sale',
  currency: 'VND',
});

if (result.success) {
  console.log(`Commission: ${result.commission} VND`);
}
```

---

## 🎮 GraphQL Mutations

### Approve Conversion
```graphql
mutation {
  approveConversion(id: "conversion-uuid")
}
```

### Reject Conversion
```graphql
mutation {
  rejectConversion(
    id: "conversion-uuid"
    reason: "Order was cancelled by customer"
  )
}
```

### Query Conversions
```graphql
query {
  affiliateConversions(search: {
    status: PENDING
    pagination: {
      page: 1
      size: 20
      sortBy: "convertedAt"
      sortOrder: "desc"
    }
  }) {
    conversions {
      id
      orderId
      saleAmount
      commission
      status
      convertedAt
      customerEmail
      link {
        trackingCode
      }
      campaign {
        name
      }
      affiliate {
        user {
          email
        }
      }
    }
    total
  }
}
```

---

## 🧪 Testing

### Test Script Usage
```bash
# Basic test (displays integration examples)
./test-conversion-tracking.sh

# Live test with tracking code
./test-conversion-tracking.sh abc123def456

# Full test with custom values
./test-conversion-tracking.sh abc123def456 ORDER-001 1000000
```

### Manual Testing Steps

#### 1. Setup Test Campaign
```bash
# Create campaign, approve affiliate, generate link
# Get tracking code (e.g., "abc123def456")
```

#### 2. Test Click Tracking
```bash
curl -c cookies.txt -L http://localhost:14000/track/click/abc123def456
# Cookie should be set: aff_ref=abc123def456
```

#### 3. Verify Click Recorded
```sql
SELECT * FROM "AffClick" 
WHERE "linkId" IN (
  SELECT id FROM "AffLink" 
  WHERE "trackingCode" = 'abc123def456'
)
ORDER BY "clickedAt" DESC;
```

#### 4. Simulate Purchase (Example Integration)
```typescript
// In your order completion code
import { trackAffiliateConversion } from './utils/affiliate-helper';

const result = await trackAffiliateConversion({
  orderId: 'ORDER-001',
  saleAmount: 1000000,
  request: req, // Express request object with cookies
  customerEmail: 'customer@example.com',
});
```

#### 5. Verify Conversion Recorded
```sql
SELECT * FROM "AffConversion" 
WHERE "orderId" = 'ORDER-001';

-- Should show:
-- status: PENDING
-- commission: calculated based on campaign
-- saleAmount: 1000000
```

#### 6. Check Stats Updated
```sql
-- Link stats
SELECT "totalClicks", "totalConversions", "totalEarnings"
FROM "AffLink"
WHERE "trackingCode" = 'abc123def456';

-- Campaign stats
SELECT "totalConversions", "totalRevenue", "totalCommission"
FROM "AffCampaign"
WHERE id = (SELECT "campaignId" FROM "AffLink" WHERE "trackingCode" = 'abc123def456');
```

#### 7. Test Approval
```graphql
mutation {
  approveConversion(id: "conversion-uuid-from-step-5")
}
```

Verify status changed:
```sql
SELECT id, status, "approvedAt", "validatedBy"
FROM "AffConversion"
WHERE id = 'conversion-uuid';
-- status should now be: APPROVED
```

#### 8. Test Rejection
```graphql
mutation {
  rejectConversion(
    id: "conversion-uuid"
    reason: "Test rejection"
  )
}
```

Verify stats reverted:
```sql
-- Check stats decreased back
SELECT "totalConversions", "totalRevenue", "totalCommission"
FROM "AffCampaign"
WHERE id = 'campaign-id';
```

---

## 📊 Commission Calculation

### Percentage Commission
```typescript
Campaign: {
  commissionType: 'percentage',
  commissionRate: 10 // 10%
}

Sale: 1,000,000 VND
Commission: 1,000,000 × 0.10 = 100,000 VND
```

### Fixed Commission
```typescript
Campaign: {
  commissionType: 'fixed',
  fixedAmount: 50000 // 50,000 VND
}

Sale: 1,000,000 VND (any amount)
Commission: 50,000 VND (fixed)
```

---

## 🔍 Service Features

### AffiliateConversionService

#### Methods

1. **`trackConversion(data)`** - Main conversion tracking
   - Finds link by tracking code
   - Validates link and campaign
   - Checks duplicates
   - Calculates commission
   - Records conversion
   - Updates stats

2. **`trackConversionFromRequest(orderId, amount, request, options)`**
   - Extracts cookie from request
   - Calls trackConversion()

3. **`approveConversion(conversionId, userId)`**
   - Changes status to APPROVED
   - Records approver and timestamp

4. **`rejectConversion(conversionId, userId, reason)`**
   - Changes status to REJECTED
   - Reverts all stats
   - Records reason

5. **`getConversionStats(campaignId)`**
   - Returns aggregated stats
   - Total, pending, approved, rejected
   - Approval rate
   - Total revenue and commission

6. **`getRecentConversions(limit)`**
   - Returns recent conversions with relations

---

## 📈 Database Operations

### On Conversion Tracking
```sql
-- 1. Insert conversion
INSERT INTO "AffConversion" (...) VALUES (...);

-- 2. Update link stats
UPDATE "AffLink" 
SET "totalConversions" = "totalConversions" + 1,
    "totalEarnings" = "totalEarnings" + commission
WHERE id = 'link-id';

-- 3. Update campaign stats
UPDATE "AffCampaign"
SET "totalConversions" = "totalConversions" + 1,
    "totalRevenue" = "totalRevenue" + saleAmount,
    "totalCommission" = "totalCommission" + commission
WHERE id = 'campaign-id';

-- 4. Update affiliate join stats
UPDATE "AffCampaignAffiliate"
SET "totalConversions" = "totalConversions" + 1,
    "totalEarnings" = "totalEarnings" + commission
WHERE "campaignId" = 'campaign-id' AND "affiliateId" = 'affiliate-id';
```

### On Rejection
```sql
-- All stats decremented (reverse of tracking)
UPDATE "AffLink" 
SET "totalConversions" = "totalConversions" - 1,
    "totalEarnings" = "totalEarnings" - commission
WHERE id = 'link-id';

-- Similar for campaign and affiliate stats
```

---

## ✅ Validation & Security

### Duplicate Prevention
- Checks for existing conversion with same `orderId` + `linkId`
- Prevents double-tracking

### Link Validation
- Link must be active (`isActive = true`)
- Campaign must be active (`status = 'ACTIVE'`)
- Link not expired (`expiresAt > now` or null)

### Cookie Duration
- Default: 30 days
- Configurable per campaign
- Tracks click within attribution window

### Fraud Detection (Basic)
- Duplicate order checking
- Recent click validation (30-day window)
- Manual merchant approval required

---

## 🎯 Integration Examples

### Example 1: Invoice Service
```typescript
// backend/src/services/invoice.service.ts
import { trackAffiliateConversion } from '../utils/affiliate-helper';

async confirmInvoice(invoiceId: string, req: Request) {
  const invoice = await this.prisma.ext_listhoadon.findUnique({
    where: { id: invoiceId }
  });

  // Update invoice status
  await this.prisma.ext_listhoadon.update({
    where: { id: invoiceId },
    data: { tthai: 4 } // Status: completed
  });

  // Track conversion
  await trackAffiliateConversion({
    orderId: invoice.idhoadon || invoiceId,
    saleAmount: invoice.tgtttbso || 0,
    request: req,
    customerEmail: invoice.nmten,
    conversionType: 'invoice_payment',
  });

  return invoice;
}
```

### Example 2: GraphQL Mutation
```typescript
// backend/src/graphql/resolvers/invoice.resolver.ts
import { trackAffiliateConversionFromContext } from '../../utils/affiliate-helper';

@Mutation(() => ExtListhoadon)
@UseGuards(JwtAuthGuard)
async confirmInvoice(
  @Args('id') id: string,
  @Context() context: any
): Promise<ExtListhoadon> {
  const invoice = await this.invoiceService.confirm(id);

  // Track conversion
  await trackAffiliateConversionFromContext({
    orderId: invoice.idhoadon,
    saleAmount: invoice.tgtttbso,
    context,
    customerEmail: invoice.nmten,
  });

  return invoice;
}
```

### Example 3: REST Controller
```typescript
// backend/src/controllers/checkout.controller.ts
import { trackAffiliateConversion } from '../utils/affiliate-helper';

@Post('complete')
async completeCheckout(@Body() body: any, @Req() req: Request) {
  const order = await this.orderService.complete(body.orderId);

  // Track conversion
  const result = await trackAffiliateConversion({
    orderId: order.id,
    saleAmount: order.total,
    request: req,
    customerEmail: order.email,
  });

  if (result.success) {
    console.log(`Affiliate commission: ${result.commission}`);
  }

  return order;
}
```

---

## 🐛 Troubleshooting

### Issue: Conversion Not Tracked
**Possible Causes:**
1. No affiliate cookie in request
2. Cookie expired (>30 days old)
3. Link inactive or campaign not active
4. Duplicate order ID

**Debug:**
```typescript
// Check cookie
console.log('Cookies:', req.cookies);
console.log('aff_ref:', req.cookies?.['aff_ref']);

// Check link status
SELECT * FROM "AffLink" WHERE "trackingCode" = 'your-code';

// Check existing conversions
SELECT * FROM "AffConversion" WHERE "orderId" = 'your-order-id';
```

### Issue: Commission Calculated Wrong
**Check:**
```sql
-- Campaign commission settings
SELECT "commissionType", "commissionRate", "fixedAmount"
FROM "AffCampaign"
WHERE id = 'campaign-id';
```

**Formula:**
- Percentage: `saleAmount × (rate / 100)`
- Fixed: `fixedAmount` (regardless of sale)

### Issue: Stats Not Updated
**Verify:**
```sql
-- Check if conversion was created
SELECT * FROM "AffConversion" 
WHERE "orderId" = 'order-id';

-- If exists but stats not updated, check:
SELECT * FROM "AffLink" WHERE id = 'link-id';
SELECT * FROM "AffCampaign" WHERE id = 'campaign-id';
```

---

## 📝 Next Steps

### ✅ Completed (Tasks 1-2)
- [x] Click tracking endpoint
- [x] Cookie setting
- [x] Conversion tracking service
- [x] Helper utilities
- [x] Approve/reject mutations
- [x] Test scripts
- [x] Documentation

### 🔄 Next (Task 3): Join Campaign Flow
- [ ] Expose `joinCampaign` mutation
- [ ] Add `reviewApplication` mutation
- [ ] Update/delete campaign mutations
- [ ] Frontend: JoinCampaignModal
- [ ] Frontend: ApplicationReviewPanel

### ⏳ Upcoming (Tasks 4-6)
- [ ] Join campaign UI components
- [ ] Application management
- [ ] E2E testing

---

## 🎯 Success Metrics

**Week 1 Progress**: 40% complete (4/10 days)

Critical Blockers Status:
- ✅ Click tracking - **DONE**
- ✅ Conversion integration - **DONE**
- 🔴 Join campaign flow - **NEXT**
- 🔴 Payment gateway - Week 7-8

---

**Implementation**: ✅ Complete  
**Testing**: ✅ Script created  
**Documentation**: ✅ Done  
**Integration**: ✅ 3 options provided  
**Blocker Status**: 🟢 **2/4 RESOLVED** (50%)

Ready for production integration! 🚀
