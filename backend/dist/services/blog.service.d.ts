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
        order: number;
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: any;
        order: number;
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        slug: string;
        parentId: string | null;
        description: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    deleteCategory(id: string): Promise<boolean>;
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
    }[]>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<boolean>;
}
