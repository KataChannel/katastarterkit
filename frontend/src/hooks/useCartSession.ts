/**
 * useCartSession Hook
 * Optimized session management for cart operations
 * Handles both authenticated users and guest sessions
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionId, clearSessionId } from '@/lib/session';
import { useMutation } from '@apollo/client';
import { MERGE_CARTS } from '@/graphql/ecommerce.queries';

export function useCartSession() {
  const { isAuthenticated, user } = useAuth();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  const [mergeCarts] = useMutation(MERGE_CARTS, {
    onCompleted: (data) => {
      if (data.mergeCarts.success) {
        console.log('[CartSession] Carts merged successfully');
        clearSessionId();
        setSessionId(undefined);
      }
    },
    onError: (error) => {
      console.error('[CartSession] Error merging carts:', error);
    },
  });

  // Initialize session on mount
  useEffect(() => {
    if (!isInitialized) {
      const id = getSessionId();
      setSessionId(id);
      setIsInitialized(true);
      console.log('[CartSession] Initialized with session ID:', id);
    }
  }, [isInitialized]);

  // Merge carts when user logs in
  useEffect(() => {
    if (isAuthenticated && user && sessionId && isInitialized) {
      console.log('[CartSession] User logged in, merging carts...');
      
      mergeCarts({
        variables: {
          input: {
            userId: user.id,
            sessionId,
          },
        },
      }).catch((error) => {
        console.error('[CartSession] Merge failed:', error);
      });
    }
  }, [isAuthenticated, user, sessionId, isInitialized, mergeCarts]);

  // Get current session ID - ALWAYS return sessionId (backend will use userId from context if authenticated)
  const getCartSessionId = useCallback(() => {
    // Return current sessionId or get/create a new one
    return sessionId || getSessionId();
  }, [sessionId]);

  return {
    sessionId: getCartSessionId(),
    isAuthenticated,
    isInitialized,
  };
}
