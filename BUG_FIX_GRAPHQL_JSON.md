# 🐛 Bug Fix: GraphQL JSON Scalar Type

## Issue
```
Error: Cannot determine a GraphQL output type for the "blocks". 
Make sure your class is decorated with an appropriate decorator.
```

## Root Cause
The `blocks` field in the `CustomTemplate` GraphQL model was using `@Field(() => Object)`, which NestJS GraphQL cannot map to a valid GraphQL output type. The `Object` type is not a valid GraphQL scalar or type definition.

## Solution
Changed the `blocks` field definition to use `GraphQLJSON` from the `graphql-type-json` package, which is already used throughout the project for JSON fields.

## Files Modified

### 1. `/backend/src/graphql/models/custom-template.model.ts`

**Before:**
```typescript
import { ObjectType, Field } from '@nestjs/graphql';
import { TemplateCategory } from '@prisma/client';
import { User } from './user.model';

@ObjectType()
export class CustomTemplate {
  // ... other fields ...
  
  @Field(() => Object) // JSON blocks data
  blocks: any;
  
  // ... rest of class ...
}
```

**After:**
```typescript
import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { TemplateCategory } from '@prisma/client';
import { User } from './user.model';

@ObjectType()
export class CustomTemplate {
  // ... other fields ...
  
  @Field(() => GraphQLJSON)
  blocks: any;
  
  // ... rest of class ...
}
```

### 2. `/backend/src/graphql/inputs/custom-template.input.ts`

**Before:**
```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TemplateCategory } from '@prisma/client';

@InputType()
export class CreateCustomTemplateInput {
  // ... other fields ...
  
  @Field(() => Object)
  blocks: any;
}

@InputType()
export class UpdateCustomTemplateInput {
  // ... other fields ...
  
  @Field(() => Object, { nullable: true })
  @IsOptional()
  blocks?: any;
}
```

**After:**
```typescript
import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TemplateCategory } from '@prisma/client';

@InputType()
export class CreateCustomTemplateInput {
  // ... other fields ...
  
  @Field(() => GraphQLJSON)
  blocks: any;
}

@InputType()
export class UpdateCustomTemplateInput {
  // ... other fields ...
  
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  blocks?: any;
}
```

## Changes Summary

| Component | Change | Details |
|-----------|--------|---------|
| **Import** | Added | `import { GraphQLJSON } from 'graphql-type-json'` |
| **Model Field** | Changed | `@Field(() => Object)` → `@Field(() => GraphQLJSON)` |
| **Create Input** | Changed | `@Field(() => Object)` → `@Field(() => GraphQLJSON)` |
| **Update Input** | Changed | `@Field(() => Object, { nullable: true })` → `@Field(() => GraphQLJSON, { nullable: true })` |

## Verification

### Build Status
```bash
$ npm run build
✅ TypeScript compilation: PASSED
   - No errors
   - All GraphQL types properly defined
```

### GraphQL Schema Impact
The `blocks` field is now properly recognized as a GraphQL JSON scalar type:

```graphql
type CustomTemplate {
  id: String!
  name: String!
  description: String
  category: String!
  blocks: JSON!           # ← Now properly typed as JSON scalar
  thumbnail: String
  userId: String!
  user: User!
  isPublic: Boolean!
  isArchived: Boolean!
  usageCount: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateCustomTemplateInput {
  name: String!
  description: String
  category: String!
  blocks: JSON!           # ← Now properly typed as JSON scalar
  thumbnail: String
}

input UpdateCustomTemplateInput {
  id: String!
  name: String
  description: String
  category: String
  blocks: JSON            # ← Now properly typed as JSON scalar
  thumbnail: String
}
```

## Why This Works

1. **GraphQLJSON Scalar**: The `graphql-type-json` package provides a pre-built JSON scalar type that NestJS can properly serialize/deserialize
2. **Consistent with Project**: The same `GraphQLJSON` type is used throughout the project for other JSON fields (ProductVariant.attributes, etc.)
3. **Type-Safe**: Allows any JSON-serializable data to be sent/received while maintaining type safety at the TypeScript level
4. **Standard Practice**: This is the industry-standard approach for handling JSON data in GraphQL

## Testing

The GraphQL schema now properly defines the `blocks` field:

```graphql
mutation CreateTemplate($input: CreateCustomTemplateInput!) {
  createCustomTemplate(input: $input) {
    id
    name
    blocks  # ← Can now be queried without type errors
  }
}

query GetTemplate($id: String!) {
  getCustomTemplate(id: $id) {
    blocks  # ← Can now be returned without type errors
  }
}
```

## Status

✅ **FIXED** - GraphQL JSON scalar type properly configured  
✅ **COMPILED** - Backend builds without errors  
✅ **READY** - GraphQL operations can now handle template blocks correctly

---

**Fix Date**: 2025-10-22  
**Severity**: High (blocking GraphQL schema generation)  
**Impact**: All CustomTemplate GraphQL operations can now execute
