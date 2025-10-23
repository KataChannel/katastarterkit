# 🎨 Console Logging Quick Reference - Authentication

**Open DevTools:** F12 → Console Tab

---

## 🟢 SUCCESS Logs (Green)

```
✅ AuthContext - User authenticated successfully
   → User is logged in, you can see the user object below
```

---

## 🔴 ERROR Logs (Red) - Logout Happens

### 401 Unauthorized
```
❌ AuthContext - Error Handling
   ├─ 🔐 401 HTTP Status Code detected - LOGOUT REQUIRED
   ├─ 🔓 LOGGING OUT - Clearing all auth data
   └─ ✓ Auth data cleared from localStorage
   
Result: User logged out ❌
```

### UNAUTHENTICATED GraphQL Error
```
❌ AuthContext - Error Handling
   ├─ 🔑 UNAUTHENTICATED error code detected
   ├─ 🚨 Explicit auth-related GraphQL error detected - LOGOUT REQUIRED
   ├─ 🔓 LOGGING OUT - Clearing all auth data
   └─ ✓ Auth data cleared from localStorage
   
Result: User logged out ❌
```

### FORBIDDEN GraphQL Error
```
❌ AuthContext - Error Handling
   ├─ 🚫 FORBIDDEN error code detected
   ├─ 🚨 Explicit auth-related GraphQL error detected - LOGOUT REQUIRED
   ├─ 🔓 LOGGING OUT - Clearing all auth data
   └─ ✓ Auth data cleared from localStorage
   
Result: User logged out ❌
```

---

## 🟠 WARNING Logs (Orange) - Token Kept

### Network Error During Reload
```
❌ AuthContext - Error Handling
   └─ ⚠️  Transient network error detected - KEEPING TOKEN for retry
      ├─ type: NetworkError
      ├─ message: Failed to fetch
      ├─ statusCode: undefined
      └─ willRetry: true

Result: User stays logged in ✅
```

### Server Down
```
❌ AuthContext - Error Handling
   └─ ⚠️  Transient network error detected - KEEPING TOKEN for retry

🚨 [Network Error Details]
   └─ statusCode: 502 (Bad Gateway)

Result: User stays logged in ✅
```

---

## 🔵 INFO Logs (Blue)

### Login Started
```
🔐 Login attempt started
   {email: "user@example.com", timestamp: "2025-10-23T..."}
```

### Manual Logout
```
🚪 Manual logout triggered
   ├─ Token Before: EXISTS
   ├─ Action: REMOVING
   └─ User: user@example.com
```

---

## 📊 Error Tables in Console

### GraphQL Errors Table
```
🚨 GraphQL Errors Detected

Operation: GetCurrentUser

#  Message                          Code                Path
1  Authentication token is required UNAUTHENTICATED    getMe
```

### Token Removal Table
```
Current Token  EXISTS | NONE
Action         REMOVING
Timestamp      2025-10-23T10:30:45.123Z
```

---

## 🎯 Debug Checklist

When troubleshooting logout issues:

- [ ] 1. Go to Console tab (F12)
- [ ] 2. Look for red (❌) error logs
- [ ] 3. Check if it says "LOGOUT REQUIRED"
- [ ] 4. Look for error code:
  - [ ] 401 = Token invalid/expired
  - [ ] UNAUTHENTICATED = Server says not authenticated
  - [ ] FORBIDDEN = Permission denied
  - [ ] Network error = Server/network issue
- [ ] 5. Share the console output with support if needed

---

## 🚀 Common Scenarios

### Scenario: Reload page while logged in
```
Expected Console:
1. ❌ AuthContext - Error Handling (first attempt)
   ⚠️ Transient network error detected
2. ✅ AuthContext - User authenticated successfully
   (page finishes loading)

Result: ✓ You stay logged in
```

### Scenario: Token expires
```
Expected Console:
1. ❌ AuthContext - Error Handling
   🔐 401 HTTP Status Code detected - LOGOUT REQUIRED
2. 🔓 LOGGING OUT - Clearing all auth data
3. ↪️ Redirecting to /login

Result: ✗ You're logged out (redirected to login page)
```

### Scenario: Login with correct credentials
```
Expected Console:
1. 🔐 Login attempt started
2. ✅ AuthContext - User authenticated successfully
   (redirected to dashboard)

Result: ✓ You're logged in
```

### Scenario: Login with wrong credentials
```
Expected Console:
1. 🔐 Login attempt started
2. ❌ AuthContext - Error Handling
   (error message shown on page)

Result: ✗ Login failed, stay on login page
```

---

## 💡 Tips

- **Filter by emoji:** Search console for 🔐, ✅, ❌, ⚠️ to find specific logs
- **Copy logs:** Right-click → Copy to share with support
- **Clear logs:** `console.clear()` to start fresh
- **Save logs:** Screenshot or copy-paste the text
- **Check Network:** Network tab (F12 → Network) to see actual requests

---

## 🔗 See Also

- Full documentation: `BUG_FIX_AUTH_LOGGING_CONSOLE.md`
- Auth implementation: `/frontend/src/contexts/AuthContext.tsx`
- Apollo config: `/frontend/src/lib/apollo-client.ts`
