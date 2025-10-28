import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $page: Int
    $pageSize: Int
    $search: String
    $categoryId: String
  ) {
    products(
      page: $page
      pageSize: $pageSize
      search: $search
      categoryId: $categoryId
    ) {
      items {
        id
        name
        slug
        description
        shortDesc
        price
        originalPrice
        sku
        stock
        unit
        status
        images {
          id
          url
          alt
          isPrimary
        }
        category {
          id
          name
          slug
        }
        tags {
          id
          name
          slug
        }
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      description
      shortDesc
      price
      originalPrice
      costPrice
      sku
      barcode
      stock
      minStock
      maxStock
      unit
      status
      images {
        id
        url
        alt
        isPrimary
        order
      }
      category {
        id
        name
        slug
        description
      }
      tags {
        id
        name
        slug
        description
      }
      variants {
        id
        name
        sku
        price
        stock
        options
      }
      metaFields
      seoTitle
      seoDescription
      seoKeywords
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      shortDesc
      price
      originalPrice
      costPrice
      sku
      barcode
      stock
      minStock
      maxStock
      unit
      status
      images {
        id
        url
        alt
        isPrimary
        order
      }
      category {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
      variants {
        id
        name
        sku
        price
        stock
        options
      }
      metaFields
      seoTitle
      seoDescription
      seoKeywords
      createdAt
      updatedAt
    }
  }
`;
