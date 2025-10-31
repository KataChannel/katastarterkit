# LMS Authentication Fix - GraphQL Errors

## 🐛 Vấn đề

```
GraphQL execution errors: {
  operationName: 'GetMyEnrollments',
  errors: [
    {
      message: 'Authentication token is required',
      path: [Array],
      locations: [Array]
    }
  ]
}
```

**Nguyên nhân:**
- Các trang LMS protected (`my-learning`, `my-certificates`, `instructor/dashboard`) đang gọi GraphQL queries yêu cầu authentication (`myEnrollments`, `myCertificates`, `myCourses`)
- Queries này được thực thi ngay khi component mount, **trước khi** kiểm tra xem user có đăng nhập hay không
- Apollo Client có `errorPolicy: 'all'` nên GraphQL errors được trả về thay vì throw, khiến lỗi authentication hiển thị trong console

## ✅ Giải pháp

### 1. Thêm Authentication Check cho Protected Pages

Tất cả các trang LMS yêu cầu đăng nhập giờ đều:

1. **Import AuthContext và Router**
2. **Check authentication state** trước khi render
3. **Redirect về `/login`** nếu chưa đăng nhập
4. **Skip GraphQL query** nếu không có user

### 2. Các trang đã fix

#### ✅ `/lms/my-learning/page.tsx`
- Query: `GET_MY_ENROLLMENTS` (myEnrollments)
- Redirect: `/login?redirect=/lms/my-learning`

#### ✅ `/lms/my-certificates/page.tsx`
- Query: `GET_MY_CERTIFICATES` (myCertificates)
- Redirect: `/login?redirect=/lms/my-certificates`

#### ✅ `/lms/instructor/dashboard/page.tsx`
- Query: `GET_MY_COURSES` (myCourses)
- Redirect: `/login?redirect=/lms/instructor/dashboard`

## 📝 Code Pattern

```tsx
'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 1. Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/current-page');
    }
  }, [user, authLoading, router]);

  // 2. Skip GraphQL query if user is not logged in
  const { data, loading, error } = useQuery(PROTECTED_QUERY, {
    skip: !user, // ⭐ KEY: Skip query nếu chưa login
  });

  // 3. Show loading while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // 4. Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // 5. Normal page rendering
  return <div>Protected Content</div>;
}
```

## 🔑 Key Points

### `skip: !user` trong useQuery
- **Quan trọng nhất:** Ngăn GraphQL query thực thi nếu chưa login
- Tránh lỗi "Authentication token is required"
- Query chỉ chạy khi `user` exists

### Redirect với query param
```tsx
router.push('/login?redirect=/lms/my-learning');
```
- Sau khi login thành công, user sẽ được redirect về trang ban đầu
- Cải thiện UX

### Loading States
1. **authLoading**: Kiểm tra auth state từ context
2. **loading**: Loading GraphQL data
3. **null**: Khi chưa login (đang redirect)

## 🧪 Testing

### Test Case 1: Chưa đăng nhập
```bash
# Truy cập /lms/my-learning khi chưa login
1. Thấy loading spinner "Đang kiểm tra đăng nhập..."
2. Redirect về /login?redirect=/lms/my-learning
3. KHÔNG thấy GraphQL error trong console ✅
```

### Test Case 2: Đã đăng nhập
```bash
# Truy cập /lms/my-learning khi đã login
1. Thấy loading spinner
2. GraphQL query chạy với token
3. Hiển thị danh sách enrollments
4. KHÔNG có authentication error ✅
```

### Test Case 3: Token expired
```bash
# Token hết hạn trong khi dùng app
1. GraphQL query trả về UNAUTHENTICATED error
2. AuthContext bắt error và logout user
3. Redirect về /login
4. Apollo error link log error (không auto-logout) ✅
```

## 📊 Files Changed

```
frontend/src/app/lms/my-learning/page.tsx          ✅ Fixed
frontend/src/app/lms/my-certificates/page.tsx      ✅ Fixed
frontend/src/app/lms/instructor/dashboard/page.tsx ✅ Fixed
```

## 🎯 Kết quả

- ✅ **Zero authentication errors** trong console
- ✅ **Better UX**: Redirect ngay về login thay vì show error
- ✅ **Security**: Protected pages không render content khi chưa login
- ✅ **Performance**: Skip unnecessary GraphQL queries

## 🔮 Future Improvements

### 1. Higher-Order Component (HOC)
Tạo HOC `withAuth` để tái sử dụng:

```tsx
// components/hoc/withAuth.tsx
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push(`${redirectTo}?redirect=${window.location.pathname}`);
      }
    }, [user, loading, router]);

    if (loading) return <LoadingSpinner />;
    if (!user) return null;

    return <Component {...props} />;
  };
}

// Usage
export default withAuth(MyLearningPage);
```

### 2. Middleware Protection
Sử dụng Next.js middleware để protect routes:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  
  if (request.nextUrl.pathname.startsWith('/lms/my-')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url)
      );
    }
  }
}
```

### 3. Role-Based Access Control
Thêm check role cho instructor pages:

```tsx
const { user, loading } = useAuth();

if (!loading && user?.role !== 'INSTRUCTOR') {
  router.push('/lms/courses');
}
```

## 📚 Related Documentation

- [Authentication Context](/docs/AUTH_CONTEXT.md)
- [Apollo Client Setup](/docs/APOLLO_CLIENT.md)
- [LMS Vietnamese Localization](/docs/LMS_VIETNAMESE_LOCALIZATION.md)

---

**Date Fixed:** 2025-10-31  
**Issue:** GraphQL Authentication Errors  
**Status:** ✅ Resolved
