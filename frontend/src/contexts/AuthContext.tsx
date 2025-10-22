import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_USER, LOGIN_MUTATION, REGISTER_MUTATION } from '../lib/graphql/queries';

interface User {
  id: string;
  email: string;
  username: string;
  roleType?: string;
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

  const [getCurrentUser, { data: currentUserData, error: currentUserError }] = useLazyQuery(GET_CURRENT_USER);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  // Handle current user data updates
  useEffect(() => {
    if (currentUserData?.getMe) {
      setUser(currentUserData.getMe);
      setLoading(false);
    } else if (currentUserError) {
      console.error('AuthContext - getCurrentUser error:', currentUserError);
      
      // Only remove token for authentication-related errors
      const networkError = currentUserError.networkError as any;
      const isAuthError = networkError?.statusCode === 401 ||
                         networkError?.status === 401 ||
                         currentUserError.graphQLErrors?.some(err => 
                           err.extensions?.code === 'UNAUTHENTICATED' || 
                           err.extensions?.code === 'FORBIDDEN' ||
                           err.message?.includes('Unauthorized') ||
                           err.message?.includes('jwt') ||
                           err.message?.includes('accessToken')
                         );

      if (isAuthError) {
        console.log('Authentication error detected, removing all auth data');
        // Clear ALL auth-related data at once to prevent confusion
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        console.log('Non-authentication error, keeping token');
        // For network errors or other issues, don't remove token
        // but still set loading to false
      }
      setLoading(false);
    }
  }, [currentUserData, currentUserError]);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [getCurrentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data } = await loginMutation({
        variables: { 
          input: {
            emailOrUsername: email,
            password: password
          }
        },
      });

      if (data?.loginUser?.accessToken) {
        const token = data.loginUser.accessToken;
        localStorage.setItem('accessToken', token);
        
        // Also notify apollo client of the token change
        // This ensures apollo-client can use the new token immediately
        if (typeof window !== 'undefined') {
          // Dispatch a storage event to notify other parts of the app
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'accessToken',
            newValue: token,
            storageArea: localStorage,
          }));
        }
        
        // Refresh user data
        getCurrentUser();
        return { success: true };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data } = await registerMutation({
        variables: { 
          input: {
            email: email,
            password: password,
            username: username
          }
        },
      });

      if (data?.registerUser?.accessToken) {
        const token = data.registerUser.accessToken;
        localStorage.setItem('accessToken', token);
        
        // Also notify apollo client of the token change
        if (typeof window !== 'undefined') {
          // Dispatch a storage event to notify other parts of the app
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'accessToken',
            newValue: token,
            storageArea: localStorage,
          }));
        }
        
        // Refresh user data
        getCurrentUser();
        return { success: true };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    // Clear ALL auth-related data at once to ensure clean state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
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
