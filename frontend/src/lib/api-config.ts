/**
 * API Configuration Helper
 * Provides consistent API base URL across the application
 * Syncs with Apollo Client GraphQL endpoint configuration
 */

/**
 * Get the base API URL from GraphQL endpoint
 * Removes '/graphql' suffix to get base URL for REST endpoints
 */
export const getApiBaseUrl = (): string => {
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:14000/graphql';
  return graphqlEndpoint.replace('/graphql', '');
};

/**
 * Get the GraphQL endpoint URL
 */
export const getGraphqlEndpoint = (): string => {
  return process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:14000/graphql';
};

/**
 * Get authentication token from localStorage
 * Uses 'accessToken' key to sync with Apollo Client
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

/**
 * Create authorization header object
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Make authenticated fetch request to backend API
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
  
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Configuration object for easy import
 */
export const apiConfig = {
  getBaseUrl: getApiBaseUrl,
  getGraphqlEndpoint: getGraphqlEndpoint,
  getAuthToken: getAuthToken,
  getAuthHeaders: getAuthHeaders,
  fetch: apiFetch,
};

export default apiConfig;
