import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const currentPath = router.asPath;
    const loginUrl = `/login${currentPath !== '/' ? `?returnUrl=${encodeURIComponent(currentPath)}` : ''}`;
    router.push(loginUrl);
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
