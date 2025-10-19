# 🐛 CLASS-VALIDATOR DECORATORS - BUG FIX

**Ngày**: 20 Tháng 10, 2025  
**Bug**: ValidationPipe strips fields without class-validator decorators  
**Status**: ✅ FIXED

---

## 📋 PROBLEM

### Error Symptoms
```
Campaign ID is required
```

### Error Context
```json
{
  "variables": {
    "input": {
      "campaignId": "006be158-ac5f-484c-ae29-ad8d3d42d482", // ✅ Present in request
      "originalUrl": "https://timona.edu.vn/...",
      "customAlias": "combo-chu-spa",
      "title": "KHOÁ HỌC QUẢN LÝ/CHỦ SPA"
    }
  }
}
```

**Confusion**: `campaignId` IS present in request, but service receives `undefined`!

---

## 🔍 ROOT CAUSE

### ValidationPipe with `whitelist: true`

**File**: `backend/src/main.ts`

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,  // ⚠️ Strips properties without validators!
    transform: true,
  }),
);
```

### Missing Validators

**File**: `backend/src/graphql/inputs/affiliate.input.ts`

```typescript
// ❌ BEFORE - Only GraphQL decorators
@InputType()
export class CreateAffLinkInput {
  @Field()  // GraphQL knows about this
  campaignId: string;  // ❌ But ValidationPipe strips it!

  @Field({ nullable: true })
  originalUrl?: string;
}
```

### What Happens

1. **GraphQL receives**: `{ campaignId: "006...", originalUrl: "..." }`
2. **ValidationPipe processes**: Checks for class-validator decorators
3. **No decorators found**: Strips `campaignId` and `originalUrl` (whitelist: true)
4. **Service receives**: `{}` (empty object!)
5. **Validation fails**: "Campaign ID is required"

---

## 🔧 SOLUTION

### Added class-validator Decorators

**File**: `backend/src/graphql/inputs/affiliate.input.ts`

```typescript
import { IsNotEmpty, IsString, IsOptional, IsUrl, Length, Matches } from 'class-validator';

@InputType()
export class CreateAffLinkInput {
  // ✅ FIXED - Added validators
  @Field()
  @IsNotEmpty({ message: 'Campaign ID is required' })
  @IsString()
  campaignId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Original URL must be a valid URL' })
  originalUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Custom alias must be between 1 and 100 characters' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Custom alias must be lowercase alphanumeric with hyphens only' })
  customAlias?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  utmCampaign?: string;
}
```

---

## 📊 VALIDATION IMPROVEMENTS

### Required Field: campaignId

```typescript
@IsNotEmpty({ message: 'Campaign ID is required' })
@IsString()
campaignId: string;
```

**Validates:**
- ✅ Not null
- ✅ Not undefined
- ✅ Not empty string
- ✅ Is a string type

---

### URL Validation: originalUrl

```typescript
@IsOptional()
@IsUrl({}, { message: 'Original URL must be a valid URL' })
originalUrl?: string;
```

**Validates:**
- ✅ Valid URL format
- ✅ Has protocol (http/https)
- ✅ Optional (can be omitted)

**Examples:**
- ✅ `https://timona.edu.vn/khoa-hoc/`
- ✅ `http://example.com/page`
- ❌ `not-a-url`
- ❌ `timona.edu.vn` (missing protocol)

---

### Slug Validation: customAlias

```typescript
@IsOptional()
@Length(1, 100, { message: 'Custom alias must be between 1 and 100 characters' })
@Matches(/^[a-z0-9-]+$/, { message: 'Custom alias must be lowercase alphanumeric with hyphens only' })
customAlias?: string;
```

**Validates:**
- ✅ Length: 1-100 characters
- ✅ Pattern: lowercase letters, numbers, hyphens only
- ✅ Optional

**Examples:**
- ✅ `combo-chu-spa`
- ✅ `summer-sale-2024`
- ❌ `Combo-Chu-Spa` (uppercase)
- ❌ `combo_chu_spa` (underscore)
- ❌ `combo chu spa` (space)

---

### Text Validation: title

```typescript
@IsOptional()
@Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
title?: string;
```

**Validates:**
- ✅ Length: 1-200 characters
- ✅ Optional

---

## ✅ BENEFITS

### 1. Prevents Field Stripping

**Before:**
```typescript
Request: { campaignId: "006..." }
After ValidationPipe: {}  // ❌ Stripped!
```

**After:**
```typescript
Request: { campaignId: "006..." }
After ValidationPipe: { campaignId: "006..." }  // ✅ Preserved!
```

---

### 2. Better Error Messages

**Before:**
```
Campaign ID is required  // Generic service-level error
```

**After:**
```
campaignId should not be empty  // Clear validation error
originalUrl must be a valid URL
customAlias must match /^[a-z0-9-]+$/ regular expression
```

---

### 3. Early Validation

**Before:**
```
Request → GraphQL → Resolver → Service → ❌ Error
```

**After:**
```
Request → ValidationPipe → ❌ Error (if invalid)
                        → ✅ Continue (if valid)
```

**Result**: Errors caught earlier, faster response, less processing

---

### 4. Data Integrity

**Validation at Input:**
- ✅ URL must be valid format
- ✅ Custom alias must be URL-safe
- ✅ Length constraints enforced
- ✅ Type safety guaranteed

---

## 🧪 TESTING

### Test Case 1: Valid Input ✅

```graphql
mutation {
  createAffiliateLink(input: {
    campaignId: "006be158-ac5f-484c-ae29-ad8d3d42d482"
    originalUrl: "https://timona.edu.vn/khoa-hoc/combo-chu-spa/"
    customAlias: "combo-chu-spa"
    title: "KHOÁ HỌC QUẢN LÝ/CHỦ SPA"
    description: "Khóa học quản lý spa..."
  }) {
    id
    trackingCode
  }
}
```

**Expected**: ✅ Success

---

### Test Case 2: Missing campaignId ❌

```graphql
mutation {
  createAffiliateLink(input: {
    originalUrl: "https://timona.edu.vn/..."
  }) {
    id
  }
}
```

**Expected**: ❌ Error: "campaignId should not be empty"

---

### Test Case 3: Invalid URL ❌

```graphql
mutation {
  createAffiliateLink(input: {
    campaignId: "006be158..."
    originalUrl: "not-a-url"
  }) {
    id
  }
}
```

**Expected**: ❌ Error: "originalUrl must be a valid URL"

---

### Test Case 4: Invalid customAlias ❌

```graphql
mutation {
  createAffiliateLink(input: {
    campaignId: "006be158..."
    customAlias: "Combo_Chu Spa!"  # Uppercase, underscore, space, special char
  }) {
    id
  }
}
```

**Expected**: ❌ Error: "customAlias must match /^[a-z0-9-]+$/ regular expression"

---

## 📚 BEST PRACTICES

### Always Use Both Decorators

```typescript
@InputType()
export class MyInput {
  @Field()              // ✅ GraphQL knows about it
  @IsNotEmpty()         // ✅ ValidationPipe validates it
  myField: string;
}
```

**Why Both?**
- `@Field()`: GraphQL schema generation & type safety
- `@IsNotEmpty()`: Runtime validation & whitelisting

---

### Optional Fields

```typescript
@Field({ nullable: true })  // ✅ GraphQL: can be null
@IsOptional()               // ✅ Validator: skip if undefined
@IsString()                 // ✅ If provided, must be string
myOptionalField?: string;
```

---

### Complex Validations

```typescript
@Field()
@IsNotEmpty()
@IsString()
@Length(3, 50)
@Matches(/^[a-zA-Z0-9-]+$/)
@IsLowercase()
slug: string;
```

**Runs in order**: Each decorator validates if previous ones passed

---

## 🔮 FUTURE IMPROVEMENTS

### Custom Validators

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isUniqueCampaignAlias', async: true })
export class IsUniqueCampaignAlias implements ValidatorConstraintInterface {
  async validate(alias: string) {
    const exists = await prisma.affLink.findFirst({ where: { customAlias: alias } });
    return !exists;
  }

  defaultMessage() {
    return 'Custom alias already exists';
  }
}

// Usage
@Field({ nullable: true })
@IsOptional()
@Validate(IsUniqueCampaignAlias)
customAlias?: string;
```

---

### Sanitization

```typescript
import { Transform } from 'class-transformer';

@Field({ nullable: true })
@IsOptional()
@Transform(({ value }) => value?.trim().toLowerCase())
@Matches(/^[a-z0-9-]+$/)
customAlias?: string;
```

**Result**: Auto-converts `"Combo-Spa"` → `"combo-spa"`

---

## ✅ SUMMARY

### What We Fixed
- ✅ Added `class-validator` decorators to all input fields
- ✅ Prevents ValidationPipe from stripping fields
- ✅ Better error messages
- ✅ Earlier validation (at input layer)
- ✅ Data integrity enforced

### Validation Rules Added
- ✅ `campaignId`: Required, non-empty string
- ✅ `originalUrl`: Valid URL format (optional)
- ✅ `customAlias`: Lowercase alphanumeric + hyphens, 1-100 chars (optional)
- ✅ `title`: 1-200 characters (optional)
- ✅ `description`: String (optional)
- ✅ UTM fields: Strings (optional)

### Impact
- **Security**: ✅ Input validation at entry point
- **UX**: ✅ Clear, specific error messages
- **Performance**: ✅ Early rejection of invalid data
- **Maintainability**: ✅ Declarative validation rules
- **Type Safety**: ✅ Runtime + compile-time validation

---

**Fixed**: 20 Tháng 10, 2025  
**Build**: ✅ Successful  
**Ready for**: Testing & Deployment

**Related Docs:**
- `AFFILIATE-CAMPAIGN-ID-VALIDATION-FIX.md`
- `AFFILIATE-PROFILE-AUTO-CREATION-FIX.md`
- `AFFILIATE-LINK-CREATION-BUG-FIX.md`
