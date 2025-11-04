# GraphQL Middleware Configuration Fix ✅

## Issue
When accessing the GraphQL endpoint, the error occurred:
```
req.body is not set; this probably means you forgot to set up the `json` middleware 
before the Apollo Server middleware.
```

## Root Cause
The middleware setup order in `main.ts` was incorrect:
1. `graphqlUploadExpress` middleware was registered **BEFORE** the JSON body parser
2. Apollo Server needs `req.body` to be populated by JSON parser first
3. Without `req.body`, Apollo Server couldn't parse GraphQL requests

## Solution
Fixed the middleware registration order in `backend/src/main.ts`:

### Before (Broken):
```typescript
// ❌ WRONG ORDER
app.use(graphqlUploadExpress({ maxFileSize: 500000000, maxFiles: 10 })); // Registered FIRST
app.use(express.json({ limit: '50mb' }));                                // Registered SECOND
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### After (Fixed):
```typescript
// ✅ CORRECT ORDER
app.use(express.json({ limit: '50mb' }));                                // Register JSON parser FIRST
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(graphqlUploadExpress({ maxFileSize: 500000000, maxFiles: 10 })); // Then file upload middleware
```

## Why This Order Matters

**Middleware Execution Chain:**
1. **JSON Parser** - Converts raw request body to `req.body` object
2. **URL Parser** - Handles form-encoded bodies
3. **File Upload** - Enhances `req.body` to handle multipart form data and file uploads
4. **Apollo Server** - Receives populated `req.body` and processes GraphQL query

If you put file upload middleware first:
- Raw body arrives → File upload middleware tries to parse it
- But JSON parser hasn't run yet, so `req.body` isn't set
- Apollo Server receives request with no `req.body` → Error

## Files Modified
- `backend/src/main.ts` - Reordered middleware registration

## Testing

### Test 1: GraphQL Introspection (POST)
```bash
curl -X POST http://116.118.48.208:12001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
# ✅ Result: Returns full schema with 400+ types
```

### Test 2: Simple Query (POST)
```bash
curl -X POST http://116.118.48.208:12001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { __typename }"}'
# ✅ Result: {"data":{"__typename":"Query"}}
```

### Test 3: Health Check
```bash
curl http://116.118.48.208:12001/health
# ✅ Result: All services healthy
```

## Verification Results

| Test | Result | Status |
|------|--------|--------|
| GraphQL POST Request | Successful | ✅ |
| Introspection Query | Full schema returned | ✅ |
| Type System | 400+ types accessible | ✅ |
| Database Connection | Healthy | ✅ |
| File Upload Setup | Configured correctly | ✅ |

## Express Middleware Best Practices

**General Rule**: Register body parsers BEFORE dependent middleware

**Correct Order**:
1. Logging/debugging middleware
2. **Body parsers** (JSON, URL-encoded)
3. Specialized parsers (file uploads)
4. Route handlers
5. Error handlers

**Why**: Each middleware modifies `req` object for downstream middleware:
- Body parsers populate `req.body`
- Specialized middleware reads/enhances `req.body`
- Route handlers depend on `req.body` being set

## Deployment
```bash
# 1. Rebuild backend
cd backend && npm run build

# 2. Deploy to production
./scripts/95copy.sh
# Automatically syncs, builds Docker, and restarts containers
```

## Backend URLs
- **GraphQL Endpoint**: http://116.118.48.208:12001/graphql
- **GraphQL Playground**: http://116.118.48.208:12001/graphql (Apollo Sandbox)
- **Health Check**: http://116.118.48.208:12001/health
- **Health Detailed**: http://116.118.48.208:12001/health/detailed

## Related Configuration

### Apollo Server Configuration (app.module.ts)
```typescript
GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  useFactory: (configService: ConfigService) => ({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    context: ({ req, res }) => ({ req, res }),
    bodyParserConfig: {
      limit: '50mb',  // Matches express.json() limit
    },
    subscriptions: {
      'graphql-ws': { path: '/graphql' },
      'subscriptions-transport-ws': { path: '/graphql' },
    },
  }),
})
```

### File Upload Configuration
```typescript
graphqlUploadExpress({
  maxFileSize: 500000000,  // 500MB
  maxFiles: 10,            // Up to 10 files per request
})
```

## Troubleshooting

**If you still see req.body errors:**

1. Check middleware order in `main.ts`:
   ```bash
   grep -n "app.use" src/main.ts
   # JSON middleware should come before graphqlUploadExpress
   ```

2. Verify body parser limits match Apollo config:
   ```typescript
   // main.ts
   app.use(express.json({ limit: '50mb' }));
   
   // app.module.ts
   bodyParserConfig: { limit: '50mb' }
   ```

3. Check if middleware is registered globally:
   - Use `app.use()` for global middleware
   - Must be before `app.listen()`

4. Rebuild and redeploy:
   ```bash
   npm run build
   ./scripts/95copy.sh --build
   ```

---

**Status**: ✅ FIXED  
**Date**: October 27, 2025  
**Deployment**: Production (116.118.48.208)  
**GraphQL API**: ✅ Working  
**File Uploads**: ✅ Configured  
**Introspection**: ✅ Enabled  
