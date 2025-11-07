/**
 * DEPRECATED: GraphQL auth queries have been removed
 * Use Server Actions instead: @/actions/auth
 */

// Authentication mutations
export const LOGIN_USER = `mutation { loginUser { success } }`
export const LOGIN_WITH_GOOGLE = `mutation { loginWithGoogle { success } }`
export const LOGIN_WITH_FACEBOOK = `mutation { loginWithFacebook { success } }`
export const LOGIN_WITH_PHONE = `mutation { loginWithPhone { success } }`
export const LOGIN_WITH_EMAIL = `mutation { loginWithEmail { success } }`
export const REGISTER_USER = `mutation { registerUser { success } }`
export const LOGOUT = `mutation { logout { success } }`

// Phone verification
export const REQUEST_PHONE_VERIFICATION = `mutation { requestPhoneVerification { success } }`

// Password management
export const CHANGE_PASSWORD = `mutation { changePassword { success } }`
export const SET_PASSWORD = `mutation { setPassword { success } }`
export const ADMIN_RESET_PASSWORD = `mutation { adminResetPassword { success } }`

// Profile management
export const GET_CURRENT_USER = `query { currentUser { id } }`
export const GET_USER_PROFILE = `query { userProfile { id } }`
export const GET_ME = `query { me { id } }`
export const UPDATE_PROFILE = `mutation { updateProfile { id } }`
export const UPDATE_USER_PROFILE = `mutation { updateUserProfile { id } }`

// Password check
export const HAS_PASSWORD = `query { hasPassword }`

console.warn('GraphQL auth queries are deprecated. Use @/actions/auth instead')
