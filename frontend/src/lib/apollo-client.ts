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

// Utility function to safely stringify objects for logging
const safeStringify = (obj: any, maxDepth = 3): string => {
  try {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      return value;
    }, 2);
  } catch (error) {
    return `[Unable to stringify: ${error}]`;
  }
};

// Check if we're in development mode for detailed logging
const isDevelopment = process.env.NODE_ENV === 'development';

// Enhanced logging function
const logError = (level: 'error' | 'warn' | 'info', message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] Apollo Client`;
  
  if (level === 'error') {
    console.error(`${prefix} ❌`, message, data ? safeStringify(data) : '');
  } else if (level === 'warn') {
    console.warn(`${prefix} ⚠️`, message, data ? safeStringify(data) : '');
  } else {
    console.info(`${prefix} ℹ️`, message, data ? safeStringify(data) : '');
  }
};

// Error context collector for debugging
const collectErrorContext = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    connection: (navigator as any).connection ? {
      effectiveType: (navigator as any).connection.effectiveType,
      downlink: (navigator as any).connection.downlink,
      rtt: (navigator as any).connection.rtt
    } : null,
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    language: navigator.language,
    platform: navigator.platform
  };
};

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
    const errorDetails = graphQLErrors.map(({ message, locations, path, extensions }) => {
      const errorInfo = {
        message,
        path,
        locations,
        extensions,
        operation: operation.operationName,
        variables: operation.variables,
        timestamp: new Date().toISOString()
      };

      // Handle specific GraphQL errors with actions
      if (message === 'Bad Request Exception') {
        logError('warn', '🚨 Bad request - check query syntax and variables', { message, path });
      }
      
      if (message === 'Forbidden resource' || message.includes('Forbidden')) {
        logError('warn', '🔐 Authentication issue - redirecting to login', { message, path });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      
      // Handle validation errors
      if (message.includes('validation') || message.includes('invalid')) {
        logError('warn', '📝 Validation error - check input data', { message, path });
      }
      
      // Handle authorization errors
      if (message.includes('unauthorized') || message.includes('not authorized')) {
        logError('warn', '🚫 Authorization error - insufficient permissions', { message, path });
      }

      return errorInfo;
    });

    // Log based on environment
    if (isDevelopment) {
      // console.group('🔍 [GraphQL Error Details]');
      // console.error('Context:', collectErrorContext());
      // graphQLErrors.forEach((error: any) => {
      //   console.error(`Error: ${error.message}`);
      //   if (error.extensions) {
      //     console.error('Extensions:', error.extensions);
      //   }
      //   if (error.path) {
      //     console.error('Path:', error.path);
      //   }
      //   if (error.locations) {
      //     console.error('Locations:', error.locations);
      //   }
      // });
      // console.groupEnd();
    } else {
      // Production logging - summarized with context
      const errorSummary = graphQLErrors.map((err: any) => ({
        message: err.message,
        code: err.extensions?.code,
        path: err.path
      }));
      logError('warn', 'GraphQL errors occurred', { 
        errors: errorSummary,
        context: collectErrorContext()
      });
    }
  }

  if (networkError) {
    // Create detailed error information
    const errorInfo = {
      type: networkError.name || 'NetworkError',
      message: networkError.message,
      operation: operation.operationName,
      variables: operation.variables,
      timestamp: new Date().toISOString()
    };

    // Add additional properties if available
    if ('statusCode' in networkError) {
      (errorInfo as any).statusCode = networkError.statusCode;
    }
    if ('result' in networkError && networkError.result) {
      (errorInfo as any).result = networkError.result;
    }
    if ('response' in networkError && networkError.response) {
      (errorInfo as any).response = networkError.response;
    }
    if ('request' in networkError && networkError.request) {
      const request = networkError.request as any;
      (errorInfo as any).requestUrl = request?.url || 'N/A';
      (errorInfo as any).requestMethod = request?.method || 'N/A';
    }

    // Log based on environment
    if (isDevelopment) {
      console.group('🚨 [Network Error Details]');
      console.error('Error Info:', errorInfo);
      console.error('Context:', collectErrorContext());
      console.error('Full Error Object:', networkError);
      console.groupEnd();
    } else {
      // Production logging - less verbose but include context
      logError('error', 'Network error occurred', {
        ...errorInfo,
        context: collectErrorContext()
      });
    }
    
    // Handle WebSocket errors gracefully
    if (networkError.message?.includes('Socket closed') || 
        networkError.message?.includes('WebSocket')) {
      console.warn('🔌 WebSocket connection lost - will attempt to reconnect');
      // Don't redirect on WebSocket errors, just log
      return;
    }
    
    // Handle unauthorized errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      console.warn('🔐 Unauthorized access - redirecting to login');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    // Handle other common network errors
    if ('statusCode' in networkError) {
      const statusCode = networkError.statusCode;
      switch (statusCode) {
        case 403:
          console.warn('🚫 Forbidden - insufficient permissions');
          break;
        case 404:
          console.warn('❓ Resource not found');
          break;
        case 500:
          console.error('💥 Internal server error');
          break;
        case 502:
          console.error('🔧 Bad gateway - server might be down');
          break;
        case 503:
          console.error('⏰ Service unavailable - please try again later');
          break;
        default:
          console.error(`❌ HTTP Error ${statusCode}`);
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
