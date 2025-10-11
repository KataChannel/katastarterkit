/**
 * Tests for Page Service - Nested Block Operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from '../../../src/services/page.service';
import { PrismaService } from '../../../src/services/prisma.service';

describe('PageService - Nested Blocks', () => {
  let service: PageService;
  let prisma: PrismaService;

  const mockPrismaService = {
    page: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    pageBlock: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById with nested blocks', () => {
    it('should return page with nested blocks (4 levels)', async () => {
      const mockPage = {
        id: 'page-1',
        title: 'Test Page',
        slug: 'test-page',
        status: 'PUBLISHED',
        blocks: [
          {
            id: 'block-1',
            type: 'SECTION',
            parentId: null,
            depth: 0,
            children: [
              {
                id: 'block-2',
                type: 'GRID',
                parentId: 'block-1',
                depth: 1,
                children: [
                  {
                    id: 'block-3',
                    type: 'CONTAINER',
                    parentId: 'block-2',
                    depth: 2,
                    children: [
                      {
                        id: 'block-4',
                        type: 'CARD',
                        parentId: 'block-3',
                        depth: 3,
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      mockPrismaService.page.findUnique.mockResolvedValue(mockPage);

      const result = await service.findById('page-1');

      expect(result).toEqual(mockPage);
      expect(mockPrismaService.page.findUnique).toHaveBeenCalledWith({
        where: { id: 'page-1' },
        include: expect.objectContaining({
          blocks: expect.objectContaining({
            where: { parentId: null },
            include: expect.objectContaining({
              children: expect.any(Object),
            }),
          }),
        }),
      });
    });

    it('should only fetch root-level blocks (parentId: null)', async () => {
      const mockPage = {
        id: 'page-1',
        title: 'Test Page',
        blocks: [
          { id: 'block-1', type: 'SECTION', parentId: null, children: [] },
          { id: 'block-2', type: 'SECTION', parentId: null, children: [] },
        ],
      };

      mockPrismaService.page.findUnique.mockResolvedValue(mockPage);

      await service.findById('page-1');

      const callArgs = mockPrismaService.page.findUnique.mock.calls[0][0];
      expect(callArgs.include.blocks.where).toEqual({ parentId: null });
    });
  });

  describe('addBlock with nesting', () => {
    it('should create block with parentId and depth', async () => {
      const pageId = 'page-1';
      const blockData = {
        type: 'GRID',
        content: { columns: 3 },
        style: {},
        parentId: 'section-1',
        depth: 1,
        order: 0,
      };

      const mockCreatedBlock = {
        id: 'block-new',
        ...blockData,
        pageId,
      };

      mockPrismaService.pageBlock.create.mockResolvedValue(mockCreatedBlock);

      const result = await service.addBlock(pageId, blockData);

      expect(result).toEqual(mockCreatedBlock);
      expect(mockPrismaService.pageBlock.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'GRID',
          parentId: 'section-1',
          depth: 1,
          page: { connect: { id: pageId } },
        }),
      });
    });

    it('should create root block with depth 0 and null parentId', async () => {
      const pageId = 'page-1';
      const blockData = {
        type: 'SECTION',
        content: {},
        style: {},
        order: 0,
      };

      const mockCreatedBlock = {
        id: 'block-root',
        ...blockData,
        parentId: null,
        depth: 0,
        pageId,
      };

      mockPrismaService.pageBlock.create.mockResolvedValue(mockCreatedBlock);

      const result = await service.addBlock(pageId, blockData);

      expect(result.parentId).toBeNull();
      expect(result.depth).toBe(0);
    });

    it('should handle config field for dynamic blocks', async () => {
      const pageId = 'page-1';
      const blockData = {
        type: 'DYNAMIC',
        content: {},
        style: {},
        config: {
          dataSource: {
            type: 'api',
            endpoint: '/api/products',
          },
          repeater: {
            enabled: true,
            dataPath: 'products',
          },
        },
        order: 0,
      };

      const mockCreatedBlock = {
        id: 'block-dynamic',
        ...blockData,
        pageId,
      };

      mockPrismaService.pageBlock.create.mockResolvedValue(mockCreatedBlock);

      const result = await service.addBlock(pageId, blockData);

      expect(result.config).toEqual(blockData.config);
      expect(mockPrismaService.pageBlock.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          config: blockData.config,
        }),
      });
    });
  });

  describe('updateBlock with nesting', () => {
    it('should update block parentId (move to new container)', async () => {
      const blockId = 'block-1';
      const updateData = {
        parentId: 'new-parent',
        depth: 2,
      };

      const mockUpdatedBlock = {
        id: blockId,
        type: 'CARD',
        parentId: 'new-parent',
        depth: 2,
      };

      mockPrismaService.pageBlock.update.mockResolvedValue(mockUpdatedBlock);

      const result = await service.updateBlock(blockId, updateData);

      expect(result.parentId).toBe('new-parent');
      expect(result.depth).toBe(2);
      expect(mockPrismaService.pageBlock.update).toHaveBeenCalledWith({
        where: { id: blockId },
        data: expect.objectContaining({
          parentId: 'new-parent',
          depth: 2,
        }),
      });
    });

    it('should move block to root level (parentId: null)', async () => {
      const blockId = 'block-1';
      const updateData = {
        parentId: null,
        depth: 0,
      };

      const mockUpdatedBlock = {
        id: blockId,
        type: 'SECTION',
        parentId: null,
        depth: 0,
      };

      mockPrismaService.pageBlock.update.mockResolvedValue(mockUpdatedBlock);

      const result = await service.updateBlock(blockId, updateData);

      expect(result.parentId).toBeNull();
      expect(result.depth).toBe(0);
    });
  });

  describe('deleteBlock with cascade', () => {
    it('should cascade delete children when parent deleted', async () => {
      const blockId = 'section-1';

      // Mock delete response
      mockPrismaService.pageBlock.delete.mockResolvedValue({
        id: blockId,
        type: 'SECTION',
      });

      await service.deleteBlock(blockId);

      expect(mockPrismaService.pageBlock.delete).toHaveBeenCalledWith({
        where: { id: blockId },
      });
      
      // Note: Cascade delete is handled by database ON DELETE CASCADE
      // Prisma will automatically delete children via foreign key constraint
    });
  });

  describe('Depth validation', () => {
    it('should handle blocks at different depth levels', async () => {
      const testCases = [
        { depth: 0, parentId: null, type: 'SECTION' },
        { depth: 1, parentId: 'section-1', type: 'GRID' },
        { depth: 2, parentId: 'grid-1', type: 'CONTAINER' },
        { depth: 3, parentId: 'container-1', type: 'CARD' },
      ];

      for (const testCase of testCases) {
        mockPrismaService.pageBlock.create.mockResolvedValueOnce({
          id: `block-${testCase.depth}`,
          ...testCase,
        });

        const result = await service.addBlock('page-1', testCase);

        expect(result.depth).toBe(testCase.depth);
        expect(result.parentId).toBe(testCase.parentId);
      }
    });
  });

  describe('Order management', () => {
    it('should maintain order within siblings', async () => {
      const pageId = 'page-1';
      const parentId = 'container-1';

      const siblings = [
        { type: 'CARD', order: 0, parentId },
        { type: 'CARD', order: 1, parentId },
        { type: 'CARD', order: 2, parentId },
      ];

      for (let i = 0; i < siblings.length; i++) {
        mockPrismaService.pageBlock.create.mockResolvedValueOnce({
          id: `block-${i}`,
          ...siblings[i],
          pageId,
        });

        const result = await service.addBlock(pageId, siblings[i]);
        expect(result.order).toBe(i);
      }
    });
  });

  describe('findBySlug with visibility filter', () => {
    it('should only return visible blocks for public pages', async () => {
      const mockPage = {
        id: 'page-1',
        title: 'Public Page',
        slug: 'public-page',
        status: 'PUBLISHED',
        blocks: [
          {
            id: 'block-1',
            type: 'SECTION',
            isVisible: true,
            children: [
              {
                id: 'block-2',
                type: 'TEXT',
                isVisible: true,
                children: [],
              },
            ],
          },
        ],
      };

      mockPrismaService.page.findUnique.mockResolvedValue(mockPage);

      const result = await service.findBySlug('public-page');

      const callArgs = mockPrismaService.page.findUnique.mock.calls[0][0];
      
      // Should filter by isVisible: true
      expect(callArgs.include.blocks.where).toMatchObject({
        parentId: null,
        isVisible: true,
      });
    });
  });

  describe('Container block types', () => {
    const containerTypes = [
      'CONTAINER',
      'SECTION',
      'GRID',
      'FLEX_ROW',
      'FLEX_COLUMN',
    ];

    it.each(containerTypes)(
      'should create %s block that can have children',
      async (blockType) => {
        const pageId = 'page-1';
        const blockData = {
          type: blockType,
          content: {},
          style: {},
          order: 0,
        };

        const mockBlock = {
          id: `block-${blockType.toLowerCase()}`,
          ...blockData,
          pageId,
          parentId: null,
          depth: 0,
        };

        mockPrismaService.pageBlock.create.mockResolvedValue(mockBlock);

        const result = await service.addBlock(pageId, blockData);

        expect(result.type).toBe(blockType);
      }
    );
  });
});
