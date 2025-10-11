import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductNormalizationService } from './product-normalization.service';

/**
 * GraphQL Resolver for Product Normalization
 * 
 * Exposes fuzzy matching functionality via GraphQL API
 * 
 * Example Queries:
 * 
 * query FindSimilarProducts {
 *   findSimilarProducts(searchText: "main asus i7", threshold: 0.6) {
 *     id
 *     ten
 *     ten2
 *     ma
 *     similarityScore
 *   }
 * }
 * 
 * mutation NormalizeProducts {
 *   normalizeProducts(threshold: 0.6) {
 *     updated
 *     skipped
 *     errors
 *   }
 * }
 */

@Resolver()
@UseGuards(JwtAuthGuard)
export class ProductNormalizationResolver {
  constructor(
    private readonly normalizationService: ProductNormalizationService,
  ) {}

  @Query(() => [SimilarProduct], {
    description: 'Find products similar to search text using fuzzy matching',
  })
  async findSimilarProducts(
    @Args('searchText', { type: () => String }) searchText: string,
    @Args('threshold', {
      type: () => Number,
      defaultValue: 0.3,
      description: 'Similarity threshold (0.0-1.0)',
    })
    threshold: number,
  ): Promise<SimilarProduct[]> {
    const results = await this.normalizationService.findSimilarProducts(
      searchText,
      threshold,
    );

    return results.map((r) => ({
      id: r.id,
      ten: r.ten,
      ten2: r.ten2,
      ma: r.ma,
      similarityScore: r.similarity_score,
    }));
  }

  @Query(() => String, {
    nullable: true,
    description: 'Find canonical (normalized) name for a product',
  })
  async findCanonicalName(
    @Args('productName', { type: () => String }) productName: string,
    @Args('threshold', {
      type: () => Number,
      defaultValue: 0.6,
    })
    threshold: number,
  ): Promise<string | null> {
    return this.normalizationService.findCanonicalName(
      productName,
      threshold,
    );
  }

  @Query(() => String, {
    description: 'Normalize a product name',
  })
  async normalizeProductName(
    @Args('productName', { type: () => String }) productName: string,
    @Args('threshold', {
      type: () => Number,
      defaultValue: 0.6,
    })
    threshold: number,
  ): Promise<string> {
    return this.normalizationService.normalizeProductName(
      productName,
      threshold,
    );
  }

  @Query(() => [ProductGroup], {
    description: 'Get product groups by normalized name (ten2)',
  })
  async getProductGroups(
    @Args('minGroupSize', {
      type: () => Number,
      defaultValue: 2,
      description: 'Minimum products per group',
    })
    minGroupSize: number,
  ): Promise<ProductGroup[]> {
    return this.normalizationService.getProductGroups(minGroupSize);
  }

  @Query(() => [DuplicateGroup], {
    description: 'Find duplicate products (same ten2)',
  })
  async findDuplicates(): Promise<DuplicateGroup[]> {
    return this.normalizationService.findDuplicates();
  }

  @Query(() => Number, {
    description: 'Test similarity between two strings',
  })
  async testSimilarity(
    @Args('text1', { type: () => String }) text1: string,
    @Args('text2', { type: () => String }) text2: string,
  ): Promise<number> {
    return this.normalizationService.testSimilarity(text1, text2);
  }

  @Mutation(() => NormalizationStats, {
    description: 'Batch normalize products',
  })
  async normalizeProducts(
    @Args('productIds', {
      type: () => [String],
      nullable: true,
      description: 'Optional: specific product IDs to normalize',
    })
    productIds?: string[],
    @Args('threshold', {
      type: () => Number,
      defaultValue: 0.6,
    })
    threshold?: number,
  ): Promise<NormalizationStats> {
    return this.normalizationService.batchNormalize(productIds, threshold);
  }

  @Mutation(() => Number, {
    description: 'Merge duplicate products (keep one, delete rest)',
  })
  async mergeDuplicates(
    @Args('ten2', {
      type: () => String,
      description: 'Normalized name of products to merge',
    })
    ten2: string,
    @Args('keepId', {
      type: () => String,
      nullable: true,
      description: 'Optional: ID of product to keep',
    })
    keepId?: string,
  ): Promise<number> {
    return this.normalizationService.mergeDuplicates(ten2, keepId);
  }
}

// GraphQL Types

class SimilarProduct {
  id: string;
  ten: string;
  ten2: string | null;
  ma: string | null;
  similarityScore: number;
}

class ProductGroup {
  ten2: string;
  count: number;
  products: ProductSummary[];
}

class ProductSummary {
  id: string;
  ten: string;
  ma: string | null;
  dgia: any;
}

class DuplicateGroup {
  ten2: string;
  count: number;
  productIds: string[];
}

class NormalizationStats {
  updated: number;
  skipped: number;
  errors: number;
}
