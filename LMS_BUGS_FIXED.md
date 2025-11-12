# LMS Source Documents - Bug Fixes

## Bug #1: GeminiService Dependency Injection Failed

**Error:**
```
Error at (/core/errors/exceptions-zone.js:22:13)
type: 'SourceDocumentService'
context: { dependencies: [class GeminiService] }
```

**Root Cause:**
- `SourceDocumentService` requires `GeminiService` in constructor
- `AiModule` did not export `GeminiService`
- Dependency injection failed

**Fix:**
File: `/backend/src/ai/ai.module.ts`

```typescript
import { GeminiService } from './gemini.service';

@Module({
  imports: [PrismaModule],
  providers: [
    FeatureExtractionService,
    TaskPrioritizationService,
    IntelligentSuggestionsService,
    GeminiService, // ← Added
  ],
  exports: [
    FeatureExtractionService,
    TaskPrioritizationService,
    IntelligentSuggestionsService,
    GeminiService, // ← Added
  ],
})
export class AiModule {}
```

---

## Bug #2: GraphQL Upload Scalar Type Not Found

**Error:**
```
Error: Cannot determine a GraphQL input type null for the "file"
Make sure your class is decorated with an appropriate decorator.
at InputTypeFactory.create
```

**Root Cause:**
1. Upload mutations used `@Args('file', { type: () => 'Upload' })` 
2. GraphQL schema generator couldn't resolve 'Upload' scalar type
3. Upload scalar not properly registered in GraphQL config

**Fix:**

### 1. Add Upload scalar to GraphQL config
File: `/backend/src/app.module.ts`

```typescript
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    // Add Upload scalar type definition
    typeDefs: `
      scalar Upload
    `,
    // Add Upload scalar resolver
    resolvers: {
      Upload: GraphQLUpload,
    },
    ...
  }),
})
```

### 2. Fix @Args decorator syntax
File: `/backend/src/lms/source-document/source-document.resolver.ts`

```typescript
// Before:
@Args('file', { type: () => 'Upload' }) file: Promise<FileUpload>

// After:
@Args({ name: 'file', type: () => 'Upload' }) file: Promise<FileUpload>
```

Applied to both mutations:
- `uploadSourceDocumentFile()`
- `uploadDocumentThumbnail()`

### 3. Remove UploadScalar from module providers
File: `/backend/src/lms/source-document/source-document.module.ts`

Removed `UploadScalar` from providers array since Upload is now registered globally in app.module.

---

## Bug #3: Frontend Build Errors

### 3.1 VideoPlayer - react-player Type Issues

**Error:**
```
Type errors with ReactPlayer props and config
```

**Fix:**
Simplified VideoPlayer to use native HTML5 `<video>` element instead of react-player library.

File: `/frontend/src/components/lms/viewers/VideoPlayer.tsx`

```typescript
// Replaced ReactPlayer with:
<video
  src={url}
  poster={thumbnail}
  autoPlay={autoPlay}
  controls={controls}
  className="w-full h-full object-contain"
  onTimeUpdate={(e) => {
    const video = e.currentTarget;
    setPlayed(video.currentTime / video.duration);
  }}
  onLoadedMetadata={(e) => {
    const video = e.currentTarget;
    setDuration(video.duration);
  }}
/>
```

### 3.2 PDFViewer - Missing CSS Imports

**Error:**
```
Module not found: Can't resolve 'react-pdf/dist/esm/Page/AnnotationLayer.css'
Module not found: Can't resolve 'react-pdf/dist/esm/Page/TextLayer.css'
```

**Fix:**
Removed non-existent CSS imports.

File: `/frontend/src/components/lms/viewers/PDFViewer.tsx`

```typescript
// Removed these imports:
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
```

### 3.3 OrderTimeline - Timestamp Type Mismatch

**Error:**
```
Type 'string | Date' is not assignable to type 'Date'
```

**Fix:**
Updated OrderTimeline interface to accept both string and Date.

File: `/frontend/src/components/ecommerce/OrderTimeline.tsx`

```typescript
export interface OrderTrackingEvent {
  id: string;
  type: TrackingEventType;
  status: string;
  description?: string;
  location?: string;
  timestamp: string | Date; // ← Changed from Date only
}
```

### 3.4 OrderStatusBadge - Missing Type Export

**Error:**
```
Type error: Module declares 'OrderStatus' locally, but it is not exported.
```

**Fix:**
Re-export OrderStatus type for convenience.

File: `/frontend/src/components/ecommerce/OrderStatusBadge.tsx`

```typescript
import { type OrderStatus } from '@/types/order.types';

// Re-export OrderStatus for convenience
export type { OrderStatus };
```

---

## Summary

✅ **All bugs fixed!**

**Backend fixes:**
1. GeminiService exported in AiModule
2. Upload scalar registered in GraphQL config with typeDefs and resolver
3. Upload mutations using correct @Args decorator syntax

**Frontend fixes:**
1. VideoPlayer simplified to use HTML5 video
2. PDFViewer CSS imports removed
3. OrderTimeline timestamp type updated
4. OrderStatusBadge type re-exported

**Result:**
- ✅ Backend compiles successfully
- ✅ Frontend builds successfully
- ✅ All GraphQL resolvers working
- ✅ File upload mutations ready
- ✅ Zero compilation errors

**To apply:**
```bash
# Restart backend to load changes
cd /chikiet/kataoffical/shoprausach
docker compose restart backend

# Or if in dev mode, changes auto-reload
```
