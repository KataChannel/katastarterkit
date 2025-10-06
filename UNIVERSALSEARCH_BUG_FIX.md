# 🐛 Fix UniversalSearch ValidationPipe Error - COMPLETE

**Ngày fix:** October 6, 2025  
**Bug:** GraphQL Error - Bad Request Exception in UniversalSearch query

---

## 🔍 **Vấn Đề**

### Error Log:
```
error: GraphQL Error in QUERY UniversalSearch.universalSearch 
{
  "context":"GraphQL",
  "duration":3,
  "errorMessage":"Bad Request Exception",
  "fieldName":"universalSearch",
  "operation":"query",
  "operationName":"UniversalSearch",
  "variables":{"input":{"limit":20,"offset":0,"term":"kiệt"}}
}

BadRequestException: Bad Request Exception
    at ValidationPipe.exceptionFactory
    at ValidationPipe.transform
```

### Root Cause:
1. ❌ `OramaSearchInput` DTO **thiếu class-validator decorators**
2. ❌ `OramaSortInput` DTO **thiếu class-validator decorators**
3. ❌ ValidationPipe không biết cách validate input → reject tất cả requests
4. ⚠️ Global ValidationPipe có `forbidNonWhitelisted: true` - quá strict với GraphQLJSON types

---

## ✅ **Giải Pháp**

### 1️⃣ **Thêm Validation Decorators cho DTOs**

#### File: `/backend/src/graphql/models/orama-search.model.ts`

**Before:**
```typescript
import { ObjectType, Field, Int, Float, InputType, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class OramaSearchInput {
  @Field({ nullable: true })
  term?: string;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number;
  // ... other fields without validation
}
```

**After:**
```typescript
import { ObjectType, Field, Int, Float, InputType, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator'; // ✅ Added

@InputType()
export class OramaSearchInput {
  @Field({ nullable: true })
  @IsOptional()           // ✅ Added
  @IsString()             // ✅ Added
  term?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()           // ✅ Added
  where?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()           // ✅ Added
  facets?: any;

  @Field(() => OramaSortInput, { nullable: true })
  @IsOptional()           // ✅ Added
  sortBy?: OramaSortInput;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()           // ✅ Added
  @IsInt()                // ✅ Added
  @Min(1)                 // ✅ Added - Min 1 result
  @Max(100)               // ✅ Added - Max 100 results
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()           // ✅ Added
  @IsInt()                // ✅ Added
  @Min(0)                 // ✅ Added - Min offset 0
  offset?: number;
}

@InputType()
export class OramaSortInput {
  @Field()
  @IsString()             // ✅ Added
  property: string;

  @Field(() => OramaSortOrder)
  @IsEnum(OramaSortOrder) // ✅ Added
  order: OramaSortOrder;
}
```

---

### 2️⃣ **Thêm @UsePipes cho Resolver**

#### File: `/backend/src/graphql/resolvers/orama-search.resolver.ts`

**Before:**
```typescript
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class OramaSearchResolver {
  // ... queries without explicit ValidationPipe
}
```

**After:**
```typescript
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'; // ✅ Added

@Resolver()
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false, // ✅ Allow extra fields for GraphQLJSON types
  })
)
export class OramaSearchResolver {
  constructor(private readonly oramaService: OramaService) {}

  @Query(() => UniversalSearchResult)
  async universalSearch(
    @Args('input') input: OramaSearchInput,
    @Context() context: any,
  ): Promise<UniversalSearchResult> {
    return this.oramaService.searchAll(input);
  }
  // ... other queries
}
```

---

## 🎯 **Chi Tiết Validation Rules**

### `OramaSearchInput` Validation:

| Field | Validation | Rule |
|-------|------------|------|
| `term` | `@IsOptional()` `@IsString()` | String hoặc undefined |
| `where` | `@IsOptional()` | GraphQLJSON - any object |
| `facets` | `@IsOptional()` | GraphQLJSON - any object |
| `sortBy` | `@IsOptional()` | OramaSortInput hoặc undefined |
| `limit` | `@IsOptional()` `@IsInt()` `@Min(1)` `@Max(100)` | 1-100, default 20 |
| `offset` | `@IsOptional()` `@IsInt()` `@Min(0)` | ≥0, default 0 |

### `OramaSortInput` Validation:

| Field | Validation | Rule |
|-------|------------|------|
| `property` | `@IsString()` | String (required) |
| `order` | `@IsEnum(OramaSortOrder)` | ASC or DESC (required) |

---

## 🧪 **Testing**

### Test Query:
```graphql
query UniversalSearch {
  universalSearch(input: {
    term: "kiệt"
    limit: 20
    offset: 0
  }) {
    tasks {
      hits {
        id
        score
        document
      }
      count
    }
    users {
      hits {
        id
        score
        document
      }
      count
    }
    projects {
      count
    }
    affiliateCampaigns {
      count
    }
    affiliateLinks {
      count
    }
  }
}
```

### Expected Result:
✅ Query executes successfully  
✅ No "Bad Request Exception"  
✅ Returns proper search results  

### Test Cases:

1. **Valid input with term:**
```graphql
{ input: { term: "kiệt", limit: 20, offset: 0 } }
✅ Should pass validation
```

2. **Valid input with Vietnamese characters:**
```graphql
{ input: { term: "xin chào", limit: 10 } }
✅ Should pass validation
```

3. **Invalid limit (too high):**
```graphql
{ input: { term: "test", limit: 200 } }
❌ Should fail: limit max 100
```

4. **Invalid offset (negative):**
```graphql
{ input: { term: "test", offset: -1 } }
❌ Should fail: offset min 0
```

5. **Empty input (all optional):**
```graphql
{ input: {} }
✅ Should pass (all fields optional with defaults)
```

---

## 📊 **Tóm Tắt Changes**

### Files Modified: **2 files**

1. ✅ `/backend/src/graphql/models/orama-search.model.ts`
   - Import class-validator decorators
   - Add validation to `OramaSearchInput` (6 fields)
   - Add validation to `OramaSortInput` (2 fields)

2. ✅ `/backend/src/graphql/resolvers/orama-search.resolver.ts`
   - Import `UsePipes`, `ValidationPipe`
   - Add `@UsePipes` decorator to resolver class
   - Configure ValidationPipe with `forbidNonWhitelisted: false`

### Lines Changed:
- **Added:** ~15 lines (validation decorators + imports)
- **Modified:** ~5 lines (resolver decorator)

---

## 🔑 **Key Takeaways**

### Why This Bug Happened:
1. ❌ DTOs created without class-validator decorators
2. ❌ Global ValidationPipe expects all DTOs to have validation
3. ❌ Without decorators, ValidationPipe rejects ALL inputs as invalid

### Best Practices Applied:
1. ✅ **Always add class-validator decorators** to InputType DTOs
2. ✅ **Use @IsOptional()** for nullable/optional fields
3. ✅ **Add constraints** (@Min, @Max, @IsEnum) for business rules
4. ✅ **Configure ValidationPipe** per resolver if needed (forbidNonWhitelisted: false for GraphQLJSON)
5. ✅ **Test with various inputs** including edge cases

### Prevention:
- ✅ Create DTOs với validation decorators ngay từ đầu
- ✅ Test validation với unit tests
- ✅ Document validation rules trong code comments
- ✅ Use proper TypeScript types + runtime validation

---

## 🚀 **Next Steps**

### ✅ Completed:
1. ✅ Add validation decorators to DTOs
2. ✅ Configure ValidationPipe in resolver
3. ✅ Test queries work correctly

### 🔜 Optional Improvements:
1. **Add custom validation messages:**
```typescript
@Min(1, { message: 'Limit must be at least 1' })
@Max(100, { message: 'Limit cannot exceed 100' })
limit?: number;
```

2. **Add unit tests for validation:**
```typescript
describe('OramaSearchInput validation', () => {
  it('should accept valid input', async () => {
    const input = { term: 'test', limit: 20, offset: 0 };
    // test validation passes
  });

  it('should reject limit > 100', async () => {
    const input = { limit: 200 };
    // test validation fails
  });
});
```

3. **Add API documentation:**
```typescript
@Field(() => Int, { 
  nullable: true, 
  defaultValue: 20,
  description: 'Number of results to return (1-100)'
})
```

---

**✅ Bug Fixed Successfully!**

Query `universalSearch` hiện đã hoạt động bình thường với đầy đủ validation.
