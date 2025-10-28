'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from '@/components/ui/toaster';
import { apolloClient } from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
