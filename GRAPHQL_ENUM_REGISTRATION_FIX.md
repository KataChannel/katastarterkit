# GraphQL Enum Registration Fix - ANALYTICS Category

## ❌ Vấn Đề

Khi seed website settings với category `ANALYTICS`, gặp lỗi GraphQL:

```json
[
    {
        "#": 1,
        "Message": "String cannot represent a non string value: ANALYTICS",
        "Code": "GRAPHQL_VALIDATION_FAILED",
        "Path": "N/A"
    }
]
```

## 🔍 Nguyên Nhân

Enum `SettingCategory` và `SettingType` **đã được định nghĩa** trong:
- ✅ Prisma Schema (`backend/prisma/schema.prisma`)
- ✅ GraphQL Schema (`backend/src/graphql/schemas/websitesetting.graphql`)
- ✅ TypeScript DTO (`backend/src/graphql/dto/website-setting.input.ts`)

**Nhưng thiếu** `registerEnumType()` để register enum với NestJS GraphQL module.

## ✅ Giải Pháp

### 1. Thêm `registerEnumType` vào DTO file

**File:** `backend/src/graphql/dto/website-setting.input.ts`

```typescript
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

export enum SettingCategory {
  GENERAL = 'GENERAL',
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
  SEO = 'SEO',
  SOCIAL = 'SOCIAL',
  CONTACT = 'CONTACT',
  APPEARANCE = 'APPEARANCE',
  ANALYTICS = 'ANALYTICS',      // ← Enum value đã có
  PAYMENT = 'PAYMENT',
  SHIPPING = 'SHIPPING',
  SUPPORT_CHAT = 'SUPPORT_CHAT',
  AUTH = 'AUTH',
}

export enum SettingType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  JSON = 'JSON',
  COLOR = 'COLOR',
  IMAGE = 'IMAGE',
  URL = 'URL',
}

// ← THÊM PHẦN NÀY
// Register enums for GraphQL
registerEnumType(SettingCategory, {
  name: 'SettingCategory',
  description: 'Website setting categories',
});

registerEnumType(SettingType, {
  name: 'SettingType',
  description: 'Website setting data types',
});
```

### 2. Rebuild Backend

```bash
cd backend
bun run build
```

### 3. Seed Settings Lại

```bash
bun run src/seed/seed-website-settings.ts
```

## 📊 Kết Quả

✅ Seed thành công 67 website settings
✅ 9 analytics settings được tạo:
- `analytics.google_analytics_id`
- `analytics.google_analytics_enabled`
- `analytics.google_tag_manager_id`
- `analytics.google_tag_manager_enabled`
- `analytics.facebook_pixel_id`
- `analytics.facebook_pixel_enabled`
- `analytics.facebook_pixel_events`
- `analytics.tiktok_pixel_id`
- `analytics.tiktok_pixel_enabled`

## 🎓 Bài Học

Khi sử dụng **NestJS GraphQL Code First Approach**:

1. **Định nghĩa enum trong TypeScript**
2. **PHẢI register enum** với GraphQL bằng `registerEnumType()`
3. Rebuild để TypeScript compile thay đổi
4. NestJS sẽ tự động generate GraphQL schema từ decorated classes

**Lưu ý:** Không đủ chỉ define enum trong `.graphql` file hoặc Prisma schema. Code-first approach cần register trong TypeScript code.

## 🔗 Related Files

- `backend/prisma/schema.prisma` - Prisma enum definitions
- `backend/src/graphql/schemas/websitesetting.graphql` - GraphQL schema
- `backend/src/graphql/dto/website-setting.input.ts` - TypeScript DTOs + **enum registration**
- `backend/src/graphql/resolvers/website-setting.resolver.ts` - GraphQL resolvers
- `backend/src/seed/seed-website-settings.ts` - Seed script

## ✅ Status

**RESOLVED** - Nov 27, 2025
- Enum registration added
- Backend rebuilt
- Settings seeded successfully
- Analytics category working correctly
