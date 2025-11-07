/**
 * ============================================================================
 * ADMIN USER MANAGEMENT GRAPHQL STUBS
 * ============================================================================
 * 
 * DEPRECATED: These are stub implementations for backward compatibility.
 * All queries return empty DocumentNode objects.
 * 
 * MIGRATION: Replace with Server Actions from @/actions/users
 */

if (typeof window !== 'undefined') {
  console.warn(
    '⚠️ DEPRECATED: user-management.graphql uses GraphQL stubs. Migrate to Server Actions.'
  )
}

const createStubQuery = (name: string) => ({
  kind: 'Document' as const,
  definitions: [],
  loc: { start: 0, end: 0 },
  _name: name,
})

// ============================================================================
// ADMIN USER QUERIES
// ============================================================================

export const ADMIN_GET_USERS = createStubQuery('ADMIN_GET_USERS')
export const ADMIN_GET_USER = createStubQuery('ADMIN_GET_USER')
export const ADMIN_GET_USER_BY_ID = createStubQuery('ADMIN_GET_USER_BY_ID')
export const ADMIN_SEARCH_USERS = createStubQuery('ADMIN_SEARCH_USERS')
export const GET_USER_STATS = createStubQuery('GET_USER_STATS')

// ============================================================================
// ADMIN USER MUTATIONS
// ============================================================================

export const ADMIN_CREATE_USER = createStubQuery('ADMIN_CREATE_USER')
export const ADMIN_UPDATE_USER = createStubQuery('ADMIN_UPDATE_USER')
export const ADMIN_DELETE_USER = createStubQuery('ADMIN_DELETE_USER')
export const ADMIN_RESET_PASSWORD = createStubQuery('ADMIN_RESET_PASSWORD')
export const ADMIN_TOGGLE_USER_STATUS = createStubQuery('ADMIN_TOGGLE_USER_STATUS')
export const ADMIN_ASSIGN_ROLE = createStubQuery('ADMIN_ASSIGN_ROLE')
export const ADMIN_REMOVE_ROLE = createStubQuery('ADMIN_REMOVE_ROLE')
export const BULK_USER_ACTION = createStubQuery('BULK_USER_ACTION')

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  role?: string
  roles?: Role[]
  status?: UserStatus
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  action: string
  resource: string
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export interface AdminResetPasswordResponse {
  success: boolean
  message?: string
  temporaryPassword?: string
}

export interface AdminUpdateUserInput {
  id: string
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  avatar?: string
  role?: string
  status?: UserStatus
}

export interface AdminCreateUserInput {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  avatar?: string
  role?: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
  newUsersThisWeek: number
}

export interface BulkUserActionInput {
  userIds: string[]
  action: 'activate' | 'deactivate' | 'delete' | 'assign_role' | 'remove_role'
  roleId?: string
}

export interface BulkUserActionResponse {
  success: boolean
  affected: number
  errors?: string[]
}

// Export for backward compatibility
export type {
  User as AdminUser,
  Role as AdminRole,
  Permission as AdminPermission,
}
