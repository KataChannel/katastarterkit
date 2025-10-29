import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: any;
        total: any;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlog(id: string): Promise<any>;
    getBlogBySlug(slug: string): Promise<any>;
    getFeaturedBlogs(limit?: number): Promise<any>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: any;
        total: any;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(categoryId: string, excludeBlogId: string, limit?: number): Promise<any>;
    getCategories(): Promise<{
        postCount: any;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        thumbnail: string | null;
        parentId: string | null;
        order: number;
        metaTitle: string | null;
        metaDescription: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: any;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        thumbnail: string | null;
        parentId: string | null;
        order: number;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }[]>;
    createBlog(input: CreateBlogInput): Promise<any>;
    updateBlog(input: UpdateBlogInput): Promise<any>;
    deleteBlog(id: string): Promise<boolean>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        thumbnail: string | null;
        parentId: string | null;
        order: number;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        thumbnail: string | null;
        parentId: string | null;
        order: number;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    deleteCategory(id: string): Promise<boolean>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<boolean>;
}
