import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: any;
        total: any;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlogById(id: string): Promise<any>;
    getBlogBySlug(slug: string): Promise<any>;
    getFeaturedBlogs(limit?: number): Promise<any>;
    getRecentBlogs(limit?: number): Promise<any>;
    createBlog(input: any, userId: string): Promise<any>;
    updateBlog(id: string, input: any): Promise<any>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<any>;
    getCategoryById(id: string): Promise<any>;
    createCategory(input: any): Promise<any>;
    updateCategory(id: string, input: any): Promise<any>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    getTags(): Promise<any>;
    getTagById(id: string): Promise<any>;
    createTag(input: any): Promise<any>;
    updateTag(id: string, input: any): Promise<any>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    getBlogsByCategory(categoryId: string, input?: any): Promise<{
        items: any;
        total: any;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(blogId: string, limit?: number): Promise<any>;
}
