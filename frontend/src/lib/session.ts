/**
 * Session management utilities for cart and anonymous users
 */

const SESSION_ID_KEY = 'cart_session_id';

/**
 * Get or create a session ID for anonymous cart tracking
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    // Generate a new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Clear the session ID (e.g., when user logs in or cart is merged)
 */
export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_ID_KEY);
  }
}

/**
 * Check if a session ID exists
 */
export function hasSessionId(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem(SESSION_ID_KEY);
}
