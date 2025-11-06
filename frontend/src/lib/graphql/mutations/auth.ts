/**
 * DEPRECATED: GraphQL mutations have been removed
 * Use Server Actions instead: @/actions/auth
 */

export const LOGIN_WITH_FACEBOOK = `mutation { loginWithFacebook { token } }`
export const LOGIN_WITH_GOOGLE = `mutation { loginWithGoogle { token } }`
export const LOGIN = `mutation { login { token } }`
export const REGISTER = `mutation { register { token } }`

console.warn('GraphQL auth mutations are deprecated. Use @/actions/auth instead')
