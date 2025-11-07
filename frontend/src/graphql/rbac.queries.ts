// DEPRECATED: GraphQL queries removed - Stubs for backward compatibility
// TODO: Migrate to Server Actions in src/actions/rbac.ts

// Stub DocumentNode type
const createStubQuery = (name: string) => ({
  kind: 'Document' as const,
  definitions: [],
  loc: { start: 0, end: 0 },
  _name: name
});

// Permission Queries
export const SEARCH_PERMISSIONS = createStubQuery('SEARCH_PERMISSIONS');
export const GET_PERMISSION_BY_ID = createStubQuery('GET_PERMISSION_BY_ID');
export const CREATE_PERMISSION = createStubQuery('CREATE_PERMISSION');
export const UPDATE_PERMISSION = createStubQuery('UPDATE_PERMISSION');
export const DELETE_PERMISSION = createStubQuery('DELETE_PERMISSION');

// Role Queries
export const SEARCH_ROLES = createStubQuery('SEARCH_ROLES');
export const GET_ROLE_BY_ID = createStubQuery('GET_ROLE_BY_ID');
export const CREATE_ROLE = createStubQuery('CREATE_ROLE');
export const UPDATE_ROLE = createStubQuery('UPDATE_ROLE');
export const DELETE_ROLE = createStubQuery('DELETE_ROLE');

// Role-Permission Assignment
export const ASSIGN_ROLE_PERMISSIONS = createStubQuery('ASSIGN_ROLE_PERMISSIONS');

// User RBAC Queries
export const GET_USER_ROLE_PERMISSIONS = createStubQuery('GET_USER_ROLE_PERMISSIONS');
export const ASSIGN_USER_ROLES = createStubQuery('ASSIGN_USER_ROLES');
export const ASSIGN_USER_PERMISSIONS = createStubQuery('ASSIGN_USER_PERMISSIONS');

// User Effective Permissions
export const GET_USER_EFFECTIVE_PERMISSIONS = createStubQuery('GET_USER_EFFECTIVE_PERMISSIONS');

// Deprecation warning
if (typeof window !== 'undefined') {
  console.warn(
    '⚠️ DEPRECATED: GraphQL RBAC queries are stubs. ' +
    'Please migrate to Server Actions in src/actions/rbac.ts'
  );
}
