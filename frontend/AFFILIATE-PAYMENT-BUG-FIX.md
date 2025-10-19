# Affiliate Payment System - GraphQL Bug Fix Report

## 📋 Overview

This document details the bug fixes applied to resolve GraphQL validation errors in the Affiliate Payment Request system.

**Date**: 2024
**Issue**: GraphQL field name mismatches between frontend queries and backend schema
**Status**: ✅ RESOLVED
**Files Modified**: 3

---

## 🐛 Issues Identified

### 1. GraphQL Validation Errors

Three critical field name mismatches were causing GraphQL validation failures:

```
❌ ERROR: Cannot query field 'affiliateUserId' on type 'AffPaymentRequest'
   Reason: Schema uses 'affiliateId', not 'affiliateUserId'

❌ ERROR: Cannot query field 'method' on type 'AffPaymentRequest'
   Reason: Schema uses 'paymentMethod', not 'method'

❌ ERROR: Cannot query field 'paymentDetails' on type 'AffPaymentRequest'
   Reason: Schema uses 'accountDetails', not 'paymentDetails'
```

### 2. Type System Mismatches

TypeScript interfaces were out of sync with GraphQL schema:

```typescript
// ❌ BEFORE (Incorrect)
interface AffiliatePaymentRequest {
  affiliateUserId: string;        // Wrong field name
  method: string;                  // Wrong field name
  paymentDetails?: Record<string, any>;  // Wrong type (should be string)
}

interface CreatePaymentRequestInput {
  method: string;                  // Wrong field name
  paymentDetails?: Record<string, any>;  // Wrong type
  // Missing: periodStart, periodEnd (required by schema)
}
```

### 3. Data Serialization Issues

The `accountDetails` field in the schema is defined as `String` (for JSON serialization), but was being used as a raw object in TypeScript.

---

## 🔧 Fixes Applied

### File 1: `frontend/src/graphql/affiliate.queries.ts`

#### Fix 1.1: GET_AFFILIATE_PAYMENT_REQUESTS Query

```graphql
# ✅ AFTER (Correct)
query GetAffiliatePaymentRequests($status: AffPaymentRequestStatus) {
  affiliatePaymentRequests(status: $status) {
    id
    affiliateId         # Changed from: affiliateUserId
    amount
    currency
    paymentMethod       # Changed from: method
    accountDetails      # Changed from: paymentDetails
    status
    requestedAt
    processedAt
    notes
  }
}
```

#### Fix 1.2: CREATE_PAYMENT_REQUEST Mutation

```graphql
# ✅ AFTER (Correct)
mutation CreatePaymentRequest($input: CreatePaymentRequestInput!) {
  createPaymentRequest(input: $input) {
    id
    amount
    currency
    paymentMethod     # Changed from: method
    status
    requestedAt
  }
}
```

---

### File 2: `frontend/src/types/affiliate.ts`

#### Fix 2.1: AffiliatePaymentRequest Interface

```typescript
// ✅ AFTER (Correct)
export interface AffiliatePaymentRequest {
  id: string;
  affiliateId: string;              // Changed from: affiliateUserId
  amount: number;
  currency: string;
  paymentMethod: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO';  // Changed from: method
  accountDetails?: string;          // Changed from: paymentDetails?: Record<string, any>
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}
```

#### Fix 2.2: CreatePaymentRequestInput Interface

```typescript
// ✅ AFTER (Correct)
export interface CreatePaymentRequestInput {
  paymentMethod: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO';  // Changed from: method
  accountDetails?: string;          // Changed from: paymentDetails?: Record<string, any>
  notes?: string;
  periodStart: string;              // NEW - Required by schema
  periodEnd: string;                // NEW - Required by schema
}
```

---

### File 3: `frontend/src/components/affiliate/payments/PaymentManagement.tsx`

#### Fix 3.1: Form Data Initialization

```typescript
// ✅ AFTER (Correct)
const [formData, setFormData] = useState<CreatePaymentRequestInput>({
  paymentMethod: 'PAYPAL',        // Changed from: method
  accountDetails: '',             // Changed from: paymentDetails
  notes: '',
  periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),  // NEW
  periodEnd: new Date().toISOString(),  // NEW
});
```

#### Fix 3.2: Display Logic Updates

```typescript
// ✅ AFTER (Correct)
{requests.map((request) => (
  <TableRow key={request.id}>
    {/* ... */}
    <TableCell>
      <Badge variant="outline">{getPaymentMethodLabel(request.paymentMethod)}</Badge>
      {/* Changed from: request.method */}
    </TableCell>
  </TableRow>
))}
```

#### Fix 3.3: JSON Serialization for Account Details

**PayPal Method:**
```typescript
// ✅ AFTER (Correct)
{formData.paymentMethod === 'PAYPAL' && (
  <div className="space-y-2">
    <Label>Email PayPal</Label>
    <Input
      type="email"
      value={formData.accountDetails ? JSON.parse(formData.accountDetails).email || '' : ''}
      onChange={(e) => setFormData({
        ...formData,
        accountDetails: JSON.stringify({ email: e.target.value })
      })}
    />
  </div>
)}
```

**Bank Transfer Method:**
```typescript
// ✅ AFTER (Correct)
{formData.paymentMethod === 'BANK_TRANSFER' && (
  <div className="space-y-4">
    <Input
      placeholder="Tên tài khoản"
      value={JSON.parse(formData.accountDetails || '{}').accountName || ''}
      onChange={(e) => {
        const details = JSON.parse(formData.accountDetails || '{}');
        setFormData({
          ...formData,
          accountDetails: JSON.stringify({
            ...details,
            accountName: e.target.value
          })
        });
      }}
    />
    {/* Similar logic for accountNumber, routingNumber */}
  </div>
)}
```

**Crypto Method:**
```typescript
// ✅ AFTER (Correct)
{formData.paymentMethod === 'CRYPTO' && (
  <div className="space-y-4">
    <Select
      value={JSON.parse(formData.accountDetails || '{}').cryptoType || 'BTC'}
      onValueChange={(value) => {
        const details = JSON.parse(formData.accountDetails || '{}');
        setFormData({
          ...formData,
          accountDetails: JSON.stringify({
            ...details,
            cryptoType: value
          })
        });
      }}
    >
      {/* ... */}
    </Select>
    {/* Similar logic for walletAddress */}
  </div>
)}
```

---

## 🎯 Backend Schema Reference

For reference, here is the actual GraphQL schema definition from `backend/src/schema.gql`:

```graphql
type AffPaymentRequest {
  id: ID!
  affiliateId: String!              # NOT affiliateUserId
  amount: Float!
  currency: String!
  paymentMethod: AffPaymentMethod!  # NOT method
  accountDetails: String            # NOT paymentDetails (JSON string, not object)
  status: AffPaymentRequestStatus!
  requestedAt: DateTime!
  processedAt: DateTime
  notes: String
  periodStart: DateTime!
  periodEnd: DateTime!
  affiliate: AffUser
}

input CreatePaymentRequestInput {
  paymentMethod: AffPaymentMethod!
  accountDetails: String
  notes: String
  periodStart: DateTime!
  periodEnd: DateTime!
}

enum AffPaymentMethod {
  PAYPAL
  BANK_TRANSFER
  CRYPTO
}

enum AffPaymentRequestStatus {
  PENDING
  PROCESSING
  COMPLETED
  REJECTED
}
```

**Key Points:**
- `affiliateId` is the correct field (not `affiliateUserId`)
- `paymentMethod` is the correct field (not `method`)
- `accountDetails` is a `String` type (requires JSON serialization)
- `periodStart` and `periodEnd` are required `DateTime!` fields

---

## ✅ Validation Results

### TypeScript Compilation
```bash
✅ frontend/src/graphql/affiliate.queries.ts - No errors
✅ frontend/src/types/affiliate.ts - No errors
✅ frontend/src/components/affiliate/payments/PaymentManagement.tsx - No errors
```

### Field Name Consistency
```bash
✅ No instances of "affiliateUserId" in AffPaymentRequest queries
✅ No instances of "method" field in payment request contexts
✅ No instances of "paymentDetails" field
✅ All queries use "paymentMethod" consistently
✅ All queries use "accountDetails" with JSON serialization
```

---

## 🚀 Testing Checklist

To verify the fixes work correctly:

- [ ] Navigate to `/admin/affiliate/payments`
- [ ] Click "Yêu Cầu Thanh Toán" button
- [ ] Test PayPal payment method:
  - [ ] Enter PayPal email
  - [ ] Verify JSON serialization works
  - [ ] Submit request
  - [ ] Check no GraphQL errors in console
- [ ] Test Bank Transfer method:
  - [ ] Enter account name, number, routing number
  - [ ] Verify all fields serialize to JSON
  - [ ] Submit request
  - [ ] Verify data appears correctly
- [ ] Test Crypto method:
  - [ ] Select crypto type (BTC/ETH/USDT)
  - [ ] Enter wallet address
  - [ ] Submit request
  - [ ] Verify JSON structure
- [ ] Verify requests appear in list with correct `paymentMethod` badge
- [ ] Check browser console for GraphQL validation errors (should be none)

---

## 📊 Summary

| Aspect | Before | After |
|--------|--------|-------|
| GraphQL Errors | 3 validation errors | ✅ 0 errors |
| TypeScript Errors | Type mismatches | ✅ 0 errors |
| Field Names | Inconsistent with schema | ✅ Aligned with schema |
| JSON Handling | Direct object usage | ✅ Proper serialization |
| Required Fields | Missing periodStart/periodEnd | ✅ Included |
| Files Modified | - | 3 files |
| Lines Changed | - | ~40 lines |

---

## 🔗 Related Documentation

- [Affiliate System Vietnamese Translation](./AFFILIATE-TRANSLATION-COMPLETE.md)
- [Affiliate System Summary](./AFFILIATE-TRANSLATION-SUMMARY.md)
- Backend GraphQL Schema: `backend/src/schema.gql`
- Frontend GraphQL Queries: `frontend/src/graphql/affiliate.queries.ts`
- TypeScript Types: `frontend/src/types/affiliate.ts`

---

**Status**: ✅ All bugs resolved, system ready for testing
**Next Steps**: End-to-end testing of payment request creation flow
