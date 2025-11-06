/**
 * AuthContext - Next.js Full-Stack Version
 * 
 * Updated to use Server Actions instead of Apollo Client + GraphQL
 * No longer requires separate NestJS backend
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as loginAction, 
  register as registerAction, 
  checkAuth as checkAuthAction,
  logout as logoutAction 
} from '@/actions/auth.actions';

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions?: Permission[];
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  resource?: string;
  action?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  roleType?: string;
  roles?: Role[];
  permissions?: Permission[];
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context for SSR/initial render to prevent errors
    // This allows components to render without throwing during hydration
    if (typeof window === 'undefined') {
      // Server-side: return a fallback context
      return {
        user: null,
        login: async () => ({}),
        register: async () => ({}),
        logout: () => {},
        loading: true,
        isAuthenticated: false,
      };
    }
    // Client-side: this should not happen if AuthProvider is properly set up
    console.warn('useAuth is being called outside of AuthProvider. This should not happen. Check your component tree.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('%c🔍 AuthContext - Checking existing session', 'color: #3498db; font-weight: bold;');
        
        const result = await checkAuthAction();
        
        if (result.authenticated && result.user) {
          console.log('%c✅ AuthContext - User authenticated successfully', 'color: #2ecc71; font-weight: bold;', result.user);
          setUser({
            ...result.user,
            roleType: result.user.roleType || 'USER',
            createdAt: new Date().toISOString(),
          } as User);
        } else {
          console.log('%c⚠️  AuthContext - No active session', 'color: #f39c12;');
          setUser(null);
        }
      } catch (error) {
        console.error('%c❌ AuthContext - Session check failed', 'color: #e74c3c; font-weight: bold;', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('%c🔐 Login attempt started', 'color: #3498db; font-weight: bold;', { 
        email, 
        timestamp: new Date().toISOString() 
      });

      const result = await loginAction({ username: email, password });

      if (result.success && result.user) {
        console.log('%c✅ Login successful', 'color: #2ecc71; font-weight: bold;', result.user);
        setUser({
          ...result.user,
          createdAt: new Date().toISOString(),
        } as User);
        return { success: true };
      } else {
        console.error('%c❌ Login failed', 'color: #e74c3c;', result.message);
        return { success: false, error: result.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('%c❌ Login error', 'color: #e74c3c; font-weight: bold;', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('%c📝 Registration attempt started', 'color: #3498db; font-weight: bold;', { 
        email, 
        username,
        timestamp: new Date().toISOString() 
      });

      const result = await registerAction({ username, email, password });

      if (result.success && result.user) {
        console.log('%c✅ Registration successful', 'color: #2ecc71; font-weight: bold;', result.user);
        setUser({
          ...result.user,
          email: result.user.email || email,
          createdAt: result.user.createdAt.toISOString(),
        } as User);
        return { success: true };
      } else {
        console.error('%c❌ Registration failed', 'color: #e74c3c;', result.message);
        return { success: false, error: result.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('%c❌ Registration error', 'color: #e74c3c; font-weight: bold;', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      console.log('%c🚪 Logout triggered', 'color: #e74c3c; font-weight: bold;', { 
        user: user?.email,
        timestamp: new Date().toISOString() 
      });

      await logoutAction();
      
      console.log('%c✅ Logout successful', 'color: #2ecc71;');
      setUser(null);
    } catch (error) {
      console.error('%c❌ Logout error', 'color: #e74c3c;', error);
      // Even if logout fails on server, clear local state
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
