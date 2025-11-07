// DEPRECATED: GraphQL queries removed - Stubs for backward compatibility
// TODO: Migrate to Server Actions in src/actions/users.ts

// Stub DocumentNode type
const createStubQuery = (name: string) => ({
  kind: 'Document' as const,
  definitions: [],
  loc: { start: 0, end: 0 },
  _name: name
});

// User Statistics
export const GET_USER_STATS = createStubQuery('GET_USER_STATS');

// User Queries
export const GET_USER_BY_ID = createStubQuery('GET_USER_BY_ID');
export const GET_ALL_USERS = createStubQuery('GET_ALL_USERS');
export const GET_USERS = createStubQuery('GET_USERS');
export const SEARCH_USERS = createStubQuery('SEARCH_USERS');

// User Mutations
export const UPDATE_USER = createStubQuery('UPDATE_USER');
export const DELETE_USER = createStubQuery('DELETE_USER');
export const CREATE_USER = createStubQuery('CREATE_USER');

// Admin User Management
export const ADMIN_CREATE_USER = createStubQuery('ADMIN_CREATE_USER');
export const ADMIN_UPDATE_USER = createStubQuery('ADMIN_UPDATE_USER');
export const ADMIN_DELETE_USER = createStubQuery('ADMIN_DELETE_USER');

// Bulk Operations
export const BULK_USER_ACTION = createStubQuery('BULK_USER_ACTION');
export const BULK_DELETE_USERS = createStubQuery('BULK_DELETE_USERS');
export const BULK_UPDATE_USERS = createStubQuery('BULK_UPDATE_USERS');

// User Profile
export const GET_USER_PROFILE = createStubQuery('GET_USER_PROFILE');
export const UPDATE_USER_PROFILE = createStubQuery('UPDATE_USER_PROFILE');

// User Roles & Permissions
export const GET_USER_ROLES = createStubQuery('GET_USER_ROLES');
export const ASSIGN_USER_ROLE = createStubQuery('ASSIGN_USER_ROLE');
export const REMOVE_USER_ROLE = createStubQuery('REMOVE_USER_ROLE');

// Deprecation warning
if (typeof window !== 'undefined') {
  console.warn(
    '⚠️ DEPRECATED: GraphQL user queries are stubs. ' +
    'Please migrate to Server Actions in src/actions/users.ts'
  );
}
