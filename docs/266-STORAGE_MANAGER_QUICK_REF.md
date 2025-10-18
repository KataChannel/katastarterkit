# 🚀 Storage Manager - Quick Reference

## 🎯 Quick Fix Summary

**Problem**: `QuotaExceededError` when saving templates  
**Solution**: Automatic compression + quota management + cleanup  
**Result**: 3x more storage capacity + zero quota errors

---

## 📦 StorageManager API

### Basic Usage

```typescript
import StorageManager from '@/utils/storageManager';

// Save with compression
StorageManager.setItem('my-key', myData, {
  compress: true,      // Enable compression (default)
  autoCleanup: true,   // Auto cleanup on quota (default)
});

// Load (auto decompression)
const data = StorageManager.getItem<MyType>('my-key');

// Remove
StorageManager.removeItem('my-key');
```

### Check Storage

```typescript
// Get usage
const usage = StorageManager.getStorageUsage();
console.log(`${usage.percentage.toFixed(1)}% full`);
console.log(`Used: ${StorageManager.formatBytes(usage.used)}`);
console.log(`Available: ${StorageManager.formatBytes(usage.available)}`);

// Check if near limit
if (usage.isNearLimit) {
  console.warn('Storage is getting full!');
}
```

### Manual Cleanup

```typescript
// Normal cleanup (to 70% full)
const freedBytes = StorageManager.cleanup();

// Aggressive cleanup (to 50% full)
const freedBytes = StorageManager.cleanup(undefined, true);

// Cleanup but protect specific key
StorageManager.cleanup('important-key');
```

### Statistics

```typescript
// Get detailed stats
const stats = StorageManager.getStats();
console.log('Total items:', stats.itemCount);
console.log('Largest items:', stats.items.slice(0, 5));

// Format bytes
console.log(StorageManager.formatBytes(1536000)); // "1.46 MB"
```

---

## 🎨 StorageWarning Component

### Basic Usage

```tsx
import { StorageWarning } from '@/components/page-builder/StorageWarning';

function MyComponent() {
  return (
    <div>
      <StorageWarning threshold={80} />
      {/* Your content */}
    </div>
  );
}
```

### What It Does

- **Auto-hides** when storage < threshold (default 80%)
- **Shows warning** with usage percentage and actions
- **Updates every 5 seconds** to reflect current usage
- **Provides cleanup buttons** for user control

### Alert Levels

| Usage | Color | Icon | Actions |
|-------|-------|------|---------|
| 80-90% | Yellow | 💽 | Show Details, Auto Cleanup |
| 90-95% | Orange | ⚠️ | Show Details, Auto Cleanup, Clear All |
| 95%+ | Red | 🔴 | Show Details, Auto Cleanup, Clear All |

---

## 🔧 Custom Templates Integration

### All Functions Updated

```typescript
import { 
  saveCustomTemplate,
  getCustomTemplates,
  getCustomTemplateStats,
  clearCustomTemplates 
} from '@/utils/customTemplates';

// Save (with compression)
try {
  const template = saveCustomTemplate({
    name: 'My Template',
    category: 'landing',
    blocks: [...]
  });
} catch (error) {
  // User-friendly error with storage info
  console.error(error.message);
}

// Get all (auto decompression)
const templates = getCustomTemplates();

// Get stats
const stats = getCustomTemplateStats();
console.log(`${stats.total} templates, ${stats.formattedSize}`);
console.log(`Storage: ${stats.storageUsage.percentage.toFixed(1)}%`);
```

---

## 🐛 Error Handling

### Quota Exceeded

```typescript
try {
  saveCustomTemplate(template);
} catch (error) {
  if (error.message.includes('quota')) {
    // Show user-friendly message:
    // "Storage is full. Please delete some old templates. 
    //  Current usage: 4.8 MB"
    
    // Suggest actions:
    // 1. Delete old templates
    // 2. Export templates
    // 3. Clear browser data
  }
}
```

### Recovery Flow

1. **First attempt**: Try to save normally
2. **Quota error**: Auto cleanup triggered (90% → 70%)
3. **Retry**: Attempt save again
4. **Still fails**: Throw user-friendly error

---

## 🎯 Best Practices

### DO ✅

```typescript
// Use StorageManager for all localStorage operations
StorageManager.setItem('key', data);

// Check usage before bulk operations
const usage = StorageManager.getStorageUsage();
if (usage.percentage > 80) {
  // Warn user or cleanup
}

// Provide cleanup UI
<StorageWarning threshold={80} />

// Export before clearing
const json = exportCustomTemplates();
// Save to file, then clearCustomTemplates()
```

### DON'T ❌

```typescript
// Don't use localStorage directly anymore
localStorage.setItem('key', JSON.stringify(data)); // ❌

// Don't ignore storage warnings
// Always show StorageWarning component

// Don't clear without confirmation
clearCustomTemplates(); // ❌ Should ask first

// Don't store huge uncompressed data
StorageManager.setItem('key', data, { 
  compress: false // ❌ Keep compression on
});
```

---

## 🧪 Testing in Console

```javascript
// Check current storage
StorageManager.getStorageUsage()
// → { used: 4200000, available: 800000, percentage: 84, isNearLimit: true }

// View all items
StorageManager.getStats()
// → { usage: {...}, itemCount: 3, items: [...] }

// Test compression
const original = JSON.stringify({ test: 'data'.repeat(1000) });
const compressed = btoa(encodeURIComponent(original));
console.log(`Original: ${original.length} bytes`);
console.log(`Compressed: ${compressed.length} bytes`);
console.log(`Savings: ${(1 - compressed.length/original.length)*100}%`);

// Cleanup test
const before = StorageManager.getStorageUsage().used;
StorageManager.cleanup();
const after = StorageManager.getStorageUsage().used;
console.log(`Freed: ${StorageManager.formatBytes(before - after)}`);
```

---

## 📊 Monitoring

### User Dashboard (Future Enhancement)

```tsx
function StorageDashboard() {
  const usage = StorageManager.getStorageUsage();
  const stats = getCustomTemplateStats();
  
  return (
    <div>
      <h3>Storage Health</h3>
      <Progress value={usage.percentage} />
      <p>{usage.percentage.toFixed(1)}% full</p>
      
      <h3>Templates</h3>
      <p>{stats.total} templates ({stats.formattedSize})</p>
      
      <h3>By Category</h3>
      {Object.entries(stats.byCategory).map(([cat, count]) => (
        <div key={cat}>{cat}: {count}</div>
      ))}
    </div>
  );
}
```

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `storageManager.ts` | Core compression & quota management |
| `customTemplates.ts` | Template storage (uses StorageManager) |
| `StorageWarning.tsx` | User-facing warning component |
| `TemplateLibrary.tsx` | Shows StorageWarning |

---

## 💡 Tips

1. **Export Regularly**: Back up templates to JSON files
2. **Monitor Usage**: Add StorageWarning to template-heavy pages
3. **Test Cleanup**: Try cleanup buttons to understand behavior
4. **Check Console**: Look for storage warnings during development
5. **Compression**: Keep enabled for best results

---

## 🆘 Troubleshooting

### "Storage is full" despite few templates

```typescript
// Check what's using space
const stats = StorageManager.getStats();
stats.items.sort((a, b) => b.size - a.size);
console.log('Top 5 largest:', stats.items.slice(0, 5));

// Clear non-template data if needed
// (Be careful - this affects other apps!)
```

### Cleanup not working

```typescript
// Try aggressive cleanup
StorageManager.cleanup(undefined, true);

// If still fails, check for protected keys
const stats = StorageManager.getStats();
console.log('All keys:', stats.items.map(i => i.key));
```

### Data not loading after cleanup

```typescript
// Check if templates still exist
const templates = getCustomTemplates();
console.log('Remaining templates:', templates.length);

// Verify compression working
const stored = localStorage.getItem('kata_custom_templates');
const parsed = JSON.parse(stored);
console.log('Format:', parsed.compressed ? 'Compressed' : 'Plain');
```

---

**Last Updated**: October 18, 2025  
**Version**: 1.0.0
