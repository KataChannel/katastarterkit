/**
 * Custom hooks for Menu operations
 * Migrated to use Server Actions
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { getPublicMenus } from '@/actions/menu.actions';

// Menu type from Prisma
interface Menu {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  order?: number;
  parentId?: string | null;
  menuId?: string;
  isActive?: boolean;
  target?: string;
  pageId?: string;
  metadata?: any;
  children?: Menu[];
}

interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[];
}

// ==================== QUERY HOOKS ====================

/**
 * Hook to get all menus with filters
 */
export function useMenus(params?: {
  type?: string;
  menuId?: string;
  isActive?: boolean;
  includeChildren?: boolean;
}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPublicMenus({
        type: params?.type,
        menuId: params?.menuId,
        isActive: params?.isActive ?? true,
        includeChildren: params?.includeChildren ?? true,
      });
      setMenus(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('[useMenus] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.type, params?.menuId, params?.isActive, params?.includeChildren]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return {
    menus,
    loading,
    error,
    refetch: fetchMenus,
  };
}

/**
 * Hook to get sidebar menus for authenticated users
 */
export function useAdminMenus() {
  return useMenus({ type: 'SIDEBAR', isActive: true, includeChildren: true });
}

/**
 * Hook to get public sidebar menus (no authentication required)
 */
export function usePublicSidebarMenus() {
  return useMenus({ type: 'SIDEBAR', isActive: true, includeChildren: true });
}

/**
 * Hook to get header menus
 */
export function useHeaderMenus() {
  return useMenus({ type: 'HEADER', isActive: true, includeChildren: true });
}

/**
 * Hook to get footer menus
 */
export function useFooterMenus() {
  return useMenus({ type: 'FOOTER', isActive: true, includeChildren: true });
}

/**
 * Hook to get menu tree structure
 */
export function useMenuTree(type?: string, parentId?: string) {
  const { menus, loading, error, refetch } = useMenus({ 
    type, 
    isActive: true, 
    includeChildren: true 
  });
  
  return {
    tree: menus,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get menu by ID (stub - needs implementation)
 */
export function useMenu(id: string) {
  console.warn('useMenu is a stub. Implement with Server Actions.');
  
  return {
    menu: null,
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get menu by slug (stub - needs implementation)
 */
export function useMenuBySlug(slug: string) {
  console.warn('useMenuBySlug is a stub. Implement with Server Actions.');
  
  return {
    menu: null,
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

/**
 * Hook to get menu count (stub - needs implementation)
 */
export function useMenuCount(where?: any) {
  console.warn('useMenuCount is a stub. Implement with Server Actions.');
  
  return {
    count: 0,
    loading: false,
    error: null,
    refetch: async () => {},
  };
}

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create menu (stub - needs implementation)
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
 * Hook to update menu (stub - needs implementation)
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
 * Hook to delete menu (stub - needs implementation)
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
