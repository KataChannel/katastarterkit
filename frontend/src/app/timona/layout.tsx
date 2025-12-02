'use client';

import { TimonaHeader, TimonaFooter } from '@/features/timona';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/lib/apollo-client';

export default function TimonaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <TimonaHeader />
        
        {/* Main Content */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        {/* Footer */}
        <TimonaFooter />
      </div>
    </ApolloProvider>
  );
}
