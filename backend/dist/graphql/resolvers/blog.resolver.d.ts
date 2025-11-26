import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    isPublished(blog: any): boolean;
    thumbnailUrl(blog: any): string | null;
    bannerUrl(blog: any): string | null;
    metaKeywords(blog: any): string[] | null;
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string, statusFilter?: string): Promise<{
        items: {
            tags: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            }[];
            author: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                email: string;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                thumbnail: string | null;
                order: number;
                isActive: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
            };
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            featuredImage: string | null;
            images: string[];
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            viewCount: number;
            publishedAt: Date | null;
            isFeatured: boolean;
            isPinned: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            commentsEnabled: boolean;
            readingTime: number | null;
            categoryId: string | null;
            authorId: string;
            password: string | null;
            displayOrder: number;
            scheduledAt: Date | null;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlog(id: string): Promise<{
        tags: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            description: string | null;
            color: string | null;
        }[];
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            description: string | null;
            color: string | null;
        }[];
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: {
            tags: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            }[];
            author: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                email: string;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                thumbnail: string | null;
                order: number;
                isActive: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
            };
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            featuredImage: string | null;
            images: string[];
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            viewCount: number;
            publishedAt: Date | null;
            isFeatured: boolean;
            isPinned: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            commentsEnabled: boolean;
            readingTime: number | null;
            categoryId: string | null;
            authorId: string;
            password: string | null;
            displayOrder: number;
            scheduledAt: Date | null;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(blogId: string, limit?: number): Promise<({
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    })[]>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        description: string | null;
        color: string | null;
    })[]>;
    createBlog(input: CreateBlogInput, context: any): Promise<{
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    updateCategory(id: string, input: UpdateBlogCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        description: string | null;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        description: string | null;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
}
