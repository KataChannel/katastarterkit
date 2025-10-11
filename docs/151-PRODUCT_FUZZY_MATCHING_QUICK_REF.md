# 🚀 Product Fuzzy Matching - Quick Reference

## ⚡ Quick Commands

```bash
# Test setup (verify pg_trgm works)
node backend/scripts/test-fuzzy-matching.js

# Preview normalization (safe, no changes)
node backend/scripts/normalize-products.js --dry-run --limit=10

# Run normalization (full)
node backend/scripts/normalize-products.js

# Sync with auto-normalize
node backend/scripts/updatesanpham.js
```

## 📊 Key Concepts

**ten** = Original name (raw)  
**ten2** = Normalized name (canonical)

Example:
```
ten: "main asus i7"      → ten2: "Main Asus I7"
ten: "asus i7 main"      → ten2: "Main Asus I7" (same group)
ten: "bo mạch asus i7"   → ten2: "Main Asus I7" (same group)
```

## 🎯 Similarity Thresholds

| Value | Behavior |
|-------|----------|
| 0.3-0.4 | Very loose (many matches) |
| **0.6** | **Recommended (default)** ✅ |
| 0.7-0.8 | Strict (few matches) |

## 📝 GraphQL Examples

```graphql
# Find similar products
query {
  findSimilarProducts(searchText: "main asus", threshold: 0.6) {
    ten
    ten2
    similarityScore
  }
}

# Normalize all products
mutation {
  normalizeProducts(threshold: 0.6) {
    updated
    skipped
    errors
  }
}

# Get product groups
query {
  getProductGroups(minGroupSize: 2) {
    ten2
    count
  }
}
```

## 🔧 TypeScript API

```typescript
// Inject service
constructor(
  private normalizationService: ProductNormalizationService
) {}

// Find similar
const similar = await this.normalizationService
  .findSimilarProducts('product name', 0.6);

// Normalize
const normalized = await this.normalizationService
  .normalizeProductName('product name', 0.6);

// Get groups
const groups = await this.normalizationService
  .getProductGroups(2);
```

## 📊 SQL Queries

```sql
-- Check normalized products
SELECT ten2, COUNT(*) 
FROM ext_sanphamhoadon 
WHERE ten2 IS NOT NULL
GROUP BY ten2
ORDER BY COUNT(*) DESC
LIMIT 20;

-- Find products without ten2
SELECT COUNT(*) 
FROM ext_sanphamhoadon 
WHERE ten IS NOT NULL AND ten2 IS NULL;

-- Test similarity
SELECT similarity('main asus i7', 'asus i7 main');
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `product-normalization.service.ts` | Main service (8 methods) |
| `product-normalization.resolver.ts` | GraphQL API |
| `normalize-products.js` | Batch normalize script |
| `updatesanpham.js` | Sync with auto-normalize |
| `test-fuzzy-matching.js` | Test suite |

## 📚 Documentation

- **Full Guide:** `PRODUCT_NORMALIZATION_GUIDE.md`
- **Summary:** `PRODUCT_FUZZY_MATCHING_COMPLETE.md`
- **This Card:** `PRODUCT_FUZZY_MATCHING_QUICK_REF.md`
- **GraphQL Examples:** `backend/PRODUCT_NORMALIZATION_QUERIES.graphql`

## ⚠️ Important Notes

1. **Always test with --dry-run first**
2. **Default threshold 0.6 is recommended**
3. **First normalization takes ~2h for 16k products**
4. **Use off-hours for large batches**
5. **GIN index required for performance**

## ✅ Checklist

- [ ] Run test script to verify setup
- [ ] Test with --dry-run --limit=10
- [ ] Review sample results
- [ ] Adjust threshold if needed
- [ ] Run full normalization
- [ ] Verify results in database
- [ ] Enable auto-normalize in sync

---

**Status:** ✅ Ready  
**Version:** 1.0
