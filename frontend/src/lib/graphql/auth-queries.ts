/**
 * DEPRECATED: GraphQL auth queries have been removed
 * Use Server Actions instead: @/actions/auth
 */

export const GET_CURRENT_USER = `query { currentUser { id } }`
export const GET_USER_PROFILE = `query { userProfile { id } }`
export const UPDATE_USER_PROFILE = `mutation { updateUserProfile { id } }`
export const CHANGE_PASSWORD = `mutation { changePassword { success } }`

console.warn('GraphQL auth queries are deprecated. Use @/actions/auth instead')
