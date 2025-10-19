# Affiliate Earnings Report GraphQL Query Fix

**Date**: 2025-10-19  
**Issue**: GraphQL execution error in `GetAffiliateEarningsReport` operation

## 🐛 Problem

The `GetAffiliateEarningsReport` query was attempting to fetch `affiliateEarningsReport` without specifying any subfields, but it's an object type that requires field selections.

**Error Details:**
```
Field "affiliateEarningsReport" of type "AffEarningsReport!" must have a selection of subfields. 
Did you mean "affiliateEarningsReport { ... }"?
```

- Operation: `GetAffiliateEarningsReport`
- Error repeated 4 times (suggesting multiple simultaneous requests)

## 📋 Schema Definition

The `AffEarningsReport` type has 9 required fields that track conversion and earnings statistics:

```graphql
type AffEarningsReport {
  totalConversions: Int!
  totalEarnings: Float!
  pendingConversions: Int!
  pendingEarnings: Float!
  approvedConversions: Int!
  approvedEarnings: Float!
  paidConversions: Int!
  paidEarnings: Float!
  availableForWithdrawal: Float!
}
```

### Field Breakdown

| Field | Type | Description |
|-------|------|-------------|
| `totalConversions` | Int! | All conversions (pending + approved + paid) |
| `totalEarnings` | Float! | Total earnings from all conversions |
| `pendingConversions` | Int! | Conversions awaiting approval |
| `pendingEarnings` | Float! | Earnings from pending conversions |
| `approvedConversions` | Int! | Approved but unpaid conversions |
| `approvedEarnings` | Float! | Earnings from approved conversions |
| `paidConversions` | Int! | Conversions that have been paid |
| `paidEarnings` | Float! | Earnings that have been paid out |
| `availableForWithdrawal` | Float! | Amount ready to be withdrawn (approved earnings) |

## ✅ Solution

Added all required subfield selections to the query to properly retrieve the earnings report data.

## 📝 Changes Made

**File**: `frontend/src/graphql/affiliate.queries.ts`

**Before:**
```typescript
export const GET_AFFILIATE_EARNINGS_REPORT = gql`
  query GetAffiliateEarningsReport($startDate: DateTime, $endDate: DateTime) {
    affiliateEarningsReport(startDate: $startDate, endDate: $endDate)
  }
`;
```

**After:**
```typescript
export const GET_AFFILIATE_EARNINGS_REPORT = gql`
  query GetAffiliateEarningsReport($startDate: DateTime, $endDate: DateTime) {
    affiliateEarningsReport(startDate: $startDate, endDate: $endDate) {
      totalConversions
      totalEarnings
      pendingConversions
      pendingEarnings
      approvedConversions
      approvedEarnings
      paidConversions
      paidEarnings
      availableForWithdrawal
    }
  }
`;
```

## 🎯 Impact

### Fixed Functionality
- ✅ Earnings report now loads correctly with all statistics
- ✅ Dashboard can display conversion counts and earnings breakdowns
- ✅ Withdrawal availability information is now accessible

### Data Now Available
The query now returns complete earnings data including:
- **Total metrics** - Overall conversion count and earnings
- **Pending status** - Conversions and earnings awaiting approval
- **Approved status** - Approved but unpaid amounts
- **Paid status** - Historical paid conversions and earnings
- **Withdrawal ready** - Amount available for immediate withdrawal

## ✨ Verification

The changes:
- ✅ Pass TypeScript compilation
- ✅ Match the GraphQL schema definition exactly
- ✅ Include all 9 required fields from `AffEarningsReport`
- ✅ Support optional date range filtering via `$startDate` and `$endDate`

## 🔍 Usage Example

The query supports date range filtering for custom reporting periods:

```typescript
// Get earnings for last 30 days
const { data } = useQuery(GET_AFFILIATE_EARNINGS_REPORT, {
  variables: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  }
});

// Access the data
const report = data?.affiliateEarningsReport;
console.log(`Total Earnings: $${report.totalEarnings}`);
console.log(`Available: $${report.availableForWithdrawal}`);
console.log(`Pending: ${report.pendingConversions} conversions`);
```

## 💡 Business Logic

The earnings breakdown follows this workflow:

1. **Conversion occurs** → `pendingConversions` ↑, `pendingEarnings` ↑
2. **Admin approves** → `approvedConversions` ↑, `approvedEarnings` ↑, `availableForWithdrawal` ↑
3. **Payment processed** → `paidConversions` ↑, `paidEarnings` ↑, `availableForWithdrawal` ↓

The `totalConversions` and `totalEarnings` always equal the sum of pending + approved + paid amounts.
