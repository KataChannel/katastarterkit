/**
 * DEPRECATED: GraphQL queries have been removed
 * Use Server Actions instead: @/actions/*
 */

export const GET_CUSTOM_TEMPLATES = `query { customTemplates { id } }`
export const CREATE_CUSTOM_TEMPLATE = `mutation { createCustomTemplate { id } }`
export const UPDATE_CUSTOM_TEMPLATE = `mutation { updateCustomTemplate { id } }`
export const DELETE_CUSTOM_TEMPLATE = `mutation { deleteCustomTemplate { id } }`

console.warn('GraphQL custom template queries are deprecated. Use Server Actions instead')
