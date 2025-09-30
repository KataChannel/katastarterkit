import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreatePageInput, 
  UpdatePageInput, 
  PageFiltersInput, 
  BulkUpdateBlockOrderInput,
  CreatePageBlockInput,
  UpdatePageBlockInput
} from '../graphql/inputs/page.input';
import { Page, PageBlock, PaginatedPages, PagePaginationInfo, PageStatus } from '../graphql/models/page.model';
import { PaginationInput } from '../graphql/models/pagination.model';

@Injectable()
export class PageService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new page
  async create(input: CreatePageInput, userId: string): Promise<Page> {
    // Check if slug already exists
    const existingPage = await this.prisma.page.findUnique({
      where: { slug: input.slug }
    });

    if (existingPage) {
      throw new ConflictException(`Page with slug "${input.slug}" already exists`);
    }

    const { blocks, ...pageData } = input;
    
    const page = await this.prisma.page.create({
      data: {
        ...pageData,
        createdBy: userId,
        blocks: blocks ? {
          create: blocks.map((block, index) => ({
            ...block,
            order: block.order ?? index,
          }))
        } : undefined
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return page as Page;
  }

  // Find many pages with filters and pagination
  async findMany(
    pagination: PaginationInput = { page: 1, limit: 10 },
    filters?: PageFiltersInput
  ): Promise<PaginatedPages> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (filters?.title) {
      where.title = { contains: filters.title, mode: 'insensitive' };
    }
    
    if (filters?.slug) {
      where.slug = { contains: filters.slug, mode: 'insensitive' };
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.createdBy) {
      where.createdBy = filters.createdBy;
    }

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          blocks: {
            where: { isVisible: true },
            orderBy: { order: 'asc' }
          }
        }
      }),
      this.prisma.page.count({ where })
    ]);

    return {
      items: pages as Page[],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
      }
    };
  }

  // Find page by ID
  async findById(id: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!page) {
      throw new NotFoundException(`Page with ID "${id}" not found`);
    }

    return page as Page;
  }

  // Find page by slug
  async findBySlug(slug: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: {
        blocks: {
          where: { isVisible: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!page) {
      throw new NotFoundException(`Page with slug "${slug}" not found`);
    }

    return page as Page;
  }

  // Update page
  async update(id: string, input: UpdatePageInput, userId: string): Promise<Page> {
    const existingPage = await this.prisma.page.findUnique({
      where: { id },
      include: { blocks: true }
    });

    if (!existingPage) {
      throw new NotFoundException(`Page with ID "${id}" not found`);
    }

    // Check slug uniqueness if updating slug
    if (input.slug && input.slug !== existingPage.slug) {
      const slugExists = await this.prisma.page.findUnique({
        where: { slug: input.slug }
      });

      if (slugExists) {
        throw new ConflictException(`Page with slug "${input.slug}" already exists`);
      }
    }

    const { blocks, ...pageData } = input;

    // Handle blocks update if provided
    let blocksUpdate = {};
    if (blocks) {
      // Delete existing blocks and create new ones
      blocksUpdate = {
        blocks: {
          deleteMany: {},
          create: blocks
            .filter(block => !block.id) // Only new blocks
            .map((block, index) => ({
              type: block.type!,
              content: block.content!,
              style: block.style,
              order: block.order ?? index,
              isVisible: block.isVisible ?? true
            }))
        }
      };

      // Update existing blocks
      const existingBlocksUpdate = blocks
        .filter(block => block.id)
        .map(block => 
          this.prisma.pageBlock.update({
            where: { id: block.id! },
            data: {
              type: block.type,
              content: block.content,
              style: block.style,
              order: block.order,
              isVisible: block.isVisible
            }
          })
        );

      await Promise.all(existingBlocksUpdate);
    }

    const updatedPage = await this.prisma.page.update({
      where: { id },
      data: {
        ...pageData,
        updatedBy: userId,
        publishedAt: input.status === 'PUBLISHED' && existingPage.status !== 'PUBLISHED' 
          ? new Date() 
          : existingPage.publishedAt,
        ...blocksUpdate
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return updatedPage as Page;
  }

  // Delete page
  async delete(id: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: { blocks: true }
    });

    if (!page) {
      throw new NotFoundException(`Page with ID "${id}" not found`);
    }

    const deletedPage = await this.prisma.page.delete({
      where: { id },
      include: { blocks: true }
    });

    return deletedPage as Page;
  }

  // Add block to page
  async addBlock(pageId: string, input: CreatePageBlockInput): Promise<PageBlock> {
    const page = await this.prisma.page.findUnique({
      where: { id: pageId }
    });

    if (!page) {
      throw new NotFoundException(`Page with ID "${pageId}" not found`);
    }

    const block = await this.prisma.pageBlock.create({
      data: {
        ...input,
        pageId
      }
    });

    return block as PageBlock;
  }

  // Update block
  async updateBlock(id: string, input: UpdatePageBlockInput): Promise<PageBlock> {
    const existingBlock = await this.prisma.pageBlock.findUnique({
      where: { id }
    });

    if (!existingBlock) {
      throw new NotFoundException(`Block with ID "${id}" not found`);
    }

    const updatedBlock = await this.prisma.pageBlock.update({
      where: { id },
      data: input
    });

    return updatedBlock as PageBlock;
  }

  // Delete block
  async deleteBlock(id: string): Promise<PageBlock> {
    const block = await this.prisma.pageBlock.findUnique({
      where: { id }
    });

    if (!block) {
      throw new NotFoundException(`Block with ID "${id}" not found`);
    }

    const deletedBlock = await this.prisma.pageBlock.delete({
      where: { id }
    });

    return deletedBlock as PageBlock;
  }

  // Bulk update block order (for drag and drop)
  async updateBlocksOrder(pageId: string, updates: BulkUpdateBlockOrderInput[]): Promise<PageBlock[]> {
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      include: { blocks: true }
    });

    if (!page) {
      throw new NotFoundException(`Page with ID "${pageId}" not found`);
    }

    // Update all blocks in a transaction
    const updatePromises = updates.map(update => 
      this.prisma.pageBlock.update({
        where: { id: update.id },
        data: { order: update.order }
      })
    );

    const updatedBlocks = await Promise.all(updatePromises);
    return updatedBlocks as PageBlock[];
  }

  // Get published pages for public access
  async findPublished(pagination?: PaginationInput): Promise<PaginatedPages> {
    return this.findMany(pagination, { status: PageStatus.PUBLISHED });
  }

  // Duplicate page
  async duplicate(id: string, userId: string, newTitle?: string, newSlug?: string): Promise<Page> {
    const originalPage = await this.findById(id);

    const duplicatedPage = await this.create({
      title: newTitle || `${originalPage.title} (Copy)`,
      slug: newSlug || `${originalPage.slug}-copy-${Date.now()}`,
      description: originalPage.description,
      content: originalPage.content,
      status: PageStatus.DRAFT, // Always create as draft
      seoTitle: originalPage.seoTitle,
      seoDescription: originalPage.seoDescription,
      ogImage: originalPage.ogImage,
      blocks: originalPage.blocks.map(block => ({
        type: block.type,
        content: block.content,
        style: block.style,
        order: block.order,
        isVisible: block.isVisible
      }))
    }, userId);

    return duplicatedPage;
  }
}