/**
 * Custom hooks for Menu operations
 * STUB VERSION - GraphQL removed, awaiting Server Actions implementation
 * 
 * @deprecated These hooks are stubs. Implement with Server Actions or API Routes.
 */

'use client';

import { useCallback } from 'react';

// Stub types
interface Menu {
  id: string;
  title: string;
  slug: string;
  url?: string;
  path?: string;
  route?: string;
  externalUrl?: string;
  icon?: string;
  type?: string;
  order?: number;
  level?: number;
  parentId?: string | null;
  isActive?: boolean;
  isVisible?: boolean;
  isPublic?: boolean;
  isProtected?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  badge?: string;
  badgeColor?: string;
  target?: string;
  description?: string;
  iconType?: string;
  cssClass?: string;
  customData?: any;
  metadata?: any;
  children?: Menu[];
}

interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[];
}

// Stub error type
class StubError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StubError';
  }
}

// ==================== QUERY HOOKS ====================

/**
 * Hook to get all menus with filters
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useMenus(params?: {
  where?: any;
  orderBy?: any;
  pagination?: { page: number; limit: number };
  select?: any;
}) {
  console.warn('useMenus is a stub. Implement with Server Actions or API Routes.');
  
  return {
    menus: [],
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get user's accessible menus based on roles/permissions
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useMyMenus(type?: string) {
  console.warn('useMyMenus is a stub. Implement with Server Actions or API Routes.');
  
  return {
    menus: [],
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get sidebar menus for authenticated users
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useAdminMenus() {
  console.warn('useAdminMenus is a stub. Implement with Server Actions or API Routes.');
  
  return {
    menus: [],
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get public sidebar menus (no authentication required)
 * @deprecated Stub implementation - replace with Server Actions
 */
export function usePublicSidebarMenus() {
  console.warn('usePublicSidebarMenus is a stub. Implement with Server Actions or API Routes.');
  
  return {
    tree: [],
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get menu tree structure
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useMenuTree(type?: string, parentId?: string) {
  console.warn('useMenuTree is a stub. Implement with Server Actions or API Routes.');
  
  return {
    tree: [],
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get single menu by ID
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useMenu(id: string) {
  console.warn('useMenu is a stub. Implement with Server Actions or API Routes.');
  
  return {
    menu: null,
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get single menu by slug
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useMenuBySlug(slug: string) {
  console.warn('useMenuBySlug is a stub. Implement with Server Actions or API Routes.');
  
  return {
    menu: null,
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to count menus
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useMenuCount(where?: any) {
  console.warn('useMenuCount is a stub. Implement with Server Actions or API Routes.');
  
  return {
    count: 0,
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create menu
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useCreateMenu() {
  console.warn('useCreateMenu is a stub. Implement with Server Actions.');
  
  const createMenu = useCallback(
    async (menuData: Partial<Menu>) => {
      console.warn('createMenu called with:', menuData);
      return { data: null };
    },
    []
  );

  return {
    createMenu,
    data: null,
    loading: false,
    error: null,
  };
}

/**
 * Hook to update menu
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useUpdateMenu() {
  console.warn('useUpdateMenu is a stub. Implement with Server Actions.');
  
  const updateMenu = useCallback(
    async (id: string, menuData: Partial<Menu>) => {
      console.warn('updateMenu called with:', id, menuData);
      return { data: null };
    },
    []
  );

  return {
    updateMenu,
    data: null,
    loading: false,
    error: null,
  };
}

/**
 * Hook to delete menu
 * @deprecated Stub implementation - replace with Server Actions
 */
export function useDeleteMenu() {
  console.warn('useDeleteMenu is a stub. Implement with Server Actions.');
  
  const deleteMenu = useCallback(
    async (id: string) => {
      console.warn('deleteMenu called with:', id);
      return { data: null };
    },
    []
  );

  return {
    deleteMenu,
    data: null,
    loading: false,
    error: null,
  };
}
