/**
 * Order Management GraphQL Queries & Mutations
 * Chứa tất cả GraphQL operations cho order management
 */

import { gql } from '@apollo/client';

// ================================
// Queries
// ================================

export const LIST_ORDERS = gql`
  query ListOrders($filter: OrderFilterInput, $pagination: PaginationInput) {
    listOrders(filter: $filter, pagination: $pagination) {
      orders {
        id
        orderNumber
        status
        paymentStatus
        total
        shippingMethod
        createdAt
        updatedAt
        user {
          id
          email
          firstName
          lastName
        }
        shippingAddress {
          fullName
          phone
          city
          district
          ward
          streetAddress
        }
        items {
          id
          quantity
          price
          product {
            id
            name
            slug
            images {
              url
            }
          }
        }
      }
      total
      hasMore
      page
      limit
    }
  }
`;

export const GET_ORDER_STATS = gql`
  query GetOrderStatistics {
    getOrderStatistics {
      totalOrders
      totalRevenue
      pendingOrders
      processingOrders
      completedOrders
      cancelledOrders
      averageOrderValue
    }
  }
`;

export const GET_ORDER_DETAIL = gql`
  query GetOrderDetail($orderId: ID!) {
    getOrder(orderId: $orderId) {
      id
      orderNumber
      status
      paymentStatus
      paymentMethod
      total
      subtotal
      shippingCost
      taxAmount
      discountAmount
      shippingMethod
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        phone
      }
      shippingAddress {
        fullName
        phone
        email
        city
        district
        ward
        streetAddress
        postalCode
      }
      billingAddress {
        fullName
        phone
        email
        city
        district
        ward
        streetAddress
        postalCode
      }
      items {
        id
        quantity
        price
        total
        product {
          id
          name
          slug
          sku
          images {
            url
            alt
          }
        }
      }
      tracking {
        id
        carrier
        trackingNumber
        status
        estimatedDelivery
        createdAt
        events {
          id
          status
          location
          description
          timestamp
        }
      }
      notes {
        id
        content
        type
        createdBy
        createdAt
      }
      history {
        id
        action
        description
        createdBy
        createdAt
      }
    }
  }
`;

// ================================
// Mutations
// ================================

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      success
      message
      order {
        id
        status
        updatedAt
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!, $reason: String) {
    cancelOrder(orderId: $orderId, reason: $reason) {
      success
      message
      order {
        id
        status
        updatedAt
      }
    }
  }
`;

export const ADD_ORDER_NOTE = gql`
  mutation AddOrderNote($input: AddOrderNoteInput!) {
    addOrderNote(input: $input) {
      success
      message
      note {
        id
        content
        type
        createdBy
        createdAt
      }
    }
  }
`;

export const UPDATE_TRACKING = gql`
  mutation UpdateTracking($input: UpdateTrackingInput!) {
    updateTracking(input: $input) {
      success
      message
      tracking {
        id
        carrier
        trackingNumber
        status
        estimatedDelivery
      }
    }
  }
`;
