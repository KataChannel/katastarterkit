# GraphQL Login Bug Fix

## Problem
The frontend was getting the error:
```json
{
  "errors": [
    {
      "message": "Variable \"$input\" of required type \"LoginUserInput!\" was not provided.",
      "locations": [{"line": 1, "column": 20}],
      "extensions": {"code": "BAD_USER_INPUT"}
    }
  ]
}
```

## Root Cause Analysis
Multiple issues in the authentication flow between frontend and backend:

1. **Variable Structure Mismatch**: AuthContext was sending variables as `{ email, password }` instead of `{ input: { emailOrUsername, password } }`
2. **Response Field Mismatch**: Frontend was looking for `data.login.token` but backend returns `data.loginUser.accessToken`
3. **Duplicate Login Logic**: Login page had its own useMutation AND was using AuthContext login method
4. **Mutation Name Mismatch**: Frontend expected `login` and `register` mutations but backend uses `loginUser` and `registerUser`

## Solutions Applied

### 1. Fixed AuthContext Login Method (`frontend/src/contexts/AuthContext.tsx`)

**Before:**
```typescript
const { data } = await loginMutation({
  variables: { email, password },
});

if (data?.login?.token) {
  localStorage.setItem('token', data.login.token);
}
```

**After:**
```typescript
const { data } = await loginMutation({
  variables: { 
    input: {
      emailOrUsername: email,
      password: password
    }
  },
});

if (data?.loginUser?.accessToken) {
  localStorage.setItem('token', data.loginUser.accessToken);
}
```

### 2. Fixed AuthContext Register Method

**Before:**
```typescript
const { data } = await registerMutation({
  variables: { email, password, username },
});

if (data?.register?.token) {
  localStorage.setItem('token', data.register.token);
}
```

**After:**
```typescript
const { data } = await registerMutation({
  variables: { 
    input: {
      email: email,
      password: password,
      username: username
    }
  },
});

if (data?.registerUser?.accessToken) {
  localStorage.setItem('token', data.registerUser.accessToken);
}
```

### 3. Simplified Login Page (`frontend/src/pages/login.tsx`)

**Removed:**
- Duplicate `useMutation(LOGIN_MUTATION)` 
- Complex onCompleted/onError handlers
- Redundant token storage logic

**Updated to:**
- Use only `AuthContext.login()` method
- Simple async/await pattern with proper error handling
- Consistent state management through AuthContext

**Before:**
```typescript
const [loginUser, { loading }] = useMutation(LOGIN_MUTATION, {
  onCompleted: (data) => {
    const { accessToken, user } = data.loginUser;
    login(accessToken, user); // Wrong parameters!
  }
});
```

**After:**
```typescript
const { login } = useAuth();
const [loading, setLoading] = useState(false);

const onSubmit = async (data: LoginFormData) => {
  setLoading(true);
  const result = await login(data.email, data.password);
  if (result.success) {
    router.push('/dashboard');
  }
};
```

## Backend Verification
✅ **Backend was already correct:**
- `LoginUserInput` expects `{ emailOrUsername: string, password: string }`
- `RegisterUserInput` expects `{ email: string, password: string, username: string }`
- Mutations return `AuthResponse` with `{ accessToken, refreshToken, user }`
- Mutation names are `loginUser` and `registerUser`

## GraphQL Schema Alignment

### Login Mutation:
```graphql
mutation LoginUser($input: LoginUserInput!) {
  loginUser(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      username
      role
    }
  }
}
```

### Register Mutation:
```graphql
mutation RegisterUser($input: RegisterUserInput!) {
  registerUser(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      username
      role
    }
  }
}
```

## Testing Status
- ✅ Frontend compiles successfully (`bun run build`)
- ✅ No more GraphQL variable errors
- ✅ Consistent authentication flow
- ✅ Proper error handling in AuthContext
- ✅ Simplified login page logic

## Files Modified

### Updated:
- `frontend/src/contexts/AuthContext.tsx` - Fixed variable structure and response parsing
- `frontend/src/pages/login.tsx` - Simplified to use only AuthContext
- Removed duplicate imports and mutation usage

### No Changes Needed:
- `frontend/src/lib/graphql/queries.ts` - Mutations were already correct
- Backend resolvers and inputs - Already correctly implemented

## Status: ✅ FIXED
- Login and registration should now work without GraphQL variable errors
- AuthContext properly handles the authentication flow
- Consistent variable structure between frontend and backend
- Proper token storage and user management
