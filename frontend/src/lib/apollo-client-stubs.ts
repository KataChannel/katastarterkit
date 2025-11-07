// Universal Apollo Client Stubs
// This file provides stub implementations for all Apollo Client hooks
// Use this to replace @apollo/client imports throughout the application

if (typeof window !== 'undefined') {
  console.warn(
    '⚠️ DEPRECATED: Apollo Client has been removed from this project. ' +
    'All hooks are stubs. Please migrate to Next.js Server Actions.'
  );
}

// Stub types
type QueryResult = {
  data: null;
  loading: false;
  error: null;
  refetch: () => Promise<{ data: null }>;
  fetchMore?: () => Promise<void>;
  networkStatus?: number;
  called?: boolean;
};

type MutationResult = readonly [
  () => Promise<{ data: null }>,
  {
    data: null;
    loading: false;
    error: null;
    called?: boolean;
    reset?: () => void;
  }
];

type SubscriptionResult = {
  data: null;
  loading: false;
  error: null;
};

type ApolloClientStub = {
  query: () => Promise<{ data: null }>;
  mutate: () => Promise<{ data: null }>;
  clearStore: () => Promise<void>;
  resetStore: () => Promise<void>;
  refetchQueries: () => Promise<void>;
  cache: {
    reset: () => Promise<void>;
    evict: () => boolean;
    modify: () => boolean;
  };
};

// Stub hooks
export const useQuery = (...args: any[]): QueryResult => ({
  data: null,
  loading: false,
  error: null,
  refetch: async () => ({ data: null }),
  fetchMore: async () => {},
  networkStatus: 7,
  called: true,
});

export const useLazyQuery = (...args: any[]): readonly [() => Promise<{ data: null }>, QueryResult] => {
  const executeQuery = async () => ({ data: null });
  return [executeQuery, {
    data: null,
    loading: false,
    error: null,
    refetch: async () => ({ data: null }),
    fetchMore: async () => {},
    networkStatus: 7,
    called: false,
  }] as const;
};

export const useMutation = (...args: any[]): MutationResult => {
  const executeMutation = async () => ({ data: null });
  return [executeMutation, {
    data: null,
    loading: false,
    error: null,
    called: false,
    reset: () => {},
  }] as const;
};

export const useSubscription = (...args: any[]): SubscriptionResult => ({
  data: null,
  loading: false,
  error: null,
});

export const useApolloClient = (): ApolloClientStub => ({
  query: async () => ({ data: null }),
  mutate: async () => ({ data: null }),
  clearStore: async () => {},
  resetStore: async () => {},
  refetchQueries: async () => {},
  cache: {
    reset: async () => {},
    evict: () => false,
    modify: () => false,
  },
});

// Re-export types (stubs)
export type { QueryResult, MutationResult, SubscriptionResult, ApolloClientStub };

// Additional exports that might be used
export const gql = (strings: TemplateStringsArray, ...values: any[]) => ({
  kind: 'Document' as const,
  definitions: [],
  loc: { start: 0, end: 0 },
  _query: strings.join(''),
});

export class ApolloClient {
  constructor(...args: any[]) {}
  query = async () => ({ data: null });
  mutate = async () => ({ data: null });
  clearStore = async () => {};
  resetStore = async () => {};
}

export class InMemoryCache {
  constructor(...args: any[]) {}
}

export class HttpLink {
  constructor(...args: any[]) {}
}

export const createHttpLink = (...args: any[]) => ({});
export const setContext = (...args: any[]) => (...moreArgs: any[]) => ({});

// Provider stub (for backwards compatibility)
export const ApolloProvider = ({ children }: { children: React.ReactNode }) => children;

// Error types
export class ApolloError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ApolloError';
  }
}
