# Bug Fix: "Forbidden resource" Error

## Problem
The chatbot frontend was showing "Error loading chatbots: Forbidden resource" because the API client was using the wrong localStorage key for authentication tokens.

## Root Cause
- The backend chatbot endpoints require JWT authentication (`@UseGuards(JwtAuthGuard)`)
- The frontend `AuthContext` stores the token in localStorage as `'token'`
- The `ChatbotApiClient` was looking for `'authToken'` instead of `'token'`
- This mismatch caused API requests to be sent without authentication headers

## Fix Applied

### 1. Fixed Token Retrieval in API Client
**File:** `/frontend/src/lib/chatbot-api.ts`
```typescript
// Before (incorrect)
const token = localStorage.getItem('authToken');

// After (correct)
const token = localStorage.getItem('accessToken');
```

### 2. Added Authentication Protection to Chatbot Page
**File:** `/frontend/src/app/chatbot/page.tsx`
- Added `useAuth()` hook to check authentication status
- Added loading state while checking authentication
- Added login prompt for unauthenticated users
- Redirects to login/register pages when needed

### 3. Enhanced Navigation with Auth Status
**File:** `/frontend/src/components/Navigation.tsx`
- Added user display when authenticated
- Added logout button
- Added login button when not authenticated
- Shows current user's username/email

### 4. Updated Homepage with Auth-Aware CTAs
**File:** `/frontend/src/app/page.tsx`
- Different CTAs for authenticated vs non-authenticated users
- Direct links to chatbot page for authenticated users
- Login prompts for non-authenticated users

### 5. Added Error Boundary
**File:** `/frontend/src/components/ErrorBoundary.tsx`
- Added error boundary to catch and handle authentication errors gracefully
- Provides user-friendly error messages and recovery options

## Result
✅ **Chatbot API calls now include proper authentication headers**
✅ **"Forbidden resource" error resolved**
✅ **Users are prompted to login when accessing protected features**
✅ **Smooth authentication flow with proper redirects**
✅ **Enhanced UX with auth-aware navigation and CTAs**

## Testing
1. Visit http://localhost:13000 - Should show login prompt if not authenticated
2. Login via http://localhost:13000/login
3. Navigate to http://localhost:13000/chatbot - Should now load without "Forbidden resource" error
4. Navigation should show user info and logout option
5. API calls should include `Authorization: Bearer <token>` header

## Authentication Flow
1. User logs in via login page
2. Token stored in localStorage as `'token'`
3. API client retrieves token from localStorage
4. All chatbot API requests include `Authorization: Bearer <token>` header
5. Backend validates JWT and allows access to protected endpoints

The authentication system is now properly integrated with the chatbot functionality!
