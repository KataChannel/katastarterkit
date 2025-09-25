import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface BulkOperationResult<T> {
  success: boolean;
  count: number;
  data?: T[];
  errors?: Array<{
    index: number;
    error: string;
    data?: any;
  }>;
}

export interface DynamicFilterInput {
  where?: any;
  orderBy?: any;
  skip?: number;
  take?: number;
  select?: any;
  include?: any;
}

export interface BulkCreateInput<T> {
  data: T[];
  skipDuplicates?: boolean;
}

export interface BulkUpdateInput<T> {
  where: any;
  data: Partial<T>;
}

export interface BulkDeleteInput {
  where: any;
}

@Injectable()
export class DynamicCRUDService {
  // Simple in-memory cache for frequently accessed data
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  constructor(private readonly prisma: PrismaService) {}

  // Generic method to get Prisma delegate for any model
  private getModelDelegate(modelName: string): any {
    const delegate = (this.prisma as any)[modelName];
    if (!delegate) {
      throw new BadRequestException(`Model ${modelName} not found`);
    }
    return delegate;
  }

  // Simple caching mechanism
  private getCacheKey(modelName: string, id: string): string {
    return `${modelName}:${id}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.CACHE_TTL
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private clearModelCache(modelName: string): void {
    for (const [key] of this.cache) {
      if (key.startsWith(`${modelName}:`)) {
        this.cache.delete(key);
      }
    }
  }

  // CREATE - Single record
  async create<T>(
    modelName: string, 
    data: any, 
    options?: { select?: any; include?: any }
  ): Promise<T> {
    try {
      const delegate = this.getModelDelegate(modelName);
      const result = await delegate.create({
        data,
        ...options
      });
      
      // Clear cache for this model
      this.clearModelCache(modelName);
      
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Record with unique constraint already exists`);
        }
      }
      throw new BadRequestException(`Failed to create ${modelName}: ${error.message}`);
    }
  }

  // CREATE BULK - Multiple records
  async createBulk<T>(
    modelName: string, 
    input: BulkCreateInput<T>,
    options?: { select?: any; include?: any }
  ): Promise<BulkOperationResult<T>> {
    const delegate = this.getModelDelegate(modelName);
    const results: T[] = [];
    const errors: Array<{ index: number; error: string; data?: any }> = [];

    // Use transaction for better performance and consistency
    try {
      await this.prisma.$transaction(async (tx) => {
        // Batch create for better performance
        if (input.skipDuplicates) {
          const result = await (tx as any)[modelName].createMany({
            data: input.data,
            skipDuplicates: true,
          });
          
          // If we need the created records, fetch them
          if (options?.select || options?.include) {
            const created = await (tx as any)[modelName].findMany({
              where: {
                // This is tricky - we need a way to identify the newly created records
                // This would need to be customized based on your data structure
              },
              ...options
            });
            results.push(...created);
          }
        } else {
          // Individual creates for error handling and returning data
          for (let i = 0; i < input.data.length; i++) {
            try {
              const result = await (tx as any)[modelName].create({
                data: input.data[i],
                ...options
              });
              results.push(result);
            } catch (error) {
              errors.push({
                index: i,
                error: error.message,
                data: input.data[i]
              });
            }
          }
        }
      });

      // Clear cache
      this.clearModelCache(modelName);

      return {
        success: errors.length === 0,
        count: results.length,
        data: results,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      throw new BadRequestException(`Bulk create failed for ${modelName}: ${error.message}`);
    }
  }

  // READ - Single record by ID with caching
  async findById<T>(
    modelName: string,
    id: string,
    options?: { select?: any; include?: any }
  ): Promise<T | null> {
    // Try cache first for simple queries
    if (!options?.select && !options?.include) {
      const cacheKey = this.getCacheKey(modelName, id);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const delegate = this.getModelDelegate(modelName);
    const result = await delegate.findUnique({
      where: { id },
      ...options
    });

    // Cache simple queries
    if (result && !options?.select && !options?.include) {
      const cacheKey = this.getCacheKey(modelName, id);
      this.setCache(cacheKey, result);
    }

    return result;
  }

  // Enhanced findMany with unified input (supports both old DynamicFilterInput and new unified input)
  async findMany<T>(
    modelName: string,
    input?: DynamicFilterInput | {
      where?: any;
      orderBy?: any;
      skip?: number;
      take?: number;
      select?: any;
      include?: any;
    }
  ): Promise<T[]> {
    try {
      const delegate = this.getModelDelegate(modelName);
      return await delegate.findMany({
        where: input?.where,
        orderBy: input?.orderBy,
        skip: input?.skip,
        take: input?.take,
        select: input?.select,
        include: input?.include
      });
    } catch (error) {
      throw new BadRequestException(`Failed to find many ${modelName}: ${error.message}`);
    }
  }

  // READ ALL with pagination metadata
  async findManyWithMeta<T>(
    modelName: string,
    filter?: DynamicFilterInput
  ): Promise<{
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      const page = filter?.skip ? Math.floor(filter.skip / (filter.take || 10)) + 1 : 1;
      const limit = filter?.take || 10;
      
      const [data, total] = await Promise.all([
        delegate.findMany({
          where: filter?.where,
          orderBy: filter?.orderBy,
          skip: filter?.skip,
          take: filter?.take,
          select: filter?.select,
          include: filter?.include
        }),
        delegate.count({
          where: filter?.where
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch ${modelName} with meta: ${error.message}`);
    }
  }

  // UPDATE - Single record
  async update<T>(
    modelName: string,
    id: string,
    data: any,
    options?: { select?: any; include?: any }
  ): Promise<T> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      // Check if record exists
      const exists = await delegate.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException(`${modelName} with ID ${id} not found`);
      }

      const result = await delegate.update({
        where: { id },
        data,
        ...options
      });

      // Clear cache
      this.clearModelCache(modelName);
      
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update ${modelName}: ${error.message}`);
    }
  }

  // UPDATE BULK - Multiple records by condition
  async updateBulk<T>(
    modelName: string,
    input: BulkUpdateInput<T>,
    options?: { select?: any; include?: any }
  ): Promise<BulkOperationResult<T>> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      // Get records that will be updated (for returning data)
      let updatedRecords: T[] = [];
      
      if (options?.select || options?.include) {
        // First, get the records that match the condition
        const recordsToUpdate = await delegate.findMany({
          where: input.where
        });

        if (recordsToUpdate.length === 0) {
          return {
            success: true,
            count: 0,
            data: []
          };
        }

        // Update each record individually to get the updated data
        updatedRecords = await Promise.all(
          recordsToUpdate.map((record: any) =>
            delegate.update({
              where: { id: record.id },
              data: input.data,
              ...options
            })
          )
        );
      } else {
        // Use updateMany for better performance when we don't need returned data
        const result = await delegate.updateMany({
          where: input.where,
          data: input.data
        });
      }

      // Clear cache
      this.clearModelCache(modelName);

      return {
        success: true,
        count: updatedRecords.length || 0,
        data: updatedRecords.length > 0 ? updatedRecords : undefined
      };
    } catch (error) {
      throw new BadRequestException(`Bulk update failed for ${modelName}: ${error.message}`);
    }
  }

  // DELETE - Single record
  async delete<T>(
    modelName: string,
    id: string,
    options?: { select?: any; include?: any }
  ): Promise<T> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      // Check if record exists
      const exists = await delegate.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException(`${modelName} with ID ${id} not found`);
      }

      const result = await delegate.delete({
        where: { id },
        ...options
      });

      // Clear cache
      this.clearModelCache(modelName);
      
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete ${modelName}: ${error.message}`);
    }
  }

  // DELETE BULK - Multiple records by condition
  async deleteBulk<T>(
    modelName: string,
    input: BulkDeleteInput,
    options?: { select?: any; include?: any }
  ): Promise<BulkOperationResult<T>> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      let deletedRecords: T[] = [];
      
      if (options?.select || options?.include) {
        // First, get the records that will be deleted
        const recordsToDelete = await delegate.findMany({
          where: input.where,
          ...options
        });

        if (recordsToDelete.length === 0) {
          return {
            success: true,
            count: 0,
            data: []
          };
        }

        // Delete each record individually to get the deleted data
        deletedRecords = await Promise.all(
          recordsToDelete.map((record: any) =>
            delegate.delete({
              where: { id: record.id },
              ...options
            })
          )
        );
      } else {
        // Use deleteMany for better performance
        const result = await delegate.deleteMany({
          where: input.where
        });
      }

      // Clear cache
      this.clearModelCache(modelName);

      return {
        success: true,
        count: deletedRecords.length || 0,
        data: deletedRecords.length > 0 ? deletedRecords : undefined
      };
    } catch (error) {
      throw new BadRequestException(`Bulk delete failed for ${modelName}: ${error.message}`);
    }
  }

  // COUNT - Get count of records
  async count(modelName: string, where?: any): Promise<number> {
    try {
      const delegate = this.getModelDelegate(modelName);
      return await delegate.count({ where });
    } catch (error) {
      throw new BadRequestException(`Failed to count ${modelName}: ${error.message}`);
    }
  }

  // EXISTS - Check if record exists
  async exists(modelName: string, where: any): Promise<boolean> {
    try {
      const delegate = this.getModelDelegate(modelName);
      const record = await delegate.findFirst({ where });
      return !!record;
    } catch (error) {
      throw new BadRequestException(`Failed to check existence for ${modelName}: ${error.message}`);
    }
  }

  // UPSERT - Create or Update
  async upsert<T>(
    modelName: string,
    where: any,
    create: any,
    update: any,
    options?: { select?: any; include?: any }
  ): Promise<T> {
    try {
      const delegate = this.getModelDelegate(modelName);
      const result = await delegate.upsert({
        where,
        create,
        update,
        ...options
      });

      // Clear cache
      this.clearModelCache(modelName);
      
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to upsert ${modelName}: ${error.message}`);
    }
  }

  // Paginated findMany
  async findManyPaginated<T>(
    modelName: string,
    input?: {
      where?: any;
      orderBy?: any;
      page?: number;
      limit?: number;
      select?: any;
      include?: any;
    }
  ): Promise<{
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      const delegate = this.getModelDelegate(modelName);
      const page = input?.page || 1;
      const limit = input?.limit || 10;
      const skip = (page - 1) * limit;

      // Get total count
      const total = await delegate.count({
        where: input?.where
      });

      // Get data
      const data = await delegate.findMany({
        where: input?.where,
        orderBy: input?.orderBy,
        skip,
        take: limit,
        select: input?.select,
        include: input?.include
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to find paginated ${modelName}: ${error.message}`);
    }
  }

  // Bulk create with enhanced options
  async bulkCreate<T>(
    modelName: string,
    data: any[],
    options?: {
      skipDuplicates?: boolean;
      select?: any;
      include?: any;
    }
  ): Promise<BulkOperationResult<T>> {
    try {
      const delegate = this.getModelDelegate(modelName);
      const results: T[] = [];
      const errors: Array<{ index: number; error: string; data?: any }> = [];

      // Use createMany for better performance if no select/include needed
      if (!options?.select && !options?.include) {
        try {
          const result = await delegate.createMany({
            data,
            skipDuplicates: options?.skipDuplicates || false
          });

          this.clearModelCache(modelName);

          return {
            success: true,
            count: result.count,
            data: undefined, // createMany doesn't return data
            errors: undefined
          };
        } catch (error) {
          // Fall back to individual creates if createMany fails
        }
      }

      // Individual creates for when we need select/include or createMany fails
      for (let i = 0; i < data.length; i++) {
        try {
          const result = await delegate.create({
            data: data[i],
            select: options?.select,
            include: options?.include
          });
          results.push(result);
        } catch (error) {
          errors.push({
            index: i,
            error: error.message,
            data: data[i]
          });
        }
      }

      this.clearModelCache(modelName);

      return {
        success: errors.length === 0,
        count: results.length,
        data: results,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      throw new BadRequestException(`Bulk create failed for ${modelName}: ${error.message}`);
    }
  }

  // Bulk update
  async bulkUpdate<T>(
    modelName: string,
    where: any,
    data: any,
    options?: {
      select?: any;
      include?: any;
    }
  ): Promise<BulkOperationResult<T>> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      // Use updateMany for better performance if no select/include needed
      if (!options?.select && !options?.include) {
        const result = await delegate.updateMany({
          where,
          data
        });

        this.clearModelCache(modelName);

        return {
          success: true,
          count: result.count,
          data: undefined, // updateMany doesn't return data
          errors: undefined
        };
      }

      // Individual updates for when we need select/include
      const recordsToUpdate = await delegate.findMany({ where });
      const results: T[] = [];
      const errors: Array<{ index: number; error: string; data?: any }> = [];

      for (let i = 0; i < recordsToUpdate.length; i++) {
        try {
          const result = await delegate.update({
            where: { id: recordsToUpdate[i].id },
            data,
            select: options?.select,
            include: options?.include
          });
          results.push(result);
        } catch (error) {
          errors.push({
            index: i,
            error: error.message,
            data: recordsToUpdate[i]
          });
        }
      }

      this.clearModelCache(modelName);

      return {
        success: errors.length === 0,
        count: results.length,
        data: results,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      throw new BadRequestException(`Bulk update failed for ${modelName}: ${error.message}`);
    }
  }

  // Bulk delete
  async bulkDelete<T>(
    modelName: string,
    where: any,
    options?: {
      select?: any;
      include?: any;
    }
  ): Promise<BulkOperationResult<T>> {
    try {
      const delegate = this.getModelDelegate(modelName);
      
      // Get records before deletion if select/include needed
      let recordsToDelete: T[] = [];
      if (options?.select || options?.include) {
        recordsToDelete = await delegate.findMany({
          where,
          select: options?.select,
          include: options?.include
        });
      }

      // Perform bulk delete
      const result = await delegate.deleteMany({ where });

      this.clearModelCache(modelName);

      return {
        success: true,
        count: result.count,
        data: recordsToDelete.length > 0 ? recordsToDelete : undefined,
        errors: undefined
      };
    } catch (error) {
      throw new BadRequestException(`Bulk delete failed for ${modelName}: ${error.message}`);
    }
  }
}
