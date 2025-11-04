# WebsiteSetting Model - Backup & Restore Updates

## Summary
Updated the backup and restore scripts to properly handle the `WebsiteSetting` model with full support for its JSON fields and foreign key relationships.

## Changes Made

### 1. **backup.ts** - Enhanced to Include System Tables

#### New Function: `isSystemTable()`
```typescript
function isSystemTable(tableName: string): boolean {
  const systemTables = [
    'website_settings', // WebsiteSetting model - important config
    '_prisma_migrations', // Prisma migrations tracking
  ];
  return systemTables.includes(tableName);
}
```
- Marks critical tables that should always be backed up
- Ensures `website_settings` table is included even if not found in schema parsing

#### Updated `getTables()` Function
- Now explicitly includes system tables in backup list
- Filters by schema models first, then adds system tables
- Ensures `website_settings` is always backed up when it exists in database

### 2. **restore.ts** - Enhanced Data Transformation

#### Updated `transformRecord()` Function
Added specific handling for `website_settings` table:

```typescript
// Handle website_settings specific transformations
if (tableName === 'website_settings') {
  // Ensure options is JSON object/array
  if (transformed.options && typeof transformed.options === 'string') {
    try {
      transformed.options = JSON.parse(transformed.options);
    } catch {
      transformed.options = null;
    }
  }
  // Ensure validation is JSON object
  if (transformed.validation && typeof transformed.validation === 'string') {
    try {
      transformed.validation = JSON.parse(transformed.validation);
    } catch {
      transformed.validation = null;
    }
  }
  // Ensure key field is not null (it's unique and required)
  if (!transformed.key) {
    transformed.key = `setting_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
```

**Key Features:**
- Parses JSON fields (`options`, `validation`) from strings
- Ensures `key` field (UNIQUE constraint) is never null
- Graceful fallback if JSON parsing fails

#### Updated `tablesWithFKConstraints` List
Added `website_settings` to tables with foreign key constraints:
```typescript
const tablesWithFKConstraints = [
  // ... other tables ...
  // Website settings with FK to users
  'website_settings',
];
```
- Uses smaller batch sizes (100 records) for safer insertion
- Respects foreign key relationships with `createdBy` and `updatedBy` fields

#### Updated `buildRestorationOrder()` Function
Added `website_settings` in correct dependency order:
```typescript
return [
  // Core users & auth
  'users', 'auth_methods', 'user_sessions', 'verification_tokens',
  // Audit logs
  'audit_logs',
  // Website settings (depends on users for createdBy/updatedBy FK)
  'website_settings',
  // ... other tables ...
];
```
- Positioned after `users` since it has FK constraints to the users table
- Ensures proper restoration order to avoid constraint violations

## WebsiteSetting Model Details

```prisma
model WebsiteSetting {
  id          String          @id @default(uuid())
  key         String          @unique
  value       String?         @db.Text
  type        SettingType     @default(TEXT)
  category    SettingCategory @default(GENERAL)
  label       String
  description String?         @db.Text
  group       String?
  order       Int             @default(0)
  isActive    Boolean         @default(true)
  isPublic    Boolean         @default(true)
  
  // JSON fields - require special handling
  options     Json?
  validation  Json?
  
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  createdBy   String?
  updatedBy   String?
  
  // FK relationships
  creator     User?           @relation("SettingCreator", fields: [createdBy], references: [id], onDelete: SetNull)
  updater     User?           @relation("SettingUpdater", fields: [updatedBy], references: [id], onDelete: SetNull)
  
  @@map("website_settings")
}
```

## Benefits

✅ **Automatic Inclusion**: `website_settings` always included in backups  
✅ **JSON Handling**: Proper serialization/deserialization of JSON fields  
✅ **Constraint Safety**: Small batches respect FK constraints  
✅ **Dependency Order**: Restores after users table  
✅ **Error Resilience**: Graceful handling of malformed JSON data  
✅ **Unique Key Protection**: Ensures unique `key` field is never null  

## Usage

### Backup
```bash
# Run from /mnt/chikiet/kataoffical/shoprausach/backend
bun run prisma/backup.ts
```

### Restore
```bash
# Run from /mnt/chikiet/kataoffical/shoprausach/backend
bun run prisma/restore.ts
```

Both scripts now automatically handle the `website_settings` table with proper transformations and ordering.

## Testing Checklist

- [ ] Backup completes and includes `website_settings` table
- [ ] Backup JSON file has correct structure with JSON fields
- [ ] Restore completes without FK constraint errors
- [ ] All website settings are restored with correct values
- [ ] JSON fields (`options`, `validation`) are properly parsed
- [ ] No duplicate key constraint violations
- [ ] `createdBy` and `updatedBy` FK relationships preserved

## Files Modified

1. `/mnt/chikiet/kataoffical/shoprausach/backend/prisma/backup.ts`
2. `/mnt/chikiet/kataoffical/shoprausach/backend/prisma/restore.ts`
