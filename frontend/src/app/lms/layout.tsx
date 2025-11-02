'use client';

import React, { useEffect, useState } from 'react';
import { LMSNavigation } from '@/components/lms/LMSNavigation';

export default function LMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (error) {
      console.error('[LMSLayout] Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LMSNavigation user={user} showInstructorLink={true} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
