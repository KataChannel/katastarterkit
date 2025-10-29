import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogInput, UpdateBlogInput, GetBlogsInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../graphql/inputs/blog.input';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input: GetBlogsInput): Promise<{
        items: any;
        total: any;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlogById(id: string): Promise<any>;
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
    createBlog(input: CreateBlogInput): Promise<any>;
    updateBlog(input: UpdateBlogInput): Promise<any>;
    deleteBlog(id: string): Promise<boolean>;
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
    getCategoryById(id: string): Promise<{
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
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }[]>;
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
