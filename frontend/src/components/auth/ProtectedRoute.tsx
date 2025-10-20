'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    // If role is required, check user role
    if (requiredRole) {
      // Parse JWT to get user role (simplified - in production use proper JWT parsing)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (payload.roleType !== requiredRole) {
          router.push('/courses?error=unauthorized');
          return;
        }
      } catch (error) {
        console.error('Failed to parse token:', error);
        router.push('/login');
      }
    }
  }, [router, requiredRole]);

  return <>{children}</>;
}
