'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'GIANGVIEN' | 'USER' | 'GUEST')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // If roles are specified, check user role
    if (allowedRoles && allowedRoles.length > 0) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (!allowedRoles.includes(payload.roleType)) {
          // Redirect based on user's actual role
          switch (payload.roleType) {
            case 'ADMIN':
              router.push('/lms/admin');
              break;
            case 'GIANGVIEN':
              router.push('/lms/instructor');
              break;
            case 'USER':
              router.push('/lms/student');
              break;
            default:
              router.push('/lms/courses');
          }
          return;
        }
      } catch (error) {
        console.error('Failed to parse token:', error);
        router.push('/login');
      }
    }
  }, [router, allowedRoles]);

  return <>{children}</>;
}
