# Affiliate Links GraphQL Query Fix

**Date**: 2025-10-19  
**Issue**: GraphQL execution errors in `GetAffiliateLinks` operation

## 🐛 Problem

The GraphQL query was attempting to fetch `clicks` and `conversions` fields as scalar values, but these are actually object types that require subfield selections:

```
Field "clicks" of type "[AffClick!]" must have a selection of subfields. Did you mean "clicks { ... }"?
Field "conversions" of type "[AffConversion!]" must have a selection of subfields. Did you mean "conversions { ... }"?
```

**Error Details:**
- Operation: `GetAffiliateLinks`
- UserId: `9ae9e59b-177c-41a8-b047-c197a343e8c3`
- Timestamp: `2025-10-19 14:00:06.656`

## ✅ Solution

Replaced the object field queries with their scalar count equivalents:
- `clicks` → `totalClicks` (Int!)
- `conversions` → `totalConversions` (Int!)

These fields provide the count of clicks and conversions without requiring complex nested object selections, which is appropriate for list views and summary displays.

## 📝 Changes Made

### 1. Frontend Query (`frontend/src/graphql/affiliate.queries.ts`)

**Before:**
```graphql
query GetAffiliateLinks($search: AffLinkSearchInput) {
  affiliateLinks(search: $search) {
    # ... other fields
    clicks
    conversions
    revenue
    commission
    # ... more fields
  }
}
```

**After:**
```graphql
query GetAffiliateLinks($search: AffLinkSearchInput) {
  affiliateLinks(search: $search) {
    # ... other fields
    totalClicks
    totalConversions
    revenue
    commission
    # ... more fields
  }
}
```

### 2. Backend Test Query (`backend/tests/affiliate/e2e-test.js`)

Applied the same fix to maintain consistency across test cases.

## 📊 Schema Reference

From `backend/src/schema.gql`:

```graphql
type AffLink {
  # Complex object fields (require subselections)
  clicks: [AffClick!]
  conversions: [AffConversion!]
  
  # Scalar count fields (can be queried directly)
  totalClicks: Int!
  totalConversions: Int!
  totalEarnings: Float!
  
  # ... other fields
}
```

## 🎯 Benefits

1. **Simpler queries** - No nested object selections needed for basic counts
2. **Better performance** - Count fields are pre-calculated, avoiding expensive aggregations
3. **Consistent with schema** - Uses the intended scalar fields for count data
4. **Fixes the error** - Query now validates correctly against the GraphQL schema

## ✨ Testing

The changes:
- ✅ Pass TypeScript compilation
- ✅ Match the GraphQL schema definition
- ✅ Maintain backward compatibility (count data still available)
- ✅ Applied consistently across frontend and test files

## 🔄 Related

If detailed click or conversion data is needed in the future, the full object fields can be queried with proper subselections:

```graphql
query GetDetailedAffiliateLink($id: ID!) {
  affiliateLink(id: $id) {
    totalClicks
    clicks {
      id
      clickedAt
      ipAddress
      country
      city
      device
      browser
    }
    totalConversions
    conversions {
      id
      convertedAt
      saleAmount
      commission
      orderId
    }
  }
}
```
