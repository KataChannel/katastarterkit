import { gql } from '@apollo/client';

// ============================================================================
// FRAGMENTS
// ============================================================================

export const CATEGORY_BASIC_FRAGMENT = gql`
  fragment CategoryBasicFields on CategoryType {
    id
    name
    slug
    description
    image
    displayOrder
    isActive
    createdAt
  }
`;

export const CATEGORY_WITH_COUNT_FRAGMENT = gql`
  ${CATEGORY_BASIC_FRAGMENT}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`;

export const CATEGORY_TREE_FRAGMENT = gql`
  ${CATEGORY_WITH_COUNT_FRAGMENT}
  fragment CategoryTreeFields on CategoryType {
    ...CategoryWithCountFields
    parent {
      id
      name
      slug
    }
    children {
      ...CategoryWithCountFields
    }
  }
`;

// ============================================================================
// QUERIES
// ============================================================================

export const GET_CATEGORIES = gql`
  ${CATEGORY_WITH_COUNT_FRAGMENT}
  query GetCategories($input: GetCategoriesInput) {
    categories(input: $input) {
      items {
        ...CategoryWithCountFields
        parent {
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

export const GET_CATEGORY_TREE = gql`
  ${CATEGORY_TREE_FRAGMENT}
  query GetCategoryTree {
    categoryTree {
      ...CategoryTreeFields
      children {
        ...CategoryTreeFields
        children {
          ...CategoryWithCountFields
        }
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  ${CATEGORY_TREE_FRAGMENT}
  query GetCategory($id: String!) {
    category(id: $id) {
      ...CategoryTreeFields
    }
  }
`;

export const GET_CATEGORY_BY_SLUG = gql`
  ${CATEGORY_TREE_FRAGMENT}
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      ...CategoryTreeFields
    }
  }
`;

export const GET_ACTIVE_CATEGORIES = gql`
  ${CATEGORY_WITH_COUNT_FRAGMENT}
  query GetActiveCategories {
    categories(input: { 
      filters: { isActive: true }
      sortBy: "displayOrder"
      sortOrder: "asc"
    }) {
      items {
        ...CategoryWithCountFields
      }
      total
    }
  }
`;

// ============================================================================
// MUTATIONS
// ============================================================================

export const CREATE_CATEGORY = gql`
  ${CATEGORY_TREE_FRAGMENT}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryTreeFields
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  ${CATEGORY_TREE_FRAGMENT}
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryTreeFields
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;

// ============================================================================
// TYPES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: Category[];
  createdAt: string;
}

export interface PaginatedCategories {
  items: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
  parentId?: string;
  hasProducts?: boolean;
}

export interface GetCategoriesInput {
  filters?: CategoryFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeChildren?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  image?: string;
  parentId?: string;
  displayOrder?: number;
  isActive?: boolean;
}
