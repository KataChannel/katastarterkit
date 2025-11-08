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
  // Initialize with getSessionId() immediately to avoid undefined
  const [sessionId, setSessionId] = useState<string>(() => getSessionId());
  const [isInitialized, setIsInitialized] = useState(false);

  const [mergeCarts] = useMutation(MERGE_CARTS, {
    onCompleted: (data) => {
      if (data.mergeCarts.success) {
        console.log('[CartSession] Carts merged successfully');
        clearSessionId();
        setSessionId(''); // Clear but don't set to undefined
      }
    },
    onError: (error) => {
      console.error('[CartSession] Error merging carts:', error);
    },
  });

  // Initialize session on mount
  useEffect(() => {
    if (!isInitialized) {
      // Re-get session ID to ensure consistency
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

  // Get effective sessionId for cart operations
  // For authenticated users: don't send sessionId (backend will use userId from context)
  // For guest users: always ensure we have a valid sessionId
  const getEffectiveSessionId = useCallback(() => {
    if (isAuthenticated) {
      // Authenticated user - no sessionId needed
      return undefined;
    } else {
      // Guest user - MUST have a valid sessionId
      // If sessionId state is empty/undefined, get it immediately from localStorage
      const sid = sessionId && sessionId.trim() !== '' ? sessionId : getSessionId();
      console.log('[CartSession] Getting effective sessionId:', {
        stateSessionId: sessionId,
        freshSessionId: getSessionId(),
        effectiveSessionId: sid,
        isAuthenticated
      });
      return sid;
    }
  }, [isAuthenticated, sessionId]);

  const effectiveSessionId = getEffectiveSessionId();

  console.log('[CartSession] Returning:', { 
    effectiveSessionId, 
    isAuthenticated, 
    isInitialized,
    rawSessionId: sessionId 
  });

  return {
    sessionId: effectiveSessionId,
    isAuthenticated,
    isInitialized,
    getSessionId: getEffectiveSessionId, // Export function to get fresh sessionId
  };
}
