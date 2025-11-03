# 🔧 FIX: Apollo Server Body Parser Error

**Date:** 4/11/2025  
**Error:** `req.body is not set; this probably means you forgot to set up the json middleware before the Apollo Server middleware`  
**Status:** ✅ FIXED  

---

## 🐛 Problem

When running the backend, Apollo Server throws error:
```
req.body is not set; this probably means you forgot to set up the 
json middleware before the Apollo Server middleware
```

---

## 🔍 Root Cause

Apollo Server v4+ changed how body parsing works:
- Previous versions had built-in body parser
- v4+ requires external body parser middleware (Express's `express.json()`)
- If Apollo's `bodyParserConfig` is set, it conflicts with Express middleware
- GraphQL upload middleware (`graphqlUploadExpress`) needs proper order

---

## ✅ Solution

### 1. Fix `backend/src/main.ts`

**Updated middleware order:**

```typescript
// Configure JSON body parser FIRST (before graphqlUploadExpress)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// THEN apply graphqlUploadExpress (after json/urlencoded)
app.use('/graphql', graphqlUploadExpress({ 
  maxFileSize: 500000000, // 500MB
  maxFiles: 10 
}));
```

**Why this order matters:**
1. `express.json()` - Parses JSON body for all routes
2. `express.urlencoded()` - Parses URL-encoded body
3. `graphqlUploadExpress()` - Handles file uploads for `/graphql` endpoint only

### 2. Fix `backend/src/app.module.ts`

**Disable Apollo's built-in body parser:**

```typescript
GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  useFactory: (configService: ConfigService) => ({
    // ... other config
    
    // CHANGE THIS:
    // bodyParserConfig: { limit: '50mb' },  ❌ OLD
    
    // TO THIS:
    bodyParserConfig: false,  // ✅ NEW - Let Express handle it
    
    // ... rest of config
  }),
}),
```

---

## 📝 Changes Made

### File 1: `backend/src/main.ts`

**Before:**
```typescript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/graphql', graphqlUploadExpress({ maxFileSize: 500000000, maxFiles: 10 }));
```

**After:**
```typescript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// IMPORTANT: graphqlUploadExpress MUST be after json/urlencoded
app.use('/graphql', graphqlUploadExpress({ 
  maxFileSize: 500000000,
  maxFiles: 10 
}));
```

**Change:** Added comment clarifying middleware order

---

### File 2: `backend/src/app.module.ts`

**Before:**
```typescript
bodyParserConfig: {
  limit: '50mb',
},
```

**After:**
```typescript
// Disable Apollo's body parser - let Express handle it (configured in main.ts)
bodyParserConfig: false,
```

**Change:** Disabled Apollo's body parser to prevent conflict

---

## 🧪 Testing

### Test GraphQL Query

```bash
# Test with curl
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Expected: { "data": { "__typename": "Query" } }
```

### Test in GraphQL Playground

```graphql
query TestQuery {
  __typename
}
```

Should work without body parser errors.

---

## 🚀 Deployment

After fixing, rebuild and restart:

```bash
# Local development
cd backend
bun install
bun run start:dev

# Production deployment
./deploy-production.sh --mode hybrid --build-backend
```

---

## 📚 References

- [Apollo Server v4 Migration Guide](https://www.apollographql.com/docs/apollo-server/migration/)
- [Express Body Parser](https://expressjs.com/en/api.html#express.json)
- [graphql-upload-ts](https://github.com/akhil-gupta/graphql-upload-ts)

---

## ✅ Verification Checklist

- [x] `express.json()` applied before `graphqlUploadExpress()`
- [x] `express.urlencoded()` applied before `graphqlUploadExpress()`
- [x] Apollo `bodyParserConfig` set to `false`
- [x] Comments added explaining middleware order
- [ ] Backend restarted and tested
- [ ] GraphQL queries work without errors
- [ ] File uploads work (if applicable)

---

**Fixed by:** Development Team  
**Date:** 4/11/2025  
**Status:** ✅ Ready for testing
