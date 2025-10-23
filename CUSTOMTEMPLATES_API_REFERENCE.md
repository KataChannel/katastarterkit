# Custom Templates API Reference

**Unified Module:** `@/utils/customTemplates`

## Quick Start

### Using Service Class (Recommended)
```typescript
import { CustomTemplatesService } from '@/utils/customTemplates';

const service = new CustomTemplatesService(apolloClient);

// Get templates
const templates = await service.getMyTemplates();
const template = await service.getTemplate(templateId);

// Create
const created = await service.createTemplate({
  name: 'My Template',
  description: 'Description',
  category: 'hero',
  blocks: []
});

// Update
await service.updateTemplate(id, { name: 'New Name' });

// Delete
await service.deleteTemplate(id);

// Advanced operations
await service.duplicateTemplate(id, 'Copy of Template');
await service.shareTemplate(id, ['user1', 'user2']);
await service.unshareTemplate(id, 'user1');
await service.updatePublicity(id, true); // Make public
await service.trackUsage(id);
```

### Using Convenience Functions (Legacy)
```typescript
import {
  getCustomTemplates,
  saveCustomTemplate,
  updateCustomTemplate,
  deleteCustomTemplate,
  duplicateCustomTemplate,
} from '@/utils/customTemplates';

const templates = await getCustomTemplates();
const template = await saveCustomTemplate({...});
await updateCustomTemplate(id, {...});
await deleteCustomTemplate(id);
await duplicateCustomTemplate(id, 'New Name');
```

### Low-Level Database Operations
```typescript
import {
  getCustomTemplatesFromDB,
  getCustomTemplateFromDB,
  saveCustomTemplateToDB,
  updateCustomTemplateInDB,
  deleteCustomTemplateFromDB,
  getCustomTemplateStatsFromDB,
} from '@/utils/customTemplates';

const templates = await getCustomTemplatesFromDB(client, userId);
const stats = await getCustomTemplateStatsFromDB(client, userId);
```

## Types

### CustomTemplate
```typescript
interface CustomTemplate extends BlockTemplate {
  isCustom: true;
  createdAt: string;
  updatedAt: string;
}
```

### TemplateBlocksData
```typescript
interface TemplateBlocksData {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: PageBlock[];
  thumbnail?: string;
  isPublic: boolean;
  isArchived: boolean;
  usageCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

### CreateTemplateInput
```typescript
interface CreateTemplateInput {
  name: string;
  description: string;
  category: string;
  blocks: PageBlock[];
  thumbnail?: string;
}
```

### UpdateTemplateInput
```typescript
interface UpdateTemplateInput {
  name?: string;
  description?: string;
  category?: string;
  blocks?: PageBlock[];
  thumbnail?: string;
  isArchived?: boolean;
}
```

### TemplateStats
```typescript
interface TemplateStats {
  total: number;
  byCategory: Record<string, number>;
  formattedSize?: string;
}
```

## Service Methods

### getMyTemplates()
Get all custom templates for current user with optional filtering.

```typescript
async getMyTemplates(category?: string, archived?: boolean): Promise<TemplateBlocksData[]>
```

**Parameters:**
- `category` (optional) - Filter by category
- `archived` (optional) - Filter by archive status

**Returns:** Array of templates

**Example:**
```typescript
const heroTemplates = await service.getMyTemplates('hero', false);
```

### getTemplate()
Get a single template by ID with all metadata.

```typescript
async getTemplate(id: string): Promise<TemplateBlocksData | null>
```

**Parameters:**
- `id` - Template ID

**Returns:** Template object or null

**Example:**
```typescript
const template = await service.getTemplate('template-123');
```

### createTemplate()
Create a new custom template.

```typescript
async createTemplate(input: CreateTemplateInput): Promise<TemplateBlocksData>
```

**Parameters:**
- `input` - Template data

**Returns:** Created template with ID and timestamps

**Example:**
```typescript
const template = await service.createTemplate({
  name: 'Hero Section',
  description: 'Hero template',
  category: 'hero',
  blocks: [...]
});
```

### updateTemplate()
Update an existing template.

```typescript
async updateTemplate(id: string, input: UpdateTemplateInput): Promise<TemplateBlocksData>
```

**Parameters:**
- `id` - Template ID
- `input` - Fields to update

**Returns:** Updated template

**Example:**
```typescript
await service.updateTemplate(id, {
  name: 'New Name',
  description: 'Updated description'
});
```

### deleteTemplate()
Delete a template.

```typescript
async deleteTemplate(id: string): Promise<boolean>
```

**Parameters:**
- `id` - Template ID

**Returns:** Success status

**Example:**
```typescript
const deleted = await service.deleteTemplate(templateId);
```

### duplicateTemplate()
Create a copy of a template.

```typescript
async duplicateTemplate(id: string, newName?: string): Promise<TemplateBlocksData>
```

**Parameters:**
- `id` - Template ID to duplicate
- `newName` (optional) - Name for the copy

**Returns:** New template

**Example:**
```typescript
const copy = await service.duplicateTemplate(id, 'Copy of Template');
```

### shareTemplate()
Share template with other users.

```typescript
async shareTemplate(templateId: string, userIds: string[]): Promise<any>
```

**Parameters:**
- `templateId` - Template ID
- `userIds` - Array of user IDs to share with

**Returns:** Share result

**Example:**
```typescript
await service.shareTemplate(id, ['user1', 'user2', 'user3']);
```

### unshareTemplate()
Remove sharing from a user.

```typescript
async unshareTemplate(templateId: string, userId: string): Promise<boolean>
```

**Parameters:**
- `templateId` - Template ID
- `userId` - User to unshare from

**Returns:** Success status

**Example:**
```typescript
await service.unshareTemplate(id, 'user1');
```

### updatePublicity()
Make template public or private.

```typescript
async updatePublicity(id: string, isPublic: boolean): Promise<TemplateBlocksData>
```

**Parameters:**
- `id` - Template ID
- `isPublic` - Public status

**Returns:** Updated template

**Example:**
```typescript
await service.updatePublicity(id, true); // Make public
```

### trackUsage()
Increment template usage counter.

```typescript
async trackUsage(id: string): Promise<number>
```

**Parameters:**
- `id` - Template ID

**Returns:** New usage count

**Example:**
```typescript
const usageCount = await service.trackUsage(id);
```

## Utility Functions

### formatBytes()
Convert bytes to human-readable format.

```typescript
function formatBytes(bytes: number): string
```

**Example:**
```typescript
formatBytes(1024 * 1024) // "1 MB"
```

### validateTemplate()
Validate template data.

```typescript
function validateTemplate(template: Partial<BlockTemplate>): boolean
```

**Example:**
```typescript
if (validateTemplate(template)) {
  // Template is valid
}
```

### createTemplateSummary()
Get comprehensive summary of templates.

```typescript
function createTemplateSummary(templates: CustomTemplate[]): {
  count: number;
  categories: Record<string, number>;
  approximateSize: string;
}
```

**Example:**
```typescript
const summary = createTemplateSummary(templates);
console.log(`${summary.count} templates, ${summary.approximateSize} total`);
```

## Legacy Functions (Deprecated)

⚠️ These functions are maintained for backward compatibility but should not be used in new code.

```typescript
// LocalStorage based (deprecated)
getCustomTemplateStats(): TemplateStats
clearCustomTemplates(): void

// Service initialization (deprecated)
initCustomTemplatesService(client: ApolloClient): void
getService(): CustomTemplatesService

// Convenience functions (deprecated)
getCustomTemplates(category?, archived?): Promise<TemplateBlocksData[]>
saveCustomTemplate(input: CreateTemplateInput): Promise<TemplateBlocksData>
updateCustomTemplate(id, input): Promise<TemplateBlocksData>
deleteCustomTemplate(id): Promise<boolean>
duplicateCustomTemplate(id, newName?): Promise<TemplateBlocksData>
shareTemplate(templateId, userIds): Promise<any>
unshareTemplate(templateId, userId): Promise<boolean>
updateTemplatePublicity(id, isPublic): Promise<TemplateBlocksData>
incrementTemplateUsage(id): Promise<number>
```

## Error Handling

All functions include error handling with consistent logging prefix:

```typescript
try {
  const templates = await service.getMyTemplates();
} catch (error) {
  console.error('[CustomTemplates] Error fetching templates:', error);
}
```

## Best Practices

1. **Use Service Class for New Code**
   ```typescript
   const service = new CustomTemplatesService(apolloClient);
   // Cleaner, more organized
   ```

2. **Handle Errors Gracefully**
   ```typescript
   try {
     await service.deleteTemplate(id);
   } catch (error) {
     console.error('Failed to delete:', error);
     showErrorNotification();
   }
   ```

3. **Validate Input**
   ```typescript
   if (!validateTemplate(template)) {
     throw new Error('Invalid template');
   }
   const created = await service.createTemplate(template);
   ```

4. **Check for Null**
   ```typescript
   const template = await service.getTemplate(id);
   if (!template) {
     console.log('Template not found');
   }
   ```

5. **Use Appropriate Methods**
   ```typescript
   // Use these for UI operations
   const service = new CustomTemplatesService(client);
   
   // Use these for system-level operations
   await getCustomTemplatesFromDB(client, userId);
   ```

## Migration Guide

### From customTemplatesDb.ts

**Before:**
```typescript
import { CustomTemplatesService } from '@/utils/customTemplatesDb';

const service = new CustomTemplatesService(apolloClient);
```

**After:**
```typescript
import { CustomTemplatesService } from '@/utils/customTemplates';

const service = new CustomTemplatesService(apolloClient);
```

### From Convenience Functions

**Before:**
```typescript
import { saveCustomTemplate } from '@/utils/customTemplatesDb';

const template = await saveCustomTemplate({...});
```

**After (Recommended):**
```typescript
import { CustomTemplatesService } from '@/utils/customTemplates';

const service = new CustomTemplatesService(apolloClient);
const template = await service.createTemplate({...});
```

**Or keep using convenience functions:**
```typescript
import { saveCustomTemplate } from '@/utils/customTemplates';

const template = await saveCustomTemplate({...});
```

## Related Files

- GraphQL Queries: `@/lib/graphql/custom-templates.graphql.ts`
- Sample Templates: `@/utils/initSampleTemplates.ts`
- Component: `@/components/page-builder/contexts/TemplateContext.tsx`
