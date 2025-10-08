# Commit Message

## fix(upload): add JWT authentication to file upload requests

### 🐛 Problem
Upload API returning 403 Forbidden error after fixing 404.

**Error:**
```
Request URL: http://localhost:14000/api/files/upload/bulk
Request Method: POST
Status Code: 403 Forbidden
```

### 🔍 Root Cause

FileController requires JWT authentication:
```typescript
@Controller('api/files')
@UseGuards(JwtAuthGuard)  // Requires valid JWT token
export class FileController {
  @Post('upload/bulk')
  async uploadFiles(@Request() req: any) {
    const userId = req.user.id;  // Needs authenticated user
  }
}
```

Frontend was not sending authentication token in request headers.

### ✅ Solution

Added JWT token from localStorage to Authorization header:

**Before:**
```typescript
const response = await fetch(`${apiUrl}/api/files/upload/bulk`, {
  method: 'POST',
  body: formData,
  credentials: 'include',
});
```

**After:**
```typescript
// Get JWT token from localStorage
const token = typeof window !== 'undefined' 
  ? localStorage.getItem('accessToken') 
  : null;

// Build headers with Authorization
const headers: HeadersInit = {};
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const response = await fetch(`${apiUrl}/api/files/upload/bulk`, {
  method: 'POST',
  headers,  // JWT token included
  body: formData,
  credentials: 'include',
});
```

### 🔧 Additional Improvements

1. **SSR Safety:**
   - Added `typeof window !== 'undefined'` check
   - Prevents errors during server-side rendering

2. **Better Error Handling:**
   ```typescript
   if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
     throw new Error(errorData.message || `Upload failed with status ${response.status}`);
   }
   ```
   - Parses backend error messages
   - Provides specific error details to user
   - Graceful fallback if JSON parsing fails

### 📊 Impact

| Aspect | Before | After |
|--------|--------|-------|
| Auth Header | ❌ Not sent | ✅ Bearer token |
| Token Source | ❌ None | ✅ localStorage.accessToken |
| Response | ❌ 403 Forbidden | ✅ 200 OK |
| Error Messages | ❌ Generic | ✅ Backend parsed |
| SSR Safe | ⚠️ No | ✅ Yes |

### 🧪 Testing

- [x] Upload with valid token succeeds
- [x] Upload without token returns 403
- [x] Authorization header format correct (Bearer <token>)
- [x] Error messages parsed and displayed
- [x] SSR safety verified
- [x] Zero TypeScript errors
- [x] No console errors

### 📝 Files Modified

**Frontend:**
- `frontend/src/app/admin/filemanager/page.tsx`
  - Added JWT token retrieval from localStorage
  - Added Authorization header to fetch request
  - Improved error handling and parsing
  - Added SSR safety check

**Documentation:**
- `UPLOAD_403_FIX.md` - Detailed technical documentation
- `UPLOAD_403_QUICK_FIX.md` - Quick reference summary

### 🔐 Security

- ✅ JWT authentication required
- ✅ Token transmitted via HTTPS (production)
- ✅ Proper Bearer token format
- ✅ User association with uploads

### 🚀 Deployment Notes

**Environment:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:14000  # Development
# NEXT_PUBLIC_API_URL=https://api.domain.com  # Production
```

**Requirements:**
- User must be logged in
- Valid JWT token in localStorage
- HTTPS in production for secure token transmission

---

**Breaking Changes:** None  
**Migration Required:** No  
**Backwards Compatible:** Yes  
**Status:** ✅ Production Ready  
**Security:** ✅ JWT Authentication Enabled
