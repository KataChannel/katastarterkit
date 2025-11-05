import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: any;
        total: any;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlog(id: string): Promise<any>;
    getBlogBySlug(slug: string): Promise<any>;
    getFeaturedBlogs(limit?: number): Promise<any>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: any;
        total: any;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(blogId: string, limit?: number): Promise<any>;
    getCategories(): Promise<any>;
    getCategory(id: string): Promise<any>;
    getTags(): Promise<any>;
    createBlog(input: CreateBlogInput, context: any): Promise<any>;
    updateBlog(input: UpdateBlogInput): Promise<any>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<any>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<any>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(input: CreateBlogTagInput): Promise<any>;
    updateTag(input: UpdateBlogTagInput): Promise<any>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
}
