/**
 * Request Access Page
 * 
 * Displayed when USER role users try to access admin panel
 * Shows instructions to contact admin for permission
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { RequestAccessNotification } from '@/components/admin/request-access/RequestAccessNotification';

export default function RequestAccessPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/admin/request-access');
    }
    // Redirect to admin dashboard if user is already ADMIN
    if (!loading && isAuthenticated && user?.roleType === 'ADMIN') {
      router.push('/admin');
    }
  }, [loading, isAuthenticated, user, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show access request notification for non-admin users
  return (
    <RequestAccessNotification 
      userRole={user?.roleType || 'User'}
      userName={user?.email || 'User'}
    />
  );
}
