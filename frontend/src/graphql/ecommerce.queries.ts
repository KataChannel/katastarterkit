import { gql } from '@apollo/client';

// ============================================================================
// PRODUCT QUERIES
// ============================================================================

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput, $pagination: PaginationInput) {
    products(filter: $filter, pagination: $pagination) {
      products {
        id
        name
        slug
        description
        shortDescription
        originalPrice
        compareAtPrice
        discount
        finalPrice
        stock
        lowStockThreshold
        images
        featuredImage
        category {
          id
          name
          slug
        }
        tags {
          id
          name
        }
        variants {
          id
          name
          sku
          price
          stock
          attributes
        }
        isFeatured
        isActive
        rating
        reviewCount
        viewCount
        createdAt
      }
      total
      hasMore
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
      shortDescription
      originalPrice
      compareAtPrice
      discount
      finalPrice
      stock
      lowStockThreshold
      images
      featuredImage
      category {
        id
        name
        slug
      }
      tags {
        id
        name
      }
      variants {
        id
        name
        sku
        price
        stock
        attributes
        images
      }
      specifications
      features
      isFeatured
      isActive
      rating
      reviewCount
      viewCount
      relatedProducts {
        id
        name
        slug
        finalPrice
        featuredImage
        rating
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($limit: Int) {
    featuredProducts(limit: $limit) {
      id
      name
      slug
      shortDescription
      originalPrice
      finalPrice
      discount
      featuredImage
      rating
      reviewCount
      stock
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories {
      id
      name
      slug
      description
      image
      parentId
      children {
        id
        name
        slug
      }
      _count {
        products
      }
    }
  }
`;

// ============================================================================
// CART QUERIES & MUTATIONS
// ============================================================================

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      items {
        id
        quantity
        price
        product {
          id
          name
          slug
          finalPrice
          featuredImage
          stock
        }
        variant {
          id
          name
          price
          stock
        }
      }
      totalItems
      subtotal
      discount
      total
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      success
      message
      cart {
        id
        items {
          id
          quantity
          price
          product {
            id
            name
            featuredImage
          }
        }
        totalItems
        total
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($itemId: ID!, $quantity: Int!) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      success
      message
      cart {
        id
        items {
          id
          quantity
          price
        }
        totalItems
        total
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      success
      message
      cart {
        id
        totalItems
        total
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      success
      message
    }
  }
`;

// ============================================================================
// ORDER QUERIES & MUTATIONS
// ============================================================================

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        id
        orderNumber
        status
        total
        paymentMethod
        shippingAddress {
          fullName
          phone
          address
        }
        items {
          id
          quantity
          price
          product {
            name
            featuredImage
          }
        }
        createdAt
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($orderId: ID!) {
    order(orderId: $orderId) {
      id
      orderNumber
      status
      paymentStatus
      shippingStatus
      subtotal
      discount
      shippingFee
      total
      paymentMethod
      shippingMethod
      shippingAddress {
        fullName
        phone
        email
        address
        city
        district
        ward
      }
      billingAddress {
        fullName
        phone
        email
        address
      }
      items {
        id
        quantity
        price
        product {
          name
          slug
          featuredImage
        }
        variant {
          name
        }
      }
      tracking {
        trackingNumber
        status
        events {
          status
          description
          location
          eventTime
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders($filter: OrderFilterInput, $pagination: PaginationInput) {
    myOrders(filter: $filter, pagination: $pagination) {
      orders {
        id
        orderNumber
        status
        total
        itemCount
        createdAt
      }
      total
      hasMore
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!, $reason: String!) {
    cancelOrder(orderId: $orderId, reason: $reason) {
      success
      message
      order {
        id
        status
      }
    }
  }
`;

// ============================================================================
// REVIEW QUERIES & MUTATIONS
// ============================================================================

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!, $pagination: PaginationInput) {
    productReviews(productId: $productId, pagination: $pagination) {
      reviews {
        id
        rating
        comment
        images
        user {
          email
          profile {
            fullName
            avatar
          }
        }
        createdAt
      }
      total
      averageRating
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      success
      message
      review {
        id
        rating
        comment
      }
    }
  }
`;

// ============================================================================
// WISHLIST QUERIES & MUTATIONS
// ============================================================================

export const GET_WISHLIST = gql`
  query GetWishlist {
    wishlist {
      items {
        id
        product {
          id
          name
          slug
          finalPrice
          featuredImage
          stock
        }
        createdAt
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      success
      message
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      success
      message
    }
  }
`;
