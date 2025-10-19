# Affiliate Links Pagination Structure Fix

**Date**: 2025-10-19  
**Issue**: GraphQL variable validation error in `GetAffiliateLinks` operation

## 🐛 Problem

The `GetAffiliateLinks` query was passing pagination parameters (`page`, `size`) directly in the search variable, but the GraphQL schema requires them to be nested under a `pagination` field.

**Error Details:**
```
Variable "$search" got invalid value { page: 1, size: 10 };
Field "page" is not defined by type "AffLinkSearchInput".
Field "size" is not defined by type "AffLinkSearchInput".
```

- Operation: `GetAffiliateLinks`
- UserId: `9ae9e59b-177c-41a8-b047-c197a343e8c3`
- Timestamp: `2025-10-19 14:03:01.213`

## 📋 Schema Analysis

The schema defines `AffLinkSearchInput` with a nested pagination structure:

```graphql
input AffLinkSearchInput {
  campaignId: String
  isActive: Boolean
  pagination: AffPaginationInput  # ← Pagination is nested!
}

input AffPaginationInput {
  page: Int! = 1
  size: Int! = 20
  sortBy: String
  sortOrder: String
}
```

**Note**: This differs from `CampaignSearchInput`, which has `page` and `size` directly at the top level:

```graphql
input CampaignSearchInput {
  status: AffCampaignStatus
  page: Int! = 1          # ← Direct fields
  size: Int! = 20         # ← Direct fields
  query: String
  # ...
}
```

## ✅ Solution

Updated all `GET_AFFILIATE_LINKS` query calls to nest pagination parameters correctly under a `pagination` field.

## 📝 Changes Made

### 1. AffiliateDashboard Component

**File**: `frontend/src/components/affiliate/dashboard/AffiliateDashboard.tsx`

**Before:**
```typescript
const { data: linksData, loading: linksLoading } = useQuery(GET_AFFILIATE_LINKS, {
  variables: { search: { page: 1, size: 10 } }
});
```

**After:**
```typescript
const { data: linksData, loading: linksLoading } = useQuery(GET_AFFILIATE_LINKS, {
  variables: { search: { pagination: { page: 1, size: 10 } } }
});
```

### 2. LinkManagement Component

**File**: `frontend/src/components/affiliate/links/LinkManagement.tsx`

**Before:**
```typescript
const { data: linksData, loading: linksLoading, error, refetch } = useQuery(GET_AFFILIATE_LINKS, {
  variables: { 
    search: { 
      isActive: selectedTab === 'active' ? true : selectedTab === 'inactive' ? false : undefined,
      page: 1, 
      size: 20 
    } 
  }
});
```

**After:**
```typescript
const { data: linksData, loading: linksLoading, error, refetch } = useQuery(GET_AFFILIATE_LINKS, {
  variables: { 
    search: { 
      isActive: selectedTab === 'active' ? true : selectedTab === 'inactive' ? false : undefined,
      pagination: {
        page: 1, 
        size: 20
      }
    } 
  }
});
```

## 🎯 Impact

### Fixed Components
- ✅ `AffiliateDashboard` - Main dashboard now loads affiliate links correctly
- ✅ `LinkManagement` - Link management page properly filters and paginates

### Not Affected
- ✅ `GET_AFFILIATE_CAMPAIGNS` queries use `CampaignSearchInput` which has flat pagination structure
- ✅ Other affiliate queries continue working as before

## ✨ Verification

The changes:
- ✅ Pass TypeScript compilation
- ✅ Match the GraphQL schema definition for `AffLinkSearchInput`
- ✅ Maintain all existing functionality (filtering, pagination)
- ✅ Consistent variable structure across all usage locations

## 📊 Schema Differences Summary

| Input Type | Pagination Structure | Fields |
|------------|---------------------|---------|
| `AffLinkSearchInput` | **Nested** under `pagination` | `campaignId`, `isActive`, `pagination` |
| `CampaignSearchInput` | **Flat** (direct fields) | `status`, `page`, `size`, `query`, etc. |

This difference exists because:
- Links use a reusable `AffPaginationInput` type (supports sorting)
- Campaigns have pagination parameters directly inline (simpler use case)

## 🔍 Related

If you need to add sorting to affiliate links:

```typescript
variables: { 
  search: { 
    isActive: true,
    pagination: {
      page: 1, 
      size: 20,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    }
  } 
}
```
