import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            }[];
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            category: {
                id: string;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                parentId: string | null;
                thumbnail: string | null;
                order: number;
            };
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            content: string;
            authorId: string;
            categoryId: string | null;
            featuredImage: string | null;
            images: string[];
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            password: string | null;
            isFeatured: boolean;
            isPinned: boolean;
            displayOrder: number;
            viewCount: number;
            readingTime: number | null;
            commentsEnabled: boolean;
            publishedAt: Date | null;
            scheduledAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
            slug: string;
            createdAt: Date;
            name: string;
            description: string | null;
            color: string | null;
        }[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            slug: string;
            createdAt: Date;
            name: string;
            description: string | null;
            color: string | null;
        }[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        tags: ({
            tag: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateBlog(id: string, input: any): Promise<{
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        tags: ({
            tag: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }>;
    createCategory(input: any): Promise<{
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }>;
    updateCategory(id: string, input: any): Promise<{
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
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
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
        color: string | null;
    }>;
    createTag(input: any): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    getBlogsByCategory(categoryId: string, input?: any): Promise<{
        items: {
            tags: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            }[];
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            category: {
                id: string;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                parentId: string | null;
                thumbnail: string | null;
                order: number;
            };
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            content: string;
            authorId: string;
            categoryId: string | null;
            featuredImage: string | null;
            images: string[];
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            password: string | null;
            isFeatured: boolean;
            isPinned: boolean;
            displayOrder: number;
            viewCount: number;
            readingTime: number | null;
            commentsEnabled: boolean;
            publishedAt: Date | null;
            scheduledAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        tags: ({
            tag: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
