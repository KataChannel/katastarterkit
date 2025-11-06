/**
 * Providers Component - Next.js Full-Stack Version
 * 
 * Updated to remove Apollo Client dependency
 * Now uses Server Actions for data fetching
 */

'use client';

import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster />
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
}
