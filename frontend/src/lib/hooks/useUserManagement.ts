import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  SEARCH_USERS,
  GET_USER_STATS,
  GET_USER_BY_ID,
  GET_ALL_USERS,
  ADMIN_UPDATE_USER,
  BULK_USER_ACTION,
  DELETE_USER,
  UPDATE_USER,
} from '../graphql/user-queries';

// Types
interface UserSearchInput {
  search?: string;
  roleType?: 'ADMIN' | 'USER' | 'GUEST';
  isActive?: boolean;
  isVerified?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface BulkUserActionInput {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'verify' | 'changeRole';
  newRole?: 'ADMIN' | 'USER' | 'GUEST';
}

interface AdminUpdateUserInput {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleType?: 'ADMIN' | 'USER' | 'GUEST';
  isActive?: boolean;
  isVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  avatar?: string;
}

interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Query hooks
export function useSearchUsers(input: UserSearchInput) {
  return useQuery(SEARCH_USERS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
}

export function useUserStats() {
  return useQuery(GET_USER_STATS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
}

export function useUserById(id: string) {
  return useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
  });
}

export function useAllUsers() {
  return useQuery(GET_ALL_USERS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
}

// Mutation hooks
export function useAdminUpdateUser() {
  const client = useApolloClient();
  
  return useMutation(ADMIN_UPDATE_USER, {
    onCompleted: () => {
      // Refetch queries to update cache
      client.refetchQueries({
        include: [SEARCH_USERS, GET_ALL_USERS, GET_USER_STATS],
      });
    },
    errorPolicy: 'all',
  });
}

export function useBulkUserAction() {
  const client = useApolloClient();
  
  return useMutation(BULK_USER_ACTION, {
    onCompleted: () => {
      // Refetch queries to update cache
      client.refetchQueries({
        include: [SEARCH_USERS, GET_ALL_USERS, GET_USER_STATS],
      });
    },
    errorPolicy: 'all',
  });
}

export function useDeleteUser() {
  const client = useApolloClient();
  
  return useMutation(DELETE_USER, {
    onCompleted: () => {
      // Refetch queries to update cache
      client.refetchQueries({
        include: [SEARCH_USERS, GET_ALL_USERS, GET_USER_STATS],
      });
    },
    errorPolicy: 'all',
  });
}

export function useUpdateUser() {
  const client = useApolloClient();
  
  return useMutation(UPDATE_USER, {
    onCompleted: () => {
      // Refetch queries to update cache
      client.refetchQueries({
        include: [SEARCH_USERS, GET_USER_BY_ID],
      });
    },
    errorPolicy: 'all',
  });
}