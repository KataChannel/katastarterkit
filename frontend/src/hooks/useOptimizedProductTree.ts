/**
 * useOptimizedProductTree - Hook tối ưu cho Product Tree View
 * 
 * Features:
 * - Server-side search với debounce
 * - Lazy loading products theo category
 * - Virtual scrolling support
 * - Cache optimization
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Custom debounce function
function createDebouncedFn<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T & { cancel: () => void };
  
  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debouncedFn;
}

// ===== GraphQL Queries =====

// Query lấy categories với product count (không lấy products)
export const GET_CATEGORIES_WITH_COUNT = gql`
  query GetCategoriesWithCount($input: GetCategoriesInput) {
    categories(input: $input) {
      items {
        id
        name
        slug
        description
        image
        isActive
        displayOrder
        productCount
      }
      total
      page
      limit
      totalPages
    }
  }
`;

// Query tìm kiếm sản phẩm server-side (optimized)
export const SEARCH_PRODUCTS_OPTIMIZED = gql`
  query SearchProductsOptimized($input: GetProductsInput) {
    products(input: $input) {
      items {
        id
        name
        slug
        sku
        price
        stock
        unit
        status
        thumbnail
        isFeatured
        category {
          id
          name
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

// Query lấy products theo category (lazy load)
export const GET_PRODUCTS_BY_CATEGORY_LIGHT = gql`
  query GetProductsByCategoryLight($categoryId: ID!, $input: GetProductsInput) {
    productsByCategory(categoryId: $categoryId, input: $input) {
      items {
        id
        name
        slug
        sku
        price
        stock
        unit
        status
        thumbnail
        isFeatured
      }
      total
      page
      limit
      totalPages
    }
  }
`;

// ===== Types =====

export interface TreeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
}

export interface TreeProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  stock: number;
  unit?: string;
  status: string;
  thumbnail?: string;
  isFeatured?: boolean;
  category?: {
    id: string;
    name: string;
  };
}

export interface TreeNode {
  id: string;
  type: 'category';
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
  products: TreeProduct[];
  isLoading?: boolean;
  isLoaded?: boolean;
  data: TreeCategory | null;
}

export interface UseOptimizedProductTreeOptions {
  initialExpandedCategories?: string[];
  searchDebounceMs?: number;
  productsPerCategory?: number;
}

export interface UseOptimizedProductTreeReturn {
  // Data
  treeData: TreeNode[];
  searchResults: TreeProduct[];
  isSearchMode: boolean;
  
  // Loading states
  loading: boolean;
  searchLoading: boolean;
  
  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  
  // Category expansion
  expandedCategories: Set<string>;
  toggleCategory: (categoryId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Stats
  stats: {
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
    draftProducts: number;
    featuredProducts: number;
    outOfStock: number;
  };
  
  // Actions
  refetch: () => void;
  loadCategoryProducts: (categoryId: string) => void;
}

// ===== Hook Implementation =====

export function useOptimizedProductTree(
  options: UseOptimizedProductTreeOptions = {}
): UseOptimizedProductTreeReturn {
  const {
    initialExpandedCategories = [],
    searchDebounceMs = 300,
    productsPerCategory = 50,
  } = options;

  // State
  const [searchTerm, setSearchTermInternal] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(initialExpandedCategories)
  );
  const [loadedCategories, setLoadedCategories] = useState<Map<string, TreeProduct[]>>(new Map());
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());

  // Debounced search
  const debouncedSetSearch = useRef(
    createDebouncedFn((term: string) => {
      setDebouncedSearchTerm(term);
    }, searchDebounceMs)
  ).current;

  // Set search with debounce
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermInternal(term);
    debouncedSetSearch(term);
  }, [debouncedSetSearch]);

  const clearSearch = useCallback(() => {
    setSearchTermInternal('');
    setDebouncedSearchTerm('');
  }, []);

  // Fetch categories (always)
  const { 
    data: categoriesData, 
    loading: categoriesLoading, 
    refetch: refetchCategories 
  } = useQuery(GET_CATEGORIES_WITH_COUNT, {
    variables: {
      input: {
        limit: 100,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  // Search products (only when searching)
  const { 
    data: searchData, 
    loading: searchLoading,
    refetch: refetchSearch 
  } = useQuery(SEARCH_PRODUCTS_OPTIMIZED, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        filters: {
          search: debouncedSearchTerm,
        },
      },
    },
    skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  // Lazy query for loading category products
  const [loadCategoryProductsQuery] = useLazyQuery(GET_PRODUCTS_BY_CATEGORY_LIGHT, {
    fetchPolicy: 'cache-and-network',
  });

  // Load products for a specific category
  const loadCategoryProducts = useCallback(async (categoryId: string) => {
    if (loadedCategories.has(categoryId) || loadingCategories.has(categoryId)) {
      return;
    }

    setLoadingCategories(prev => new Set(prev).add(categoryId));

    try {
      const { data } = await loadCategoryProductsQuery({
        variables: {
          categoryId,
          input: {
            page: 1,
            limit: productsPerCategory,
          },
        },
      });

      if (data?.productsByCategory?.items) {
        setLoadedCategories(prev => {
          const newMap = new Map(prev);
          newMap.set(categoryId, data.productsByCategory.items);
          return newMap;
        });
      }
    } finally {
      setLoadingCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  }, [loadedCategories, loadingCategories, loadCategoryProductsQuery, productsPerCategory]);

  // Toggle category expansion & lazy load
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
        // Lazy load products when expanding
        if (!loadedCategories.has(categoryId)) {
          loadCategoryProducts(categoryId);
        }
      }
      return newSet;
    });
  }, [loadedCategories, loadCategoryProducts]);

  // Expand all
  const expandAll = useCallback(() => {
    const categories = categoriesData?.categories?.items || [];
    const allIds = categories.map((c: TreeCategory) => c.id);
    setExpandedCategories(new Set(allIds));
    
    // Lazy load all categories
    allIds.forEach((id: string) => {
      if (!loadedCategories.has(id)) {
        loadCategoryProducts(id);
      }
    });
  }, [categoriesData, loadedCategories, loadCategoryProducts]);

  // Collapse all
  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Refetch all
  const refetch = useCallback(() => {
    refetchCategories();
    setLoadedCategories(new Map());
    if (debouncedSearchTerm) {
      refetchSearch();
    }
  }, [refetchCategories, refetchSearch, debouncedSearchTerm]);

  // Build tree data
  const treeData = useMemo<TreeNode[]>(() => {
    const categories = categoriesData?.categories?.items || [];
    
    return categories.map((category: TreeCategory) => ({
      id: category.id,
      type: 'category' as const,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      displayOrder: category.displayOrder || 0,
      productCount: category.productCount || 0,
      products: loadedCategories.get(category.id) || [],
      isLoading: loadingCategories.has(category.id),
      isLoaded: loadedCategories.has(category.id),
      data: category,
    })).sort((a: TreeNode, b: TreeNode) => a.displayOrder - b.displayOrder);
  }, [categoriesData, loadedCategories, loadingCategories]);

  // Search results
  const searchResults = useMemo<TreeProduct[]>(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      return [];
    }
    return searchData?.products?.items || [];
  }, [searchData, debouncedSearchTerm]);

  // Stats (from categories, not products)
  const stats = useMemo(() => {
    const categories = categoriesData?.categories?.items || [];
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum: number, c: TreeCategory) => sum + (c.productCount || 0), 0);

    // Count from search results if available
    const searchItems = searchData?.products?.items || [];
    const activeProducts = searchItems.filter((p: TreeProduct) => p.status === 'ACTIVE').length || 0;
    const draftProducts = searchItems.filter((p: TreeProduct) => p.status === 'DRAFT').length || 0;
    const featuredProducts = searchItems.filter((p: TreeProduct) => p.isFeatured).length || 0;
    const outOfStock = searchItems.filter((p: TreeProduct) => p.stock <= 0).length || 0;

    return {
      totalProducts,
      totalCategories,
      activeProducts,
      draftProducts,
      featuredProducts,
      outOfStock,
    };
  }, [categoriesData, searchData]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  return {
    treeData,
    searchResults,
    isSearchMode: debouncedSearchTerm.length >= 2,
    loading: categoriesLoading,
    searchLoading,
    searchTerm,
    setSearchTerm,
    clearSearch,
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll,
    stats,
    refetch,
    loadCategoryProducts,
  };
}

export default useOptimizedProductTree;
