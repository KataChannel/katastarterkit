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
 * Supports both admin and public queries
 */
export function useMenus(params?: {
  type?: string;
  menuId?: string;
  isActive?: boolean;
  includeChildren?: boolean;
  searchTerm?: string;
  where?: any; // For backward compatibility with Prisma-style queries
  orderBy?: any; // For backward compatibility
  isAdmin?: boolean; // If true, uses admin endpoint with auth
}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      
      // Extract search term from where clause if present
      let searchTerm = params?.searchTerm;
      let type = params?.type;
      
      if (params?.where) {
        // Handle Prisma-style where clause
        if (params.where.type) {
          type = params.where.type;
        }
        if (params.where.OR) {
          // Extract search term from OR clause
          const titleSearch = params.where.OR.find((item: any) => item.title?.contains);
          if (titleSearch) {
            searchTerm = titleSearch.title.contains;
          }
        }
      }
      
      // Use admin endpoint if specified (will be available after import)
      const data = params?.isAdmin 
        ? await (await import('@/actions/menu.actions')).getAdminMenus({
            type,
            menuId: params?.menuId,
            isActive: params?.isActive,
            includeChildren: params?.includeChildren ?? true,
            searchTerm,
          })
        : await getPublicMenus({
            type,
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
  }, [
    params?.type,
    params?.menuId,
    params?.isActive,
    params?.includeChildren,
    params?.searchTerm,
    params?.where,
    params?.isAdmin,
  ]);

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
 * Hook to create menu
 */
export function useCreateMenu() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const createMenu = useCallback(
    async (menuData: Partial<Menu>) => {
      try {
        setLoading(true);
        setError(null);
        
        const { createMenu: createMenuAction } = await import('@/actions/menu.actions');
        const result = await createMenuAction(menuData as any);
        
        return { data: result };
      } catch (err) {
        setError(err as Error);
        console.error('[useCreateMenu] Error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    createMenu,
    loading,
    error,
  };
}

/**
 * Hook to update menu
 */
export function useUpdateMenu() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const updateMenu = useCallback(
    async (id: string, menuData: Partial<Menu>) => {
      try {
        setLoading(true);
        setError(null);
        
        const { updateMenu: updateMenuAction } = await import('@/actions/menu.actions');
        const result = await updateMenuAction(id, menuData as any);
        
        return { data: result };
      } catch (err) {
        setError(err as Error);
        console.error('[useUpdateMenu] Error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    updateMenu,
    loading,
    error,
  };
}

/**
 * Hook to delete menu
 */
export function useDeleteMenu() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const deleteMenu = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const { deleteMenu: deleteMenuAction } = await import('@/actions/menu.actions');
        const result = await deleteMenuAction(id);
        
        return { data: result };
      } catch (err) {
        setError(err as Error);
        console.error('[useDeleteMenu] Error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    deleteMenu,
    loading,
    error,
  };
}
