/**
 * Tests for usePageBuilder hook - Nested block operations
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useNestedBlockOperations, flattenBlocks, unflattenBlocks } from '@/hooks/usePageBuilder';
import { GET_PAGE_BY_ID, ADD_PAGE_BLOCK, UPDATE_PAGE_BLOCK, DELETE_PAGE_BLOCK } from '@/graphql/queries/pages';
import { BlockType } from '@/types/page-builder';

// Mock data
const mockPageId = 'page-123';

const mockPage = {
  id: mockPageId,
  title: 'Test Page',
  slug: 'test-page',
  status: 'PUBLISHED',
  blocks: [
    {
      id: 'block-1',
      type: 'SECTION',
      content: { backgroundColor: '#fff' },
      style: {},
      order: 0,
      isVisible: true,
      pageId: mockPageId,
      parentId: null,
      depth: 0,
      config: null,
      children: [
        {
          id: 'block-2',
          type: 'GRID',
          content: { columns: 3, gap: 20 },
          style: {},
          order: 0,
          isVisible: true,
          pageId: mockPageId,
          parentId: 'block-1',
          depth: 1,
          config: null,
          children: [
            {
              id: 'block-3',
              type: 'CARD',
              content: { title: 'Card 1' },
              style: {},
              order: 0,
              isVisible: true,
              pageId: mockPageId,
              parentId: 'block-2',
              depth: 2,
              config: null,
              children: [],
            },
            {
              id: 'block-4',
              type: 'CARD',
              content: { title: 'Card 2' },
              style: {},
              order: 1,
              isVisible: true,
              pageId: mockPageId,
              parentId: 'block-2',
              depth: 2,
              config: null,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

const mocks = [
  {
    request: {
      query: GET_PAGE_BY_ID,
      variables: { id: mockPageId },
    },
    result: {
      data: {
        getPageById: mockPage,
      },
    },
  },
];

// Wrapper component for hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);

describe('useNestedBlockOperations', () => {
  describe('getAllBlocks', () => {
    it('should flatten nested blocks into single array', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const allBlocks = result.current.getAllBlocks();
      
      expect(allBlocks).toHaveLength(4); // Section + Grid + 2 Cards
      expect(allBlocks.map(b => b.id)).toEqual(['block-1', 'block-2', 'block-3', 'block-4']);
    });
  });

  describe('getBlockTree', () => {
    it('should return nested tree structure', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const tree = result.current.getBlockTree();
      
      expect(tree).toHaveLength(1); // 1 root block (Section)
      expect(tree[0].id).toBe('block-1');
      expect(tree[0].children).toHaveLength(1); // Grid
      expect(tree[0].children[0].id).toBe('block-2');
      expect(tree[0].children[0].children).toHaveLength(2); // 2 Cards
    });
  });

  describe('getBlockChildren', () => {
    it('should return direct children only', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const children = result.current.getBlockChildren('block-2'); // Grid's children
      
      expect(children).toHaveLength(2); // 2 Cards
      expect(children.map(c => c.id)).toEqual(['block-3', 'block-4']);
      expect(children.every(c => c.parentId === 'block-2')).toBe(true);
    });

    it('should return empty array for block without children', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const children = result.current.getBlockChildren('block-3'); // Card (no children)
      
      expect(children).toHaveLength(0);
    });
  });

  describe('getBlockParent', () => {
    it('should return parent block', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const parent = result.current.getBlockParent('block-2'); // Grid's parent
      
      expect(parent).toBeDefined();
      expect(parent?.id).toBe('block-1'); // Section
      expect(parent?.type).toBe('SECTION');
    });

    it('should return null for root block', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const parent = result.current.getBlockParent('block-1'); // Section (root)
      
      expect(parent).toBeNull();
    });
  });

  describe('getBlockAncestors', () => {
    it('should return all ancestors', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const ancestors = result.current.getBlockAncestors('block-3'); // Card
      
      expect(ancestors).toHaveLength(2); // Grid + Section
      expect(ancestors[0].id).toBe('block-2'); // Direct parent (Grid)
      expect(ancestors[1].id).toBe('block-1'); // Grandparent (Section)
    });

    it('should return empty array for root block', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const ancestors = result.current.getBlockAncestors('block-1');
      
      expect(ancestors).toHaveLength(0);
    });
  });

  describe('getBlockDescendants', () => {
    it('should return all descendants', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const descendants = result.current.getBlockDescendants('block-1'); // Section
      
      expect(descendants).toHaveLength(3); // Grid + 2 Cards
      expect(descendants.map(d => d.id)).toEqual(['block-2', 'block-3', 'block-4']);
    });

    it('should return empty array for leaf block', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      const descendants = result.current.getBlockDescendants('block-3'); // Card
      
      expect(descendants).toHaveLength(0);
    });
  });

  describe('isContainerBlock', () => {
    it('should return true for container types', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      expect(result.current.isContainerBlock('CONTAINER')).toBe(true);
      expect(result.current.isContainerBlock('SECTION')).toBe(true);
      expect(result.current.isContainerBlock('GRID')).toBe(true);
      expect(result.current.isContainerBlock('FLEX_ROW')).toBe(true);
      expect(result.current.isContainerBlock('FLEX_COLUMN')).toBe(true);
    });

    it('should return false for non-container types', async () => {
      const { result } = renderHook(() => useNestedBlockOperations(mockPageId), { wrapper });

      await waitFor(() => {
        expect(result.current.page).toBeDefined();
      });

      expect(result.current.isContainerBlock('TEXT')).toBe(false);
      expect(result.current.isContainerBlock('IMAGE')).toBe(false);
      expect(result.current.isContainerBlock('BUTTON')).toBe(false);
      expect(result.current.isContainerBlock('CARD')).toBe(false);
    });
  });
});

describe('Utility Functions', () => {
  describe('flattenBlocks', () => {
    it('should flatten nested structure', () => {
      const nested = [
        {
          id: '1',
          type: 'SECTION',
          children: [
            {
              id: '2',
              type: 'GRID',
              children: [
                { id: '3', type: 'CARD', children: [] },
                { id: '4', type: 'CARD', children: [] },
              ],
            },
          ],
        },
      ];

      const flat = flattenBlocks(nested);

      expect(flat).toHaveLength(4);
      expect(flat.map(b => b.id)).toEqual(['1', '2', '3', '4']);
    });

    it('should handle empty array', () => {
      const flat = flattenBlocks([]);
      expect(flat).toHaveLength(0);
    });
  });

  describe('unflattenBlocks', () => {
    it('should build tree from flat array', () => {
      const flat = [
        { id: '1', type: 'SECTION', parentId: null, order: 0 },
        { id: '2', type: 'GRID', parentId: '1', order: 0 },
        { id: '3', type: 'CARD', parentId: '2', order: 0 },
        { id: '4', type: 'CARD', parentId: '2', order: 1 },
      ];

      const tree = unflattenBlocks(flat);

      expect(tree).toHaveLength(1); // 1 root
      expect(tree[0].id).toBe('1');
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].id).toBe('2');
      expect(tree[0].children[0].children).toHaveLength(2);
    });

    it('should sort by order', () => {
      const flat = [
        { id: '1', type: 'SECTION', parentId: null, order: 0 },
        { id: '3', type: 'CARD', parentId: '1', order: 2 },
        { id: '2', type: 'CARD', parentId: '1', order: 1 },
        { id: '4', type: 'CARD', parentId: '1', order: 0 },
      ];

      const tree = unflattenBlocks(flat);

      expect(tree[0].children.map((c: any) => c.id)).toEqual(['4', '2', '3']);
    });
  });
});
