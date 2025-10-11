# GetCurrentUser Fix - Quick Reference

## 🎯 Problem
```
GraphQL Error: "Forbidden resource"
Operation: GetCurrentUser
```

## ✅ Solution Applied

### 1. JwtAuthGuard - Now throws specific errors
```typescript
// Location: backend/src/auth/jwt-auth.guard.ts

// ❌ Before: Silent failure
if (!token) return false;

// ✅ After: Clear error
if (!token) {
  throw new UnauthorizedException('Authentication token is required');
}
```

### 2. CurrentUser Decorator - Clean user access
```typescript
// Location: backend/src/auth/current-user.decorator.ts

// Usage in any resolver:
@Query(() => User)
@UseGuards(JwtAuthGuard)
async getMe(@CurrentUser() user: User) {
  return user; // ✅ Type-safe, clean
}
```

## 📋 Error Messages Reference

| Scenario | Old Error | New Error |
|----------|-----------|-----------|
| No token | Forbidden resource | Authentication token is required |
| Expired token | Forbidden resource | Authentication token has expired |
| Invalid token | Forbidden resource | Invalid authentication token |
| User not found | Forbidden resource | User not found |
| Inactive user | Forbidden resource | User account is inactive |

## 🚀 Usage Examples

### Import the decorator
```typescript
import { CurrentUser } from '../../auth/current-user.decorator';
```

### Use in queries
```typescript
@Query(() => User, { name: 'getMe' })
@UseGuards(JwtAuthGuard)
async getMe(@CurrentUser() user: User): Promise<User> {
  return this.userService.findById(user.id);
}
```

### Use in mutations
```typescript
@Mutation(() => Task)
@UseGuards(JwtAuthGuard)
async createTask(
  @Args('input') input: CreateTaskInput,
  @CurrentUser() user: User
): Promise<Task> {
  return this.taskService.create(user.id, input);
}
```

### Get user ID only
```typescript
@Query(() => [Task])
@UseGuards(JwtAuthGuard)
async myTasks(@CurrentUser() user: User): Promise<Task[]> {
  return this.taskService.findByUserId(user.id);
}
```

## 🧪 Test Commands

### 1. Start Backend
```bash
cd backend
bun run start:dev
```

### 2. Run Test Script
```bash
cd /chikiet/kataoffical/fullstack/katacore
node test-getme.js
```

### 3. GraphQL Playground
```
http://localhost:4000/graphql
```

**Query:**
```graphql
query GetCurrentUser {
  getMe {
    id
    email
    username
    roleType
  }
}
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## 📝 Migration Pattern

### Find and Replace Pattern

**Old:**
```typescript
@Context() context: any
// ...
const userId = context.req.user.id;
```

**New:**
```typescript
@CurrentUser() user: User
// ...
const userId = user.id;
```

## 🔍 Debugging Tips

### Check Logs
```bash
# Backend logs show detailed auth info now
[JwtAuthGuard] WARN: GraphQL - No token provided in Authorization header
[JwtAuthGuard] WARN: JWT token expired
[JwtAuthGuard] DEBUG: Authenticated user: abc123 (user@example.com)
```

### Test Auth Flow
```bash
# 1. Login
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email:\"admin@kata.vn\", password:\"123456\") { accessToken } }"}'

# 2. Get Me (with token)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"query { getMe { id email } }"}'
```

## ⚠️ Common Issues

### Issue: "Authentication token is required"
**Cause:** No Authorization header  
**Fix:** Add header: `Authorization: Bearer <token>`

### Issue: "Authentication token has expired"
**Cause:** Token expired  
**Fix:** Login again to get new token

### Issue: "User account is inactive"
**Cause:** User.isActive = false  
**Fix:** Activate user in database

## 📊 Files Modified

```
backend/src/auth/
  ├── jwt-auth.guard.ts          ✅ Enhanced
  └── current-user.decorator.ts  ✅ NEW

backend/src/graphql/resolvers/
  └── user.resolver.ts           ✅ Updated

root/
  ├── test-getme.js              ✅ NEW
  ├── GETCURRENTUSER_FORBIDDEN_FIX.md
  └── GIT_COMMIT_GETCURRENTUSER_FIX.md
```

## ✅ Checklist

- [x] Enhanced JwtAuthGuard with specific errors
- [x] Created CurrentUser decorator
- [x] Updated UserResolver.getMe()
- [x] Added logging for debugging
- [x] Created test script
- [x] Documentation complete
- [ ] Backend restarted (pending)
- [ ] Tests verified (pending)

## 🎓 Best Practices

1. ✅ Always use `@CurrentUser()` instead of `@Context()`
2. ✅ Use `@UseGuards(JwtAuthGuard)` for protected routes
3. ✅ Check backend logs for auth failures
4. ✅ Handle specific error messages in frontend
5. ✅ Test with and without tokens

---

**Status:** ✅ Code Complete  
**Next:** Restart backend and test
