# Fix: GetCurrentUser "Forbidden resource" Error with Enhanced Auth Guard

## 🐛 Bug Fixed
GraphQL query `GetCurrentUser` (operation `getMe`) was returning generic error "Forbidden resource" without any helpful details about authentication failures.

## 🔍 Root Cause
JwtAuthGuard was silently returning `false` on authentication failures, causing NestJS to throw generic ForbiddenException with message "Forbidden resource". No logging or specific error messages were provided.

## ✅ Solution

### 1. Enhanced JwtAuthGuard
**File:** `backend/src/auth/jwt-auth.guard.ts`

- ✅ Added Logger for debugging
- ✅ Throw UnauthorizedException with specific messages instead of returning false
- ✅ Detailed error handling for different failure scenarios:
  - No token provided → "Authentication token is required"
  - Token expired → "Authentication token has expired"
  - Invalid token → "Invalid authentication token"
  - User not found → "User not found"
  - User inactive → "User account is inactive"
- ✅ Debug logging for successful authentications

### 2. Created CurrentUser Decorator
**File:** `backend/src/auth/current-user.decorator.ts` (NEW)

- ✅ Custom parameter decorator for clean user extraction
- ✅ Works with both GraphQL and REST endpoints
- ✅ Type-safe and maintainable

**Usage:**
```typescript
// Before
@UseGuards(JwtAuthGuard)
async getMe(@Context() context: any) {
  const userId = context.req.user.id;
}

// After
@UseGuards(JwtAuthGuard)
async getMe(@CurrentUser() user: User) {
  return user; // Clean and type-safe
}
```

### 3. Updated UserResolver
**File:** `backend/src/graphql/resolvers/user.resolver.ts`

- ✅ Import and use CurrentUser decorator
- ✅ Simplified getMe() implementation
- ✅ Better type safety

## 📊 Impact

### Error Messages (Before vs After)

**Before:**
```json
{ "message": "Forbidden resource" }
```

**After:**
```json
// No token
{ "message": "Authentication token is required" }

// Expired token
{ "message": "Authentication token has expired" }

// Invalid token
{ "message": "Invalid authentication token" }

// User not found
{ "message": "User not found" }

// Inactive user
{ "message": "User account is inactive" }
```

## 🎯 Benefits

- ✅ Clear error messages for debugging
- ✅ Better developer experience
- ✅ Better user experience (specific error messages)
- ✅ Improved logging for security monitoring
- ✅ Cleaner code with @CurrentUser() decorator
- ✅ Type-safe user access

## 📝 Files Changed

### Modified (2 files)
- `backend/src/auth/jwt-auth.guard.ts` - Enhanced with logging and specific exceptions
- `backend/src/graphql/resolvers/user.resolver.ts` - Use CurrentUser decorator

### Created (2 files)
- `backend/src/auth/current-user.decorator.ts` - New decorator for user extraction
- `test-getme.js` - Integration test script
- `GETCURRENTUSER_FORBIDDEN_FIX.md` - Comprehensive documentation

## 🔄 Breaking Changes
None - fully backward compatible

## 🧪 Testing
1. Start backend: `cd backend && bun run start:dev`
2. Run test: `node test-getme.js`
3. Test in GraphQL Playground at http://localhost:4000/graphql

## 📚 Migration Notes
Other resolvers using `@Context() context: any` can be migrated to use `@CurrentUser()` decorator for cleaner code:
- `task.resolver.ts` (18 occurrences)
- `post.resolver.ts` (4 occurrences)

## Related Issues
- Fixes: "Forbidden resource" error in GetCurrentUser query
- Improves: Authentication error handling across all GraphQL queries
- Enhances: Security logging and monitoring capabilities

---

**Priority:** HIGH  
**Type:** Bug Fix + Enhancement  
**Status:** ✅ COMPLETE
