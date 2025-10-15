import { useMemo } from 'react';
import { Product, SortField, SortDirection, FilterStatus, ProductStats } from '../types';

interface UseProductFiltersProps {
  products: Product[];
  searchTerm: string;
  filterStatus: FilterStatus;
  sortField: SortField;
  sortDirection: SortDirection;
}

interface UseProductFiltersResult {
  filteredProducts: Product[];
  stats: ProductStats;
}

export const useProductFilters = ({
  products,
  searchTerm,
  filterStatus,
  sortField,
  sortDirection,
}: UseProductFiltersProps): UseProductFiltersResult => {
  return useMemo(() => {
    if (!Array.isArray(products)) {
      console.warn('Products data is not an array:', products);
      return { filteredProducts: [], stats: { total: 0, normalized: 0, pending: 0 } };
    }

    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((p: Product) => 
        p.ten?.toLowerCase().includes(term) ||
        p.ten2?.toLowerCase().includes(term) ||
        p.ma?.toLowerCase().includes(term) ||
        p.dvt?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus === 'normalized') {
      filtered = filtered.filter((p: Product) => p.ten2);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter((p: Product) => !p.ten2);
    }

    // Apply sorting
    filtered.sort((a: Product, b: Product) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null values
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      // Convert to comparable values
      if (sortField === 'dgia') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Calculate stats
    const statsData: ProductStats = {
      total: products.length,
      normalized: products.filter((p: Product) => p.ten2).length,
      pending: products.filter((p: Product) => !p.ten2).length,
    };

    return { filteredProducts: filtered, stats: statsData };
  }, [products, searchTerm, filterStatus, sortField, sortDirection]);
};
