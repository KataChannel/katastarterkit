import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// HTTP Link
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:14000/graphql',
});

// WebSocket Link for subscriptions - completely disabled in development
const wsLink = null; // Temporarily disabled due to connection issues

// Auth Link - adds authorization header
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  };
});

// Error Link - handles GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle specific GraphQL errors
      if (message === 'Bad Request Exception') {
        console.warn('🚨 Bad request - check query syntax and variables');
      }
      
      if (message === 'Forbidden resource') {
        console.warn('🔐 Authentication issue - redirecting to login');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle WebSocket errors gracefully
    if (networkError.message?.includes('Socket closed') || 
        networkError.message?.includes('WebSocket')) {
      console.warn('🔌 WebSocket connection lost - will attempt to reconnect');
      // Don't redirect on WebSocket errors, just log
      return;
    }
    
    // Handle unauthorized errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }
});

// Split based on operation type - only if WebSocket is available
const splitLink = wsLink 
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink)
    )
  : authLink.concat(httpLink); // Fallback to HTTP only

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            keyArgs: ['filters'],
            merge(existing, incoming, { args }) {
              if (args?.pagination?.page === 1) {
                // First page - replace existing
                return incoming;
              }
              // Subsequent pages - merge items
              return {
                ...incoming,
                items: [...(existing?.items || []), ...(incoming?.items || [])],
              };
            },
          },
          posts: {
            merge(existing, incoming, { args }) {
              // Simple replacement strategy
              return incoming;
            },
          },
          getPostById: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          tasks: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getTask: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
