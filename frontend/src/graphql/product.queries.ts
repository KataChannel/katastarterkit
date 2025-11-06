/**
 * DEPRECATED: GraphQL has been removed from this project
 * This file provides backward compatibility stubs
 * 
 * Migration Guide:
 * - Replace with Server Actions from @/actions/products
 * - Or use REST API: /api/products
 */

// Product type definition
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  image?: string;
  images?: string[];
  category?: {
    id: string;
    name: string;
  };
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// GraphQL query stubs - return empty strings
export const GET_PRODUCTS = `
  # DEPRECATED: Use Server Action getProducts() from @/actions/products
  query GetProducts { products { id } }
`;

export const GET_FEATURED_PRODUCTS = `
  # DEPRECATED: Use Server Action getProducts({ where: { featured: true } })
  query GetFeaturedProducts { products(where: { featured: true }) { id } }
`;

export const GET_PRODUCT_BY_SLUG = `
  # DEPRECATED: Use Server Action getProductBySlug(slug)
  query GetProductBySlug($slug: String!) { product(slug: $slug) { id } }
`;

export const PRODUCT_FULL_FRAGMENT = `
  # DEPRECATED: Product fragment no longer needed with Prisma
  fragment ProductFull on Product { id }
`;

console.warn('⚠️ @/graphql/product.queries is deprecated. Use @/actions/products instead.');
