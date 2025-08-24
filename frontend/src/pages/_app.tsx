import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { apolloClient } from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/app/globals.css';

export default function App({ 
  Component, 
  pageProps 
}: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Component {...pageProps} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
}
