/**
 * DEPRECATED: GraphQL queries have been removed
 * Use Server Actions instead: @/actions/*
 */

export const GET_CUSTOM_TEMPLATES = `query { customTemplates { id } }`
export const GET_MY_CUSTOM_TEMPLATES = `query { myCustomTemplates { id } }`
export const CREATE_CUSTOM_TEMPLATE = `mutation { createCustomTemplate { id } }`
export const UPDATE_CUSTOM_TEMPLATE = `mutation { updateCustomTemplate { id } }`
export const DELETE_CUSTOM_TEMPLATE = `mutation { deleteCustomTemplate { id } }`
export const DUPLICATE_CUSTOM_TEMPLATE = `mutation { duplicateCustomTemplate { id } }`
export const SHARE_TEMPLATE = `mutation { shareTemplate { id } }`
export const UNSHARE_TEMPLATE = `mutation { unshareTemplate { id } }`
export const UPDATE_TEMPLATE_PUBLICITY = `mutation { updateTemplatePublicity { id } }`
export const INCREMENT_TEMPLATE_USAGE = `mutation { incrementTemplateUsage { id } }`

console.warn('GraphQL custom template queries are deprecated. Use Server Actions instead')
