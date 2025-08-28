import {
  ApolloCl// WebSocket Link for subscriptions - completely disabled in development
const wsLink = null; // Temporarily disabled due to connection issueshe,
  createHttpLink,
  from,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:14000/graphql',
  credentials: 'include',
});

// WebSocket Link for subscriptions - conditional creation
const wsLink = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' 
  ? new GraphQLWsLink(createClient({
      url: process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:14000/graphql',
      connectionParams: () => {
        const token = localStorage.getItem('token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
      shouldRetry: (errOrCloseEvent) => {
        console.log('🔄 WebSocket retry decision for:', errOrCloseEvent);
        return true;
      },
      on: {
        connected: () => console.log('� WebSocket connected'),
        error: (error) => console.log('⚠️ WebSocket error:', error),
        closed: () => console.log('❌ WebSocket closed'),
      },
    }))
  : null; // Disable WebSocket in development

// Auth Link - adds JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle specific GraphQL errors
      if (message === 'Bad Request Exception') {
        console.warn('🚨 Bad request - check query syntax and variables');
      }
      
      if (message === 'Forbidden resource') {
        console.warn('🔐 Authentication issue - redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
});

// Split link for handling subscriptions vs queries/mutations
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

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (args?.pagination?.page === 1) {
                return incoming;
              }
              return {
                ...incoming,
                items: [...(existing?.items || []), ...(incoming?.items || [])],
              };
            },
          },
        },
      },
      Post: {
        fields: {
          comments: {
            merge(existing = [], incoming) {
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
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to get authenticated client
export const getAuthenticatedClient = () => {
  return apolloClient;
};

// Helper function to clear cache and token
export const logout = async () => {
  localStorage.removeItem('token');
  await apolloClient.clearStore();
  window.location.href = '/login';
};
