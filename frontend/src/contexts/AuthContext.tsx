import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_USER, LOGIN_MUTATION, REGISTER_MUTATION } from '../lib/graphql/queries';

interface User {
  id: string;
  email: string;
  username: string;
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
      // If there's an error fetching user data, clear the token and user
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [currentUserData, currentUserError]);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [getCurrentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login?.token) {
        localStorage.setItem('token', data.login.token);
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
        variables: { email, password, username },
      });

      if (data?.register?.token) {
        localStorage.setItem('token', data.register.token);
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
    localStorage.removeItem('token');
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
