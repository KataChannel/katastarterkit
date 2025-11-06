/**
 * DEPRECATED: GraphQL queries have been removed
 * Use Server Actions instead: @/actions/*
 */

export const GET_POSTS = `query { posts { id } }`
export const GET_POST = `query { post { id } }`
export const CREATE_POST = `mutation { createPost { id } }`
export const UPDATE_POST = `mutation { updatePost { id } }`
export const DELETE_POST = `mutation { deletePost { id } }`

export const NEW_POST_SUBSCRIPTION = `subscription { newPost { id } }`
export const NEW_COMMENT_SUBSCRIPTION = `subscription { newComment { id } }`

// Stub for backward compatibility
console.warn('GraphQL queries are deprecated. Use Server Actions from @/actions instead')
