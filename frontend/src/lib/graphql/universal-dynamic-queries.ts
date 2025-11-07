/**
 * Universal Dynamic Queries Stub
 * 
 * This file provides stub exports for backward compatibility.
 * GraphQL is being replaced by Server Actions and API Routes.
 * 
 * @deprecated This entire file is deprecated. Use Server Actions or API Routes instead.
 */

'use client';

/**
 * Stub DocumentNode type for compatibility
 */
interface DocumentNode {
  kind: 'Document';
  definitions: any[];
}

/**
 * Create a stub GraphQL query object
 * @deprecated Use Server Actions instead
 */
const createStubQuery = (queryName: string): DocumentNode => {
  console.warn(`GraphQL query ${queryName} is deprecated. Use Server Actions or API Routes instead.`);
  return {
    kind: 'Document',
    definitions: [],
  };
};

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_FIND_MANY = createStubQuery('DynamicFindMany');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_FIND_UNIQUE = createStubQuery('DynamicFindUnique');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_CREATE = createStubQuery('DynamicCreate');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_UPDATE = createStubQuery('DynamicUpdate');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_DELETE = createStubQuery('DynamicDelete');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_COUNT = createStubQuery('DynamicCount');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_AGGREGATE = createStubQuery('DynamicAggregate');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_BATCH_CREATE = createStubQuery('DynamicBatchCreate');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_BATCH_UPDATE = createStubQuery('DynamicBatchUpdate');

/**
 * @deprecated Use Server Actions instead
 */
export const DYNAMIC_BATCH_DELETE = createStubQuery('DynamicBatchDelete');
