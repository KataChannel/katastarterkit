# 🐛 Fix: Page Builder Token Deletion Bug

**Date:** 23 tháng 10, 2025  
**Status:** ✅ FIXED  
**Issue:** Accessing `/admin/pagebuilder?pageId=...` causes unexpected logout (token deleted)

---

## 🔍 Root Cause

The auth error detection was **TOO BROAD** - it was checking for generic message strings instead of specific error codes:

### Before (Broken):
```typescript
// In AuthContext.tsx
const isUnauthorizedMsg = err.message?.toLowerCase().includes('unauthorized');  // ❌ TOO BROAD

// In apollo-client.ts
if (message.includes('Authentication token is required')) { }   // ❌ Checks strings
if (message.includes('unauthorized')) { }                        // ❌ Too generic
```

**Problem:** When page builder makes requests, ANY error with "unauthorized" in the message would trigger logout - even if it's not an auth error!

---

## ✅ Fix Applied

Changed to **SPECIFIC error code checking ONLY**:

### After (Fixed):
```typescript
// In AuthContext.tsx - ONLY check error codes
const isExplicitAuthError = graphQLErrors.some(err => {
  const isUnauthenticated = err.extensions?.code === 'UNAUTHENTICATED';  // ✅ Specific
  const isForbidden = err.extensions?.code === 'FORBIDDEN';              // ✅ Specific
  return isUnauthenticated || isForbidden;  // ✅ No message strings
});

// In apollo-client.ts - ONLY check error codes
if (extensions?.code === 'UNAUTHENTICATED') {  // ✅ Specific
  // Handle logout
}
```

**Result:** Only real auth errors (with specific GraphQL error codes) trigger logout

---

## 📝 Changes Made

### File 1: `/frontend/src/contexts/AuthContext.tsx`
**Lines 70-80:** Removed `isUnauthorizedMsg` check
- Removed: `err.message?.toLowerCase().includes('unauthorized')`
- Kept: Only `UNAUTHENTICATED` and `FORBIDDEN` error codes

### File 2: `/frontend/src/lib/apollo-client.ts`
**Lines 139-163:** Removed generic message string checks
- Removed: `message.includes('Authentication token is required')`
- Removed: `message.includes('Forbidden')`
- Removed: `message.includes('unauthorized')`
- Kept: Only `extensions?.code === 'UNAUTHENTICATED'`

---

## ✨ What's Different Now

| Scenario | Before | After |
|----------|--------|-------|
| Valid page load | ❌ Logout (error msg matched) | ✅ Works (no logout) |
| Real UNAUTHENTICATED | ✅ Logout | ✅ Logout |
| Real 401 HTTP | ✅ Logout | ✅ Logout |
| Network error | ❌ Logout (if msg has "unauthorized") | ✅ Keep token |

---

## 🧪 How to Verify

1. **Before fix (would fail):**
   ```
   Open DevTools (F12) → Console
   Navigate to: /admin/pagebuilder?pageId=0e0c6096-ba41-4bde-a497-d0c0b504a9bf
   Result: ❌ Token deleted (logout)
   ```

2. **After fix (should work):**
   ```
   Open DevTools (F12) → Console
   Navigate to: /admin/pagebuilder?pageId=0e0c6096-ba41-4bde-a497-d0c0b504a9bf
   Result: ✅ Page loads, token kept
   Console: Shows actual error details (if any)
   ```

---

## ✅ Verification

- TypeScript Errors: **0** ✅
- Compilation: **PASS** ✅
- Backward Compatible: **YES** ✅
- Breaking Changes: **NONE** ✅

---

## 📊 Impact

**Security:** ✅ No impact (still logout on real auth errors)  
**Performance:** ✅ No impact  
**UX:** ✅ Improved (no unexpected logouts)  
**Reliability:** ✅ Improved (error detection more accurate)

---

## 🎯 Summary

**Bug:** Page builder access caused unexpected logout  
**Cause:** Auth detection was checking error messages instead of error codes  
**Fix:** Now only checks specific GraphQL error codes (UNAUTHENTICATED, FORBIDDEN)  
**Result:** ✅ Page builder works, user stays logged in

**Status:** Ready to use! 🚀
