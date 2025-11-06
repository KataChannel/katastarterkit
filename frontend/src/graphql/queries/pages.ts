/**
 * DEPRECATED: GraphQL has been removed from this project
 * This file provides backward compatibility stubs
 * 
 * Migration Guide:
 * - Use Server Actions from @/actions/pages
 * - Functions available: getPages, getPageBySlug, createPage, updatePage, deletePage
 */

// Type definitions
export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: any;
  blocks?: PageBlock[];
  isPublished: boolean;
  publishedAt?: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PageBlock {
  id: string;
  type: string;
  content: any;
  order: number;
  pageId: string;
}

export interface PaginatedPages {
  pages: Page[];
  total: number;
  page: number;
  limit: number;
}

// GraphQL query stubs
export const GET_PAGES = `
  # DEPRECATED: Use Server Action getPages() from @/actions/pages
  query GetPages {
    pages {
      id
      title
      slug
      isPublished
    }
  }
`;

export const GET_PAGE_BY_ID = `
  # DEPRECATED: Use Server Action getPageBySlug(slug)
  query GetPageById($id: ID!) {
    page(id: $id) {
      id
      title
      slug
      blocks {
        id
        type
        content
        order
      }
    }
  }
`;

// GraphQL mutation stubs
export const CREATE_PAGE = `
  # DEPRECATED: Use Server Action createPage(data)
  mutation CreatePage($input: PageInput!) {
    createPage(input: $input) {
      id
    }
  }
`;

export const UPDATE_PAGE = `
  # DEPRECATED: Use Server Action updatePage(id, data)
  mutation UpdatePage($id: ID!, $input: PageInput!) {
    updatePage(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_PAGE = `
  # DEPRECATED: Use Server Action deletePage(id)
  mutation DeletePage($id: ID!) {
    deletePage(id: $id)
  }
`;

export const ADD_PAGE_BLOCK = `
  # DEPRECATED: Update page blocks through updatePage Server Action
  mutation AddPageBlock($pageId: ID!, $block: PageBlockInput!) {
    addPageBlock(pageId: $pageId, block: $block) {
      id
    }
  }
`;

export const UPDATE_PAGE_BLOCK = `
  # DEPRECATED: Update page blocks through updatePage Server Action
  mutation UpdatePageBlock($id: ID!, $block: PageBlockInput!) {
    updatePageBlock(id: $id, block: $block) {
      id
    }
  }
`;

export const DELETE_PAGE_BLOCK = `
  # DEPRECATED: Update page blocks through updatePage Server Action
  mutation DeletePageBlock($id: ID!) {
    deletePageBlock(id: $id)
  }
`;

export const UPDATE_PAGE_BLOCKS_ORDER = `
  # DEPRECATED: Update page blocks through updatePage Server Action
  mutation UpdatePageBlocksOrder($pageId: ID!, $blockIds: [ID!]!) {
    updatePageBlocksOrder(pageId: $pageId, blockIds: $blockIds)
  }
`;

console.warn('⚠️ @/graphql/queries/pages is deprecated. Use @/actions/pages instead.');
