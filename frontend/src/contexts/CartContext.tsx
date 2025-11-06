'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/graphql/ecommerce.queries';
import { useAuth } from '@/contexts/AuthContext';

interface CartContextType {
  cart: any;
  loading: boolean;
  error: any;
  itemCount: number;
  total: number;
  refetch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_CART, {
    fetchPolicy: 'cache-and-network',
    skip: !isAuthenticated,
  });

  const cart = data?.cart || data?.getCart;
  // Use backend's itemCount if available, fallback to items.length
  const itemCount = cart?.itemCount ?? cart?.items?.length ?? 0;
  const total = cart?.total || 0;

  const value: CartContextType = {
    cart,
    loading,
    error,
    itemCount,
    total,
    refetch,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
