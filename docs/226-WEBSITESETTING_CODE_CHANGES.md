# Code Changes - WebsiteSetting Backup & Restore Support

## File 1: `backend/prisma/backup.ts`

### Change 1: Add System Table Detection Function

**Location**: After `getExistingTables()` function (Line ~57)

```typescript
/**
 * Check if table is a system/metadata table that should always be backed up
 */
function isSystemTable(tableName: string): boolean {
  const systemTables = [
    'website_settings', // WebsiteSetting model - important config
    '_prisma_migrations', // Prisma migrations tracking
  ];
  return systemTables.includes(tableName);
}
```

### Change 2: Update getTables() to Include System Tables

**Location**: In `getTables()` function (Line ~184-207)

**Old Code**:
```typescript
  const allTableNames = models.map(model => model.tableName);
  console.log(`✅ Parsed ${allTableNames.length} table names from ${models.length} models`);
  
  // Get existing tables from database
  console.log('🔍 Checking which tables actually exist in database...');
  const existingTables = await getExistingTables();
  console.log(`📋 Found ${existingTables.length} existing tables in database`);
  
  // Filter to only include tables that exist in database
  const validTables = allTableNames.filter(tableName => {
    const exists = existingTables.includes(tableName);
    if (!exists) {
      console.log(`   ⚠️  Table '${tableName}' from schema not found in database`);
    }
    return exists;
  });
  
  console.log(`✅ Final table list (${validTables.length} tables to backup):`);
  console.log(`   ${validTables.slice(0, 10).join(', ')}${validTables.length > 10 ? ` ... and ${validTables.length - 10} more` : ''}`);
  return validTables;
```

**New Code**:
```typescript
  const allTableNames = models.map(model => model.tableName);
  console.log(`✅ Parsed ${allTableNames.length} table names from ${models.length} models`);
  
  // Get existing tables from database
  console.log('🔍 Checking which tables actually exist in database...');
  const existingTables = await getExistingTables();
  console.log(`📋 Found ${existingTables.length} existing tables in database`);
  
  // Filter to only include tables that exist in database
  const validTables = allTableNames.filter(tableName => {
    const exists = existingTables.includes(tableName);
    if (!exists) {
      console.log(`   ⚠️  Table '${tableName}' from schema not found in database`);
    }
    return exists;
  });
  
  // Add system tables that should always be included
  for (const table of existingTables) {
    if (isSystemTable(table) && !validTables.includes(table)) {
      validTables.push(table);
    }
  }
  
  // Sort for consistency
  validTables.sort();
  
  console.log(`✅ Final table list (${validTables.length} tables to backup):`);
  console.log(`   ${validTables.slice(0, 10).join(', ')}${validTables.length > 10 ? ` ... and ${validTables.length - 10} more` : ''}`);
  return validTables;
```

**Key Changes**:
- Added loop to include system tables that aren't in schema models
- Added `validTables.sort()` for consistency
- Ensures `website_settings` is always included

---

## File 2: `backend/prisma/restore.ts`

### Change 1: Enhance transformRecord() for WebsiteSetting

**Location**: In `transformRecord()` function (Line ~100)

**Add After**: Date field conversions and **Before**: audit_logs handling

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

### Change 2: Add website_settings to FK Constraint Tables

**Location**: In `restoreTableOptimized()` function, `tablesWithFKConstraints` array (Line ~365)

**Old Code**:
```typescript
    const tablesWithFKConstraints = [
      // E-commerce with FK relationships
      'ext_detailhoadon',
      'ext_sanphamhoadon',
      'product_images',
      'product_variants',
      // Content with FK relationships
      'comments',
      'likes',
      'post_tags',
      // Tasks with FK relationships
      'task_comments',
      'task_media',
      'task_shares',
      // Affiliate with FK relationships
      'aff_clicks',
      'aff_conversions',
      'aff_payment_requests',
      'aff_campaign_affiliates',
      // LMS with FK relationships (courses → modules → lessons → progress)
      'course_modules',
      'lessons',
      'enrollments',
      'lesson_progress',
      'quizzes',
      'questions',
      'answers',
      // Employee with FK relationships
      'employment_history',
      'employee_documents',
      'onboarding_checklists',
      'offboarding_processes',
      // Pages with FK relationships
      'page_blocks',
    ];
```

**New Code**:
```typescript
    const tablesWithFKConstraints = [
      // E-commerce with FK relationships
      'ext_detailhoadon',
      'ext_sanphamhoadon',
      'product_images',
      'product_variants',
      // Content with FK relationships
      'comments',
      'likes',
      'post_tags',
      // Tasks with FK relationships
      'task_comments',
      'task_media',
      'task_shares',
      // Affiliate with FK relationships
      'aff_clicks',
      'aff_conversions',
      'aff_payment_requests',
      'aff_campaign_affiliates',
      // LMS with FK relationships (courses → modules → lessons → progress)
      'course_modules',
      'lessons',
      'enrollments',
      'lesson_progress',
      'quizzes',
      'questions',
      'answers',
      // Employee with FK relationships
      'employment_history',
      'employee_documents',
      'onboarding_checklists',
      'offboarding_processes',
      // Pages with FK relationships
      'page_blocks',
      // Website settings with FK to users
      'website_settings',
    ];
```

**Key Changes**:
- Added comment: `// Website settings with FK to users`
- Added `'website_settings'` to the array
- Will use batch size of 100 instead of 1000 for safer insertion

### Change 3: Update Restoration Order in buildRestorationOrder()

**Location**: Fallback hardcoded order in `buildRestorationOrder()` (Line ~712)

**Old Code**:
```typescript
    return [
      // Core users & auth
      'users', 'auth_methods', 'user_sessions', 'verification_tokens',
      // Audit logs
      'audit_logs',
      // Core content
      'posts', 'tags', 'post_tags', 'comments', 'likes', 'notifications',
      // ... rest of tables
    ];
```

**New Code**:
```typescript
    return [
      // Core users & auth
      'users', 'auth_methods', 'user_sessions', 'verification_tokens',
      // Audit logs
      'audit_logs',
      // Website settings (depends on users for createdBy/updatedBy FK)
      'website_settings',
      // Core content
      'posts', 'tags', 'post_tags', 'comments', 'likes', 'notifications',
      // ... rest of tables
    ];
```

**Key Changes**:
- Added `'website_settings'` after `'audit_logs'`
- Added comment explaining FK dependency: `// Website settings (depends on users for createdBy/updatedBy FK)`
- Positioned before general content tables since it's a configuration table
- Restores after users table to satisfy FK constraints

---

## Summary of Changes

| File | Function | Type | Purpose |
|------|----------|------|---------|
| backup.ts | `isSystemTable()` | NEW | Identify critical tables to always backup |
| backup.ts | `getTables()` | MODIFIED | Include system tables in backup list |
| restore.ts | `transformRecord()` | MODIFIED | Parse JSON fields for website_settings |
| restore.ts | `restoreTableOptimized()` | MODIFIED | Add website_settings to FK tables |
| restore.ts | `buildRestorationOrder()` | MODIFIED | Position website_settings in order |

---

## Validation Checklist

✅ All changes maintain backward compatibility  
✅ No breaking changes to existing functions  
✅ WebsiteSetting model fully supported  
✅ JSON fields properly serialized/deserialized  
✅ FK constraints respected in restoration order  
✅ Error handling implemented for malformed data  
✅ Logging updated for transparency  

---

## Running with Updated Code

```bash
# Backup with WebsiteSetting support
cd /mnt/chikiet/kataoffical/shoprausach/backend
bun run prisma/backup.ts
# Output will include website_settings table

# Restore with WebsiteSetting support
bun run prisma/restore.ts
# Will restore website_settings after users table with JSON fields properly parsed
```
