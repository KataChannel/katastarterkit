import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            }[];
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                order: number;
                thumbnail: string | null;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PostStatus;
            password: string | null;
            content: string;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            isFeatured: boolean;
            displayOrder: number;
            viewCount: number;
            publishedAt: Date | null;
            images: string[];
            title: string;
            isPinned: boolean;
            excerpt: string | null;
            authorId: string;
            featuredImage: string | null;
            canonicalUrl: string | null;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            readingTime: number | null;
            commentsEnabled: boolean;
            scheduledAt: Date | null;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlogById(id: string): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            slug: string;
            color: string | null;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            slug: string;
            color: string | null;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(id: string, input: any): Promise<{
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    createCategory(input: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    updateCategory(id: string, input: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    createTag(input: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    getBlogsByCategory(categoryId: string, input?: any): Promise<{
        items: {
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            }[];
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                order: number;
                thumbnail: string | null;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PostStatus;
            password: string | null;
            content: string;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            isFeatured: boolean;
            displayOrder: number;
            viewCount: number;
            publishedAt: Date | null;
            images: string[];
            title: string;
            isPinned: boolean;
            excerpt: string | null;
            authorId: string;
            featuredImage: string | null;
            canonicalUrl: string | null;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            readingTime: number | null;
            commentsEnabled: boolean;
            scheduledAt: Date | null;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(blogId: string, limit?: number): Promise<({
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
}
