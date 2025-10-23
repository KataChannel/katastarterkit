# 🧪 Testing Guide - Authentication Logging & Logout

**Purpose:** Verify console logs appear correctly and logout/login works as expected

---

## ✅ Pre-Test Checklist

- [ ] Frontend server running (`npm run dev`)
- [ ] Backend server running
- [ ] Browser DevTools available (F12)
- [ ] Console tab open and cleared

---

## 🧪 Test Suite

### Test 1: Login with Valid Credentials ✅

**Steps:**
1. Open login page
2. Enter valid email/password
3. Click Submit
4. Check console

**Expected Console Output:**
```
🔐 Login attempt started
  {email: "...", timestamp: "..."}

[Wait for authentication...]

✅ AuthContext - User authenticated successfully
  {user object with id, email, username}
```

**Expected Result:**
- ✅ Logged in
- ✅ Redirected to dashboard
- ✅ Console shows both logs

---

### Test 2: Login with Invalid Credentials ❌

**Steps:**
1. Open login page
2. Enter invalid email/password
3. Click Submit
4. Check console

**Expected Console Output:**
```
🔐 Login attempt started
  {email: "...", timestamp: "..."}

[Error response from backend]

❌ AuthContext - Error Handling
  [Error details]
```

**Expected Result:**
- ✅ Error message shown on page
- ✅ Still on login page
- ✅ Console shows error logs
- ✅ User NOT logged in

---

### Test 3: Page Reload While Logged In ♻️

**Steps:**
1. Login successfully
2. Wait for "✅ User authenticated" log
3. Press F5 to reload
4. Check console during reload

**Expected Console Output:**
```
[Clearing console...]

❌ AuthContext - Error Handling
  └─ ⚠️  Transient network error detected - KEEPING TOKEN
     ├─ type: NetworkError
     ├─ message: ...
     ├─ statusCode: undefined
     └─ willRetry: true

[Wait a moment...]

✅ AuthContext - User authenticated successfully
  {user object}
```

**Expected Result:**
- ✅ User stays logged in
- ✅ Page loads normally
- ✅ Console shows transient error → success
- ✅ Token is NOT removed

---

### Test 4: Manual Logout 🚪

**Steps:**
1. Login successfully
2. Look for logout button
3. Click logout button
4. Check console immediately

**Expected Console Output:**
```
🚪 Manual logout triggered
  ├─ Token Before: EXISTS
  ├─ Action: REMOVING
  └─ User: user@example.com

✓ All auth data cleared
```

**Expected Result:**
- ✅ Console shows logout logs
- ✅ User redirected to login page
- ✅ Token removed from localStorage
- ✅ All auth data cleared

---

### Test 5: Token Expiration ⏰

**Prerequisites:** Need to wait for token to expire (or use manual token manipulation)

**Steps:**
1. Login successfully
2. Wait for token to expire (based on backend config)
3. Try to interact (click a button, navigate, etc)
4. Check console

**Expected Console Output:**
```
❌ AuthContext - Error Handling
  ├─ Full Error Object: {...}
  ├─ Network Error: {...}
  ├─ 🔐 401 HTTP Status Code detected - LOGOUT REQUIRED
  ├─ 🚨 Explicit auth-related GraphQL error detected
  ├─ 🔓 LOGGING OUT - Clearing all auth data
  │  ├─ Current Token: EXISTS
  │  ├─ Action: REMOVING
  │  └─ Timestamp: ...
  └─ ✓ Auth data cleared from localStorage

🚨 HTTP 401 Unauthorized - LOGGING OUT
  ├─ 🔓 Clearing auth data from Apollo error link
  └─ ↪️ Redirecting to /login
```

**Expected Result:**
- ✅ Console shows 401 error
- ✅ Console shows "LOGOUT REQUIRED"
- ✅ User redirected to login page
- ✅ Token removed from localStorage

---

### Test 6: Server Down Scenario 🔌

**Prerequisites:** Stop the backend server

**Steps:**
1. Login successfully (while server is running)
2. Stop backend server
3. Reload or interact with app
4. Check console

**Expected Console Output:**
```
❌ AuthContext - Error Handling
  └─ ⚠️  Transient network error detected - KEEPING TOKEN for retry
     ├─ type: NetworkError
     ├─ message: Failed to fetch (or similar)
     ├─ statusCode: undefined (no status = network error)
     └─ willRetry: true

🚨 [Network Error Details]
  ├─ Error Info: {type: ..., message: ...}
  └─ Context: {...}
```

**Expected Result:**
- ✅ Console shows network error (NOT 401)
- ✅ Console shows "KEEPING TOKEN for retry"
- ✅ User is NOT logged out
- ✅ Token remains in localStorage

---

### Test 7: GraphQL UNAUTHENTICATED Error 🔑

**Prerequisites:** Need backend to return UNAUTHENTICATED error code

**Steps:**
1. Clear token from localStorage via DevTools
2. Try to interact with app (e.g., navigate to protected page)
3. Check console

**Expected Console Output:**
```
❌ AuthContext - Error Handling
  ├─ Full Error Object: {...}
  ├─ GraphQL Errors Table:
  │  ├─ Message: ...
  │  ├─ Code: UNAUTHENTICATED
  │  └─ Path: getMe
  ├─ 🔑 UNAUTHENTICATED error code detected
  ├─ 🚨 Explicit auth-related GraphQL error detected - LOGOUT REQUIRED
  ├─ 🔓 LOGGING OUT - Clearing all auth data
  └─ ✓ Auth data cleared from localStorage
```

**Expected Result:**
- ✅ Console shows UNAUTHENTICATED error
- ✅ Console shows "LOGOUT REQUIRED"
- ✅ User sent to login page

---

### Test 8: GraphQL FORBIDDEN Error 🚫

**Prerequisites:** Need backend to return FORBIDDEN error code

**Steps:**
1. Login with limited permission user
2. Try to access admin resource
3. Check console

**Expected Console Output:**
```
❌ AuthContext - Error Handling
  ├─ GraphQL Errors Table:
  │  ├─ Message: Forbidden resource
  │  ├─ Code: FORBIDDEN
  │  └─ Path: adminResource
  ├─ 🚫 FORBIDDEN error code detected
  ├─ 🚨 Explicit auth-related GraphQL error detected
  └─ [May or may not logout depending on configuration]
```

**Expected Result:**
- ✅ Console shows FORBIDDEN error
- ✅ Error message shown on page

---

### Test 9: HTTP 403 Forbidden (Not FORBIDDEN code) 🔒

**Prerequisites:** Need an endpoint that returns 403 but not explicit FORBIDDEN code

**Steps:**
1. Login successfully
2. Try to access forbidden resource
3. Check console

**Expected Console Output:**
```
🚫 Forbidden (403) - insufficient permissions
  (color: #e67e22)
```

**Expected Result:**
- ✅ Console shows 403 error
- ✅ User is NOT logged out
- ✅ Token remains in localStorage
- ✅ Error shown on page

---

### Test 10: HTTP 500 Server Error 💥

**Prerequisites:** Backend error

**Steps:**
1. Login successfully
2. Trigger backend error (if possible)
3. Check console

**Expected Console Output:**
```
💥 Internal Server Error (500)
  (color: #e74c3c)

🚨 [Network Error Details]
  └─ statusCode: 500
```

**Expected Result:**
- ✅ Console shows 500 error
- ✅ User is NOT logged out
- ✅ Token remains in localStorage
- ✅ Error shown on page

---

## 🎨 Console Colors Reference

| Color | Code | Meaning |
|-------|------|---------|
| 🟢 Green | #2ecc71 | Success ✅ |
| 🔴 Red | #e74c3c | Error/Logout ❌ |
| 🟠 Orange | #f39c12 | Warning/Transient ⚠️ |
| 🟡 Dark Red | #c0392b | Action/Logout 🔓 |
| 🔵 Blue | #3498db | Info ℹ️ |
| ⚪ Medium Orange | #e67e22 | Medium Warning |

---

## 📋 Test Results Template

Copy and fill this out when testing:

```
Test Date: _____
Tester: _____
Environment: Dev / Staging / Production

[ ] Test 1: Login Valid - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 2: Login Invalid - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 3: Page Reload - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 4: Manual Logout - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 5: Token Expiration - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 6: Server Down - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 7: UNAUTHENTICATED - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 8: FORBIDDEN - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 9: HTTP 403 - PASS/FAIL
    Console Output: ___
    Result: ___

[ ] Test 10: HTTP 500 - PASS/FAIL
    Console Output: ___
    Result: ___

Overall Result: PASS / FAIL
Notes: ___
```

---

## 🔧 Debugging Tips

### Can't see console logs?
- [ ] Check F12 is open to Console tab
- [ ] Check console isn't filtered
- [ ] Try `console.clear()` first
- [ ] Trigger action again (login, reload, etc)

### Logs show but different than expected?
- [ ] Check error type in Network tab
- [ ] Check browser DevTools for network errors
- [ ] Check server logs for backend errors
- [ ] Check if token is actually in localStorage

### User logged out unexpectedly?
- [ ] Check console for red error logs
- [ ] Look for "LOGOUT REQUIRED" message
- [ ] Check error code (401, UNAUTHENTICATED, FORBIDDEN)
- [ ] If no logout message, check if manual logout clicked

### User stays logged in when shouldn't?
- [ ] Check if it was a 401 error (should logout)
- [ ] Check if it was UNAUTHENTICATED code (should logout)
- [ ] Check if it was network error (should keep token)
- [ ] Check console for actual error type

---

## 📊 Quick Test Checklist

**Before Release:**
- [ ] All 10 tests pass
- [ ] Console logs appear correctly
- [ ] Colors are visible
- [ ] No TypeScript errors
- [ ] No browser console errors (except for tested scenarios)
- [ ] Login works
- [ ] Logout works
- [ ] Reload works
- [ ] Token persistence works
- [ ] Error handling works

---

## 🚀 Sign Off

When all tests pass:

```
✅ Authentication Logging Testing - COMPLETE
✅ All 10 test scenarios pass
✅ Console output matches expected
✅ Ready for deployment

Signed Off By: _____
Date: _____
```

---

**Reference Docs:**
- Full Documentation: `BUG_FIX_AUTH_LOGGING_CONSOLE.md`
- Quick Reference: `CONSOLE_LOGGING_QUICK_REFERENCE.md`
- Implementation: `/frontend/src/contexts/AuthContext.tsx`
- Apollo Config: `/frontend/src/lib/apollo-client.ts`
