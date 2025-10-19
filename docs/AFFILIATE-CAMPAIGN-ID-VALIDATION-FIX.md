# 🐛 CAMPAIGN ID VALIDATION - BUG FIX

**Ngày**: 20 Tháng 10, 2025  
**Bug**: `id: undefined` in Prisma query  
**Status**: ✅ FIXED

---

## 📋 ERROR

```
[Nest] ERROR [ExceptionsHandler] PrismaClientValidationError: 
Invalid `this.prisma.affCampaign.findUnique()` invocation

→ 58 const campaign = await this.prisma.affCampaign.findUnique({
       where: {
         id: undefined,  // ❌ UNDEFINED!
       }
     })

Argument `where` of type AffCampaignWhereUniqueInput needs at least one of `id` arguments.
```

---

## 🔍 ROOT CAUSE

**Problem**: `input.campaignId` is `undefined` when passed to service

**Possible Reasons:**
1. Frontend not sending `campaignId` in mutation variables
2. GraphQL variable mapping issue
3. Missing data in request payload

**Code Location**: `backend/src/services/affiliate-tracking.service.ts:58`

---

## 🔧 FIX APPLIED

### Added Input Validation

**File**: `backend/src/services/affiliate-tracking.service.ts`

```typescript
async createAffiliateLink(affiliateUserId: string, input: CreateAffLinkInput) {
  // ✅ ADDED: Validate required fields
  if (!input.campaignId) {
    throw new BadRequestException('Campaign ID is required');
  }

  // Get or create affiliate profile
  let affiliate = await this.prisma.affUser.findUnique({
    where: { userId: affiliateUserId },
  });

  // ... rest of the code
}
```

---

## ✅ WHAT CHANGED

### Before (❌)
```typescript
async createAffiliateLink(affiliateUserId: string, input: CreateAffLinkInput) {
  // No validation!
  
  const campaign = await this.prisma.affCampaign.findUnique({
    where: { id: input.campaignId }, // ❌ Crashes if undefined
  });
}
```

### After (✅)
```typescript
async createAffiliateLink(affiliateUserId: string, input: CreateAffLinkInput) {
  // ✅ Validate first
  if (!input.campaignId) {
    throw new BadRequestException('Campaign ID is required');
  }
  
  const campaign = await this.prisma.affCampaign.findUnique({
    where: { id: input.campaignId }, // ✅ Safe - validated above
  });
}
```

---

## 📊 ERROR HANDLING

### Old Error (Cryptic)
```
PrismaClientValidationError: Invalid invocation
where: { id: undefined }
Argument needs at least one of `id` arguments
```
❌ Developer error, not user-friendly

### New Error (Clear)
```
BadRequestException: Campaign ID is required
```
✅ Clear, actionable message

---

## 🧪 TESTING

### Test Case 1: Valid Input ✅
```json
{
  "input": {
    "campaignId": "006be158-ac5f-484c-ae29-ad8d3d42d482",
    "originalUrl": "https://timona.edu.vn/...",
    "customAlias": "combo-chu-spa",
    "title": "KHOÁ HỌC QUẢN LÝ/CHỦ SPA"
  }
}
```
**Expected**: ✅ Link created successfully

### Test Case 2: Missing campaignId ❌
```json
{
  "input": {
    "originalUrl": "https://timona.edu.vn/...",
    "customAlias": "combo-chu-spa"
  }
}
```
**Expected**: ❌ Clear error: "Campaign ID is required"

### Test Case 3: Null campaignId ❌
```json
{
  "input": {
    "campaignId": null,
    "originalUrl": "https://timona.edu.vn/..."
  }
}
```
**Expected**: ❌ Clear error: "Campaign ID is required"

---

## 🎯 FRONTEND FIX NEEDED

**Check GraphQL Mutation Variables:**

```typescript
// ❌ WRONG - Missing campaignId
const [createLink] = useMutation(CREATE_LINK_MUTATION, {
  variables: {
    input: {
      originalUrl: url,
      customAlias: alias,
      // campaignId is missing!
    }
  }
});

// ✅ CORRECT - Include campaignId
const [createLink] = useMutation(CREATE_LINK_MUTATION, {
  variables: {
    input: {
      campaignId: selectedCampaign.id, // ✅ Required!
      originalUrl: url,
      customAlias: alias,
      title: title,
      description: description,
    }
  }
});
```

---

## 📝 PREVENTION

### TypeScript Type Safety

GraphQL input type already defines `campaignId` as required:

```typescript
@InputType()
export class CreateAffLinkInput {
  @Field()  // ✅ No nullable: true = REQUIRED
  campaignId: string;

  @Field({ nullable: true })
  originalUrl?: string;
  
  // ...
}
```

**But**: TypeScript can't prevent runtime `undefined` values from external sources (HTTP requests, user input, etc.)

**Solution**: Add runtime validation at service entry point

---

## 🚀 DEPLOYMENT

### Status
- ✅ Backend validation added
- ✅ Build successful
- ✅ Clear error messages
- ⏳ Frontend fix needed (check mutation variables)

### How to Test

**1. Test with valid campaignId:**
```bash
cd backend
node test-affiliate-link-creation.js
```

**2. Check error handling:**
- Try mutation without campaignId
- Should see: "Campaign ID is required"
- Not: "Invalid Prisma invocation"

---

## 📚 RELATED

**Other Input Validations to Consider:**

```typescript
async createAffiliateLink(affiliateUserId: string, input: CreateAffLinkInput) {
  // Validate required fields
  if (!input.campaignId) {
    throw new BadRequestException('Campaign ID is required');
  }

  // Optional: Add more validations
  if (!affiliateUserId) {
    throw new BadRequestException('User ID is required');
  }

  if (input.customAlias && input.customAlias.length > 100) {
    throw new BadRequestException('Custom alias too long (max 100 chars)');
  }

  if (input.customAlias && !/^[a-z0-9-]+$/.test(input.customAlias)) {
    throw new BadRequestException('Custom alias must be lowercase alphanumeric with hyphens');
  }

  // ... rest
}
```

---

## ✅ SUMMARY

### What We Fixed
- ✅ Added runtime validation for `campaignId`
- ✅ Better error message
- ✅ Prevents Prisma crashes
- ✅ Created test script

### What's Next
- 🔍 Check frontend mutation variables
- 🔍 Ensure `campaignId` is passed correctly
- 🔍 Test end-to-end flow
- 📝 Add more input validations if needed

---

**Fixed**: 20 Tháng 10, 2025  
**Build**: ✅ Successful  
**Ready for**: Testing & Deployment

**Related Docs:**
- `AFFILIATE-PROFILE-AUTO-CREATION-FIX.md`
- `AFFILIATE-LINK-CREATION-BUG-FIX.md`
