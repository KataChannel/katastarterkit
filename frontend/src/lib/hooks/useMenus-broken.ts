/**
 * Custom hooks for Menu operations using Universal Dynamic Query System
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { DYNAMIC_FIND_MANY } from '../graphql/universal-dynamic-queries';
import {
  buildMenuFindManyInput,
  buildMenuFindUniqueInput,
  buildMenuCreateInput,
  buildMenuUpdateInput,
  buildMenuDeleteInput,
  buildMenuCountInput,
  buildMenuTree,
  getMenusByTypeWhere,
  getActiveMenusWhere,
  getPublicMenusWhere,
  getRootMenusWhere,
  DEFAULT_MENU_SELECT,
  type Menu,
  type MenuTreeNode,
} from '../graphql/menu-dynamic-queries';

// ==================== QUERY HOOKS ====================

/**
 * Hook to get all menus with filters
 */
export function useMenus(params?: {
  where?: any;
  orderBy?: any;
  pagination?: { page: number; limit: number };
  select?: any;
}) {
  const input = buildMenuFindManyInput({
    where: params?.where || getActiveMenusWhere(),
    select: params?.select || DEFAULT_MENU_SELECT,
    orderBy: params?.orderBy,
    pagination: params?.pagination,
  });

  const { data, loading, error, refetch } = useQuery(DYNAMIC_FIND_MANY, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });

  const menus = useMemo(() => {
    try {
      const result = data?.dynamicFindMany?.data;
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  }, [data]);

  return {
    menus,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get user's accessible menus based on roles/permissions
 * Note: Backend needs to implement permission filtering in myMenus resolver
 */
export function useMyMenus(type?: string) {
  const where = type ? getMenusByTypeWhere(type) : getActiveMenusWhere();
  
  const input = buildMenuFindManyInput({
    where,
    select: DEFAULT_MENU_SELECT,
    orderBy: { order: 'asc', level: 'asc' },
  });

  const { data, loading, error, refetch } = useQuery(DYNAMIC_FIND_MANY, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });

  const menus = useMemo(() => {
    try {
      const result = data?.dynamicFindMany?.data;
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  }, [data]);

  return {
    menus,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get sidebar menus for authenticated users
 * Builds tree structure from flat array and transforms to NavigationItem format
 */
export function useAdminMenus() {
  const input = buildMenuFindManyInput({
    where: getMenusByTypeWhere('SIDEBAR'),
    select: DEFAULT_MENU_SELECT,
    orderBy: { order: 'asc', level: 'asc' },
  });
  
  const { data, loading, error, refetch } = useQuery(DYNAMIC_FIND_MANY, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });
  
  const transformMenu = useCallback((menu: MenuTreeNode): any => {
    if (!menu) return null;

    // Determine href priority: externalUrl > route > url > path > /slug
    // If externalUrl exists, use it; otherwise fall back to internal routes
    const href = menu.externalUrl || menu.route || menu.url || menu.path || `/${menu.slug}`;
    const isExternal = !!menu.externalUrl;
    return {
      name: menu.title,
      href: href,
      icon: menu.icon || undefined, // Icon string (e.g., "LayoutDashboard")
      children: menu.children?.map(transformMenu).filter(Boolean) || undefined,
      badge: menu.badge || undefined,
      badgeColor: menu.badgeColor || undefined,
      target: menu.target || 'SELF',
      metadata: {
        id: menu.id,
        type: menu.type,
        order: menu.order,
        level: menu.level,
        isProtected: menu.isProtected,
        isActive: menu.isActive,
        isVisible: menu.isVisible,
        isPublic: menu.isPublic,
        slug: menu.slug,
        description: menu.description,
        iconType: menu.iconType,
        cssClass: menu.cssClass,
        customData: menu.customData,
        externalUrl: menu.externalUrl,
        isExternal: isExternal,
        ...menu.metadata, // Merge any additional metadata from database
      },
    };
  }, []);

  const menus = useMemo(() => {
    try {
      const result = data?.dynamicFindMany?.data as Menu[] | undefined;
      if (!result || !Array.isArray(result)) return [];
      
      // Build tree from flat array
      const tree = buildMenuTree(result);
      
      // Transform to sidebar format (NavigationItem[])
      return tree.map(transformMenu).filter(Boolean);
    } catch (err) {
      console.error('Error transforming menus:', err);
      return [];
    }
  }, [data, transformMenu]);
  
  return {
    menus,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get public sidebar menus (no authentication required)
 */
export function usePublicSidebarMenus() {
  const input = buildMenuFindManyInput({
    where: {
      ...getPublicMenusWhere(),
      type: 'SIDEBAR',
    },
    select: DEFAULT_MENU_SELECT,
    orderBy: { order: 'asc', level: 'asc' },
  });

  const { data, loading, error, refetch } = useDynamicFindMany<Menu>(input, {
    fetchPolicy: 'cache-and-network',
  });

  const menus = useMemo(() => {
    const result = data?.dynamicFindMany?.data as Menu[] | undefined;
    if (!result || !Array.isArray(result)) return [];
    return buildMenuTree(result);
  }, [data]);
  
  return {
    menus,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get menu tree structure
 */
export function useMenuTree(type?: string, parentId?: string) {
  const where = parentId
    ? { parentId, isActive: true, isVisible: true }
    : getRootMenusWhere(type);

  const input = buildMenuFindManyInput({
    where,
    select: DEFAULT_MENU_SELECT,
    orderBy: { order: 'asc', level: 'asc' },
  });

  const { data, loading, error, refetch } = useDynamicFindMany<Menu>(input, {
    fetchPolicy: 'cache-and-network',
  });

  const tree = useMemo(() => {
    const result = data?.dynamicFindMany?.data as Menu[] | undefined;
    if (!result || !Array.isArray(result)) return [];
    return buildMenuTree(result);
  }, [data]);

  return {
    tree,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get single menu by ID
 */
export function useMenu(id: string) {
  const input = buildMenuFindUniqueInput({
    where: { id },
    select: DEFAULT_MENU_SELECT,
  });

  const { data, loading, error, refetch } = useDynamicFindUnique<Menu>(input, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    menu: data?.dynamicFindUnique,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get single menu by slug
 */
export function useMenuBySlug(slug: string) {
  const input = buildMenuFindUniqueInput({
    where: { slug },
    select: DEFAULT_MENU_SELECT,
  });

  const { data, loading, error, refetch } = useDynamicFindUnique<Menu>(input, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    menu: data?.dynamicFindUnique,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to count menus
 */
export function useMenuCount(where?: any) {
  const input = buildMenuCountInput(where);

  const { data, loading, error, refetch } = useDynamicCount(input, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    count: data?.dynamicCount?.data || 0,
    loading,
    error,
    refetch,
  };
}

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create menu
 */
export function useCreateMenu() {
  const [mutate, { data, loading, error }] = useDynamicCreate();

  const createMenu = useCallback(
    async (menuData: Partial<Menu>) => {
      const input = buildMenuCreateInput(menuData);
      return mutate({ variables: { input } });
    },
    [mutate]
  );

  return {
    createMenu,
    data: data?.dynamicCreate,
    loading,
    error,
  };
}

/**
 * Hook to update menu
 */
export function useUpdateMenu() {
  const [mutate, { data, loading, error }] = useDynamicUpdate();

  const updateMenu = useCallback(
    async (id: string, menuData: Partial<Menu>) => {
      const input = buildMenuUpdateInput({ id }, menuData);
      return mutate({ variables: { input } });
    },
    [mutate]
  );

  return {
    updateMenu,
    data: data?.dynamicUpdate,
    loading,
    error,
  };
}

/**
 * Hook to delete menu
 */
export function useDeleteMenu() {
  const [mutate, { data, loading, error }] = useDynamicDelete();

  const deleteMenu = useCallback(
    async (id: string) => {
      const input = buildMenuDeleteInput({ id });
      return mutate({ variables: { input } });
    },
    [mutate]
  );

  return {
    deleteMenu,
    data: data?.dynamicDelete,
    loading,
    error,
  };
}
