import { Resolver, Query, Mutation, Args, ID, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BlogService } from '../../services/blog.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  BlogType,
  PaginatedBlogs,
  BlogCategoryType,
  BlogTagType,
} from '../types/blog.type';
import {
  CreateBlogInput,
  UpdateBlogInput,
  GetBlogsInput,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
  CreateBlogTagInput,
  UpdateBlogTagInput,
} from '../inputs/blog.input';

@Resolver(() => BlogType)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  // ============================================================================
  // BLOG QUERIES
  // ============================================================================

  @Query(() => PaginatedBlogs, { name: 'blogs' })
  async getBlogs(@Args('page', { type: () => Int, nullable: true }) page?: number,
                  @Args('limit', { type: () => Int, nullable: true }) limit?: number,
                  @Args('search', { nullable: true }) search?: string,
                  @Args('categoryId', { type: () => ID, nullable: true }) categoryId?: string,
                  @Args('sort', { nullable: true }) sort?: string) {
    return this.blogService.getBlogs({
      page,
      limit,
      search,
      categoryId,
      sort,
    });
  }

  @Query(() => BlogType, { name: 'blog' })
  async getBlog(@Args('id', { type: () => ID }) id: string) {
    return this.blogService.getBlogById(id);
  }

  @Query(() => BlogType, { name: 'blogBySlug' })
  async getBlogBySlug(@Args('slug') slug: string) {
    return this.blogService.getBlogBySlug(slug);
  }

  @Query(() => [BlogType], { name: 'featuredBlogs' })
  async getFeaturedBlogs(@Args('limit', { type: () => Int, nullable: true }) limit?: number) {
    return this.blogService.getFeaturedBlogs(limit);
  }

  @Query(() => PaginatedBlogs, { name: 'blogsByCategory' })
  async getBlogsByCategory(
    @Args('categoryId', { type: () => ID }) categoryId: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.blogService.getBlogsByCategory(categoryId, { page, limit });
  }

  @Query(() => [BlogType], { name: 'relatedBlogs' })
  async getRelatedBlogs(
    @Args('blogId', { type: () => ID }) blogId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.blogService.getRelatedBlogs(blogId, limit);
  }

  @Query(() => [BlogCategoryType], { name: 'blogCategories' })
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Query(() => BlogCategoryType, { name: 'blogCategory' })
  async getCategory(@Args('id', { type: () => ID }) id: string) {
    return this.blogService.getCategoryById(id);
  }

  @Query(() => [BlogTagType], { name: 'blogTags' })
  async getTags() {
    return this.blogService.getTags();
  }

  // ============================================================================
  // BLOG MUTATIONS
  // ============================================================================

  @Mutation(() => BlogType, { name: 'createBlog' })
  @UseGuards(JwtAuthGuard)
  async createBlog(@Args('input') input: CreateBlogInput, @Context() context: any) {
    const userId = context.req?.user?.id || input.author;
    return this.blogService.createBlog(input, userId);
  }

  @Mutation(() => BlogType, { name: 'updateBlog' })
  @UseGuards(JwtAuthGuard)
  async updateBlog(@Args('input') input: UpdateBlogInput) {
    const { id, ...updateData } = input;
    return this.blogService.updateBlog(id, updateData);
  }

  @Mutation(() => Boolean, { name: 'deleteBlog' })
  @UseGuards(JwtAuthGuard)
  async deleteBlog(@Args('id', { type: () => ID }) id: string) {
    return this.blogService.deleteBlog(id);
  }

  // ============================================================================
  // CATEGORY MUTATIONS
  // ============================================================================

  @Mutation(() => BlogCategoryType, { name: 'createBlogCategory' })
  @UseGuards(JwtAuthGuard)
  async createCategory(@Args('input') input: CreateBlogCategoryInput) {
    return this.blogService.createCategory(input);
  }

  @Mutation(() => BlogCategoryType, { name: 'updateBlogCategory' })
  @UseGuards(JwtAuthGuard)
  async updateCategory(@Args('input') input: UpdateBlogCategoryInput) {
    const { id, ...updateData } = input;
    return this.blogService.updateCategory(id, updateData);
  }

  @Mutation(() => Boolean, { name: 'deleteBlogCategory' })
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    return this.blogService.deleteCategory(id);
  }

  // ============================================================================
  // TAG MUTATIONS
  // ============================================================================

  @Mutation(() => BlogTagType, { name: 'createBlogTag' })
  @UseGuards(JwtAuthGuard)
  async createTag(@Args('input') input: CreateBlogTagInput) {
    return this.blogService.createTag(input);
  }

  @Mutation(() => BlogTagType, { name: 'updateBlogTag' })
  @UseGuards(JwtAuthGuard)
  async updateTag(@Args('input') input: UpdateBlogTagInput) {
    const { id, ...updateData } = input;
    return this.blogService.updateTag(id, updateData);
  }

  @Mutation(() => Boolean, { name: 'deleteBlogTag' })
  @UseGuards(JwtAuthGuard)
  async deleteTag(@Args('id', { type: () => ID }) id: string) {
    return this.blogService.deleteTag(id);
  }
}
