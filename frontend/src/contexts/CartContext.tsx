'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/graphql/ecommerce.queries';
import { useCartSession } from '@/hooks/useCartSession';

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
  const { sessionId, isInitialized } = useCartSession();

  const { data, loading, error, refetch } = useQuery(GET_CART, {
    variables: sessionId ? { sessionId } : undefined,
    fetchPolicy: 'cache-and-network',
    skip: !isInitialized, // Wait for session to initialize
    notifyOnNetworkStatusChange: true, // Important for refetch updates
  });

  const cart = data?.cart || data?.getCart;
  // Use backend's itemCount if available, fallback to items.length
  // Handle both null cart and empty cart
  const itemCount = cart?.itemCount ?? cart?.items?.length ?? 0;
  const total = cart?.total ?? 0;

  const value: CartContextType = {
    cart: cart || null,
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
