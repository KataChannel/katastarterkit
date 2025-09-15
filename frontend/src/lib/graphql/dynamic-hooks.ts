'use client';

import { 
  useQuery, 
  useMutation, 
  QueryHookOptions, 
  MutationHookOptions,
  ApolloError 
} from '@apollo/client';
import { 
  DynamicGraphQLGenerator,
  UniversalQueries,
  AllModelQueries
} from './dynamic-queries';
import { useCallback, useMemo } from 'react';

// Types for hook options
export interface DynamicQueryOptions extends Omit<QueryHookOptions, 'query'> {
  modelName?: string;
  fields?: string[];
  useFragment?: boolean;
  fragment?: string;
}

export interface DynamicMutationOptions extends Omit<MutationHookOptions<any, any>, 'mutation'> {
  modelName?: string;
  fields?: string[];
  useFragment?: boolean;
  fragment?: string;
}

export interface BulkOperationResult<T = any> {
  success: boolean;
  count: number;
  data?: T[];
  errors?: Array<{
    index: number;
    error: string;
    data?: any;
  }>;
}

export interface PaginatedResult<T = any> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Hook for dynamic queries
export function useDynamicQuery<TData = any>(
  operationType: 'GET_ALL' | 'GET_PAGINATED' | 'GET_BY_ID' | 'COUNT' | 'EXISTS',
  modelName: string,
  options: DynamicQueryOptions = {}
) {
  const { fields, useFragment, fragment, ...queryOptions } = options;

  const query = useMemo(() => {
    const modelQueries = AllModelQueries[modelName];
    if (modelQueries) {
      switch (operationType) {
        case 'GET_ALL':
          return modelQueries[`GET_${modelName.toUpperCase()}S`];
        case 'GET_PAGINATED':
          return modelQueries[`GET_${modelName.toUpperCase()}S_PAGINATED`];
        case 'GET_BY_ID':
          return modelQueries[`GET_${modelName.toUpperCase()}_BY_ID`];
        case 'COUNT':
          return modelQueries[`COUNT_${modelName.toUpperCase()}S`];
        case 'EXISTS':
          return modelQueries[`${modelName.toUpperCase()}_EXISTS`];
        default:
          throw new Error(`Unsupported operation type: ${operationType}`);
      }
    }

    // Generate query if not in pre-generated queries
    const queries = DynamicGraphQLGenerator.generateCRUDQueries(modelName, fields);
    switch (operationType) {
      case 'GET_ALL':
        return queries[`GET_${modelName.toUpperCase()}S`];
      case 'GET_PAGINATED':
        return queries[`GET_${modelName.toUpperCase()}S_PAGINATED`];
      case 'GET_BY_ID':
        return queries[`GET_${modelName.toUpperCase()}_BY_ID`];
      case 'COUNT':
        return queries[`COUNT_${modelName.toUpperCase()}S`];
      case 'EXISTS':
        return queries[`${modelName.toUpperCase()}_EXISTS`];
      default:
        throw new Error(`Unsupported operation type: ${operationType}`);
    }
  }, [operationType, modelName, fields, useFragment, fragment]);

  return useQuery<TData>(query, queryOptions);
}

// Hook for dynamic mutations
export function useDynamicMutation<TData = any, TVariables = any>(
  operationType: 'CREATE' | 'CREATE_BULK' | 'UPDATE' | 'UPDATE_BULK' | 'DELETE' | 'DELETE_BULK' | 'UPSERT',
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  const { fields, useFragment, fragment, ...mutationOptions } = options;

  const mutation = useMemo(() => {
    const modelQueries = AllModelQueries[modelName];
    if (modelQueries) {
      switch (operationType) {
        case 'CREATE':
          return modelQueries[`CREATE_${modelName.toUpperCase()}`];
        case 'CREATE_BULK':
          return modelQueries[`CREATE_${modelName.toUpperCase()}S_BULK`];
        case 'UPDATE':
          return modelQueries[`UPDATE_${modelName.toUpperCase()}`];
        case 'UPDATE_BULK':
          return modelQueries[`UPDATE_${modelName.toUpperCase()}S_BULK`];
        case 'DELETE':
          return modelQueries[`DELETE_${modelName.toUpperCase()}`];
        case 'DELETE_BULK':
          return modelQueries[`DELETE_${modelName.toUpperCase()}S_BULK`];
        case 'UPSERT':
          return modelQueries[`UPSERT_${modelName.toUpperCase()}`];
        default:
          throw new Error(`Unsupported operation type: ${operationType}`);
      }
    }

    // Generate mutation if not in pre-generated queries
    const queries = DynamicGraphQLGenerator.generateCRUDQueries(modelName, fields);
    switch (operationType) {
      case 'CREATE':
        return queries[`CREATE_${modelName.toUpperCase()}`];
      case 'CREATE_BULK':
        return queries[`CREATE_${modelName.toUpperCase()}S_BULK`];
      case 'UPDATE':
        return queries[`UPDATE_${modelName.toUpperCase()}`];
      case 'UPDATE_BULK':
        return queries[`UPDATE_${modelName.toUpperCase()}S_BULK`];
      case 'DELETE':
        return queries[`DELETE_${modelName.toUpperCase()}`];
      case 'DELETE_BULK':
        return queries[`DELETE_${modelName.toUpperCase()}S_BULK`];
      case 'UPSERT':
        return queries[`UPSERT_${modelName.toUpperCase()}`];
      default:
        throw new Error(`Unsupported operation type: ${operationType}`);
    }
  }, [operationType, modelName, fields, useFragment, fragment]);

  return useMutation<TData, TVariables>(mutation, mutationOptions as any);
}

// Universal hooks using the universal resolvers
export function useUniversalQuery<TData = any>(
  operationType: 'FIND_MANY' | 'FIND_BY_ID',
  options: QueryHookOptions & { modelName: string } = {} as any
) {
  const { modelName, ...queryOptions } = options;

  const query = useMemo(() => {
    switch (operationType) {
      case 'FIND_MANY':
        return UniversalQueries.DYNAMIC_FIND_MANY;
      case 'FIND_BY_ID':
        return UniversalQueries.DYNAMIC_FIND_BY_ID;
      default:
        throw new Error(`Unsupported universal operation: ${operationType}`);
    }
  }, [operationType]);

  return useQuery<TData>(query, {
    ...queryOptions,
    variables: {
      modelName,
      ...queryOptions.variables
    }
  });
}

export function useUniversalMutation<TData = any, TVariables = any>(
  operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'CREATE_BULK' | 'UPDATE_BULK' | 'DELETE_BULK',
  options: MutationHookOptions & { modelName: string } = {} as any
) {
  const { modelName, ...mutationOptions } = options;

  const mutation = useMemo(() => {
    switch (operationType) {
      case 'CREATE':
        return UniversalQueries.DYNAMIC_CREATE;
      case 'UPDATE':
        return UniversalQueries.DYNAMIC_UPDATE;
      case 'DELETE':
        return UniversalQueries.DYNAMIC_DELETE;
      case 'CREATE_BULK':
        return UniversalQueries.DYNAMIC_CREATE_BULK;
      case 'UPDATE_BULK':
        return UniversalQueries.DYNAMIC_UPDATE_BULK;
      case 'DELETE_BULK':
        return UniversalQueries.DYNAMIC_DELETE_BULK;
      default:
        throw new Error(`Unsupported universal operation: ${operationType}`);
    }
  }, [operationType]);

  const [mutate, result] = useMutation<TData, TVariables>(mutation, mutationOptions as any);

  const dynamicMutate = useCallback((variables: any) => {
    return mutate({
      variables: {
        modelName,
        ...variables
      }
    });
  }, [mutate, modelName]);

  return [dynamicMutate, result] as const;
}

// Specific hooks for common operations
export function useGetAll<TData = any>(
  modelName: string, 
  options: DynamicQueryOptions = {}
) {
  return useDynamicQuery<TData[]>('GET_ALL', modelName, options);
}

export function useGetPaginated<TData = any>(
  modelName: string,
  options: DynamicQueryOptions = {}
) {
  return useDynamicQuery<PaginatedResult<TData>>('GET_PAGINATED', modelName, options);
}

export function useGetById<TData = any>(
  modelName: string,
  options: DynamicQueryOptions = {}
) {
  return useDynamicQuery<TData>('GET_BY_ID', modelName, options);
}

export function useCount(
  modelName: string,
  options: DynamicQueryOptions = {}
) {
  return useDynamicQuery<number>('COUNT', modelName, options);
}

export function useExists(
  modelName: string,
  options: DynamicQueryOptions = {}
) {
  return useDynamicQuery<boolean>('EXISTS', modelName, options);
}

export function useCreate<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<TData, TVariables>('CREATE', modelName, options);
}

export function useCreateBulk<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<BulkOperationResult<TData>, TVariables>('CREATE_BULK', modelName, options);
}

export function useUpdate<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<TData, TVariables>('UPDATE', modelName, options);
}

export function useUpdateBulk<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<BulkOperationResult<TData>, TVariables>('UPDATE_BULK', modelName, options);
}

export function useDelete<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<TData, TVariables>('DELETE', modelName, options);
}

export function useDeleteBulk<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<BulkOperationResult<TData>, TVariables>('DELETE_BULK', modelName, options);
}

export function useUpsert<TData = any, TVariables = any>(
  modelName: string,
  options: DynamicMutationOptions = {}
) {
  return useDynamicMutation<TData, TVariables>('UPSERT', modelName, options);
}

// Higher-level CRUD hook that combines all operations
export function useCRUD<TData = any>(modelName: string) {
  const getAll = useGetAll<TData>(modelName);
  const getPaginated = useGetPaginated<TData>(modelName);
  const [create] = useCreate<TData>(modelName);
  const [createBulk] = useCreateBulk<TData>(modelName);
  const [update] = useUpdate<TData>(modelName);
  const [updateBulk] = useUpdateBulk<TData>(modelName);
  const [remove] = useDelete<TData>(modelName);
  const [deleteBulk] = useDeleteBulk<TData>(modelName);
  const [upsert] = useUpsert<TData>(modelName);

  const getById = useCallback((id: string) => {
    return useGetById<TData>(modelName, { variables: { id } });
  }, [modelName]);

  const count = useCallback((where?: any) => {
    return useCount(modelName, { variables: { where } });
  }, [modelName]);

  const exists = useCallback((where: any) => {
    return useExists(modelName, { variables: { where } });
  }, [modelName]);

  return {
    // Queries
    getAll,
    getPaginated,
    getById,
    count,
    exists,
    
    // Mutations
    create,
    createBulk,
    update,
    updateBulk,
    delete: remove,
    deleteBulk,
    upsert
  };
}

// Error handling utility
export function isDynamicGraphQLError(error: any): error is ApolloError {
  return error && error.graphQLErrors && error.networkError !== undefined;
}

export function formatDynamicGraphQLError(error: ApolloError): string {
  if (error.graphQLErrors.length > 0) {
    return error.graphQLErrors.map(err => err.message).join(', ');
  }
  if (error.networkError) {
    return `Network error: ${error.networkError.message}`;
  }
  return error.message || 'Unknown GraphQL error';
}
