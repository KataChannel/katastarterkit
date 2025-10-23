# ⚡ Quick Reference - Custom Templates (Database Version)

**Updated**: October 23, 2025  
**Status**: ✅ Ready to Use

---

## 📦 What Changed

**Old**: localStorage-based (client-side)  
**New**: Database-based (server-side via GraphQL)

---

## 🚀 Quick Usage

### 1. Setup (in your component)
```typescript
import { getCustomTemplatesFromDB, saveCustomTemplateToDB } from '@/utils/customTemplates';
import { useApolloClient } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const client = useApolloClient();
  const { user } = useAuth();
  // Now you can use: client, user.id
}
```

### 2. Get All Templates
```typescript
const templates = await getCustomTemplatesFromDB(client, user.id);
```

### 3. Get Single Template
```typescript
const template = await getCustomTemplateFromDB(client, templateId);
```

### 4. Create Template
```typescript
const newTemplate = await saveCustomTemplateToDB(client, {
  name: 'My Template',
  description: 'Description',
  category: 'section',
  blocks: [...],
}, user.id);
```

### 5. Update Template
```typescript
const updated = await updateCustomTemplateInDB(
  client,
  templateId,
  { name: 'New Name' },
  user.id
);
```

### 6. Delete Template
```typescript
const success = await deleteCustomTemplateFromDB(client, templateId, user.id);
```

### 7. Get Statistics
```typescript
const stats = await getCustomTemplateStatsFromDB(client, user.id);
// { total: 5, byCategory: { section: 3, header: 2 } }
```

---

## 🔑 Key Differences

| Feature | Old (localStorage) | New (Database) |
|---------|-------------------|---|
| **Storage** | Browser localStorage | Server database |
| **Async** | Synchronous | Asynchronous ✅ |
| **Requires** | None | Apollo Client + userId |
| **Persistence** | Single browser only | All devices |
| **Size Limit** | 5-10 MB | Unlimited |
| **Offline** | Works | Needs network |
| **Export/Import** | Built-in | Custom solution |

---

## ⚙️ GraphQL Operations

### Available Queries
- `GET_CUSTOM_TEMPLATES(userId)` - Get all user's templates
- `GET_CUSTOM_TEMPLATE(id)` - Get single template

### Available Mutations
- `CREATE_CUSTOM_TEMPLATE(input)` - Create new template
- `UPDATE_CUSTOM_TEMPLATE(id, input)` - Update template
- `DELETE_CUSTOM_TEMPLATE(id)` - Delete template

---

## 💡 Common Patterns

### Load templates on component mount
```typescript
useEffect(() => {
  async function loadTemplates() {
    try {
      const templates = await getCustomTemplatesFromDB(client, user.id);
      setTemplates(templates);
    } catch (error) {
      setError('Failed to load templates');
    }
  }
  
  if (user?.id) {
    loadTemplates();
  }
}, [client, user?.id]);
```

### Create and refresh list
```typescript
const handleCreate = async (templateData) => {
  try {
    await saveCustomTemplateToDB(client, templateData, user.id);
    // Refresh list (Apollo refetchQueries handles this)
    const updated = await getCustomTemplatesFromDB(client, user.id);
    setTemplates(updated);
  } catch (error) {
    console.error('Failed to create template:', error);
  }
};
```

### Delete with confirmation
```typescript
const handleDelete = async (templateId) => {
  if (window.confirm('Delete this template?')) {
    try {
      const success = await deleteCustomTemplateFromDB(client, templateId, user.id);
      if (success) {
        setTemplates(templates.filter(t => t.id !== templateId));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }
};
```

---

## 🔴 What Was Removed

❌ `getCustomTemplates()`  
❌ `saveCustomTemplate()`  
❌ `updateCustomTemplate()`  
❌ `deleteCustomTemplate()`  
❌ `getCustomTemplate()`  
❌ `clearCustomTemplates()`  
❌ `exportCustomTemplates()`  
❌ `importCustomTemplates()`  
❌ `generateCustomTemplateThumbnail()`  
❌ `getCustomTemplateStats()` (old version)  

**All replaced with DB versions** ✅

---

## 📋 Function Signatures

```typescript
// Query functions
getCustomTemplatesFromDB(client: any, userId: string): Promise<CustomTemplate[]>
getCustomTemplateFromDB(client: any, id: string): Promise<CustomTemplate | null>

// Mutation functions
saveCustomTemplateToDB(client: any, template: Omit<BlockTemplate, 'id' | 'thumbnail'>, userId: string): Promise<CustomTemplate | null>
updateCustomTemplateInDB(client: any, id: string, updates: Partial<Omit<BlockTemplate, 'id' | 'thumbnail'>>, userId: string): Promise<CustomTemplate | null>
deleteCustomTemplateFromDB(client: any, id: string, userId: string): Promise<boolean>

// Statistics
getCustomTemplateStatsFromDB(client: any, userId: string): Promise<{ total: number; byCategory: Record<string, number> }>
```

---

## 🎯 Next Steps

1. ✅ Update imports in all components
2. ✅ Add Apollo Client and user context
3. ✅ Use async/await for all calls
4. ✅ Add error handling
5. ✅ Add loading states
6. ✅ Test GraphQL operations
7. ✅ Update backend schema (if not done)

---

## ⚠️ Important Notes

- **All functions are async** - always use `await`
- **Requires userId** - get from `useAuth()` context
- **Requires Apollo Client** - get from `useApolloClient()`
- **No more localStorage** - data lives in database
- **Network required** - won't work offline

---

**Ready to use!** 🚀
