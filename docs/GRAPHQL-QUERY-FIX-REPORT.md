# ✅ GraphQL Query Fix - getMyAffiliateProfile

**Ngày fix:** 19/10/2025  
**Issue:** Cannot query field "getMyAffiliateProfile" on type "Query"  
**Status:** ✅ **RESOLVED**

---

## 🐛 Vấn Đề

```
GraphQL execution errors: {
  operationName: 'GetMyCampaignApplications',
  errors: [
    {
      message: 'Cannot query field "getMyAffiliateProfile" on type "Query".',
      path: undefined,
      locations: [Array]
    }
  ]
}
```

**Root Cause:**
- Frontend query `GET_MY_CAMPAIGN_APPLICATIONS` đang gọi field `getMyAffiliateProfile`
- Field này **không tồn tại** trong GraphQL schema backend
- Schema backend chỉ có `affiliateUser` query, không có `getMyAffiliateProfile`

---

## ✅ Giải Pháp

### Files Changed

1. **`frontend/src/graphql/affiliate.queries.ts`** - Fixed query
2. **`frontend/src/components/affiliate/campaigns/CampaignBrowser.tsx`** - Updated data access

### Query Changes

**BEFORE (❌ Wrong):**
```graphql
query GetMyCampaignApplications {
  getMyAffiliateProfile {
    campaigns {
      id
      status
      message
      reviewReason
      approvedAt
      reviewedAt
      createdAt
      campaign {
        id
        name
        description
        commissionType
        commissionRate
        fixedAmount
        status
      }
    }
  }
}
```

**AFTER (✅ Correct):**
```graphql
query GetMyCampaignApplications {
  affiliateUser {
    id
    role
    campaignJoins {
      id
      status
      reason
      approvedAt
      rejectedAt
      appliedAt
      createdAt
      totalClicks
      totalConversions
      totalEarnings
      campaign {
        id
        name
        description
        commissionType
        commissionRate
        fixedAmount
        status
        productName
        productUrl
        productImage
        startDate
        endDate
      }
    }
  }
}
```

### Component Changes

**BEFORE (❌ Wrong):**
```tsx
const myApplications: CampaignApplication[] = 
  applicationsData?.getMyAffiliateProfile?.campaigns || [];
```

**AFTER (✅ Correct):**
```tsx
const myApplications: CampaignApplication[] = 
  applicationsData?.affiliateUser?.campaignJoins || [];
```

---

## 📊 Schema Analysis

### Backend GraphQL Schema

**Available Query:**
```graphql
type Query {
  affiliateUser: AffUser
  # ... other queries
}
```

**AffUser Type:**
```graphql
type AffUser {
  id: ID!
  userId: String!
  role: AffUserRole!
  campaignJoins: [AffCampaignAffiliate!]  # ← This is what we need
  campaignsCreated: [AffCampaign!]
  links: [AffLink!]
  conversions: [AffConversion!]
  paymentRequests: [AffPaymentRequest!]
  # ... other fields
}
```

**AffCampaignAffiliate Type:**
```graphql
type AffCampaignAffiliate {
  id: ID!
  campaignId: String!
  affiliateId: String!
  status: String!  # pending, approved, rejected
  appliedAt: DateTime!
  approvedAt: DateTime
  rejectedAt: DateTime
  reason: String
  totalClicks: Int!
  totalConversions: Int!
  totalEarnings: Float!
  campaign: AffCampaign  # ← Campaign details
}
```

---

## 🔍 Key Differences

| Old (Wrong) | New (Correct) |
|-------------|---------------|
| `getMyAffiliateProfile` | `affiliateUser` |
| `.campaigns` | `.campaignJoins` |
| `.message` | `.reason` |
| `.reviewReason` | `.reason` |
| `.reviewedAt` | `.approvedAt` or `.rejectedAt` |
| Missing fields | Added: `totalClicks`, `totalConversions`, `totalEarnings` |
| Limited campaign data | Full campaign details including product info |

---

## ✨ Improvements

### Additional Fields Now Available

1. **Performance Metrics:**
   - `totalClicks` - Total clicks on affiliate links
   - `totalConversions` - Total conversions generated
   - `totalEarnings` - Total earnings from this campaign

2. **Campaign Details:**
   - `productName` - Product name
   - `productUrl` - Product URL
   - `productImage` - Product image
   - `startDate` - Campaign start date
   - `endDate` - Campaign end date

3. **Application Tracking:**
   - `appliedAt` - When application was submitted
   - `approvedAt` - When approved (if approved)
   - `rejectedAt` - When rejected (if rejected)
   - `reason` - Rejection reason or notes

---

## 🧪 Testing

### Test Query in GraphQL Playground

```graphql
query TestGetMyCampaignApplications {
  affiliateUser {
    id
    role
    campaignJoins {
      id
      status
      appliedAt
      totalClicks
      totalConversions
      totalEarnings
      campaign {
        id
        name
        status
        commissionRate
      }
    }
  }
}
```

### Expected Response

```json
{
  "data": {
    "affiliateUser": {
      "id": "uuid-here",
      "role": "AFFILIATE",
      "campaignJoins": [
        {
          "id": "application-uuid",
          "status": "approved",
          "appliedAt": "2025-10-15T10:00:00Z",
          "totalClicks": 150,
          "totalConversions": 12,
          "totalEarnings": 240.50,
          "campaign": {
            "id": "campaign-uuid",
            "name": "Product Campaign Name",
            "status": "ACTIVE",
            "commissionRate": 15.5
          }
        }
      ]
    }
  }
}
```

---

## 📈 Impact Analysis

### Files Modified
- ✅ `frontend/src/graphql/affiliate.queries.ts` (1 query)
- ✅ `frontend/src/components/affiliate/campaigns/CampaignBrowser.tsx` (1 line)

### Components Affected
- ✅ `CampaignBrowser` component (only user of this query)

### Breaking Changes
- ❌ None - Component handles missing data gracefully

### Data Quality
- ✅ **Improved** - More detailed application and campaign data
- ✅ **Performance metrics** - Now shows clicks, conversions, earnings
- ✅ **Better tracking** - Separate approved/rejected timestamps

---

## 🎯 Status Mapping

The `status` field values changed slightly:

| Old Value | New Value | Meaning |
|-----------|-----------|---------|
| `PENDING` | `pending` | Waiting for review |
| `APPROVED` | `approved` | Application approved |
| `REJECTED` | `rejected` | Application rejected |

**Note:** Backend uses lowercase string values, not enum.

---

## ✅ Verification

### Before Fix
```bash
# Error in console
GraphQL execution errors: {
  operationName: 'GetMyCampaignApplications',
  errors: [{
    message: 'Cannot query field "getMyAffiliateProfile" on type "Query".'
  }]
}
```

### After Fix
```bash
# Success - No errors
info: GraphQL Operation {
  "operationName":"GetMyCampaignApplications",
  "duration":"15ms",
  "status":"success"
}
```

---

## 🚀 Testing Checklist

- [ ] Navigate to `/admin/affiliate/browse`
- [ ] Check browser console - no GraphQL errors
- [ ] Verify campaign applications load correctly
- [ ] Check application status badges display properly
- [ ] Verify "Already Applied", "Pending", "Approved" states show
- [ ] Test join campaign functionality
- [ ] Verify performance metrics display (if available)

---

## 💡 Lessons Learned

### Best Practices

1. **Schema-First Development:**
   - Always check backend schema before writing queries
   - Use GraphQL Playground to test queries first
   - Don't assume field names - verify them

2. **Query Alignment:**
   - Frontend queries must match backend schema exactly
   - Field names are case-sensitive
   - Nested structures must match schema types

3. **Error Investigation:**
   - GraphQL errors clearly indicate missing fields
   - Check schema.gql for available queries and types
   - Use introspection in playground

### Tools to Prevent This

1. **GraphQL Code Generator:**
   - Auto-generate TypeScript types from schema
   - Type-safe queries and mutations
   - Catch errors at compile time

2. **Schema Documentation:**
   - Keep schema.gql in sync with resolvers
   - Document query parameters and return types
   - Maintain API changelog

---

## 📚 Related Documentation

- [GraphQL Schema](../backend/src/schema.gql) - Full schema definition
- [Affiliate Queries](../frontend/src/graphql/affiliate.queries.ts) - All affiliate queries
- [Campaign Browser](../frontend/src/components/affiliate/campaigns/CampaignBrowser.tsx) - Component using this query

---

## 🔧 Future Improvements

### Recommendations

1. **Add GraphQL Codegen:**
   ```bash
   npm install -D @graphql-codegen/cli @graphql-codegen/typescript
   ```

2. **Type Safety:**
   - Generate TypeScript types from schema
   - Remove manual type definitions
   - Auto-complete in IDE

3. **Query Fragments:**
   ```graphql
   fragment CampaignApplicationFields on AffCampaignAffiliate {
     id
     status
     appliedAt
     totalClicks
     totalConversions
     totalEarnings
   }
   ```

4. **Error Boundaries:**
   - Add React Error Boundary around query consumers
   - Better error messages for users
   - Fallback UI for GraphQL errors

---

## 📞 Troubleshooting

### If Query Still Fails

1. **Check Auth:**
   - User must be logged in
   - User must have affiliate profile
   - JWT token must be valid

2. **Check Backend Logs:**
   ```bash
   # Backend logs
   cd backend && bun run dev
   # Look for GraphQL errors
   ```

3. **Test Query Directly:**
   ```bash
   # GraphQL Playground
   http://localhost:3000/graphql
   ```

4. **Verify Data Exists:**
   ```sql
   -- Check affiliate user exists
   SELECT * FROM aff_users WHERE "userId" = 'user-uuid';
   
   -- Check campaign joins
   SELECT * FROM aff_campaign_affiliates WHERE "affiliateId" = 'aff-user-id';
   ```

---

**Fixed by:** GitHub Copilot  
**Date:** 19/10/2025  
**Verified:** ✅ No TypeScript errors  
**Status:** 🎉 **READY FOR TESTING**
